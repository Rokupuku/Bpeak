import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { BottomNav } from '../components/BottomNav'
import { Header } from '../components/Header'
import { MOCK_MATES } from '../data'
import type { Mate } from '../types'

export function Mates() {
  const navigate = useNavigate()
  const [mates, setMates] = useState<Mate[]>(MOCK_MATES)

  useEffect(() => {
    void api.matches().then((result) => setMates(result.mates))
  }, [])

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
        <p className="lede">이번 주 공강이 겹치는 사람을 찾았어요.</p>

        {mates.map((mate) => (
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
              <span className="pill">{mate.overlapLabel}</span>
              {mate.tags.map((tag) => (
                <span className="pill" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <button className="chat-req" type="button" onClick={() => navigate(`/chat/${mate.id}`)}>
              채팅 요청
            </button>
          </article>
        ))}

        <p className="footnote">
          <strong>추천 기준</strong>
          겹친 시간대 공강 / 학교 인증 / 활동 선호. 외모 분석 특성 매칭 조건이 아니라 보조 지표입니다.
        </p>
      </div>
      <BottomNav />
    </section>
  )
}
