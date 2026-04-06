import { useState, useCallback } from 'react'
import { ChatContext, ChatProvider } from './chat.context.jsx'

export function ChatProviderComponent({ children, accessToken }) {
  const [messages, setMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState({})
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  // Chat/socket functionality is intentionally disabled.
  void accessToken
  void setIsConnected

  // Join/leave project
  const switchProject = useCallback((projectId) => {
    if (projectId) {
      setMessages([])
      setTypingUsers({})
    }
    setActiveProjectId(projectId)
  }, [])

  // Send message
  const addMessage = useCallback(
    (message) => {
      if (activeProjectId) {
        setMessages((prev) => [...prev, { ...message, timestamp: new Date() }])
      }
    },
    [activeProjectId]
  )

  // Typing indicator
  const setTyping = useCallback(
    () => {},
    []
  )

  const value = {
    messages,
    setMessages,
    typingUsers,
    activeProjectId,
    switchProject,
    addMessage,
    setTyping,
    isConnected,
  }

  return <ChatProvider value={value}>{children}</ChatProvider>
}
