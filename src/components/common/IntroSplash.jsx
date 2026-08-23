import { useEffect, useMemo, useState } from 'react'

function makeGlitter(count) {
  return Array.from({ length: count }, (_, i) => {
    const size = 3 + Math.random() * 6
    return {
      id: i,
      left: Math.random() * 100,
      size,
      duration: 2.6 + Math.random() * 2.4,
      delay: Math.random() * 1.4,
      drift: (Math.random() - 0.5) * 120,
      opacity: 0.5 + Math.random() * 0.5
    }
  })
}

export default function IntroSplash({ onDone }) {
  const glitter = useMemo(() => makeGlitter(70), [])
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const leaveTimer = setTimeout(() => setLeaving(true), 2200)
    const doneTimer = setTimeout(() => onDone(), 2800)
    return () => { clearTimeout(leaveTimer); clearTimeout(doneTimer) }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${leaving ? 'opacity-0' : 'opacity-100'}`}
      style={{
        background: 'linear-gradient(160deg, #FFFDF6 0%, #FBF0D4 45%, #E9CE85 100%)'
      }}
      aria-hidden="true"
    >
      {glitter.map(g => (
        <span
          key={g.id}
          className="glitter-piece"
          style={{
            left: `${g.left}%`,
            width: g.size,
            height: g.size,
            animationDuration: `${g.duration}s, 1.1s`,
            animationDelay: `${g.delay}s, ${g.delay}s`,
            '--g-drift': `${g.drift}px`,
            '--g-opacity': g.opacity
          }}
        />
      ))}

      <div className="relative text-center animate-[fadeInUp_0.8s_ease-out]">
        <p className="mono-tick text-xs text-signal uppercase tracking-[0.3em] mb-3">Mission Control</p>
        <h1 className="font-display text-6xl font-semibold text-ink tracking-tight">Aspire</h1>
        <p className="text-muted mt-3 text-sm">Your career, plotted.</p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
