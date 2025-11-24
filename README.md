# Glenview Ultimate

[![CI](https://github.com/Skeyelab/glenview-ultimate/actions/workflows/ci.yml/badge.svg)](https://github.com/Skeyelab/glenview-ultimate/actions/workflows/ci.yml)

A Next.js website for [Glenview Ultimate](https://glenview-ultimate.org), a youth ultimate frisbee organization. The site connects to a Directus CMS backend for content management and includes features for registration, news, schedules, and team information.

## Features

- **Homepage** - Season highlights, team leadership, and partner sponsors
- **Registration** - Multi-child registration form with parent information
- **News** - Blog-style news posts with Markdown support
- **Schedule** - Season calendar with events, practices, and tournaments
- **About** - Team information and what kids learn
- **What is Ultimate** - Educational content about ultimate frisbee

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with `@tailwindcss/forms` and `@tailwindcss/typography`
- **Directus SDK** - CMS integration for content management
- **Directus Visual Editing** - In-context content editing
- **Vitest & React Testing Library** - Testing framework
- **Umami Analytics** - Privacy-focused analytics

## Development

### Prerequisites

- Node.js >=22.14.0 <23.0.0
- Directus instance configured with required collections

### Environment Variables

Create a `.env.local` file with:

```ini
DIRECTUS_URL=https://your-directus.example.com
DIRECTUS_STATIC_TOKEN=YOUR_STATIC_TOKEN
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus.example.com
NEXT_PUBLIC_SITE_NAME=Glenview Ultimate
```

### Commands

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run linter
yarn lint

# Fix linting issues
yarn standard

# Check linting without fixing
yarn standard:check

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Run tests with UI
yarn test:ui

# Backup Directus schema
yarn backup:schema
```

## Project Structure

```
app/                    # Next.js app directory
  ├── about/           # About page
  ├── api/             # API routes
  │   └── register/    # Registration endpoint
  ├── news/            # News listing and detail pages
  ├── register/        # Registration form page
  ├── schedule/        # Schedule page
  └── what-is-ultimate/ # Educational content page

components/            # React components
  ├── about/           # About page components
  ├── home/            # Homepage components
  ├── news/            # News components
  ├── navbar/          # Navigation components
  ├── register/        # Registration form components
  ├── schedule/        # Schedule components
  ├── ui/              # Reusable UI components
  └── what-is-ultimate/ # What is Ultimate components

lib/                   # Utility functions and helpers
  ├── directus.ts      # Directus SDK integration
  ├── config.ts        # Configuration constants
  ├── date-utils.ts    # Date formatting utilities
  ├── register-types.ts # Registration type definitions
  ├── register-utils.ts # Registration form utilities
  ├── schedule-utils.ts # Schedule processing utilities
  └── utils.ts         # General utilities

__tests__/             # Test files
```

## Directus Collections

The project uses the following Directus collections:

- **Team** - Team members with roles, bios, and photos
- **Partners** - Sponsors and partners with logos
- **Schedule** - Season events, practices, and tournaments
- **News** - Blog posts with Markdown content
- **About** - Club description and educational content
- **WhatIsUltimate** - Educational content about ultimate frisbee
- **WhatIsUltimateVideos** - YouTube videos for educational content
- **Website** - Site-wide configuration (hero content, footer text, etc.)
- **Registrations** - Registration submissions

For detailed Directus setup instructions, see [DIRECTUS_SETUP.md](./DIRECTUS_SETUP.md).

## Visual Editing

The site supports Directus Visual Editing for in-context content editing. To enable visual editing:

1. Add `?visual-editing=true` to any page URL
2. The Directus Visual Editing interface will load
3. Editable fields are marked with `data-directus` attributes

Visual editing is implemented in:
- `components/home/home-visual-editing-provider.tsx` - Provider component
- `lib/visual-editing.ts` - Visual editing utilities
- Various components with `setAttr` calls for editable fields

## API Routes

The project includes the following API routes:

- **`/api/register`** - POST endpoint for registration submissions
- **`/api/assets/[...path]`** - Proxy route for Directus assets (handles authentication)

For detailed API documentation, see [API.md](./API.md).

## Analytics

The site uses [Umami Analytics](https://umami.is/) for privacy-focused analytics. The analytics script is loaded in `app/layout.tsx` and tracks:

- Page views
- Custom events (registration form submissions, child/parent additions, etc.)

Analytics events are tracked via `window.umami?.track()` calls throughout the application.

## Testing

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## Styling

- Tailwind CSS with custom component utilities in `app/globals.css`
- shadcn/ui-inspired components in `components/ui/`
- Responsive design with mobile-first approach
- Dark green brand palette (`bg-brand-green`) with white text
- Lexend font family for typography

## Deployment

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

UNLICENSED
