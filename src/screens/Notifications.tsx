import { api } from '../api/client'
import { BottomNav } from '../components/BottomNav'
import { Header } from '../components/Header'
import { useAppState } from '../context/AppState'
import type { NotificationSettings } from '../types'

const rows: { key: keyof NotificationSettings; label: string }[] = [
  { key: 'matchAlert', label: '메이트 추천 알림' },
  { key: 'chatAlert', label: '채팅 메시지 알림' },
  { key: 'analysisAlert', label: '분석 완료 알림' },
]

export function Notifications() {
  const { snapshot, setNotifications } = useAppState()

  const toggle = (key: keyof NotificationSettings) => {
    const next = { ...snapshot.notifications, [key]: !snapshot.notifications[key] }
    setNotifications(next)
    void api.saveNotifications(next)
  }

  return (
    <section className="screen">
      <Header backTo="/profile" />
      <div className="screen-scroll">
        <p className="kicker">SETTINGS</p>
        <h1 className="page-title sm">알림 설정</h1>
        <p className="lede">공강 메이트와 채팅, 분석 완료 소식을 받을지 선택하세요.</p>
        <div className="menu-card">
          {rows.map((row) => {
            const on = snapshot.notifications[row.key]
            return (
              <button className="toggle-row" type="button" key={row.key} onClick={() => toggle(row.key)}>
                {row.label}
                <span className={`switch${on ? ' on' : ''}`} aria-checked={on} role="switch">
                  <i />
                </span>
              </button>
            )
          })}
        </div>
      </div>
      <BottomNav />
    </section>
  )
}
