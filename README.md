# Bpeak (비피크)

같은 학교 공강 시간대를 기준으로 캠퍼스 메이트를 연결하는 웹앱입니다. 주색상은 `#14C0FF`입니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5174` 를 엽니다. 현재는 Mock API로 프로토타입 화면이 동작합니다.

학교 인증 데모 코드는 `123456` 입니다. (`*@bu.ac.kr` 메일만 허용)

## 화면

- 스플래시 → 랜딩
- 학교 웹메일 인증
- 주간 공강 시간표
- 공강 메이트
- 외모 분석 / 리포트
- 채팅
- 내 프로필 / 알림 설정

## 백엔드 연동

프론트를 실제 API에 붙이려면 `.env`를 만듭니다.

```
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

백엔드 계약은 프론트 문서와 분리해 두었습니다.

→ [docs/backend/Bpeak-Backend-Spec.md](docs/backend/Bpeak-Backend-Spec.md)
