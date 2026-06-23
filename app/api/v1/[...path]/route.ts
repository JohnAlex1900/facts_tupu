import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/lib/api_client";

const BACKEND_PREFIX = "/api/v1";

async function proxy(request: NextRequest) {
  try {
    const targetPath =
      request.nextUrl.pathname.replace(BACKEND_PREFIX, "") || "/";
    const backendBase = getApiBaseUrl();
    const backendUrl = new URL(`${backendBase}${targetPath}`);
    backendUrl.search = request.nextUrl.search;

    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.set("x-forwarded-host", request.headers.get("host") ?? "");
    headers.set("ngrok-skip-browser-warning", "true");

    const response = await fetch(backendUrl.toString(), {
      method: request.method,
      headers,
      body: request.body,
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set("x-proxy-via", "nextjs-api-proxy");

    return new NextResponse(await response.arrayBuffer(), {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Backend proxy request failed.",
        details: (error as Error).message,
      },
      { status: 502 },
    );
  }
}

export async function GET(request: NextRequest) {
  return proxy(request);
}

export async function POST(request: NextRequest) {
  return proxy(request);
}

export async function PUT(request: NextRequest) {
  return proxy(request);
}

export async function PATCH(request: NextRequest) {
  return proxy(request);
}

export async function DELETE(request: NextRequest) {
  return proxy(request);
}

export async function OPTIONS(request: NextRequest) {
  return proxy(request);
}
