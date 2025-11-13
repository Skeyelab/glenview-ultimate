import { createItem, isDirectusError } from "@directus/sdk";
import { type NextRequest, NextResponse } from "next/server";

import { getDirectusRestClient } from "@/lib/directus";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const payload = await req.json();

  let client;
  try {
    client = getDirectusRestClient();
  } catch {
    return NextResponse.json({ error: "Server missing Directus credentials" }, { status: 500 });
  }

  try {
    const data = await client.request(
      createItem('Registrations', payload)
    );
    return NextResponse.json({ ok: true, data });
  } catch (error: unknown) {
    if (isDirectusError(error)) {
      const duplicate = error.errors.find(err => err.extensions?.code === "RECORD_NOT_UNIQUE");
      if (duplicate) {
        const field = typeof duplicate.extensions.field === 'string' ? duplicate.extensions.field : undefined;
        const email = duplicate.extensions.value;
        return NextResponse.json(
          {
            error: "This email address has already been registered. Please use a different email or contact us if you need to update your registration.",
            code: "DUPLICATE_EMAIL",
            field,
            email
          },
          { status: 409 }
        );
      }

      const message = duplicate?.message ?? error.errors[0]?.message ?? "Directus request failed";
      const status = Number(error.response?.status) || 500;
      return NextResponse.json(
        { error: message },
        { status: status >= 400 && status < 600 ? status : 500 }
      );
    }

    return NextResponse.json(
      { error: "Unexpected error while submitting registration." },
      { status: 500 }
    );
  }
}
