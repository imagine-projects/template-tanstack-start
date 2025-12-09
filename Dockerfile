FROM appwrite/imagine-sandy-server:latest AS base

WORKDIR /tmp/template
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Ensure clean git status, reset any changes
RUN git reset --hard
RUN git clean -f -d

# Rename origin remote to template
RUN git remote rename origin template

WORKDIR /usr/src/sandy
ENV FS_ROOT_PATH=/app

CMD ["bun", "run", "src/server/server.ts"]