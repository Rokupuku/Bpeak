import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, useMock } from '../api/client'
import { MOCK_OTP_HINT } from '../api/mock'
import { Header } from '../components/Header'
import { useAppState } from '../context/AppState'
import { SCHOOL_DOMAIN } from '../data'

export function Auth() {
  const navigate = useNavigate()
  const { snapshot, setEmail, setAuthStatus } = useAppState()
  const [email, setEmailValue] = useState(snapshot.email || `example@${SCHOOL_DOMAIN}`)
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [expires, setExpires] = useState(600)
  const [resend, setResend] = useState(60)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!sent) return
    const timer = window.setInterval(() => {
      setExpires((value) => Math.max(0, value - 1))
      setResend((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [sent])

  const format = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = String(sec % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  const sendCode = async () => {
    setBusy(true)
    setError('')
    try {
      const result = await api.sendEmailCode({ email })
      setEmail(email)
      setSent(true)
      setExpires(result.expiresInSec)
      setResend(result.resendAfterSec)
    } catch (err) {
      setError(err instanceof Error ? err.message : '코드를 보내지 못했습니다.')
    } finally {
      setBusy(false)
    }
  }

  const verify = async () => {
    setBusy(true)
    setError('')
    try {
      await api.verifyEmailCode({ email, code })
      setAuthStatus('verified')
      navigate('/timetable')
    } catch (err) {
      setError(err instanceof Error ? err.message : '인증에 실패했습니다.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="screen">
      <Header backTo="/welcome" />
      <div className="screen-scroll">
        <p className="kicker">STEP 01 · 학교 인증</p>
        <h1 className="page-title sm">
          학교 웹메일로
          <br />
          안전하게 인증해요
        </h1>
        <p className="lede">Bpeak는 @{SCHOOL_DOMAIN} 학교 계정만 가입할 수 있어요.</p>

        <div className="field">
          <label htmlFor="email">학교 이메일</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmailValue(event.target.value)}
            placeholder={`example@${SCHOOL_DOMAIN}`}
          />
        </div>

        <p className="hint">
          이메일 형식은 *.{SCHOOL_DOMAIN} 만 허용됩니다.
          <br />
          실제 서비스에서는 클릭한 이메일로 서버에서 코드가 발송됩니다.
        </p>

        <div className="field">
          <label htmlFor="code">인증 코드</label>
          <div className="field-row">
            <input
              id="code"
              inputMode="numeric"
              maxLength={6}
              placeholder="6자리 코드"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
            />
            <button className="btn btn-primary btn-inline" type="button" disabled={busy || code.length < 6} onClick={verify}>
              인증
            </button>
          </div>
          <p className="meta">
            유효시간 {format(expires)} · 재발송 {resend}초 후 가능
            {sent && useMock ? ` · 데모 코드 ${MOCK_OTP_HINT}` : ''}
          </p>
          {error ? <p className="error">{error}</p> : null}
        </div>
      </div>
      <div className="sticky-cta">
        <button className="btn btn-primary" type="button" disabled={busy || (sent && resend > 0)} onClick={sendCode}>
          인증 코드 받기
        </button>
        <button
          className="link-btn"
          type="button"
          onClick={() => {
            setAuthStatus('pending')
            navigate('/timetable')
          }}
        >
          나중에 하기
        </button>
      </div>
    </section>
  )
}
