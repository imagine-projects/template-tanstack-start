FROM appwrite/sandy-sandbox:latest AS base
RUN apt-get update && apt-get install -y git
RUN npm install -g bun
RUN npm install -g turbo@^2
RUN apt-get update && apt-get install -y lsof
RUN apt-get install -y curl

WORKDIR /template
COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

RUN cp -r /template/node_modules /app/node_modules

ENV FS_ROOT_PATH=/app
WORKDIR /turborepo

