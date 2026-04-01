# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS deps
WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:22-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache tini

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node backend/package*.json ./
COPY --chown=node:node backend/src ./src
RUN mkdir -p /app/public /app/uploads && chown -R node:node /app/public /app/uploads

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
  PORT=3000

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/health" >/dev/null 2>&1 || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/server.js"]