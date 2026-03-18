# ─── Stage 1: install dependencies ───────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

# ─── Stage 2: build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./

# next.config.js uses output: 'standalone' — build produces .next/standalone/
RUN npm run build

# ─── Stage 3: production runner ───────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Standalone server + static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public 2>/dev/null || true

EXPOSE 5000

# next start standalone server
CMD ["node", "server.js"]
