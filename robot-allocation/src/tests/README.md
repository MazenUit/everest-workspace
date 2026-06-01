## Tests

Domain tests with `node:test`. Run from `robot-allocation/` (`level1/`, `level2/`, `compare/`):

```bash
npm run test
```

## Layout

```
tests/
  robots.test.ts
  level1/category-distribution.test.ts
  level2/cost-optimization.test.ts
```

## level2/cost-optimization.test.ts

| Test | What it checks |
|------|----------------|
| 20h | 1 Charlie + 2 Delta, $11 |
| 6h | 2 Bravo, $4 |
| 16h | 2 Delta, $8 |
| Bad hours | `INVALID_HOURS` |

## level1/category-distribution.test.ts

| Test | What it checks |
|------|----------------|
| 16h / 17h / 21h / 24h | challenge examples |
| Empty stock | `NO_ROBOTS` |
| Missing type | `IMPOSSIBLE_CATEGORY` |
| Bad hours | `INVALID_HOURS` |
