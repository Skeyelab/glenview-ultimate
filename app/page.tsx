import { getHomePage, getPartners, getPeople, getCurrentSeason } from "@/lib/directus";
import Link from "next/link";

export const revalidate = 300;

export default async function HomePage() {
  const [home, partners, people, season] = await Promise.all([
    getHomePage(),
    getPartners(),
    getPeople(),
    getCurrentSeason(),
  ]);

  const title = home?.hero_title ?? "Glenview Youth Ultimate";
  const subtitle = home?.hero_subtitle ?? "Co-ed, 5th–8th Grade. Everyone is welcome. Everyone plays.";
  const ctaLabel = home?.cta_label ?? "Pre-Register";
  const ctaUrl = home?.cta_url ?? "/register";

  const highlights = season?.highlights ?? [];

  return (
    <div className="space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold">{title}</h1>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto">{subtitle}</p>
        <div className="mt-4">
          <Link className="button" href={ctaUrl}>{ctaLabel}</Link>
        </div>
        {season && (
          <p className="text-sm text-slate-500 mt-2">
            {season.title || `${season.year} Season`} ({season.start_month || "Mar"}–{season.end_month || "May"})
          </p>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Season Highlights</h2>
          {highlights?.length ? (
            <ul className="list-disc ps-5 space-y-1 text-slate-700">
              {highlights.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          ) : (
            <p className="text-slate-700">Highlights coming soon.</p>
          )}
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Leadership</h2>
          <div className="space-y-2">
            {people?.length ? (
              people.map((p) => (
                <div key={p.id} className="border rounded p-2">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-slate-600">{p.role}</div>
                  {p.email && <a className="text-sm" href={`mailto:${p.email}`}>{p.email}</a>}
                </div>
              ))
            ) : (
              <p className="text-slate-700">Captains & coach bios coming soon.</p>
            )}
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold mb-3">Partners</h2>
        <div className="grid gap-3" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))'}}>
          {(partners?.length ? partners : [
            { id: 1, name: "Illinois Ultimate", url: "https://illinoisultimate.org" },
            { id: 2, name: "Chicago Union (UFA)", url: "https://watchufa.com/union" },
            { id: 3, name: "Glenview Park District", url: "https://glenviewparks.org" },
            { id: 4, name: "USA Ultimate", url: "https://usaultimate.org" },
            { id: 5, name: "Ultimate Chicago", url: "https://ultimatechicago.org" },
          ]).map((p) => (
            <a key={p.id} className="border rounded p-3" href={p.url} target="_blank" rel="noreferrer">
              {p.name}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
