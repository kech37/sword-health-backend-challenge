FROM node:18.18-alpine AS builder
RUN apk --no-cache add ca-certificates

WORKDIR /root/service

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY src ./src

# Install the whole project
RUN npm ci --verbose

# Build the code
RUN npm run build --verbose

# Remove dev dependencies
RUN npm prune --omit=dev

# Build the resulting image
FROM node:18.18-alpine
RUN apk --no-cache add ca-certificates

WORKDIR /root/service

## Copy the service sources
COPY --from=builder /root/service/dist ./
## Copy the dependencies
COPY --from=builder /root/service/node_modules ./node_modules/

EXPOSE 3000