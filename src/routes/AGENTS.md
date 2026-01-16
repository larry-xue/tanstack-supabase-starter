# AGENTS: src/routes

## OVERVIEW

File-based routing for TanStack Start with SSR-aware auth and TanStack Query integration.

## STRUCTURE

- `__root.tsx`: The global shell. Defines `createRootRouteWithContext` and handles initial auth session hydration.
- `_layout/`: Directory-based layout group for protected routes.
  - `route.tsx`: Defines the layout component and auth boundary for all child routes.
  - `*.tsx`: Individual routes inheriting the `_layout` (e.g., `dashboard.tsx` maps to `/dashboard`).
- `$.tsx`: Splat/Catch-all route for handling 404 Not Found states.
- `(group)/`: (Optional) Pathless route groups used for logical organization without affecting URLs.

## FILE CONVENTIONS

- `*.tsx`: Used for routes that export a component. Standard for almost all routes.
- `*.ts`: Use only for routes that solely perform redirects or define logic without a UI.
- `route.tsx`: Specifically used within directories to define layout components or index routes.
- `index.tsx`: Maps to the root path of the current directory (e.g., `src/routes/index.tsx` is `/`).

## DATA LOADING

- **CRITICAL RULE: NO LOADERS**: Do not use `loader` functions in `createFileRoute`.
- **Reason**: To prevent network waterfalls and ensure the UI is immediately responsive.
- **Pattern**:
  1. Define `validateSearch` in the route for type-safe query parameters.
  2. Use `useQuery` or `useSuspenseQuery` within the component to fetch data.
  3. This allows TanStack Query to handle caching, background refetching, and hydration.

## AUTH (beforeLoad)

- **Pattern**: All auth checks must happen in the `beforeLoad` hook.
- **Root Auth**: `__root.tsx` fetches the current user session from Supabase to provide it in the context.
- **Protected Routes**: Layouts like `_layout/route.tsx` check `context.user`. If null, they `throw redirect({ to: '/signin' })`.
- **Client/Server Sync**: Auth state is synchronized with `src/lib/store/auth.ts` during `beforeLoad`.

## NAVIGATION

- Use the `<Link />` component from `@tanstack/react-router` for all internal navigation.
- Use `useNavigate()` hook for programmatic navigation.
- Always prefer type-safe route paths over raw strings.
