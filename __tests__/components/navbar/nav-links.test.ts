import { describe, it, expect } from 'vitest'
import { NAV_LINKS } from '@/components/navbar/nav-links'

describe('NAV_LINKS', () => {
  it('includes a Team Photos entry pointing at /team-photos', () => {
    expect(NAV_LINKS).toContainEqual({ href: '/team-photos', label: 'Team Photos' })
  })
})
