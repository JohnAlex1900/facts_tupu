import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/lib/api_client";

export async function GET(request: NextRequest) {
  try {
    // Extract incoming tracking parameters from the request URL
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get("tier");
    const severity = searchParams.get("severity");
    const min_accountability = searchParams.get("min_accountability");

    // Construct the backend destination URL dynamically
    const backendUrl = new URL(`${getApiBaseUrl()}/api/v1/monitor`);
    if (tier) backendUrl.searchParams.append("tier", tier);
    if (severity) backendUrl.searchParams.append("severity", severity);
    if (min_accountability)
      backendUrl.searchParams.append("min_accountability", min_accountability);

    const response = await fetch(backendUrl.toString(), { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Core API Engine returned status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          alerts: [],
          watchlist: [],
          error: `Core API Engine Connection Failure: ${error.message}`,
        },
        { status: 200 },
      );
    }
    return NextResponse.json(
      {
        alerts: [],
        watchlist: [],
        error: `Core API Engine Connection Failure: ${error?.toString() || "Unknown Error"}message}`,
      },
      { status: 200 },
    );
  }
}
