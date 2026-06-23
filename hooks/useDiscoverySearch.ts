import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/app/lib/api_client";

export interface Profile {
  id: string;
  name: string;
  party_affiliation: string;
  integrity_score: number;
  risk_radar_index: number;
}

export interface SearchFilters {
  q?: string;
  party?: string;
  min_integrity?: number;
  max_risk?: number;
  page: number;
  limit: number;
}

export interface SearchResponse {
  metadata: {
    total_records: number;
    total_pages: number;
    current_page: number;
  };
  results: Profile[];
}

export const useDiscoverySearch = (filters: SearchFilters) => {
  return useQuery<SearchResponse, Error>({
    queryKey: ["discovery-profiles", filters],
    queryFn: async () => {
      // Passes the filters directly to the FastAPI endpoint built earlier
      const { data } = await apiClient.get("/public/explore", {
        params: filters as unknown as Record<string, unknown>, // Add the type assertion here
      });

      return data;
    },
    // Keeps the previous grid visible while fetching the next page/filter state
    placeholderData: (prev) => prev,
    staleTime: 60000, // Cache results for 1 minute to reduce DB load
  });
};
