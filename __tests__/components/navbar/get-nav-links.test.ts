import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/directus', () => ({
  hasNewsArticles: vi.fn(),
  hasTeamPhotos: vi.fn(),
}))

// eslint-disable-next-line import/first
import * as directus from '@/lib/directus'
// eslint-disable-next-line import/first
import { getNavLinks } from '@/components/navbar/get-nav-links'

function hrefs(links: readonly { href: string }[]): string[] {
  return links.map((l) => l.href)
}

describe('getNavLinks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(directus.hasNewsArticles).mockResolvedValue(true)
    vi.mocked(directus.hasTeamPhotos).mockResolvedValue(true)
  })

  it('returns every link when all gated content exists', async () => {
    expect(hrefs(await getNavLinks())).toContain('/news')
    expect(hrefs(await getNavLinks())).toContain('/team-photos')
  })

  it('hides News when there are no articles', async () => {
    vi.mocked(directus.hasNewsArticles).mockResolvedValue(false)

    const links = hrefs(await getNavLinks())
    expect(links).not.toContain('/news')
    expect(links).toContain('/team-photos')
  })

  it('hides Team Photos when there are no photos', async () => {
    vi.mocked(directus.hasTeamPhotos).mockResolvedValue(false)

    const links = hrefs(await getNavLinks())
    expect(links).not.toContain('/team-photos')
    expect(links).toContain('/news')
  })

  it('never hides ungated links', async () => {
    vi.mocked(directus.hasNewsArticles).mockResolvedValue(false)
    vi.mocked(directus.hasTeamPhotos).mockResolvedValue(false)

    expect(hrefs(await getNavLinks())).toEqual(['/', '/about', '/what-is-ultimate', '/schedule'])
  })

  it('preserves the declared order', async () => {
    expect(hrefs(await getNavLinks())).toEqual([
      '/', '/about', '/what-is-ultimate', '/news', '/schedule', '/team-photos',
    ])
  })

  it('queries each gate exactly once per call', async () => {
    await getNavLinks()

    expect(directus.hasNewsArticles).toHaveBeenCalledTimes(1)
    expect(directus.hasTeamPhotos).toHaveBeenCalledTimes(1)
  })
})
