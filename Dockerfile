FROM node:20

WORKDIR /app

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Ensure public/uploads exists
RUN mkdir -p public/uploads

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
