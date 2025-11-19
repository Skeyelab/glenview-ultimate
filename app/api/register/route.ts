import { isDirectusError } from "@directus/sdk";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { submitRegistration } from "@/lib/directus";
import { verifyTurnstileToken } from "@/lib/turnstile";

const MIN_HTTP_ERROR_STATUS = 400;
const MAX_HTTP_ERROR_STATUS = 599;

const childSchema = z.object({
  full_name: z.string().min(1),
  age: z.string().optional(),
  experience: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  availability: z.array(z.string()).optional(),
});

const registrationSchema = z.object({
  parent1_name: z.string().min(1),
  parent1_email: z.string().email(),
  parent1_phone: z.string().optional(),
  parent2_name: z.string().optional(),
  parent2_email: z.string().optional(),
  parent2_phone: z.string().optional(),
  children: z.array(childSchema).max(3).optional(),
  notes: z.string().optional(),
  marketing_opt_in: z.boolean().optional(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = (await req.json()) as unknown;
  const parsedBody = typeof rawBody === "object" && rawBody !== null ? (rawBody as Record<string, unknown>) : {};
  const { turnstile_token, ...registrationFields } = parsedBody;
  const token = typeof turnstile_token === "string" ? turnstile_token : "";

  const parseResult = registrationSchema.safeParse(registrationFields);
  if (!parseResult.success) {
    const errorMessage = parseResult.error.issues[0]?.message ?? "Invalid registration payload";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
  const payload = parseResult.data;

  if (!token) {
    return NextResponse.json({ error: "Please complete the verification challenge." }, { status: 400 });
  }

  if (!process.env.TURNSTILE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Verification is temporarily unavailable. Please try again later." },
      { status: 400 },
    );
  }

  const verified = await verifyTurnstileToken(token);
  if (!verified) {
    return NextResponse.json({ error: "Unable to verify your submission. Please refresh and try again." }, { status: 400 });
  }

  try {
    const data = await submitRegistration(payload);
    return NextResponse.json({ ok: true, data });
  } catch (error: unknown) {
    if (isDirectusError(error)) {
      const duplicate = error.errors.find(({ extensions }) => extensions.code === "RECORD_NOT_UNIQUE");
      const duplicateExtensions = duplicate?.extensions;
      if (duplicateExtensions) {
        const { field, value } = duplicateExtensions;
        const email = typeof value === "string" ? value : undefined;
        return NextResponse.json(
          {
            error: "This email address has already been registered. Please use a different email or contact us if you need to update your registration.",
            code: "DUPLICATE_EMAIL",
            field: typeof field === "string" ? field : undefined,
            email,
          },
          { status: 409 }
        );
      }

      const message = error.errors[0]?.message ?? "Directus request failed";
      const { status } = error.response;
      const responseStatus = typeof status === "number" && status >= MIN_HTTP_ERROR_STATUS && status <= MAX_HTTP_ERROR_STATUS ? status : 500;
      return NextResponse.json(
        { error: message },
        { status: responseStatus }
      );
    }

    return NextResponse.json(
      { error: "Unexpected error while submitting registration." },
      { status: 500 }
    );
  }
}
