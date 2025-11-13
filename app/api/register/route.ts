import { type NextRequest, NextResponse } from "next/server";
import { createDirectus, rest, staticToken, createItem } from '@directus/sdk';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const {DIRECTUS_URL} = process.env;
  const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN;

  if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
    return NextResponse.json({ error: "Server missing Directus credentials" }, { status: 500 });
  }

  const payload = await req.json();

  try {
    const client = createDirectus(DIRECTUS_URL)
      .with(rest())
      .with(staticToken(DIRECTUS_TOKEN));

    const data = await client.request(createItem('registrations', payload));
    return NextResponse.json({ ok: true, data });
  } catch (error: unknown) {
    // Handle Directus SDK errors
    // The SDK throws errors with a structure that may include extensions
    if (error && typeof error === 'object') {
      // Check for Directus error structure with extensions
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Error object structure from Directus SDK
      const errorObj = error as Record<string, unknown>;

      // Handle errors array format (common in Directus responses)
      if ('errors' in errorObj && Array.isArray(errorObj.errors) && errorObj.errors.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Error structure from Directus SDK
        const firstError = errorObj.errors[0] as Record<string, unknown>;
        if (firstError.extensions && typeof firstError.extensions === 'object') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Error extensions structure from Directus SDK
          const extensions = firstError.extensions as Record<string, unknown>;

          // Handle duplicate email error (RECORD_NOT_UNIQUE)
          if (extensions.code === "RECORD_NOT_UNIQUE") {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Field name from Directus error
            const field = extensions.field as string;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Email value from Directus error
            const email = extensions.value as string;
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
        }

        // Other Directus errors
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Error message from Directus SDK
        const message = firstError.message as string || 'Directus error';
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Status code from Directus SDK
        const status = (firstError.status as number) || 500;
        return NextResponse.json(
          { error: message },
          { status: status >= 400 && status < 500 ? status : 500 }
        );
      }

      // Handle direct extensions on error object
      if ('extensions' in errorObj && typeof errorObj.extensions === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Error extensions structure from Directus SDK
        const extensions = errorObj.extensions as Record<string, unknown>;
        if (extensions.code === "RECORD_NOT_UNIQUE") {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Field name from Directus error
          const field = extensions.field as string;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Email value from Directus error
          const email = extensions.value as string;
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
      }

      // Handle status code directly on error
      if ('status' in errorObj) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Status code from Directus SDK
        const status = errorObj.status as number;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Error message from Directus SDK
        const message = (errorObj.message as string) || 'Directus error';
        return NextResponse.json(
          { error: message },
          { status: status >= 400 && status < 500 ? status : 500 }
        );
      }
    }

    // Fallback for unknown error types
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
