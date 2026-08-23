import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { loadState, saveState } from '../services/storage.js'

const AppContext = createContext(null)

const DEFAULT_STATE = {
  profile: { name: '', role: '', email: '' },
  resumes: [],
  coverLetters: [],
  atsHistory: [], // { id, date, score, jobTitle, breakdown }
  tasks: [], // { id, title, steps: [{id,text,done,due}], createdAt }
  streak: { count: 0, lastActiveDate: null, log: {} }, // log: { 'YYYY-MM-DD': true }
  chats: [], // { id, title, messages: [{role, content, at}], createdAt }
  settings: { voiceProvider: 'browser', language: 'en-US', autoSpeak: false }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(() => loadState('aspire_state', DEFAULT_STATE))

  useEffect(() => {
    saveState('aspire_state', state)
  }, [state])

  const touchStreak = useCallback(() => {
    setState(prev => {
      const today = new Date().toISOString().slice(0, 10)
      if (prev.streak.log[today]) return prev
      const log = { ...prev.streak.log, [today]: true }
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      const count = prev.streak.lastActiveDate === yesterday ? prev.streak.count + 1 : 1
      return { ...prev, streak: { count, lastActiveDate: today, log } }
    })
  }, [])

  const value = { state, setState, touchStreak }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
