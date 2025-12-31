import { Moon, Sun } from 'lucide-react'

export default function Navbar({ onToggleTheme, isDark }) {
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 
                       border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16
                      flex items-center justify-between">
        <div className="text-lg font-bold text-slate-900 dark:text-white">
          TaskFlow
        </div>

        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 
                     dark:hover:bg-slate-800 transition"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-slate-300" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  )
}
