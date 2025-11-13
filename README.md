# Glenview Ultimate — Next.js + Directus starter (Tailwind)

[![CI](https://github.com/Skeyelab/glenview-ultimate/actions/workflows/ci.yml/badge.svg)](https://github.com/Skeyelab/glenview-ultimate/actions/workflows/ci.yml)

This is a minimal, production-ready starter that connects a Next.js front-end to a Directus CMS back-end.
It includes a registration form that writes to a `registrations` collection and public pages that
can be managed from Directus.

## 1) Directus quick setup

1. Install Directus (Docker or Node). See: https://docs.directus.io/self-hosted/quickstart.html
2. Create an **Admin** account and log into the Studio.
3. Create a **Static Access Token** (Settings → Access Tokens). Give it a descriptive name (e.g., “Website Form Token”) and scope it to a role that can read public content and create registrations.
4. Create the following **collections** in Data Model (with suggested fields). You can rename as you like.

### `pages`
- `slug` (string, unique) — e.g., `home`, `about`
- `title` (string)
- `hero_title` (string, optional)
- `hero_subtitle` (text, optional)
- `cta_label` (string, optional)
- `cta_url` (string, optional)
- `content` (rich text or markdown, optional)

### `people`
- `name` (string)
- `role` (string) — e.g., "Boys Team Captain", "Girls Team Captain", "Head Coach"
- `email` (string, optional)
- `bio` (text, optional)
- `photo` (file, optional)

### `partners`
- `name` (string)
- `url` (string, required)
- `logo` (file, optional)

### `registrations`
- `parent1_name` (string, required)
- `parent1_email` (string, required)
- `parent1_phone` (string, optional)
- `parent2_name` (string, optional)
- `parent2_email` (string, optional)
- `parent2_phone` (string, optional)
- `children` (JSON) — array of children objects: `{ full_name, age, experience, availability[] }`
- `notes` (text, optional)
- `marketing_opt_in` (boolean, default false)

> Tip: Using a JSON field for `children` keeps the form simple. If you prefer relational data, create a `children` collection and a one-to-many relation from `registrations` → `children`.

5. **Permissions** (Settings → Roles & Permissions):
   - For the **Public** role, allow **read** on `pages`, `people`, `partners`.
   - For submissions, do **not** grant Public create permissions. Instead, create a dedicated role (e.g., `webform`) with **create** on `registrations` and generate the static token for that role. The token is only used server-side.

6. (Optional) **Flows & Notifications**:
   - Create a Flow triggered on **Create → registrations** to send an email to organizers and/or write to Google Sheets.

7. Seed some content:
   - Create a `pages` item with `slug=home`, set your hero text and CTA.
   - Add your `people` and `partners` items.

## 2) Configure the Next.js app

1. Copy `.env.example` to `.env.local` and fill:
   ```ini
   DIRECTUS_URL=https://your-directus.example.com
   DIRECTUS_STATIC_TOKEN=YOUR_STATIC_TOKEN
   NEXT_PUBLIC_DIRECTUS_URL=https://your-directus.example.com
   NEXT_PUBLIC_SITE_NAME=Glenview Ultimate
   ```

   **Notes:**
   - `NEXT_PUBLIC_DIRECTUS_URL` is needed for client components (like the navbar logo) to access Directus assets. It should match `DIRECTUS_URL`.
   - The SDK uses `DIRECTUS_STATIC_TOKEN`. Keep it scoped to the minimal permissions required and rotate it periodically.
2. Install and run:
   ```bash
   npm i
   npm run dev
   ```

## 3) Tailwind CSS

- Tailwind is pre-configured with `@tailwindcss/forms` and `@tailwindcss/typography`.
- Global component shortcuts live in `app/globals.css` (e.g., `.button`, `.card`, `.input`, `.grid-2`) built with `@apply`.
- You can replace these shortcuts with inline utilities as you iterate on the design.

### Files
- `tailwind.config.ts` — content paths, container width
- `postcss.config.js` — PostCSS pipeline
- `app/globals.css` — Tailwind layers + component utilities

## 4) Hardening & production notes

- Create a **dedicated role** for the static token with the minimum scope (e.g., `webform` that can create `registrations` only). Rotate the token periodically.
- Add bot protection/rate limiting to the registration form (e.g., Cloudflare Turnstile, hCaptcha, or rate limiting middleware).
- Add field **validation** in Directus (required, email format, etc.).
- Add **CORS** settings in Directus if you later move to direct client reads.
- Use **revalidate** or on-demand revalidation webhooks for fresher content.
- Host Next.js on Vercel, Fly.io, Render, or your own infra.

Happy building!

---

## Directus: new collections for Homepage & News

### `seasons`
- `year` (integer, unique or sortable)
- `title` (string, optional) — e.g., "Spring 2026"
- `highlights` (JSON, array of strings) — e.g., ["12 weeks of practice", "3–4 tournaments"]
- `start_month` (string, optional) — e.g., "March"
- `end_month` (string, optional) — e.g., "May"

> The homepage reads the **latest** season by `year` and prints `highlights` as bullets.

### `news`
- `title` (string, required)
- `slug` (string, unique, required)
- `published_at` (datetime, required)
- `excerpt` (text, optional)
- `content` (text, required) — supports **Markdown**; rendered with `marked` and styled via Tailwind **typography** (`prose`).

Routes:
- `/news` — lists posts (newest first)
- `/news/[slug]` — post detail

> To use Markdown links/images, just write standard Markdown in `content`.

## shadcn/ui-style components

Included lightweight components inspired by shadcn/ui:
- `components/ui/button.tsx` (with `class-variance-authority`)
- `components/ui/input.tsx`, `components/ui/textarea.tsx`, `components/ui/label.tsx`
- `components/ui/card.tsx`
- `components/navbar.tsx` (adds a top nav)

These are zero-config and Tailwind-native. You can swap in full shadcn/ui CLI components later if you prefer.
