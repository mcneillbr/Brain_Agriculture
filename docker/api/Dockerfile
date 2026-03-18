# ─── Stage 1: build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (cache layer)
COPY package*.json ./
RUN npm ci --ignore-scripts

# Compile TypeScript
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# ─── Stage 2: production runner ───────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy compiled output
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
