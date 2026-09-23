import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/lib/api_client";

export async function GET(request: Request) {
  const BACKEND_ENGINE_URL = getApiBaseUrl();
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "100";

    // Pipe the frontend layout request downstream directly to the FastAPI server
    const response = await fetch(
      `${BACKEND_ENGINE_URL}/api/representatives?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Keep data fresh during layout iterations
        next: { revalidate: 30 },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend engine responded with status: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Frontend API Gateway connection error:", error);
    return NextResponse.json(
      { error: "Failed to establish connection to core backend engine." },
      { status: 500 },
    );
  }
}
