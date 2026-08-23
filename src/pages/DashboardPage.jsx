import { useApp } from '../context/AppContext.jsx'
import { Panel, Badge } from '../components/common/UI.jsx'
import { TrajectoryPath, StreakConstellation } from '../components/dashboard/DashboardVisuals.jsx'

export default function DashboardPage() {
  const { state } = useApp()
  const latestATS = state.atsHistory[state.atsHistory.length - 1]

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 space-y-8">
      <div>
        <p className="mono-tick text-xs text-signal uppercase tracking-widest mb-2">Aspire · Mission Control</p>
        <h1 className="font-display text-3xl font-semibold text-ink">Your career, plotted.</h1>
        <p className="text-muted mt-1">Four stops between where you are and the offer you want.</p>
      </div>

      <Panel eyebrow="Flight path" title="Your trajectory">
        <TrajectoryPath />
      </Panel>

      <div className="grid grid-cols-3 gap-6">
        <Panel eyebrow="Engagement" title="Streak">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display text-4xl font-semibold text-amber">{state.streak.count}</span>
            <span className="text-sm text-muted">days in a row</span>
          </div>
          <StreakConstellation log={state.streak.log} />
        </Panel>

        <Panel eyebrow="Latest run" title="ATS score">
          {latestATS ? (
            <>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-4xl font-semibold text-signal">{latestATS.score}</span>
                <span className="text-sm text-muted">/ 100</span>
              </div>
              <p className="text-sm text-muted">{latestATS.jobTitle || 'Untitled check'}</p>
            </>
          ) : (
            <p className="text-sm text-muted">No resume checked yet. Head to ATS Checker.</p>
          )}
        </Panel>

        <Panel eyebrow="In flight" title="Open tasks">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-display text-4xl font-semibold text-ink">
              {state.tasks.reduce((n, t) => n + t.steps.filter(s => !s.done).length, 0)}
            </span>
            <span className="text-sm text-muted">steps left</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {state.tasks.slice(0, 4).map(t => (
              <Badge key={t.id}>{t.title}</Badge>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}
