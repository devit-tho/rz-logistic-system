FROM node:20-alpine AS base

FROM base AS builder

RUN apk update
RUN apk add --no-cache gcompat

WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo telemetry enable
RUN turbo prune @monorepo/backend --docker

FROM base AS installer
RUN apk update
RUN apk add --no-cache gcompat
WORKDIR /app

# Set up Yarn berry
COPY --from=builder /app/out/json/ .
RUN corepack enable
RUN yarn set version berry
RUN yarn install

# Build the app
COPY --from=builder /app/out/full/ .
RUN yarn turbo build

# Start the app
CMD ["node", "apps/backend/dist/main.js"]