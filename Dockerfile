# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build Vite frontend for production
RUN npm run build

# Expose port (default 5000 or PORT env)
EXPOSE 5000

# Set environment variable
ENV NODE_ENV=production

# Start Node signaling server & static frontend host
CMD ["node", "server.js"]
