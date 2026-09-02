import { describe, it, expect } from 'vitest'
import { NAV_LINKS } from '@/components/navbar/nav-links'

/**
 * app/layout.tsx strips content-dependent nav links when their collection is
 * empty. AGENTS.md requires new nav items to follow that pattern; Team Photos
 * shipped without it and linked to a blank page.
 */
function visibleLinks(opts: { hasNews: boolean; hasTeamPhotos: boolean }): string[] {
  let links = [...NAV_LINKS]
  if (!opts.hasNews) links = links.filter((l) => l.href !== '/news')
  if (!opts.hasTeamPhotos) links = links.filter((l) => l.href !== '/team-photos')
  return links.map((l) => l.href)
}

describe('conditional nav links', () => {
  it('hides Team Photos when there are no photos', () => {
    expect(visibleLinks({ hasNews: true, hasTeamPhotos: false })).not.toContain('/team-photos')
  })

  it('shows Team Photos once photos exist', () => {
    expect(visibleLinks({ hasNews: true, hasTeamPhotos: true })).toContain('/team-photos')
  })

  it('hides both when both collections are empty', () => {
    const links = visibleLinks({ hasNews: false, hasTeamPhotos: false })
    expect(links).not.toContain('/news')
    expect(links).not.toContain('/team-photos')
    expect(links).toContain('/schedule')
  })
})
