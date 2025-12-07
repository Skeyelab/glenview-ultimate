import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

interface WebhookPayload {
  event?: string;
  collection?: string;
  payload?: {
    key?: Array<{ id?: number; slug?: string }>;
  };
  secret?: string;
}

// Map Directus collections to Next.js page paths
const COLLECTION_TO_PATHS: Record<string, string[]> = {
  Website: ["/"],
  About: ["/about"],
  Team: ["/about"],
  WhatIsUltimate: ["/what-is-ultimate"],
  WhatIsUltimateVideos: ["/what-is-ultimate", "/"],
  Schedule: ["/schedule", "/"],
  Partners: ["/"],
  News: ["/news"],
};

function getPathsForCollection(collection: string, payload?: WebhookPayload["payload"]): string[] {
  const basePaths = COLLECTION_TO_PATHS[collection] || [];

  // For News collection, also revalidate specific article pages if slug is available
  if (collection === "News" && payload?.key) {
    const slugs = payload.key
      .map((item) => item.slug)
      .filter((slug): slug is string => Boolean(slug));

    const articlePaths = slugs.map((slug) => `/news/${slug}`);
    return [...basePaths, ...articlePaths];
  }

  return basePaths;
}

function verifySecret(request: NextRequest, body: WebhookPayload): boolean {
  const envSecret = process.env.REVALIDATE_SECRET;

  if (!envSecret) {
    return false;
  }

  // Check Authorization Bearer token
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    if (token === envSecret) {
      return true;
    }
  }

  // Check X-Revalidate-Secret header
  const headerSecret = request.headers.get("X-Revalidate-Secret");
  if (headerSecret && headerSecret === envSecret) {
    return true;
  }

  // Check secret in body
  if (body.secret && body.secret === envSecret) {
    return true;
  }

  return false;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse body as text first to handle invalid JSON with undefined values
    const bodyText = await req.text();
    
    // Replace undefined with null to make valid JSON
    // Also handle cases where undefined appears without quotes
    const cleanedBody = bodyText.replace(/:\s*undefined/g, ": null").replace(/,\s*undefined/g, ", null");
    
    let body: WebhookPayload;
    try {
      body = JSON.parse(cleanedBody) as WebhookPayload;
    } catch (parseError) {
      // eslint-disable-next-line no-console
      console.error("[API /revalidate] JSON parse error:", parseError, "Body:", bodyText);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Verify secret token
    if (!verifySecret(req, body)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate required fields
    if (!body.collection) {
      return NextResponse.json(
        { error: "Missing required field: collection" },
        { status: 400 }
      );
    }

    // Clean up payload - remove key if it's null or undefined
    if (body.payload && (body.payload.key === null || body.payload.key === undefined)) {
      delete body.payload.key;
    }

    // Get paths to revalidate based on collection
    const paths = getPathsForCollection(body.collection, body.payload);

    // Revalidate each path
    for (const path of paths) {
      revalidatePath(path);
    }

    return NextResponse.json({
      revalidated: true,
      collection: body.collection,
      paths,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[API /revalidate] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

