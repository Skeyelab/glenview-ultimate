import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { beforeEach, vi } from 'vitest'
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
  const mockPartners = [{ id: 'p1', name: 'Partner 1', url: 'https://p1.test', logo: 'logo-id' }]
  const mockSchedule = { highlights: ['Highlight 1'], events: [] } as any
  const mockWebsite = {
    id: 1,
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
  })

  it('renders hero, highlights, latest news, and partners using real components', async () => {
    const page = await HomePage()
    render(page)

    expect(screen.getByRole('heading', { level: 1, name: /custom hero/i })).toBeInTheDocument()
    expect(screen.getByText('Highlight 1')).toBeInTheDocument()
    expect(screen.getByText('Test News')).toBeInTheDocument()
    expect(screen.getByText('Partner 1')).toBeInTheDocument()
  })
})
