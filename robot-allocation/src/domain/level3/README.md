## Level 3 — Standby Robot Activation

**Rules (source of truth):** [`rules.ts`](./rules.ts) → `LEVEL_3_RULES`

**Entry:** [`allocate.ts`](./allocate.ts) → `activateStandby()`

## Files (read order)

| File | What it does |
|------|--------------|
| `rules.ts` | what level 3 must do — read this first |
| `allocate.ts` | validate, check active capacity, fill gap via `shared/find-cheapest-mix` |

**Shared:** `domain/shared/find-cheapest-mix.ts` — enumerates all mixes, picks cheapest (also used by level 2)

**Tests:** `tests/level3/standby-activation.test.ts`
