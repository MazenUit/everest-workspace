#!/bin/sh
# Clear assignments and reseed lockers (Docker db must be running).
set -e
cd "$(dirname "$0")/.."

docker compose exec -T db psql -U everest -d everest_locker <<'SQL'
DELETE FROM package_assignments;
DELETE FROM lockers;
INSERT INTO lockers (id, size, is_available) VALUES
  ('S1', 'SMALL', true),
  ('S2', 'SMALL', true),
  ('M1', 'MEDIUM', true),
  ('L1', 'LARGE', true);
SQL

echo "Database reset and seeded (S1, S2, M1, L1 — all available)."
