import { useNavigate } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { Header } from '../components/Header'
import { useAppState } from '../context/AppState'
import { MOCK_REPORT } from '../data'

export function Report() {
  const navigate = useNavigate()
  const { snapshot } = useAppState()
  const report = snapshot.report ?? MOCK_REPORT

  return (
    <section className="screen">
      <Header backTo="/analysis" />
      <div className="screen-scroll">
        <p className="kicker">AI BEAUTY ANALYSIS</p>
        <h1 className="page-title sm">외모 분석 리포트</h1>
        <p className="lede">
          공강 메이트 기능을 보조하는 보조 점수입니다. Bpeak의 핵심은 공강 시간대가 맞는 메이트 연결입니다.
        </p>

        <div className="score-card">
          <div className="score-top">
            <div>
              <div className="score-label">종합 분석 점수</div>
              <div className="score-num">
                {report.total}
                <small>/100</small>
              </div>
            </div>
            <div className="stars" aria-label={`${report.stars}점`}>
              {'★'.repeat(report.stars)}
              {'☆'.repeat(5 - report.stars)}
            </div>
          </div>
          <div className="meter">
            <span style={{ width: `${report.total}%` }} />
          </div>
          <div className="metrics">
            <div className="metric">
              <b>{report.skinTone}</b>
              <span>피부 톤</span>
            </div>
            <div className="metric">
              <b>{report.faceShape}</b>
              <span>얼굴형</span>
            </div>
            <div className="metric">
              <b>{report.smile}</b>
              <span>미소 인상</span>
            </div>
            <div className="metric">
              <b>{report.style}</b>
              <span>스타일 인상</span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>메이트 탐색에서 먼저 보는 것</h3>
          <p style={{ color: 'var(--primary)', fontWeight: 800, marginBottom: 10 }}>
            공강 시간 · 활동 선호 · 관심사 · 학교 인증
          </p>
          <p>
            이 분석은 참고용입니다. 사진과 가치나 대화 내용을 직접적으로 가리키지 않습니다. 메이트 탐색의 1순위는 겹친
            공강 시간대와 서로 맞춰줄 관심사입니다.
          </p>
        </div>
      </div>
      <div className="sticky-cta">
        <button className="btn btn-primary" type="button" onClick={() => navigate('/mates')}>
          공강 메이트 찾기
        </button>
      </div>
      <BottomNav />
    </section>
  )
}
