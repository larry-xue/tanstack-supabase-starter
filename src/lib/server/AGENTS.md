# BACKEND & SECURITY (src/lib/server)

## OVERVIEW

The mission-critical layer handling authentication, secure database access, and server-side logic.

## STRUCTURE

- `auth.server.ts`: Factory for the SSR-compatible Supabase client using TanStack Start cookies.
- `auth.ts`: Authentication-specific RPC functions (e.g., `signOutFn`) using `createServerFn`.
- `db.ts`: Direct Supabase client initialization (Public Anon and Service Role).
- `user.ts`: Server-side user session retrieval and validation logic.

## PATTERNS

### createServerFn

All backend logic must be wrapped in `createServerFn` to enable type-safe RPC calls from the client.
Always perform authorization checks (e.g., `supabase.auth.getUser()`) inside the handler.

### getSupabaseServerClient

Use this function within server contexts to get a client that automatically syncs cookies with the client.

```typescript
const supabase = await getSupabaseServerClient();
const {
  data: { user },
} = await supabase.auth.getUser();
```

## AUTH (Cookie Handling)

Authentication is managed via `@supabase/ssr` integrated with TanStack Start's `getCookies` and `setCookie`.

- **SSR Client**: Initialized in `auth.server.ts`, it handles token refresh and session persistence automatically.
- **Session Sync**: Ensure `getSupabaseServerClient` is used in all Server Functions to maintain session state across requests.

## SECURITY

### Row Level Security (RLS)

- **Strict Policy**: All tables in Supabase must have RLS enabled.
- **Verification**: Never rely on client-side state. Always verify the user's identity on the server using `supabase.auth.getUser()`.

### Environment Variables

- **Private Keys**: `SUPABASE_SERVICE_ROLE_KEY` must NEVER be exposed to the client (omit `VITE_` prefix).
- **Service Role**: Only use `serviceRoleClient` for administrative tasks that bypass RLS (e.g., system-level migrations).

### Data Access

- **No Direct DB**: Avoid using the DB client directly in components; always route through `src/lib/server` RPCs.
- **Fail Fast**: Throw descriptive errors or return null for unauthorized access to prevent data leaks.
