/**
 * Directus smoke test — exercises the REAL @directus/sdk against the live CMS.
 *
 * Why this exists: every Directus test in __tests__ mocks `@directus/sdk`
 * wholesale, so they assert that our code calls `readItems` with the right
 * arguments and nothing more. A breaking change in the SDK — a renamed export,
 * a changed client builder, a different response shape — passes CI and the
 * build, and only fails against a real instance.
 *
 * Run it before merging any @directus/sdk version bump, and after a deploy:
 *
 *   doppler run -p glenview-ultimate -c dev -- yarn smoke:directus
 *
 * Exits non-zero on the first failure so it is usable as a gate.
 */
import {
  getTeam,
  getPartners,
  getSchedule,
  getWebsite,
  getAbout,
  getWhatIsUltimate,
  getWhatIsUltimateVideos,
  getTeamPhotos,
  getNewsList,
  getDirectusAssetUrl,
} from "../lib/directus";

const failures: string[] = [];
let checks = 0;

function check(name: string, ok: boolean, detail: string): void {
  checks += 1;
  if (ok) {
    console.log(`  PASS  ${name} — ${detail}`);
  } else {
    console.log(`  FAIL  ${name} — ${detail}`);
    failures.push(name);
  }
}

async function main(): Promise<void> {
  // Guard first: without env, withDirectus returns hardcoded fallbacks and
  // every check below would pass while testing nothing.
  if (!process.env.DIRECTUS_URL || !process.env.DIRECTUS_STATIC_TOKEN) {
    console.error("DIRECTUS_URL / DIRECTUS_STATIC_TOKEN not set — this test would silently pass against fallbacks. Aborting.");
    process.exit(2);
  }
  console.log(`Directus smoke test against ${process.env.DIRECTUS_URL}\n`);

  const [team, partners, schedule, website, about, wiu, videos, photos, news] = await Promise.all([
    getTeam(),
    getPartners(),
    getSchedule(),
    getWebsite(),
    getAbout(),
    getWhatIsUltimate(),
    getWhatIsUltimateVideos(),
    getTeamPhotos(),
    getNewsList(5),
  ]);

  check("getTeam", team.length > 0, `${team.length} members`);
  check("getPartners", partners.length > 0, `${partners.length} partners`);
  check("getWebsite", Boolean(website?.hero_title), `hero_title=${JSON.stringify(website?.hero_title ?? null)}`);
  check("getAbout", about !== null, about ? "returned a record" : "null");
  check("getWhatIsUltimate", wiu !== null, wiu ? "returned a record" : "null");
  check("getTeamPhotos", photos.length > 0, `${photos.length} photos`);

  // News and videos are legitimately allowed to be empty; only assert the call
  // completed and returned an array, which is what an SDK break would violate.
  check("getNewsList", Array.isArray(news), `${news.length} articles`);
  check("getWhatIsUltimateVideos", Array.isArray(videos), `${videos.length} videos`);

  // The schedule has a 5-event hardcoded fallback. More than that proves we are
  // reading the CMS rather than DEFAULT_SCHEDULE.
  check(
    "getSchedule reads the CMS, not DEFAULT_SCHEDULE",
    schedule.events.length > 5,
    `${schedule.events.length} events (fallback is 5)`,
  );

  // Contract checks that a changed response shape would break.
  const firstPhoto = photos[0];
  check(
    "TeamPhoto shape",
    typeof firstPhoto?.season_year === "number" && typeof firstPhoto?.image === "string",
    `season_year=${typeof firstPhoto?.season_year} image=${typeof firstPhoto?.image}`,
  );

  // Asset transforms are a separate failure surface from the SDK: a rejected
  // transformation renders every photo as a blank box while the API is fine.
  const src = getDirectusAssetUrl(firstPhoto?.image, {
    transforms: { width: 800, height: 600, fit: "cover" },
  });
  if (src) {
    const res = await fetch(src);
    check("asset transform", res.ok, `${res.status} for ${src.split("?")[0].slice(-12)}`);
  } else {
    check("asset transform", false, "getDirectusAssetUrl returned null");
  }

  console.log(`\n${checks - failures.length}/${checks} passed`);
  if (failures.length > 0) {
    console.error(`FAILED: ${failures.join(", ")}`);
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  // An SDK break surfaces here, not as a failed assertion.
  console.error("\nsmoke test threw:", error instanceof Error ? error.message : error);
  process.exit(1);
});
