# Package Locker

API for storing packages in lockers and retrieving them with a pickup code.

## Stack
- Node.js 20+
- TypeScript
- Express
- node:test (built-in test runner)
- dotenv
- Docker (Alpine image)
- Postgres 16

## Project layout
```
package-locker/
  api/                 Node + Express + TypeScript
    src/domain/        rules (fit, allocate, codes, charges)
    src/services/      store / retrieve use cases
    src/infrastructure/ Postgres repos + pool
    src/routes/        HTTP endpoints
    src/tests/         unit tests (domain rules)
    Dockerfile         API container image
  web/                 optional Vite + React demo UI
  db/                  migrations + seed
  docker-compose.yml   api + database
```

## Demo UI (optional)

With API running on port 3000:

```bash
cd web
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173 — list lockers, store, retrieve.

## Run locally (API only — needs Postgres)
```bash
cd api
cp .env.example .env
npm install
npm test
npm run dev
```

## Run with Docker
From `package-locker/`:
```bash
docker compose up --build -d
docker compose exec -T db psql -U everest -d everest_locker < db/migrations/001_init.sql
```
See `db/README.md` for seed and verify steps.

API: http://localhost:3000
