import { useNavigate } from 'react-router-dom'

export function Landing() {
  const navigate = useNavigate()

  return (
    <section className="screen landing">
      <div className="screen-scroll">
        <p className="kicker">BPEAK CAMPUS</p>
        <h1 className="page-title">
          가장 편리한
          <br />
          공강 아지트
        </h1>
        <p className="lede">
          같은 학교, 비슷한 공강 시간대의 사람과
          <br />
          부담 없이 함께할 메이트를 찾아보세요.
        </p>
        <div className="core-card">
          <small>CORE</small>
          <strong>공강이 겹치는 사람부터</strong>
          <p>시간표 → 공강 계산 → 메이트 탐색까지 한 흐름으로.</p>
        </div>
      </div>
      <div className="landing-actions">
        <button className="btn btn-primary" type="button" onClick={() => navigate('/auth')}>
          학교 이메일로 시작하기
        </button>
        <button className="btn btn-ghost" type="button" onClick={() => navigate('/mates')}>
          둘러보기
        </button>
      </div>
    </section>
  )
}
