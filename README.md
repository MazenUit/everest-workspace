# Everest Engineering — Workspace

Two independent projects: a package-locker REST API and a robot work-allocation CLI.

---

## Contents

- [package-locker](#package-locker) — store and retrieve packages via pickup code
- [robot-allocation](#robot-allocation) — assign EverBot robots to client work hours

---

## package-locker

A REST API for storing packages in lockers and retrieving them with a one-time pickup code. An optional demo UI is included.

### Stack

| Layer | Technology |
|-------|-----------|
| API | Node.js 20+, TypeScript, Express |
| Database | Postgres 16 |
| Tests | node:test (built-in) |
| Demo UI | Vite, React, Zustand, Tailwind CSS |
| Runtime | Docker (Alpine images) |

### Structure

```
package-locker/
  api/
    src/
      domain/           pure business rules (sizes, fit logic, pickup codes, storage charge)
      infrastructure/   Postgres repositories (locker, package assignment)
      services/         locker-station.ts — orchestrates domain + repositories
      routes/           Express handlers (GET /lockers, POST /packages/store, POST /lockers/:id/retrieve)
      tests/            unit tests for domain functions
    Dockerfile
    package.json
  web/
    src/
      api/              HTTP client
      store/            Zustand (locker-store)
      types/            shared API shapes
      components/       LockerBoard, StorePackage, RetrievePackage, ErrorBoundary
      App.tsx
  db/
    migrations/
      001_init.sql      creates lockers and package_assignments tables
    reset-seed.sh       clears packages, reseeds 4 default lockers
  docker-compose.yml
```

### Local setup (Docker)

Everything runs via Docker. No local Node or Postgres required.

**1. Copy env file (once):**

```bash
cp package-locker/api/.env.example package-locker/api/.env
```

**2. Start all services:**

```bash
cd package-locker
docker compose up --build -d
```

**3. Run migrations:**

```bash
docker compose exec -T db psql -U everest -d everest_locker < db/migrations/001_init.sql
```

**4. Seed lockers:**

```bash
./db/reset-seed.sh
```

Re-run `./db/reset-seed.sh` anytime to clear all packages and restore the default four lockers.

**Services:**

| Service | URL |
|---------|-----|
| API | http://localhost:3000 |
| Demo UI | http://localhost:5173 |
| Postgres (host tools) | `localhost:5433` |

**Stop:**

```bash
docker compose down
```

### API endpoints

| Method | Path | Body | Description |
|--------|------|------|-------------|
| `GET` | `/lockers` | — | List all lockers and their status |
| `POST` | `/packages/store` | `{ packageSize: "SMALL" \| "MEDIUM" \| "LARGE" }` | Store a package; returns `lockerId` and `pickupCode` |
| `POST` | `/lockers/:lockerId/retrieve` | `{ pickupCode: "..." }` | Retrieve a package; returns storage charge |
| `GET` | `/health` | — | Health check |

### Tests

Tests run inside Docker (matches the production environment — no mocks of Postgres):

```bash
docker compose --profile test run --rm api-test
```

---

## robot-allocation

A terminal application for EverBot Solutions — assign Bravo, Charlie, and Delta robots to one or more clients based on work hours requested.

### Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript, Node.js 20+ |
| Tests | node:test (built-in) |
| CLI | tsx (direct TypeScript execution) |

### Robot fleet

| Type | Hours / day | Cost / day |
|------|------------:|----------:|
| Bravo | 3h | $2 |
| Charlie | 5h | $3 |
| Delta | 8h | $4 |

### Structure

```
robot-allocation/
  src/
    domain/
      robots.ts               fleet specs and categories
      allocation-types.ts     shared result types for all levels
      shared/
        assignment-helpers.ts total hours, total cost, inventory helpers
        find-cheapest-mix.ts  enumerate all mixes, pick lowest cost (used by L2, L3, L4)
      level1/                 category distribution — rules.ts, allocate.ts, grow-plan.ts, pick-next.ts
      level2/                 cost optimization — rules.ts, allocate.ts
      level3/                 standby activation — rules.ts, allocate.ts
      level4/                 multi-client allocation — rules.ts, allocate.ts, summary.ts
      compare/                level 1 vs level 2 — rules.ts, metrics.ts, insight.ts
    services/                 one entry function per level (level-1.ts … level-4.ts, compare.ts)
    cli/
      main.ts                 entry point — parses level arg and dispatches
      cli.ts                  session runners per level (runCli, runLevel3Cli, runLevel4Cli, runCompareCli)
      prompts.ts              readline input helpers
      output.ts               all print functions
      colors.ts               chalk color helpers
      parse-level.ts          arg → level type
    tests/
      robots.test.ts          fleet spec
      error-boundary.test.ts  all error reasons across all levels
      level1/                 category-distribution.test.ts
      level2/                 cost-optimization.test.ts
      compare/                level-compare.test.ts
      level3/                 standby-activation.test.ts
      level4/                 multi-client.test.ts
```

### Local setup

```bash
cd robot-allocation
npm install
npm test
```

### CLI commands

```bash
npm run cli:level1    # Level 1 — category distribution
npm run cli:level2    # Level 2 — cost optimization
npm run cli:level3    # Level 3 — standby activation
npm run cli:level4    # Level 4 — multi-client allocation (with summary)
npm run cli:compare   # Compare Level 1 vs Level 2 cost
```

Type `exit` at any prompt to end the session. Level 4 accepts client hours as a single value, comma-separated, or space-separated (`12,16,17` or `12 16 17`).

### Levels

| Level | What it does |
|------:|-------------|
| 1 | Must assign at least one robot per category; grows from 1+1+1 baseline, adds cheapest type to minimise excess |
| 2 | No category rule; enumerates all mixes from active inventory, picks lowest cost |
| Compare | Runs both L1 and L2, shows cost difference and an insight line |
| 3 | Active fleet given; if capacity is short, finds cheapest standby robots from unlimited warehouse |
| 4 | Multiple clients sorted by hours descending; each served from shrinking active fleet or unlimited standby; prints allocation summary with efficiency metrics |

### Error handling

| Error | Message | Levels |
|-------|---------|--------|
| `NO_ROBOTS` | No robots available for assignment | L1, L2 |
| `IMPOSSIBLE_CATEGORY` | Unable to allocate at least one robot from each category | L1 |
| `INVALID_HOURS` | Work hours must be a positive integer | L1, L2, L3, L4 |
| `INSUFFICIENT_INVENTORY` | Available inventory cannot meet the requested work hours | L2 |

---

## AI tool usage

Claude (claude-sonnet-4-6, via Cursor) was used throughout both projects — for initial scaffolding, accelerating boilerplate, and exploring design options.

Every piece of AI-generated output was reviewed, tested, and in many cases rewritten before committing. The architecture decisions (domain/service/delivery layering, repository interfaces, injectable `runTransaction` for testability), error taxonomy, and test strategy were directed and validated by me. AI accelerated the work; it did not replace the engineering judgement behind it.

---

## Approach, tradeoffs & assumptions

### Architecture

Both projects follow the same three-layer pattern:

```
domain → services → delivery (routes / CLI)
```

- **Domain** holds pure functions with no I/O. Everything is testable without a database or terminal.
- **Services** wire domain functions together. They know about repositories or domain calls but not Express or readline.
- **Delivery** (routes / CLI) handles input parsing and output formatting only — no business logic.

### package-locker

**Approach:** Storage charge is calculated at retrieval time from the stored timestamp. Pickup codes are random 6-digit strings generated in the domain layer. Locker fit logic (size comparison) is a pure function tested independently.

**Tradeoffs:** Docker-only setup keeps local environments identical and avoids "works on my machine" issues. The tradeoff is that you need Docker to run anything, including tests.

**Assumptions:** Single station per deployment. No authentication — any caller with a valid pickup code can retrieve. Lockers are pre-seeded; the API does not create new lockers.

### robot-allocation

**Approach:** Levels 2, 3, and 4 all reduce to the same problem — find the cheapest robot mix that covers N hours from a given inventory. This is extracted into `shared/find-cheapest-mix.ts` and reused rather than duplicated. Level 3 passes computed search bounds (unlimited warehouse), Level 2 passes actual inventory bounds.

**Tradeoffs:** The mix-finder uses nested loops over all combinations (O(B × C × D)). This is brute-force but correct and readable. For the inventory sizes in this challenge it runs in microseconds. It would not scale to thousands of robots per type without a smarter algorithm (e.g., dynamic programming).

**Assumptions:** Each robot contributes its full `hoursPerDay` — no partial usage. Level 3 and 4 warehouse stock is unlimited (any count of standby robots can be activated). Robot counts entered in the CLI are non-negative integers; work hours are positive integers.
