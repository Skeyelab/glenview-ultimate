import { beforeEach, afterAll, vi, type Mock } from 'vitest'

// Mock submitRegistration before importing route
vi.mock('@/lib/directus', () => ({
  submitRegistration: vi.fn(),
}))

// Mock Next.js server modules that use Web APIs
vi.mock('next/server', () => {
  class MockNextRequest {
    public url: string
    public method: string
    public headers: Map<string, string>
    private _body?: string

    constructor(url: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) {
      this.url = url
      this.method = init?.method || 'GET'
      this.headers = new Map(
        Object.entries(init?.headers ?? {}).map(([key, value]) => [key.toLowerCase(), value])
      )
      this._body = init?.body
    }
    async json(): Promise<unknown> {
      return JSON.parse(this._body || '{}')
    }
    async text(): Promise<string> {
      return this._body || ''
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      json: (body: unknown, init?: { status?: number }): { json: () => Promise<unknown>; status: number; ok: boolean } => {
        const response = {
          json: async () => body,
          status: init?.status || 200,
          ok: (init?.status || 200) < 400,
        }
        return response
      },
    },
  }
})

// eslint-disable-next-line import/first -- Jest mocks must be before imports
import { POST } from '@/app/api/register/route'
// eslint-disable-next-line import/first -- Jest mocks must be before imports
import { NextRequest } from 'next/server'
// eslint-disable-next-line import/first -- Jest mocks must be before imports
import { submitRegistration } from '@/lib/directus'
// eslint-disable-next-line import/first -- Jest mocks must be before imports
import type { DirectusError } from '@directus/sdk'
// eslint-disable-next-line import/first -- Jest mocks must be before imports
import { HONEYPOT_FIELD, MIN_FILL_MS, REGISTER_RATE_LIMIT, SUSPECTED_SPAM_STATUS, registerRateLimiter } from '@/lib/register-guard'

describe('/api/register', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    registerRateLimiter.reset()
    process.env = {
      ...originalEnv,
      DIRECTUS_URL: 'https://directus.example.com',
      DIRECTUS_STATIC_TOKEN: 'test-token',
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  const createRequest = (body: any, headers: Record<string, string> = {}) => new NextRequest('http://localhost/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    })

  const validBody = { parent1_name: 'Test Parent', parent1_email: 'test@example.com' }

  describe('Directus integration', () => {

    it('should return error when Directus credentials are missing', async () => {
      delete process.env.DIRECTUS_URL
      const mockError = new Error('Directus not configured')
      ;(submitRegistration as Mock).mockRejectedValueOnce(mockError)

      const req = createRequest({
        parent1_name: 'Test Parent',
        parent1_email: 'test@example.com',
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Unexpected error while submitting registration.')
    })

    it('should handle duplicate email error', async () => {
      const mockResponse = { status: 400 } as Partial<Response>;
      const duplicateError: DirectusError<Response> = {
        // @directus/sdk v25 added `name` as a required field on DirectusError.
        name: 'DirectusError',
        message: 'Duplicate entry',
        errors: [
          {
            message: 'Duplicate entry',
            extensions: {
              code: 'RECORD_NOT_UNIQUE',
              field: 'parent1_email',
              value: 'test@example.com',
            },
          },
        ],
        response: mockResponse as Response,
      }
      ;(submitRegistration as Mock).mockRejectedValueOnce(duplicateError)

      const req = createRequest({
        parent1_name: 'Test Parent',
        parent1_email: 'test@example.com',
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.code).toBe('DUPLICATE_EMAIL')
      expect(data.field).toBe('parent1_email')
    })

    it('should handle successful registration', async () => {
      const mockRegistration = {
        id: 123,
        parent1_name: 'Test Parent',
        parent1_email: 'test@example.com',
        children: [{ full_name: 'Child 1' }],
      }
      ;(submitRegistration as Mock).mockResolvedValueOnce(mockRegistration)

      const req = createRequest({
        parent1_name: 'Test Parent',
        parent1_email: 'test@example.com',
        children: [{ full_name: 'Child 1' }],
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ok).toBe(true)
      expect(data.data.id).toBe(123)
    })
  })

  describe('bot protection', () => {
    beforeEach(() => {
      ;(submitRegistration as Mock).mockResolvedValue({ id: 1 })
    })

    it('saves a submission without guard fields as a normal registration', async () => {
      const response = await POST(createRequest(validBody))

      expect(response.status).toBe(200)
      expect(submitRegistration).toHaveBeenCalledWith(validBody)
    })

    it('strips the guard fields before saving a human submission', async () => {
      await POST(createRequest({ ...validBody, [HONEYPOT_FIELD]: '', form_elapsed_ms: MIN_FILL_MS + 1 }))

      expect(submitRegistration).toHaveBeenCalledWith(validBody)
    })

    it('saves a filled honeypot as suspected spam and still reports success', async () => {
      const response = await POST(createRequest({ ...validBody, [HONEYPOT_FIELD]: 'https://spam.example', form_elapsed_ms: 60_000 }))
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ok).toBe(true)
      expect(submitRegistration).toHaveBeenCalledWith({ ...validBody, status: SUSPECTED_SPAM_STATUS })
    })

    it('saves a too-fast submission as suspected spam', async () => {
      await POST(createRequest({ ...validBody, [HONEYPOT_FIELD]: '', form_elapsed_ms: MIN_FILL_MS - 1 }))

      expect(submitRegistration).toHaveBeenCalledWith({ ...validBody, status: SUSPECTED_SPAM_STATUS })
    })

    it('returns 429 with an error message once an IP passes the limit', async () => {
      const headers = { 'X-Forwarded-For': '203.0.113.7, 10.0.0.1' }
      for (let i = 0; i < REGISTER_RATE_LIMIT; i++) {
        expect((await POST(createRequest(validBody, headers))).status).toBe(200)
      }

      const response = await POST(createRequest(validBody, headers))
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.error).toMatch(/Too many registrations/)
      expect(submitRegistration).toHaveBeenCalledTimes(REGISTER_RATE_LIMIT)
    })

    it('does not rate limit requests without a forwarding header', async () => {
      for (let i = 0; i <= REGISTER_RATE_LIMIT; i++) {
        expect((await POST(createRequest(validBody))).status).toBe(200)
      }
    })
  })
})
