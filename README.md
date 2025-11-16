# Glenview Ultimate

[![CI](https://github.com/Skeyelab/glenview-ultimate/actions/workflows/ci.yml/badge.svg)](https://github.com/Skeyelab/glenview-ultimate/actions/workflows/ci.yml)

A Next.js website for Glenview Ultimate, a youth ultimate frisbee organization. The site connects to a Directus CMS backend for content management and includes features for registration, news, schedules, and team information.

## Features

- **Homepage** - Season highlights, team leadership, and partner sponsors
- **Registration** - Multi-child registration form with parent information
- **News** - Blog-style news posts with Markdown support
- **Schedule** - Season calendar with events, practices, and tournaments
- **About** - Team information and what kids learn
- **What is Ultimate** - Educational content about ultimate frisbee

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with `@tailwindcss/forms` and `@tailwindcss/typography`
- **Directus SDK** - CMS integration for content management
- **Jest & React Testing Library** - Testing framework

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
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Fix linting issues
npm run standard

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
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
- **Registrations** - Registration submissions

## Testing

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## Styling

- Tailwind CSS with custom component utilities in `app/globals.css`
- shadcn/ui-inspired components in `components/ui/`
- Responsive design with mobile-first approach

## License

UNLICENSED
