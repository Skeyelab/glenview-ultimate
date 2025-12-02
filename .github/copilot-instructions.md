# Copilot Instructions for Glenview Ultimate

This repository is a Next.js + Directus starter for the Glenview Ultimate Frisbee team website.

## Project Overview

**Tech Stack:**
- **Frontend:** Next.js 16 (App Router) with React 19, TypeScript 5.6
- **Backend/CMS:** Directus (headless CMS)
- **Styling:** Tailwind CSS 4.1 with custom utilities
- **Testing:** Jest 29 with React Testing Library
- **Code Quality:** ESLint with `eslint-config-love` (strict TypeScript rules)

**Architecture:**
- Server-side rendering (SSR) and static generation (SSG) via Next.js App Router
- Directus SDK (`@directus/sdk`) for CMS integration
- Server actions in API routes (`app/api/`)
- Custom UI components inspired by shadcn/ui in `components/ui/`

## Code Style & Conventions

### TypeScript
- **Strict mode enabled** - no implicit any, null checks required
- Use explicit return types for functions (enforced by ESLint)
- Prefer `interface` for object shapes, `type` for unions/intersections
- Use path aliases: `@/` maps to project root

### Naming Conventions
- **Variables/Functions:** camelCase (or snake_case for API fields from Directus)
- **Components:** PascalCase
- **Files:** kebab-case for pages, PascalCase for components
- **Constants:** UPPER_SNAKE_CASE

### React/Next.js
- Use **Server Components** by default (async components in App Router)
- Only use **Client Components** (`'use client'`) when needed for interactivity
- Prefer functional components with hooks
- Use Next.js built-in features: `Image`, `Link`, `Metadata`, etc.

### Styling
- Use **Tailwind utility classes** primarily
- Custom component utilities in `app/globals.css` (`.button`, `.card`, `.input`, etc.)
- Use `cn()` helper from `lib/utils.ts` for conditional classes
- Follow mobile-first responsive design

## Development Workflow

### Setup
```bash
npm install              # Install dependencies (requires Node.js >=22.14.0)
cp .env.example .env.local  # Configure environment variables
npm run dev              # Start development server
```

### Testing
```bash
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

**Testing Guidelines:**
- Write tests for all API routes
- Use React Testing Library for component tests
- Mock external dependencies (Directus, fetch)
- See `TESTING.md` for detailed testing guide
- Test files live in `__tests__/` directory

### Linting
```bash
npm run standard:check   # Check for lint errors
npm run standard         # Auto-fix lint errors
npm run lint             # Next.js lint
```

**ESLint Configuration:**
- Base config: `eslint-config-love` (strict TypeScript best practices)
- Relaxed rules for API routes (allow `any` types for request handling)
- Very relaxed rules for test files
- See `eslint.config.mjs` for details

### Building
```bash
npm run build            # Production build
npm start                # Start production server
```

## Key Files & Directories

### Core Application
- `app/` - Next.js App Router pages and layouts
  - `app/page.tsx` - Homepage
  - `app/api/` - API routes (form submission, etc.)
  - `app/layout.tsx` - Root layout with global styles
- `components/` - Reusable React components
  - `components/ui/` - Base UI components (Button, Input, Card, etc.)
  - `components/navbar.tsx` - Site navigation
- `lib/` - Utility functions and configurations
  - `lib/directus.ts` - Directus SDK client and data fetching functions
  - `lib/config.ts` - Environment configuration
  - `lib/utils.ts` - Helper utilities (cn, etc.)

### Configuration
- `.env.local` - Environment variables (not in repo)
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration
- `jest.config.js` - Jest testing configuration

### Documentation
- `README.md` - Main project documentation
- `TESTING.md` - Testing guide
- `client_direction.md` - Client requirements and features

## Directus Integration

### Collections
The CMS has these main collections:
- `pages` - Content pages (home, about, etc.)
- `people` - Team members (coaches, captains)
- `partners` - Sponsor/partner organizations
- `registrations` - Registration form submissions
- `seasons` - Season information
- `news` - News articles with Markdown content

### Data Fetching
- Use functions in `lib/directus.ts`: `getHomePage()`, `getPeople()`, `getPartners()`, etc.
- Server-side only - uses `DIRECTUS_STATIC_TOKEN` environment variable
- Asset URLs constructed via `getDirectusAssetUrl()` helper

### Environment Variables
Required in `.env.local`:
- `DIRECTUS_URL` - Directus backend URL
- `DIRECTUS_STATIC_TOKEN` - Authentication token (server-side only)
- `NEXT_PUBLIC_DIRECTUS_URL` - Public Directus URL for client-side asset access
- `NEXT_PUBLIC_SITE_NAME` - Site name for branding

## Common Tasks

### Adding a New Page
1. Create file in `app/[page-name]/page.tsx`
2. Export default async function component
3. Fetch data from Directus if needed
4. Export `metadata` for SEO
5. Add link to navigation in `components/navbar.tsx`

### Adding a New API Route
1. Create file in `app/api/[route]/route.ts`
2. Export HTTP method functions: `GET`, `POST`, etc.
3. Handle request/response with Next.js `NextRequest`/`NextResponse`
4. Write tests in `__tests__/api/[route]/route.test.ts`

### Adding a New UI Component
1. Create file in `components/ui/[component].tsx`
2. Use TypeScript with proper prop types
3. Style with Tailwind utilities
4. Export with clear JSDoc comments
5. Consider using `class-variance-authority` for variants

### Updating Directus Schema
1. Add/modify collection in Directus admin UI
2. Update TypeScript types in `lib/directus.ts`
3. Add/update data fetching functions
4. Update tests to mock new fields

## Best Practices

### Performance
- Use Next.js `Image` component for images
- Implement proper caching strategies (`revalidate`)
- Minimize client-side JavaScript (prefer Server Components)
- Use dynamic imports for heavy client components

### Security
- Never expose `DIRECTUS_STATIC_TOKEN` to client
- Validate all user inputs (use Zod schemas)
- Sanitize HTML content (using `sanitize-html`)
- Use proper CORS settings in Directus

### Accessibility
- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain sufficient color contrast

### Code Quality
- Run tests before committing (`npm test`)
- Run linter before committing (`npm run standard:check`)
- Write descriptive commit messages
- Keep components small and focused
- Document complex logic with comments

## Dependencies

### Production
- `next` - React framework with SSR/SSG
- `react` & `react-dom` - UI library
- `@directus/sdk` - Directus API client
- `marked` - Markdown parser for news content
- `sanitize-html` - HTML sanitization
- `zod` - Schema validation

### Development
- `typescript` - Type safety
- `eslint` - Code linting
- `jest` - Testing framework
- `@testing-library/react` - React component testing
- `tailwindcss` - Utility-first CSS framework
- `@tailwindcss/forms` & `@tailwindcss/typography` - Tailwind plugins

## Troubleshooting

### "jest: not found"
Run `npm install` to install dependencies.

### Linting errors about TypeScript types
Check `eslint.config.mjs` for rule overrides. API routes and tests have relaxed rules.

### Directus connection errors
Verify `.env.local` has correct `DIRECTUS_URL` and `DIRECTUS_STATIC_TOKEN`.

### Build errors with Node version
This project requires Node.js >=22.14.0. Use `nvm use` or update Node.

## Additional Resources

- Next.js App Router docs: https://nextjs.org/docs/app
- Directus SDK docs: https://docs.directus.io/guides/sdk/
- Tailwind CSS docs: https://tailwindcss.com/docs
- React Testing Library: https://testing-library.com/react
