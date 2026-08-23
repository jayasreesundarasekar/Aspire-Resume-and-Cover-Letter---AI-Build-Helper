import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { Button, Field, inputClass } from '../components/common/UI.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      login(form)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display text-3xl font-semibold text-ink tracking-tight">Aspire</span>
          <p className="text-muted text-sm mt-1">Welcome back — let's keep the trajectory up.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-xl shadow-panel p-6">
          <Field label="Email">
            <input type="email" required className={inputClass} value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </Field>
          <Field label="Password">
            <input type="password" required className={inputClass} value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </Field>

          {error && <p className="text-xs text-danger mb-4">{error}</p>}

          <Button type="submit" className="w-full"><LogIn size={15} /> Sign in</Button>
        </form>

        <p className="text-center text-sm text-muted mt-5">
          New here? <Link to="/signup" className="text-signal hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
