import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { beforeEach, describe, it, expect, vi } from 'vitest'

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

vi.mock('@/lib/directus', () => ({
  getShopItems: vi.fn(),
  getDirectusAssetUrl: vi.fn((id: string | null | undefined) => (id ? `https://example.com/assets/${id}` : null)),
}))

// eslint-disable-next-line import/first
import * as directus from '@/lib/directus'
// eslint-disable-next-line import/first
import { SHOP_STORE_URL } from '@/lib/constants'
// eslint-disable-next-line import/first
import ShopPage from '@/app/shop/page'

describe('ShopPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a card per item, linking to its own campaign in a new tab', async () => {
    vi.mocked(directus.getShopItems).mockResolvedValue([
      { id: 1, title: 'Retro T-Shirt', url: 'https://example.com/retro', image: 'img-1', price_text: '$25', sort: 1, active: true },
      { id: 2, title: 'Camo Sunshirt', url: 'https://example.com/camo', image: 'img-2', sort: 2, active: true },
    ])

    render(await ShopPage())

    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headings).toEqual(['Retro T-Shirt', 'Camo Sunshirt'])
    expect(screen.getByAltText('Retro T-Shirt')).toBeInTheDocument()
    expect(screen.getByText('$25')).toBeInTheDocument()

    const buyLinks = screen.getAllByRole('link', { name: 'Buy on Custom Ink' })
    expect(buyLinks.map((l) => l.getAttribute('href'))).toEqual(['https://example.com/retro', 'https://example.com/camo'])
    expect(buyLinks[0]).toHaveAttribute('target', '_blank')
    expect(buyLinks[0]).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders a card without an image when the item has none', async () => {
    vi.mocked(directus.getShopItems).mockResolvedValue([
      { id: 1, title: 'Mystery Hoodie', url: 'https://example.com/hoodie', image: null, sort: 1, active: true },
    ])

    render(await ShopPage())

    expect(screen.getByRole('heading', { name: 'Mystery Hoodie' })).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('points to the full store when there are no items yet', async () => {
    vi.mocked(directus.getShopItems).mockResolvedValue([])

    render(await ShopPage())

    expect(screen.getByText(/current designs are on our Custom Ink store/i)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Buy on Custom Ink' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse the full store' })).toHaveAttribute('href', SHOP_STORE_URL)
  })

  it('always offers the full store link alongside the items', async () => {
    vi.mocked(directus.getShopItems).mockResolvedValue([
      { id: 1, title: 'Retro T-Shirt', url: 'https://example.com/retro', sort: 1, active: true },
    ])

    render(await ShopPage())

    expect(screen.getByRole('link', { name: 'Browse the full store' })).toHaveAttribute('href', SHOP_STORE_URL)
  })
})
