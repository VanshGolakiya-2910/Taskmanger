import { io } from 'socket.io-client'

let socket = null

export const initSocket = (token) => {
  if (socket) {
    return socket
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
  console.log('🔌 Initializing Socket.io connection...')
  console.log('📍 Socket URL:', socketUrl)
  console.log('🔑 Token present:', !!token)
  console.log('🔑 Token preview:', token ? token.substring(0, 20) + '...' : 'No token')

  socket = io(socketUrl, {
    auth: {
      token: token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  })

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id)
  })

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected')
  })

  socket.on('connect_error', (error) => {
    console.error('🔴 Socket connection error:', error.message)
    console.error('🔴 Full error:', error)
  })

  socket.on('error', (error) => {
    console.error('🔴 Socket error:', error)
  })

  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Project events
export const joinProject = (projectId) => {
  if (socket) {
    socket.emit('project:join', projectId)
  }
}

export const leaveProject = (projectId) => {
  if (socket) {
    socket.emit('project:leave', projectId)
  }
}

// Chat events
export const sendMessage = (projectId, message) => {
  if (socket) {
    socket.emit('chat:message', { projectId, message })
  }
}

export const onMessage = (callback) => {
  if (socket) {
    socket.on('chat:message', callback)
  }
}

export const offMessage = () => {
  if (socket) {
    socket.off('chat:message')
  }
}

// Typing indicator
export const sendTyping = (projectId, isTyping) => {
  if (socket) {
    socket.emit('chat:typing', { projectId, isTyping })
  }
}

export const onTyping = (callback) => {
  if (socket) {
    socket.on('chat:typing', callback)
  }
}

export const offTyping = () => {
  if (socket) {
    socket.off('chat:typing')
  }
}

// User status
export const onUserStatus = (callback) => {
  if (socket) {
    socket.on('user:status', callback)
  }
}

export const offUserStatus = () => {
  if (socket) {
    socket.off('user:status')
  }
}
