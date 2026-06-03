
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

## locker-station.test.ts

Unit tests for `LockerStation` using in-memory mock repositories and a fake
transaction runner. No database required.

| Test | Rule |
|------|------|
| No lockers | Returns NO_SUITABLE_LOCKER |
| All occupied | Returns NO_SUITABLE_LOCKER |
| Package too large | Returns NO_SUITABLE_LOCKER |
| Success | Returns lockerId + valid pickupCode |
| Picks smallest fit | Prefers the tightest available locker |
| Marks unavailable | Locker is occupied after store |
| Unknown lockerId | Returns LOCKER_NOT_FOUND |
| Empty locker | Returns LOCKER_EMPTY |
| Wrong code | Returns INVALID_PICKUP |
| Correct code | Returns storage charge for days stored |
| After retrieval | Locker is available again |

Integration tests for concurrent locking and transaction rollback require Docker + Postgres.

## Dev: test storage charges

Only when `NODE_ENV=development`, on retrieve you may send:
- Header `X-Simulated-Now: 2026-01-08T10:00:00.000Z`, or
- Body field `simulatedRetrieveAt` (ISO date string)
