FROM node:20-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Copy project files (respects .dockerignore)
COPY . .

# Ensure public/uploads folder exists
RUN mkdir -p public/uploads

# Install dependencies inside the container
RUN npm install --no-audit

# Build the application using npm
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

CMD ["npm", "start"]
