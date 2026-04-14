# API (Express + Prisma + Puppeteer)

Monorepo docs (Docker, local dev, env, deploy) are in the **[root README](../../README.md)**.

**API-specific:**

- **Config** — copy [`.env.example`](.env.example) to `.env`. Important: `DATABASE_URL`, `PORT`, optional `ENABLE_SCREENSHOT_WORKER` and screenshot-related vars (see comments in the example).
- **Scripts** (from `apps/api` or via `pnpm --filter api`):
  - `pnpm dev` — `tsx` + hot reload
  - `pnpm build` — Prisma generate + `tsc`
  - `pnpm start` — `prisma migrate deploy` then `node dist/server.js` (production-style)
  - `pnpm test` — Vitest
- **Migrations** — `pnpm exec prisma migrate deploy` (run against the DB in `DATABASE_URL`).
- **Container** — [`Dockerfile`](Dockerfile) at this path; build context is the **repo root** (see root README).

**`POST /apps` body:** `{ "url": "…" }` and optionally `"title"` (string or `null`). Title on create was added so the “create as new tracked app” flow from the UI can persist an optional display name in one step, aligned with `PATCH` which already supports `title`.
