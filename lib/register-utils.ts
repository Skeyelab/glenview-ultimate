import type { Parent, Child } from "./register-types";

export function buildRegistrationPayload(
  parents: Parent[],
  children: Child[],
  notes: string,
  marketing_opt_in: boolean,
  turnstileToken?: string | null,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    children,
    notes,
    marketing_opt_in,
  };

  // Always include parent1 fields (at least one parent required)
  if (parents[0]) {
    payload.parent1_name = parents[0].name;
    payload.parent1_email = parents[0].email;
    payload.parent1_phone = parents[0].phone;
  }

  // Include parent2 fields if second parent exists
  if (parents[1]) {
    payload.parent2_name = parents[1].name;
    payload.parent2_email = parents[1].email;
    payload.parent2_phone = parents[1].phone;
  }

  if (typeof turnstileToken === "string" && turnstileToken.length > 0) {
    payload.turnstile_token = turnstileToken;
  }

  return payload;
}

export function parseApiError(body: unknown): { error: string; field?: string } {
  if (typeof body === "object" && body !== null) {
    // Handle duplicate email error
    if (
      "code" in body &&
      body.code === "DUPLICATE_EMAIL" &&
      "field" in body &&
      typeof body.field === "string"
    ) {
      return {
        error:
          "This email address has already been registered. Please use a different email or contact us if you need to update your registration.",
        field: body.field,
      };
    }

    // Handle general error
    if ("error" in body && typeof body.error === "string") {
      return { error: body.error };
    }
  }

  return { error: "Failed" };
}

