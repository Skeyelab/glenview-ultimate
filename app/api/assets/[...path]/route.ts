import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  try {
    const { path } = await params;
    const fileId = path[0];

    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 });
    }

    const directusUrl = process.env.DIRECTUS_URL;
    if (!directusUrl) {
      return NextResponse.json({ error: "Directus not configured" }, { status: 500 });
    }

    // Construct the Directus asset URL with access token
    const token = process.env.DIRECTUS_STATIC_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Directus token not configured" }, { status: 500 });
    }

    const forwardParams = new URLSearchParams(req.nextUrl.searchParams);
    forwardParams.set("access_token", token);
    const assetUrl = `${directusUrl}/assets/${fileId}?${forwardParams.toString()}`;

    // Fetch the image from Directus
    const response = await fetch(assetUrl, {
      headers: {
        Accept: "image/*",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch asset from Directus" },
        { status: response.status },
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Return the image with appropriate headers and caching
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[API /assets] Error proxying asset:", error);
    return NextResponse.json(
      { error: "Unexpected error while fetching asset" },
      { status: 500 },
    );
  }
}

