import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import IntroSplash from './components/common/IntroSplash.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ResumeBuilderPage from './pages/ResumeBuilderPage.jsx'
import CoverLetterPage from './pages/CoverLetterPage.jsx'
import ATSCheckerPage from './pages/ATSCheckerPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import GamePage from './pages/GamePage.jsx'
import AlitaPage from './pages/AlitaPage.jsx'

const INTRO_KEY = 'aspire_intro_shown'

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false
    return !sessionStorage.getItem(INTRO_KEY)
  })

  useEffect(() => {
    if (showIntro) sessionStorage.setItem(INTRO_KEY, '1')
  }, [showIntro])

  if (showIntro) {
    return <IntroSplash onDone={() => setShowIntro(false)} />
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/resume" element={<ResumeBuilderPage />} />
          <Route path="/cover-letter" element={<CoverLetterPage />} />
          <Route path="/ats" element={<ATSCheckerPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/arcade" element={<GamePage />} />
          <Route path="/alita" element={<AlitaPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
