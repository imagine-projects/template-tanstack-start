FROM appwrite/imagine-sandy-server:latest AS base

RUN mkdir -p /home/user/app

WORKDIR /home/user/template
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

WORKDIR /home/user/sandy

CMD ["bun", "run", "src/server/server.ts"]