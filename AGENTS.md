# AGENTS.md — Glenview Ultimate

Agent guidance for the Glenview Ultimate Frisbee club website. Next.js 16 (App Router) + Directus headless CMS.

---

## Essential Commands

```bash
# Dev server (uses Next.js binary directly)
./node_modules/.bin/next dev   # or: npm run dev

# Build
yarn build          # CI uses yarn; local dev can use npm or yarn

# Tests  ← Vitest, NOT Jest
yarn test           # run once
yarn test:watch     # watch mode
yarn test:coverage  # with coverage report
yarn test:ui        # Vitest browser UI

# Linting
yarn standard:check # check only (CI gate)
yarn standard       # auto-fix

# Next.js lint (separate from eslint standard)
yarn lint
```

**Node version**: exactly `22.19.0` (`.nvmrc`). Engines gate is `>=22.14.0 <23.0.0`.

---

## Architecture Overview

```
app/                   Next.js App Router pages (all server components unless 'use client')
  api/
    register/          POST — registration form submission → Directus
    assets/[...path]/  Proxy for Directus assets (client-component image requests)
    revalidate/        POST — Directus webhook → Next.js revalidatePath
components/
  home/                Hero, season highlights, partners, latest-content card
  navbar/              Navbar + mobile menu + nav-links constant
  schedule/            Season calendar component
  about/, news/, register/, what-is-ultimate/
  ui/                  Shared primitives: SectionCard, PageHeader, etc.
  footer.tsx
lib/
  directus.ts          ALL Directus SDK interaction + TypeScript interfaces
  config.ts            LOGO_ID, DEFAULT_REVALIDATE_SECONDS
  constants.ts         Fallback copy (hero text, description, etc.)
  schedule-utils.ts    selectUpcomingEvents, groupEventsByMonth
  date-utils.ts        safeParseDate
  register-utils.ts    Registration payload helpers
  markdown-utils.ts    marked + sanitize-html pipeline
  visual-editing.ts    setAttr, applyVisualEditing wrappers
  utils.ts             cn() (clsx + tailwind-merge)
__tests__/             Mirrors app/components/lib structure; fixtures/ excluded from coverage
```

Data flow: page component → `lib/directus.ts` helper (batched with `Promise.all`) → Directus SDK → CMS. Every helper is wrapped in `withDirectus(fallback, fn)` which silently returns the fallback when env vars are absent — the site always renders without a live CMS.

---

## Directus Integration

### Collections (schema in `directus-schema.json`)
| Collection | Notes |
|---|---|
| `Website` | Singleton — hero title/block/CTA, season summary |
| `About` | Singleton — club description, what_kids_learn array |
| `WhatIsUltimate` | Singleton — description markdown |
| `WhatIsUltimateVideos` | Filter `active: true`, sort by `sort` field |
| `Schedule` | Sort `["-season_year", "date"]`; latest season extracted at runtime |
| `Team` | Coaches/captains |
| `Partners` | Sponsors |
| `News` | Slugged articles; markdown content via `marked` + `sanitize-html` |
| `Registrations` | Write-only from API route |

### Asset URLs
- **Server components**: call `getDirectusAssetUrl(fileId, opts)` — returns direct URL with `access_token`.
- **Client components**: call `getDirectusAssetUrl(fileId, opts, true)` (pass `forceProxy = true`) — returns `/api/assets/<id>` proxy URL. Skipping `forceProxy` on client components causes hydration mismatches because the server inlines a token-bearing URL but the client can't reproduce it.

### CMS fallbacks
`lib/constants.ts` holds fallback hero copy. `DEFAULT_SCHEDULE` in `lib/directus.ts` is the hardcoded 2026 season used when Directus is unconfigured or returns no events. Always prefer CMS data; fallbacks are last resort.

### Revalidation webhook
`POST /api/revalidate` accepts Directus flow webhooks. The `REVALIDATE_SECRET` env var must match the `Authorization: Bearer <secret>` header (or body `secret` field). Maps collections to Next.js paths via `COLLECTION_TO_PATHS`.

---

## Key Gotchas

### Test runner is Vitest, not Jest
The copilot instructions and TESTING.md say "Jest" — ignore them. The project migrated to **Vitest**. All test files use `vi.fn()`, `vi.mock()`, `beforeAll`/`beforeEach` from `vitest`. The setup file is `vitest.setup.ts`, config is `vitest.config.ts`.

### `vi.mock` must precede imports
Vitest hoists `vi.mock(...)` but linting flags import order. Suppress with `// eslint-disable-next-line import/first` on the post-mock imports. See `__tests__/api/register/route.test.ts` for the canonical pattern.

### `next/navigation` is mocked globally in `vitest.setup.ts`
`useRouter`, `usePathname`, and `useSearchParams` are already mocked. Don't re-mock them in individual test files — override with `vi.mocked(useSearchParams).mockReturnValue(...)` instead.

### `next/server` must be manually mocked in API route tests
`NextRequest` / `NextResponse` depend on Web APIs not fully available in jsdom. Copy the mock shape from `__tests__/api/register/route.test.ts`.

### Directus client is a module-level singleton
`directusClient` is lazily initialized and cached. Tests that check "missing env vars" must `delete process.env.DIRECTUS_URL` **before** importing the module, or reset the cache with `vi.resetModules()`.

### CI uses yarn with frozen lockfile
The CI workflow runs `yarn install --frozen-lockfile`. If you add dependencies locally with `npm install`, the lockfile won't match. Use `yarn add` or commit an updated `yarn.lock`.

### Turnstile env vars required for build
CI sets `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. Without them some registration logic may error. Copy from `.env.example` and set test values locally.

### `export const dynamic = 'force-dynamic'`
The homepage has this directive. `DEFAULT_REVALIDATE_SECONDS = 0` in `lib/config.ts` signals the same intent for other pages. The site does not use static generation by default.

### News nav link is conditional
`app/layout.tsx` calls `hasNewsArticles()` on every render and strips the `/news` link from the navbar when no articles exist. Any new nav items with similar conditional display should follow this pattern.

### Visual Editing is opt-in via URL param
Directus Visual Editing (`@directus/visual-editing`) activates only when `?visual-editing=true` is in the URL. The `setAttr` helper from `lib/visual-editing.ts` spreads `data-directus` attributes onto elements only in that mode. Never render editing attributes unconditionally.

---

## Code Conventions

### Component structure
```tsx
'use client'; // only if interactive

import React from "react";
// external imports first, then internal @/ imports

export interface MyComponentProps { ... } // interface directly above component

export function MyComponent({ prop }: MyComponentProps): React.JSX.Element { ... }
```

- Named exports everywhere except Next.js route files (default export for page/layout).
- `'use client'` uses single quotes as first statement.
- Explicit `React.JSX.Element` return type on components.

### Styling
All layout/color utilities come from Tailwind. Reuse the semantic CSS classes defined in `app/globals.css` before adding new Tailwind strings:

| Class | Purpose |
|---|---|
| `.button` | Primary CTA (white bg, brand-green text) |
| `.button.secondary` | Ghost button |
| `.card` | Rounded container with `white/5` bg and `white/20` border |
| `.notice` | Info/alert box |
| `.input` / `.select` / `.textarea` / `.label` | Form elements |
| `.grid-2` | Responsive 2-column grid |
| `.container` | Centered, max-w-4xl, padded |

Use `cn()` from `lib/utils` for conditional class merging.

Brand color: `bg-brand-green` = `#175030`. Body background is always this color. Text defaults to white.

### Form validation
API routes validate with `zod.safeParse`. Return `{ error: "..." }` with appropriate status. Directus `RECORD_NOT_UNIQUE` errors map to `{ code: "DUPLICATE_EMAIL" }` with status 409.

### Date handling
Always use `safeParseDate` from `lib/date-utils` — raw `new Date(isoString)` is unreliable across timezones. Use `Intl.DateTimeFormat` for display, not `toLocaleDateString()`.

---

## Environment Variables

| Variable | Usage |
|---|---|
| `DIRECTUS_URL` | Server-only. Required for CMS reads. |
| `DIRECTUS_STATIC_TOKEN` | Server-only. Must have create permission on Registrations. |
| `NEXT_PUBLIC_DIRECTUS_URL` | Client-side asset base (used by visual editing). |
| `NEXT_PUBLIC_SITE_NAME` | Page `<title>`. Defaults to "Glenview Ultimate". |
| `REVALIDATE_SECRET` | Webhook auth for `/api/revalidate`. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile (registration form). |
| `TURNSTILE_SECRET_KEY` | Turnstile server-side verification. |

Without `DIRECTUS_URL`/`DIRECTUS_STATIC_TOKEN`, `withDirectus` returns hardcoded fallbacks silently — the site builds and runs fine.

---

## Testing Patterns

Tests live in `__tests__/` mirroring the source tree. `__tests__/fixtures/` is excluded from coverage and test runs.

**Server component pages**: Render with `render(await PageComponent(props))` — async components work with Vitest + jsdom.

**API routes**: Import after `vi.mock(...)` calls. Mock `@/lib/directus` and `next/server`. Reset `process.env` in `beforeEach`/`afterAll`.

**Component tests**: Use `@testing-library/react` queries. `screen.getByRole`, `screen.getByText` preferred over snapshot tests.
