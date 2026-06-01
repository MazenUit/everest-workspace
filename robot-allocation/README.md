# Robot Work Allocation

Terminal app for EverBot — assign Bravo, Charlie, and Delta robots to client work hours.

## Stack

- Node.js 20+
- TypeScript
- node:test

## Layout

```
robot-allocation/
  core/src/
    domain/
      robots.ts
      allocation-types.ts
      shared/           helpers (hours, cost totals)
      level1/           rules.ts, allocate, grow-plan, pick-next
      level2/           rules.ts, each-mix, pick-cheapest, allocate
    services/           level-1.ts, level-2.ts, …
    cli/                prompts + print
    tests/level1/       level 1 tests
    tests/level2/       level 2 tests
```

Same flow as package-locker: **domain** holds rules, **services** call them, **cli** only talks to the user.

## Robots

| Type    | Hours / day | Cost / day |
|---------|------------:|-----------:|
| Bravo   | 3           | $2         |
| Charlie | 5           | $3         |
| Delta   | 8           | $4         |

## Run

From `robot-allocation/`:

```bash
npm install
npm run test
npm run cli:level1
npm run cli:level2
```

Type `exit` at any prompt to quit.

---

## Level 2 — cost optimization (this branch)

**Rules in code:** `core/src/domain/level2/rules.ts` (`LEVEL_2_RULES`)

**Code:** `core/src/domain/level2/allocate.ts` → `services/level-2.ts`

### Try it — 20 hours

```bash
npm run cli:level2
```

Stock: `2` Bravo, `3` Charlie, `2` Delta · Hours: `20`

Expected:

```
Robot Assignment
Bravo: 0
Charlie: 1
Delta: 2
Total Work Hours Provided: 21
Client Work Hours Requested: 20
Total Charging Cost: $11
```

### More examples (stock 2 / 3 / 2)

| Hours | Robots sent | Cost |
|------:|-------------|-----:|
| 20 | 1 Charlie, 2 Delta | $11 |
| 6 | 2 Bravo | $4 |
| 16 | 2 Delta | $8 |

### Errors

Same messages as level 1 where they apply (`NO_ROBOTS`, `INVALID_HOURS`). Level 1’s `IMPOSSIBLE_CATEGORY` is only for level 1.

---

## Level 1 — category distribution

**Rules in code:** `core/src/domain/level1/rules.ts` (`LEVEL_1_RULES`)

See also `core/src/domain/level1/README.md`.

```bash
npm run cli:level1
```

---

## Later

| Level | Folder | Topic |
|------:|--------|--------|
| 3 | `domain/level3/` | Standby activation |
| 4 | `domain/level4/` | Multiple clients |
| — | CLI | Level 1 vs 2 comparison (separate branch) |
