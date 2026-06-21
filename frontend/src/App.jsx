import { useState } from 'react'
import AuditForm from './components/AuditForm'
import ScoreGrid from './components/ScoreGrid'
import IssueList from './components/IssueList'
import AIChat from './components/AIChat'
import ExportBar from './components/ExportBar'
import './App.css'

const TABS = ['SEO', 'Performance', 'Security', 'Bugs', 'AI Chat']
const TAB_KEYS = ['seo', 'performance', 'security', 'bugs', 'ai']

const STEPS = [
  'Checking SEO tags & structure...',
  'Analyzing meta & headings...',
  'Scanning performance signals...',
  'Checking security headers...',
  'Detecting code bugs...',
  'Running AI analysis...',
  'Preparing report...',
]

export default function App() {
  const [auditData, setAuditData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stepMsg, setStepMsg] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [error, setError] = useState('')

  const sleep = ms => new Promise(r => setTimeout(r, ms))

  async function runAudit(url) {
    setError('')
    setAuditData(null)
    setLoading(true)
    setProgress(0)
    setActiveTab(0)

    for (let i = 0; i < STEPS.length; i++) {
      setStepMsg(STEPS[i])
      setProgress(Math.round(((i + 1) / STEPS.length) * 90))
      await sleep(400)
    }

    const prompt = `You are a professional website SEO and technical auditor. Analyze: ${url}

Return ONLY raw JSON (no markdown, no explanation):
{
  "scores": {"seo": 0, "performance": 0, "security": 0, "bugs": 0},
  "seo": [{"type":"critical|warning|info|pass","title":"string","desc":"string","fix":"string"}],
  "performance": [{"type":"critical|warning|info|pass","title":"string","desc":"string","fix":"string"}],
  "security": [{"type":"critical|warning|info|pass","title":"string","desc":"string","fix":"string"}],
  "bugs": [{"type":"critical|warning|info|pass","title":"string","desc":"string","fix":"string"}],
  "summary": "2-3 sentence executive overview."
}
Include 4-6 items per category. Scores 0-100. Be specific and realistic.`

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      })
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()
      const raw = data.content.map(b => b.text || '').join('').trim()
      const clean = raw.replace(/^```json\s*/i,'').replace(/^```/,'').replace(/```$/,'').trim()
      const parsed = JSON.parse(clean)
      parsed.url = url
      parsed.date = new Date().toLocaleDateString('en-GB')
      setProgress(100)
      await sleep(300)
      setAuditData(parsed)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="layout">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="logo">⚡ IA Audit Pro</div>
          <div className="logo-sub">AI-powered website auditor</div>
        </div>
      </header>

      <main className="main">
        <AuditForm onAudit={runAudit} loading={loading} />

        {loading && (
          <div className="loading-card">
            <p className="step-msg">{stepMsg}</p>
            <div className="prog-track">
              <div className="prog-fill" style={{ width: progress + '%' }} />
            </div>
            <p className="prog-pct">{progress}%</p>
          </div>
        )}

        {error && (
          <div className="error-card">
            ⚠️ {error}
          </div>
        )}

        {auditData && (
          <>
            <ExportBar data={auditData} />
            <ScoreGrid scores={auditData.scores} />
            <div className="tabs">
              {TABS.map((t, i) => (
                <button
                  key={t}
                  className={`tab${activeTab === i ? ' active' : ''}`}
                  onClick={() => setActiveTab(i)}
                >{t}</button>
              ))}
            </div>
            <div className="tab-content">
              {activeTab < 4
                ? <IssueList items={auditData[TAB_KEYS[activeTab]]} />
                : <AIChat data={auditData} />
              }
            </div>
          </>
        )}

        {!auditData && !loading && !error && (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <p>Enter your website URL above to start the audit</p>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Built with IA Audit Pro · Powered by Claude AI</p>
      </footer>
    </div>
  )
}
