# TanStarter

TanStack Start (Vite) + Supabase starter template with:

- Supabase Auth (email/password + Google)
- SSR-aware auth (cookies) via `@supabase/ssr`
- TanStack Router (file-based) + TanStack Query
- i18n via Paraglide (Inlang)
- Fly.io deployment via `fly.toml` + `Dockerfile`

## Initialization

```bash
npx gitpick copy larry-xue/tanstack-supabase-starter my-app
cd my-app
```

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy env template:

   ```bash
   cp .env.example .env
   ```

3. Fill in required env vars:
   - Supabase:
     - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
     - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - App:
     - `VITE_BASE_URL` (e.g. `http://localhost:3000`)
   - Google sign-in:
     - `VITE_GOOGLE_OAUTH_CLIENT_ID`

4. Reset local Supabase and apply migrations:

   ```bash
   pnpm supabase db reset
   ```

5. Start dev server:

   ```bash
   pnpm dev
   ```

## Verification

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

## Routes

- `/` public landing
- `/signin` login (email/password + Google)
- `/signup` register (email/password + Google)
- `/dashboard` protected page (example Query + RPC + Supabase table)
