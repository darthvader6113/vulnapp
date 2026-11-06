FROM node:20-slim AS builder
WORKDIR /app

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# 1. Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# 2. Copy application source
COPY . .

# Ensure uploads directory exists
RUN mkdir -p public/uploads

# 3. Build standalone Next.js production bundle directly with Node
RUN node node_modules/next/dist/bin/next build

# Production runner stage
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Setup non-root user and persistent uploads directory
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 nextjs && \
    mkdir -p /app/public/uploads && \
    chown -R nextjs:nodejs /app/public/uploads

# Copy built standalone bundle and assets from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
