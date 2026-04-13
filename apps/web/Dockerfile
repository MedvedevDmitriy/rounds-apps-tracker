FROM node:20-slim

WORKDIR /app

COPY . .

RUN corepack enable
RUN pnpm install

# Vite inlines VITE_* at build time — set VITE_API_URL in Railway (Build + Deploy)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Monorepo: lockfile at repo root. Single-package (only apps/web copied): build here.
RUN if [ -f apps/web/package.json ]; then \
      pnpm --filter web build; \
    else \
      pnpm run build; \
    fi

RUN npm install -g serve

EXPOSE 3000

CMD ["sh", "-c", "if [ -f /app/apps/web/package.json ]; then cd /app/apps/web; else cd /app; fi && serve -s dist -l ${PORT:-3000}"]
