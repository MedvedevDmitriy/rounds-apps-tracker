# Web app (Vite + React)

Project-wide documentation (Docker, local dev, env files, deployment) lives in the **[root README](../../README.md)**.

**Web-specific notes:**

- **`VITE_API_URL`** — public base URL of the API (no trailing slash). Used at build time for production bundles; in development, set it in `.env` (see [`.env.example`](.env.example)).
- **Dev server port** — `5173` (see `vite.config.ts`).
