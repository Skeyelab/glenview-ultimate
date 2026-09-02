import { beforeEach, afterAll, vi } from 'vitest'

// Mock revalidatePath before importing route
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock Next.js server modules
vi.mock('next/server', () => {
  class MockHeaders {
    private _map: Map<string, string>

    constructor(headers?: Record<string, string>) {
      this._map = new Map()
      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          this._map.set(key.toLowerCase(), value)
        })
      }
    }

    get(name: string): string | null {
      return this._map.get(name.toLowerCase()) || null
    }
  }

  class MockNextRequest {
    public url: string
    public method: string
    public headers: MockHeaders
    private _body?: string

    constructor(url: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) {
      this.url = url
      this.method = init?.method || 'GET'
      this.headers = new MockHeaders(init?.headers)
      this._body = init?.body
    }

    getHeader(name: string): string | null {
      return this.headers.get(name)
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

// eslint-disable-next-line import/first -- Mocks must be before imports
import { POST } from '@/app/api/revalidate/route'
// eslint-disable-next-line import/first -- Mocks must be before imports
import { NextRequest } from 'next/server'
// eslint-disable-next-line import/first -- Mocks must be before imports
import { revalidatePath } from 'next/cache'

describe('/api/revalidate', () => {
  const originalEnv = process.env
  const validSecret = 'test-revalidate-secret'
  const mockRevalidatePath = vi.mocked(revalidatePath)

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = {
      ...originalEnv,
      REVALIDATE_SECRET: validSecret,
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  const createRequest = (body: unknown, headers?: Record<string, string>) => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    }
    return new NextRequest('http://localhost/api/revalidate', {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(body),
    })
  }

  describe('Security', () => {
    it('should reject requests without secret token', async () => {
      const req = createRequest({
        event: 'items.update',
        collection: 'Website',
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
      expect(mockRevalidatePath).not.toHaveBeenCalled()
    })

    it('should reject requests with invalid secret token in header', async () => {
      const req = createRequest(
        {
          event: 'items.update',
          collection: 'Website',
        },
        { 'X-Revalidate-Secret': 'wrong-secret' }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
      expect(mockRevalidatePath).not.toHaveBeenCalled()
    })

    it('should reject requests with invalid secret token in body', async () => {
      const req = createRequest({
        event: 'items.update',
        collection: 'Website',
        secret: 'wrong-secret',
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
      expect(mockRevalidatePath).not.toHaveBeenCalled()
    })

    it('should accept requests with valid secret token in header', async () => {
      const req = createRequest(
        {
          event: 'items.update',
          collection: 'Website',
        },
        { 'X-Revalidate-Secret': validSecret }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.revalidated).toBe(true)
      expect(mockRevalidatePath).toHaveBeenCalled()
    })

    it('should accept requests with valid secret token in body', async () => {
      const req = createRequest({
        event: 'items.update',
        collection: 'Website',
        secret: validSecret,
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.revalidated).toBe(true)
      expect(mockRevalidatePath).toHaveBeenCalled()
    })

    it('should accept requests with valid Bearer token in Authorization header', async () => {
      const req = createRequest(
        {
          event: 'items.update',
          collection: 'Website',
        },
        { Authorization: `Bearer ${validSecret}` }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.revalidated).toBe(true)
      expect(mockRevalidatePath).toHaveBeenCalled()
    })

    it('should reject requests with invalid Bearer token in Authorization header', async () => {
      const req = createRequest(
        {
          event: 'items.update',
          collection: 'Website',
        },
        { Authorization: 'Bearer wrong-token' }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
      expect(mockRevalidatePath).not.toHaveBeenCalled()
    })
  })

  describe('Collection to Path Mapping', () => {
    beforeEach(() => {
      process.env.REVALIDATE_SECRET = validSecret
    })

    it('should revalidate home page for Website collection', async () => {
      const req = createRequest(
        {
          event: 'items.update',
          collection: 'Website',
        },
        { 'X-Revalidate-Secret': validSecret }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockRevalidatePath).toHaveBeenCalledWith('/')
      expect(data.paths).toContain('/')
    })

    it('should revalidate /about for About collection', async () => {
      const req = createRequest(
        {
          event: 'items.update',
          collection: 'About',
        },
        { 'X-Revalidate-Secret': validSecret }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockRevalidatePath).toHaveBeenCalledWith('/about')
      expect(data.paths).toContain('/about')
    })

    it('should revalidate /team-photos for TeamPhotos collection', async () => {
      const req = createRequest(
        {
          event: 'items.create',
          collection: 'TeamPhotos',
        },
        { 'X-Revalidate-Secret': validSecret }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockRevalidatePath).toHaveBeenCalledWith('/team-photos')
      expect(data.paths).toContain('/team-photos')
    })

    it('should revalidate /about for Team collection', async () => {
      const req = createRequest(
        {
          event: 'items.update',
          collection: 'Team',
        },
        { 'X-Revalidate-Secret': validSecret }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockRevalidatePath).toHaveBeenCalledWith('/about')
      expect(data.paths).toContain('/about')
    })

    it('should revalidate /what-is-ultimate for WhatIsUltimate collection', async () => {
      const req = createRequest(
        {
          event: 'items.update',
          collection: 'WhatIsUltimate',
        },
        { 'X-Revalidate-Secret': validSecret }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockRevalidatePath).toHaveBeenCalledWith('/what-is-ultimate')
      expect(data.paths).toContain('/what-is-ultimate')
    })

    it('should revalidate /what-is-ultimate and / for WhatIsUltimateVideos collection', async () => {
      const req = createRequest(
        {
          event: 'items.update',
          collection: 'WhatIsUltimateVideos',
        },
        { 'X-Revalidate-Secret': validSecret }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockRevalidatePath).toHaveBeenCalledWith('/what-is-ultimate')
      expect(mockRevalidatePath).toHaveBeenCalledWith('/')
      expect(data.paths).toContain('/what-is-ultimate')
      expect(data.paths).toContain('/')
    })

    it('should revalidate /schedule and / for Schedule collection', async () => {
      const req = createRequest(
        {
          event: 'items.update',
          collection: 'Schedule',
        },
        { 'X-Revalidate-Secret': validSecret }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockRevalidatePath).toHaveBeenCalledWith('/schedule')
      expect(mockRevalidatePath).toHaveBeenCalledWith('/')
      expect(data.paths).toContain('/schedule')
      expect(data.paths).toContain('/')
    })

    it('should revalidate / for Partners collection', async () => {
      const req = createRequest(
        {
          event: 'items.update',
          collection: 'Partners',
        },
        { 'X-Revalidate-Secret': validSecret }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockRevalidatePath).toHaveBeenCalledWith('/')
      expect(data.paths).toContain('/')
    })

    it('should revalidate /news and /news/[slug] for News collection', async () => {
      const req = createRequest(
        {
          event: 'items.update',
          collection: 'News',
          payload: {
            key: [{ id: 1, slug: 'test-article' }],
          },
        },
        { 'X-Revalidate-Secret': validSecret }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockRevalidatePath).toHaveBeenCalledWith('/news')
      expect(mockRevalidatePath).toHaveBeenCalledWith('/news/test-article')
      expect(data.paths).toContain('/news')
      expect(data.paths).toContain('/news/test-article')
    })

    it('should revalidate /news even without slug for News collection', async () => {
      const req = createRequest(
        {
          event: 'items.update',
          collection: 'News',
        },
        { 'X-Revalidate-Secret': validSecret }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockRevalidatePath).toHaveBeenCalledWith('/news')
      expect(data.paths).toContain('/news')
    })
  })

  describe('Event Types', () => {
    beforeEach(() => {
      process.env.REVALIDATE_SECRET = validSecret
    })

    it('should handle items.create event', async () => {
      const req = createRequest(
        {
          event: 'items.create',
          collection: 'Website',
        },
        { 'X-Revalidate-Secret': validSecret }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.revalidated).toBe(true)
      expect(mockRevalidatePath).toHaveBeenCalled()
    })

    it('should handle items.update event', async () => {
      const req = createRequest(
        {
          event: 'items.update',
          collection: 'Website',
        },
        { 'X-Revalidate-Secret': validSecret }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.revalidated).toBe(true)
      expect(mockRevalidatePath).toHaveBeenCalled()
    })

    it('should handle items.delete event', async () => {
      const req = createRequest(
        {
          event: 'items.delete',
          collection: 'Website',
        },
        { 'X-Revalidate-Secret': validSecret }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.revalidated).toBe(true)
      expect(mockRevalidatePath).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      process.env.REVALIDATE_SECRET = validSecret
    })

    it('should handle missing collection in payload', async () => {
      const req = createRequest(
        {
          event: 'items.update',
        },
        { 'X-Revalidate-Secret': validSecret }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('collection')
      expect(mockRevalidatePath).not.toHaveBeenCalled()
    })

    it('should handle invalid collection name', async () => {
      const req = createRequest(
        {
          event: 'items.update',
          collection: 'InvalidCollection',
        },
        { 'X-Revalidate-Secret': validSecret }
      )

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.revalidated).toBe(true)
      // Unknown collections should still return success but not revalidate anything
      expect(mockRevalidatePath).not.toHaveBeenCalled()
    })

    it('should handle invalid JSON payload', async () => {
      const req = new NextRequest('http://localhost/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Revalidate-Secret': validSecret,
        },
        body: 'invalid json',
      })

      // Mock text() to return invalid JSON
      vi.spyOn(req, 'text').mockResolvedValueOnce('invalid json')

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid JSON')
      expect(mockRevalidatePath).not.toHaveBeenCalled()
    })

    it('should handle JSON with undefined values (Directus webhook format)', async () => {
      const req = new NextRequest('http://localhost/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${validSecret}`,
        },
        body: '{"event":"About.items.update","collection":"About","payload":{"key":undefined}}',
      })

      // Mock text() to return the body with undefined
      vi.spyOn(req, 'text').mockResolvedValueOnce('{"event":"About.items.update","collection":"About","payload":{"key":undefined}}')

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.revalidated).toBe(true)
      expect(data.collection).toBe('About')
      expect(data.paths).toContain('/about')
      expect(mockRevalidatePath).toHaveBeenCalledWith('/about')
    })
  })
})

