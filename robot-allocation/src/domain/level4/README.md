## Level 4 — Multi-Client Allocation

**Rules (source of truth):** [`rules.ts`](./rules.ts) → `LEVEL_4_RULES`

**Entry:** [`allocate.ts`](./allocate.ts) → `allocateMultiClient()`

## Files (read order)

| File | What it does |
|------|--------------|
| `rules.ts` | what level 4 must do — read this first |
| `allocate.ts` | sort clients, serve from active inventory, fall back to standby |

**Shared:** `domain/shared/find-cheapest-mix.ts` — same utility used by levels 2, 3, and 4

**Tests:** `tests/level4/multi-client.test.ts`
