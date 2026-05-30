# Package Locker

API for storing packages in lockers and retrieving them with a pickup code.

## Stack
- Node.js 20+
- TypeScript
- Express
- node:test (built-in test runner)
- dotenv
- Docker (Alpine image)
- In-memory storage for now (Postgres planned)

## Project layout
package-locker/
  api/                 Node + Express + TypeScript
    src/domain/        rules (fit, allocate, codes)
    src/services/      store / retrieve use cases
    src/routes/        HTTP endpoints
    src/tests/         unit tests
    Dockerfile         API container image
  docker-compose.yml   (coming) one command: api + database

## Run locally 
cd api
cp .env.example .env
npm install
npm test
npm run dev


## Run with Docker
From `package-locker/`:
```bash
docker compose up --build -d