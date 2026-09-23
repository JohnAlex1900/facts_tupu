"use client";

import { useState, useMemo } from "react";
import { FilterState } from "../types"; // Adjust path based on your setup

interface initialData {
  id: number;
  name: string;
  role_type: string;
  party: string;
  integrityVector: number;
  publicEngagement: number;
  accountability: number;
  riskRadarIndex: number;
  tier: string;
  county: string;
  constituency: string;
}

export function useRepresentativeFilter(initialData: initialData[]) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    tier: "All",
    county: "",
  });

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      // 1. Text Search Tokenization
      const matchesSearch =
        !filters.searchQuery ||
        item.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        (item.constituency &&
          item.constituency
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()));

      // 2. Chamber/Tier Filtering
      const matchesTier =
        filters.tier === "All" ||
        item.tier?.toLowerCase() === filters.tier.toLowerCase();

      // 3. Geo-Administrative County Filtering
      const matchesCounty =
        !filters.county ||
        item.county?.toLowerCase().includes(filters.county.toLowerCase());

      return matchesSearch && matchesTier && matchesCounty;
    });
  }, [initialData, filters]);

  return {
    filters,
    updateFilter,
    filteredData,
    setFilters,
  };
}
