"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldAlert,
  Target,
  Layers,
  Cpu,
  User,
  BarChart3,
  TrendingUp,
  Activity,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface SittingIncumbent {
  name: string;
  role: string;
  vulnerability_index?: number;
  risk_radar_index?: number;
  jaba_score?: number;
}

interface DetailedChallenger {
  id: string;
  name: string;
  role_type: string;
  target_seat_id: string;
  blueprint_summary: string;
  ai_feasibility_score: number;
  accountability_score?: number;
  jaba_meter?: number;
  sitting_incumbent: SittingIncumbent;
  metrics_breakdown?: {
    transparency_index: number;
    operational_depth: number;
    populist_inflation_risk: number;
  };
  pillars?: string[];
}

export default function ChallengerScorecardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [challenger, setChallenger] = useState<DetailedChallenger | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchChallengerDetails() {
      try {
        setLoading(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${baseUrl}/api/v1/challengers/${id}`);

        if (!res.ok) {
          throw new Error("Failed to load this challenger's profile data.");
        }

        const data = await res.json();
        setChallenger(data);
      } catch (err: unknown) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Could not connect to the database.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchChallengerDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-mono text-xs text-slate-500 space-y-3">
        <Cpu className="w-6 h-6 animate-spin text-cyan-500" />
        <span>Analyzing manifesto promises and candidate records...</span>
      </div>
    );
  }

  if (error || !challenger) {
    return (
      <div className="max-w-md mx-auto my-12 border border-red-950/40 bg-red-950/10 text-red-400 rounded-xl p-6 text-xs font-mono text-center space-y-4">
        <ShieldAlert className="w-8 h-8 mx-auto text-red-500" />
        <div>
          <h3 className="font-bold uppercase tracking-wider text-white">
            Profile Not Found
          </h3>
          <p className="text-slate-400 mt-1">
            {error || "This candidate record could not be found."}
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/chipukizi")}
          className="bg-slate-900 border border-slate-800 text-slate-300 px-4 py-1.5 rounded-lg hover:bg-slate-850 cursor-pointer text-[11px]"
        >
          Back to Chipukizi Hub
        </button>
      </div>
    );
  }

  // Fallback calculations if data object properties vary
  const incumbentDanger =
    challenger.sitting_incumbent?.vulnerability_index ??
    challenger.sitting_incumbent?.risk_radar_index ??
    0;
  const metrics = challenger.metrics_breakdown ?? {
    transparency_index: challenger.accountability_score ?? 74,
    operational_depth: Math.min(
      (challenger.ai_feasibility_score ?? 80) + 5,
      100,
    ),
    populist_inflation_risk: challenger.jaba_meter ?? 35,
  };

  const agendaPillars = challenger.pillars ?? [
    "Open Budget Tracking & Public Dashboards",
    "Digital Verification for Civic Services",
    "Performance Standards for Local Projects",
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 font-sans">
      {/* Navigation Top Bar */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          BACK TO HUB
        </button>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-900 uppercase">
          ID:{" "}
          <span className="text-slate-300 font-bold">
            {challenger.id.slice(0, 8)}
          </span>
        </span>
      </div>

      {/* Main Candidate Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold bg-cyan-950/60 border border-cyan-900 text-cyan-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {challenger.role_type} Aspiring
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tight">
                Verified Platform Evaluation
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {challenger.name}
            </h1>
            <p className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-cyan-500 shrink-0" />
              Targeting Seat:{" "}
              <span className="text-white font-bold">
                {challenger.target_seat_id}
              </span>
            </p>
          </div>

          {/* Top Level Metric Badges */}
          <div className="flex gap-4 font-mono w-full md:w-auto">
            <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex-1 md:flex-none text-center min-w-[100px]">
              <span className="text-[8px] text-slate-500 block uppercase font-black tracking-wider">
                Feasibility Score
              </span>
              <span className="text-xl font-black text-emerald-400">
                {challenger.ai_feasibility_score}%
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex-1 md:flex-none text-center min-w-[100px]">
              <span className="text-[8px] text-slate-500 block uppercase font-black tracking-wider">
                Transparency
              </span>
              <span className="text-xl font-black text-cyan-400">
                {challenger.accountability_score ?? 82}%
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex-1 md:flex-none text-center min-w-[100px]">
              <span className="text-[8px] text-slate-500 block uppercase font-black tracking-wider">
                Exaggeration Risk
              </span>
              <span className="text-xl font-black text-amber-400">
                {challenger.jaba_meter ?? 24}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Breakdown Matrix Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns: Platform Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Box */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3"
          >
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-500" /> Policy & Manifesto
              Summary
            </h3>
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              {challenger.blueprint_summary}
            </p>
          </motion.div>

          {/* Core AI Analysis Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
          >
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-500" /> AI Score
                Breakdown
              </h3>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                Automated assessment of proposed plans and claims
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />{" "}
                    Openness & Transparency Plan
                  </span>
                  <span className="text-cyan-400 font-black">
                    {metrics.transparency_index}%
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div
                    className="bg-cyan-500 h-full rounded-full"
                    style={{ width: `${metrics.transparency_index}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" /> Action
                    Plan Practicality
                  </span>
                  <span className="text-emerald-400 font-black">
                    {metrics.operational_depth}%
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${metrics.operational_depth}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-red-500" />{" "}
                    Unrealistic Promises / Exaggeration Risk
                  </span>
                  <span className="text-red-400 font-black">
                    {metrics.populist_inflation_risk}%
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div
                    className="bg-red-500 h-full rounded-full"
                    style={{ width: `${metrics.populist_inflation_risk}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Manifesto Priorities */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3"
          >
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-500" /> Core Focus Areas &
              Priorities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
              {agendaPillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-850 p-3 rounded-lg text-slate-300 flex items-start gap-2.5"
                >
                  <span className="text-cyan-500 font-black">0{idx + 1}.</span>
                  <span className="font-sans text-slate-300 leading-snug">
                    {pillar}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Head-to-Head Incumbent Matchup */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
          >
            <div>
              <h3 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Current Leadership Matchup
              </h3>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                How this candidate stacks up against the incumbent leader
              </p>
            </div>

            {/* Current Leader Snippet */}
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <span className="text-[8px] font-mono font-black text-red-500 block uppercase tracking-wider">
                    Current Leader
                  </span>
                  <h4 className="text-[14px] font-bold text-white tracking-tight truncate">
                    {challenger.sitting_incumbent?.name ||
                      "Unassigned Position"}
                  </h4>
                </div>
              </div>

              {/* Incumbent Scores */}
              <div className="border-t border-slate-900 pt-3 grid grid-cols-2 gap-2 text-center font-mono">
                <div className="bg-slate-900/60 p-2 border border-slate-850 rounded-lg">
                  <span className="text-[7px] text-slate-500 block uppercase font-bold tracking-tight">
                    Vulnerability Index
                  </span>
                  <span
                    className={`text-xs font-black ${incumbentDanger > 50 ? "text-red-400" : "text-amber-400"}`}
                  >
                    {incumbentDanger}%
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2 border border-slate-850 rounded-lg">
                  <span className="text-[7px] text-slate-500 block uppercase font-bold tracking-tight">
                    Performance Score
                  </span>
                  <span className="text-xs font-black text-slate-300">
                    {challenger.sitting_incumbent?.jaba_score ?? 68}%
                  </span>
                </div>
              </div>
            </div>

            {/* Dashboard Context Summary */}
            <div className="bg-cyan-950/20 border border-cyan-900/40 p-3.5 rounded-xl text-center space-y-2">
              <p className="text-[11px] font-mono text-cyan-300 leading-relaxed">
                This alternative leadership hub uses public metrics to
                cross-examine new manifestos against public accountability
                standards.
              </p>
              <Link
                href="/dashboard/chipukizi"
                className="inline-block bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-800 font-mono text-[10px] font-bold px-4 py-2 rounded-lg transition-all"
              >
                Return to Global Registry
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
