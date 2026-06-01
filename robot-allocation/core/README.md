## Core

Allocation logic and the terminal demo. Layers match `package-locker`: **domain** (rules) → **services** (use cases) → **cli** (I/O only).

| Layer | Folder |
|-------|--------|
| Domain | `src/domain/level1/`, `level2/`, … |
| Services | `src/services/level-1.ts`, `level-2.ts`, … |
| CLI | `src/cli/` |
| Tests | `src/tests/level1/`, `level2/`, … |

Details: [../README.md](../README.md)
