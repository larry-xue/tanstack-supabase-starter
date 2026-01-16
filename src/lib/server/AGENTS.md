# BACKEND KNOWLEDGE BASE (src/lib/server)

## OVERVIEW

Core backend logic, Auth orchestration, RPC layers, and External API integrations.
Strictly server-side; depends on Supabase SSR and TanStack Start server utilities.

## MODULE MAP

- `auth.server.ts`: Supabase SSR client factory. Cookie-based session persistence.
- `auth.ts`: Auth-related `createServerFn` (e.g., `signOutFn`).
- `db.ts`: Database client and schema utilities.
- `user.ts`: User retrieval helpers (SSR-safe).

## AUTH FLOW

- **SSR Identity**: `getSupabaseServerClient` uses TanStack `getCookies` for session recovery.
- **Enforcement**: Server functions should call `supabase.auth.getUser()` for verified identity.
- **Persistence**: Auth state maintained via Supabase `auth` schema; app data in `public.profiles`.
