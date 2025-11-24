# Testing Guide

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/react) for testing.

## Setup

Install dependencies:
```bash
yarn install
```

## Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

## Test Structure

Tests are located in the `__tests__` directory, mirroring the source structure:

- `__tests__/api/` - API route tests
- `__tests__/lib/` - Utility function tests
- `__tests__/components/` - Component tests (to be added)

## Current Test Coverage

### ✅ Implemented

1. **API Route Tests** (`__tests__/api/register/route.test.ts`)
   - Missing Directus credentials handling
   - Successful registration flow
   - Duplicate email error handling

2. **Directus Helper Tests** (`__tests__/lib/directus.test.ts`)
   - `getDirectusAssetUrl()` function
   - Environment variable handling
   - URL construction

### 🔲 Recommended Additional Tests

1. **Registration Form Component** (`app/register/page.tsx`)
   - Form validation
   - Form submission flow
   - Error message display
   - Child addition/removal
   - Parent addition/removal

2. **Navbar Component** (`components/navbar.tsx`)
   - Logo rendering
   - Navigation links
   - Active state highlighting

3. **Directus API Functions** (`lib/directus.ts`)
   - `getPeople()` - with mocked fetch
   - `getPartners()` - with mocked fetch
   - `getCurrentSeason()` - with mocked fetch
   - `getNewsList()` - with mocked fetch
   - `getNewsBySlug()` - with mocked fetch

4. **Page Components**
   - Homepage rendering
   - News listing page
   - News detail page
   - About page

## Writing Tests

### Example: Testing a Component

```typescript
import { render, screen } from '@testing-library/react'
import { Navbar } from '@/components/navbar'

describe('Navbar', () => {
  it('should render logo when Directus URL is configured', () => {
    process.env.NEXT_PUBLIC_DIRECTUS_URL = 'https://example.com'
    render(<Navbar />)
    // Add assertions
  })
})
```

### Example: Testing an API Route

```typescript
import { POST } from '@/app/api/register/route'
import { NextRequest } from 'next/server'

describe('/api/register', () => {
  it('should handle valid request', async () => {
    const req = new NextRequest('http://localhost/api/register', {
      method: 'POST',
      body: JSON.stringify({ /* test data */ }),
    })

    const response = await POST(req)
    expect(response.status).toBe(200)
  })
})
```

## Mocking

- **Next.js Router**: Mocked in `jest.setup.js`
- **Fetch API**: Mocked per test using `global.fetch = jest.fn()`
- **Environment Variables**: Set/unset per test using `process.env`

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Reset mocks and environment variables between tests
3. **Descriptive Names**: Test names should clearly describe what they're testing
4. **Coverage**: Aim for high coverage of critical paths (API routes, form validation)
5. **Integration Tests**: Prefer integration tests over unit tests for complex flows

## CI/CD Integration

Tests are automatically run in CI via GitHub Actions. The workflow runs:

```yaml
- name: Run tests
  run: yarn test:coverage
```

## Test Configuration

- Test configuration: `vitest.config.ts`
- Test setup: `vitest.setup.ts`
- Coverage reports: Generated in `coverage/` directory

