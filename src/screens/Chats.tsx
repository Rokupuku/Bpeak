import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { BottomNav } from '../components/BottomNav'
import { Header } from '../components/Header'
import { useAppState } from '../context/AppState'
import { MOCK_MATES, SEED_CHAT } from '../data'
import type { ChatThread } from '../types'

export function Chats() {
  const navigate = useNavigate()
  const { snapshot } = useAppState()
  const [threads, setThreads] = useState<ChatThread[]>([])

  useEffect(() => {
    void api.listChats().then(setThreads)
  }, [snapshot.openChats])

  const rows = useMemo(() => {
    const ids = Array.from(new Set([...snapshot.openChats, ...threads.map((item) => item.mateId)]))
    return ids.map((mateId) => {
      const mate = MOCK_MATES.find((item) => item.id === mateId)
      const fromApi = threads.find((item) => item.mateId === mateId)
      const local = snapshot.messagesByMate[mateId]
      const lastLocal = local?.[local.length - 1]
      const seed = SEED_CHAT[mateId]
      const lastSeed = seed?.[seed.length - 1]
      return {
        mateId,
        mate,
        lastText: lastLocal?.text ?? fromApi?.lastText ?? lastSeed?.text ?? '채팅을 시작해 보세요.',
      }
    })
  }, [snapshot.openChats, snapshot.messagesByMate, threads])

  return (
    <section className="screen">
      <Header backTo="/mates" />
      <div className="screen-scroll">
        <p className="kicker">CHAT</p>
        <h1 className="page-title sm">채팅</h1>
        <p className="lede">공강이 겹치는 메이트와 나눈 대화를 이어서 볼 수 있어요.</p>

        {rows.length === 0 ? (
          <p className="empty-note">아직 열린 채팅이 없어요. 메이트에게 채팅을 요청해 보세요.</p>
        ) : (
          rows.map((row) => (
            <button
              key={row.mateId}
              type="button"
              className="chat-row"
              onClick={() => navigate(`/chat/${row.mateId}`)}
            >
              <div className="avatar">{row.mate?.givenName ?? '?'}</div>
              <div className="chat-row-body">
                <div className="row-between">
                  <strong>{row.mate?.displayName ?? '메이트'}</strong>
                  {row.mate ? <span className="pill accent">{row.mate.mbti}</span> : null}
                </div>
                <p>{row.lastText}</p>
              </div>
            </button>
          ))
        )}
      </div>
      <BottomNav />
    </section>
  )
}
