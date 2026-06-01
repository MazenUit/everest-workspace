## Tests

Domain unit tests (`node:test`).

```bash
npm run test
```

## robots.test.ts

| Test | Rule |
|------|------|
| EverBot table | Bravo 3h / $2, Charlie 5h / $3, Delta 8h / $4 |

## category-distribution.test.ts

| Test | Rule |
|------|------|
| 16h | One per category, zero excess |
| 17h | Extra Bravo, min excess |
| 21h / 24h | Extra Charlie / Delta to hit target |
| Empty inventory | `NO_ROBOTS` |
| Missing category | `IMPOSSIBLE_CATEGORY` |
| Bad hours | `INVALID_HOURS` |
