# -----------------------------------------------------------------------------
# Web image: Vite production build served with `serve` (static SPA).
# -----------------------------------------------------------------------------

FROM node:20-slim

WORKDIR /app

# Monorepo root expected: includes pnpm-lock.yaml and workspace packages.
COPY . .

# Enable pnpm (matches packageManager in package.json).
RUN corepack enable

# Docker build has no TTY; pnpm otherwise aborts when it would purge node_modules.
ENV CI=true

# Install workspace dependencies so we can run `pnpm --filter web build`.
RUN pnpm install

# Vite replaces import.meta.env.VITE_* at build time; this must be set when the
# image is built (e.g. Railway env or docker compose build.args). Browser calls
# this URL to reach the API from the user machine.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Produce optimized static files under apps/web/dist (or ./dist if context is apps/web only).
RUN if [ -f apps/web/package.json ]; then \
      pnpm --filter web build; \
    else \
      pnpm run build; \
    fi

# Lightweight static file server for the SPA (single binary, good for containers).
RUN npm install -g serve

# Document the default port; Railway and docker-compose set PORT at runtime.
EXPOSE 3000

# Serve the built assets; PORT is set by the platform (Railway) or compose mapping.
CMD ["sh", "-c", "if [ -f /app/apps/web/package.json ]; then cd /app/apps/web; else cd /app; fi && serve -s dist -l ${PORT:-3000}"]
