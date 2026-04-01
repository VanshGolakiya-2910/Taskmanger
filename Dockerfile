# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS deps
WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:22-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache tini mariadb mariadb-client redis && \
  mkdir -p /app/data/mysql /app/run /app/public /app/uploads && \
  chown -R node:node /app

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node backend/package*.json ./
COPY --chown=node:node backend/src ./src
COPY --chown=node:node docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENV NODE_ENV=production \
  HOST=0.0.0.0 \
  PORT=3000 \
  DB_SOCKET=/app/run/mysqld.sock \
  DB_HOST=127.0.0.1 \
  DB_PORT=3306 \
  DB_NAME=taskmanager \
  DB_USER=taskmanager \
  DB_PASSWORD=taskmanager \
  REDIS_URL=redis://127.0.0.1:6379

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/health" >/dev/null 2>&1 || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/app/docker-entrypoint.sh"]