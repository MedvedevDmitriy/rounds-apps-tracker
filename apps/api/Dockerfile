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

ENV DUMMY_DATABASE_URL=postgresql://dummy:dummy@127.0.0.1:5432/dummy

# Monorepo (Railway root = repo): apps/api exists. Single-package (Railway root = apps/api): package lives at /app.
RUN if [ -f apps/api/package.json ]; then \
      DATABASE_URL="$DUMMY_DATABASE_URL" pnpm --filter api build; \
    else \
      DATABASE_URL="$DUMMY_DATABASE_URL" pnpm run build; \
    fi

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

CMD ["sh", "-c", "if [ -f /app/apps/api/package.json ]; then cd /app/apps/api; else cd /app; fi && pnpm start"]
