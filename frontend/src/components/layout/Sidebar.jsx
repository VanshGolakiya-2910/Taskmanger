import { LayoutDashboard, Folder, Plus, Settings, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const baseItemClass =
  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition'

const linkClass = ({ isActive }) =>
  `${baseItemClass} ${isActive ? 'shadow-sm' : 'hover:opacity-80'}`

export default function Sidebar() {
  const { user } = useAuth()
  const isManager = ['manager', 'project_manager'].includes(user?.role)

  return (
    <aside
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRightColor: 'var(--border-color)',
      }}
      className="hidden md:block w-64 border-r"
    >
      <div className="p-4">
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-semibold uppercase tracking-[0.08em] mb-3">
          Menu
        </p>
        <nav className="space-y-2">
          <NavLink 
            to="/dashboard" 
            className={linkClass}
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
              color: 'var(--text-primary)',
              borderLeft: isActive ? '3px solid var(--border-color)' : '3px solid transparent',
              paddingLeft: '0.65rem',
            })}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>

          <NavLink 
            to="/projects" 
            className={linkClass}
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
              color: 'var(--text-primary)',
              borderLeft: isActive ? '3px solid var(--border-color)' : '3px solid transparent',
              paddingLeft: '0.65rem',
            })}
          >
            <Folder className="w-5 h-5" />
            Projects
          </NavLink>

          <NavLink 
            to="/tasks/new" 
            className={linkClass}
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
              color: 'var(--text-primary)',
              borderLeft: isActive ? '3px solid var(--border-color)' : '3px solid transparent',
              paddingLeft: '0.65rem',
            })}
          >
            <Plus className="w-5 h-5" />
            Create Task
          </NavLink>

          <div style={{ borderColor: 'var(--border-color)' }} className="border-t my-2"></div>

          {isManager && (
            <NavLink 
              to="/users" 
              className={linkClass}
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                color: 'var(--text-primary)',
                borderLeft: isActive ? '3px solid var(--border-color)' : '3px solid transparent',
                paddingLeft: '0.65rem',
              })}
            >
              <Users className="w-5 h-5" />
              Manage Users
            </NavLink>
          )}

          <NavLink to="/settings" className={linkClass}>
            <Settings className="w-5 h-5" />
            Settings
          </NavLink>
        </nav>
      </div>
    </aside>
  )
}

