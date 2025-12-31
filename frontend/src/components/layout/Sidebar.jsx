import { LayoutDashboard, Folder, CheckSquare } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItemClass =
  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ' +
  'text-slate-700 dark:text-slate-300 hover:bg-slate-100 ' +
  'dark:hover:bg-slate-800 transition'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 
                      border-r border-slate-200 dark:border-slate-700
                      hidden md:block">
      <nav className="p-4 space-y-2">
        <NavLink to="/dashboard" className={navItemClass}>
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink to="/projects" className={navItemClass}>
          <Folder className="w-5 h-5" />
          Projects
        </NavLink>

        <NavLink to="/my-tasks" className={navItemClass}>
          <CheckSquare className="w-5 h-5" />
          My Tasks
        </NavLink>
      </nav>
    </aside>
  )
}
