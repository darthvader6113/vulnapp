FROM node:20

WORKDIR /app

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV PATH="/app/node_modules/.bin:$PATH"

# 1. Install dependencies inside container
COPY package*.json ./
RUN npm install

# 2. Copy source code explicitly (never copies host node_modules or .next)
COPY tsconfig.json next.config.mjs tailwind.config.ts postcss.config.js next-env.d.ts* ./
COPY public ./public
COPY src ./src

# Ensure public/uploads folder exists
RUN mkdir -p public/uploads

# 3. Build using npm
RUN npm run build

EXPOSE 3000

# 4. Start with npm
CMD ["npm", "start"]
