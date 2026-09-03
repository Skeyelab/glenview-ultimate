import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/image', () => ({ __esModule: true, default: (props: any) => <img {...props} /> }))
vi.mock('@/lib/directus', () => ({ getDirectusAssetUrl: vi.fn(() => 'https://example.com/a.jpg') }))

// eslint-disable-next-line import/first
import * as directus from '@/lib/directus'
// eslint-disable-next-line import/first
import { SeasonGallery } from '@/components/team-photos/season-gallery'

describe('SeasonGallery asset transform', () => {
  beforeEach(() => vi.clearAllMocks())

  it('does not request a quality transform', () => {
    // Directus rejects a transformation containing `quality` when the source
    // exceeds its max dimension, which every photo off a real camera does.
    // Without `quality` the same source resizes fine at any size.
    render(
      <SeasonGallery
        group={{ seasonYear: 2026, label: '2026 Season', photos: [
          { id: 1, title: 'x', image: 'img-1', season_year: 2026, sort: 1, active: true },
        ] }}
      />,
    )

    const opts = vi.mocked(directus.getDirectusAssetUrl).mock.calls[0][1] as any
    expect(opts.transforms).not.toHaveProperty('quality')
    expect(opts.transforms).toMatchObject({ width: 800, height: 600, fit: 'cover' })
  })
})
