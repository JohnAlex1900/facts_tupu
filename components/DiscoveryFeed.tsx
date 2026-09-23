"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PoliticianProfile, FeedFilterParams } from "../types";
import { factsTupuApi } from "../services/factsTupuApi";
import { useLiveMetrics } from "../hooks/useLiveMetrics";

interface DiscoveryFeedProps {
  initialData: PoliticianProfile[];
  initialTotal: number;
}

export default function DiscoveryFeed({
  initialData,
  initialTotal,
}: DiscoveryFeedProps) {
  // 1. Core State Handlers
  const [filters, setFilters] = useState<FeedFilterParams>({
    search_query: "",
    tier_filter: "",
    county_filter: "",
    sort_by: "overall_accountability_score",
    sort_order: "DESC",
    page: 1,
    limit: 12,
  });

  const [rawProfiles, setRawProfiles] =
    useState<PoliticianProfile[]>(initialData);
  const [totalRecords, setTotalRecords] = useState<number>(initialTotal);
  const [loading, setLoading] = useState<boolean>(false);

  // 2. Attach the SSE Live Stream Hook to manage reactive mutations
  const { profiles, lastAlert } = useLiveMetrics(rawProfiles);

  // 3. Trigger API pulls when filter configurations shift
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      // Skip the initial mount execution loop since server data is passed directly
      if (
        filters.page === 1 &&
        filters.search_query === "" &&
        filters.tier_filter === "" &&
        filters.county_filter === ""
      )
        return;

      setLoading(true);
      try {
        const response = await factsTupuApi.getFeed(filters);
        setRawProfiles(response.data);
        setTotalRecords(response.total_records);
      } catch (error) {
        console.error("Failed fetching filtered feed views:", error);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms built-in debounce to prevent endpoint hammering

    return () => clearTimeout(delayDebounce);
  }, [filters]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 relative overflow-hidden">
      {/* REAL-TIME NOTIFICATION TOAST ALERTS */}
      <div className="fixed top-6 right-6 z-50 w-full max-w-md pointer-events-none">
        <AnimatePresence>
          {lastAlert && (
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className="pointer-events-auto bg-slate-900 border-l-4 border-red-500 border border-slate-800 shadow-2xl p-4 rounded-r-lg backdrop-blur-md"
            >
              <div className="flex items-start space-x-3">
                <div className="bg-red-500/20 p-2 rounded text-red-400 font-bold text-xs">
                  {lastAlert.system_classification}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-200">
                    Live Stream Pipeline Alert
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Processed transcript update for entity ID:{" "}
                    <span className="font-mono text-slate-300">
                      {lastAlert.politician_id}
                    </span>
                    . Calculated verification rating dropped to{" "}
                    <span className="text-red-400 font-bold">
                      {lastAlert.computed_jaba_rating}/10.0
                    </span>
                    .
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* HEADER CONTROLS */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Facts Tupu Accountability Engine
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Real-time geo-administrative verification network across the Republic
          of Kenya.
        </p>

        {/* INTERACTIVE FILTERS BAR */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 bg-slate-900/50 p-4 rounded-xl border border-slate-900 backdrop-blur">
          <input
            type="text"
            placeholder="Search representative or region..."
            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition"
            value={filters.search_query}
            onChange={(e) =>
              setFilters({ ...filters, search_query: e.target.value, page: 1 })
            }
          />
          <select
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition"
            value={filters.tier_filter}
            onChange={(e) =>
              setFilters({ ...filters, tier_filter: e.target.value, page: 1 })
            }
          >
            <option value="">All Tiers</option>
            <option value="GUBERNATORIAL">Gubernatorial (Governors)</option>
            <option value="SENATE">Senate</option>
            <option value="NATIONAL_ASSEMBLY">National Assembly (MPs)</option>
          </select>
          <input
            type="text"
            placeholder="Filter County (e.g. Kiambu)..."
            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition"
            value={filters.county_filter || ""}
            onChange={(e) =>
              setFilters({ ...filters, county_filter: e.target.value, page: 1 })
            }
          />
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span>
              Tracking Summary: <b>{totalRecords}</b> entities listed
            </span>
            {loading && (
              <span className="text-emerald-400 animate-pulse">
                Querying data...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* DISCOVERY GRID VIEW */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {profiles.map((person) => (
              <motion.div
                key={person.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-5 shadow-lg flex flex-col justify-between group relative overflow-hidden transition-colors"
              >
                {/* Glow accent matching accountability tiers */}
                <div
                  className={`absolute top-0 left-0 w-full h-[2px] transition-all duration-300 ${
                    person.overall_accountability_score > 70
                      ? "bg-emerald-500"
                      : person.overall_accountability_score > 45
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }`}
                />

                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-100 text-lg group-hover:text-emerald-400 transition-colors">
                        {person.name}
                      </h3>
                      <span className="text-xs font-mono text-slate-400 tracking-wider">
                        {person.party_affiliation} • {person.role_type}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black block tracking-tighter text-slate-100">
                        {person.overall_accountability_score}%
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block">
                        Accountability
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Integrity Vector:</span>
                      <span
                        className={`font-semibold ${person.integrity_score > 50 ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {person.integrity_score}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Public Engagement:</span>
                      <span className="text-slate-200 font-semibold">
                        {person.engagement_score}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Risk Radar Index:</span>
                      <span
                        className={`font-semibold ${person.risk_radar_index > 60 ? "text-red-400" : "text-slate-300"}`}
                      >
                        {person.risk_radar_index}/100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/40 flex items-center justify-between text-base sm:text-[11px] text-slate-500">
                  <span className="truncate max-w-[150px]">
                    {person.constituency ? `${person.constituency}, ` : ""}
                    {person.county}
                  </span>
                  <span className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-sm sm:text-[9px] font-mono tracking-tight text-slate-400">
                    {person.tier}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
