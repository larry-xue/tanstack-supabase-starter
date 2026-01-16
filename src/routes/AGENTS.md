# AGENTS: src/routes

## OVERVIEW

- **Framework**: TanStack Router (File-based).
- **Core**: SSR-ready, client-side data fetching via TanStack Query.
- **Context**: `{ queryClient, authStore }` injected at root.

## ROUTING MAP

- `__root.tsx`: Global entry. Handles `beforeLoad` auth & `head` meta.
- `_layout/`: Auth boundary. Redirects to `/signin` if `context.user` null.
  - `dashboard.tsx`: Protected dashboard example route.
- `index.tsx`: Public landing page.
- `signin.tsx`: Sign-in (email/password + Google).
- `signup.tsx`: Sign-up (email/password + Google).
- `auth/callback.tsx`: Completes email confirmation/magic-link callbacks.
- `$.tsx`: Global 404 catch-all.

## DATA FETCHING STRATEGY

- **NO Loaders**: Zero data fetching in Router loaders to prevent waterfall/blocking.
- **TanStack Query**: All data fetched in components via `useQuery` / `useMutation`.
- **validateSearch**: Use `zod` for type-safe search params where needed.
- **State Flow**: `beforeLoad` (Auth) -> `useSearch/useParams` -> `useQuery` (Data).
