import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useTheme } from '../../context/ThemeContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function Login() {
  const { login } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  usePageTitle('Login')

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center px-4 py-12 relative">
      {/* Theme toggle button */}
      <button
        onClick={() => {
          console.log('Theme button clicked')
          toggleTheme()
        }}
        className="absolute top-6 right-6 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
        aria-label="Toggle theme"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-slate-300" />
        ) : (
          <Moon className="w-5 h-5 text-slate-600" />
        )}
      </button>

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
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-700 dark:text-slate-200">Password</label>
                <Link 
                  to="/forgot-password"
                  className="text-sm text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 font-semibold"
                >
                  Forgot password?
                </Link>
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
