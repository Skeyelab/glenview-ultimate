// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom')

// Suppress React act() warnings in tests
// These warnings occur when state updates happen asynchronously in components
// and are generally safe to ignore in test environments
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to') &&
      args[0].includes('was not wrapped in act(...)')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Polyfill Web APIs for Node.js environment (needed for Next.js server components)
const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
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
