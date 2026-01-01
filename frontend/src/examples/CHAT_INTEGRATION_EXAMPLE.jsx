/**
 * INTEGRATION EXAMPLE: How to use Chat functionality in your app
 * 
 * This file shows the recommended setup for integrating
 * the real-time chat system into your application.
 */

// 1. Wrap your app with ChatProvider
// ====================================

import { ChatProviderComponent } from './context/ChatProvider'
import { useAuth } from './hooks/useAuth'

function App() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />

  // Wrap the entire app with ChatProvider, passing the access token
  return (
    <ChatProviderComponent accessToken={user?.accessToken}>
      <AppContent />
    </ChatProviderComponent>
  )
}

// 2. Add ChatPanel to your main layout
// ====================================

import ChatPanel from './components/chat/ChatPanel'

function AppLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Navbar />
        {children}
      </main>
      
      {/* Add the floating chat panel here */}
      <ChatPanel />
    </div>
  )
}

// 3. Use Chat in Project Components
// ====================================

import { useChat } from './hooks/useChat'

function ProjectDetails() {
  const { projectId } = useParams()
  const { switchProject, messages, activeProjectId } = useChat()

  useEffect(() => {
    // Join the chat room when project loads
    switchProject(projectId)

    return () => {
      // Optional: Leave chat when component unmounts
      // switchProject(null)
    }
  }, [projectId, switchProject])

  return (
    <div>
      <h1>Project: {name}</h1>
      {/* Project content here */}
      {/* Chat will appear in floating panel when activeProjectId is set */}
    </div>
  )
}

// 4. Custom Chat Implementation (if needed)
// ==========================================

import ChatWindow from './components/chat/ChatWindow'

function CustomChatPage() {
  const { activeProjectId, switchProject, messages } = useChat()

  return (
    <div className="flex h-screen">
      {/* Project list */}
      <div className="w-64 border-r">
        {projects.map(project => (
          <button
            key={project.id}
            onClick={() => switchProject(project.id)}
            className={activeProjectId === project.id ? 'bg-blue-100' : ''}
          >
            {project.name}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="flex-1">
        <ChatWindow />
      </div>
    </div>
  )
}

// 5. Direct Socket Usage (advanced)
// ==================================

import {
  initSocket,
  joinProject,
  sendMessage,
  onMessage,
  getSocket,
} from './utils/socket'

// If you need to use socket directly
const socket = getSocket()
socket.on('custom:event', (data) => {
  console.log('Custom event received:', data)
})

// 6. Socket Lifecycle Management
// ================================

import { useEffect } from 'react'
import { initSocket, disconnectSocket, getSocket } from './utils/socket'

function MyComponent({ token }) {
  useEffect(() => {
    // Initialize on mount
    const socket = initSocket(token)

    // Use socket...
    socket.on('message', (data) => console.log(data))

    // Cleanup on unmount
    return () => {
      // Optionally disconnect
      // disconnectSocket()
    }
  }, [token])

  return <div>Component using real-time updates</div>
}

export { App, AppLayout, ProjectDetails, CustomChatPage }
