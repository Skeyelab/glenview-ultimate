import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const DIRECTUS_URL = process.env.DIRECTUS_URL;
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
    return NextResponse.json({ error: `Directus error: ${res.status} ${res.statusText} - ${text}` }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json({ ok: true, data });
}
