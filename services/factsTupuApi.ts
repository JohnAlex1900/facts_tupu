import {
  FeedFilterParams,
  PaginatedFeedResponse,
  RiskRadarResponse,
  ScorecardResponse,
} from "../types";

import { getApiV1BaseUrl } from "@/app/lib/api_client";

const BASE_API_URL = getApiV1BaseUrl();

export const factsTupuApi = {
  /**
   * Fetches the paginated and filtered list of all Kenyan representatives for the main feed.
   */
  async getFeed(params: FeedFilterParams): Promise<PaginatedFeedResponse> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    const response = await fetch(
      `${BASE_API_URL}/feed?${searchParams.toString()}`,
    );
    if (!response.ok)
      throw new Error("Failed to retrieve representative feed array.");
    return response.json();
  },

  /**
   * Pulls the structured multi-axis matrix for a specific politician's radar chart.
   */
  async getRiskRadar(politicianId: string): Promise<RiskRadarResponse> {
    const response = await fetch(
      `${BASE_API_URL}/politicians/${politicianId}/risk-radar`,
    );
    if (!response.ok)
      throw new Error(
        `Failed to fetch risk matrix for target: ${politicianId}`,
      );
    return response.json();
  },

  /**
   * Compiles the full performance scorecard history and AI summaries.
   */
  async getScorecard(politicianId: string): Promise<ScorecardResponse> {
    const response = await fetch(
      `${BASE_API_URL}/politicians/${politicianId}/scorecard`,
    );
    if (!response.ok)
      throw new Error(
        `Failed to compile report card data for target: ${politicianId}`,
      );
    return response.json();
  },
};
