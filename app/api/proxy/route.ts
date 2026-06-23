import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/lib/api_client";

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname.replace("/api/proxy", "");
    const backendUrl = new URL(`${getApiBaseUrl()}${path}`);
    backendUrl.search = request.nextUrl.search;

    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: {
        "content-type":
          response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Backend proxy request failed." },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname.replace("/api/proxy", "");
    const backendUrl = new URL(`${getApiBaseUrl()}${path}`);
    backendUrl.search = request.nextUrl.search;

    const response = await fetch(backendUrl.toString(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: await request.text(),
    });

    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: {
        "content-type":
          response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Backend proxy request failed." },
      { status: 502 },
    );
  }
}
