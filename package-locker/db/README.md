# Database

Postgres schema and migrations for package-locker.

## Stack

Postgres 16 (Docker). Tables: `lockers`, `package_assignments`.

## Run migrations

From `package-locker/` (db container must be up):

```bash
docker compose up -d
docker compose exec -T db psql -U everest -d everest_locker < db/migrations/001_init.sql

# Quick verify 
docker compose exec db psql -U everest -d everest_locker -c '\dt'

# Seed lockers

docker compose exec db psql -U everest -d everest_locker -c "
INSERT INTO lockers (id, size, is_available) VALUES
  ('S1', 'SMALL', true),
  ('S2', 'SMALL', true),
  ('M1', 'MEDIUM', true),
  ('L1', 'LARGE', true);
"

# check:
docker compose exec db psql -U everest -d everest_locker -c 'SELECT * FROM lockers;'

```
