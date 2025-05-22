# Stage 1: Build dependencies
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (leverage caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source files
COPY . .

# Stage 2: Create production image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy app from builder stage
COPY --from=builder /app /app

# Set proper ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the port used in app.js (adjust if different)
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
