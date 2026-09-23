// /app/api/api_client.ts

export const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Use same-origin browser proxy for frontend requests to avoid CORS.
    return "";
  }

  const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!BASE_API_URL) {
    console.warn(
      "NEXT_PUBLIC_API_URL is not defined. Falling back to localhost for local development only.",
    );
    return "http://localhost:8000";
  }
  return BASE_API_URL.replace(/\/+$/g, "");
};

export const getApiV1BaseUrl = () => {
  if (typeof window !== "undefined") {
    return "/api/v1";
  }
  return `${getApiBaseUrl()}/api/v1`;
};

const BASE_URL = `${getApiV1BaseUrl()}`;

// Helper to convert an object into URL query parameters
function buildQueryParams(params?: Record<string, unknown>): string {
  if (!params) return "";
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined),
  );
  return "?" + new URLSearchParams(cleanParams as never).toString();
}

// 1. Export the apiClient object your hook is looking for
export const apiClient = {
  async get(endpoint: string, options?: { params?: Record<string, unknown> }) {
    const query = buildQueryParams(options?.params);
    const res = await fetch(`${BASE_URL}${endpoint}${query}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return { data }; // Wrapped in an object to match your hook's { data } destructuring
  },

  async post(endpoint: string, body: unknown) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return { data }; // Wrapped in an object to match your hook's { data } destructuring
  },
};

// Your existing interfaces and factsTupuApi code remain unchanged below
export interface Politician {
  politician_id: string;
  name: string;
  role: "MP" | "Senator" | "Governor";
  county: string;
  constituency?: string;
  party: string;
  attendance_rate: number;
  manifesto_alignment_index: number;
}

export interface LegislativeAudit {
  vote_id: string;
  bill_title: string;
  bill_category: string;
  vote_cast: "YES" | "NO" | "ABSTAIN";
  alignment_score: number;
  ai_alignment_rationale: string;
  created_at: string;
}

export interface RegionalStat {
  region: string;
  count: string;
  density: string;
}

export const factsTupuApi = {
  async getRegionalStats(): Promise<RegionalStat[]> {
    const res = await fetch(`${BASE_URL}/dashboard/regional-stats`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load regional data");
    return res.json();
  },

  async getPoliticianCompliance(id: string) {
    const res = await fetch(`${BASE_URL}/legislative/compliance/${id}`, {
      cache: "no-store",
    });
    if (!res.ok)
      throw new Error(`Failed to fetch records for representative: ${id}`);
    return res.json();
  },

  async commitSignedPetition(payload: unknown) {
    const res = await fetch(`${BASE_URL}/petitions/commit-signed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok)
      throw new Error("Failed to register signed document signature");
    return res.json();
  },
};
