FROM node:20-alpine AS base

ARG NODE_ENV=development

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache gcompat
# Set working directory
WORKDIR /app
RUN yarn global add turbo
# RUN yarn global add serve
COPY . .
RUN turbo prune @monorepo/admin --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache gcompat
WORKDIR /app

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN corepack enable
RUN yarn set version berry
RUN yarn install

# Build the project and install dependencies
COPY --from=builder /app/out/full/ .

COPY ./apps/admin/.env.$NODE_ENV /app/apps/admin/.env.$NODE_ENV

RUN yarn workspaces foreach -pt --all --include=libs/* run build
RUN NODE_OPTIONS="--max-old-space-size=4096" yarn workspace @monorepo/admin build --mode $NODE_ENV

CMD ["yarn", "workspace", "@monorepo/admin", "preview"]