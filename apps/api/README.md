# API

Express, Prisma, optional in-process screenshot worker (Puppeteer).

**Config:** copy [`.env.example`](.env.example) to `.env` — comments there list every variable you need for local runs.

**Scripts (from repo: `pnpm --filter api <script>`):** `dev`, `build`, `start`, `test`.

**Migrations:** `pnpm exec prisma migrate deploy` (uses `DATABASE_URL` from `.env`).

**Dockerfile:** this folder; image build context is the monorepo root (see root `README.md`).
