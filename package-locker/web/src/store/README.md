## Store

Zustand store for demo UI state and API calls.

| Slice | Holds |
|-------|--------|
| `lockers*` | Board list, loading, errors |
| `store*` | Delivery store action + last result |
| `retrieve*` | Customer retrieve + last charge |

Form field text (locker id, pickup code) stays in components — only shared/async state lives here.

Loading flags use `utils/min-delay` so spinners stay visible ~400ms minimum (no flash on fast API).
