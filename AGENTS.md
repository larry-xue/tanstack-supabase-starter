# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-14
**Framework:** TanStack Start (Vite) + Supabase + TanStack Query
**Style:** Shadcn UI + Tailwind CSS v4 (Material Design 3)

## OVERVIEW

Full-stack starter template for TanStack Start + Supabase.
Includes **Supabase Auth/DB**, **TanStack Router** (file-based), **TanStack Query**, and Fly.io deployment.
Fully internationalized via **Paraglide** (Inlang).

## STRUCTURE

```
.
├── messages/                 # Source i18n JSON files (en, ja, de, etc.)
├── src/
│   ├── lib/
│   │   ├── components/ui/    # Shadcn components (Material 3 styled)
│   │   ├── dashboard/        # Feature: Minimal dashboard RPC examples
│   │   └── server/           # Backend: Auth, DB
│   ├── paraglide/            # Generated i18n code (DO NOT EDIT JS FILES)
│   └── routes/               # TanStack Router (File-based)
└── supabase/                 # Migrations & Config
```

## WHERE TO LOOK

| Task                | Location                   | Notes                             |
| ------------------- | -------------------------- | --------------------------------- |
| **Routing**         | `src/routes`               | `__root`, `_layout`, `$` patterns |
| **Backend Logic**   | `src/lib/server`           | pure logic, auth, external APIs   |
| **RPC Functions**   | `src/lib/dashboard`        | `createServerFn` wrappers         |
| **UI Components**   | `src/lib/components/ui`    | Shadcn + custom `loading`/`empty` |
| **Database Schema** | `supabase/migrations`      | Timestamped SQL files             |
| **Translations**    | `messages/*.json`          | `snake_case` keys                 |
| **Deployment**      | `fly.toml`, `Dockerfile`  | Fly.io config                     |

## CONVENTIONS

### core

- **Package Manager**: `pnpm` exclusively.
- **Formatting**: Prettier + EditorConfig (2 spaces, 90 chars).
- **Linting**: ESLint Flat Config (Strict TS, React Compiler).

### architecture

- **Data Fetching**: **Client-side TanStack Query** (No Router Loaders).
- **Auth**: SSR-aware via `src/lib/server/auth.server.ts` (Cookies).
- **API**: RPC pattern using `createServerFn` (in `src/lib/dashboard` & `src/lib/server`).
- **Styling**: Tailwind v4. **Material Design 3** aesthetics (rounded-3xl, etc).

### i18n (Paraglide)

- Edit `messages/{locale}.json` only.
- Keys: `snake_case` (e.g., `hero_title_start`).
- Usage: `import * as m from "~/paraglide/messages"`.

## COMMANDS

```bash
pnpm dev              # Dev server
pnpm build            # Production build
pnpm ui <comp>        # Add Shadcn component (canary)
pnpm machine-translate # Auto-translate missing keys
pnpm supabase db reset # Reset local DB + Seed
```

## ANTI-PATTERNS

- **NO Router Loaders**: Use `beforeLoad` for auth only. Use Query for data.
- **NO Direct DB Clients**: Use `getSupabaseServerClient()` in server fns.
- **NO `camelCase` i18n keys**: Build will fail/warn.
- **NO `as any`**: Strict type safety required.
