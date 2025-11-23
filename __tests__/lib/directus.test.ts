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

  it('should use direct URL with token when DIRECTUS_URL and DIRECTUS_STATIC_TOKEN are available', async () => {
    process.env.DIRECTUS_URL = 'https://private.example.com'
    process.env.DIRECTUS_STATIC_TOKEN = 'test-token'
    vi.resetModules()
    const { getDirectusAssetUrl } = await import('@/lib/directus')
    expect(getDirectusAssetUrl('test-id')).toBe('https://private.example.com/assets/test-id?access_token=test-token')
  })

  it('should use API proxy route when DIRECTUS_STATIC_TOKEN is not available', async () => {
    delete process.env.DIRECTUS_STATIC_TOKEN
    process.env.DIRECTUS_URL = 'https://private.example.com'
    vi.resetModules()
    const { getDirectusAssetUrl } = await import('@/lib/directus')
    expect(getDirectusAssetUrl('test-id')).toBe('/api/assets/test-id')
  })

  it('should construct correct asset URL with token for server-side', async () => {
    process.env.DIRECTUS_URL = 'https://example.com'
    process.env.DIRECTUS_STATIC_TOKEN = 'test-token'
    vi.resetModules()
    const { getDirectusAssetUrl } = await import('@/lib/directus')
    expect(getDirectusAssetUrl('c3db7679-c7b9-4d7d-add9-761a96e59b86')).toBe(
      'https://example.com/assets/c3db7679-c7b9-4d7d-add9-761a96e59b86?access_token=test-token'
    )
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

