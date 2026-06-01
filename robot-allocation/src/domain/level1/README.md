## Level 1 — category distribution

**Rules (source of truth):** [`rules.ts`](./rules.ts) → `LEVEL_1_RULES`

**Entry:** [`allocate.ts`](./allocate.ts) → `allocateCategoryDistribution()`

## Files (demo order)

| File | What it does |
|------|----------------|
| `rules.ts` | what level 1 must do — read this first |
| `allocate.ts` | validate, start 1+1+1, return result |
| `grow-plan.ts` | add robots until enough hours |
| `pick-next.ts` | which type to add next |

**Tests:** `tests/level1/category-distribution.test.ts`
