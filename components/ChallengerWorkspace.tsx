"use client";

import React, { useState } from "react";

type ChallengerWorkspaceProps = {
  sessionData: {
    full_name?: string;
    target_role?: string;
    associated_id?: string;
    manifesto_summary?: string;
  };
  onLogout: () => void;
};

export default function ChallengerWorkspace({
  sessionData,
  onLogout,
}: ChallengerWorkspaceProps) {
  const [manifesto, setManifesto] = useState(
    sessionData?.manifesto_summary || "Baseline manifesto summary initialized.",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("ANALYTICS"); // ANALYTICS, STRATEGY, MODIFICATIONS

  const handleUpdateManifesto = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Manifesto updated across regional node registries successfully.");
    }, 1000);
  };

  // Mocked algorithmic metrics tailored for premium tracking tiers
  const analyticsMetrics = [
    {
      title: "Public Traction Velocity",
      value: "34.2%",
      trend: "+5.4% this week",
      color: "text-emerald-400",
    },
    {
      title: "AI Feasibility Index",
      value: "71 / 100",
      trend: "High Viability Threshold",
      color: "text-cyan-400",
    },
    {
      title: "Opponent Jaba Meter Deflection",
      value: "68%",
      trend: "Incumbent vulnerability rising",
      color: "text-amber-400",
    },
    {
      title: "Risk Radar Index (RVS)",
      value: "Low Risk",
      trend: "Stability baseline optimal",
      color: "text-indigo-400",
    },
  ];

  return (
    <div className="w-full max-w-6xl rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl backdrop-blur-sm animate-fadeIn overflow-hidden">
      {/* PRIVATE WORKSPACE BANNER */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-block rounded bg-black/30 px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-emerald-300 tracking-wider">
            Verified Challenger Terminal
          </span>
          <h2 className="text-xl font-black text-white tracking-tight mt-1 sm:text-2xl">
            {sessionData?.full_name || "Hon. Alternative Track Candidate"}
          </h2>
          <p className="text-xs text-slate-200">
            Target Seat Assignment:{" "}
            <span className="font-bold uppercase">
              {sessionData?.target_role || "MP"}
            </span>{" "}
            (ID Node: {sessionData?.associated_id || "Global"})
          </p>
        </div>

        <button
          onClick={onLogout}
          className="self-start sm:self-center rounded-lg bg-black/20 border border-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-black/40 transition"
        >
          Disconnect Terminal
        </button>
      </div>

      <div className="grid md:grid-cols-4 min-h-[500px]">
        {/* SIDE NAV PANEL */}
        <aside className="border-r border-slate-800 p-4 space-y-1 bg-slate-950/40">
          {[
            { id: "ANALYTICS", label: "Traction Analytics" },
            { id: "STRATEGY", label: "AI Strategy Advisor" },
            { id: "MODIFICATIONS", label: "Modify Platform Profile" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === tab.id
                  ? "bg-slate-800 text-emerald-400 border border-slate-700/50"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        {/* WORKSPACE MAIN DISPLAY BLOCK */}
        <main className="md:col-span-3 p-6 sm:p-8 bg-slate-900/20">
          {/* TAB 1: ADVANCED TRACKING ANALYTICS */}
          {activeTab === "ANALYTICS" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  Regional Performance Overview
                </h3>
                <p className="text-xs text-slate-400">
                  Algorithmic metrics analyzing voter indexing and campaign
                  trajectory.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {analyticsMetrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-sm"
                  >
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {metric.title}
                    </div>
                    <div
                      className={`mt-2 text-2xl font-mono font-black ${metric.color}`}
                    >
                      {metric.value}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400 font-medium">
                      {metric.trend}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/10 p-4 border-l-4 border-l-emerald-500">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Strategic Recommendation Matrix
                </h4>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  Your opponent&apos;s Jaba Meter score indicates high baseline
                  rhetorical activity with fading physical project delivery
                  indicators. Focus campaign communications heavily on
                  infrastructure accountability markers to scale your public
                  velocity tier.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: AI STRATEGY ADVISOR */}
          {activeTab === "STRATEGY" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  AI Campaign Copilot
                </h3>
                <p className="text-xs text-slate-400">
                  Generative insights targeted to current regional
                  socio-political friction parameters.
                </p>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                    Demographic Outreach Strategy
                  </span>
                  <p className="mt-1 text-xs text-slate-300">
                    High engagement probability identified within sub-regions.
                    Recommend deploying interactive digital community hubs to
                    gather citizen accountability scores.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    Optimal Policy Communication window
                  </span>
                  <p className="mt-1 text-xs text-slate-300">
                    Deploy policy declarations matching the local accountability
                    radar spikes between 06:00 UTC and 09:00 UTC for maximized
                    impact distribution.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANIFESTO & PROFILE CONFIGURATION */}
          {activeTab === "MODIFICATIONS" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  Modify Platform Registry
                </h3>
                <p className="text-xs text-slate-400">
                  Update the live data points showcased to users auditing the
                  public accountability wall.
                </p>
              </div>

              <form onSubmit={handleUpdateManifesto} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Live Manifesto Summary Dossier
                  </label>
                  <textarea
                    rows={6}
                    value={manifesto}
                    onChange={(e) => setManifesto(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-emerald-500 resize-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition disabled:opacity-50 shadow-md shadow-emerald-950"
                  >
                    {isSaving ? "Synchronizing Node..." : "Save Public Updates"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
