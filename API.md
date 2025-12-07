# API Documentation

This document describes the API routes available in the Glenview Ultimate website.

## Registration API

### `POST /api/register`

Submit a registration form with parent and child information.

#### Request Body

```typescript
{
  parent1_name: string;           // Required: First parent/guardian name
  parent1_email: string;           // Required: First parent/guardian email
  parent1_phone?: string;          // Optional: First parent/guardian phone
  parent2_name?: string;           // Optional: Second parent/guardian name
  parent2_email?: string;          // Optional: Second parent/guardian email
  parent2_phone?: string;          // Optional: Second parent/guardian phone
  children?: Array<{               // Optional: Up to 3 children
    full_name: string;             // Required: Child's full name
    age?: string;                  // Optional: Child's age
    experience?: "beginner" | "intermediate" | "advanced"; // Optional: Experience level
    availability?: string[];       // Optional: Available weekdays
  }>;                              // Max 3 children
  notes?: string;                  // Optional: Additional notes
  marketing_opt_in?: boolean;      // Optional: Marketing consent
}
```

#### Success Response

**Status:** `200 OK`

```json
{
  "ok": true,
  "data": {
    "id": 123,
    "parent1_name": "John Doe",
    "parent1_email": "john@example.com",
    "date_created": "2026-01-15T10:30:00.000Z",
    ...
  }
}
```

#### Error Responses

**Status:** `400 Bad Request` - Invalid payload

```json
{
  "error": "Invalid registration payload"
}
```

**Status:** `409 Conflict` - Duplicate email

```json
{
  "error": "This email address has already been registered. Please use a different email or contact us if you need to update your registration.",
  "code": "DUPLICATE_EMAIL",
  "field": "parent1_email",
  "email": "john@example.com"
}
```

**Status:** `500 Internal Server Error` - Server error

```json
{
  "error": "Unexpected error while submitting registration."
}
```

#### Validation Rules

- `parent1_name`: Required, minimum 1 character
- `parent1_email`: Required, must be valid email format
- `children`: Optional array, maximum 3 children
- Each child `full_name`: Required, minimum 1 character
- Each child `experience`: Optional, must be one of: "beginner", "intermediate", "advanced"

#### Example Request

```bash
curl -X POST https://glenview-ultimate.org/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "parent1_name": "John Doe",
    "parent1_email": "john@example.com",
    "parent1_phone": "555-1234",
    "children": [
      {
        "full_name": "Jane Doe",
        "age": "12",
        "experience": "beginner",
        "availability": ["Monday", "Wednesday"]
      }
    ]
  }'
```

## Assets API

### `GET /api/assets/:fileId`

Proxy route for Directus assets. This route handles authentication server-side and forwards requests to Directus.

#### URL Parameters

- `fileId` (string): Directus file UUID

#### Query Parameters

All Directus asset transformation parameters are supported:
- `width` (number): Image width
- `height` (number): Image height
- `quality` (number): Image quality (0-100)
- `fit` (string): Image fit mode (`cover`, `contain`, `inside`, `outside`, `fill`)
- `format` (string): Image format (`auto`, `jpg`, `png`, `webp`, `tiff`, `gif`, `avif`)
- `withoutEnlargement` (boolean): Prevent image enlargement

#### Success Response

**Status:** `200 OK`

Returns the image file with appropriate `Content-Type` header and caching headers.

**Headers:**
- `Content-Type`: Image MIME type (e.g., `image/jpeg`)
- `Cache-Control`: `public, max-age=31536000, immutable`

#### Error Responses

**Status:** `400 Bad Request` - Missing file ID

```json
{
  "error": "File ID is required"
}
```

**Status:** `500 Internal Server Error` - Directus not configured or fetch failed

```json
{
  "error": "Failed to fetch asset from Directus"
}
```

#### Example Request

```bash
curl https://glenview-ultimate.org/api/assets/c3db7679-c7b9-4d7d-add9-761a96e59b86?width=400&quality=80
```

## Cache Revalidation API

### `POST /api/revalidate`

Webhook endpoint for cache invalidation. Receives notifications from Directus when content is updated and immediately revalidates affected Next.js pages.

**Note:** This endpoint is intended for use by Directus webhooks only. It requires authentication via a secret token.

#### Request Headers

- `Content-Type`: `application/json` (required)
- `Authorization`: `Bearer <token>` - Secret token matching `REVALIDATE_SECRET` environment variable (required, unless provided via other methods)
- `X-Revalidate-Secret`: Secret token matching `REVALIDATE_SECRET` environment variable (alternative to Authorization header)

#### Request Body

```typescript
{
  event: string;                    // Required: Event type ("items.create", "items.update", "items.delete")
  collection: string;                // Required: Directus collection name
  payload?: {                       // Optional: Additional payload data
    key?: Array<{                   // Optional: Array of affected items
      id?: number;                  // Optional: Item ID
      slug?: string;                // Optional: Item slug (for News collection)
    }>;
  };
  secret?: string;                   // Optional: Secret token (alternative to header)
}
```

#### Success Response

**Status:** `200 OK`

```json
{
  "revalidated": true,
  "collection": "News",
  "paths": ["/news", "/news/test-article"]
}
```

#### Error Responses

**Status:** `400 Bad Request` - Missing required field or invalid payload

```json
{
  "error": "Missing required field: collection"
}
```

**Status:** `401 Unauthorized` - Invalid or missing secret token

```json
{
  "error": "Unauthorized"
}
```

#### Collection to Page Mapping

The endpoint automatically maps Directus collections to Next.js pages:

- `Website` → `/` (home page)
- `About` → `/about`
- `Team` → `/about`
- `WhatIsUltimate` → `/what-is-ultimate`
- `WhatIsUltimateVideos` → `/what-is-ultimate`, `/` (home page)
- `Schedule` → `/schedule`, `/` (home page)
- `Partners` → `/` (home page)
- `News` → `/news`, `/news/[slug]` (when slug is provided in payload)

#### Example Requests

Using Authorization Bearer token (recommended for Directus flows):

```bash
curl -X POST https://glenview-ultimate.org/api/revalidate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-token" \
  -d '{
    "event": "items.update",
    "collection": "News",
    "payload": {
      "key": [{"id": 1, "slug": "test-article"}]
    }
  }'
```

Using X-Revalidate-Secret header:

```bash
curl -X POST https://glenview-ultimate.org/api/revalidate \
  -H "Content-Type: application/json" \
  -H "X-Revalidate-Secret: your-secret-token" \
  -d '{
    "event": "items.update",
    "collection": "News",
    "payload": {
      "key": [{"id": 1, "slug": "test-article"}]
    }
  }'
```

#### Security

- The endpoint requires a secret token that matches the `REVALIDATE_SECRET` environment variable
- The token can be provided via:
  - `Authorization: Bearer <token>` header (recommended for Directus flows)
  - `X-Revalidate-Secret` header
  - `secret` field in the request body
- Requests without a valid secret token are rejected with a 401 Unauthorized response

## Implementation Details

### Registration Endpoint

- **Location**: `app/api/register/route.ts`
- **Validation**: Uses Zod schema validation
- **Storage**: Submits to Directus `Registrations` collection
- **Error Handling**: Handles Directus constraint violations (duplicate emails) with friendly error messages

### Assets Endpoint

- **Location**: `app/api/assets/[...path]/route.ts`
- **Purpose**: Proxies Directus asset requests to handle authentication server-side
- **Caching**: Long-term caching headers for performance
- **Security**: Access token is added server-side, never exposed to client

### Revalidation Endpoint

- **Location**: `app/api/revalidate/route.ts`
- **Purpose**: Receives webhook notifications from Directus and invalidates Next.js page cache
- **Security**: Requires secret token authentication via `REVALIDATE_SECRET` environment variable
- **Cache Strategy**: Uses `revalidatePath` from Next.js to invalidate specific pages
- **Integration**: Configured via Directus flow that triggers on content updates

