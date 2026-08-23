export function Panel({ children, className = '', title, eyebrow, action }) {
  return (
    <div className={`bg-surface border border-line rounded-xl shadow-panel p-6 ${className}`}>
      {(title || eyebrow) && (
        <div className="flex items-start justify-between mb-5">
          <div>
            {eyebrow && <p className="mono-tick text-xs text-signal uppercase tracking-widest mb-1">{eyebrow}</p>}
            {title && <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-amber text-ink font-semibold hover:bg-amber-dim',
    secondary: 'bg-surface2 text-ink border border-line hover:border-signal',
    signal: 'bg-signal text-surface hover:bg-signal-dim',
    ghost: 'text-muted hover:text-ink'
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function Badge({ children, tone = 'default' }) {
  const tones = {
    default: 'bg-surface2 text-muted border-line',
    amber: 'bg-amber/10 text-amber border-amber/30',
    signal: 'bg-signal/10 text-signal border-signal/30',
    danger: 'bg-danger/10 text-danger border-danger/30'
  }
  return (
    <span className={`mono-tick text-xs px-2 py-0.5 rounded-full border ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function EmptyState({ title, hint, action }) {
  return (
    <div className="text-center py-12 border border-dashed border-line rounded-xl">
      <p className="font-display text-ink mb-1">{title}</p>
      {hint && <p className="text-sm text-muted mb-4">{hint}</p>}
      {action}
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs mono-tick text-muted uppercase tracking-wider mb-1.5">{label}</span>
      {children}
    </label>
  )
}

export const inputClass = 'w-full bg-surface2 border border-line rounded-lg px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-signal outline-none'
