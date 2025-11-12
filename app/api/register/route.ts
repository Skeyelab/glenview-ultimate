import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {DIRECTUS_URL} = process.env;
  const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

  if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
    return NextResponse.json({ error: "Server missing Directus credentials" }, { status: 500 });
  }

  const payload = await req.json();

  const res = await fetch(`${DIRECTUS_URL}/items/registrations`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${DIRECTUS_TOKEN}`
    },
    body: JSON.stringify(payload),
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
      const {field} = errorData.errors[0].extensions;
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
