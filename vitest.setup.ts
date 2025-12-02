import '@testing-library/jest-dom/vitest'
import { beforeAll, afterAll, vi } from 'vitest'

// Polyfill Web APIs for Node.js environment (needed for Next.js server components)
import { TextEncoder, TextDecoder } from 'util'

// Suppress React act() warnings in tests
// These warnings occur when state updates happen asynchronously in components
// and are generally safe to ignore in test environments
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (
        (args[0].includes('Warning: An update to') && args[0].includes('was not wrapped in act(...)')) ||
        (args[0].includes('An update to') && args[0].includes('inside a test was not wrapped in act(...)'))
      )
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
global.TextEncoder = TextEncoder as typeof globalThis.TextEncoder
global.TextDecoder = TextDecoder as typeof globalThis.TextDecoder

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    // Minimal ReadonlyURLSearchParams mock
    const params = new URLSearchParams('')
    return {
      get: params.get.bind(params),
      toString: params.toString.bind(params),
      // Add any methods lazily as needed by tests/components
    }
  },
}))
