import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { Header } from '../components/Header'
import { useAppState } from '../context/AppState'
import { MOCK_MATES, SEED_CHAT } from '../data'
import type { ChatMessage } from '../types'

function seedMessages(mateId: string): ChatMessage[] {
  return (SEED_CHAT[mateId] ?? []).map((item, index) => ({
    id: `${mateId}-seed-${index}`,
    mateId,
    from: item.from,
    text: item.text,
    sentAt: '',
  }))
}

export function Chat() {
  const { mateId = '' } = useParams()
  const navigate = useNavigate()
  const { openChat } = useAppState()
  const mate = MOCK_MATES.find((item) => item.id === mateId)
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(() => seedMessages(mateId))

  useEffect(() => {
    if (!mate) {
      navigate('/mates', { replace: true })
      return
    }
    openChat(mateId)
    void api.listMessages(mateId).then(setMessages)
  }, [mate, mateId, navigate, openChat])

  const send = async () => {
    const value = text.trim()
    if (!value) return
    setText('')
    const message = await api.sendMessage(mateId, { text: value })
    setMessages((prev) => [...prev, message])
  }

  if (!mate) return null

  return (
    <section className="screen chat-screen">
      <Header backTo="/chats" />
      <div className="chat-head">
        <p className="kicker">MATCHED · {mate.mbti}</p>
        <h1 className="page-title sm">{mate.displayName}님과 대화</h1>
      </div>
      <div className="chat-list">
        {messages.map((message) => (
          <div className={`bubble ${message.from}`} key={message.id}>
            {message.text}
          </div>
        ))}
      </div>
      <form
        className="composer"
        onSubmit={(event) => {
          event.preventDefault()
          void send()
        }}
      >
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="메시지를 입력하세요"
          aria-label="메시지"
        />
        <button className="send" type="submit" aria-label="보내기">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 19V5M12 5l-7 7M12 5l7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </section>
  )
}
