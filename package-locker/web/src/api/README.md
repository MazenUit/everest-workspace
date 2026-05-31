## API client

HTTP only — calls the locker REST API through the Vite proxy (`/api`).

| Function | Endpoint |
|----------|----------|
| `listLockers` | GET `/lockers` |
| `storePackage` | POST `/packages/store` |
| `retrievePackage` | POST `/lockers/:lockerId/retrieve` |

Components and the store use this module; they do not call `fetch` directly.
