## Tests

Domain unit tests (`node:test`).

## robots.test.ts

| Test | Rule |
|------|------|
| EverBot table | Bravo 3h / $2, Charlie 5h / $3, Delta 8h / $4 |

Full level flows will get tests here as domain grows.

## Run (Docker)

From `robot-allocation/`:

```bash
docker compose run --rm core
docker compose --profile test run --rm core-test
```
