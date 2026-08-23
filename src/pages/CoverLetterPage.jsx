import { useState } from 'react'
import { Sparkles, Download } from 'lucide-react'
import { Panel, Button, Field, inputClass } from '../components/common/UI.jsx'
import { generateCoverLetter } from '../services/aiService.js'
import { useApp } from '../context/AppContext.jsx'

export default function CoverLetterPage() {
  const { setState, touchStreak } = useApp()
  const [form, setForm] = useState({ name: '', company: '', role: '', highlight: '' })
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleGenerate() {
    setLoading(true)
    try {
      const result = await generateCoverLetter(form)
      setOutput(result)
      setState(s => ({ ...s, coverLetters: [...s.coverLetters, { id: crypto.randomUUID(), createdAt: Date.now(), content: result }] }))
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
    a.download = `${form.company || 'cover-letter'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <p className="mono-tick text-xs text-signal uppercase tracking-widest mb-2">Module 01b</p>
      <h1 className="font-display text-3xl font-semibold mb-8">Cover Letter Builder</h1>

      <div className="grid grid-cols-2 gap-6 items-start">
        <Panel title="Prompt">
          <Field label="Your name"><input className={inputClass} value={form.name} onChange={e => update('name', e.target.value)} /></Field>
          <Field label="Company"><input className={inputClass} value={form.company} onChange={e => update('company', e.target.value)} /></Field>
          <Field label="Role"><input className={inputClass} value={form.role} onChange={e => update('role', e.target.value)} /></Field>
          <Field label="What should we highlight?">
            <textarea className={inputClass} rows={4} value={form.highlight} onChange={e => update('highlight', e.target.value)} placeholder="A project, result, or trait that makes you right for this role" />
          </Field>
          <Button className="w-full" onClick={handleGenerate} disabled={loading}>
            <Sparkles size={16} /> {loading ? 'Drafting…' : 'Generate letter'}
          </Button>
        </Panel>

        <Panel title="Preview" action={output && <Button variant="secondary" onClick={downloadTxt}><Download size={14} /> Download</Button>}>
          {output ? (
            <pre className="whitespace-pre-wrap text-sm text-ink leading-relaxed">{output}</pre>
          ) : (
            <p className="text-sm text-muted">Fill in the prompt and generate to see a draft here.</p>
          )}
        </Panel>
      </div>
    </div>
  )
}
