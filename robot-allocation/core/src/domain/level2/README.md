## Level 2 — cost optimization

**Rules (source of truth):** [`rules.ts`](./rules.ts) → `LEVEL_2_RULES`

**Entry:** [`allocate.ts`](./allocate.ts) → `allocateCostOptimization()`

## Files (demo order)

| File | What it does |
|------|----------------|
| `rules.ts` | what level 2 must do — read this first |
| `each-mix.ts` | try every count mix within stock |
| `pick-cheapest.ts` | compare cost (tie → less excess hours) |
| `allocate.ts` | find best mix, return result + cost |

**Tests:** `tests/level2/cost-optimization.test.ts`
