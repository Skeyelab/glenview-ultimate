// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom')

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
