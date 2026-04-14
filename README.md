# Rounds Apps Tracker

A small full-stack app for tracking Google Play store listings: you register an app URL, the backend can capture listing screenshots on demand or on a schedule (headless Chromium via Puppeteer), and the UI shows each app with a reverse-chronological screenshot history.

**Stack:** TypeScript, Express, React (Vite), PostgreSQL, Prisma. No accounts—single-user style.

---

## Run the full stack in Docker (local)

From the **repository root** (where `docker-compose.yml` lives):

```bash
pnpm install
pnpm compose:up
# same as: docker compose up --build
```

- **Web UI:** [http://localhost:5173](http://localhost:5173) (static production build of the SPA, served from the `web` container).
- **API:** [http://localhost:3000](http://localhost:3000) — e.g. `GET /health` for a quick check.
- **PostgreSQL:** exposed on `localhost:5432` (default user/db/password match `docker-compose.yml`).
- **Screenshot files** are persisted on the host under `apps/api/data/` (mounted into the API container).

Stop with `Ctrl+C` or `docker compose down`.

---

## Local development (hot reload)

Use this when you want Vite HMR and `tsx` for the API instead of rebuilding images.

1. **Install dependencies** (repo root):

   ```bash
   pnpm install
   ```

2. **Environment files** — copy the examples and adjust if needed:

   | Copy | To |
   |------|-----|
   | [`apps/api/.env.example`](apps/api/.env.example) | `apps/api/.env` |
   | [`apps/web/.env.example`](apps/web/.env.example) | `apps/web/.env` |

   For a database matching Docker Compose, `DATABASE_URL` in `apps/api/.env` should point at Postgres on `localhost:5432` (see comments in the example). `apps/web/.env` sets `VITE_API_URL` (no trailing slash) so the browser can call the API—usually `http://localhost:3000` when the API runs on the host.

3. **Start Postgres** (once per machine/session):

   ```bash
   docker compose up -d --wait db
   ```

4. **Apply migrations** (first run or after schema changes):

   ```bash
   cd apps/api && pnpm exec prisma migrate deploy && cd ../..
   ```

5. **Run API + web together** (from repo root):

   ```bash
   pnpm dev
   ```

   This waits for the `db` service, then starts `api` and `web` dev servers in parallel. If the database is already up, you can use `pnpm dev:apps` instead.

- **Web (Vite):** [http://localhost:5173](http://localhost:5173) (see `apps/web/vite.config.ts` for the dev port).
- **API:** [http://localhost:3000](http://localhost:3000).

**API tests:** `pnpm --filter api test`

---

## Environment variables (reference)

- **API:** [`apps/api/.env.example`](apps/api/.env.example) — `PORT`, `DATABASE_URL`, optional screenshot worker (`ENABLE_SCREENSHOT_WORKER`, intervals, Play Store locale, Puppeteer path, viewport).
- **Web:** [`apps/web/.env.example`](apps/web/.env.example) — `VITE_API_URL` (public API base URL used at **build time** in production; in dev, Vite reads it from `.env`).

Never commit real `.env` files; only the `*.example` files are tracked.

---

## API surface (short)

| Method | Path | Purpose |
|--------|------|--------|
| `POST` | `/apps` | Register a Play Store app URL (optional `title`) |
| `GET` | `/apps` | List apps |
| `GET` | `/apps/:id` | App detail + screenshots |
| `PATCH` | `/apps/:id` | Update `url` / `title` (same Play Store app id only) |
| `DELETE` | `/apps/:id` | Remove app |
| `POST` | `/apps/:id/capture` | Capture a screenshot now |
| `GET` | `/health` | Liveness |

---

## Production: where it runs and how deploy works

**Public demo:** [https://apps-tracker.up.railway.app/](https://apps-tracker.up.railway.app/)

That URL is the **frontend** (static SPA). The browser loads the UI from there and calls the **API** using the base URL that was baked in at **build time** (`VITE_API_URL`). In hosted setups, that value must be the public HTTPS origin of your API (no trailing slash).

**Typical layout** (e.g. Railway or any similar PaaS):

1. **PostgreSQL** — managed database; set `DATABASE_URL` on the API service.
2. **API service** — built from [`apps/api/Dockerfile`](apps/api/Dockerfile): install deps, `pnpm --filter api build`, image runs `prisma migrate deploy` then `node dist/server.js`. Needs Chromium-related env in the image for Puppeteer; screenshot files should live on a persistent volume if you care about keeping them across deploys.
3. **Web service** — built from [`apps/web/Dockerfile`](apps/web/Dockerfile): `pnpm install`, then `pnpm --filter web build` with **`VITE_API_URL` set at build time** (Docker `ARG` / CI env). The output is static files served with `serve`; assign the service a public URL and use that as the site people open in the browser.

There is no separate “CDN deploy” step in-repo: **deployment is “build these two Docker images with the right env, run them next to Postgres, expose web + API URLs.”** Point `VITE_API_URL` at the API’s public URL before building the web image so the SPA calls the correct backend.
