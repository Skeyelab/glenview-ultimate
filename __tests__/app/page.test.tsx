import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { beforeEach, afterEach, vi } from 'vitest'
import * as directus from '@/lib/directus'
import HomePage from '@/app/page'

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

vi.mock('@/lib/directus', () => ({
  getPartners: vi.fn(),
  getSchedule: vi.fn(),
  getWebsite: vi.fn(),
  getNewsList: vi.fn(),
  getWhatIsUltimateVideos: vi.fn(),
  getDirectusAssetUrl: vi.fn(() => 'https://example.com/assets/logo.png'),
}))

describe('HomePage (integration)', () => {
  const mockPartners = [{ id: 1, name: 'Partner 1', url: 'https://p1.test', logo: 'logo-id' }]
  const mockSchedule = {
    highlights: [],
    events: [
      {
        id: 1,
        season_year: 2026,
        event_type: 'season_start',
        title: 'Season Kickoff',
        date: '2026-03-01T10:00:00.000Z',
        end_date: null,
        location: 'Main Field',
        description: null,
        highlight: true,
      },
    ],
  } as any
  const mockWebsite = {
    id: 1,
    site_name: 'Glenview Ultimate',
    hero_title: 'Custom Hero',
    hero_block: '<p>Welcome to Glenview Ultimate</p>',
    hero_cta_label: 'Sign Up',
    hero_cta_url: '/register',
  }
  const mockNews = [{ id: 1, slug: 'test', title: 'Test News', published_at: '2026-01-01', content: 'Content' }]

  const directusMock = vi.mocked(directus)

  beforeEach(() => {
    vi.clearAllMocks()
    directusMock.getPartners.mockResolvedValue(mockPartners)
    directusMock.getSchedule.mockResolvedValue(mockSchedule)
    directusMock.getWebsite.mockResolvedValue(mockWebsite)
    directusMock.getNewsList.mockResolvedValue(mockNews)
    directusMock.getWhatIsUltimateVideos.mockResolvedValue([])
    // Pinned: the fixture's Season Kickoff is 2026-03-01, and highlights are now
    // filtered to upcoming events. Without this the suite silently changes
    // meaning once that date passes.
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-15T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('omits highlighted events that have already happened', async () => {
    vi.setSystemTime(new Date('2026-08-01T00:00:00Z'))

    render(await HomePage())

    expect(screen.queryByText('Season Kickoff')).not.toBeInTheDocument()
  })

  it('renders hero, highlights, latest news, and partners using real components', async () => {
    const page = await HomePage()
    render(page)

    expect(screen.getByRole('heading', { level: 1, name: /custom hero/i })).toBeInTheDocument()
    expect(screen.getByText('Season Kickoff')).toBeInTheDocument()
    expect(screen.getByText('Test News')).toBeInTheDocument()
    expect(screen.getByText('Partner 1')).toBeInTheDocument()
  })
})
