
## types.test.ts

| Test | Rule |
|------|------|
| Same size | Small package in small locker OK |
| Larger locker | Prefer smallest fit — medium/large lockers accept smaller packages |
| Smaller locker | Cannot store oversized package |

## allocator.test.ts

| Test | Rule |
|------|------|
| Smallest that fits | Pick smallest free locker that fits |
| No oversized locker | Don't use L when M is free and enough |
| Too big for all lockers | Return null — can't store |
| Skip busy lockers | Occupied lockers don't count |
| All fitting lockers busy | Return null — nothing available |

## pickup-code.test.ts

| Test | Rule |
|------|------|
| 6 characters | Pickup code is short and readable |
| A–Z and 0–9 only | Avoid ambiguous symbols |
| Different each call | Codes should not repeat trivially |

## storage-charge.test.ts

| Test | Rule |
|------|------|
| Day 1–5 costs X | First five days billed at X per day |
| Day 6–10 costs 2X | Days six to ten billed at 2X per day |

Store/retrieve flows are tested via Docker + Postman against Postgres.

## Dev: test storage charges

Only when `NODE_ENV=development`, on retrieve you may send:
- Header `X-Simulated-Now: 2026-01-08T10:00:00.000Z`, or
- Body field `simulatedRetrieveAt` (ISO date string)
