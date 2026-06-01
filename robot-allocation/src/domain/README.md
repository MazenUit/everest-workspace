## Domain

The business rules for robot allocation — hours, cost, and which robots to send. This layer does not prompt the user or print results; `cli/` handles that. Same split as `package-locker/api/src/domain/`.

## Layout

```
domain/
  robots.ts
  allocation-types.ts
  shared/assignment-helpers.ts
  level1/     allocate.ts, grow-plan.ts, pick-next.ts
  level2/     each-mix → pick-cheapest → allocate.ts
  level3/     (later)
  level4/     (later)
```

Before changing logic, read **`level1/rules.ts`**, **`level2/rules.ts`**, or **`compare/rules.ts`**. Each folder’s README links there too.
