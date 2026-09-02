import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { beforeEach, describe, it, expect, vi } from 'vitest'

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

vi.mock('@/lib/directus', () => ({
  getTeamPhotos: vi.fn(),
  getDirectusAssetUrl: vi.fn((id: string) => `https://example.com/assets/${id}`),
}))

// eslint-disable-next-line import/first
import * as directus from '@/lib/directus'
// eslint-disable-next-line import/first
import TeamPhotosPage from '@/app/team-photos/page'

describe('TeamPhotosPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a section per season, newest first', async () => {
    vi.mocked(directus.getTeamPhotos).mockResolvedValue([
      { id: 1, title: 'U12 squad', image: 'img-1', season_year: 2025, sort: 1, active: true },
      { id: 2, title: 'U14 squad', image: 'img-2', season_year: 2026, sort: 1, active: true },
    ])

    render(await TeamPhotosPage())

    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headings).toEqual(['2026 Season', '2025 Season'])
    expect(screen.getByAltText('U14 squad')).toBeInTheDocument()
  })

  it('pluralizes the per-season photo count', async () => {
    vi.mocked(directus.getTeamPhotos).mockResolvedValue([
      { id: 1, title: 'One', image: 'img-1', season_year: 2026, sort: 1, active: true },
      { id: 2, title: 'Two', image: 'img-2', season_year: 2025, sort: 1, active: true },
      { id: 3, title: 'Three', image: 'img-3', season_year: 2025, sort: 2, active: true },
    ])

    render(await TeamPhotosPage())

    expect(screen.getByText('1 photo')).toBeInTheDocument()
    expect(screen.getByText('2 photos')).toBeInTheDocument()
  })

  it('shows a placeholder notice when there are no photos', async () => {
    vi.mocked(directus.getTeamPhotos).mockResolvedValue([])

    render(await TeamPhotosPage())

    expect(screen.getByText(/Team photos will be added soon/i)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument()
  })

  it('skips a photo whose asset URL cannot be resolved', async () => {
    vi.mocked(directus.getTeamPhotos).mockResolvedValue([
      { id: 1, title: 'Broken ref', image: 'missing', season_year: 2026, sort: 1, active: true },
      { id: 2, title: 'Good ref', image: 'img-2', season_year: 2026, sort: 2, active: true },
    ])
    vi.mocked(directus.getDirectusAssetUrl).mockImplementation((id: any) =>
      id === 'missing' ? null : `https://example.com/assets/${id}`,
    )

    render(await TeamPhotosPage())

    expect(screen.queryByAltText('Broken ref')).not.toBeInTheDocument()
    expect(screen.getByAltText('Good ref')).toBeInTheDocument()
  })

  it('falls back to a season alt text when a photo has no title', async () => {
    vi.mocked(directus.getTeamPhotos).mockResolvedValue([
      { id: 1, title: null, image: 'img-1', season_year: 2026, sort: null, active: true },
    ])

    render(await TeamPhotosPage())

    expect(screen.getByAltText('2026 Season team photo')).toBeInTheDocument()
  })
})
