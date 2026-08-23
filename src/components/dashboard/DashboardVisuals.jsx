import { Link } from 'react-router-dom'

const STOPS = [
  { to: '/resume', label: 'Resume', code: '01' },
  { to: '/ats', label: 'ATS Score', code: '02' },
  { to: '/tasks', label: 'Build Plan', code: '03' },
  { to: '/alita', label: 'Alita', code: '04' }
]

export function TrajectoryPath() {
  return (
    <div className="relative py-10 px-4">
      <svg className="absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full h-16" preserveAspectRatio="none" viewBox="0 0 100 20">
        <path
          d="M 2 15 Q 25 2, 35 12 T 65 8 T 98 5"
          fill="none"
          stroke="#E3CA92"
          strokeWidth="0.5"
        />
        <path
          d="M 2 15 Q 25 2, 35 12 T 65 8 T 98 5"
          fill="none"
          stroke="#C9971F"
          strokeWidth="0.5"
          strokeDasharray="1.2 2.2"
          opacity="0.8"
        />
      </svg>
      <div className="relative grid grid-cols-4 gap-4">
        {STOPS.map(s => (
          <Link key={s.to} to={s.to} className="group flex flex-col items-center text-center">
            <span className="mono-tick text-[10px] text-muted mb-1">{s.code}</span>
            <span className="w-3 h-3 rounded-full bg-amber ring-4 ring-base group-hover:ring-surface2 transition-all mb-2" />
            <span className="text-sm font-medium text-ink group-hover:text-amber transition-colors">{s.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function StreakConstellation({ log }) {
  const days = 35
  const cells = Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.now() - (days - 1 - i) * 86400000)
    const key = d.toISOString().slice(0, 10)
    return { key, active: !!log[key], day: d.getDate() }
  })

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {cells.map(c => (
        <div
          key={c.key}
          title={c.key}
          className={`aspect-square rounded-sm ${c.active ? 'bg-amber' : 'bg-surface2'}`}
        />
      ))}
    </div>
  )
}
