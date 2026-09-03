import { hasNewsArticles, hasTeamPhotos } from "@/lib/directus";
import { NAV_LINKS, type NavLinkItem } from "./nav-links";

/**
 * Nav entries that only appear once their collection has content.
 *
 * Declared as data rather than branches so adding a content-gated nav item is
 * one entry here, not another condition inside the layout. A link with no entry
 * is always visible.
 */
const CONTENT_GATES: Readonly<Record<string, () => Promise<boolean>>> = {
  "/news": hasNewsArticles,
  "/team-photos": hasTeamPhotos,
};

/**
 * The nav links a visitor should actually see.
 *
 * A nav item promising content that leads to an empty page reads as unfinished,
 * so those links are hidden until their collection has rows. Gates are resolved
 * in parallel and each is queried exactly once per call, however many links
 * that gate covers.
 */
export async function getNavLinks(): Promise<readonly NavLinkItem[]> {
  const gated = Object.entries(CONTENT_GATES);
  const results = await Promise.all(gated.map(async ([, hasContent]) => hasContent()));
  const visibility = new Map(gated.map(([href], i) => [href, results[i]]));

  return NAV_LINKS.filter((link) => visibility.get(link.href) ?? true);
}
