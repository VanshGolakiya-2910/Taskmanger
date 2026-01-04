import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { resetPasswordApi } from '../../api/auth.api'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get('token') || ''

  usePageTitle('Reset Password')

  const [form, setForm] = useState({
    token: tokenFromUrl,
    newPassword: '',
    confirmPassword: '',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!form.token || form.token.length !== 64) {
      setError('Invalid reset token. Please check and try again.')
      return
    }

    setLoading(true)

    try {
      await resetPasswordApi({
        token: form.token,
        newPassword: form.newPassword,
      })
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center px-4 py-12">
        <div className="max-w-md w-full mx-auto">
          <Card className="p-8 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 mx-auto flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Password reset!</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <p className="mt-4 text-sm text-slate-500">
                Redirecting to login page...
              </p>
            </div>

            <div className="mt-6">
              <Link to="/login">
                <Button className="w-full justify-center">
                  Go to login
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center px-4 py-12">
      <div className="max-w-md w-full mx-auto">
        <Card className="p-8 shadow-lg">
          <div className="mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Reset password</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Enter your reset token and choose a new password.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-100">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={submit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Reset Token
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 font-mono text-sm"
                placeholder="Paste your reset token here"
                required
                value={form.token}
                onChange={(e) => setForm({ ...form, token: e.target.value.trim() })}
              />
              <p className="text-xs text-slate-500">
                Enter the 64-character token from your email or the forgot password page.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700"
                  placeholder="••••••••"
                  required
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700"
                  placeholder="••••••••"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full justify-center"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
