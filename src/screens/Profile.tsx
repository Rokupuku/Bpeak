import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { BottomNav } from '../components/BottomNav'
import { Header } from '../components/Header'
import { useAppState } from '../context/AppState'
import { MBTI_TYPES } from '../data'
import type { Mbti } from '../types'

export function Profile() {
  const navigate = useNavigate()
  const { profile, snapshot, setMbti } = useAppState()

  const pickMbti = (type: Mbti) => {
    setMbti(type)
    void api.saveProfile({ mbti: type })
  }

  return (
    <section className="screen">
      <Header backTo="/mates" />
      <div className="screen-scroll">
        <p className="kicker">MY BPEAK</p>
        <h1 className="page-title sm">내 프로필</h1>

        <div className="profile-card">
          <div className="who">
            <div className="avatar lg">{profile.givenName}</div>
            <div>
              <b>{profile.displayName}</b>
              <span>{profile.email}</span>
            </div>
          </div>
          <div className="profile-chips">
            <span className="chip gray">{profile.verified ? '학교 인증 완료' : '학교 인증 대기'}</span>
            <span className="chip gray">공강 {profile.emptyHours}시간</span>
            <span className="chip gray">{profile.mateTag}</span>
            <span className="chip gray">{profile.mbti ?? 'MBTI 미설정'}</span>
          </div>
        </div>

        <p className="section-label">내 MBTI</p>
        <div className="menu-card">
          <p className="mbti-help">매칭에서 나를 소개할 유형을 고르세요. 상대가 원하는 MBTI 필터에 사용됩니다.</p>
          <div className="mbti-grid">
            {MBTI_TYPES.map((type) => {
              const on = snapshot.mbti === type
              return (
                <button
                  key={type}
                  type="button"
                  className={`mbti-chip${on ? ' on' : ''}`}
                  aria-pressed={on}
                  onClick={() => pickMbti(type)}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </div>

        <p className="section-label">설정</p>
        <div className="menu-card">
          <button className="menu-item" type="button" onClick={() => navigate('/timetable')}>
            <span className="menu-ico">▦</span>
            시간표 관리
            <span className="chev">›</span>
          </button>
          <button className="menu-item" type="button" onClick={() => navigate('/analysis/report')}>
            <span className="menu-ico">◆</span>
            외모 분석 리포트
            <span className="chev">›</span>
          </button>
          <button className="menu-item" type="button" onClick={() => navigate('/notifications')}>
            <span className="menu-ico">○</span>
            알림 설정
            <span className="chev">›</span>
          </button>
        </div>
      </div>
      <BottomNav />
    </section>
  )
}
