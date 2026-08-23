import { useState, useMemo } from 'react'
import { ListChecks, Sparkles, Trash2 } from 'lucide-react'
import { Panel, Button, Field, inputClass, Badge } from '../components/common/UI.jsx'
import Calendar from '../components/tasks/Calendar.jsx'
import { breakdownTask } from '../services/aiService.js'
import { useApp } from '../context/AppContext.jsx'

export default function TasksPage() {
  const { state, setState, touchStreak } = useApp()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleBreakdown() {
    if (!description.trim()) return
    setLoading(true)
    try {
      const steps = await breakdownTask(description)
      const task = { id: crypto.randomUUID(), title: title || description.slice(0, 40), steps, createdAt: Date.now() }
      setState(s => ({ ...s, tasks: [task, ...s.tasks] }))
      setTitle('')
      setDescription('')
      touchStreak()
    } finally {
      setLoading(false)
    }
  }

  function toggleStep(taskId, stepId) {
    setState(s => ({
      ...s,
      tasks: s.tasks.map(t => t.id !== taskId ? t : {
        ...t, steps: t.steps.map(st => st.id === stepId ? { ...st, done: !st.done } : st)
      })
    }))
    touchStreak()
  }

  function setDue(taskId, stepId, due) {
    setState(s => ({
      ...s,
      tasks: s.tasks.map(t => t.id !== taskId ? t : {
        ...t, steps: t.steps.map(st => st.id === stepId ? { ...st, due } : st)
      })
    }))
  }

  function removeTask(taskId) {
    setState(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== taskId) }))
  }

  const dueDates = useMemo(() => {
    const map = {}
    state.tasks.forEach(t => t.steps.forEach(st => { if (st.due) map[st.due] = true }))
    return map
  }, [state.tasks])

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <p className="mono-tick text-xs text-signal uppercase tracking-widest mb-2">Module 03</p>
      <h1 className="font-display text-3xl font-semibold mb-8">Tasks & Calendar</h1>

      <div className="grid grid-cols-3 gap-6 items-start">
        <div className="col-span-2 space-y-6">
          <Panel title="Give it a task or project">
            <Field label="Short title (optional)"><input className={inputClass} value={title} onChange={e => setTitle(e.target.value)} /></Field>
            <Field label="What do you need to build or get done?">
              <textarea className={inputClass} rows={3} value={description} onChange={e => setDescription(e.target.value)}
                placeholder="e.g. Build a portfolio website with a projects page and contact form" />
            </Field>
            <Button onClick={handleBreakdown} disabled={loading}>
              <Sparkles size={16} /> {loading ? 'Breaking it down…' : 'Break into steps'}
            </Button>
          </Panel>

          {state.tasks.map(task => {
            const doneCount = task.steps.filter(s => s.done).length
            return (
              <Panel key={task.id} title={task.title}
                eyebrow={`${doneCount}/${task.steps.length} complete`}
                action={<button onClick={() => removeTask(task.id)} className="text-muted hover:text-danger"><Trash2 size={15} /></button>}>
                <ul className="space-y-2">
                  {task.steps.map(step => (
                    <li key={step.id} className="flex items-center gap-3">
                      <input type="checkbox" checked={step.done} onChange={() => toggleStep(task.id, step.id)}
                        className="w-4 h-4 accent-amber shrink-0" />
                      <span className={`text-sm flex-1 ${step.done ? 'line-through text-muted' : 'text-ink'}`}>{step.text}</span>
                      <input type="date" value={step.due || ''} onChange={e => setDue(task.id, step.id, e.target.value)}
                        className="bg-surface2 border border-line rounded px-2 py-1 text-xs text-muted mono-tick" />
                    </li>
                  ))}
                </ul>
              </Panel>
            )
          })}

          {state.tasks.length === 0 && (
            <div className="text-center py-8 text-sm text-muted border border-dashed border-line rounded-xl">
              <ListChecks className="mx-auto mb-2" size={20} />
              No tasks yet — describe something above.
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Panel title="Calendar">
            <Calendar dueDates={dueDates} />
          </Panel>
          <Panel title="Streak">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-semibold text-amber">{state.streak.count}</span>
              <span className="text-sm text-muted">days active</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {Object.keys(state.streak.log).slice(-10).map(d => <Badge key={d} tone="amber">{d.slice(5)}</Badge>)}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
