# Development Environment Setup Guide

## Quick Start (Localhost)

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend will run on: `http://localhost:5000`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: `http://localhost:5173`

**Make sure `.env.local` has:**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

---

## Multi-Machine / Kali VM Setup

### For Kali VM accessing Ubuntu host:

**Frontend (.env.local):**
```env
VITE_API_BASE_URL=http://10.0.2.2:5000/api/v1
VITE_SOCKET_URL=http://10.0.2.2:5000
```

**Backend (.env):**
- No changes needed, already listens on `0.0.0.0:5000` in dev mode

---

### For network access from another machine:

**Find your machine IP:**
```bash
hostname -I  # Linux/Ubuntu
ipconfig     # Windows
ifconfig     # macOS
```

**Frontend (.env.local):**
```env
VITE_API_BASE_URL=http://<YOUR_IP>:5000/api/v1
VITE_SOCKET_URL=http://<YOUR_IP>:5000
```

**Backend (.env):**
- Ensure `NODE_ENV` is NOT set to `production`
- The server listens on `0.0.0.0:5000` in development

---

## Troubleshooting

### Frontend can't reach backend
1. Check `.env.local` has correct backend URL
2. Ensure backend is running: `npm run dev` in `/backend`
3. Check if using correct IP for your network setup
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

### CORS errors
- In development, CORS is allowed for all origins
- Ensure `NODE_ENV` is not `production`

### WebSocket not connecting
- Make sure `VITE_SOCKET_URL` matches your backend URL
- Clear browser cache and restart

### Backend not accessible from VM/Network
- Check backend is listening on `0.0.0.0` (not just `127.0.0.1`)
- Verify firewall allows port 5000
- Check correct IP address in frontend `.env.local`

---

## Environment Files Summary

- **frontend/.env.local** - Frontend API/Socket URLs (development)
- **frontend/.env.example** - Reference for all possible configurations
- **backend/.env** - Backend environment variables (if present)

Always update the `VITE_API_BASE_URL` and `VITE_SOCKET_URL` in frontend `.env.local` based on where your backend is running.
