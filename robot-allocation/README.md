# Robot Work Allocation

Assign Bravo, Charlie, and Delta robots to client work hours for EverBot Solutions.

## Stack
- Node.js 20+
- TypeScript
- node:test (built-in test runner)
- Docker (Alpine image)

## Project layout
```
robot-allocation/
  core/                 domain + services + tests
    src/domain/         allocation rules
    src/services/       level 1–4 use cases
    src/tests/          unit tests
    Dockerfile
  web/                  demo UI (later)
  docker-compose.yml    core + test   profile
```

## Run locally (Docker only)

From `robot-allocation/`:

```bash
docker compose run --rm core
```

Build, compile, and run unit tests in one step.

Rebuild the image after `package.json` or Dockerfile changes:

```bash
docker compose build core
docker compose run --rm core
```

Stop:

```bash
docker compose down
```

## Tests (Docker)

```bash
docker compose --profile test run --rm core-test
```
