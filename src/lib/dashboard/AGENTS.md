# DASHBOARD KNOWLEDGE BASE

**Context:** Minimal, reusable dashboard examples.

## OVERVIEW

- Small set of RPC functions used by the protected dashboard routes.
- Demonstrates the preferred pattern for authenticated Supabase access.

## RPC PATTERN

- **Server Functions**: Uses `@tanstack/react-start`'s `createServerFn`.
- **Auth Guard**: Use `getSupabaseAndUser()` from `utils.server.ts` in handlers.
- **Validation**: Parse/validate inputs with `zod` inside handlers.

## MODULE MAP

- `utils.server.ts`: Shared helper returning `{ supabase, user }`.
- `profile.ts`: Example read/write functions for `public.profiles`.
