# Multi-stage build for fullstack deployment
FROM node:20-alpine AS builder

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

# In production, API is on same origin — default /api works
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./
RUN npm install --omit=dev

COPY backend/ ./

# Copy frontend build into backend's public dir
COPY --from=builder /app/frontend/build ./public

EXPOSE 8080
ENV PORT=8080

CMD ["node", "server.js"]
