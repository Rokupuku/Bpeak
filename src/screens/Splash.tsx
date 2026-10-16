import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'

export function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => navigate('/welcome', { replace: true }), 1600)
    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <section className="screen splash">
      <Logo variant="splash" />
      <h1>Bpeak</h1>
      <p>공강을 연결하고, 캠퍼스를 더 가깝게</p>
      <div className="splash-bar" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}
