FROM node:20-slim AS builder
WORKDIR /app

# Ensure devDependencies are installed and local node_modules binaries are in PATH
ENV NODE_ENV=development
ENV PATH="/app/node_modules/.bin:$PATH"

# Copy package manifests
COPY package.json package-lock.json* ./

# Install all dependencies directly in Linux
RUN npm install

# Copy project source files explicitly (prevents accidentally copying Windows host node_modules/.bin)
COPY tsconfig.json next.config.mjs tailwind.config.ts postcss.config.js next-env.d.ts* ./
COPY public ./public
COPY src ./src

ENV NEXT_TELEMETRY_DISABLED=1
RUN npx next build

# Production runner stage
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user and persistent uploads directory
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 nextjs && \
    mkdir -p /app/public/uploads && \
    chown -R nextjs:nodejs /app/public/uploads

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
