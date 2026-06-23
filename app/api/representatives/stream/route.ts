import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/lib/api_client";

export async function GET(request: NextRequest) {
  try {
    const backendBase = getApiBaseUrl();
    const backendUrl = new URL(request.nextUrl.pathname, backendBase);
    backendUrl.search = request.nextUrl.search;

    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.set("x-forwarded-host", request.headers.get("host") ?? "");
    headers.set("ngrok-skip-browser-warning", "true");

    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers,
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        "x-proxy-via": "nextjs-representatives-stream-proxy",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Backend stream proxy request failed.",
        details: (error as Error).message,
      },
      { status: 502 },
    );
  }
}
