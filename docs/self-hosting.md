# Self-hosting

The app runs on Next.js + PostgreSQL (no Supabase).

## Environment

Copy `.env.local.example` to `.env.local` and fill it in:

- `DATABASE_URL` – PostgreSQL connection string
- `SESSION_SECRET` – 32+ random characters (`openssl rand -hex 32`)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` – the admin login

## Database

```bash
node scripts/migrate.mjs      # creates/updates tables from db/schema.sql (safe to re-run)
node scripts/seed-demo.mjs    # optional demo data + demo accounts (skips if present)
```

## Logins

| Who | Where | Demo account |
|---|---|---|
| Student / team leader | `/login` | `demo.student@bennett.edu.in`, `demo.leader@bennett.edu.in` (password `Demo@1234`) |
| Judge | `/guest-login` | `demo.judge@bennett.edu.in` (password `Judge@1234`) |
| Admin | `/admin/login` | from `ADMIN_EMAIL` / `ADMIN_PASSWORD` |

The admin panel lives at `/admin`. Every admin change to likes, teams, users,
projects and winners is recorded in `admin_audit_log` and shown under
Likes control → Recent changes.

## Docker

`Dockerfile` builds a standalone image (`runner` target); the `builder` target
has the full toolchain and runs the scripts above. Uploaded project images are
written to `public/uploads/projects` – mount a volume there.
