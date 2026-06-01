## Core

| Layer | Folder | Role |
|-------|--------|------|
| Domain | `src/domain/` | Robot specs + one module per level’s rules |
| Services | `src/services/` | `level-1.ts`, `level-2.ts`, … — call domain, return result |
| CLI | `src/cli/` | Input/output only |
| Tests | `src/tests/` | One test file per level |

Flow and level details: [../README.md](../README.md).
