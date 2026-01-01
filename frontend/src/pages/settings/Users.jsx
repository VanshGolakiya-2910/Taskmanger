import { useState } from 'react'
import { Users, UserPlus, Copy, Check, AlertCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { createUserApi } from '../../api/auth.api'

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6 flex items-center justify-center">
        <div className="max-w-md bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/20 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Only managers can create and manage user accounts.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8" />
            Manage Users
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Create and manage team member accounts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create User Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Create New User
              </h2>

              <form onSubmit={handleCreateUser} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition"
                    disabled={loading}
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition"
                    disabled={loading}
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
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
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </form>
            </div>
          </div>

          {/* Created User Details */}
          {createdUser && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">User Created ✓</h3>

              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Email</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white break-all">{createdUser.email}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Role</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                    {createdUser.role?.replace('_', ' ')}
                  </p>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Temporary Password</p>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-sm text-slate-900 dark:text-white break-all">
                      {createdUser.tempPassword}
                    </div>
                    <button
                      type="button"
                      onClick={copyPassword}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
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

                <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-3 mt-4">
                  <p className="text-xs text-cyan-900 dark:text-cyan-300">
                    <strong>Next steps:</strong> Share the email and temporary password with the user. They can log in and change their password in Settings.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCreatedUser(null)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
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
