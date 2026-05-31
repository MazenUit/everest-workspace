# Package Locker

API for storing packages in lockers and retrieving them with a pickup code.

## Stack
- Node.js 20+
- TypeScript
- Express
- node:test (built-in test runner)
- dotenv
- Docker (Alpine images)
- Postgres 16
- Vite + React (optional demo UI)

## Project layout
```
package-locker/
  api/                 Node + Express + TypeScript
  web/                 optional demo UI (Vite, React, Zustand, Tailwind)
  db/                  migrations + seed
  docker-compose.yml   db + api + web
```

## Run locally (Docker only)

From `package-locker/`:

```bash
docker compose up --build -d
docker compose exec -T db psql -U everest -d everest_locker < db/migrations/001_init.sql
```

Seed and verify: see `db/README.md`.

| Service | URL |
|---------|-----|
| Demo UI | http://localhost:5173 |
| API | http://localhost:3000 |
| Postgres (host tools) | `localhost:5433` |

Stop:

```bash
docker compose down
```

## Tests (Docker)

```bash
docker compose --profile test run --rm api-test
```

## API env file

`docker compose` loads `api/.env` for the API service. Copy once if missing:

```bash
cp api/.env.example api/.env
```
