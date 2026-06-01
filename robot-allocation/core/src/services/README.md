## Services

Orchestrates allocation use cases per level.

## Levels

| Level | Strategy |
|-------|----------|
| 1 | Category distribution — multi-category when possible, min excess hours |
| 2 | Cost optimization — min charging cost; compare with level 1 |
| 3 | Standby activation — extra robots when active fleet is not enough |
| 4 | Multiple clients — priority by requested hours |

## Flow (target shape)

```
allocate(request, inventory)
  → pick strategy for level
  → domain rules (counts, hours, cost)
  → result (assignment + totals)
```
