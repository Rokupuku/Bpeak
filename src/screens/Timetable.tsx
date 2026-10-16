import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { BottomNav } from '../components/BottomNav'
import { Header } from '../components/Header'
import { useAppState } from '../context/AppState'
import { DAYS, HOURS } from '../data'
import { rangesFromSlots, slotId } from '../timetable'
import type { HourSlot } from '../types'

export function Timetable() {
  const navigate = useNavigate()
  const { snapshot, toggleSlot } = useAppState()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const ranges = rangesFromSlots(snapshot.selectedSlots)

  const save = async () => {
    setBusy(true)
    setError('')
    try {
      await api.saveTimetable({ slots: snapshot.selectedSlots })
      navigate('/mates')
    } catch (err) {
      setError(err instanceof Error ? err.message : '시간표를 저장하지 못했습니다.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="screen">
      <Header backTo="/auth" />
      <div className="screen-scroll">
        <p className="kicker">STEP 02 · 시간표</p>
        <h1 className="page-title sm">
          공강 시간을
          <br />
          알려주세요
        </h1>
        <p className="lede">강의가 있는 칸을 탭하면 서버가 공강 시간대를 자동으로 계산합니다.</p>

        <div className="timetable-grid">
          <div className="grid-head">
            <span />
            {DAYS.map((day) => (
              <span key={day.key}>{day.label}</span>
            ))}
          </div>
          {HOURS.map((hour) => (
            <div className="grid-row" key={hour}>
              <div className="hour">{hour}:00</div>
              {DAYS.map((day) => {
                const id = slotId(day.key, hour as HourSlot)
                const on = snapshot.selectedSlots.includes(id)
                return (
                  <button
                    key={id}
                    type="button"
                    className={`cell${on ? ' on' : ''}`}
                    aria-pressed={on}
                    aria-label={`${day.label} ${hour}시 공강`}
                    onClick={() => toggleSlot(id)}
                  />
                )
              })}
            </div>
          ))}
        </div>

        <div className="legend">
          <span>
            <i className="lecture" />
            강의 등록
          </span>
          <span>
            <i className="empty" />
            공강 후보
          </span>
        </div>

        <div className="week-card">
          <h3>이번 주 공강</h3>
          <div className="chips">
            {ranges.length ? (
              ranges.map((range) => (
                <span className="chip" key={range.label}>
                  {range.label}
                </span>
              ))
            ) : (
              <span className="chip gray">선택한 공강이 없습니다</span>
            )}
          </div>
        </div>
        {error ? <p className="error">{error}</p> : null}
      </div>
      <div className="sticky-cta">
        <button className="btn btn-primary" type="button" disabled={busy} onClick={save}>
          시간표 저장하고 다음
        </button>
      </div>
      <BottomNav />
    </section>
  )
}
