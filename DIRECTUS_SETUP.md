# Directus Setup Guide

This guide explains how to set up and configure Directus for the Glenview Ultimate website.

## Prerequisites

- A Directus instance (self-hosted or cloud)
- Admin access to Directus
- Static token with appropriate permissions

## Environment Variables

Configure the following environment variables in your `.env.local`:

```ini
DIRECTUS_URL=https://your-directus.example.com
DIRECTUS_STATIC_TOKEN=your_static_token_here
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus.example.com
NEXT_PUBLIC_SITE_NAME=Glenview Ultimate
```

## Required Collections

The following collections must be created in Directus:

### Team

Team members with roles, bios, and photos.

**Fields:**
- `id` (integer, primary key, auto-increment)
- `name` (string, required)
- `role` (string, required) - e.g., "Head Coach", "Boys Team Captain"
- `email` (string, nullable)
- `bio` (text, nullable)
- `photo` (file, nullable) - Directus file field
- `squad` (string, nullable) - e.g., "Boys", "Girls"

### Partners

Sponsors and partners with logos.

**Fields:**
- `id` (integer, primary key, auto-increment)
- `name` (string, required)
- `url` (string, required)
- `logo` (file, nullable) - Directus file field

### Schedule

Season events, practices, and tournaments.

**Fields:**
- `id` (integer, primary key, auto-increment)
- `season_year` (integer, required) - e.g., 2026
- `event_type` (string, required) - One of: `season_start`, `season_end`, `registration_open`, `registration_close`, `game`, `practice`, `tournament`, `other`
- `title` (string, required)
- `date` (timestamp, required)
- `end_date` (timestamp, nullable)
- `location` (string, nullable)
- `description` (text, nullable)
- `highlight` (boolean, nullable) - Whether to show in highlights section

### News

Blog posts with Markdown content.

**Fields:**
- `id` (integer, primary key, auto-increment)
- `slug` (string, required, unique) - URL-friendly identifier
- `title` (string, required)
- `published_at` (timestamp, required)
- `excerpt` (text, nullable)
- `content` (text, required) - Markdown or HTML content

### About

Club description and educational content.

**Fields:**
- `id` (integer, primary key, auto-increment)
- `club_description` (text, nullable)
- `what_kids_learn` (json, nullable) - Array of strings

### WhatIsUltimate

Educational content about ultimate frisbee.

**Fields:**
- `id` (integer, primary key, auto-increment)
- `Description` (text, nullable)

### WhatIsUltimateVideos

YouTube videos for educational content.

**Fields:**
- `id` (integer, primary key, auto-increment)
- `title` (string, required)
- `description` (text, nullable)
- `youtube_embed_id` (string, nullable) - YouTube video ID
- `video_url` (string, nullable) - Alternative video URL
- `sort` (integer, nullable) - Sort order
- `active` (boolean, nullable) - Whether video is active

### Website

Site-wide configuration.

**Fields:**
- `id` (integer, primary key, auto-increment)
- `site_name` (string, required)
- `hero_title` (string, required)
- `hero_subtitle` (text, nullable)
- `hero_tagline` (text, nullable)
- `hero_message_primary` (text, nullable)
- `hero_message_secondary` (text, nullable)
- `hero_cta_label` (string, nullable) - Call-to-action button label
- `hero_cta_url` (string, nullable) - Call-to-action button URL
- `hero_pre_registration_text` (text, nullable)

### Registrations

Registration form submissions.

**Fields:**
- `id` (integer, primary key, auto-increment)
- `parent1_name` (string, required)
- `parent1_email` (string, required, unique) - Unique constraint to prevent duplicates
- `parent1_phone` (string, nullable)
- `parent2_name` (string, nullable)
- `parent2_email` (string, nullable)
- `parent2_phone` (string, nullable)
- `children` (json, nullable) - Array of child objects
- `notes` (text, nullable)
- `marketing_opt_in` (boolean, nullable)
- `date_created` (timestamp, auto-generated)

**Child Object Structure:**
```json
{
  "full_name": "string",
  "age": "string",
  "experience": "beginner" | "intermediate" | "advanced",
  "availability": ["string"]
}
```

## Permissions

The static token should have read access to:
- Team
- Partners
- Schedule
- News
- About
- WhatIsUltimate
- WhatIsUltimateVideos
- Website

And create access to:
- Registrations

## Schema Backup

The project includes a schema backup script:

```bash
yarn backup:schema
```

This creates backups of your Directus schema in:
- `directus-schema.json` - Full schema
- `directus-collections.json` - Collections only
- `directus-roles.json` - Roles only

## Visual Editing

To enable Directus Visual Editing:

1. Ensure `NEXT_PUBLIC_DIRECTUS_URL` is set
2. Add `?visual-editing=true` to any page URL
3. Editable fields are marked with `data-directus` attributes

Visual editing works with:
- Hero section content (Website collection)
- Partners section (Partners collection)
- Leadership section (Team collection)

## Fallback Data

The application includes fallback data when Directus is not configured:

- Default schedule events in `lib/directus.ts`
- Default partners in `components/home/partners-section.tsx`
- Default club description in `lib/constants.ts`

This allows the site to function even when Directus is unavailable.

## Troubleshooting

### "DIRECTUS_URL not configured"

Ensure `DIRECTUS_URL` and `DIRECTUS_STATIC_TOKEN` are set in your `.env.local` file.

### "Failed to fetch asset from Directus"

- Verify the static token has read permissions for files
- Check that the file UUID is correct
- Ensure Directus asset endpoint is accessible

### Duplicate email errors

The `Registrations` collection has a unique constraint on `parent1_email`. If you need to allow updates, consider:
- Adding an update endpoint
- Using a different unique constraint strategy
- Allowing duplicate emails with a different field structure

