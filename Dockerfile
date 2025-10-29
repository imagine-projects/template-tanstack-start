FROM node:22-slim AS template
RUN npm install -g bun
WORKDIR /template
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM appwrite/imagine-synapse-server:latest AS base
WORKDIR /app
RUN git init
COPY --from=template /template/node_modules /app/node_modules

WORKDIR /usr/src/synapse
ENV FS_ROOT_PATH=/app
