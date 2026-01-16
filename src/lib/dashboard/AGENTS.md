# AGENTS: src/lib/dashboard

## OVERVIEW

Implementation of the RPC pattern for dashboard features, focusing on authenticated profile management.

## STRUCTURE

- `profile.ts`: Core profile management logic including `getProfileFn` and `updateProfileFn`.
- `utils.server.ts`: Dashboard-specific server utility for authenticated database access via `getSupabaseAndUser`.

## RPC PATTERN

This module serves as the primary template for defining feature-specific Server Functions.

- **Auth Guard**: Handlers MUST call `getSupabaseAndUser()` to retrieve the `supabase` server client and validated `user`. This helper ensures consistent error handling for unauthenticated requests.
- **Type Safety**: Input schemas are defined using Zod and passed to `.inputValidator()`. Results are returned using `satisfies` or explicit types to maintain integrity across the RPC boundary.
- **Logic Isolation**: Server-side logic (Supabase queries, insertions) is encapsulated within these functions, keeping components pure and focused on UI.

```typescript
// Example Definition (profile.ts)
export const updateProfileFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ displayName: z.string().nullable() }))
  .handler(async ({ data }) => {
    const { supabase, user } = await getSupabaseAndUser();
    // Logic: upsert into profiles table
    return { ok: true };
  });
```

## CLIENT USAGE

Consuming these RPCs requires TanStack Query hooks. Direct invocation in components is discouraged to avoid bypassing the application's caching and loading states.

### Querying Data

Wrap the RPC call in `useQuery`. The `queryKey` should be descriptive (e.g., `["profile"]`).

```typescript
const profileQuery = useQuery({
  queryKey: ["profile"],
  queryFn: () => getProfileFn(),
});
```

### Mutating Data

Wrap the RPC call in `useMutation`. Always refetch or invalidate relevant queries in the `onSuccess` callback to ensure the UI remains consistent.

```typescript
const updateMutation = useMutation({
  mutationFn: (name: string | null) => updateProfileFn({ data: { displayName: name } }),
  onSuccess: async () => {
    await profileQuery.refetch();
  },
});
```
