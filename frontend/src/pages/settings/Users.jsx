import { useState } from 'react'
import { Users, UserPlus, Copy, Check, AlertCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { createUserApi } from '../../api/auth.api'
import { usePageTitle } from '../../hooks/usePageTitle'

const ROLES = [
  { value: 'member', label: 'Member' },
  { value: 'project_manager', label: 'Project Manager' },
  { value: 'manager', label: 'Manager' }
]

export default function UsersManagement() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [createdUser, setCreatedUser] = useState(null)
  const [copiedPassword, setCopiedPassword] = useState(false)

  usePageTitle('User Management')

  // Check if current user is a manager
  const isManager = ['manager', 'project_manager'].includes(user?.role)

  const handleCreateUser = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      showToast('Email is required', 'error')
      return
    }

    setLoading(true)

    try {
      const response = await createUserApi({ email: email.trim(), role })
      setCreatedUser(response.data.data)
      showToast(response.data.message || 'User created successfully', 'success')

      // Reset form
      setEmail('')
      setRole('member')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create user'
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const copyPassword = () => {
    if (createdUser?.tempPassword) {
      navigator.clipboard.writeText(createdUser.tempPassword)
      setCopiedPassword(true)
      showToast('Password copied to clipboard', 'success')
      setTimeout(() => setCopiedPassword(false), 2000)
    }
  }

  if (!isManager) {
    return (
      <div
        className="min-h-screen p-6 flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div
          className="max-w-md rounded-xl border p-8 text-center"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <div className="w-12 h-12 rounded-full bg-red-500/20 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Access Denied</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Only managers can create and manage user accounts.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <Users className="w-8 h-8" />
            Manage Users
          </h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Create and manage team member accounts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create User Form */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl border p-6 shadow-sm"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <UserPlus className="w-5 h-5" />
                Create New User
              </h2>

              <form onSubmit={handleCreateUser} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-4 py-2 rounded-lg border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--text-primary)',
                    }}
                    disabled={loading}
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--text-primary)',
                    }}
                    disabled={loading}
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    • Member: Regular team member
                    <br />
                    • Project Manager: Can manage projects
                    <br />
                    • Manager: Can create users and manage system
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-lg bg-linear-to-r from-cyan-500 to-emerald-500 text-white font-medium shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </form>
            </div>
          </div>

          {/* Created User Details */}
          {createdUser && (
            <div
              className="rounded-xl border p-6 shadow-sm"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>User Created ✓</h3>

              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>Email</p>
                  <p className="text-sm font-medium break-all" style={{ color: 'var(--text-primary)' }}>{createdUser.email}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>Role</p>
                  <p className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                    {createdUser.role?.replace('_', ' ')}
                  </p>
                </div>

                <div className="border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Temporary Password</p>
                  <div className="flex gap-2 items-center">
                    <div
                      className="flex-1 px-3 py-2 rounded-lg font-mono text-sm break-all"
                      style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    >
                      {createdUser.tempPassword}
                    </div>
                    <button
                      type="button"
                      onClick={copyPassword}
                      className="p-2 rounded-lg hover:opacity-80 transition"
                      title="Copy password"
                    >
                      {copiedPassword ? (
                        <Check className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div
                  className="rounded-lg p-3 mt-4"
                  style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                >
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <strong>Next steps:</strong> Share the email and temporary password with the user. They can log in and change their password in Settings.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCreatedUser(null)}
                  className="w-full px-3 py-2 rounded-lg font-medium hover:opacity-80 transition"
                  style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                >
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        {!createdUser && (
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">How it works:</h3>
            <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-decimal list-inside">
              <li>Enter the user's email and select their role</li>
              <li>A temporary password will be generated automatically</li>
              <li>Share the credentials with the user securely</li>
              <li>User logs in and changes their password in Settings</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
