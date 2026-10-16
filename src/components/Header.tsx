import { useNavigate } from 'react-router-dom'
import { Logo } from './Logo'

export function Header({ backTo, showProfile = true }: { backTo?: string; showProfile?: boolean }) {
  const navigate = useNavigate()

  return (
    <header className="topbar">
      <button
        className="icon-btn"
        type="button"
        aria-label="뒤로 가기"
        onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="topbar-title">
        <Logo />
        Bpeak
      </div>
      {showProfile ? (
        <button className="top-link" type="button" onClick={() => navigate('/profile')}>
          내 정보
        </button>
      ) : (
        <span />
      )}
    </header>
  )
}
