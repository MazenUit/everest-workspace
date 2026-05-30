# Infrastructure

Talks to Postgres.

## What is here

db.ts — one pool for all DB access; startup ping proves Postgres is reachable before we accept HTTP traffic

## Flow

main.ts starts
  → checkDatabaseConnection()
  → API listens on PORT
  → routes still use in-memory LockerStation until repository is wired

## check connection 
```bash 
docker compose logs api
```