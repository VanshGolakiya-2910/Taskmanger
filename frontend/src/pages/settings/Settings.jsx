import { useState } from 'react'
import { Lock, Mail, Eye, EyeOff, User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { updateProfileApi } from '../../api/auth.api'

export default function Settings() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false })

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (newPassword && newPassword !== confirmPassword) {
        showToast('Passwords do not match', 'error')
        setLoading(false)
        return
      }

      if (newPassword && !currentPassword) {
        showToast('Current password required to set new password', 'error')
        setLoading(false)
        return
      }

      if (!email) {
        showToast('Email is required', 'error')
        setLoading(false)
        return
      }

      // Prepare payload
      const payload = {}
      if (name !== user?.name) {
        payload.name = name
      }
      if (email !== user?.email) {
        payload.email = email
      }
      if (newPassword) {
        payload.currentPassword = currentPassword
        payload.newPassword = newPassword
      }

      if (Object.keys(payload).length === 0) {
        showToast('No changes to save', 'info')
        setLoading(false)
        return
      }

      const response = await updateProfileApi(payload)
      showToast(response.data.message || 'Profile updated successfully', 'success')

      // Clear password fields
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile'
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Manage your account and security preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Section */}
          <div
            className="rounded-xl border p-6 shadow-sm"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <User className="w-5 h-5" />
              Display Name
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--input-border)',
                  color: 'var(--text-primary)',
                }}
                placeholder="Your display name"
              />
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>This name will be displayed across the application instead of your email.</p>
            </div>
          </div>

          {/* Email Section */}
          <div
            className="rounded-xl border p-6 shadow-sm"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Mail className="w-5 h-5" />
              Email Address
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--input-border)',
                  color: 'var(--text-primary)',
                }}
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Password Section */}
          <div
            className="rounded-xl border p-6 shadow-sm"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Lock className="w-5 h-5" />
              Password
            </h2>

            <div className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition pr-10"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition pr-10"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              {newPassword && (
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      borderColor: 'var(--input-border)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="Confirm new password"
                  />
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-lg bg-linear-to-r from-cyan-500 to-emerald-500 text-white font-medium shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
