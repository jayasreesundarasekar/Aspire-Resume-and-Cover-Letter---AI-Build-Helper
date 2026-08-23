// ---------------------------------------------------------------------------
// AuthContext.jsx
//
// DEMO-ONLY authentication. Accounts and "passwords" are stored in plain
// text in localStorage so the login/signup flow works with zero setup.
// This is NOT secure and must be replaced with a real backend (hashed
// passwords, sessions/JWTs over HTTPS) before handling real user data —
// see README.md.
// ---------------------------------------------------------------------------
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
const USERS_KEY = 'aspire_users'
const SESSION_KEY = 'aspire_session'

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || [] } catch { return [] }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}
function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) } catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession)

  function signup({ name, email, password }) {
    const users = loadUsers()
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.')
    }
    const record = { id: crypto.randomUUID(), name, email, password }
    saveUsers([...users, record])
    const session = { id: record.id, name: record.name, email: record.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
  }

  function login({ email, password }) {
    const users = loadUsers()
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!found) throw new Error('Incorrect email or password.')
    const session = { id: found.id, name: found.name, email: found.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
