import { Moon, Sun, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../context/ThemeContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const displayName = user?.name || user?.email || 'User'
  const initials = displayName
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header style={{
      backgroundColor: 'var(--header-bg)',
      borderBottomColor: 'var(--border-color)',
    }} className="sticky top-0 z-30 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div style={{ color: 'var(--text-primary)' }} className="text-lg font-bold tracking-tight">
          TaskFlow
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">
              {displayName}
            </span>
            <span style={{ color: 'var(--text-secondary)' }} className="text-xs">{user?.role ? user.role.replace('_', ' ') : 'Member'}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
            {initials}
          </div>
          <button
            onClick={toggleTheme}
            style={{
              backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 245, 249, 0.7)',
            }}
            className="p-2 rounded-lg hover:opacity-80 transition cursor-pointer"
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-slate-300" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
          <button
            onClick={logout}
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
