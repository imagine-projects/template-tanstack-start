FROM appwrite/imagine-sandy-server:latest AS base

WORKDIR /tmp/template
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

WORKDIR /usr/src/sandy
ENV FS_ROOT_PATH=/app

CMD ["bun", "run", "src/server/server.ts"]