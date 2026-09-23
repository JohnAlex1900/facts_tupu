"use client";

import { useState } from "react";
import {
  User,
  ShieldCheck,
  Zap,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  X,
} from "lucide-react";

interface LeaderEntity {
  id: string;
  name: string;
  age: number;
  type: "INCUMBENT" | "ASPIRANT";
  role_title: string;
  county: string;
  constituency: string;
  metric_primary: number; // Impact Score for Incumbents, Potential Index for Chipukizi
  jaba_or_integrity: number; // Jaba Score for Incumbents, Clean Slate Rating for Chipukizi
  sub_metrics: {
    label_a: string;
    value_a: number;
    label_b: string;
    value_b: number;
    label_c: string;
    value_c: number;
  };
  community_footprint: string;
}

export default function ChipukiziComparisonPage() {
  const [selectedIncumbent, setSelectedIncumbent] =
    useState<LeaderEntity | null>(null);
  const [selectedAspirant, setSelectedAspirant] = useState<LeaderEntity | null>(
    null,
  );

  // Mapped pools matching the Cascading Regional Hierarchy data nodes
  const [pool] = useState<LeaderEntity[]>([
    {
      id: "INC-101",
      name: "Hon. Fredrick Kipkorir",
      age: 54,
      type: "INCUMBENT",
      role_title: "Incumbent MP",
      county: "Nairobi",
      constituency: "Lang'ata",
      metric_primary: 41,
      jaba_or_integrity: 78, // High Jaba score
      sub_metrics: {
        label_a: "Legislation (Floor Attendance)",
        value_a: 52,
        label_b: "Fiduciary Duty (CoB Audit)",
        value_b: 19,
        label_c: "Project Fidelity (Satellites)",
        value_c: 35,
      },
      community_footprint:
        "Flagged by Auditor General for KES 32M unexplained secondary school infrastructure disbursements.",
    },
    {
      id: "ASP-201",
      name: "Mwangi &ldquo;Chipukizi&rdquo; Maina",
      age: 27,
      type: "ASPIRANT",
      role_title: "Youth Tech-Hub Organizer",
      county: "Nairobi",
      constituency: "Lang'ata",
      metric_primary: 84,
      jaba_or_integrity: 98, // High Clean Slate score
      sub_metrics: {
        label_a: "Civic Traces (Baraza Count)",
        value_a: 89,
        label_b: "Sector Impact (Local Access)",
        value_b: 76,
        label_c: "Clean Slate (EACC Clearances)",
        value_c: 100,
      },
      community_footprint:
        "Led the grassroots digital literacy training labs across four Lang'ata informal settlement wings.",
    },
    {
      id: "INC-102",
      name: "Hon. Beatrice Atieno",
      age: 49,
      type: "INCUMBENT",
      role_title: "Incumbent MP",
      county: "Kisumu",
      constituency: "Kisumu Central",
      metric_primary: 58,
      jaba_or_integrity: 42,
      sub_metrics: {
        label_a: "Legislation (Floor Attendance)",
        value_a: 65,
        label_b: "Fiduciary Duty (CoB Audit)",
        value_b: 48,
        label_c: "Project Fidelity (Satellites)",
        value_c: 60,
      },
      community_footprint:
        "Moderate infrastructure output offset by recurring alignment discrepancies on macro fiscal policy votes.",
    },
    {
      id: "ASP-202",
      name: "Amina Yusuf Kassim",
      age: 31,
      type: "ASPIRANT",
      role_title: "Human Rights & Legal Advocate",
      county: "Kisumu",
      constituency: "Kisumu Central",
      metric_primary: 79,
      jaba_or_integrity: 95,
      sub_metrics: {
        label_a: "Civic Traces (Baraza Count)",
        value_a: 72,
        label_b: "Sector Impact (Local Access)",
        value_b: 85,
        label_c: "Clean Slate (EACC Clearances)",
        value_c: 95,
      },
      community_footprint:
        "Coordinated pro-bono defense counsels protecting small-scale market traders from predatory county levy closures.",
    },
  ]);

  const incumbentsList = pool.filter((e) => e.type === "INCUMBENT");
  const aspirantsList = pool.filter((e) => e.type === "ASPIRANT");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Module Brand Header */}
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase">
            Step 6 Electoral Decision Engine
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            Chipukizi (Rising Stars) Head-to-Head
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Contrasting political incumbents directly against certified young
            aspirants (18–35) using verified local civic traces.
          </p>
        </div>

        {/* Workspace Splitting Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Control Bank: Pickers */}
          <div className="space-y-4 lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-red-500" /> 1. Select
                Incumbent
              </h2>
              <div className="space-y-2">
                {incumbentsList.map((inc) => (
                  <button
                    key={inc.id}
                    onClick={() => setSelectedIncumbent(inc)}
                    className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all block cursor-pointer ${
                      selectedIncumbent?.id === inc.id
                        ? "bg-red-950/30 border-red-500 text-white"
                        : "bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="font-bold truncate">{inc.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {inc.constituency} ({inc.county})
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> 2. Select Chipukizi
              </h2>
              <div className="space-y-2">
                {aspirantsList.map((asp) => (
                  <button
                    key={asp.id}
                    onClick={() => setSelectedAspirant(asp)}
                    className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all block cursor-pointer ${
                      selectedAspirant?.id === asp.id
                        ? "bg-amber-950/30 border-amber-500 text-white"
                        : "bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="font-bold truncate">{asp.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {asp.constituency} ({asp.county})
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Main Panel: The Active Sandbox Slot Matrix */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[500px]">
            {/* Dynamic Comparison Slot Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Central Structural Comparison Indicator Vector */}
              <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none z-10">
                <div className="w-9 h-9 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center shadow-xl">
                  <ArrowRightLeft className="w-4 h-4 text-amber-500" />
                </div>
              </div>

              {/* Box A: The Incumbent Segment */}
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 flex flex-col justify-between min-h-[380px]">
                {selectedIncumbent ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-900/60 px-2 py-0.5 rounded">
                          {selectedIncumbent.role_title}
                        </span>
                        <h3 className="text-lg font-black text-white mt-2 tracking-tight">
                          {selectedIncumbent.name}
                        </h3>
                        <p className="text-xs font-mono text-slate-500">
                          Age Status: {selectedIncumbent.age}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedIncumbent(null)}
                        className="text-slate-600 hover:text-slate-400 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Performance Core Telemetry Indices */}
                    <div className="space-y-3 font-mono text-xs pt-3 border-t border-slate-900">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400">
                            Composite Impact Rating
                          </span>
                          <strong className="text-slate-200">
                            {selectedIncumbent.metric_primary}/100
                          </strong>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-red-500 h-full"
                            style={{
                              width: `${selectedIncumbent.metric_primary}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400">
                            Propaganda Metric (Jaba Meter)
                          </span>
                          <strong className="text-red-400">
                            {selectedIncumbent.jaba_or_integrity}%
                          </strong>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-red-500 h-full"
                            style={{
                              width: `${selectedIncumbent.jaba_or_integrity}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Itemized Sub-Matrices */}
                      <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-900 space-y-2 text-[11px] text-slate-400">
                        <div className="flex justify-between">
                          <span>{selectedIncumbent.sub_metrics.label_a}</span>
                          <strong className="text-slate-300">
                            {selectedIncumbent.sub_metrics.value_a}%
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>{selectedIncumbent.sub_metrics.label_b}</span>
                          <strong className="text-slate-300">
                            {selectedIncumbent.sub_metrics.value_b}%
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>{selectedIncumbent.sub_metrics.label_c}</span>
                          <strong className="text-slate-300">
                            {selectedIncumbent.sub_metrics.value_c}%
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center my-auto p-4 space-y-2">
                    <User className="w-8 h-8 text-slate-700 stroke-1" />
                    <p className="text-xs font-mono text-slate-500">
                      Click an incumbent candidate on the left tracking dock to
                      initialize comparison matrix.
                    </p>
                  </div>
                )}

                {selectedIncumbent && (
                  <div className="text-[11px] font-sans text-rose-300/90 bg-rose-950/10 border border-rose-900/30 p-2.5 rounded-lg mt-4 flex gap-1.5 items-start">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">
                      {selectedIncumbent.community_footprint}
                    </span>
                  </div>
                )}
              </div>

              {/* Box B: The Chipukizi Segment */}
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 flex flex-col justify-between min-h-[380px]">
                {selectedAspirant ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-900/60 px-2 py-0.5 rounded">
                          {selectedAspirant.role_title}
                        </span>
                        <h3 className="text-lg font-black text-white mt-2 tracking-tight">
                          {selectedAspirant.name}
                        </h3>
                        <p className="text-xs font-mono text-slate-500">
                          Age Status: {selectedAspirant.age} (Chipukizi Scope)
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedAspirant(null)}
                        className="text-slate-600 hover:text-slate-400 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Potential Core Telemetry Indices */}
                    <div className="space-y-3 font-mono text-xs pt-3 border-t border-slate-900">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400">
                            Potential Readiness Index
                          </span>
                          <strong className="text-amber-400">
                            {selectedAspirant.metric_primary}/100
                          </strong>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full"
                            style={{
                              width: `${selectedAspirant.metric_primary}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400">
                            Clean Slate Integrity Record
                          </span>
                          <strong className="text-emerald-400">
                            {selectedAspirant.jaba_or_integrity}%
                          </strong>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-400 h-full"
                            style={{
                              width: `${selectedAspirant.jaba_or_integrity}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Itemized Sub-Matrices */}
                      <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-900 space-y-2 text-[11px] text-slate-400">
                        <div className="flex justify-between">
                          <span>{selectedAspirant.sub_metrics.label_a}</span>
                          <strong className="text-slate-300">
                            {selectedAspirant.sub_metrics.value_a}%
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>{selectedAspirant.sub_metrics.label_b}</span>
                          <strong className="text-slate-300">
                            {selectedAspirant.sub_metrics.value_b}%
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>{selectedAspirant.sub_metrics.label_c}</span>
                          <strong className="text-slate-300">
                            {selectedAspirant.sub_metrics.value_c}%
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center my-auto p-4 space-y-2">
                    <User className="w-8 h-8 text-slate-700 stroke-1" />
                    <p className="text-xs font-mono text-slate-500">
                      Click a verified Chipukizi leader card from the options
                      panel to activate head-to-head metrics.
                    </p>
                  </div>
                )}

                {selectedAspirant && (
                  <div className="text-[11px] font-sans text-emerald-300/90 bg-emerald-950/10 border border-emerald-900/30 p-2.5 rounded-lg mt-4 flex gap-1.5 items-start">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">
                      {selectedAspirant.community_footprint}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Insight Footer Card (Triggered when both targets are active) */}
            {selectedIncumbent && selectedAspirant && (
              <div className="mt-6 p-4 bg-slate-950 border border-slate-850 rounded-xl text-xs font-mono space-y-1.5">
                <div className="text-slate-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />{" "}
                  Comparative Synthesis Breakdown
                </div>
                <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
                  While the Incumbent displays lower financial management
                  capabilities due to recent budget reconciliation mismatches,
                  the selected Chipukizi contender yields high civic engagement
                  markers combined with a full 100% integrity baseline record.
                  This profile delta represents a significant opportunity for
                  structural governance updates in the upcoming constituency
                  cycle.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
