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

