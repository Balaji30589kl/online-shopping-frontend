# Dockerfile for React + Vite frontend
# NOTE: GitHub Actions workflow uses the following secrets for Docker Hub:
# - DOCKERHUB_USERNAME: Your Docker Hub username
# - DOCKERHUB_TOKEN: A Docker Hub access token or password

# -------- Builder Stage --------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
# Prefer npm ci when lockfile exists, fallback to npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source and build
COPY . .
RUN npm run build

# -------- Runtime Stage --------
FROM nginx:stable-alpine AS runtime

# Copy Vite build output to nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose nginx default port
EXPOSE 80

# Healthcheck (optional but useful locally)
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:80/ >/dev/null || exit 1

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
