# Stage 1: install dependencies
FROM node:22-alpine AS deps
WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

# Stage 2: build
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./

# Next.js rewrites are resolved during build, so API_URL must exist here.
ARG API_URL=http://localhost:3000
ENV API_URL=${API_URL}

# garante que public exista para o COPY final
RUN mkdir -p /app/public
RUN npm run build

# Stage 3: production runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ARG API_URL=http://localhost:3000
ENV API_URL=${API_URL}

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 5000
CMD ["node", "server.js"]