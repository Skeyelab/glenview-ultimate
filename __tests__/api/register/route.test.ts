// Mock fetch before importing route to avoid Request/Response issues
// This needs to happen before Next.js server code is loaded
import { POST } from '@/app/api/register/route'
import { NextRequest } from 'next/server'

global.fetch = jest.fn()

// Mock Next.js server modules that use Web APIs
// We can't require the actual module because it uses Request which isn't available
jest.mock('next/server', () => ({
  NextRequest: class MockNextRequest {
    constructor(url, init) {
      this.url = url
      this.method = init?.method || 'GET'
      this.headers = new Map()
      this._body = init?.body
    }
    async json() {
      return JSON.parse(this._body || '{}')
    }
    async text() {
      return this._body || ''
    }
  },
  NextResponse: {
    json: (body, init) => {
      const response = {
        json: async () => body,
        status: init?.status || 200,
        ok: (init?.status || 200) < 400,
      }
      return response
    },
  },
}))

describe('/api/register', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = {
      ...originalEnv,
      DIRECTUS_URL: 'https://directus.example.com',
      DIRECTUS_STATIC_TOKEN: 'test-token',
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  const createRequest = (body: any) => new NextRequest('http://localhost/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

  describe('Directus integration', () => {

    it('should return error when Directus credentials are missing', async () => {
      delete process.env.DIRECTUS_URL

      const req = createRequest({
        parent1_name: 'Test Parent',
        parent1_email: 'test@example.com',
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Server missing Directus credentials')
    })

    it('should handle duplicate email error', async () => {
      // Mock Directus duplicate error
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 400,
          text: async () =>
            JSON.stringify({
              errors: [
                {
                  extensions: {
                    code: 'RECORD_NOT_UNIQUE',
                    field: 'parent1_email',
                    value: 'test@example.com',
                  },
                },
              ],
            }),
        })

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
      // Mock Directus success
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          text: async () => JSON.stringify({ data: { id: 123 } }),
        })

      const req = createRequest({
        parent1_name: 'Test Parent',
        parent1_email: 'test@example.com',
        children: [{ full_name: 'Child 1' }],
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ok).toBe(true)
      // Route wraps Directus response: { ok: true, data: <directus_response> }
      // Directus returns: { data: { id: 123 } }
      // So final response is: { ok: true, data: { data: { id: 123 } } }
      expect(data.data?.data?.id).toBe(123)
    })
  })
})
