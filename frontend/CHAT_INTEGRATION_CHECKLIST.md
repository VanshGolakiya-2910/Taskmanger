# Chat Integration Checklist

Use this checklist to integrate the chat system step-by-step.

## ✅ Pre-Integration Setup

- [x] Socket.io-client installed
- [x] Socket utility created (`src/utils/socket.js`)
- [x] Chat context created (`src/context/chat.context.js`)
- [x] Chat provider created (`src/context/ChatProvider.jsx`)
- [x] Chat hook created (`src/hooks/useChat.js`)
- [x] ChatWindow component created
- [x] ChatPanel component created
- [x] Documentation created

## 📋 Integration Steps

### Step 1: Update Main App Component
- [ ] Open `src/App.jsx` (or main entry point)
- [ ] Import `ChatProviderComponent`:
  ```jsx
  import { ChatProviderComponent } from './context/ChatProvider'
  ```
- [ ] Import `useAuth` hook (if not already)
- [ ] Wrap the app content with `ChatProviderComponent`:
  ```jsx
  <ChatProviderComponent accessToken={user?.accessToken}>
    <YourAppContent />
  </ChatProviderComponent>
  ```

### Step 2: Add ChatPanel to Layout
- [ ] Open `src/components/layout/AppLayout.jsx`
- [ ] Import `ChatPanel`:
  ```jsx
  import ChatPanel from '../chat/ChatPanel'
  ```
- [ ] Add `<ChatPanel />` at the end of the layout JSX (before closing main/layout div)

### Step 3: Update ProjectDetails Component
- [ ] Open `src/pages/projects/ProjectDetails.jsx`
- [ ] Import `useChat` hook:
  ```jsx
  import { useChat } from '../../hooks/useChat'
  ```
- [ ] Get `switchProject` from hook:
  ```jsx
  const { switchProject } = useChat()
  ```
- [ ] Add useEffect to join project chat:
  ```jsx
  useEffect(() => {
    switchProject(projectId)
  }, [projectId, switchProject])
  ```

### Step 4: Update Environment Variables
- [ ] Check `.env` or `.env.local` in frontend folder
- [ ] Ensure `VITE_API_BASE_URL` is set:
  ```
  VITE_API_BASE_URL=http://localhost:5000
  ```
- [ ] (Adjust port if backend runs on different port)

### Step 5: Test Backend Connection
- [ ] Verify backend is running:
  ```bash
  cd backend
  npm run dev
  ```
- [ ] Check console logs for "Server running on port 5000"

### Step 6: Start Frontend
- [ ] In new terminal, start frontend:
  ```bash
  cd frontend
  npm run dev
  ```
- [ ] Open browser at the provided URL (usually http://localhost:5173 or 5174)

## 🧪 Testing Steps

### Test 1: Connection
- [ ] Open browser console (F12)
- [ ] Look for "Socket connected: [socket-id]"
- [ ] No auth errors should appear

### Test 2: Single User Chat
- [ ] Log in to app
- [ ] Navigate to a project
- [ ] Chat panel should appear (floating button in bottom-right)
- [ ] Click button to open chat
- [ ] Type a message
- [ ] Message should appear in chat window

### Test 3: Two Users Chat
- [ ] Open app in two different browser windows/tabs (or use incognito)
- [ ] Log in as User A in first window
- [ ] Log in as User B in second window
- [ ] Both navigate to the SAME project
- [ ] User A sends message
- [ ] Message appears in User B's chat (in real-time)
- [ ] User B sends reply
- [ ] Message appears in User A's chat

### Test 4: Typing Indicator
- [ ] Keep both browsers open with same project
- [ ] User A starts typing (focus on chat input)
- [ ] User B should see "User A is typing..." with animated dots
- [ ] User A finishes typing
- [ ] Typing indicator disappears after 2 seconds

### Test 5: Disconnect/Reconnect
- [ ] Disable network in DevTools
- [ ] Chat should show "Connecting..."
- [ ] Re-enable network
- [ ] Chat should reconnect automatically

## 🐛 Troubleshooting

### Socket Not Connecting
```
❌ Error: "Failed to get property 'emit' of undefined"
✅ Solution: Ensure ChatProviderComponent wraps your app
```

```
❌ Error: "VITE_API_BASE_URL is not defined"
✅ Solution: Add to .env file and restart dev server
```

```
❌ Error: "Unauthorized" in socket connection
✅ Solution: Check JWT token is being passed correctly
```

### Messages Not Appearing
```
❌ Nothing happens when sending message
✅ Solution: Check activeProjectId is set (not null)
```

```
❌ Messages from other users not showing
✅ Solution: Verify both users are in same project
```

### UI Not Appearing
```
❌ No chat button visible
✅ Solution: Check ChatPanel is added to layout
```

```
❌ Chat button visible but frozen
✅ Solution: Check socket connection status in console
```

## 📋 Files Modified/Created

### Created Files
- [x] `src/utils/socket.js` - Socket utility functions
- [x] `src/context/chat.context.js` - Context definition
- [x] `src/context/ChatProvider.jsx` - Provider component
- [x] `src/hooks/useChat.js` - Custom hook
- [x] `src/components/chat/ChatWindow.jsx` - Chat UI
- [x] `src/components/chat/ChatPanel.jsx` - Floating panel
- [x] `src/examples/CHAT_INTEGRATION_EXAMPLE.jsx` - Examples
- [x] `docs/CHAT_INTEGRATION.md` - Full documentation
- [x] `CHAT_SETUP_SUMMARY.md` - This setup guide

### Files to Modify
- [ ] `src/App.jsx` - Add ChatProvider wrapper
- [ ] `src/components/layout/AppLayout.jsx` - Add ChatPanel
- [ ] `src/pages/projects/ProjectDetails.jsx` - Add switchProject

## 🔒 Security Checklist

- [x] JWT authentication on socket connection
- [x] Room-based message access (project-scoped)
- [x] Auto-reconnection with token refresh
- [x] Error handling for auth failures

## 🎨 UI/UX Features

- [x] Floating chat panel (minimizable)
- [x] Message timestamps
- [x] User names in messages
- [x] Different styling for sent/received messages
- [x] Typing indicators with animation
- [x] Connection status indicator
- [x] Auto-scroll to latest message
- [x] Responsive design
- [x] Dark mode support
- [x] Disabled send button when disconnected

## 📚 Documentation

- [x] Full integration guide
- [x] API reference
- [x] Code examples
- [x] Troubleshooting section
- [x] Architecture diagram

## 🚀 Ready to Deploy

When ready to deploy:

- [ ] Test on production backend URL
- [ ] Update `VITE_API_BASE_URL` for production
- [ ] Enable HTTPS for socket connection
- [ ] Set `secure: true` in socket.io connection
- [ ] Configure CORS properly for production domain

## 📞 Support

If you encounter issues:

1. Check console logs (F12 → Console tab)
2. Verify socket is connected
3. Check backend is running
4. Review troubleshooting section
5. Check network tab for socket events

## ✨ Next Steps (Future)

- [ ] Add message persistence to database
- [ ] Add message search
- [ ] Add emoji reactions
- [ ] Add file sharing
- [ ] Add user avatars
- [ ] Add notifications
- [ ] Add voice/video calls
- [ ] Add message editing/deletion

---

**Status**: ✅ All preparation complete - Ready for integration!

**Estimated Integration Time**: 5-10 minutes
