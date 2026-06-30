"use client";

import React from "react";

interface Challenger {
  challenger_id: string;
  full_name: string;
  public_traction_velocity: number;
  party_affiliation: string;
  ai_feasibility_score: number;
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
}

interface IndividualScorecardProps {
  leader: Profile;
  onBack: () => void;
}

export default function IndividualScorecard({
  leader,
  onBack,
}: IndividualScorecardProps) {
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-950 p-6 rounded-xl border border-slate-800/60">
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

          {/* PRIMARY METRICS SUMMARY */}
          <div className="w-full md:w-auto grid grid-cols-3 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 min-w-[280px] sm:min-w-[320px]">
            <div className="text-center">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                Talk vs Action
              </span>
              <span className="block mt-1 font-mono text-lg font-black text-amber-400">
                {leader.jaba_meter}%
              </span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                Delivery Score
              </span>
              <span className="block mt-1 font-mono text-lg font-black text-cyan-400">
                {leader.impact_rating}
              </span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                Risk Level
              </span>
              <span className="block mt-1 font-mono text-lg font-black text-rose-400">
                {leader.rvs}
              </span>
            </div>
          </div>
        </div>

        {/* METRIC INTERPRETATION GUIDE */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Score Explanations
          </h3>
          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/50">
              <span className="font-bold text-amber-400 block mb-1">
                💬 Talk vs Action (Jaba Meter)
              </span>
              Measures how much time a leader spends on political rhetoric or
              unverified promises versus verified development steps on the
              ground. Higher means more talk.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/50">
              <span className="font-bold text-cyan-400 block mb-1">
                🏗️ Delivery Score
              </span>
              Calculated straight from real infrastructure projects, budget
              spending, and public services successfully completed within their
              area. Higher means better results.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/50">
              <span className="font-bold text-rose-400 block mb-1">
                ⚠️ Risk Level
              </span>
              Rates management discrepancies, structural transparency gaps, or
              missing budget audit reports. Lower means cleaner, more
              accountable leadership.
            </div>
          </div>
        </div>

        {/* COMPETING CHALLENGERS PROFILE TRACK */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Aspiring Challengers Eying This Position (
              {leader.challengers.length})
            </h3>
            <span className="text-[11px] text-slate-500 italic">
              Verified alternative options
            </span>
          </div>

          {leader.challengers.length === 0 ? (
            <div className="text-center py-8 bg-slate-950/20 border border-dashed border-slate-800 rounded-xl">
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
                    <span className="font-mono font-bold text-amber-400">
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
