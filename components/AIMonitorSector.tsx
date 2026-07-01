"use client";

import React, { useState, useEffect } from "react";

interface RepresentativeAnalysisCard {
  id: string;
  type: string;
  full_name: string;
  target_role: string;
  party_affiliation: string;
  location_name: string;
  last_audit_timestamp: string;
  analysis_points: string[];
  traction_score: number;
  sentiment_label: "STABLE" | "SPIKING" | "CRITICAL_SITUATION";
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AIMonitorSector() {
  const [profiles, setProfiles] = useState<RepresentativeAnalysisCard[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppending, setIsAppending] = useState(false);
  const [error, setError] = useState("");
  const [selectedLeader, setSelectedLeader] =
    useState<RepresentativeAnalysisCard | null>(null);

  // Core execution link mapping queries to state handlers
  const loadIntelligenceGrid = async (
    pageNum: number,
    searchQuery: string,
    replaceItems = false,
  ) => {
    if (replaceItems) setIsLoading(true);
    else setIsAppending(true);

    try {
      const url = `${API_BASE_URL}/api/v1/monitor/representatives?page=${pageNum}&limit=6&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "API process failed.");
      }

      const data: RepresentativeAnalysisCard[] = await res.json();

      if (replaceItems) {
        setProfiles(data);
      } else {
        setProfiles((prev) => [...prev, ...data]);
      }

      // If less items arrive than the requested segment cap (6), we've exhausted records
      if (data.length < 6) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setError("");
    } catch (err: unknown) {
      console.error(err);
      setError(
        (err as Error).message ||
          "Failed to establish link with live AI nodes.",
      );
    } finally {
      setIsLoading(false);
      setIsAppending(false);
    }
  };

  // Debounced search watcher ensuring zero performance lags
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      loadIntelligenceGrid(1, search, true);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadIntelligenceGrid(nextPage, search, false);
  };

  const getSentimentBadge = (label: string) => {
    switch (label) {
      case "CRITICAL_SITUATION":
        return "bg-rose-950/80 text-rose-400 border-rose-800 animate-pulse";
      case "SPIKING":
        return "bg-cyan-950/80 text-cyan-400 border-cyan-800";
      default:
        return "bg-slate-950 text-emerald-400 border-slate-800";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ACTIONS SUB-HEADER & REAL-TIME SEARCH FIELD */}
      <div className="bg-gradient-to-r from-emerald-950/20 to-slate-950/50 border border-emerald-900/30 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
        <div className="space-y-0.5">
          <span className="text-base sm:text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase block">
            Leader Analysis Panel
          </span>
          <p className="text-xs text-slate-300 font-medium">
            Live evaluation matrices constructed continuously
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search leader or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 focus:border-cyan-500 text-xs text-slate-200 pl-3 pr-8 py-1.5 rounded-lg outline-none transition-colors"
            />
            <span className="absolute right-2.5 top-2 text-slate-500 text-sm sm:text-[10px] select-none">
              🔍
            </span>
          </div>
          <span className="hidden sm:inline-block text-sm sm:text-[10px] font-mono bg-slate-950 px-2.5 py-1.5 border border-slate-800 text-slate-400 rounded-lg whitespace-nowrap">
            System: Active 2026 Tracker
          </span>
        </div>
      </div>

      {/* REFRESH/LOAD SKELETON PLACEHOLDER GRID */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-64 w-full rounded-2xl bg-slate-900/40 border border-slate-850/50 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-sm text-rose-400 font-medium bg-rose-950/30 p-6 rounded-xl border border-rose-900 space-y-2">
          <p className="font-bold">Intelligence Feed Interrupted</p>
          <p className="text-rose-300/80">{error}</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-3 mt-6">
          <div className="text-2xl text-slate-600">📂</div>
          <h4 className="text-sm font-bold text-slate-300">
            No Representatives Found
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            No matching active leader profiles or location parameters matched
            your current criteria query.
          </p>
        </div>
      ) : (
        <>
          {/* RENDERING INTERACTIVE GRID SUMMARY CARDS */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 w-full">
            {profiles.map((leader, idx) => (
              <div
                key={`${leader.id}-${idx}`}
                onClick={() => setSelectedLeader(leader)}
                className="cursor-pointer group bg-slate-900/30 border border-slate-850 hover:border-cyan-800/80 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.06)]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-1.5">
                      <span className="text-sm sm:text-[9px] font-bold bg-indigo-950/60 px-2 py-0.5 rounded text-indigo-400 border border-indigo-900 uppercase tracking-wider">
                        {leader.type}
                      </span>
                      <span className="text-sm sm:text-[9px] font-bold bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800 uppercase tracking-wider">
                        {leader.target_role} • {leader.party_affiliation}
                      </span>
                    </div>
                    <span
                      className={`text-sm sm:text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getSentimentBadge(leader.sentiment_label)}`}
                    >
                      {leader.sentiment_label.replace("_", " ")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white tracking-tight leading-snug group-hover:text-cyan-400 transition-colors">
                      {leader.full_name}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-400 mt-0.5 flex items-center gap-1">
                      📍 {leader.location_name}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-850/60 space-y-2.5 flex-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Live AI Monitor Summary:
                  </span>
                  <ul className="space-y-2 text-base sm:text-[11px] text-slate-200 leading-relaxed font-medium line-clamp-4">
                    {leader.analysis_points.slice(0, 3).map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5 select-none">
                          •
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-base sm:text-[11px] font-medium">
                    <span className="text-slate-400">
                      Search Footprint Metric:
                    </span>
                    <span className="text-white font-mono font-bold">
                      {leader.traction_score}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                    <div
                      className="bg-gradient-to-r from-emerald-600 to-cyan-400 h-full transition-all duration-500"
                      style={{ width: `${leader.traction_score}%` }}
                    />
                  </div>
                  <span className="text-sm sm:text-[9px] font-mono text-slate-500 block text-right pt-0.5">
                    Audit Sync:{" "}
                    {new Date(leader.last_audit_timestamp).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" },
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* INFINITE CHUNKING SEGMENT REVOLUTION CONTROLLER */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={isAppending}
                className="px-6 py-2 bg-slate-950 border border-slate-850 hover:bg-slate-900 disabled:opacity-50 text-base sm:text-[11px] font-bold tracking-widest text-slate-300 rounded-xl uppercase transition-all"
              >
                {isAppending
                  ? "Processing Next Cluster Nodes..."
                  : "Load Next Segment ↓"}
              </button>
            </div>
          )}
        </>
      )}

      {/* INSPECTION DETAILED OVERLAY MODAL */}
      {selectedLeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedLeader(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-base font-mono"
            >
              ✕
            </button>

            <div className="mb-5">
              <div className="flex gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold bg-indigo-950/60 text-indigo-400 px-2 py-0.5 rounded border border-indigo-900 tracking-wider">
                  {selectedLeader.type}
                </span>
                <span className="text-[10px] uppercase font-bold bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800 tracking-wider">
                  {selectedLeader.target_role} •{" "}
                  {selectedLeader.party_affiliation}
                </span>
                <span
                  className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getSentimentBadge(selectedLeader.sentiment_label)}`}
                >
                  {selectedLeader.sentiment_label.replace("_", " ")}
                </span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">
                {selectedLeader.full_name}
              </h2>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                Jurisdiction Area: 📍 {selectedLeader.location_name}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-4">
                <h4 className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2.5">
                  Deep Intelligence Metric Assessment
                </h4>
                <ul className="space-y-3 text-xs text-slate-200 list-none leading-relaxed">
                  {selectedLeader.analysis_points.map((point, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="text-cyan-400 select-none font-bold">
                        ✓
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-4">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-400">
                    Search Footprint Weight Scale:
                  </span>
                  <span className="text-cyan-400 font-mono">
                    {selectedLeader.traction_score}%
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-500"
                    style={{ width: `${selectedLeader.traction_score}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 pt-0.5 text-sm sm:text-[9px] font-mono text-slate-500">
                  <span>ID reference: {selectedLeader.id}</span>
                  <span>
                    Synced:{" "}
                    {new Date(
                      selectedLeader.last_audit_timestamp,
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
