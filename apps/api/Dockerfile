FROM node:20-slim

# puppeteer deps
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
RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/api

RUN pnpm prisma generate
RUN pnpm build

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

CMD ["node", "dist/main.js"]