# Database

Postgres schema and migrations for package-locker.

## Stack

Postgres 16 (Docker). Tables: `lockers`, `package_assignments`.

## Run migrations

From `package-locker/` (db container must be up):

```bash
docker compose up -d
docker compose exec -T db psql -U everest -d everest_locker < db/migrations/001_init.sql
```

## Reset + seed (one command)

Clears all packages and puts lockers back to the default four (all available):

```bash
./db/reset-seed.sh
```

Requires `docker compose up -d` first.

Verify:

```bash
docker compose exec db psql -U everest -d everest_locker -c 'SELECT * FROM lockers;'
```
