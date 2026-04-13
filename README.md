# Rounds Apps Tracker

You add Google Play listing URLs; the backend grabs screenshots of those pages on a schedule and the UI shows them in a simple timeline (newest first). Built with Node, React, TypeScript, Postgres, Prisma, Puppeteer.

---

## Run it locally (easiest)

Need Docker.

```bash
docker compose up --build
```

Then open **http://localhost:5173** — that’s the app. The API is on **http://localhost:3000** (`/health` checks it’s up). First run applies DB migrations; screenshots are saved under `apps/api/data/`.

---

## Run without Docker

Install deps from the repo root: `corepack enable && pnpm install`.

1. Postgres running, `DATABASE_URL` set (see `apps/api/.env.example`).
2. API: `cd apps/api && pnpm exec prisma migrate deploy && pnpm dev`
3. Web: `cd apps/web`, copy `.env.example` → `.env` (or set `VITE_API_URL=http://localhost:3000`), then `pnpm dev`
4. Open **http://localhost:5173**

---

## Env files

- **API:** `apps/api/.env` — mainly `DATABASE_URL`, optional `PORT` (defaults to 3000).
- **Web:** `apps/web/.env` — `VITE_API_URL` = where the browser should call the API (local: `http://localhost:3000`). For the Docker Compose web image this is set at build in `docker-compose.yml`, not from `.env`.

---

## How it’s deployed (Railway)

There are **two services** from this repo: **API** and **web**, plus managed **Postgres**.

- API: Dockerfile `apps/api/Dockerfile`, env **`DATABASE_URL`** from the DB, **`PORT`** is whatever Railway sets (the app listens on `process.env.PORT`).
- Web: Dockerfile `apps/web/Dockerfile`, env **`VITE_API_URL`** = your **public API URL** (https://…), set for **build** so Vite bakes it into the bundle. CORS on the API allows your frontend origin.

**What to open in the browser:** the **web** service public URL (your SPA). The API URL is only for API calls from that page, not something you browse for the UI.

---

Rounds take-home — single user, no login.
