/**
 * Lightweight bot protection for POST /api/register.
 *
 * Turnstile was tried twice and removed (PRs #21, #84, #85), so this relies on
 * signals a parent never sees: a hidden honeypot input and how long the form
 * was open before submit. Neither rejects anything. A tripped signal saves the
 * registration with SUSPECTED_SPAM_STATUS so Brian can review it, because
 * silently dropping a real family is worse than deleting a spam row.
 */

/**
 * Honeypot input name. Deliberately meaningless: browser autofill fills inputs
 * named website, url, company, fax and the like, which would flag real parents.
 */
export const HONEYPOT_FIELD = "hp_field_x7";

/** Faster than any person can fill the form; slow enough to survive autofill. */
export const MIN_FILL_MS = 3000;

export const SUSPECTED_SPAM_STATUS = "suspected_spam";

export interface BotSignals {
  honeypot?: string;
  /** Milliseconds between the form mounting and submit, measured on the client. */
  elapsedMs?: number;
}

/**
 * Why a submission looks automated, or null when it looks human.
 *
 * A missing elapsedMs is not a signal: a parent whose page loaded before this
 * shipped submits without it, and that must still count as a normal signup.
 */
export function detectBot({ honeypot, elapsedMs }: BotSignals): string | null {
  if (honeypot && honeypot.trim() !== "") return "honeypot";
  if (typeof elapsedMs === "number" && elapsedMs < MIN_FILL_MS) return "too_fast";
  return null;
}

/**
 * The caller's IP as seen by Traefik, or null when there is no forwarding
 * header. Callers skip rate limiting for null rather than pooling every
 * header-less request into one shared bucket.
 */
export function clientIp(forwardedFor: string | null | undefined): string | null {
  const first = forwardedFor?.split(",")[0]?.trim();
  return first ? first : null;
}

export interface RateLimiter {
  /** Records a hit for key and returns false once key is over the limit. */
  allow: (key: string, now?: number) => boolean;
  reset: () => void;
}

/**
 * Sliding-window limiter held in memory.
 *
 * Fine because the site runs as one container on ger3; with more than one
 * instance each would keep its own count. The limit is generous on purpose:
 * families at a signup night share the venue's IP.
 */
export function createRateLimiter(limit: number, windowMs: number): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    allow(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      return true;
    },
    reset() {
      hits.clear();
    },
  };
}

export const REGISTER_RATE_LIMIT = 20;
export const REGISTER_RATE_WINDOW_MS = 60 * 60 * 1000;

export const registerRateLimiter = createRateLimiter(REGISTER_RATE_LIMIT, REGISTER_RATE_WINDOW_MS);
