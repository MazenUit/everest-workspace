## Store

Zustand store for demo UI state and API calls.

| Slice | Holds |
|-------|--------|
| `lockers*` | Board list, loading, errors |
| `store*` | Delivery store action + last result |
| `retrieve*` | Customer retrieve + last charge |

Form field text (locker id, pickup code) stays in components — only shared/async state lives here.
