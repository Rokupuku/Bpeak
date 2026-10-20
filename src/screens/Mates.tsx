import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { BottomNav } from '../components/BottomNav'
import { Header } from '../components/Header'
import { useAppState } from '../context/AppState'
import { MOCK_MATES, MBTI_TYPES } from '../data'
import type { Mate, Mbti } from '../types'

export function Mates() {
  const navigate = useNavigate()
  const { snapshot, setPreferredMbtis, openChat } = useAppState()
  const selected = snapshot.preferredMbtis
  const [mates, setMates] = useState<Mate[]>(MOCK_MATES)

  useEffect(() => {
    void api.matches({ mbti: selected }).then((result) => setMates(result.mates))
  }, [selected])

  const toggleFilter = (type: Mbti) => {
    const next = selected.includes(type) ? selected.filter((item) => item !== type) : [...selected, type]
    setPreferredMbtis(next)
    void api.saveProfile({ preferredMbtis: next })
  }

  const requestChat = async (mateId: string) => {
    await api.requestChat(mateId)
    openChat(mateId)
    navigate(`/chat/${mateId}`)
  }

  return (
    <section className="screen">
      <Header backTo="/timetable" />
      <div className="screen-scroll">
        <p className="kicker">BPEAK MATCH</p>
        <div className="row-between">
          <h1 className="page-title sm" style={{ marginBottom: 6 }}>
            공강 메이트
          </h1>
          <span className="badge-count">{mates.length}명 추천</span>
        </div>
        <p className="lede">이번 주 공강이 겹치는 사람을 찾았어요. 원하는 MBTI로 골라볼 수 있어요.</p>

        <div className="filter-card">
          <div className="row-between" style={{ marginBottom: 10 }}>
            <strong>원하는 MBTI</strong>
            <button
              className="text-link"
              type="button"
              onClick={() => {
                setPreferredMbtis([])
                void api.saveProfile({ preferredMbtis: [] })
              }}
            >
              전체
            </button>
          </div>
          <div className="mbti-grid">
            {MBTI_TYPES.map((type) => {
              const on = selected.includes(type)
              return (
                <button
                  key={type}
                  type="button"
                  className={`mbti-chip${on ? ' on' : ''}`}
                  aria-pressed={on}
                  onClick={() => toggleFilter(type)}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </div>

        {mates.length === 0 ? (
          <p className="empty-note">선택한 MBTI와 공강이 겹치는 메이트가 없어요.</p>
        ) : (
          mates.map((mate) => (
            <article className="mate-card" key={mate.id}>
              <div className="mate-main">
                <div className="avatar">{mate.givenName}</div>
                <div style={{ flex: 1 }}>
                  <div className="row-between">
                    <div>
                      <div className="mate-name">{mate.displayName}</div>
                      <div className="mate-sub">
                        {mate.major} · {mate.year}학년
                      </div>
                    </div>
                    <div className="match">{mate.matchPercent}% 일치</div>
                  </div>
                </div>
              </div>
              <div className="tags">
                <span className="pill accent">{mate.mbti}</span>
                <span className="pill">{mate.overlapLabel}</span>
                {mate.tags.map((tag) => (
                  <span className="pill" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <button className="chat-req" type="button" onClick={() => void requestChat(mate.id)}>
                채팅 요청
              </button>
            </article>
          ))
        )}

        <p className="footnote">
          <strong>추천 기준</strong>
          겹친 시간대 공강 / 학교 인증 / 활동 선호 / 원하는 MBTI. 외모 분석은 보조 지표입니다.
        </p>
      </div>
      <BottomNav />
    </section>
  )
}
