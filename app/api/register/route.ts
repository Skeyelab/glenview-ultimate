import { NextRequest, NextResponse } from "next/server";

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.warn("TURNSTILE_SECRET_KEY not set, skipping verification");
    return true; // Allow in development if key not set
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: secretKey, response: token }),
    });
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  const DIRECTUS_URL = process.env.DIRECTUS_URL;
  const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

  if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
    return NextResponse.json({ error: "Server missing Directus credentials" }, { status: 500 });
  }

  const payload = await req.json();

  // Verify Turnstile token
  const turnstileToken = payload.turnstile_token;
  if (!turnstileToken) {
    return NextResponse.json({ error: "Verification token missing" }, { status: 400 });
  }

  const isValid = await verifyTurnstileToken(turnstileToken);
  if (!isValid) {
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });
  }

  // Remove turnstile_token from payload before sending to Directus
  const { turnstile_token, ...directusPayload } = payload;

  const res = await fetch(`${DIRECTUS_URL}/items/registrations`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${DIRECTUS_TOKEN}`
    },
    body: JSON.stringify(directusPayload),
  });

  if (!res.ok) {
    const text = await res.text();
    let errorData;
    try {
      errorData = JSON.parse(text);
    } catch {
      errorData = null;
    }

    // Handle duplicate email error (400 Bad Request with RECORD_NOT_UNIQUE)
    if (res.status === 400 && errorData?.errors?.[0]?.extensions?.code === "RECORD_NOT_UNIQUE") {
      const field = errorData.errors[0].extensions.field;
      const email = errorData.errors[0].extensions.value;
      return NextResponse.json(
        {
          error: "This email address has already been registered. Please use a different email or contact us if you need to update your registration.",
          code: "DUPLICATE_EMAIL",
          field,
          email
        },
        { status: 409 } // Conflict
      );
    }

    // Other errors
    return NextResponse.json(
      { error: errorData?.errors?.[0]?.message || `Directus error: ${res.status} ${res.statusText}` },
      { status: res.status >= 400 && res.status < 500 ? res.status : 500 }
    );
  }

  // Handle empty response (Directus may return empty body on success)
  const text = await res.text();
  const data = text.trim() ? JSON.parse(text) : null;
  return NextResponse.json({ ok: true, data });
}
