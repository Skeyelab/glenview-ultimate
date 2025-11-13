describe('getDirectusAssetUrl', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    // Clear module cache to force re-evaluation of constants
    delete require.cache[require.resolve('@/lib/directus')]
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should return null for null fileId', () => {
    const { getDirectusAssetUrl } = require('@/lib/directus')
    expect(getDirectusAssetUrl(null)).toBeNull()
  })

  it('should return null for undefined fileId', () => {
    const { getDirectusAssetUrl } = require('@/lib/directus')
    expect(getDirectusAssetUrl(undefined)).toBeNull()
  })

  it('should return null when no Directus URL is configured', () => {
    delete process.env.NEXT_PUBLIC_DIRECTUS_URL
    delete process.env.DIRECTUS_URL
    // Re-import after clearing env vars
    const { getDirectusAssetUrl } = require('@/lib/directus')
    expect(getDirectusAssetUrl('test-id')).toBeNull()
  })

  it('should use NEXT_PUBLIC_DIRECTUS_URL when available', () => {
    process.env.NEXT_PUBLIC_DIRECTUS_URL = 'https://public.example.com'
    process.env.DIRECTUS_URL = 'https://private.example.com'
    const { getDirectusAssetUrl } = require('@/lib/directus')
    expect(getDirectusAssetUrl('test-id')).toBe('https://public.example.com/assets/test-id')
  })

  it('should fallback to DIRECTUS_URL when NEXT_PUBLIC_DIRECTUS_URL is not set', () => {
    delete process.env.NEXT_PUBLIC_DIRECTUS_URL
    process.env.DIRECTUS_URL = 'https://private.example.com'
    const { getDirectusAssetUrl } = require('@/lib/directus')
    expect(getDirectusAssetUrl('test-id')).toBe('https://private.example.com/assets/test-id')
  })

  it('should construct correct asset URL', () => {
    process.env.NEXT_PUBLIC_DIRECTUS_URL = 'https://example.com'
    const { getDirectusAssetUrl } = require('@/lib/directus')
    expect(getDirectusAssetUrl('c3db7679-c7b9-4d7d-add9-761a96e59b86')).toBe(
      'https://example.com/assets/c3db7679-c7b9-4d7d-add9-761a96e59b86'
    )
  })
})

describe('getSchedule', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    delete require.cache[require.resolve('@/lib/directus')]
    process.env = { ...originalEnv }
    delete process.env.DIRECTUS_URL
    delete process.env.DIRECTUS_STATIC_TOKEN
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('returns a default schedule when Directus is not configured', async () => {
    const { getSchedule } = require('@/lib/directus')
    const schedule = await getSchedule()

    expect(schedule).toBeTruthy()
    expect(schedule.events.length).toBeGreaterThan(0)
    expect(schedule.title).toMatch(/Season Schedule/i)
  })
})

