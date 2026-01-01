<div align="center">
	<h1>Task Manager</h1>
	<p>Full‑stack task management with projects, roles, comments, files, real‑time updates, and Redis caching.</p>
</div>

## Overview

- Backend: Node.js/Express, MySQL, JWT auth with refresh tokens, role-based access, Socket.IO events, Redis cache, rate limiting, file uploads (multer), migrations auto-run on boot.
- Frontend: React + Vite, Axios API client, Auth and Chat providers, Tailwind pipeline.

## Features

- Projects and membership roles (manager, project_manager, member)
- Tasks with history, status transitions, assignments, and per-project listings
- Comments on tasks with realtime events
- File uploads scoped to projects/tasks
- JWT auth (access + refresh) with cookie support
- Redis caching for hot reads (`X-Cache: HIT|MISS` headers)
- Rate limiting on auth endpoints (configurable/disableable)
- CORS allowlist and secure cookie settings
- Health checks (`/` and `/health/redis`)

## Prerequisites

- Node.js 18+
- MySQL 8+ (or compatible)
- Redis 7+ (local Docker or hosted)

## Quickstart

```bash
git clone https://github.com/VanshGolakiya-2910/Taskmanger.git
cd Taskmanger/backend
npm install
cp .env.sample .env   # fill secrets and DB creds
npm run dev           # runs migrations, starts API

# in another terminal
cd ../frontend
npm install
cp .env.sample .env
npm run dev           # opens http://localhost:5173
```

## Environment configuration

- Backend sample: [backend/.env.sample](backend/.env.sample)
- Frontend sample: [frontend/.env.sample](frontend/.env.sample)

Key backend variables:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (32+ chars)
- `ALLOWED_ORIGINS` (comma-separated)
- `REDIS_URL`
- `AUTH_RATE_LIMIT_MAX`, `AUTH_RATE_LIMIT_DISABLE`
- `PORT`, `NODE_ENV`

Key frontend variable:
- `VITE_API_URL` (e.g., http://localhost:5000/api/v1)

## Caching

- Cached: user profile, user lists, project list, project members/details, task lists, task-by-id, task comments.
- Invalidation on writes: task create/update/delete/status change, comment create, project membership changes, user changes.
- Inspect with `X-Cache` header or `redis-cli monitor`.

## Health and observability

- Liveness: `/`
- Redis: `/health/redis`
- Cache visibility: `X-Cache: HIT|MISS` on cached endpoints

## Scripts

- Backend: `npm run dev` (nodemon), `npm start` (prod)
- Frontend: `npm run dev`, `npm run build`

## Operational notes

- Rate limiting: disabled in development; enable/tune via env for production.
- CORS: set `ALLOWED_ORIGINS` to your deployed frontend domains.
- Cookies: `httpOnly`, `sameSite=lax`, `secure` in production.
- Migrations: auto-run on server start.
- File uploads: stored under `uploads/`; ensure writable volume in production.

## Troubleshooting

- Redis connection refused: start Redis or point `REDIS_URL` to a reachable host.
- 429 on auth: increase `AUTH_RATE_LIMIT_MAX` or set `AUTH_RATE_LIMIT_DISABLE=true` in dev.
- CORS blocked: configure `ALLOWED_ORIGINS`.

## License

MIT
