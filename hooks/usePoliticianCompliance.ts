import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/app//lib/api_client";

export interface AuditedVote {
  vote_id: string;
  vote_cast: "YES" | "NO" | "ABSTAIN";
  alignment_score: number;
  ai_alignment_rationale: string;
  created_at: string;
  bill_title: string;
  bill_category: string;
}

export interface ComplianceData {
  representative_id: string;
  aggregate_manifesto_alignment_index: number;
  audited_records: AuditedVote[];
}

export const usePoliticianCompliance = (politicianId: string) => {
  return useQuery<ComplianceData, Error>({
    queryKey: ["politician-compliance", politicianId],
    queryFn: async () => {
      // Direct hook into our FastAPI endpoint configuration
      const { data } = await apiClient.get(
        `/legislative/compliance/${politicianId}`,
      );
      return data;
    },
    staleTime: 30000, // Keep data fresh for 30 seconds
  });
};
