## CLI

Read input → call `services/level-N` → print result. No allocation rules here.

## Development

From `robot-allocation/`:

```bash
npm install
npm run test
npm run cli
```

## Files

| File | Role |
|------|------|
| `main.ts` | Starts the app |
| `cli.ts` | Session loop until `exit` |
| `colors.ts` | Orange / green / white terminal theme |
| `output.ts` | Prints assignment or challenge error text |

## Session

Runs until you type `exit` at any prompt. Orange = prompts and headings, green = input labels, white = result lines.

## Flow

```
cli.ts  →  services  →  output.ts
 read         rules        print
```
