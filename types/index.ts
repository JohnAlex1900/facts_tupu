export interface PoliticianVectors {
  integrity_score_pct: number;
  engagement_score_pct: number;
  overall_accountability_score_pct: number;
}

export interface FilterState {
  searchQuery: string;
  tier: string;
  county: string;
}

export interface PoliticianProfile {
  id: string;
  name: string;
  role_type: "INCUMBENT" | "CHALLENGER";
  target_seat_id: string;
  party_affiliation: string;
  integrity_score: number;
  efficacy_score: number;
  presence_score: number;
  cdf_utility_score: number;
  engagement_score: number;
  overall_accountability_score: number;
  reelection_probability_pct: number;
  risk_radar_index: number;
  tier: "GUBERNATORIAL" | "SENATE" | "WOMEN_REP" | "NATIONAL_ASSEMBLY" | "MCA";
  county: string;
  constituency?: string;
}

export interface RiskDimensionItem {
  axis: string;
  value: number;
  criticality: "LOW" | "MEDIUM" | "HIGH";
}

export interface RiskRadarResponse {
  politician_id: string;
  name: string;
  role_type: string;
  compound_risk_index: number;
  risk_classification: string;
  vulnerability_statement: string;
  matrix: RiskDimensionItem[];
}

export interface ScorecardResponse {
  meta: {
    name: string;
    role_type: string;
    party: string;
    accountability_rating: string;
  };
  legislative_efficiency: {
    plenary_attendance: string;
    sessions_tracked: string;
    bills_sponsored_count: number;
    motions_moved_count: number;
    committee_attendance_index: string;
  };
  factual_integrity_summary: {
    total_speeches_analyzed: number;
    jaba_meter_historical_average: string;
  };
  evaluation_verdict: {
    calculated_performance_grade: string;
    ai_narrative_synopsis: string;
  };
}

export interface FeedFilterParams {
  search_query?: string;
  tier_filter?: string;
  county_filter?: string;
  sort_by?: string;
  sort_order?: string;
  page: number;
  limit: number;
}

export interface PaginatedFeedResponse {
  total_records: number;
  current_page: number;
  total_pages: number;
  has_more: boolean;
  data: PoliticianProfile[];
}

export interface LiveMetricUpdateMessage {
  politician_id: string;
  system_classification: string;
  computed_jaba_rating: number;
  updated_vectors: PoliticianVectors;
}
