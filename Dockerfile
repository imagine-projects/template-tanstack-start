FROM appwrite/synapse-server:latest AS base
RUN apt-get update && apt-get install -y git
RUN npm install -g pnpm
RUN apt-get update && apt-get install -y lsof
RUN apt-get install -y curl

WORKDIR /template
COPY pm2.config.cjs ./

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

WORKDIR /turborepo
ENV FS_ROOT_PATH=/app

