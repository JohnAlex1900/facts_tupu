"use client";

import React, { useState, useEffect } from "react";
import SocialInsultsMonitor from "@/components/SocialInsultsMonitor";

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

// Added interface for Challengers
interface ChallengerProfile {
  id: string;
  full_name: string;
  target_role: string;
  location_name: string;
  party_affiliation: string;
  analysis_points: string[];
  traction_score: number;
  sentiment_label: "STABLE" | "SPIKING" | "CRITICAL_SITUATION";
}

interface AIMonitorSectorProps {
  searchQuery: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AIMonitorSector({ searchQuery }: AIMonitorSectorProps) {
  const [profiles, setProfiles] = useState<RepresentativeAnalysisCard[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppending, setIsAppending] = useState(false);
  const [error, setError] = useState("");

  const [selectedLeader, setSelectedLeader] =
    useState<RepresentativeAnalysisCard | null>(null);
  // State to track if a user has drilled down into a specific challenger
  const [selectedChallenger, setSelectedChallenger] =
    useState<ChallengerProfile | null>(null);

  const loadIntelligenceGrid = async (
    pageNum: number,
    currentSearchQuery: string,
    replaceItems = false,
  ) => {
    if (replaceItems) setIsLoading(true);
    else setIsAppending(true);

    try {
      const url = `${API_BASE_URL}/api/v1/monitor/representatives?page=${pageNum}&limit=6&search=${encodeURIComponent(currentSearchQuery)}`;
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

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      loadIntelligenceGrid(1, searchQuery, true);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadIntelligenceGrid(nextPage, searchQuery, false);
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

  // Helper to generate clean sample challenger sets based on the incumbent's data
  const generateSampleChallengers = (
    leader: RepresentativeAnalysisCard,
  ): ChallengerProfile[] => {
    return [1, 2, 3].map((num) => ({
      id: `challenger-${leader.id}-${num}`,
      full_name: `Challenger ${num}`,
      target_role: leader.target_role,
      location_name: leader.location_name,
      party_affiliation: "Undeclared / Independent",
      analysis_points: [
        `AI detects growing grassroots mobilization in ${leader.location_name}.`,
        `Increased search volume targeting incumbent's recent policy votes.`,
        `Social media sentiment shifting towards active campaign tracking.`,
      ],
      traction_score: Math.floor(Math.random() * 45) + 15,
      sentiment_label: num % 2 === 0 ? "SPIKING" : "STABLE",
    }));
  };

  const closeModal = () => {
    setSelectedLeader(null);
    setSelectedChallenger(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
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
        <div className="text-xl text-rose-400 font-medium bg-rose-950/30 p-6 rounded-xl border border-rose-900 space-y-2">
          <p className="font-bold">Intelligence Feed Interrupted</p>
          <p className="text-rose-300/80">{error}</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-3 mt-6">
          <div className="text-2xl text-slate-600">📂</div>
          <h4 className="text-xl font-bold text-slate-300">
            No Representatives Found
          </h4>
          <p className="text-xl text-slate-500 leading-relaxed">
            No matching active leader profiles or location parameters matched
            your current criteria query.
          </p>
        </div>
      ) : (
        <>
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
                      <span className="text-xl sm:text-[18px] font-bold bg-indigo-950/60 px-2 py-0.5 rounded text-indigo-400 border border-indigo-900 uppercase tracking-wider">
                        {leader.type}
                      </span>
                      <span className="text-xl sm:text-[18px] font-bold bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800 uppercase tracking-wider">
                        {leader.target_role} • {leader.party_affiliation}
                      </span>
                    </div>
                    <span
                      className={`text-xl sm:text-[18px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getSentimentBadge(leader.sentiment_label)}`}
                    >
                      {leader.sentiment_label.replace("_", " ")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white tracking-tight leading-snug group-hover:text-cyan-400 transition-colors">
                      {leader.full_name}
                    </h3>
                    <p className="text-xl font-semibold text-emerald-400 mt-0.5 flex items-center gap-1">
                      📍 {leader.location_name}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-850/60 space-y-2.5 flex-1">
                  <span className="text-[20px] font-bold text-slate-500 uppercase tracking-wider block">
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
                  <span className="text-xl sm:text-[18px] font-mono text-slate-500 block text-right pt-0.5">
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
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-base font-mono z-10"
            >
              ✕
            </button>

            {!selectedChallenger ? (
              /* INCUMBENT REPRESENTATIVE VIEW */
              <div className="animate-in fade-in duration-300">
                <div className="mb-5">
                  <div className="flex gap-2 mb-2">
                    <span className="text-[20px] uppercase font-bold bg-indigo-950/60 text-indigo-400 px-2 py-0.5 rounded border border-indigo-900 tracking-wider">
                      {selectedLeader.type}
                    </span>
                    <span className="text-[20px] uppercase font-bold bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800 tracking-wider">
                      {selectedLeader.target_role} •{" "}
                      {selectedLeader.party_affiliation}
                    </span>
                    <span
                      className={`ml-auto text-[20px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getSentimentBadge(selectedLeader.sentiment_label)}`}
                    >
                      {selectedLeader.sentiment_label.replace("_", " ")}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                    {selectedLeader.full_name}
                    <span className="text-[20px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase">
                      Incumbent
                    </span>
                  </h2>
                  <p className="text-xl text-emerald-400 font-semibold mt-0.5">
                    Jurisdiction Area: 📍 {selectedLeader.location_name}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-4">
                    <h4 className="text-[20px] uppercase tracking-wider font-bold text-slate-400 mb-2.5">
                      Deep Intelligence Metric Assessment
                    </h4>
                    <ul className="space-y-3 text-xl text-slate-200 list-none leading-relaxed">
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

                  <SocialInsultsMonitor
                    leaderName={selectedLeader.full_name}
                    leaderRole={selectedLeader.target_role}
                  />

                  <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-4">
                    <div className="flex justify-between text-xl font-bold mb-2">
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
                  </div>

                  {/* CHALLENGERS NESTED LIST SECTION */}
                  <div className="mt-6 pt-5 border-t border-slate-800/80">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-300">
                        Registered Challengers
                      </h4>
                      <span className="text-[20px] text-slate-500 font-mono">
                        AI Monitored
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {generateSampleChallengers(selectedLeader).map(
                        (challenger) => (
                          <div
                            key={challenger.id}
                            onClick={() => setSelectedChallenger(challenger)}
                            className="group cursor-pointer bg-slate-950/50 border border-slate-800 hover:border-cyan-800/80 hover:bg-slate-900 p-3.5 rounded-xl transition-all duration-200 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex justify-between items-start mb-1.5">
                                <span className="text-xl font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                                  {challenger.full_name}
                                </span>
                                <span
                                  className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getSentimentBadge(challenger.sentiment_label)}`}
                                >
                                  {challenger.sentiment_label}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[18px] uppercase font-bold text-slate-400">
                                <span>{challenger.target_role}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-emerald-500/80">
                                  📍 {challenger.location_name}
                                </span>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-[20px]">
                              <span className="text-slate-500">
                                View AI Audit →
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* CHALLENGER DEEP DIVE VIEW */
              <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                <button
                  onClick={() => setSelectedChallenger(null)}
                  className="mb-5 flex items-center gap-1.5 text-xl font-bold text-cyan-500 hover:text-cyan-400 transition-colors bg-cyan-950/30 px-3 py-1.5 rounded-lg border border-cyan-900/50 w-fit"
                >
                  <span>←</span> Return to Incumbent {selectedLeader.full_name}
                </button>

                <div className="mb-5">
                  <div className="flex gap-2 mb-2">
                    <span className="text-[20px] uppercase font-bold bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800 tracking-wider">
                      {selectedChallenger.target_role} •{" "}
                      {selectedChallenger.party_affiliation}
                    </span>
                    <span
                      className={`ml-auto text-[20px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getSentimentBadge(selectedChallenger.sentiment_label)}`}
                    >
                      {selectedChallenger.sentiment_label.replace("_", " ")}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                    {selectedChallenger.full_name}
                    <span className="text-[20px] bg-indigo-950/60 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-900 font-bold uppercase">
                      Challenger Profile
                    </span>
                  </h2>
                  <p className="text-xl text-emerald-400 font-semibold mt-0.5">
                    Target Jurisdiction: 📍 {selectedChallenger.location_name}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-4">
                    <h4 className="text-[20px] uppercase tracking-wider font-bold text-slate-400 mb-2.5">
                      Challenger Threat & Metric Assessment
                    </h4>
                    <ul className="space-y-3 text-xl text-slate-200 list-none leading-relaxed">
                      {selectedChallenger.analysis_points.map(
                        (point, index) => (
                          <li key={index} className="flex items-start gap-2.5">
                            <span className="text-cyan-400 select-none font-bold">
                              ✓
                            </span>
                            <span>{point}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  <SocialInsultsMonitor
                    leaderName={selectedChallenger.full_name}
                    leaderRole={selectedChallenger.target_role}
                  />

                  <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-4">
                    <div className="flex justify-between text-xl font-bold mb-2">
                      <span className="text-slate-400">
                        Challenger Campaign Footprint:
                      </span>
                      <span className="text-cyan-400 font-mono">
                        {selectedChallenger.traction_score}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-500"
                        style={{
                          width: `${selectedChallenger.traction_score}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
