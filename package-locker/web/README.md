# Package Locker — demo UI

Optional Vite + React demo. State: Zustand. Styles: Tailwind.

## Layout

```
web/src/
  api/           HTTP client
  store/         Zustand (locker-store)
  types/         API shapes
  components/    screens + ErrorBoundary
  App.tsx        page layout
```

## Run (Docker)

From `package-locker/`:

```bash
docker compose up --build -d
```

Open http://localhost:5173

See `package-locker/README.md` for migrate and seed.
