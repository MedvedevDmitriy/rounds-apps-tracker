# Rounds Apps Tracker

Track Google Play listing URLs: the API stores apps and capture listing screenshots (Puppeteer); the web UI lists apps and screenshot history. Single-user, no auth.

---

## Development

```bash
pnpm install
```

Copy `.env.example` → `.env` in [`apps/api`](apps/api/README.md) and [`apps/web`](apps/web/README.md), then run migrations once: `cd apps/api && pnpm exec prisma migrate deploy`.

```bash
pnpm dev
```

- UI: http://localhost:5173  
- API: http://localhost:3000  

---

## Full stack in Docker (no hot reload)

```bash
pnpm compose:up
```

UI :5173, API :3000, Postgres :5432 — see `docker-compose.yml` for details.

---

## Deploy & demo

**Live:** https://apps-tracker.up.railway.app/

Postgres + two services from this repo: **api** (`apps/api/Dockerfile`) and **web** (`apps/web/Dockerfile`). API gets `DATABASE_URL`; web image is built with `VITE_API_URL` pointing at the public API URL.
