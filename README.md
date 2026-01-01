<div align="center">
  <h1>Task Manager</h1>
  <p>Full-stack task management with projects, real-time chat, roles, comments, files, and Redis caching.</p>
</div>

## Overview

Production-ready collaboration platform with secure auth, caching, and real-time chat.

- **Backend**: Node.js/Express, MySQL, JWT (access + refresh), Socket.IO, Redis cache, rate limiting, multer uploads, migrations auto-run on boot.
- **Frontend**: React + Vite, Tailwind CSS, Axios, Context API (Auth, Chat, Toast), WebSocket integration.

## Features

### Core Management
- Projects and membership roles (`manager`, `project_manager`, `member`)
- Tasks with history, status transitions, assignments, priorities
- Comments on tasks with realtime updates
- File attachments scoped to projects/tasks

### Real-Time Collaboration
- Project chat rooms (per-project private channels)
- Instant messaging, typing indicators, user presence, auto-join/leave rooms
- Floating/minimizable chat UI

### Performance & Security
- Redis caching for hot reads (`X-Cache: HIT|MISS`)
- JWT with refresh rotation and HTTP-only cookies
- Configurable auth rate limiting
- CORS allowlist, Helmet security headers

## Prerequisites


If Redis is unreachable, server startup will fail (with a clear hint). Start a local Redis (e.g., `docker run -p 6379:6379 redis:7-alpine`) or set `REDIS_URL` to a reachable host.
## Quickstart

```bash
git clone https://github.com/VanshGolakiya-2910/Taskmanger.git

# Backend
cd Taskmanger/backend
npm install
cp .env.sample .env   # fill DB creds and secrets
npm run dev           # runs migrations, starts API

# Frontend (new terminal)
cd ../frontend
npm install
cp .env.sample .env   # set VITE_API_URL
npm run dev           # opens http://localhost:5173
```

## Environment

- Backend template: [backend/.env.sample](backend/.env.sample)
- Frontend template: [frontend/.env.sample](frontend/.env.sample)

### Backend keys
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (32+ chars)
- `JWT_ACCESS_EXPIRES`, `JWT_REFRESH_EXPIRES` (optional)
- `REDIS_URL`
- `ALLOWED_ORIGINS` (comma-separated)
- `AUTH_RATE_LIMIT_MAX`, `AUTH_RATE_LIMIT_DISABLE`
- `PORT`, `NODE_ENV`
- `UPLOAD_DIR`

### Frontend keys
- `VITE_API_URL` (e.g., http://localhost:5000/api/v1)
- `VITE_SOCKET_URL` (optional, defaults to API origin if omitted)

## Caching strategy

- Cached: user profile, user lists, project list, project members/details, task lists, task-by-id, task comments.
- Invalidation: on task create/update/delete/status change, comment create, project membership changes, user changes.
- Inspect: `X-Cache` header or `redis-cli monitor`.

## Real-time architecture

- Socket.IO with authenticated handshake.
- Rooms: `project:{id}` auto-join/leave.
- Events: `chat:message`, `chat:typing`, plus project/task events for UI updates.

## Health & observability

- Liveness: `/`
- Redis: `/health/redis`
- Cache visibility: `X-Cache: HIT|MISS`

## Scripts

- Backend: `npm run dev`, `npm start`
- Frontend: `npm run dev`, `npm run build`

## Operational notes

- Rate limiting: disabled in development by env; tune for production.
- CORS: set `ALLOWED_ORIGINS` to deployed frontend domains.
- Cookies: `httpOnly`, `sameSite=lax`, `secure` in production.
- Migrations: auto-run on server start.
- Uploads: stored under `uploads/`; mount/persist in production.

## Troubleshooting

- Redis connection refused: start Redis or update `REDIS_URL`.
- 429 on auth: raise `AUTH_RATE_LIMIT_MAX` or set `AUTH_RATE_LIMIT_DISABLE=true` in dev.
- CORS blocked: configure `ALLOWED_ORIGINS`.

## License

MIT
