# -----------------------------------------------------------------------------
# API image: Express + Prisma (PostgreSQL via @prisma/adapter-pg) + Puppeteer
# for periodic screenshots of Google Play listing pages.
# -----------------------------------------------------------------------------

FROM node:20-slim

# Install Chromium and OS libraries Puppeteer needs to run headless Chrome in
# a minimal Debian image (screenshots of Play Store URLs).
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

# All following paths are relative to this directory inside the container.
WORKDIR /app

# Copy the repository (build context should be the monorepo root so pnpm-lock
# and pnpm-workspace.yaml are available).
COPY . .

# Activate the pnpm version pinned in package.json (Corepack ships with Node).
RUN corepack enable

# Docker build has no TTY; pnpm otherwise aborts when it would purge node_modules.
ENV CI=true

# prisma.config.ts reads DATABASE_URL when `prisma generate` runs. That happens
# during `pnpm install` via the api package "prepare" script — before any real DB exists.
# A placeholder is enough; no connection is made at generate time.
ENV DATABASE_URL=postgresql://dummy:dummy@127.0.0.1:5432/dummy

# Install dependencies for the whole workspace; the api package is built via --filter.
RUN pnpm install

# Generate Prisma Client and compile TypeScript to dist/.
# Supports either full monorepo layout (/app/apps/api) or service-only root (/app).
RUN if [ -f apps/api/package.json ]; then \
      pnpm --filter api build; \
    else \
      pnpm run build; \
    fi

# Point Puppeteer at the system Chromium we installed (smaller than bundled Chrome).
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Start: prisma migrate deploy && node dist/server.js (see package.json "start").
# cd selects the api package folder whether the image was built from monorepo or apps/api only.
CMD ["sh", "-c", "if [ -f /app/apps/api/package.json ]; then cd /app/apps/api; else cd /app; fi && pnpm start"]
