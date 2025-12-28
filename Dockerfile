FROM ghcr.io/appwrite-labs/imagine-sandbox-utils:branch-main AS base

WORKDIR /home/user/app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

WORKDIR /home/user/utils

CMD ["bun", "run", "start:pm2"]