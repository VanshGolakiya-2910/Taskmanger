import { useState, useCallback, useEffect } from 'react'
import { ChatContext, ChatProvider } from './chat.context'
import {
  initSocket,
  disconnectSocket,
  joinProject,
  leaveProject,
  sendMessage,
  onMessage,
  offMessage,
  sendTyping,
  onTyping,
  offTyping,
} from '../utils/socket'

export function ChatProviderComponent({ children, accessToken }) {
  const [messages, setMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState({})
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  // Initialize socket on mount
  useEffect(() => {
    if (accessToken) {
      const socket = initSocket(accessToken)
      setIsConnected(socket.connected)

      const onConnect = () => setIsConnected(true)
      const onDisconnect = () => setIsConnected(false)

      socket.on('connect', onConnect)
      socket.on('disconnect', onDisconnect)

      return () => {
        socket.off('connect', onConnect)
        socket.off('disconnect', onDisconnect)
      }
    }
  }, [accessToken])

  // Join/leave project
  const switchProject = useCallback((projectId) => {
    if (activeProjectId) {
      leaveProject(activeProjectId)
    }
    if (projectId) {
      joinProject(projectId)
      setMessages([])
      setTypingUsers({})
    }
    setActiveProjectId(projectId)
  }, [activeProjectId])

  // Send message
  const addMessage = useCallback(
    (message) => {
      if (activeProjectId) {
        sendMessage(activeProjectId, message)
        setMessages((prev) => [...prev, { ...message, timestamp: new Date() }])
      }
    },
    [activeProjectId]
  )

  // Handle incoming messages
  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prev) => [...prev, { ...data, timestamp: new Date(data.timestamp) }])
    }

    onMessage(handleMessage)

    return () => {
      offMessage()
    }
  }, [])

  // Handle typing indicators
  useEffect(() => {
    const handleTyping = (data) => {
      const { userId, userName, isTyping } = data

      setTypingUsers((prev) => {
        const updated = { ...prev }
        if (isTyping) {
          updated[userId] = userName
        } else {
          delete updated[userId]
        }
        return updated
      })
    }

    onTyping(handleTyping)

    return () => {
      offTyping()
    }
  }, [])

  // Typing indicator
  const setTyping = useCallback(
    (isTyping) => {
      sendTyping(activeProjectId, isTyping)
    },
    [activeProjectId]
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
