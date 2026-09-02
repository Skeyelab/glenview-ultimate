import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Body text is white over brand green (#175030). Measured contrast:
 *   white/40 = 2.89:1   white/50 = 3.65:1   (both fail WCAG AA)
 *   white/60 = 4.53:1   white/70 = 5.54:1   (pass)
 *
 * Anything below /60 fails AA for normal-size text, and every prior instance
 * was real content — event locations, dates, day labels — not decoration.
 */
const FLOOR = /text-white\/(?:[1-5]0|[1-9]|[1-5][1-9])\b/g

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return walk(full)
    return full.endsWith('.tsx') ? [full] : []
  })
}

describe('text contrast floor', () => {
  it('has no white text below 60% opacity in components or app', () => {
    const offenders: string[] = []

    for (const file of [...walk('components'), ...walk('app')]) {
      const contents = readFileSync(file, 'utf8')
      contents.split('\n').forEach((line, i) => {
        const hits = line.match(FLOOR)
        if (hits) offenders.push(`${file}:${i + 1} ${hits.join(', ')}`)
      })
    }

    expect(offenders).toEqual([])
  })
})
