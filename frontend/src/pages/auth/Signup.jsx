import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState(null)

  const submit = (e) => {
    e.preventDefault()
    setMessage('Sign-up is not enabled yet. Please ask an admin to create your account.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-12 text-slate-100">
      <div className="w-full max-w-4xl grid gap-10 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm font-medium text-cyan-100">Create your workspace access</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight">Join the team</h1>
            <p className="text-slate-300 leading-relaxed max-w-xl">
              Request an account to start collaborating on projects and tasks.
            </p>
          </div>
          <div className="hidden lg:block h-px w-24 bg-gradient-to-r from-cyan-400/80 via-emerald-400/80 to-transparent" />
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 lg:p-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-300">TaskManager</p>
              <h2 className="text-2xl font-semibold">Request access</h2>
            </div>
            <span className="rounded-full bg-cyan-500/15 text-cyan-200 px-3 py-1 text-xs font-semibold">
              Beta
+            </span>
          </div>

          {message && (
            <div className="mb-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-50">
              {message}
            </div>
          )}

          <form className="space-y-5" onSubmit={submit}>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Full name</label>
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-400 shadow-sm focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                placeholder="Alex Doe"
                autoComplete="name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-200">Email</label>
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-400 shadow-sm focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-200">Password</label>
              <input
                type="password"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-400 shadow-sm focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                placeholder="••••••••"
                autoComplete="new-password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 px-4 py-3 text-center font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
              type="submit"
            >
              Submit request
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-300 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-200 hover:text-cyan-100 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
