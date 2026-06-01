# Robot Work Allocation

EverBot assigns Bravo, Charlie, and Delta robots to client work. The app is built **level by level** — each level adds a new rule on top of the previous one.

## How the project is organized

```
CLI  →  services/level-N.ts  →  domain/<rule>.ts  →  result back to CLI
```

| Layer | Folder | Role |
|-------|--------|------|
| Domain | `core/src/domain/` | Pure rules — no stdin/stdout |
| Services | `core/src/services/` | One thin function per level (`runLevel1`, `runLevel2`, …) |
| CLI | `core/src/cli/` | Reads input, calls a service, prints output |
| Tests | `core/src/tests/` | One test file per level’s behavior |

To add a level: write domain logic → wrap in `services/level-N.ts` → add tests → wire the CLI when you want it in the demo.

## Levels

| Level | What it adds |
|------:|--------------|
| 1 | Category distribution — use each type when possible; enough hours; minimize excess |
| 2 | Cost optimization — lowest charging cost; compare with level 1 |
| 3 | Standby activation — standby robots when the active fleet is not enough |
| 4 | Multiple clients — prioritize by requested hours |

## Robots

| Type    | Work hours per day | Cost per day |
|---------|-------------------:|-------------:|
| Bravo   | 3                  | $2           |
| Charlie | 5                  | $3           |
| Delta   | 8                  | $4           |

Level 1 uses hours only. Level 2 uses the cost column.

## Run locally

From `robot-allocation/`:

```bash
npm install
npm run cli
npm run test
```

Type `exit` at any CLI prompt to quit.

---

## Level 1 — category distribution

**Question:** Which robots do we send so the client gets enough hours, using each type when we can?

**Rules**

1. Client hours must be a **positive whole number**.
2. If inventory has **≥1** Bravo, Charlie, and Delta, assign **≥1** of each.
3. Hours provided must be **≥** hours requested.
4. Among valid plans, pick the **smallest extra hours** (provided − requested).

**Code:** `domain/category-distribution.ts` · `services/level-1.ts`

### CLI example — 16 hours

**Inventory:** 2 Bravo, 3 Charlie, 2 Delta · **Client:** 16 hours

```
Bravo: 2
Charlie: 3
Delta: 2

Enter client work hours: 16
```

```
Robot Assignment
Bravo: 1
Charlie: 1
Delta: 1
Total Work Hours Provided: 16
Client Work Hours Requested: 16
```

One of each → 3 + 5 + 8 = 16.

### More examples (same inventory)

| Client asks | Robots sent                 | Hours provided | Extra hours |
|------------:|-----------------------------|---------------:|------------:|
| 16          | 1 Bravo, 1 Charlie, 1 Delta | 16             | 0           |
| 17          | 2 Bravo, 1 Charlie, 1 Delta | 19             | 2           |
| 21          | 1 Bravo, 2 Charlie, 1 Delta | 21             | 0           |
| 24          | 1 Bravo, 1 Charlie, 2 Delta | 24             | 0           |

**17 hours:** base trio is 16 h; adding Bravo → 19 h (smallest excess).

### Errors

| Input | Result |
|-------|--------|
| All robots `0` | No robots available |
| `1` Bravo, `0` Charlie, `1` Delta | Cannot assign one per category |
| Hours `0` or not a number | Work hours must be a positive integer |

---

## Level 2 — cost optimization

**Question:** Same as level 1, but minimize **charging cost** instead of excess hours. Compare the result with level 1 when both apply.

**Code:** add `domain/…` · `services/level-2.ts` · tests · CLI entry

---

## Level 3 — standby activation

**Question:** When the active fleet cannot meet hours, activate standby robots under the level rules.

**Code:** add `domain/…` · `services/level-3.ts` · tests · CLI entry

---

## Level 4 — multiple clients

**Question:** Several clients in one run — allocate by priority (e.g. higher requested hours first).

**Code:** add `domain/…` · `services/level-4.ts` · tests · CLI entry
