import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle, Copy } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { forgotPasswordApi } from '../../api/auth.api'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function ForgotPassword() {
  usePageTitle('Forgot Password')
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [resetToken, setResetToken] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setSuccess(false)

    try {
      const response = await forgotPasswordApi({ email })
      setSuccess(true)
      // In development, the token is returned in the response
      if (response.data.data.resetToken) {
        setResetToken(response.data.data.resetToken)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToken = () => {
    if (resetToken) {
      navigator.clipboard.writeText(resetToken)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center px-4 py-12">
        <div className="max-w-md w-full mx-auto">
          <Card className="p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 mx-auto flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Check your email</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                If an account exists for {email}, we&apos;ve sent password reset instructions.
              </p>
            </div>

            {resetToken && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-200 mb-2 uppercase tracking-wide">
                  Development Mode - Reset Token
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-white dark:bg-slate-900 px-3 py-2 rounded border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono break-all">
                    {resetToken}
                  </code>
                  <Button
                    variant="ghost"
                    className="p-2"
                    onClick={copyToken}
                    title="Copy token"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                  Copy this token and use it on the reset password page. In production, this would be sent via email.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Link to="/reset-password">
                <Button className="w-full justify-center">
                  Go to Reset Password
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" className="w-full justify-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
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
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Forgot password?</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              No worries, we&apos;ll send you reset instructions.
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
                Email address
              </label>
              <input
                type="email"
                className="w-full rounded-lg border px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--input-border)',
                  color: 'var(--text-primary)'
                }}
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full justify-center"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send reset link'}
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
