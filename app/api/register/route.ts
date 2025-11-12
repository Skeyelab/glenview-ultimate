import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const DIRECTUS_URL = process.env.DIRECTUS_URL;
  const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

  if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
    return NextResponse.json({ error: "Server missing Directus credentials" }, { status: 500 });
  }

  const payload = await req.json();

  // Turnstile verification
  const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
  if (TURNSTILE_SECRET_KEY) {
    const turnstileToken = payload.turnstile_token;
    if (!turnstileToken) {
      return NextResponse.json({ error: "Verification token missing" }, { status: 400 });
    }

    const turnstileResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    });

    const turnstileResult = await turnstileResponse.json();
    if (!turnstileResult.success) {
      return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });
    }
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

    // Handle duplicate email error
    try {
      const errorData = JSON.parse(text);
      if (errorData.errors && Array.isArray(errorData.errors)) {
        const duplicateError = errorData.errors.find(
          (err: any) => err.extensions?.code === "RECORD_NOT_UNIQUE"
        );
        if (duplicateError) {
          return NextResponse.json(
            {
              code: "DUPLICATE_EMAIL",
              field: duplicateError.extensions.field,
            },
            { status: 409 }
          );
        }
      }
    } catch {
      // If parsing fails, fall through to generic error
    }

    return NextResponse.json({ error: `Directus error: ${res.status} ${res.statusText} - ${text}` }, { status: 500 });
  }

  const text = await res.text();
  const data = JSON.parse(text);
  return NextResponse.json({ ok: true, data });
}
