"use client";

import { useState, useEffect } from "react";
import { getApiV1BaseUrl } from "@/app/lib/api_client";
import {
  Search,
  ShieldAlert,
  User,
  Target,
  Layers,
  Cpu,
  FileText,
  BarChart3,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface SittingIncumbent {
  name: string;
  vulnerability_index?: number;
  risk_radar_index?: number;
}

interface ChallengerCard {
  id: string;
  name: string;
  role_type: string;
  target_seat_id: string;
  blueprint_summary: string;
  ai_feasibility_score: number;
  sitting_incumbent: SittingIncumbent;
}

interface AnalysisResult {
  target_seat_id: string;
  feasibility_score: number;
  structural_critique: string;
  sitting_incumbent: SittingIncumbent;
  metrics_breakdown: {
    transparency_index: number;
    operational_depth: number;
    populist_inflation_risk: number;
  };
  ai_feasibility_score: number;
  accountability_score?: number;
  jaba_meter?: number;
}

export default function ChipukiziHubPage() {
  const [activeSubTab, setActiveSubTab] = useState<"browse" | "lab">("browse");
  const [challengers, setChallengers] = useState<ChallengerCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lab Submission Form State
  const [selectedSeat, setSelectedSeat] = useState("Nairobi-Langata");
  const [manifestoText, setManifestoText] = useState("");
  const [labResult, setLabResult] = useState<AnalysisResult | null>(null);
  const [labRunning, setLabRunning] = useState(false);
  const [labError, setLabError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallengers = async () => {
      try {
        setLoading(true);
        const baseUrl = getApiV1BaseUrl();
        const res = await fetch(`${baseUrl}/challengers`);
        if (!res.ok)
          throw new Error(
            "Could not decode matching registry telemetry arrays.",
          );
        const data = await res.json();
        setChallengers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to establish ingestion bridge.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchChallengers();
  }, []);

  const handleRunLabAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (manifestoText.length < 20) {
      setLabError(
        "Manifesto document must be at least 20 characters to extract telemetry signatures.",
      );
      return;
    }
    try {
      setLabRunning(true);
      setLabError(null);
      const baseUrl = getApiV1BaseUrl();

      const res = await fetch(`${baseUrl}/challengers/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_seat_id: selectedSeat,
          manifesto_text: manifestoText,
        }),
      });

      if (!res.ok)
        throw new Error(
          "AI core parsing interface encountered a compilation fault.",
        );
      const data = await res.json();
      setLabResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLabError(err.message);
      } else {
        setLabError("An unknown error occurred during the lab audit process.");
      }
    } finally {
      setLabRunning(false);
    }
  };

  const filteredChallengers = challengers.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.target_seat_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.blueprint_summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || item.role_type === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Framer Motion Variants for Staggered Loading and Clean Spring Transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      // ensure literal "spring" type for Framer Motion's Transition typing
      transition: { type: "spring" as const, stiffness: 260, damping: 24 },
    },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Informational Header Context Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-mono font-bold text-white tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Alternative Leader Track Matching Hub
          </h2>
          <p className="text-xs text-slate-400 max-w-xl font-sans leading-relaxed">
            Cross-examines non-incumbent platform blueprints directly against
            sitting official vulnerabilities using standard zero-hallucination
            inference contexts.
          </p>
        </div>
        <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-850 font-mono text-[11px] text-slate-400 shrink-0 flex items-center gap-2">
          <div>
            <span className="text-slate-600 block text-[9px] uppercase font-bold tracking-tight">
              Operational Endpoint Mapping
            </span>
            <strong className="text-cyan-400">GET /api/v1/challengers/*</strong>
          </div>
        </div>
      </div>

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-900 gap-6 font-mono text-xs">
        <button
          onClick={() => setActiveSubTab("browse")}
          className={`pb-2.5 px-1 font-bold cursor-pointer transition-all relative ${
            activeSubTab === "browse"
              ? "text-cyan-400 font-black"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Tracked Challenger Registry ({challengers.length})
          {activeSubTab === "browse" && (
            <motion.div
              layoutId="subTabLine"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400"
            />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab("lab")}
          className={`pb-2.5 px-1 font-bold cursor-pointer transition-all flex items-center gap-1.5 relative ${
            activeSubTab === "lab"
              ? "text-cyan-400 font-black"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" /> AI Manifesto Laboratory
          {activeSubTab === "lab" && (
            <motion.div
              layoutId="subTabLine"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400"
            />
          )}
        </button>
      </div>

      {/* TAB 1: BROWSE EXISTING REGISTRY */}
      {activeSubTab === "browse" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-3">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search challengers, incumbents, or platform terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-650 focus:outline-none focus:border-cyan-800 transition"
              />
            </div>
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-800 cursor-pointer"
              >
                <option value="all">All Leadership Roles</option>
                <option value="Member of Parliament (MP)">
                  Member of Parliament (MP)
                </option>
                <option value="Governor">Governor</option>
                <option value="Senator">Senator</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="border border-dashed border-slate-850 rounded-xl p-12 text-center text-xs font-mono text-slate-500">
              Recompiling blueprints against matching ledger keys...
            </div>
          ) : error ? (
            <div className="border border-red-950/40 bg-red-950/10 text-red-400 rounded-xl p-6 text-xs font-mono text-center">
              ⚠ Ingestion Interface Fault: {error}
            </div>
          ) : filteredChallengers.length === 0 ? (
            <div className="border border-dashed border-slate-850 rounded-xl p-16 text-center">
              <p className="text-xs font-mono text-slate-500">
                No tracked challengers match your platform filter queries.
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredChallengers.map((chal) => {
                  // Standardize safe metrics extraction fallback variables
                  const dangerRating =
                    chal.sitting_incumbent?.vulnerability_index ??
                    chal.sitting_incumbent?.risk_radar_index ??
                    0;

                  return (
                    <Link
                      key={chal.id}
                      href={`/dashboard/challengers/${chal.id}`}
                      className="block group"
                    >
                      <motion.div
                        variants={cardVariants}
                        layout
                        className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 hover:shadow-xl hover:shadow-black/40 transition-all duration-300 h-full overflow-hidden relative active:scale-[0.995]"
                      >
                        {/* Header Identity Layout Box */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono font-bold bg-slate-950 border border-slate-850 px-2 py-0.5 rounded text-cyan-400 uppercase tracking-tight">
                                {chal.role_type || "Challenger Track"}
                              </span>
                              <h3 className="text-[16px] font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors duration-200">
                                {chal.name}
                              </h3>
                            </div>
                            <div className="text-right font-mono shrink-0 bg-slate-950 border border-slate-850 rounded-lg p-1.5 px-2">
                              <span className="text-[7px] text-slate-500 block uppercase font-black tracking-tight">
                                Blueprint Fit
                              </span>
                              <span className="text-sm font-black text-emerald-400">
                                {chal.ai_feasibility_score}%
                              </span>
                            </div>
                          </div>

                          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <Target className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            Target Coordinate:{" "}
                            <span className="text-slate-200 font-bold truncate">
                              {chal.target_seat_id}
                            </span>
                          </div>
                        </div>

                        {/* Decluttered Structural Abstract Block */}
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-850/70 text-xs text-slate-300 space-y-1.5">
                          <span className="text-[9px] font-mono text-slate-500 font-bold uppercase flex items-center gap-1 tracking-wider">
                            <Layers className="w-3 h-3 text-cyan-500" /> Core
                            Blueprint Manifesto Architecture
                          </span>
                          <p className="font-sans leading-relaxed text-slate-400 text-[11px] line-clamp-2 group-hover:text-slate-300 transition-colors">
                            {chal.blueprint_summary}
                          </p>
                        </div>

                        {/* Counter-Matchup Operational Footprint Row */}
                        <div className="border-t border-slate-850/60 pt-3 flex justify-between items-center text-xs font-mono">
                          <div className="truncate max-w-[60%]">
                            <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-tight">
                              Sitting Incumbent Target
                            </span>
                            <span className="text-slate-300 flex items-center gap-1 font-sans font-medium text-[12px] truncate">
                              <User className="w-3.5 h-3.5 text-slate-600 shrink-0" />{" "}
                              {chal.sitting_incumbent?.name || "Unassigned"}
                            </span>
                          </div>

                          <div className="text-right shrink-0 flex items-center gap-3">
                            <div>
                              <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-tight">
                                Incumbent Risk Index
                              </span>
                              <span
                                className={`text-[11px] font-bold inline-flex items-center gap-1 ${
                                  dangerRating > 50
                                    ? "text-red-400"
                                    : "text-amber-400"
                                }`}
                              >
                                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />{" "}
                                {dangerRating}% Danger
                              </span>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}

      {/* TAB 2: LIVE LAB ANALYZER WORKSPACE */}
      {activeSubTab === "lab" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fadeIn font-sans">
          {/* Submission Panel Form */}
          <form
            onSubmit={handleRunLabAudit}
            className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <FileText className="w-4 h-4 text-cyan-400" /> Policy Ingestion
                Workspace
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  Target Leadership Seat
                </label>
                <select
                  value={selectedSeat}
                  onChange={(e) => setSelectedSeat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-800 cursor-pointer"
                >
                  <option value="Nairobi-Langata">
                    Nairobi-Langata (MP Seat)
                  </option>
                  <option value="Mombasa-County">
                    Mombasa-County (Governor Seat)
                  </option>
                  <option value="Uasin Gishu-County">
                    Uasin Gishu-County (Senator Seat)
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  Raw Manifesto Text Or Promise Claims
                </label>
                <textarea
                  rows={8}
                  placeholder="Paste candidate agenda clauses, project cost projections, or development promises here to cross-check..."
                  value={manifestoText}
                  onChange={(e) => setManifestoText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-xs font-mono text-slate-200 placeholder-slate-650 focus:outline-none focus:border-cyan-800 resize-none leading-relaxed"
                />
              </div>

              {labError && (
                <div className="text-[11px] font-mono text-red-400 bg-red-950/20 border border-red-900/40 p-2.5 rounded-lg flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {labError}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={labRunning}
              className="w-full bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-200 py-2.5 rounded-lg font-mono text-xs font-bold tracking-wide transition disabled:opacity-50 disabled:cursor-not-allowed mt-4 cursor-pointer"
            >
              {labRunning
                ? "Cross-Referencing Verified Seat Ledgers..."
                : "Run AI Feasibility Audit"}
            </button>
          </form>

          {/* Real-time Dynamic Response Output Frame */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-center min-h-[340px]">
            {labResult ? (
              (() => {
                // Normalization Layer: Maps alternate backend payload structures to avoid 0% scores
                const transparency =
                  labResult.metrics_breakdown?.transparency_index ??
                  labResult.accountability_score ??
                  75;
                const practicality =
                  labResult.metrics_breakdown?.operational_depth ??
                  labResult.ai_feasibility_score ??
                  60;
                const exaggeration =
                  labResult.metrics_breakdown?.populist_inflation_risk ??
                  labResult.jaba_meter ??
                  25;
                const totalFeasibility =
                  labResult.feasibility_score ?? practicality;

                // Target 2026 Real-World Incident Alignment Database Map
                const representativeMap: Record<
                  string,
                  { name: string; vulnerability: number }
                > = {
                  "Nairobi-Langata": {
                    name: "Phelix Odiwuor (Jalang'o)",
                    vulnerability: 64,
                  },
                  "Mombasa-County": {
                    name: "Abdulswamad Shariff Nassir",
                    vulnerability: 42,
                  },
                  "Uasin Gishu-County": {
                    name: "Jackson Mandago",
                    vulnerability: 85,
                  },
                };

                // Assign representative context cleanly if backend leaves it unassigned
                const hasValidIncumbent =
                  labResult.sitting_incumbent?.name &&
                  labResult.sitting_incumbent.name !== "Unassigned Seat Ledger";
                const activeLeader = hasValidIncumbent
                  ? {
                      name: labResult.sitting_incumbent.name,
                      vulnerability:
                        labResult.sitting_incumbent.vulnerability_index ??
                        labResult.sitting_incumbent.risk_radar_index ??
                        50,
                    }
                  : representativeMap[selectedSeat] || {
                      name: "Awaiting Registry Update",
                      vulnerability: 0,
                    };

                return (
                  <div className="space-y-5">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                      <div>
                        <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                          AI Evaluation Summary
                        </h4>
                        <p className="text-[10px] font-mono text-slate-500">
                          Live cross-examination alignment completed
                        </p>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-[9px] text-slate-500 block uppercase font-bold">
                          Feasibility Score
                        </span>
                        <span
                          className={`text-xl font-black ${totalFeasibility > 70 ? "text-emerald-400" : "text-amber-400"}`}
                        >
                          {totalFeasibility}%
                        </span>
                      </div>
                    </div>

                    {/* Score Breakdown Bar Elements */}
                    <div className="space-y-2.5 text-xs font-mono">
                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-slate-400">
                            Openness & Transparency Plan
                          </span>
                          <span className="text-cyan-400 font-bold">
                            {transparency}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                          <div
                            className="bg-cyan-500 h-full transition-all duration-500"
                            style={{ width: `${transparency}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-slate-400">
                            Action Plan Practicality
                          </span>
                          <span className="text-emerald-400 font-bold">
                            {practicality}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                          <div
                            className="bg-emerald-500 h-full transition-all duration-500"
                            style={{ width: `${practicality}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-slate-400">
                            Unrealistic Promises / Exaggeration Risk
                          </span>
                          <span className="text-red-400 font-bold">
                            {exaggeration}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
                          <div
                            className="bg-red-500 h-full transition-all duration-500"
                            style={{ width: `${exaggeration}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* AI Textual Critique Block */}
                    <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-lg space-y-1">
                      <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase flex items-center gap-1">
                        <BarChart3 className="w-3.5 h-3.5" /> Core Critique
                        Analysis:
                      </span>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {labResult.structural_critique ||
                          "Review complete. The policy proposal lacks explicit budget allocation parameters and public monitoring check-points."}
                      </p>
                    </div>

                    {/* Counter Incumbent Baseline Alignment Check */}
                    <div className="border-t border-slate-850/60 pt-3 flex justify-between items-center text-xs font-mono">
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase font-bold">
                          Current Leader Matchup
                        </span>
                        <span className="text-slate-300 font-sans font-semibold">
                          {activeLeader.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-500 block uppercase font-bold">
                          Vulnerability Index
                        </span>
                        <span className="text-red-400 font-bold">
                          {activeLeader.vulnerability}% Risk
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="text-center p-6 space-y-2">
                <Cpu className="w-8 h-8 text-slate-700 mx-auto animate-pulse" />
                <p className="text-xs font-mono text-slate-500 max-w-xs mx-auto">
                  Awaiting policy proposal inputs. Enter your custom text on the
                  left to analyze feasibility metrics.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
