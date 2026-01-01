# Task Manager Frontend

React + Vite client for the Task Manager app. Provides authentication, project/task views, comments, file upload, and integrates with the backend API.

## Prerequisites

- Node.js 18+

## Setup

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Run

```bash
npm run dev
# opens on http://localhost:5173
```

## Build

```bash
npm run build
```

## Notes

- Auth tokens are handled via cookies/headers; ensure backend CORS `ALLOWED_ORIGINS` includes your frontend origin.
- The backend exposes `X-Cache` headers when Redis serves cached responses.
