import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { BottomNav } from '../components/BottomNav'
import { Header } from '../components/Header'
import { useAppState } from '../context/AppState'

export function Analysis() {
  const navigate = useNavigate()
  const { markAnalysisDone } = useAppState()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const job = await api.submitAnalysis()
      const result = await api.analysisResult(job.jobId)
      if (!cancelled && result.report) {
        markAnalysisDone(result.report)
        setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [markAnalysisDone])

  return (
    <section className="screen">
      <Header backTo="/mates" />
      <div className="screen-scroll analysis">
        <div className="ring" aria-hidden="true" />
        <p className="kicker">AI ANALYSIS</p>
        <h1 className="page-title sm">사진을 분석하고 있어요</h1>
        <p className="lede">
          얼굴 특성을 분석해 매칭 리포트를 만들고 있습니다.
          <br />
          잠시만 기다려 주세요.
        </p>
        <div className="flow-tags">
          <span>Java API → Python ML 서비스 → 분석 결과 DB 저장 구조를 기준으로 한 프로토타입입니다.</span>
        </div>
      </div>
      <div className="sticky-cta">
        <button className="btn btn-primary" type="button" disabled={!ready} onClick={() => navigate('/analysis/report')}>
          분석 결과 보기
        </button>
      </div>
      <BottomNav />
    </section>
  )
}
