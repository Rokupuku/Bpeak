# Bpeak Backend Spec

이 문서는 **백엔드 전용**입니다. 프론트 코드나 Mock 구현을 읽지 않아도 서버를 만들 수 있게, 필요한 계약을 이 파일 하나에 모아 두었습니다.

- 제품: Bpeak (비피크) — 같은 학교 공강 시간대로 캠퍼스 메이트를 연결
- API base: `http://localhost:8080/api/v1`
- 프론트 개발 서버: `http://localhost:5174` (CORS 허용)
- 권장 스택: **Java / Spring Boot API** + **PostgreSQL** + **Redis(OTP)** + **Python ML 서비스** + **비공개 파일 저장소**

프론트는 `VITE_USE_MOCK=false`, `VITE_API_BASE_URL=http://localhost:8080/api/v1` 로 이 계약을 호출합니다.

---

## 1. 시스템 경계

```
브라우저 (React)
    │  HTTPS / JSON
    ▼
Java API  (인증, 프로필, 시간표, 매칭, 채팅, 분석 잡 생성/조회)
    ├─ PostgreSQL
    ├─ Redis          OTP, 재발송 제한
    ├─ SMTP           *@bu.ac.kr 인증 메일
    ├─ Object Storage 분석 사진 (비공개)
    └─ HTTP
         ▼
      Python ML 서비스  (사진 → 점수 JSON)
```

Java API만 브라우저에 노출합니다. Python ML과 저장소 URL은 외부에 열지 않습니다.

---

## 2. 공통 규칙

### 2.1 HTTP

| 항목 | 값 |
| --- | --- |
| Content-Type | `application/json` (파일 업로드만 `multipart/form-data`) |
| 인증 | `Authorization: Bearer <accessToken>` |
| 시간 | ISO-8601 UTC, 예: `2026-10-16T12:00:00Z` |
| ID | 문자열, 서버가 발급 |

인증이 필요한 엔드포인트에 토큰이 없으면 `401`.

### 2.2 CORS

개발: `http://localhost:5174`  
운영: 프론트 배포 도메인만 허용. `Authorization` 헤더 허용.

### 2.3 에러 본문

모든 4xx/5xx는 아래 형식만 사용합니다.

```json
{
  "code": "INVALID_EMAIL",
  "message": "이메일 형식은 *@bu.ac.kr 만 허용됩니다."
}
```

권장 코드:

| code | HTTP | 언제 |
| --- | --- | --- |
| `INVALID_EMAIL` | 400 | 도메인이 `bu.ac.kr`이 아님 |
| `INVALID_CODE` | 400 | OTP 불일치/만료 |
| `RESEND_TOO_SOON` | 429 | 재발송 60초 미경과 |
| `UNAUTHORIZED` | 401 | 토큰 없음/만료 |
| `NOT_FOUND` | 404 | 사용자·메이트·잡 없음 |
| `FORBIDDEN` | 403 | 타인 리소스 접근 |
| `RATE_LIMITED` | 429 | OTP·채팅 남용 |
| `ANALYSIS_FAILED` | 500 | ML 실패를 사용자에게 감싼 경우. 잡 조회는 200 + `status: "failed"` 권장 |

존재하지 않는 이메일로 OTP를 요청해도, 계정 존재 여부가 드러나지 않게 **성공 응답 형식은 같게** 둡니다.

### 2.4 헬스체크

`GET /health` — 인증 없음.

```json
{ "status": "ok" }
```

---

## 3. 도메인 모델

### 3.1 시간표 슬롯

슬롯 ID: `{day}-{hour}`

- `day`: `mon` `tue` `wed` `thu` `fri`
- `hour`: `9` ~ `15` (그 시각부터 1시간. `13` = 13:00–14:00)

예: `mon-13`, `wed-10`

연속된 칸은 서버가 구간으로 묶습니다.

- 입력: `["mon-13","mon-14"]`
- 출력: `{ "day": "mon", "start": 13, "end": 15, "label": "월 13-15시" }`
- `emptyHours` = 슬롯 개수 (구간 길이가 아님). `mon-13`,`mon-14` → `2`

요일 한글 라벨: 월/화/수/목/금.

### 3.2 매칭 우선순위

화면 카피와 동일하게 고정합니다.

1. 겹친 공강 시간 (핵심, 정렬 1순위)
2. 학교 인증 여부
3. 활동 선호 / 관심사
4. 외모 분석 점수는 **보조 지표만**. 이 값만으로 순위를 바꾸지 않음

`matchPercent`는 0–100 정수. 겹친 시간 비율을 기본으로 하고, 인증·태그를 소폭 가산합니다.

`overlapLabel` 예: `"공강 겹침 13-15시"`

### 3.3 테이블 초안

```
users
  id, email unique, given_name, display_name, major, year,
  mate_tag, verified_at, created_at

timetable_slots
  user_id, day, hour
  unique (user_id, day, hour)

user_preferences
  user_id, tag          -- 예: 카페, 공부, 산책, 게임

otp_codes
  email, code_hash, expires_at, resend_available_at, consumed_at

beauty_reports
  id, user_id, job_id, status,  -- pending | done | failed
  total, stars, skin_tone, face_shape, smile, style,
  photo_object_key, created_at, finished_at

chat_threads
  id, user_a, user_b, created_at
  unique unordered pair

chat_messages
  id, thread_id, sender_id, body, sent_at

notification_settings
  user_id, match_alert, chat_alert, analysis_alert
```

분석 원본 사진은 DB에 바이너리로 넣지 말고 object storage key만 저장합니다. 다른 사용자 API 응답에 사진 URL을 넣지 않습니다.

---

## 4. 인증

학교 웹메일 OTP만 사용합니다. 비밀번호 로그인은 없습니다.

허용 도메인: **`bu.ac.kr`** (로컬 파트는 자유, 예: `student@bu.ac.kr`)  
코드: 숫자 6자리  
유효시간: 600초  
재발송: 60초  
저장: 평문 금지, 해시만. Redis TTL 권장.

### `POST /auth/email/send`

인증: 없음

요청:

```json
{ "email": "student@bu.ac.kr" }
```

응답 `200`:

```json
{ "expiresInSec": 600, "resendAfterSec": 60 }
```

### `POST /auth/email/verify`

인증: 없음

요청:

```json
{ "email": "student@bu.ac.kr", "code": "123456" }
```

응답 `200`:

```json
{
  "accessToken": "jwt",
  "profile": {
    "id": "u_01",
    "givenName": "김",
    "displayName": "사용자",
    "email": "student@bu.ac.kr",
    "verified": true,
    "emptyHours": 0,
    "mateTag": "공부 메이트"
  }
}
```

- 최초 검증이면 `users`를 생성하고 `verified_at`을 채웁니다.
- JWT에는 `sub = user.id`만 넣고 만료(권장 7일)를 둡니다.
- `givenName`은 이메일의 로컬 파트나 별도 온보딩이 오기 전까지 표시용 한글 성/이니셜이어도 됩니다. 프론트 프로토타입은 `"김"`을 씁니다.

---

## 5. 내 정보

모두 Bearer 필요.

### `GET /me`

응답: 위 `profile`과 동일.

`emptyHours`는 현재 저장된 슬롯 수입니다.

### `PATCH /me`

요청 (있는 필드만):

```json
{ "displayName": "사용자", "mateTag": "공부 메이트", "givenName": "김" }
```

응답: 갱신된 `profile`.

### `PUT /me/timetable`

요청:

```json
{ "slots": ["mon-13", "mon-14", "wed-10", "wed-11", "wed-12"] }
```

- 잘못된 슬롯 ID는 `400`
- 기존 슬롯은 통째로 교체

응답:

```json
{
  "emptyHours": 5,
  "ranges": [
    { "day": "mon", "start": 13, "end": 15, "label": "월 13-15시" },
    { "day": "wed", "start": 10, "end": 13, "label": "수 10-13시" }
  ]
}
```

### `PATCH /me/notifications`

요청/응답:

```json
{ "matchAlert": true, "chatAlert": true, "analysisAlert": false }
```

없으면 기본값 `matchAlert=true`, `chatAlert=true`, `analysisAlert=false`.

---

## 6. 공강 메이트

Bearer 필요. 본인 시간표가 있어야 의미 있는 결과를 줄 수 있습니다. 없으면 빈 배열 `[]`.

### `GET /matches`

응답:

```json
{
  "mates": [
    {
      "id": "u_minsu",
      "givenName": "민",
      "displayName": "민수",
      "major": "컴퓨터공학",
      "year": 3,
      "matchPercent": 92,
      "overlapLabel": "공강 겹침 13-15시",
      "tags": ["카페 / 공부", "학교 인증"]
    }
  ]
}
```

규칙:

- 본인은 목록에서 제외
- 학교 미인증 사용자는 후순위 또는 제외 (프로토타입 카드는 모두 `"학교 인증"` 태그)
- `tags`는 활동 선호 1개 + 인증 여부 정도면 충분
- `year`는 학년 정수

### `POST /matches/{mateId}/chat-requests`

상대와 스레드가 없으면 만들고, 있으면 기존 `chatId`를 반환합니다.

응답:

```json
{
  "chatId": "th_01",
  "mate": {
    "id": "u_minsu",
    "givenName": "민",
    "displayName": "민수",
    "major": "컴퓨터공학",
    "year": 3,
    "matchPercent": 92,
    "overlapLabel": "공강 겹침 13-15시",
    "tags": ["카페 / 공부", "학교 인증"]
  }
}
```

프론트 프로토타입은 `chatId`와 `mateId`를 같게 쓰고 있습니다. 서버는 **스레드 id를 따로** 발급해도 됩니다. 그 경우 프론트 경로를 `/chats/{chatId}`에 맞추면 됩니다. 1차 연동을 쉽게 하려면 `chatId == mateId`로 시작해도 됩니다.

---

## 7. 채팅

Bearer 필요. 1차는 REST. 실시간은 이후 `WebSocket /ws/chats/{chatId}`.

경로의 `{mateId}`는 1차에서 상대 user id로 둡니다. 스레드 id로 바꾸면 프론트와 함께 수정합니다.

### `GET /chats/{mateId}/messages`

응답: 메시지 배열. 시간 오름차순.

```json
[
  {
    "id": "m_01",
    "mateId": "u_minsu",
    "from": "mate",
    "text": "안녕하세요! 월요일 13시 공강 겹치네요 :)",
    "sentAt": "2026-10-16T12:00:00Z"
  }
]
```

`from`은 **요청자 기준**입니다.

- 내가 보낸 것: `"me"`
- 상대가 보낸 것: `"mate"`

DB에는 `sender_id`를 저장하고 응답할 때만 `me`/`mate`로 변환합니다.

### `POST /chats/{mateId}/messages`

요청:

```json
{ "text": "학교 카페 어때요?" }
```

응답 `201`: 방금 저장한 메시지 객체. `from`은 `"me"`.

빈 문자열, 과도한 길이는 `400`.

---

## 8. 외모 분석

화면 카피: **Java API → Python ML 서비스 → 분석 결과 DB 저장**.

점수는 메이트 탐색의 보조 정보입니다. `/matches` 정렬 1순위로 쓰지 않습니다.

### `POST /analysis`

Bearer 필요. `multipart/form-data`, 필드명 `photo`.  
파일이 없어도 잡을 만들 수 있으나, 운영에서는 파일을 필수로 두는 것을 권장합니다.

응답 `202`:

```json
{ "jobId": "job_01" }
```

처리:

1. 사진을 비공개 버킷에 저장
2. `beauty_reports.status = pending`
3. Python ML을 동기 또는 비동기 호출
4. 완료 시 점수 컬럼 채우고 `status = done`

### `GET /analysis/{jobId}`

본인 잡만 조회.

```json
{
  "status": "pending",
  "report": null
}
```

완료:

```json
{
  "status": "done",
  "report": {
    "total": 88,
    "stars": 4,
    "skinTone": 90,
    "faceShape": 85,
    "smile": 86,
    "style": 87
  }
}
```

실패:

```json
{
  "status": "failed",
  "report": null,
  "message": "사진을 분석하지 못했습니다."
}
```

`stars`는 `total`을 20점 단위로 나눈 1–5 정수여도 됩니다. 프로토타입은 `total=88` → `stars=4`.

### `GET /analysis/latest`

로그인한 사용자의 가장 최근 `done` 리포트. 없으면 `404` 또는 `200` + `report: null` (프론트는 latest를 아직 안 부르므로 둘 다 가능, **404 권장**).

### Python ML 내부 계약 (Java → Python, 비공개)

`POST {ML_BASE}/analyze`  
`multipart/form-data` `photo`

응답:

```json
{
  "skinTone": 90,
  "faceShape": 85,
  "smile": 86,
  "style": 87,
  "total": 88
}
```

`total`은 네 점수의 평균을 반올림해도 됩니다. Python이 얼굴 미검출이면 4xx를 주고, Java는 잡을 `failed`로 표시합니다.

---

## 9. 타입 요약 (응답 필드명 고정)

프론트가 기대하는 JSON 키는 아래와 같습니다. 이름을 바꾸면 프론트와 함께 수정해야 합니다.

```
UserProfile
  id, givenName, displayName, email, verified, emptyHours, mateTag

EmptyRange
  day, start, end, label

Mate
  id, givenName, displayName, major, year, matchPercent, overlapLabel, tags[]

ChatMessage
  id, mateId, from, text, sentAt

BeautyReport
  total, stars, skinTone, faceShape, smile, style

NotificationSettings
  matchAlert, chatAlert, analysisAlert
```

---

## 10. 구현 순서

한 PR/이슈로 쪼개기 좋은 단위입니다.

| 순서 | 작업 | 완료 기준 |
| --- | --- | --- |
| 1 | Spring 기동, `GET /health`, CORS | 프론트가 5174에서 API에 닿음 |
| 2 | OTP 발송/검증, JWT, `users` | `example@bu.ac.kr`로 코드 수신·로그인 |
| 3 | `GET/PATCH /me`, `PUT /me/timetable` | 슬롯 저장 후 `emptyHours`·`ranges` 일치 |
| 4 | `GET /matches` | 겹친 공강 기준 목록 |
| 5 | 채팅 REST | 요청 → 메시지 조회/전송 |
| 6 | 분석 파이프라인 | 업로드 → pending → done 폴링 |
| 7 | `PATCH /me/notifications` | 설정 저장 |
| 8 | (이후) WebSocket 채팅, 푸시 | 이 문서 1차 범위 밖 |

---

## 11. 보안

- OTP는 해시 저장, 시도 횟수 제한
- JWT 시크릿은 환경 변수
- 분석 사진은 서명 URL을 쓰더라도 **본인만**, 만료 짧게. 매칭 카드에 사진 넣지 않음
- 다른 사용자 email을 매칭 응답에 넣지 않음
- ML 서버는 내부망만
- 로그에 OTP 평문, 사진, 토큰을 남기지 않음

---

## 12. 로컬 환경 변수 예시

```
SERVER_PORT=8080
CORS_ORIGINS=http://localhost:5174
JWT_SECRET=
MAIL_HOST=
MAIL_USER=
MAIL_PASSWORD=
DATABASE_URL=jdbc:postgresql://localhost:5432/bpeak
REDIS_URL=redis://localhost:6379
ML_BASE_URL=http://localhost:8000
S3_BUCKET=bpeak-private
S3_REGION=
ALLOWED_EMAIL_DOMAIN=bu.ac.kr
OTP_EXPIRES_SEC=600
OTP_RESEND_SEC=60
```

---

## 13. 프론트와 맞춰 볼 때

이 문서는 백엔드 원본입니다. 화면 동작 확인이 필요하면 프론트 저장소의 Mock(`VITE_USE_MOCK=true`)과 비교하되, **필드명·상태코드·에러 본문은 이 문서를 따릅니다.**
