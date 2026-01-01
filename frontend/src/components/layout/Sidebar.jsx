import { LayoutDashboard, Folder, Plus, Settings, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const baseItemClass =
  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition'

const linkClass = ({ isActive }) =>
  `${baseItemClass} ${
    isActive
      ? 'bg-slate-900 text-white shadow-sm'
      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
  }`

export default function Sidebar() {
  const { user } = useAuth()
  const isManager = ['manager', 'project_manager'].includes(user?.role)

  return (
    <aside
      className="hidden md:block w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700"
    >
      <div className="p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300 mb-3">
          Menu
        </p>
        <nav className="space-y-2">
          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>

          <NavLink to="/projects" className={linkClass}>
            <Folder className="w-5 h-5" />
            Projects
          </NavLink>

          <NavLink to="/tasks/new" className={linkClass}>
            <Plus className="w-5 h-5" />
            Create Task
          </NavLink>

          <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>

          {isManager && (
            <NavLink to="/users" className={linkClass}>
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

