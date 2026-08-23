import { useState } from 'react'
import { Target } from 'lucide-react'
import { Panel, Button, Field, inputClass } from '../components/common/UI.jsx'
import { scoreResume } from '../services/atsService.js'
import { useApp } from '../context/AppContext.jsx'

export default function ATSCheckerPage() {
  const { state, setState, touchStreak } = useApp()
  const [resumeText, setResumeText] = useState(state.resumes[state.resumes.length - 1]?.content || '')
  const [jobTitle, setJobTitle] = useState('')
  const [jd, setJd] = useState('')
  const [result, setResult] = useState(null)

  function handleScore() {
    const r = scoreResume(resumeText, jd)
    setResult(r)
    setState(s => ({ ...s, atsHistory: [...s.atsHistory, { id: crypto.randomUUID(), date: Date.now(), score: r.score, jobTitle }] }))
    touchStreak()
  }

  const scoreColor = s => s >= 75 ? 'text-success' : s >= 50 ? 'text-amber' : 'text-danger'

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <p className="mono-tick text-xs text-signal uppercase tracking-widest mb-2">Module 02</p>
      <h1 className="font-display text-3xl font-semibold mb-8">ATS Score Checker</h1>

      <div className="grid grid-cols-2 gap-6 items-start">
        <Panel title="Paste your materials">
          <Field label="Job title (optional)"><input className={inputClass} value={jobTitle} onChange={e => setJobTitle(e.target.value)} /></Field>
          <Field label="Resume text">
            <textarea className={inputClass} rows={8} value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your resume text here" />
          </Field>
          <Field label="Job description">
            <textarea className={inputClass} rows={6} value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste the job description to score keyword match" />
          </Field>
          <Button className="w-full" onClick={handleScore} disabled={!resumeText.trim()}>
            <Target size={16} /> Score resume
          </Button>
        </Panel>

        <div className="space-y-6">
          <Panel title="Score">
            {result ? (
              <>
                <div className="flex items-baseline gap-2 mb-5">
                  <span className={`font-display text-5xl font-semibold ${scoreColor(result.score)}`}>{result.score}</span>
                  <span className="text-sm text-muted">/ 100</span>
                </div>
                <div className="space-y-3">
                  {result.breakdown.map((b, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-ink">{b.label}</span>
                        <span className="mono-tick text-muted">{b.points}/{b.max}</span>
                      </div>
                      <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
                        <div className="h-full bg-signal" style={{ width: `${(b.points / b.max) * 100}%` }} />
                      </div>
                      <p className="text-xs text-muted mt-1">{b.detail}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted">Run a check to see your score and breakdown.</p>
            )}
          </Panel>

          {state.atsHistory.length > 0 && (
            <Panel title="History">
              <div className="flex items-end gap-2 h-24">
                {state.atsHistory.slice(-12).map(h => (
                  <div key={h.id} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div className="w-full bg-amber rounded-t" style={{ height: `${h.score}%` }} title={`${h.score}`} />
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  )
}
