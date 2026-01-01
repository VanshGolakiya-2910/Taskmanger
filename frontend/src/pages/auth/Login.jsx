import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(form)
      navigate('/dashboard')
    } catch {
      setError('Invalid credentials. Please check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center px-4 py-12">
      <div className="max-w-5xl w-full mx-auto grid gap-10 lg:grid-cols-2 items-center">
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold dark:bg-emerald-900/40 dark:text-emerald-100">
            Live workspace access
          </span>

          <div className="space-y-3">
            <h1 className="text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Sign in to continue where you left off. Jump to your dashboard to view projects and tasks in one place.
            </p>
          </div>

          <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Tip: Need an account? Ask your admin to invite you, then sign in here.
            </p>
          </Card>
        </div>

        <Card className="p-8 shadow-lg">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">TaskManager</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Sign in</h2>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-100">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={submit}>
            <div className="space-y-2">
              <label className="text-sm text-slate-700 dark:text-slate-200">Email</label>
              <input
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-700"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-200">
                <label>Password</label>
                <span className="text-slate-400">Use your workspace password</span>
              </div>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-700"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <Button
              type="submit"
              className="w-full justify-center"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-600 dark:text-slate-300 text-center">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-emerald-700 dark:text-emerald-300 font-semibold">
              Request access
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
