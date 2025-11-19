// Mock submitRegistration before importing route
jest.mock('@/lib/directus', () => ({
  submitRegistration: jest.fn(),
}))

jest.mock('@/lib/turnstile', () => ({
  verifyTurnstileToken: jest.fn().mockResolvedValue(true),
}))

// Mock Next.js server modules that use Web APIs
jest.mock('next/server', () => {
  class MockNextRequest {
    public url: string
    public method: string
    public headers: Map<string, string>
    private _body?: string

    constructor(url: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) {
      this.url = url
      this.method = init?.method || 'GET'
      this.headers = new Map()
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
import { verifyTurnstileToken } from '@/lib/turnstile'

describe('/api/register', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = {
      ...originalEnv,
      DIRECTUS_URL: 'https://directus.example.com',
      DIRECTUS_STATIC_TOKEN: 'test-token',
      TURNSTILE_SECRET_KEY: 'ts-secret',
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  const createRequest = (body: any, includeToken: boolean = true) => new NextRequest('http://localhost/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(includeToken ? { turnstile_token: 'valid-token', ...body } : body),
    })

  describe('Turnstile verification', () => {
    it('returns 400 when token is missing', async () => {
      const req = createRequest({
        parent1_name: 'Test Parent',
        parent1_email: 'test@example.com',
      }, false)

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toMatch(/verification challenge/i)
      expect(submitRegistration).not.toHaveBeenCalled()
    })

    it('returns 400 when secret key is missing', async () => {
      delete process.env.TURNSTILE_SECRET_KEY
      const req = createRequest({
        parent1_name: 'Test Parent',
        parent1_email: 'test@example.com',
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toMatch(/temporarily unavailable/i)
      expect(verifyTurnstileToken).not.toHaveBeenCalled()
    })

    it('returns 400 when verification fails', async () => {
      ;(verifyTurnstileToken as jest.Mock).mockResolvedValueOnce(false)
      const req = createRequest({
        parent1_name: 'Test Parent',
        parent1_email: 'test@example.com',
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toMatch(/unable to verify/i)
      expect(submitRegistration).not.toHaveBeenCalled()
    })
  })

  describe('Directus integration', () => {

    it('should return error when Directus credentials are missing', async () => {
      delete process.env.DIRECTUS_URL
      const mockError = new Error('Directus not configured')
      ;(submitRegistration as jest.Mock).mockRejectedValueOnce(mockError)

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
      ;(submitRegistration as jest.Mock).mockRejectedValueOnce(duplicateError)

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
      ;(submitRegistration as jest.Mock).mockResolvedValueOnce(mockRegistration)

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
})
