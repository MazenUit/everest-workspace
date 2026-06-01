## Level 2 — cost optimization

**Rules (source of truth):** [`rules.ts`](./rules.ts) → `LEVEL_2_RULES`

**Entry:** [`allocate.ts`](./allocate.ts) → `allocateCostOptimization()`

## Files (read order)

| File | What it does |
|------|--------------|
| `rules.ts` | what level 2 must do — read this first |
| `allocate.ts` | validate, find cheapest mix via `shared/find-cheapest-mix`, return result |

**Shared:** `domain/shared/find-cheapest-mix.ts` — enumerates all mixes, picks cheapest (also used by level 3)

**Tests:** `tests/level2/cost-optimization.test.ts`
