import { describe, it, expect } from 'vitest'
import { groupPhotosBySeason } from '@/lib/team-photos-utils'
import type { TeamPhoto } from '@/lib/directus'

function photo(over: Partial<TeamPhoto> & { id: number; season_year: number }): TeamPhoto {
  return { image: `img-${over.id}`, title: null, sort: null, active: true, ...over }
}

describe('groupPhotosBySeason', () => {
  it('returns an empty array when there are no photos', () => {
    expect(groupPhotosBySeason([])).toEqual([])
  })

  it('groups by season with the newest season first', () => {
    const groups = groupPhotosBySeason([
      photo({ id: 1, season_year: 2024 }),
      photo({ id: 2, season_year: 2026 }),
      photo({ id: 3, season_year: 2025 }),
    ])

    expect(groups.map((g) => g.seasonYear)).toEqual([2026, 2025, 2024])
    expect(groups[0].label).toBe('2026 Season')
  })

  it('orders photos within a season by sort', () => {
    const groups = groupPhotosBySeason([
      photo({ id: 1, season_year: 2026, sort: 3 }),
      photo({ id: 2, season_year: 2026, sort: 1 }),
      photo({ id: 3, season_year: 2026, sort: 2 }),
    ])

    expect(groups[0].photos.map((p) => p.id)).toEqual([2, 3, 1])
  })

  it('falls back to id order when sort is unset', () => {
    const groups = groupPhotosBySeason([
      photo({ id: 9, season_year: 2026 }),
      photo({ id: 4, season_year: 2026 }),
    ])

    expect(groups[0].photos.map((p) => p.id)).toEqual([4, 9])
  })

  it('places photos with a sort ahead of photos without one', () => {
    const groups = groupPhotosBySeason([
      photo({ id: 1, season_year: 2026 }),
      photo({ id: 2, season_year: 2026, sort: 5 }),
    ])

    expect(groups[0].photos.map((p) => p.id)).toEqual([2, 1])
  })
})
