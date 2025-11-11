# Glenview Ultimate — Build Plan (Cursor-Ready)

This document is a pragmatic, end-to-end outline for building and deploying the Glenview Ultimate website on your **Coolify** server using **Next.js + Payload CMS + Postgres**, with a smooth path to add registration and payments later. It’s optimized for **Cursor** workflows (Plan/Chat/Composer).

---

## 0) Goals & Non‑Goals

**Goals**
- Launch a fast, secure, editor-friendly site by **ASAP**.
- Editable content (home, schedule, partners, staff, Ultimate 101).
- Pre‑registration form (Phase 0) → real registration + Stripe (Phase 2).
- Low maintenance, easy backups, safe handling of minors’ data.
- One‑person dev velocity; add contributors later.

**Non‑Goals (now)**
- Complex parent/athlete portals, chat, realtime features.
- Native mobile apps.
- Overly custom workflows that slow launch.

---

## 1) Tech Stack (final choice)

- **Frontend:** Next.js (Static export to start; SSR optional later). TypeScript, TailwindCSS.
- **CMS:** Payload CMS (Node) with **Postgres**.
- **Analytics:** Umami (self‑host) or Plausible (hosted).
- **Pre‑Reg Forms (MVP):** Tally/Typeform embed.
- **Payments (future):** Stripe Checkout.
- **Auth (future/portal):** NextAuth with email magic links **or** Supabase Auth.
- **Hosting/Orchestration:** Coolify (Dockerized services).
- **Storage (later, optional):** S3‑compatible (MinIO, R2, or AWS S3) for media.

---

## 2) Repo & Workspace (monorepo)

```
glenview-ultimate/
  apps/
    web/        # Next.js site
    cms/        # Payload CMS
  packages/
    ui/         # Shared UI (buttons, layout, etc.) - optional
    config/     # ESLint, TS config, Prettier, tailwind preset - optional
  .editorconfig
  .gitignore
  package.json  # workspace root
  turbo.json    # optional if using Turborepo
  README.md
```

**Workspace package.json (snippet)**
```json
{
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

---

## 3) Next.js App (apps/web)

- **Rendering:** Start with **Static Export** for minimal ops. Upgrade to SSR if needed.
- **Styling:** TailwindCSS + PostCSS. Use a small design system (Buttons, Card, Section, Container).
- **Routing (initial):**
  - `/` (Home / CTA to Pre‑Register)
  - `/registration` (Tally embed → later full form)
  - `/schedule` (CMS-driven)
  - `/about` (Coaches/staff)
  - `/partners`
  - `/ultimate-101` (links to videos/resources)
  - `/privacy` `/code-of-conduct` `/media-policy` (static pages)
- **Data:** Fetch from **Payload REST/GraphQL** at build time. Revalidate on demand when needed.
- **SEO:** Next/metadata, Open Graph, JSON‑LD for events (schema.org).

**Env (apps/web/.env)**
```
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_CMS_URL=https://cms.example.com
```

**Static export (package.json)**
```json
{
  "scripts": {
    "build": "next build && next export"
  }
}
```

---

## 4) Payload CMS (apps/cms)

**Key collections & globals:**
- `pages` (title, slug, blocks)
- `staff` (name, role, bio, photo, email optional)
- `partners` (name, url, logo, blurb, order)
- `seasons` (name, year, reg_open_at, reg_close_at, status)
- `events` (season, type[practice|tournament|meeting], starts_at, ends_at, venue{ name, address, lat, lng }, notes)
- `resources` (title, url, type[video|pdf|link], order)
- *(Phase 2)* `guardians`, `players`, `households`, `consents`, `registrations`

**Env (apps/cms/.env)**
```
NODE_ENV=production
PORT=3000
PAYLOAD_SECRET=replace_with_long_random_string
DATABASE_URI=postgres://payload_user:password@postgres:5432/payload_db
PAYLOAD_PUBLIC_SERVER_URL=https://cms.example.com

# Email (for password resets / notifications)
SMTP_HOST=smtp.provider.com
SMTP_PORT=587
SMTP_USER=no-reply@example.com
SMTP_PASS=
FROM_EMAIL=Glenview Ultimate <no-reply@example.com>
```

**Access control hints**
- Public read for `pages`, `staff`, `partners`, `events`, `resources`.
- Admin-only for private data (registration).

**Payload start**
```json
{
  "scripts": {
    "build": "payload build",
    "start": "node dist/server.js"
  }
}
```

---

## 5) Content Model (YAML sketch)

```yaml
collections:
  pages:
    fields:
      - {name: title, type: text, required: true}
      - {name: slug, type: text, required: true, unique: true}
      - {name: blocks, type: blocks, blocks: [hero, richText, mediaRow, cta]}

  staff:
    fields:
      - {name: name, type: text, required: true}
      - {name: role, type: text, required: true}
      - {name: email, type: email}
      - {name: bio, type: textarea}
      - {name: photo, type: upload, relationTo: media}

  partners:
    fields:
      - {name: name, type: text, required: true}
      - {name: url, type: text}
      - {name: logo, type: upload, relationTo: media}
      - {name: blurb, type: textarea}
      - {name: order, type: number, defaultValue: 0}

  seasons:
    fields:
      - {name: name, type: text, required: true}
      - {name: year, type: number, required: true}
      - {name: status, type: select, options: [draft, active, archived], defaultValue: draft}
      - {name: reg_open_at, type: date}
      - {name: reg_close_at, type: date}

  events:
    fields:
      - {name: season, type: relationship, relationTo: seasons}
      - {name: type, type: select, options: [practice, tournament, meeting]}
      - {name: starts_at, type: date, required: true}
      - {name: ends_at, type: date}
      - {name: venue_name, type: text}
      - {name: venue_address, type: text}
      - {name: venue_lat, type: number}
      - {name: venue_lng, type: number}
      - {name: notes, type: textarea}

  resources:
    fields:
      - {name: title, type: text, required: true}
      - {name: url, type: text, required: true}
      - {name: type, type: select, options: [video, pdf, link]}
      - {name: order, type: number, defaultValue: 0}

  registrations:  # Phase 2
    access: adminOnly
    fields:
      - {name: season, type: relationship, relationTo: seasons, required: true}
      - {name: household, type: relationship, relationTo: households, required: true}
      - {name: status, type: select, options: [preregistered, pending, confirmed, waitlisted, withdrawn], defaultValue: preregistered}
      - {name: notes, type: textarea}

  households:   # Phase 2
    fields:
      - {name: guardians, type: relationship, relationTo: guardians, hasMany: true}
      - {name: players, type: relationship, relationTo: players, hasMany: true}

  guardians:    # Phase 2
    fields:
      - {name: first_name, type: text, required: true}
      - {name: last_name, type: text, required: true}
      - {name: email, type: email, required: true}
      - {name: phone, type: text}
      - {name: address, type: text}

  players:      # Phase 2
    fields:
      - {name: first_name, type: text, required: true}
      - {name: last_name, type: text, required: true}
      - {name: birthdate, type: date, required: true}
      - {name: grade, type: number, required: true}
      - {name: school, type: text}
      - {name: experience, type: select, options: [new, some, advanced]}
      - {name: medical_notes, type: textarea}
      - {name: shirt_size, type: select, options: [YS, YM, YL, XS, S, M, L, XL]}

  consents:     # Phase 2
    fields:
      - {name: household, type: relationship, relationTo: households, required: true}
      - {name: liability, type: checkbox, required: true}
      - {name: photo, type: checkbox, required: true}
      - {name: code_of_conduct, type: checkbox, required: true}
      - {name: consented_at, type: date}
      - {name: consent_ip, type: text}

globals:
  navigation
  siteSettings
media:
  upload: true
```

---

## 6) Coolify Services (what to run)

1) **Postgres** (single instance; DBs for cms and analytics)  
2) **Payload CMS** (`cms.example.com`, port 3000)  
3) **Next.js Web** (`example.com`)  
4) **Umami** (optional: `analytics.example.com`)  

**DNS**: point A/AAAA records to your server for each domain before first deploy.  
**TLS**: Let’s Encrypt via Coolify per app.

---

## 7) Deployment Steps (Coolify)

**A. Postgres**
- Create Postgres service.
- Create DB: `payload_db`, user: `payload_user` with strong password.
- (Optional) Create DB: `umami_db` for analytics.

**B. CMS (Payload)**
- App type: Node (Dockerfile or Buildpack)
- Build Command: `npm ci && npm run build`
- Start Command: `node dist/server.js`
- Exposed Port: `3000`
- Env: `DATABASE_URI`, `PAYLOAD_SECRET`, `PAYLOAD_PUBLIC_SERVER_URL`, SMTP vars.
- Domain: `cms.example.com`

**C. Web (Next.js static)**
- App type: Static Site
- Build Command: `npm ci && npm run build && npm run export`
- Publish directory: `out/`
- Env: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CMS_URL`
- Domain: `example.com`

*(Switch to SSR later by changing app type to Node and `npm run start`.)*

**D. Umami (optional)**
- Use Coolify template.
- Env: `DATABASE_URL`, `HASH_SALT`.
- Domain: `analytics.example.com`

---

## 8) Pages & Content Blocks

**Home**
- Hero (headline, subhead, CTA button to /registration)
- “Everyone plays” value props (3 cards)
- Partners logo strip
- Season teaser or latest updates

**Registration**
- Tally/Typeform embed (Phase 0)
- Later: native form → POST to Payload `registrations`

**Schedule**
- List events (grouped by season)
- Add schema.org `Event` JSON‑LD

**About / Staff**
- Coach bios + photos
- Spirit of the Game blurb

**Partners**
- Logos + links + blurb

**Ultimate 101**
- Curated videos/resources

**Policies**
- Privacy, Code of Conduct, Media Consent

---

## 9) Components (web)

- `Header`, `Footer`, `Nav`, `Container`
- `Hero`, `Section`, `Card`, `LogoCloud`
- `EventList`, `StaffCard`, `PartnerLogo`
- `MDX/RichText` (optional block renderer)
- `FormEmbed` (Tally block)

---

## 10) Pre‑Registration (Phase 0)

- Use Tally/Typeform with repeatable groups for **players** and **guardians**.
- Required: guardians’ contact, player grade/school, consent checkboxes.
- Notifications: email receipt to parent + internal “registrar” address.
- Export: CSV or Zapier → Google Sheets/Airtable (if you want light ops).

**Embed snippet (example)**
```tsx
export default function Registration() {
  return (
    <section className="container py-12">
      <h1 className="text-3xl font-bold mb-4">Pre‑Registration</h1>
      <p className="mb-6">Complete the form below to save your spot.</p>
      <div className="aspect-video">
        <iframe
          src="https://tally.so/r/FORM_ID?transparentBackground=1"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Pre‑Registration"
        />
      </div>
    </section>
  );
}
```

---

## 11) Registration (Phase 2)

- Build Next.js form → POST `/api/register` (server route) → forward to Payload REST `/api/registrations`.
- Capture **consent timestamp + IP**.
- Send email receipt (Payload `afterChange` hook).
- Stripe Checkout session → webhook → update `registrations.status`.

**Server route sketch (Next.js)**  
```ts
// apps/web/app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const payloadRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/registrations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ...body, consent_ip: ip })
  });
  if (!payloadRes.ok) {
    const err = await payloadRes.text();
    return NextResponse.json({ ok: false, error: err }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
```

---

## 12) Analytics & SEO

- Add Umami script (or Plausible) in `layout.tsx`.
- Configure custom events for “form viewed” and “form submitted”.
- Add `sitemap.xml` and `robots.txt` via Next.
- JSON‑LD for events on Schedule page.

---

## 13) Backups & Ops

- **DB:** nightly `pg_dump` (Coolify backups or a cron container).
- **Uploads:** weekly snapshot of Payload uploads (or use S3 and rely on bucket versioning).
- **Env secrets:** store in Coolify, not in Git.
- **Monitoring:** Uptime Kuma (optional) for public endpoints.

---

## 14) Security & Privacy (minors)

- Collect **explicit guardian consent**; store timestamp + IP.
- Limit access to private collections (registration) via Payload access control.
- Put PII only in Postgres, not in public logs.
- Use role-based accounts for staff editors; enforce strong passwords.
- Rotate secrets periodically.

---

## 15) Timeline (solo realistic)

- **Day 1–2:** CMS + Next static pages + Tally embed + DNS/TLS + analytics.
- **Week 1:** Content polish, Schedule view, Partners/Staff, backups, basic SEO.
- **Weeks 2–3:** Build native registration, email receipts, Stripe (optional).

---

## 16) Cursor Setup

- Add a **project prompt**: “You are refactoring/building a Next.js + Payload CMS site. Keep code concise, typed, and editor-friendly. Prefer composition over props drilling. Avoid unnecessary libs.”
- Use **Plan** to scaffold pages/components and Payload collections.
- Add **Tasks**: `Create Payload collections`, `Fetch CMS data on Home/Schedule`, `Build Tally embed`, `Coolify deploy scripts`.
- Enable **test URLs** (e.g., `dev.local`, `cms.dev.local` via hosts file/Traefik).

---

## 17) Checklists

**Content**
- [ ] Home hero copy + CTA
- [ ] Staff bios + photos
- [ ] Partners logos + links
- [ ] Season + Events seeded
- [ ] Ultimate 101 links
- [ ] Policies drafted

**Engineering**
- [ ] Repos created + workspace wired
- [ ] Payload collections + access
- [ ] Next pages + components
- [ ] Tally embed live
- [ ] Umami/Plausible configured
- [ ] Coolify deploys green

**Ops**
- [ ] DNS pointed
- [ ] TLS issued
- [ ] Backups scheduled
- [ ] Uptime monitor (optional)

---

## 18) Nice‑to‑Haves (later)

- S3/MinIO storage + image optimization pipeline
- Parents’ portal (login → view schedules, fees)
- Email list & segmentation (Brevo/Mailchimp)
- On‑demand ISR revalidation from Payload webhooks
- CSV exporter for rosters/registrations

---

## 19) License & Attribution

- Use MIT for custom code unless you need otherwise.
- Track third‑party asset licenses (logos, photos).

---

## 20) Quick Commands

```bash
# bootstrap
npm i -g turbo
mkdir -p glenview-ultimate/apps/{web,cms} packages/{ui,config}

# next
cd apps/web
npm init -y && npm i next react react-dom typescript tailwindcss postcss autoprefixer
npx tailwindcss init -p

# payload
cd ../cms
npm init -y && npm i payload payload-plugin-cloud --save
# add DB driver if needed (pg)

# coolify: set env and connect repos, then deploy
```
