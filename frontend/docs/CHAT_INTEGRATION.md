# Chat and WebSocket Integration Guide

This guide explains how to integrate the real-time chat functionality using Socket.io.

## Architecture Overview

### Backend (Socket.io Server)
- Located in `backend/src/realtime/`
- Handles WebSocket connections with JWT authentication
- Manages project-based chat rooms using Socket.io namespaces
- Emits events for messages, typing indicators, and user status

### Frontend (Socket.io Client)
- Socket utility: `frontend/src/utils/socket.js`
- Chat context: `frontend/src/context/ChatProvider.jsx`
- Chat hook: `frontend/src/hooks/useChat.js`
- Chat components: `frontend/src/components/chat/`

## Setup Instructions

### 1. Wrap App with ChatProvider

Update your main app file or layout:

```jsx
import { ChatProviderComponent } from './context/ChatProvider'

function App() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <ChatProviderComponent accessToken={user?.accessToken}>
      <YourAppContent />
    </ChatProviderComponent>
  )
}
```

### 2. Add ChatPanel to Layout

Add the floating chat panel to your app layout:

```jsx
import ChatPanel from './components/chat/ChatPanel'

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar, header, content... */}
      {children}
      <ChatPanel />
    </div>
  )
}
```

### 3. Use Chat in Your Components

```jsx
import { useChat } from '../hooks/useChat'

function ProjectDetails() {
  const { switchProject, addMessage, messages } = useChat()

  useEffect(() => {
    // Join chat when project loads
    switchProject(projectId)
  }, [projectId])

  return (
    <div>
      {/* Your project content */}
    </div>
  )
}
```

## API Reference

### Socket Events

#### Client → Server

- `project:join(projectId)` - Join a project chat room
- `project:leave(projectId)` - Leave a project chat room
- `chat:message(payload)` - Send a message
- `chat:typing(payload)` - Send typing indicator

#### Server → Client

- `chat:message(payload)` - Receive message from other users
- `chat:typing(payload)` - Receive typing indicator from other users
- `user:status(payload)` - User online/offline status

### Hook: useChat()

```javascript
const {
  messages,              // Array of messages in current project
  setMessages,           // Update messages array
  typingUsers,           // Object of users currently typing
  activeProjectId,       // Current project ID
  switchProject,         // Function to switch projects
  addMessage,            // Function to send message
  setTyping,             // Function to send typing indicator
  isConnected            // Boolean - socket connection status
} = useChat()
```

## Message Structure

### Sending a Message
```javascript
addMessage({
  userId: 123,
  userName: 'John Doe',
  content: 'Hello everyone!',
})
```

### Received Message
```javascript
{
  userId: 123,
  userName: 'John Doe',
  content: 'Hello everyone!',
  timestamp: '2024-01-15T10:30:00.000Z'
}
```

## Typing Indicator

The chat system automatically sends typing indicators:

```javascript
// Typing indicator is sent when user starts typing
// Stops automatically after 2 seconds of inactivity
const handleInputChange = (e) => {
  setInput(e.target.value)
  // Typing indicator sent automatically
}
```

## Socket Connection Flow

1. **Initialize**: When app loads, socket connects with JWT token
2. **Join Project**: When viewing a project, automatically joins chat room
3. **Receive Messages**: Messages from other users in room are received
4. **Send Message**: User types and sends message to room
5. **Typing Indicator**: Typing status is broadcast to room
6. **Leave Project**: When leaving project, room is left

## Features

✅ Real-time messaging within projects
✅ Typing indicators
✅ User presence (typing status)
✅ Auto-reconnection on network loss
✅ Message history per project
✅ Dark mode support
✅ Responsive design
✅ Floating chat panel

## Environment Variables

Add to your `.env` file:

```
VITE_API_BASE_URL=http://localhost:5000
```

## Security

- All WebSocket connections require valid JWT token
- Messages are scoped to project rooms
- Only authenticated users can send/receive messages
- Token validation happens on every connection

## Future Enhancements

- [ ] Message persistence in database
- [ ] Message search functionality
- [ ] Emoji reactions
- [ ] File/image sharing
- [ ] Message editing
- [ ] User avatars in chat
- [ ] Chat notifications
- [ ] Message mentions (@user)
- [ ] Channel support (different chat channels per project)
- [ ] Voice/video integration

## Troubleshooting

### Socket not connecting
- Check that backend is running on correct port
- Verify JWT token is valid
- Check browser console for auth errors

### Messages not appearing
- Ensure socket is connected (`isConnected === true`)
- Verify projectId is set (`activeProjectId` is not null)
- Check that user is in project room

### Typing indicator not working
- Verify `setTyping` is being called
- Check network tab for socket events
- Ensure input field triggers `onChange` handler
