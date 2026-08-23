import { useState } from 'react'
import { Plus, Trash2, Download, Sparkles } from 'lucide-react'
import { Panel, Button, Field, inputClass } from '../components/common/UI.jsx'
import { generateResume } from '../services/aiService.js'
import { useApp } from '../context/AppContext.jsx'

const emptyExp = () => ({ id: crypto.randomUUID(), title: '', company: '', dates: '', bullets: [''] })
const emptyEdu = () => ({ id: crypto.randomUUID(), degree: '', school: '', year: '' })

export default function ResumeBuilderPage() {
  const { state, setState, touchStreak } = useApp()
  const [form, setForm] = useState({
    name: state.profile.name, role: state.profile.role, summary: '',
    experience: [emptyExp()], education: [emptyEdu()], skills: []
  })
  const [skillInput, setSkillInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const updateExp = (id, k, v) => setForm(f => ({ ...f, experience: f.experience.map(e => e.id === id ? { ...e, [k]: v } : e) }))
  const updateBullet = (id, idx, v) => setForm(f => ({
    ...f, experience: f.experience.map(e => e.id === id ? { ...e, bullets: e.bullets.map((b, i) => i === idx ? v : b) } : e)
  }))

  async function handleGenerate() {
    setLoading(true)
    try {
      const result = await generateResume({ ...form, skills: form.skills })
      setOutput(result)
      setState(s => ({ ...s, resumes: [...s.resumes, { id: crypto.randomUUID(), createdAt: Date.now(), content: result }] }))
      touchStreak()
    } finally {
      setLoading(false)
    }
  }

  function downloadTxt() {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.name || 'resume'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <p className="mono-tick text-xs text-signal uppercase tracking-widest mb-2">Module 01</p>
      <h1 className="font-display text-3xl font-semibold mb-8">Resume Builder</h1>

      <div className="grid grid-cols-2 gap-6 items-start">
        <Panel title="Your details">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name"><input className={inputClass} value={form.name} onChange={e => update('name', e.target.value)} /></Field>
            <Field label="Target role"><input className={inputClass} value={form.role} onChange={e => update('role', e.target.value)} /></Field>
          </div>
          <Field label="Summary">
            <textarea className={inputClass} rows={3} value={form.summary} onChange={e => update('summary', e.target.value)} placeholder="Two lines on who you are and the impact you drive" />
          </Field>

          <p className="text-xs mono-tick text-muted uppercase tracking-wider mb-2 mt-6">Experience</p>
          {form.experience.map(e => (
            <div key={e.id} className="border border-line rounded-lg p-3 mb-3">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input className={inputClass} placeholder="Title" value={e.title} onChange={ev => updateExp(e.id, 'title', ev.target.value)} />
                <input className={inputClass} placeholder="Company" value={e.company} onChange={ev => updateExp(e.id, 'company', ev.target.value)} />
              </div>
              <input className={inputClass + ' mb-2'} placeholder="Dates (e.g. Jun 2025 – Present)" value={e.dates} onChange={ev => updateExp(e.id, 'dates', ev.target.value)} />
              {e.bullets.map((b, i) => (
                <input key={i} className={inputClass + ' mb-2'} placeholder="Impact bullet — start with an action verb" value={b} onChange={ev => updateBullet(e.id, i, ev.target.value)} />
              ))}
              <button className="text-xs text-signal" onClick={() => updateExp(e.id, 'bullets', [...e.bullets, ''])}>+ add bullet</button>
            </div>
          ))}
          <Button variant="secondary" onClick={() => update('experience', [...form.experience, emptyExp()])}>
            <Plus size={14} /> Add role
          </Button>

          <p className="text-xs mono-tick text-muted uppercase tracking-wider mb-2 mt-6">Skills</p>
          <div className="flex gap-2 mb-2">
            <input className={inputClass} placeholder="e.g. Python" value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && skillInput.trim()) { update('skills', [...form.skills, skillInput.trim()]); setSkillInput('') } }} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {form.skills.map((s, i) => (
              <span key={i} className="text-xs bg-surface2 border border-line rounded-full px-2 py-0.5 flex items-center gap-1">
                {s}
                <button onClick={() => update('skills', form.skills.filter((_, idx) => idx !== i))}><Trash2 size={10} /></button>
              </span>
            ))}
          </div>

          <Button className="mt-6 w-full" onClick={handleGenerate} disabled={loading}>
            <Sparkles size={16} /> {loading ? 'Drafting…' : 'Generate resume'}
          </Button>
        </Panel>

        <Panel title="Preview" action={output && <Button variant="secondary" onClick={downloadTxt}><Download size={14} /> Download</Button>}>
          {output ? (
            <pre className="whitespace-pre-wrap text-sm text-ink font-body leading-relaxed">{output}</pre>
          ) : (
            <p className="text-sm text-muted">Fill in your details and generate to see a draft here.</p>
          )}
        </Panel>
      </div>
    </div>
  )
}
