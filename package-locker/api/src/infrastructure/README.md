# Infrastructure

Postgres access only — SQL and row mapping live here.

## Files

- `db.ts` — pool, startup ping, `withTransaction`
- `locker-repository.ts` — `lockers` table
- `package-assignment-repository.ts` — `package_assignments` table

## Flow

```
Routes → LockerStation → withTransaction → repos → Postgres
```

## Repositories

| Interface | Table | Implementation |
|-----------|--------|----------------|
| `LockerRepository` | `lockers` | `PostgresLockerRepository` |
| `PackageAssignmentRepository` | `package_assignments` | `PostgresPackageAssignmentRepository` |

## Debug

```bash
docker compose logs api
docker compose exec db psql -U everest -d everest_locker -c "SELECT * FROM lockers;"
```
