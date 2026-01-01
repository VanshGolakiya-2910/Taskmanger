# Chat Connection - Troubleshooting Guide

## ✅ Fix Applied

The issue was that Socket.io needed a separate URL from the REST API:
- **REST API** uses: `http://localhost:5000/api/v1`
- **Socket.io** needs: `http://localhost:5000`

**Solution**: 
- Added new environment variable `VITE_SOCKET_URL` for Socket.io
- Kept original `VITE_API_BASE_URL` for REST API calls
- Updated `socket.js` to use `VITE_SOCKET_URL`

## ✅ Environment Variables

**Frontend `.env`:**
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

This way:
- All REST API calls use `VITE_API_BASE_URL` (with /api/v1 path)
- Socket.io connection uses `VITE_SOCKET_URL` (without path)

## 🚀 Complete Fresh Start

If nothing works, do a complete restart:

```bash
# 1. Kill all node processes
pkill -f "node"

# 2. Stop any dev servers
# (Ctrl+C if they're still running in terminals)

# 3. Clear all caches
cd frontend
rm -rf node_modules/.vite

cd ../backend
rm -rf node_modules

# 4. Reinstall dependencies
npm install

# 5. Start backend in Terminal 1
npm run dev

# 6. Wait 5 seconds for backend to be ready

# 7. Start frontend in Terminal 2
npm run dev

# 8. Open http://localhost:5173 and test
```

## 📊 What Should Happen

```
1. You click Chat button
   ↓
2. ChatPanel component mounts
   ↓
3. useChat hook checks activeProjectId
   ↓
4. If project ID exists, ChatWindow renders
   ↓
5. Socket.io tries to connect
   ↓
6. Browser sends auth token
   ↓
7. Backend Socket.io middleware validates token
   ↓
8. Connection accepted ✅
   ↓
9. "Connected!" message appears (green dot)
   ↓
10. You can start chatting! 💬
```

If it stops at step 5-7, that's a connection issue.

## 📋 Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] `.env` has correct `VITE_API_BASE_URL`
- [ ] Logged in to app (have access token)
- [ ] In a project (activeProjectId set)
- [ ] Chat button visible
- [ ] Browser console shows "Socket connected"
- [ ] Green dot appears (connected status)
- [ ] Can type and send messages

## 🎯 Quick Fix Summary

If you just applied the changes:

1. **Kill frontend dev server** (Ctrl+C)
2. **Clear cache**: `rm -rf node_modules/.vite`
3. **Restart frontend**: `npm run dev`
4. **Hard refresh browser**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
5. **Try chat again**

## 💬 Still Not Working?

Check these in order:

1. **Backend logs** - Any error messages?
2. **Browser console** - Any error messages?
3. **Network tab** (F12) - Do you see WebSocket connection attempt?
4. **Ports** - Is something else using port 5000?
5. **Firewall** - Blocking localhost connections?

## 🔗 Useful Commands

```bash
# Check if port 5000 is in use
lsof -i :5000

# Check if port 5173 is in use
lsof -i :5173

# Kill process on port 5000
kill -9 $(lsof -t -i:5000)

# Test backend is running
curl http://localhost:5000

# View backend logs (if running in screen/tmux)
# Look at the terminal where you ran npm run dev
```

---

**The fix is applied. Now:**
1. Make sure backend is running
2. Restart frontend dev server
3. Hard refresh browser
4. Try chat again

If it still says "Connecting...", check the browser console (F12) for error messages and share them!
