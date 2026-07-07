"use client";

import React, { useState } from "react";

interface Challenger {
  challenger_id: string;
  full_name: string;
  public_traction_velocity: number;
  party_affiliation: string;
  ai_feasibility_score: number;
}

// NEW: AI Deep Dive Interfaces
interface AICorePriority {
  id: string;
  title: string;
}

interface AIDeepDiveMonitor {
  action_plan_practicality: number;
  unrealistic_promises_risk: number;
  core_priorities: AICorePriority[];
  leadership_matchup: {
    vulnerability_index: number;
    performance_score: number;
  };
  talk_vs_action_justification: string[];
  delivery_score_justification: string[];
  risk_level_justification: string[];
}

interface Profile {
  id: string;
  seat_layer: string;
  name: string;
  county: string;
  role: string;
  jaba_meter: number;
  impact_rating: number;
  rvs: number;
  challengers: Challenger[];
  ai_monitor_data?: AIDeepDiveMonitor; // NEW: Appended AI backend data
}

interface IndividualScorecardProps {
  leader: Profile;
  onBack: () => void;
}

export default function IndividualScorecard({
  leader,
  onBack,
}: IndividualScorecardProps) {
  // State to manage which detailed AI metric is currently being viewed
  const [activeMetricTab, setActiveMetricTab] = useState<
    "talk" | "delivery" | "risk"
  >("talk");

  // Fallback mock data structure in case the backend hasn't populated this leader's AI monitor yet
  const aiMonitor: AIDeepDiveMonitor = leader.ai_monitor_data || {
    action_plan_practicality: 88,
    unrealistic_promises_risk: 30,
    core_priorities: [
      { id: "01", title: "Open Budget Tracking & Public Dashboards" },
      { id: "02", title: "Digital Verification for Civic Services" },
      { id: "03", title: "Performance Standards for Local Projects" },
    ],
    leadership_matchup: {
      vulnerability_index: 50,
      performance_score: 60,
    },
    talk_vs_action_justification: [
      "Exaggerated project kickoff timelines for infrastructure expansions by 14 months.",
      "7 explicit political platform public claims flagged with 'No Direct Ground Evidence'.",
      "Maintained higher relative media mentions compared to physical active work deployments.",
    ],
    delivery_score_justification: [
      "Successfully delivered 3 primary health facilities within county budget guidelines.",
      "Allocated funds perfectly match visible projects for rural access roadway upgrades.",
    ],
    risk_level_justification: [
      "Missed target milestones on structural audit reporting transparency parameters.",
      "Minor accounting ledger variance noticed across decentralized conditional allocations.",
    ],
  };

  return (
    <div className="w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl animate-fadeIn">
      {/* TOP NAVIGATION HEADER */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Facts Tupu &bull; Performance Scorecard
          </span>
        </div>
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700"
        >
          ← Back to Leaders List
        </button>
      </div>

      <div className="p-6 md:p-10 space-y-8">
        {/* LEADER MAIN IDENTITY BLOCK */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-950 p-6 rounded-xl border border-slate-800/60 shadow-inner">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 uppercase tracking-wider mb-2">
              Current Leader ({leader.seat_layer})
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {leader.name}
            </h2>
            <p className="text-sm text-emerald-400 font-medium mt-0.5">
              {leader.role} &bull;{" "}
              <span className="text-slate-400">{leader.county} County</span>
            </p>
          </div>

          {/* INTERACTIVE PRIMARY METRICS SUMMARY */}
          <div className="w-full md:w-auto flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 min-w-0 sm:min-w-[280px] md:min-w-[320px] justify-between">
            <button
              onClick={() => setActiveMetricTab("talk")}
              className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                activeMetricTab === "talk"
                  ? "bg-slate-950 border border-slate-700 shadow-md scale-105"
                  : "hover:bg-slate-800/50 border border-transparent"
              }`}
            >
              <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                Talk vs Action
              </span>
              <span className="block mt-0.5 font-mono text-lg font-black text-amber-400">
                {leader.jaba_meter}%
              </span>
            </button>
            <button
              onClick={() => setActiveMetricTab("delivery")}
              className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                activeMetricTab === "delivery"
                  ? "bg-slate-950 border border-slate-700 shadow-md scale-105"
                  : "hover:bg-slate-800/50 border border-transparent"
              }`}
            >
              <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                Delivery Score
              </span>
              <span className="block mt-0.5 font-mono text-lg font-black text-cyan-400">
                {leader.impact_rating}
              </span>
            </button>
            <button
              onClick={() => setActiveMetricTab("risk")}
              className={`flex-1 flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                activeMetricTab === "risk"
                  ? "bg-slate-950 border border-slate-700 shadow-md scale-105"
                  : "hover:bg-slate-800/50 border border-transparent"
              }`}
            >
              <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                Risk Level
              </span>
              <span className="block mt-0.5 font-mono text-lg font-black text-rose-400">
                {leader.rvs}
              </span>
            </button>
          </div>
        </div>

        {/* AI DEEP DIVE - TWO COLUMN GRID */}
        <div className="grid gap-6 md:grid-cols-2 items-start">
          {/* LEFT COLUMN: DYNAMIC METRIC JUSTIFICATION */}
          <div className="rounded-xl border border-slate-800/60 bg-slate-950 p-6 flex flex-col h-full min-h-[350px]">
            <div className="border-b border-slate-800/60 pb-3 flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                AI Context & Explanations
              </h3>
              <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Selected: {activeMetricTab}
              </span>
            </div>

            <div className="flex-1 space-y-4">
              {activeMetricTab === "talk" && (
                <div className="animate-fadeIn">
                  <span className="font-bold text-amber-400 text-xs block mb-1">
                    💬 Talk vs Action (Jaba Meter)
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed italic mb-4">
                    Measures how much time a leader spends on political rhetoric
                    or unverified promises versus verified development steps on
                    the ground.
                  </p>
                  <div className="space-y-3">
                    {aiMonitor.talk_vs_action_justification.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-2.5 items-start text-xs text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800"
                      >
                        <span className="text-amber-500 mt-0.5">⚠️</span>
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeMetricTab === "delivery" && (
                <div className="animate-fadeIn">
                  <span className="font-bold text-cyan-400 text-xs block mb-1">
                    🏗️ Delivery Score
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed italic mb-4">
                    Calculated straight from real infrastructure projects,
                    budget spending, and public services successfully completed
                    within their area.
                  </p>
                  <div className="space-y-3">
                    {aiMonitor.delivery_score_justification.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-2.5 items-start text-xs text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800"
                      >
                        <span className="text-cyan-400 mt-0.5">✓</span>
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeMetricTab === "risk" && (
                <div className="animate-fadeIn">
                  <span className="font-bold text-rose-400 text-xs block mb-1">
                    ⚠️ Risk Level
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed italic mb-4">
                    Rates management discrepancies, structural transparency
                    gaps, or missing budget audit reports. Lower means cleaner
                    leadership.
                  </p>
                  <div className="space-y-3">
                    {aiMonitor.risk_level_justification.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-2.5 items-start text-xs text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800"
                      >
                        <span className="text-rose-500 mt-0.5">⊗</span>
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: AI ANALYTICS PANELS */}
          <div className="space-y-6">
            {/* Sector A: Practicality Sliders */}
            <div className="rounded-xl border border-slate-800/60 bg-slate-950 p-5 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="text-emerald-400">📈</span> Action Plan
                    Practicality
                  </span>
                  <span className="text-emerald-400 font-mono">
                    {aiMonitor.action_plan_practicality}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-1000"
                    style={{ width: `${aiMonitor.action_plan_practicality}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="text-rose-400">📉</span> Exaggeration Risk
                  </span>
                  <span className="text-rose-400 font-mono">
                    {aiMonitor.unrealistic_promises_risk}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-rose-500 transition-all duration-1000"
                    style={{ width: `${aiMonitor.unrealistic_promises_risk}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Sector B: Core Focus Areas */}
            <div className="rounded-xl border border-slate-800/60 bg-slate-950 p-5 space-y-4">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                📂 Core Focus Areas & Priorities
              </h4>
              <div className="space-y-2.5">
                {aiMonitor.core_priorities.map((priority) => (
                  <div
                    key={priority.id}
                    className="w-full text-left rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 flex items-center gap-3 border-l-2 border-l-cyan-500"
                  >
                    <span className="text-xs font-mono font-black text-cyan-500">
                      {priority.id}.
                    </span>
                    <span className="text-xs font-semibold text-slate-200">
                      {priority.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sector C: Leadership Matchup */}
            <div className="rounded-xl border border-slate-800/60 bg-slate-950 p-5 space-y-4">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400 flex items-center gap-2">
                🛡️ Current Leadership Matchup
              </h4>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-slate-400 text-sm">
                    👤
                  </div>
                  <div>
                    <span className="text-[8px] font-black uppercase text-rose-500 block tracking-wider">
                      Incumbent
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {leader.name}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-center">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tight block">
                      Vulnerability Index
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400 mt-1 block">
                      {aiMonitor.leadership_matchup.vulnerability_index}%
                    </span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-center">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tight block">
                      Performance Score
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 mt-1 block">
                      {aiMonitor.leadership_matchup.performance_score}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COMPETING CHALLENGERS PROFILE TRACK */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Aspiring Challengers Eying This Position (
              {leader.challengers.length})
            </h3>
            <span className="text-xs text-slate-500 italic bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
              Verified alternative options
            </span>
          </div>

          {leader.challengers.length === 0 ? (
            <div className="text-center py-8 bg-slate-950/40 border border-dashed border-slate-800 rounded-xl">
              <p className="text-xs text-slate-500 italic">
                No alternative track competitors have registered for this
                leadership slot yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {leader.challengers.map((challenger) => (
                <div
                  key={challenger.challenger_id}
                  className="rounded-xl bg-slate-950 p-5 border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h4 className="text-base font-bold text-slate-100">
                        {challenger.full_name}
                      </h4>
                      <span className="shrink-0 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-900/40">
                        Growth Speed: +{challenger.public_traction_velocity}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Political Party Group:{" "}
                      <span className="text-slate-200 font-semibold">
                        {challenger.party_affiliation}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-900/60 flex justify-between items-center text-xs">
                    <span className="text-slate-500">
                      Community Suitability
                    </span>
                    <span className="font-mono font-bold text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900/30">
                      {challenger.ai_feasibility_score} / 100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
