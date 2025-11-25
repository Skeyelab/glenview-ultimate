# Admin User Guide

This guide is for administrators managing the Glenview Ultimate website content and email communications.

## Accessing the Admin Portal

1. Navigate to **https://login.glenview-ultimate.org** in your web browser
2. Log in with your admin credentials
3. After logging in, you'll have access to:
   - **Directus Admin** - Content management system for the website
   - **Listmonk Admin** - Email marketing and newsletter management

---

## Directus Admin

Directus is the content management system (CMS) that powers the Glenview Ultimate website. Use it to manage all website content including news posts, schedules, team information, and more.

### Accessing Directus

From the admin portal at **login.glenview-ultimate.org**, click on **Directus Admin** to open the Directus interface.

### Main Collections

#### Team
Manage team members, coaches, and leadership.

**Common Tasks:**
- Add new team members with photos, roles, and bios
- Update existing team member information
- Set squad assignments (Boys, Girls, etc.)

**Fields:**
- Name (required)
- Role (required) - e.g., "Head Coach", "Boys Team Captain"
- Email (optional)
- Bio (optional)
- Photo (optional) - Upload team member photos
- Squad (optional) - e.g., "Boys", "Girls"

#### Partners
Manage sponsor and partner logos displayed on the homepage.

**Common Tasks:**
- Add new partners/sponsors
- Update partner logos
- Set partner website URLs

**Fields:**
- Name (required)
- URL (required) - Partner website link
- Logo (optional) - Upload partner logo image

#### Schedule
Manage season events, practices, games, and tournaments.

**Common Tasks:**
- Add new events (games, practices, tournaments)
- Set season dates (season start/end, registration open/close)
- Mark events as highlights for homepage display
- Update event locations and descriptions

**Fields:**
- Season Year (required) - e.g., 2026
- Event Type (required) - One of:
  - `season_start` - Season start date
  - `season_end` - Season end date
  - `registration_open` - Registration opens
  - `registration_close` - Registration closes
  - `game` - Game/match
  - `practice` - Practice session
  - `tournament` - Tournament
  - `other` - Other events
- Title (required)
- Date (required)
- End Date (optional) - For multi-day events
- Location (optional)
- Description (optional)
- Highlight (optional) - Check to show on homepage highlights

#### News
Create and manage blog posts and news articles.

**Common Tasks:**
- Create new news posts
- Edit existing posts
- Set publication dates
- Write content in Markdown format

**Fields:**
- Slug (required, unique) - URL-friendly identifier (e.g., "2026-season-kickoff")
- Title (required)
- Published At (required) - Publication date
- Excerpt (optional) - Short summary for listings
- Content (required) - Full article content (Markdown or HTML)

**Tips:**
- Use descriptive slugs that reflect the content
- Set future dates to schedule posts
- Use Markdown for formatting (headers, lists, links, etc.)

#### About
Manage club description and educational content about what kids learn.

**Common Tasks:**
- Update club description
- Edit "What Kids Learn" section items

**Fields:**
- Club Description (optional) - Main description text
- What Kids Learn (optional) - JSON array of learning points

#### WhatIsUltimate
Manage educational content about ultimate frisbee.

**Common Tasks:**
- Update description content
- Manage educational videos

**Fields:**
- Description (optional) - Educational content text

#### WhatIsUltimateVideos
Manage YouTube videos for the educational section.

**Common Tasks:**
- Add new educational videos
- Reorder videos using sort field
- Activate/deactivate videos

**Fields:**
- Title (required)
- Description (optional)
- YouTube Embed ID (optional) - YouTube video ID
- Video URL (optional) - Alternative video URL
- Sort (optional) - Sort order number
- Active (optional) - Checkbox to show/hide video

#### Website
Manage site-wide configuration and homepage hero content.

**Common Tasks:**
- Update homepage hero section (title, subtitle, tagline)
- Change call-to-action button text and link
- Update footer text
- Set pre-registration messaging

**Fields:**
- Site Name (required)
- Footer Text (optional)
- Hero Title (required)
- Hero Subtitle (optional)
- Hero Tagline (optional)
- Hero Message Primary (optional)
- Hero Message Secondary (optional)
- Hero CTA Label (optional) - Button text
- Hero CTA URL (optional) - Button link
- Hero Pre Registration Text (optional)

#### Registrations
View registration form submissions from the website.

**Automatic Listmonk Integration:**
- When a registration form is completed with `marketing_opt_in` set to `true`, a new subscriber is **automatically created in Listmonk**
- The subscriber is added using the Parent 1 email address
- You can find these subscribers in Listmonk under the **Subscribers** section

**Common Tasks:**
- View submitted registrations
- Export registration data
- Check for duplicate submissions
- Verify subscribers were created in Listmonk (if marketing opt-in was selected)

**Fields:**
- Parent 1 Name (required)
- Parent 1 Email (required, unique)
- Parent 1 Phone (optional)
- Parent 2 Name (optional)
- Parent 2 Email (optional)
- Parent 2 Phone (optional)
- Children (optional) - JSON array of child information
- Notes (optional)
- Marketing Opt In (optional) - When `true`, automatically creates Listmonk subscriber
- Date Created (auto-generated)

### Visual Editing

Directus supports visual editing directly on the website:

1. Navigate to any page on **glenview-ultimate.org**
2. Add `?visual-editing=true` to the URL
3. Editable fields will be highlighted
4. Click on editable content to edit directly in Directus

**Visual editing works on:**
- Homepage hero section
- Partners section
- Leadership section

### Tips for Using Directus

- **Save frequently** - Changes are saved immediately, but it's good practice to verify
- **Use preview** - Preview content before publishing when possible
- **Check required fields** - Required fields are marked with an asterisk (*)
- **Image uploads** - Upload images directly in Directus; they'll be automatically optimized
- **Date formats** - Use the date picker for consistent date formatting
- **Markdown support** - News content supports Markdown formatting

---

## Listmonk Admin

Listmonk is the email marketing platform used for sending newsletters, announcements, and communications to parents and participants.

### Accessing Listmonk

From the admin portal at **login.glenview-ultimate.org**, click on **Listmonk Admin** to open the Listmonk interface.

### Main Features

#### Subscribers
Manage your email subscriber list.

**Automatic Subscriber Creation:**
- When someone completes the registration form on the website and opts in for marketing communications, they are **automatically added as a subscriber** in Listmonk
- No manual action is required - the integration handles this automatically
- Subscribers are created using the parent email address from the registration form

**Common Tasks:**
- View all subscribers (including those added automatically from registrations)
- Add subscribers manually
- Import subscribers from CSV
- Export subscriber list
- Update subscriber information
- Remove unsubscribed users

#### Lists
Organize subscribers into different lists (e.g., "Parents", "Players", "Newsletter").

**Common Tasks:**
- Create new lists for different audiences
- Assign subscribers to lists
- Use lists to segment your audience

#### Campaigns
Create and send email campaigns.

**Common Tasks:**
- Create new email campaigns
- Design email templates
- Schedule campaigns
- Send test emails
- Track campaign performance

**Campaign Types:**
- **Regular Campaign** - One-time email blast
- **Automated Campaign** - Triggered emails (e.g., welcome emails)
- **Template Campaign** - Reusable email templates

#### Templates
Create reusable email templates.

**Common Tasks:**
- Design email templates
- Use templates for consistent branding
- Save templates for future campaigns

#### Media
Manage images and files for email campaigns.

**Common Tasks:**
- Upload images for emails
- Organize media files
- Get image URLs for use in templates

### Creating an Email Campaign

1. Navigate to **Campaigns** → **New Campaign**
2. Choose campaign type (Regular, Automated, or Template)
3. Select target list(s)
4. Design your email:
   - Use the visual editor or HTML editor
   - Add images from the Media library
   - Include personalization tags (e.g., `{{.Subscriber.Name}}`)
5. Set subject line and preview text
6. Send a test email to yourself
7. Schedule or send immediately

### Best Practices

- **Segment your audience** - Use lists to send relevant content to the right people
- **Test before sending** - Always send test emails to check formatting
- **Personalize content** - Use subscriber data to personalize emails
- **Monitor performance** - Track open rates and click-through rates
- **Respect unsubscribes** - Honor unsubscribe requests promptly
- **Keep content concise** - Email readers prefer shorter, scannable content
- **Mobile-friendly** - Ensure emails look good on mobile devices

### Common Workflows

#### Sending a Season Newsletter

1. Create a new campaign in Listmonk
2. Select the appropriate subscriber list
3. Design the newsletter with:
   - Season updates
   - Upcoming events
   - Important dates
   - Links to the website
4. Send test email
5. Schedule or send to all subscribers

#### Adding New Subscribers

**Automatic from Registration Form:**
- When someone completes the registration form on **glenview-ultimate.org** and checks the marketing opt-in box, they are **automatically added as a subscriber** in Listmonk
- The subscriber is created using the Parent 1 email address and name
- This happens automatically - no manual action needed
- You can verify new subscribers in Listmonk under **Subscribers** after a registration is submitted

**Manually:**
1. Go to **Subscribers** → **Add Subscriber**
2. Enter email address and name
3. Assign to appropriate list(s)
4. Add any additional metadata

**Bulk Import:**
1. Go to **Subscribers** → **Import**
2. Upload CSV file with columns: email, name, lists
3. Map columns and import

---

## Common Admin Tasks

### Understanding Registration → Listmonk Integration

When someone registers on the website:

1. Registration form is submitted to **glenview-ultimate.org/api/register**
2. Registration data is saved to Directus **Registrations** collection
3. **If marketing opt-in is checked**, a new subscriber is automatically created in Listmonk
4. The subscriber uses the Parent 1 email address and name
5. You can view the subscriber in Listmonk under **Subscribers**

**Note:** Only registrations with `marketing_opt_in: true` create Listmonk subscribers. If someone doesn't opt in, they won't be added to Listmonk.

### Updating Homepage Content

1. Log in to **login.glenview-ultimate.org**
2. Open **Directus Admin**
3. Navigate to **Website** collection
4. Edit the record to update hero section, footer, etc.
5. Changes appear immediately on the website

### Publishing a News Post

1. Log in to **login.glenview-ultimate.org**
2. Open **Directus Admin**
3. Navigate to **News** collection
4. Click **Create Item**
5. Fill in:
   - Slug (e.g., "2026-season-update")
   - Title
   - Published At date
   - Excerpt (optional)
   - Content (Markdown format)
6. Save
7. Post appears on the website automatically

### Adding a New Event to Schedule

1. Log in to **login.glenview-ultimate.org**
2. Open **Directus Admin**
3. Navigate to **Schedule** collection
4. Click **Create Item**
5. Fill in:
   - Season Year
   - Event Type (game, practice, tournament, etc.)
   - Title
   - Date (and End Date if multi-day)
   - Location (optional)
   - Description (optional)
   - Check "Highlight" if it should appear on homepage
6. Save
7. Event appears on schedule page automatically

### Sending an Email Announcement

1. Log in to **login.glenview-ultimate.org**
2. Open **Listmonk Admin**
3. Navigate to **Campaigns** → **New Campaign**
4. Select target list
5. Design email content
6. Send test email
7. Schedule or send immediately

---

## Troubleshooting

### Can't Access Admin Portal

- Verify you're using the correct URL: **https://login.glenview-ultimate.org**
- Check your internet connection
- Clear browser cache and cookies
- Contact your system administrator if issues persist

### Changes Not Appearing on Website

- **Directus**: Changes should appear immediately. If not:
  - Check that you saved the record
  - Verify you're editing the correct record
  - Clear your browser cache
  - Check if there's a caching layer (may take a few minutes)

- **Listmonk**: Email campaigns are sent immediately or at scheduled time. Check campaign status in Listmonk.

### Image Upload Issues

- Ensure image file size is reasonable (< 10MB recommended)
- Use common image formats (JPG, PNG, WebP)
- Check your internet connection
- Try uploading a smaller image first

### Email Campaign Not Sending

- Verify subscriber list has members
- Check campaign status in Listmonk
- Ensure email content is valid
- Check for any error messages in Listmonk

---

## Support

If you encounter issues or need assistance:

1. Check this guide first
2. Review the Directus setup guide: [DIRECTUS_SETUP.md](./DIRECTUS_SETUP.md)
3. Contact your system administrator

---

## Quick Reference

### Directus Collections
- **Team** - Team members and leadership
- **Partners** - Sponsors and partners
- **Schedule** - Events and calendar
- **News** - Blog posts and articles
- **About** - Club information
- **WhatIsUltimate** - Educational content
- **WhatIsUltimateVideos** - Video content
- **Website** - Site configuration
- **Registrations** - Form submissions

### Listmonk Features
- **Subscribers** - Email list management
- **Lists** - Audience segmentation
- **Campaigns** - Email sending
- **Templates** - Reusable designs
- **Media** - Image management

### Important URLs
- **Admin Portal**: https://login.glenview-ultimate.org
- **Website**: https://glenview-ultimate.org
- **Visual Editing**: Add `?visual-editing=true` to any page URL
