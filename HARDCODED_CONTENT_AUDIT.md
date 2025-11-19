# Hardcoded Content Audit

This document lists all pages and components that are still using hardcoded content instead of fetching from Directus CMS.

## Pages with Hardcoded Content

### 1. Home Page (`app/page.tsx`)

**Status:** ⚠️ Partially hardcoded

**Hardcoded Content:**
- Hero section content is hardcoded in `lib/constants.ts`:
  - `HERO_TITLE` - "The Fun Starts - Spring 2026"
  - `HERO_SUBTITLE` - "Introducing Glenview's very first Youth Ultimate Frisbee Club"
  - `HERO_TAGLINE` - "5th-8th Grade. Boys & Girls."
  - `HERO_MESSAGE_1` - "Everyone is Welcome. Everyone Plays."
  - `HERO_MESSAGE_2` - "Come play with us. Join our team."
  - `HERO_CTA_LABEL` - "Register"
  - `HERO_CTA_URL` - "/register"
  - `HERO_PRE_REGISTRATION_TEXT` - "Pre-Registration is now open"

**Location:** `components/home/hero-section.tsx` (lines 10-18, 29, 94, 111, 117, 129, 145)

**Note:** The component already has visual editing setup for a "Website" collection with item "home", suggesting this content should be fetched from Directus. However, there's no `getWebsite()` or `getHomePage()` function in `lib/directus.ts`.

**Recommendation:**
- Create a `getWebsite()` function in `lib/directus.ts` to fetch home page content
- Update `HeroSection` to accept and use CMS data with fallback to constants
- Add `Website` collection to Directus schema if not already present

---

### 2. Register Page (`app/register/page.tsx`)

**Status:** ⚠️ Hardcoded

**Hardcoded Content:**
- Page title: "Registration" (line 17)
- Page description: "Tell us about your family. You can add up to three kids." (line 18)
- Form labels and text in `components/register/registration-form.tsx`:
  - "Parents / Guardians" heading (line 25)
  - "+ Add second parent / guardian" button text (line 28)
  - "Kids" heading (line 23)
  - "+ Add a child" button text (line 26)
  - "Notes (optional)" label (line 148)
  - "I agree to receive updates about the club." checkbox label (line 167)
  - "Submit Registration" button text (line 173)
  - Success/error messages (lines 84, 112, 122)

**Recommendation:**
- Create a `getRegistrationPage()` function in `lib/directus.ts`
- Move hardcoded strings to CMS or at minimum to constants with CMS override capability
- Consider making form labels and help text configurable

---

### 3. What Is Ultimate Page (`app/what-is-ultimate/page.tsx`)

**Status:** ⚠️ Hardcoded

**Hardcoded Content:**
- Description paragraphs from `lib/constants.ts`:
  - `DESCRIPTION_PARAGRAPHS` array (lines 12-15 in constants.ts)
- Video items hardcoded in page component:
  - `VIDEOS` array with 4 video items (lines 7-24):
    - "Introduction to Ultimate"
    - "Rules of the Game"
    - "Basic Throwing Techniques"
    - "Spirit of the Game"
- Video grid description: "Check out these videos to learn more about Ultimate Frisbee:" (line 33)
- Notice text about video content (lines 36-40)
- Page header title defaults to "What is Ultimate?" (in `components/what-is-ultimate/what-is-ultimate-header.tsx`)

**Recommendation:**
- Create a `getWhatIsUltimate()` function in `lib/directus.ts`
- Move description paragraphs to CMS
- Move video items to CMS (with support for YouTube embed IDs or URLs)
- Make page title and description configurable

---

## Pages Already Using CMS (✅)

### ✅ News Pages
- `app/news/page.tsx` - Fetches from `getNewsList()`
- `app/news/[slug]/page.tsx` - Fetches from `getNewsBySlug()`

### ✅ Schedule Page
- `app/schedule/page.tsx` - Fetches from `getSchedule()` with fallback to defaults

### ✅ About Page
- `app/about/page.tsx` - Fetches from `getAbout()` and `getTeam()` with fallback to constants

### ✅ Home Page (Partial)
- Fetches partners, team, and schedule from CMS
- Only hero section content is hardcoded

---

## Additional Components with Hardcoded Content

### Navigation Links (`components/navbar/nav-links.ts`)
- Navigation menu items are hardcoded
- **Note:** This is likely acceptable as navigation structure, but could be made configurable if needed

### Footer (`components/footer.tsx`)
- Copyright text is hardcoded: "© {year} Glenview Ultimate"
- **Note:** This is likely acceptable, but could be made configurable

---

## Summary

**Total Pages Audited:** 7
- **Pages with hardcoded content:** 3 (Home hero section, Register, What Is Ultimate)
- **Pages using CMS:** 4 (News, Schedule, About, Home partial)

**Additional Components:**
- Navigation links (probably acceptable)
- Footer copyright (probably acceptable)

**Priority Recommendations:**
1. **High Priority:** Home page hero section (most visible content)
2. **Medium Priority:** What Is Ultimate page (informational content)
3. **Low Priority:** Register page (form labels, but functional as-is)

---

## Next Steps

For each page listed above, create individual issues to:
1. Add corresponding Directus collection/function
2. Update page component to fetch from CMS
3. Maintain fallback to constants for backwards compatibility
4. Test visual editing integration where applicable