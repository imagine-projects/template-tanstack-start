FROM appwrite/sandbox-template-utils:latest AS base

RUN apt-get update && apt-get install -y git lsof tree curl
RUN npm install -g bun@1.3.1 pm2

WORKDIR /home/user/app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

WORKDIR /home/user/utils

CMD ["bun", "run", "start:pm2"]