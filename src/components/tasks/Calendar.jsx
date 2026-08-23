import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function Calendar({ dueDates = {} }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  const cells = useMemo(() => {
    const first = new Date(cursor.year, cursor.month, 1)
    const startOffset = first.getDay()
    const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()
    const arr = []
    for (let i = 0; i < startOffset; i++) arr.push(null)
    for (let d = 1; d <= daysInMonth; d++) arr.push(d)
    return arr
  }, [cursor])

  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  const todayKey = new Date().toISOString().slice(0, 10)

  function shift(delta) {
    setCursor(c => {
      const m = c.month + delta
      return { year: c.year + Math.floor(m / 12), month: (m + 12) % 12 }
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => shift(-1)} className="text-muted hover:text-ink"><ChevronLeft size={16} /></button>
        <span className="text-sm font-medium mono-tick">{monthLabel}</span>
        <button onClick={() => shift(1)} className="text-muted hover:text-ink"><ChevronRight size={16} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w, i) => <span key={i} className="text-xs text-muted mono-tick">{w}</span>)}
        {cells.map((d, i) => {
          if (!d) return <span key={i} />
          const key = `${cursor.year}-${String(cursor.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const hasTask = !!dueDates[key]
          const isToday = key === todayKey
          return (
            <div key={i} className={`relative aspect-square flex items-center justify-center text-xs rounded-md
              ${isToday ? 'bg-amber text-ink font-semibold' : hasTask ? 'bg-surface2 text-signal' : 'text-muted'}`}>
              {d}
              {hasTask && !isToday && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-signal" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
