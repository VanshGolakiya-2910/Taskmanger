import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ChatPanel from '../chat/ChatPanel'
import { useTheme } from '../../context/ThemeContext'

export default function AppLayout({ children }) {
  const { isDark } = useTheme()

  return (
    <div style={{
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
    }} className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />
        {children}
      </div>
      <ChatPanel />
    </div>
  )
}
