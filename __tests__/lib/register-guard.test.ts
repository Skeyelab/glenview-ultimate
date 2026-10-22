import { describe, it, expect } from 'vitest'
import { MIN_FILL_MS, clientIp, createRateLimiter, detectBot } from '@/lib/register-guard'

describe('detectBot', () => {
  it('treats a submission with no signals as human, so pre-deploy pages still register normally', () => {
    expect(detectBot({})).toBeNull()
  })

  it('flags a filled honeypot', () => {
    expect(detectBot({ honeypot: 'https://spam.example', elapsedMs: 60_000 })).toBe('honeypot')
  })

  it('ignores a whitespace-only honeypot', () => {
    expect(detectBot({ honeypot: '  ', elapsedMs: 60_000 })).toBeNull()
  })

  it('flags a form submitted faster than a person could fill it', () => {
    expect(detectBot({ honeypot: '', elapsedMs: MIN_FILL_MS - 1 })).toBe('too_fast')
  })

  it('accepts a form open for at least the minimum fill time', () => {
    expect(detectBot({ honeypot: '', elapsedMs: MIN_FILL_MS })).toBeNull()
  })
})

describe('clientIp', () => {
  it('takes the first address in x-forwarded-for', () => {
    expect(clientIp('203.0.113.7, 10.0.0.1')).toBe('203.0.113.7')
  })

  it('returns null when the header is missing or empty', () => {
    expect(clientIp(null)).toBeNull()
    expect(clientIp('')).toBeNull()
  })
})

describe('createRateLimiter', () => {
  it('allows up to the limit within the window, then refuses', () => {
    const limiter = createRateLimiter(2, 1000)
    expect(limiter.allow('a', 0)).toBe(true)
    expect(limiter.allow('a', 10)).toBe(true)
    expect(limiter.allow('a', 20)).toBe(false)
  })

  it('counts each key separately', () => {
    const limiter = createRateLimiter(1, 1000)
    expect(limiter.allow('a', 0)).toBe(true)
    expect(limiter.allow('b', 0)).toBe(true)
  })

  it('lets a key back in once its old hits leave the window', () => {
    const limiter = createRateLimiter(1, 1000)
    expect(limiter.allow('a', 0)).toBe(true)
    expect(limiter.allow('a', 999)).toBe(false)
    expect(limiter.allow('a', 1000)).toBe(true)
  })
})
