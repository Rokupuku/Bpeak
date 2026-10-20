import { NavLink, useLocation } from 'react-router-dom'

const items = [
  {
    to: '/mates',
    label: '공강 메이트',
    match: (path: string) => path.startsWith('/mates'),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/timetable',
    label: '시간표',
    match: (path: string) => path.startsWith('/timetable'),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    to: '/chats',
    label: '채팅',
    match: (path: string) => path.startsWith('/chat'),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 5.5h14A1.5 1.5 0 0 1 20.5 7v8A1.5 1.5 0 0 1 19 16.5H9.2L5 20v-3.5H5A1.5 1.5 0 0 1 3.5 15V7A1.5 1.5 0 0 1 5 5.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/analysis',
    label: '외모 분석',
    match: (path: string) => path.startsWith('/analysis'),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 4 14.4 9.6 20.5 10.2 15.8 14.4 17.2 20.4 12 17.4 6.8 20.4 8.2 14.4 3.5 10.2 9.6 9.6 12 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: '마이',
    match: (path: string) => path.startsWith('/profile') || path.startsWith('/notifications'),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7.6 17.2c1.2-1.6 2.7-2.4 4.4-2.4s3.2.8 4.4 2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="bottom-nav" aria-label="하단 메뉴">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={() => `nav-item${item.match(location.pathname) ? ' active' : ''}`}
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
