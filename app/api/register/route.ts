import { isDirectusError } from "@directus/sdk";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { submitRegistration } from "@/lib/directus";
import {
  HONEYPOT_FIELD,
  SUSPECTED_SPAM_STATUS,
  clientIp,
  detectBot,
  registerRateLimiter,
} from "@/lib/register-guard";

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
  [HONEYPOT_FIELD]: z.string().optional(),
  form_elapsed_ms: z.number().optional(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = clientIp(req.headers.get("x-forwarded-for"));
  if (ip && !registerRateLimiter.allow(ip)) {
    return NextResponse.json(
      { error: "Too many registrations from your network. Please try again in an hour." },
      { status: 429 }
    );
  }

  const parseResult = registrationSchema.safeParse(await req.json());
  if (!parseResult.success) {
    const errorMessage = parseResult.error.issues[0]?.message ?? "Invalid registration payload";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
  const { [HONEYPOT_FIELD]: honeypot, form_elapsed_ms: elapsedMs, ...registration } = parseResult.data;

  // A suspected bot still gets saved, flagged for review, and gets the same
  // success response, so a misjudged parent is never lost and a bot learns nothing.
  const botReason = detectBot({ honeypot, elapsedMs });
  const payload = botReason ? { ...registration, status: SUSPECTED_SPAM_STATUS } : registration;

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
