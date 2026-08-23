import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, Mail, Target, ListChecks, Gamepad2, Radio, Flame, LogOut } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/resume', label: 'Resume Builder', icon: FileText },
  { to: '/cover-letter', label: 'Cover Letter', icon: Mail },
  { to: '/ats', label: 'ATS Checker', icon: Target },
  { to: '/tasks', label: 'Tasks & Calendar', icon: ListChecks },
  { to: '/arcade', label: 'Arcade', icon: Gamepad2 },
  { to: '/alita', label: 'Alita', icon: Radio }
]

export default function AppLayout() {
  const { state } = useApp()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 border-r border-line bg-surface flex flex-col">
        <div className="px-6 py-6 border-b border-line">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber" />
            <span className="font-display font-semibold text-lg tracking-tight">Aspire</span>
          </div>
          <p className="text-xs text-muted mt-1 mono-tick">mission control for your career</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-surface2 text-amber' : 'text-muted hover:text-ink hover:bg-surface2/60'
                }`
              }
            >
              <Icon size={17} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mx-3 mb-3 px-3 py-3 rounded-lg bg-surface2 border border-line flex items-center gap-2.5">
          <Flame size={16} className="text-amber" />
          <div>
            <p className="text-sm font-medium leading-tight">{state.streak.count} day streak</p>
            <p className="text-xs text-muted leading-tight">keep the trajectory up</p>
          </div>
        </div>

        <div className="mx-3 mb-4 px-3 py-2.5 rounded-lg border border-line flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} title="Sign out" className="text-muted hover:text-danger shrink-0 ml-2">
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
