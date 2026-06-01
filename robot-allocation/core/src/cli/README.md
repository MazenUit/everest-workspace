## CLI

Reads stdin, calls `runLevel1` or `runLevel2`, prints stdout. No business rules in this folder.

## Run

From `robot-allocation/`:

```bash
npm run cli:level1
npm run cli:level2
```

## Files

| File | Role |
|------|------|
| `main.ts` | reads level from npm script (`1` or `2`) |
| `cli.ts` | prompt loop until `exit` |
| `output.ts` | challenge text for success and errors |
| `colors.ts` | orange / green / white |
