import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function AppLayout({ children }) {
  const [dark, setDark] = useState(false)

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
    setDark(!dark)
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar onToggleTheme={toggleTheme} isDark={dark} />
        {children}
      </div>
    </div>
  )
}
