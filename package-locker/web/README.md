# Package Locker — demo UI

Optional Vite + React UI. Run with the rest of the stack via Docker (see `package-locker/README.md`).

```bash
cd ..
docker compose up --build -d
```

Open http://localhost:5173 — requests go to the API through the compose network (`/api` → `api:3000`).
