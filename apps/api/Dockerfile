FROM node:20-slim

RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libgtk-3-0 \
  libnss3 \
  libxss1 \
  libxtst6 \
  wget \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN corepack enable
RUN pnpm install

RUN DATABASE_URL="postgresql://dummy:dummy@127.0.0.1:5432/dummy" pnpm --filter api build

WORKDIR /app/apps/api

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/server.js"]