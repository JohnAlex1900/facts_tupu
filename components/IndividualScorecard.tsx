"use client";

import React, { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface RubricScore {
  category_name: string;
  weight: number;
  score: number;
  evidence_snippets: string[];
  analysis_notes: string;
}

export interface RepresentativeEvaluation {
  representative_id: string;
  full_name: string;
  role: string;
  overall_score: number;
  party_affiliation: string;
  rubric_scores: RubricScore[];
  summary_verdict: string;
}

interface Challenger {
  challenger_id: string;
  full_name: string;
  public_traction_velocity: number;
  party_affiliation: string;
  ai_feasibility_score: number;
}

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
  office_mandate: string;
  talk_vs_action_justification: string[];
  legislative_delivery_justification: string[];
  developmental_delivery_justification: string[];
  risk_level_justification: string[];
}

interface Profile {
  id: string;
  seat_layer: string;
  name: string;
  county: string;
  role: string;
  party_affiliation: string;
  jaba_meter: number;
  impact_rating: number;
  rvs: number;
  challengers: Challenger[];
  ai_monitor_data?: AIDeepDiveMonitor;
  mandate_statement?: string;
}

interface IndividualScorecardProps {
  leader: Profile;
  onBack: () => void;
}

const playAccessibilityAudio = async (text: string) => {
  try {
    // Trim text safely below OpenAI's 4096 character limit
    const sanitizedText = text.slice(0, 4000);

    const res = await fetch(`${API_BASE_URL}/api/v1/accessibility/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text_content: sanitizedText }),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("TTS Endpoint Error:", errData);
      return;
    }

    const blob = await res.blob();
    const audio = new Audio(URL.createObjectURL(blob));
    await audio.play();
  } catch (error) {
    console.error("Audio playback error:", error);
  }
};

export default function IndividualScorecard({
  leader,
  onBack,
}: IndividualScorecardProps) {
  const [activeMetricTab, setActiveMetricTab] = useState<
    "talk" | "delivery" | "rubric" | "risk"
  >("rubric");

  const [evaluation, setEvaluation] = useState<RepresentativeEvaluation | null>(
    null,
  );
  const [evalLoading, setEvalLoading] = useState<boolean>(true);
  const [evalError, setEvalError] = useState<string | null>(null);

  // Reset scroll position to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch live constitutional evaluation matrix from engine_core API
  useEffect(() => {
    let isMounted = true;
    async function fetchEvaluation() {
      try {
        setEvalLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/api/v1/analytics/evaluate/${leader.id}`,
          {
            headers: { "ngrok-skip-browser-warning": "true" },
          },
        );
        if (!res.ok) {
          throw new Error("Failed to load official evaluation framework data.");
        }
        const data: RepresentativeEvaluation = await res.json();
        if (isMounted) {
          setEvaluation(data);
          setEvalError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setEvalError(
            (err as Error).message || "Error connecting to evaluation engine.",
          );
        }
      } finally {
        if (isMounted) setEvalLoading(false);
      }
    }

    fetchEvaluation();
    return () => {
      isMounted = false;
    };
  }, [leader.id]);

  const aiMonitor: AIDeepDiveMonitor = leader.ai_monitor_data || {
    action_plan_practicality: 88,
    unrealistic_promises_risk: 30,
    core_priorities: [
      { id: "01", title: "Open Budget Tracking & Public Dashboards" },
      { id: "02", title: "Digital Verification for Civic Services" },
      { id: "03", title: "Performance Standards for Local Projects" },
    ],
    leadership_matchup: { vulnerability_index: 50, performance_score: 60 },
    office_mandate:
      "Responsible for executing statutory leadership oversight, constitutional mandates, and managing regional resource allocations within their jurisdiction.",
    talk_vs_action_justification: [
      "Exaggerated project kickoff timelines for infrastructure expansions.",
      "Public platform statements flagged with 'Unverified Ground Evidence'.",
    ],
    legislative_delivery_justification: [
      "Sponsored structural policy compliance frameworks in plenary sessions.",
    ],
    developmental_delivery_justification: [
      "Successfully delivered primary health facilities within budget.",
    ],
    risk_level_justification: [
      "Audit disclosures flag pending transparency documentation.",
    ],
  };

  const isPenalized = evaluation?.summary_verdict.includes("PENALIZED");

  return (
    <div className="w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl animate-fadeIn">
      {/* TOP NAVIGATION HEADER */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-slate-300">
            Facts Tupu &bull; Constitutional Evaluation Framework
          </span>
        </div>
        <button
          onClick={onBack}
          className="shrink-0 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700"
        >
          ← Back to Feed
        </button>
      </div>

      <div className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-8">
        {/* LEADER MAIN IDENTITY BLOCK */}
        <div className="flex flex-col gap-6 bg-slate-950 p-5 sm:p-6 rounded-xl border border-slate-800/60 shadow-inner">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-1">
              <span className="inline-block px-3 py-1 rounded text-xs font-bold bg-slate-800 text-slate-300 uppercase tracking-wider">
                Current Leader ({leader.seat_layer})
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight pt-1">
                {leader.name}
              </h2>
              <p className="text-base sm:text-lg text-emerald-400 font-semibold">
                {leader.role} &bull;{" "}
                <span className="text-slate-400 font-normal">
                  {leader.county} County
                </span>
              </p>
            </div>

            {/* Add near the leader.name header */}
            <button
              onClick={() => {
                let text = `Detailed scorecard for ${leader.name}, ${leader.role}. `;
                text += `Official Mandate: ${aiMonitor.office_mandate || "No mandate provided."}. `;

                // 1. Overall Framework & Detailed Rubric Scores
                text += `Overall Constitutional Framework Score: ${evaluation?.overall_score ?? "0"} percent. `;
                text += `Verdict: ${evaluation?.summary_verdict || "Pending"}. `;

                if (
                  evaluation?.rubric_scores &&
                  evaluation.rubric_scores.length > 0
                ) {
                  text += `Here is the framework breakdown: `;
                  evaluation.rubric_scores.forEach((score) => {
                    text += `For ${score.category_name}, the score is ${score.score} percent. ${score.analysis_notes} `;
                  });
                }

                // 2. Jaba Index & Talk vs Action Justification
                text += `Jaba Index, measuring talk versus action, is at ${leader?.jaba_meter ?? "0"} percent. `;
                if (
                  aiMonitor.talk_vs_action_justification &&
                  aiMonitor.talk_vs_action_justification.length > 0
                ) {
                  text += `Justification for this index: ${aiMonitor.talk_vs_action_justification.join(" ")} `;
                }

                // 3. Risk Level & Audit Justification
                text += `Risk Level is evaluated at ${leader?.rvs ?? "0"} percent. `;
                if (
                  aiMonitor.risk_level_justification &&
                  aiMonitor.risk_level_justification.length > 0
                ) {
                  text += `Risk and audit justifications include: ${aiMonitor.risk_level_justification.join(" ")} `;
                }

                playAccessibilityAudio(text);
              }}
              className="ml-4 rounded-full bg-emerald-900/50 p-2 text-emerald-400 hover:bg-emerald-800 transition flex items-center gap-2"
              aria-label="Read full scorecard aloud"
            >
              <span className="text-xl">🔊</span> Listen
            </button>

            {/* INTERACTIVE METRICS TAB SELECTOR */}
            <div className="w-full lg:w-auto flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 overflow-x-auto">
              <button
                onClick={() => setActiveMetricTab("rubric")}
                className={`flex-1 min-w-[100px] p-2.5 rounded-lg transition-all duration-200 text-center ${
                  activeMetricTab === "rubric"
                    ? "bg-slate-950 border border-slate-700 shadow-md scale-105"
                    : "hover:bg-slate-800/50 border border-transparent"
                }`}
              >
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-tight">
                  Framework Score
                </span>
                <span className="block mt-1 font-mono text-xl sm:text-2xl font-black text-emerald-400">
                  {evalLoading
                    ? "..."
                    : `${evaluation?.overall_score ?? leader.impact_rating}%`}
                </span>
              </button>

              <button
                onClick={() => setActiveMetricTab("talk")}
                className={`flex-1 min-w-[100px] p-2.5 rounded-lg transition-all duration-200 text-center ${
                  activeMetricTab === "talk"
                    ? "bg-slate-950 border border-slate-700 shadow-md scale-105"
                    : "hover:bg-slate-800/50 border border-transparent"
                }`}
              >
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-tight">
                  Jaba Index
                </span>
                <span className="block mt-1 font-mono text-xl sm:text-2xl font-black text-amber-400">
                  {leader.jaba_meter}%
                </span>
              </button>

              <button
                onClick={() => setActiveMetricTab("risk")}
                className={`flex-1 min-w-[100px] p-2.5 rounded-lg transition-all duration-200 text-center ${
                  activeMetricTab === "risk"
                    ? "bg-slate-950 border border-slate-700 shadow-md scale-105"
                    : "hover:bg-slate-800/50 border border-transparent"
                }`}
              >
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-tight">
                  Risk Level
                </span>
                <span className="block mt-1 font-mono text-xl sm:text-2xl font-black text-rose-400">
                  {leader.rvs}%
                </span>
              </button>
            </div>
          </div>

          {/* VERDICT BANNER & AUDIT PENALTY NOTIFICATION */}
          {evaluation && (
            <div
              className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isPenalized
                  ? "bg-rose-950/40 border-rose-800/80 text-rose-200"
                  : "bg-emerald-950/30 border-emerald-800/60 text-emerald-200"
              }`}
            >
              <div className="space-y-1">
                <span className="font-extrabold uppercase text-xs sm:text-sm tracking-widest block opacity-90">
                  🏛️ Constitutional Framework Verdict
                </span>
                <p className="font-bold text-base sm:text-lg tracking-wide leading-snug">
                  {evaluation.summary_verdict}
                </p>
              </div>
              <div className="shrink-0 bg-slate-950/80 px-4 py-2 rounded-lg border border-slate-800 text-left sm:text-right">
                <span className="text-xs font-bold uppercase text-slate-400 block">
                  Office Standard
                </span>
                <span className="font-mono font-bold text-white text-base sm:text-lg">
                  {evaluation.role}
                </span>
              </div>
            </div>
          )}

          {/* Official Office Mandate Statement */}
          <div className="text-base sm:text-lg text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/60">
            <span className="font-bold uppercase text-xs sm:text-sm tracking-wider text-slate-400 block mb-1">
              ⚖️ Official Mandate Statement
            </span>
            {aiMonitor.office_mandate}
          </div>
        </div>

        {/* AI DEEP DIVE & FRAMEWORK SCORECARD SECTION */}
        <div className="grid gap-6 lg:grid-cols-2 items-start">
          {/* LEFT COLUMN: DYNAMIC METRIC JUSTIFICATION */}
          <div className="rounded-xl border border-slate-800/60 bg-slate-950 p-5 sm:p-6 flex flex-col h-full min-h-[380px]">
            <div className="border-b border-slate-800/60 pb-3 flex flex-wrap items-center justify-between gap-2 mb-4">
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-200">
                Evaluation Analytics & Citations
              </h3>
              <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                Selected: {activeMetricTab}
              </span>
            </div>

            <div className="flex-1 space-y-4">
              {/* RUBRIC TAB */}
              {activeMetricTab === "rubric" && (
                <div className="animate-fadeIn space-y-4">
                  {evalLoading && (
                    <div className="py-12 text-center">
                      <div className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                      <p className="text-base sm:text-lg text-slate-400 mt-3 font-medium">
                        Running constitutional evaluation algorithm...
                      </p>
                    </div>
                  )}

                  {evalError && (
                    <div className="p-4 rounded-lg bg-rose-950/30 border border-rose-900/60 text-base text-rose-300">
                      ⚠️ {evalError}
                    </div>
                  )}

                  {!evalLoading && evaluation && (
                    <div className="space-y-4">
                      {evaluation.rubric_scores.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2.5"
                        >
                          <div className="flex justify-between items-center text-base sm:text-lg font-bold text-slate-200">
                            <span>{item.category_name}</span>
                            <span className="font-mono text-emerald-400">
                              {item.score}%{" "}
                              <span className="text-xs sm:text-sm text-slate-400 font-normal">
                                (Weight: {Math.round(item.weight * 100)}%)
                              </span>
                            </span>
                          </div>

                          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{
                                width: `${Math.min(100, Math.max(0, item.score))}%`,
                              }}
                            />
                          </div>

                          <p className="text-sm sm:text-base text-slate-300 leading-relaxed italic pt-1">
                            {item.analysis_notes}
                          </p>

                          {item.evidence_snippets &&
                            item.evidence_snippets.length > 0 && (
                              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                                <span className="text-xs sm:text-sm font-bold uppercase text-cyan-400 block tracking-wider">
                                  Verified Statutory Evidence Sources:
                                </span>
                                {item.evidence_snippets.map((snip, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="text-sm sm:text-base text-slate-200 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-start gap-2 leading-relaxed"
                                  >
                                    <span className="text-cyan-400 text-base font-bold shrink-0 mt-0.5">
                                      📜
                                    </span>
                                    <span>{snip}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TALK VS ACTION TAB */}
              {activeMetricTab === "talk" && (
                <div className="animate-fadeIn space-y-3">
                  <span className="font-bold text-amber-400 text-base sm:text-lg block">
                    💬 Talk vs Action (Jaba Meter)
                  </span>
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed italic">
                    Measures political rhetoric and unverified promises versus
                    verified ground activity.
                  </p>
                  <div className="space-y-3 pt-2">
                    {aiMonitor.talk_vs_action_justification.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 items-start text-base sm:text-lg text-slate-200 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800"
                      >
                        <span className="text-amber-400 shrink-0 mt-0.5">
                          ⚠️
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RISK LEVEL TAB */}
              {activeMetricTab === "risk" && (
                <div className="animate-fadeIn space-y-3">
                  <span className="font-bold text-rose-400 text-base sm:text-lg block">
                    ⚠️ Risk Level & Audit Discrepancies
                  </span>
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed italic">
                    Rates management discrepancies, structural transparency
                    gaps, and Auditor-General report flags.
                  </p>
                  <div className="space-y-3 pt-2">
                    {aiMonitor.risk_level_justification.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 items-start text-base sm:text-lg text-slate-200 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800"
                      >
                        <span className="text-rose-400 shrink-0 mt-0.5">⊗</span>
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
            {/* Practicality Sliders */}
            <div className="rounded-xl border border-slate-800/60 bg-slate-950 p-5 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-base sm:text-lg font-bold text-slate-200">
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-400">📈</span> Action Plan
                    Practicality
                  </span>
                  <span className="text-emerald-400 font-mono text-lg sm:text-xl">
                    {aiMonitor.action_plan_practicality}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-1000"
                    style={{ width: `${aiMonitor.action_plan_practicality}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-base sm:text-lg font-bold text-slate-200">
                  <span className="flex items-center gap-2">
                    <span className="text-rose-400">📉</span> Exaggeration Risk
                  </span>
                  <span className="text-rose-400 font-mono text-lg sm:text-xl">
                    {aiMonitor.unrealistic_promises_risk}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-rose-500 transition-all duration-1000"
                    style={{ width: `${aiMonitor.unrealistic_promises_risk}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Core Priorities */}
            <div className="rounded-xl border border-slate-800/60 bg-slate-950 p-5 space-y-4">
              <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                📂 Core Focus Areas & Priorities
              </h4>
              <div className="space-y-3">
                {aiMonitor.core_priorities.map((priority) => (
                  <div
                    key={priority.id}
                    className="w-full text-left rounded-xl border border-slate-800 bg-slate-900 p-3.5 flex items-center gap-3 border-l-4 border-l-cyan-500"
                  >
                    <span className="text-base sm:text-lg font-mono font-black text-cyan-400 shrink-0">
                      {priority.id}.
                    </span>
                    <span className="text-base sm:text-lg font-medium text-slate-200">
                      {priority.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leadership Matchup */}
            <div className="rounded-xl border border-slate-800/60 bg-slate-950 p-5 space-y-4">
              <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-rose-400 flex items-center gap-2">
                🛡️ Current Leadership Matchup
              </h4>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-slate-300 text-base shrink-0">
                    👤
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-rose-400 block tracking-wider">
                      Incumbent
                    </span>
                    <span className="text-base sm:text-lg font-bold text-slate-100">
                      {leader.name}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-tight block">
                      Vulnerability Index
                    </span>
                    <span className="text-xl sm:text-2xl font-mono font-bold text-amber-400 mt-1 block">
                      {aiMonitor.leadership_matchup.vulnerability_index}%
                    </span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-tight block">
                      Performance Score
                    </span>
                    <span className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 mt-1 block">
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
            <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-200">
              Aspiring Challengers Eying This Position (
              {leader.challengers.length})
            </h3>
            <span className="text-xs sm:text-sm text-slate-400 italic bg-slate-950 px-3 py-1 rounded-full border border-slate-800 w-fit">
              Verified alternative options
            </span>
          </div>

          {leader.challengers.length === 0 ? (
            <div className="text-center py-8 bg-slate-950/40 border border-dashed border-slate-800 rounded-xl p-4">
              <p className="text-base sm:text-lg text-slate-400 italic">
                No alternative track competitors have registered for this
                leadership slot yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {leader.challengers.map((challenger) => (
                <div
                  key={challenger.challenger_id}
                  className="rounded-xl bg-slate-950 p-5 border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-200 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h4 className="text-base sm:text-lg font-bold text-slate-100">
                        {challenger.full_name}
                      </h4>
                      <span className="shrink-0 px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-900/40">
                        Growth: +{challenger.public_traction_velocity}%
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-400">
                      Party Group:{" "}
                      <span className="text-slate-200 font-semibold">
                        {challenger.party_affiliation}
                      </span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex justify-between items-center text-sm sm:text-base">
                    <span className="text-slate-400">
                      Community Suitability
                    </span>
                    <span className="font-mono font-bold text-cyan-400 bg-cyan-950/30 px-3 py-1 rounded-lg border border-cyan-900/30 text-base">
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
