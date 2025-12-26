FROM appwrite/sandbox-template-utils:latest AS base

RUN apt-get update && apt-get install -y git lsof tree curl
RUN npm install -g bun pm2

WORKDIR /home/user/app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

WORKDIR /home/user/utils