## CLI

Reads stdin, calls `runLevel1` or `runLevel2`, prints stdout. No business rules in this folder.

## Run

From `robot-allocation/`:

```bash
npm run cli:level1
npm run cli:level2
npm run cli:compare
```

## Files

| File | Role |
|------|------|
| `main.ts` | routes to level 1/2 or compare CLI |
| `cli.ts` | level 1 and level 2 (level 2 appends comparison) |
| `compare-cli.ts` | compare-only session (no “EverBot — Level …”) |
| `prompts.ts` | shared inventory + hours prompts |
| `output.ts` | challenge text for success and errors |
| `compare-output.ts` | cost comparison + insight |
| `colors.ts` | orange / green / white |
