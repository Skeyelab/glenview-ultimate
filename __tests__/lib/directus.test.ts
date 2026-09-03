import { beforeEach, afterAll, vi } from 'vitest'

describe('getDirectusAssetUrl', () => {
  const originalEnv = process.env

  beforeEach(async () => {
    vi.resetModules()
    process.env = { ...originalEnv }
    // Force re-import by clearing the module cache
    await vi.importActual('@/lib/directus')
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should return null for null fileId', async () => {
    const { getDirectusAssetUrl } = await import('@/lib/directus')
    expect(getDirectusAssetUrl(null)).toBeNull()
  })

  it('should return null for undefined fileId', async () => {
    const { getDirectusAssetUrl } = await import('@/lib/directus')
    expect(getDirectusAssetUrl(undefined)).toBeNull()
  })

  it('should return API proxy route when no Directus URL is configured', async () => {
    delete process.env.NEXT_PUBLIC_DIRECTUS_URL
    delete process.env.DIRECTUS_URL
    delete process.env.DIRECTUS_STATIC_TOKEN
    vi.resetModules()
    // Re-import after clearing env vars
    const { getDirectusAssetUrl } = await import('@/lib/directus')
    expect(getDirectusAssetUrl('test-id')).toBe('/api/assets/test-id')
  })

  it('never puts the Directus token in a URL, even when one is configured', async () => {
    // These URLs are rendered into public HTML. A token here is readable by
    // anyone who views source, and was exposing the Registrations collection.
    process.env.DIRECTUS_URL = 'https://private.example.com'
    process.env.DIRECTUS_STATIC_TOKEN = 'super-secret-token'
    vi.resetModules()
    const { getDirectusAssetUrl } = await import('@/lib/directus')

    const url = getDirectusAssetUrl('test-id', { transforms: { width: 800, fit: 'cover' } })

    expect(url).not.toContain('super-secret-token')
    expect(url).not.toContain('access_token')
    expect(url).toContain('/api/assets/test-id')
  })

  it('proxies even when a token is configured, rather than embedding it', async () => {
    process.env.DIRECTUS_URL = 'https://private.example.com'
    process.env.DIRECTUS_STATIC_TOKEN = 'test-token'
    vi.resetModules()
    const { getDirectusAssetUrl } = await import('@/lib/directus')

    expect(getDirectusAssetUrl('test-id')).toBe('/api/assets/test-id')
  })

  it('should use API proxy route when DIRECTUS_STATIC_TOKEN is not available', async () => {
    delete process.env.DIRECTUS_STATIC_TOKEN
    process.env.DIRECTUS_URL = 'https://private.example.com'
    vi.resetModules()
    const { getDirectusAssetUrl } = await import('@/lib/directus')
    expect(getDirectusAssetUrl('test-id')).toBe('/api/assets/test-id')
  })

  it('builds the same proxy URL server-side as client-side', async () => {
    process.env.DIRECTUS_URL = 'https://example.com'
    process.env.DIRECTUS_STATIC_TOKEN = 'test-token'
    vi.resetModules()
    const { getDirectusAssetUrl } = await import('@/lib/directus')

    // One URL for both rendering contexts, so there is no hydration mismatch
    // and no environment where a token can leak.
    expect(getDirectusAssetUrl('c3db7679-c7b9-4d7d-add9-761a96e59b86')).toBe(
      '/api/assets/c3db7679-c7b9-4d7d-add9-761a96e59b86'
    )
  })

  it('should append transform params when using the API proxy route', async () => {
    delete process.env.DIRECTUS_URL
    delete process.env.DIRECTUS_STATIC_TOKEN
    vi.resetModules()
    const { getDirectusAssetUrl } = await import('@/lib/directus')
    expect(
      getDirectusAssetUrl('transform-id', { width: 400, height: 400, fit: 'cover' }),
    ).toBe('/api/assets/transform-id?width=400&height=400&fit=cover')
  })

  it('carries transform params through the proxy when a token is configured', async () => {
    process.env.DIRECTUS_URL = 'https://example.com'
    process.env.DIRECTUS_STATIC_TOKEN = 'test-token'
    vi.resetModules()
    const { getDirectusAssetUrl } = await import('@/lib/directus')

    // The proxy route attaches the token itself and forwards these on.
    expect(
      getDirectusAssetUrl('transform-id', { quality: 70, format: 'webp' }),
    ).toBe('/api/assets/transform-id?quality=70&format=webp')
  })
})

describe('getSchedule', () => {
  const originalEnv = process.env

  beforeEach(async () => {
    vi.resetModules()
    process.env = { ...originalEnv }
    delete process.env.DIRECTUS_URL
    delete process.env.DIRECTUS_STATIC_TOKEN
    await vi.importActual('@/lib/directus')
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('returns a default schedule when Directus is not configured', async () => {
    const { getSchedule } = await import('@/lib/directus')
    const schedule = await getSchedule()

    expect(schedule).toBeTruthy()
    expect(schedule.events.length).toBeGreaterThan(0)
    expect(schedule.title).toMatch(/Season Schedule/i)
  })
})

