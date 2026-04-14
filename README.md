# Rounds Apps Tracker

You add Google Play listing URLs; the backend takes screenshots on a schedule and on demand (Puppeteer), and the UI shows a feed (newest first). Stack: Node, React, TypeScript, Postgres, Prisma.

**Demo:** [https://apps-tracker.up.railway.app/](https://apps-tracker.up.railway.app/)

## Local

**Docker:** from the repo root, `docker compose up --build` → UI [http://localhost:5173](http://localhost:5173), API [http://localhost:3000](http://localhost:3000) (`GET /health`). Screenshots are stored under `apps/api/data/`.

**Without Docker:** `pnpm install` at the repo root. Copy `apps/api/.env.example` → `apps/api/.env` and `apps/web/.env.example` → `apps/web/.env`, run Postgres, then `cd apps/api && pnpm exec prisma migrate deploy && pnpm dev` and in another terminal `cd apps/web && pnpm dev`.

API tests: `pnpm --filter api test`.

## Deploy

On **Railway**: two services from this repo (**api** and **web**) plus Postgres. Dockerfiles: `apps/api/Dockerfile`, `apps/web/Dockerfile`. Open the **web** service public URL in the browser; the API URL is only for requests from the frontend.

## API and config

- **Routes:** `POST /apps` (body: Google Play URL), `GET /apps`, `GET /apps/:id`, `PATCH /apps/:id` (optional `url` / `title`), `DELETE /apps/:id`, `POST /apps/:id/capture`, `GET /health`.
- **Environment:** see `apps/api/.env.example` and `apps/web/.env.example` — copy to `.env` and adjust if needed.

Single user, no login (take-home).
