## Services

Thin wrappers: call domain code, return the result. No allocation rules here.

| File | Calls |
|------|--------|
| `level-1.ts` | `domain/level1/allocate.ts` |
| `level-2.ts` | `domain/level2/allocate.ts` |

Add `level-3.ts` when standby logic lives in `domain/level3/`.
