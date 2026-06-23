"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  X,
  TrendingUp,
  HelpCircle,
} from "lucide-react";
import Image from "next/image";

interface ScorecardDetails {
  jaba_meter: number; // Misinformation index
  accountability: number; // Integrity score
  overall: number;
  promises_made: number;
  promises_fulfilled: number;
  social_propaganda_news: string[];
  recent_achievements: string[];
}

interface CandidateEntity {
  id: string;
  name: string;
  role: string; // 'Incumbent' | 'Challenger'
  tier: "FREE" | "PREMIUM_VERIFIED";
  avatar: string;
  scorecard: ScorecardDetails;
}

interface MatchupSlot {
  seat_name: string;
  seat_code: string;
  incumbent: CandidateEntity;
  opponents: CandidateEntity[];
  ai_recommendation: string;
}

export default function PlatformDashboard() {
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateEntity | null>(null);

  // Mocked state simulating data hydration from `/api/v1/challengers/seat/` paths
  const matchupData: MatchupSlot[] = [
    {
      seat_name: "Nairobi County Gubernatorial Seat",
      seat_code: "COUNTY-GOV-47",
      ai_recommendation:
        "Premium Challenger Silas Kiprop shows an accountability efficiency score +24% higher than the current occupant, driven by verified engineering milestones and an untainted asset portfolio.",
      incumbent: {
        id: "inc-901",
        name: "Hon. Arthur Sakaja",
        role: "Incumbent",
        tier: "FREE",
        avatar:
          "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=200",
        scorecard: {
          jaba_meter: 72,
          accountability: 41,
          overall: 48,
          promises_made: 34,
          promises_fulfilled: 8,
          social_propaganda_news: [
            "Unverified assertions regarding automated inner-city revenue collection pipelines.",
            "Contradictory claims mapping stadium rehabilitation expenditure reports.",
          ],
          recent_achievements: [
            "Successfully initiated early school feeding logistics channels across core sub-counties.",
          ],
        },
      },
      opponents: [
        {
          id: "chal-204",
          name: "Silas Kiprop, PE",
          role: "Challenger",
          tier: "PREMIUM_VERIFIED",
          avatar:
            "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200",
          scorecard: {
            jaba_meter: 12,
            accountability: 89,
            overall: 86,
            promises_made: 12,
            promises_fulfilled: 11,
            social_propaganda_news: [
              "Falsely accused of zoning permit collusion; fully cleared by subsequent audit reports.",
            ],
            recent_achievements: [
              "Engineered high-efficiency solar water infrastructure networks serving over 40,000 residents in informal layouts.",
              "Maintained perfect execution milestones on private civil works for a decade.",
            ],
          },
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 selection:bg-emerald-500 selection:text-slate-950">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Upper Title Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900 pb-6 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              FACTS TUPU{" "}
              <span className="text-xs bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20">
                V4 CORE
              </span>
            </h1>
            <p className="text-sm text-slate-400">
              Competitive Accountability Matrix & Premium Candidate Verification
              Flow
            </p>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-300 font-mono">
              Premium Matching Engine Active
            </span>
          </div>
        </header>

        {/* Competitive Race Layout Grid */}
        <section className="space-y-6">
          {matchupData.map((race) => (
            <div
              key={race.seat_code}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6"
            >
              {/* Jurisdiction Metadata Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/60 pb-4 gap-2">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {race.seat_name}
                  </h2>
                  <span className="text-xs font-mono text-slate-500">
                    ID System Node: {race.seat_code}
                  </span>
                </div>
                <div className="bg-slate-950/60 text-xs px-3 py-1.5 rounded-lg border border-slate-800 max-w-md text-emerald-400 font-mono flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed text-slate-300">
                    <strong className="text-emerald-400">
                      Auto-Recommendation:
                    </strong>{" "}
                    {race.ai_recommendation}
                  </span>
                </div>
              </div>

              {/* Head-to-Head Comparison Split Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                {/* Left Split Panel: Sitting Incumbent Entity Card */}
                <div
                  onClick={() => setSelectedCandidate(race.incumbent)}
                  className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition cursor-pointer flex items-center justify-between group relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      width={56}
                      height={56}
                      src={race.incumbent.avatar}
                      alt={race.incumbent.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-800"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono tracking-wider font-bold uppercase bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20">
                          {race.incumbent.role}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1 group-hover:text-emerald-400 transition">
                        {race.incumbent.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        Accountability Score:{" "}
                        {race.incumbent.scorecard.accountability}%
                      </p>
                    </div>
                  </div>

                  {/* High Density Metric Ring */}
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                        Jaba Meter
                      </span>
                      <span className="text-lg font-black text-rose-500 font-mono">
                        {race.incumbent.scorecard.jaba_meter}%
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition" />
                  </div>
                </div>

                {/* Right Split Panel: Premium Verified Challenger Entity Card */}
                {race.opponents.map((opponent) => (
                  <div
                    key={opponent.id}
                    onClick={() => setSelectedCandidate(opponent)}
                    className="bg-slate-950/40 border-2 border-emerald-500/20 rounded-xl p-5 hover:border-emerald-500/40 transition cursor-pointer flex items-center justify-between group relative overflow-hidden bg-gradient-to-br from-slate-950 to-emerald-950/10"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        width={56}
                        height={56}
                        src={opponent.avatar}
                        alt={opponent.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-800"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono tracking-wider font-bold uppercase bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-400/30">
                            Verified Contender
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1 group-hover:text-emerald-400 transition">
                          {opponent.name}
                        </h3>
                        <p className="text-xs text-emerald-400/80 font-mono">
                          Accountability Score:{" "}
                          {opponent.scorecard.accountability}%
                        </p>
                      </div>
                    </div>

                    {/* High Density Metric Ring */}
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                          Jaba Meter
                        </span>
                        <span className="text-lg font-black text-emerald-400 font-mono">
                          {opponent.scorecard.jaba_meter}%
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Detailed Comprehensive Analytics Side Panel Drawer Modal */}
        <AnimatePresence>
          {selectedCandidate && (
            <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
              {/* Dismiss Shield Click Area */}
              <div
                className="absolute inset-0"
                onClick={() => setSelectedCandidate(null)}
              />

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto h-full space-y-6 shadow-2xl"
              >
                {/* Drawer Close Actions */}
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
                    Verification Ledger Output
                  </span>
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Candidate Overview Presentation Block */}
                <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
                  <Image
                    width={64}
                    height={64}
                    src={selectedCandidate.avatar}
                    alt={selectedCandidate.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-800"
                  />
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight">
                      {selectedCandidate.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {selectedCandidate.role} Status Node
                    </p>
                  </div>
                </div>

                {/* Granular Multi-Vector Metrics Readout */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                      Accountability
                    </span>
                    <p className="text-xl font-mono font-black text-white mt-1">
                      {selectedCandidate.scorecard.accountability}%
                    </p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                      Jaba Meter
                    </span>
                    <p className="text-xl font-mono font-black text-rose-500 mt-1">
                      {selectedCandidate.scorecard.jaba_meter}%
                    </p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                      Overall Rating
                    </span>
                    <p className="text-xl font-mono font-black text-emerald-400 mt-1">
                      {selectedCandidate.scorecard.overall}%
                    </p>
                  </div>
                </div>

                {/* Platform Promise Fulfillment Split Metrics */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-around text-xs font-mono">
                  <div className="text-center">
                    <span className="text-slate-500 block">
                      Tracked Promises
                    </span>
                    <span className="text-base font-bold text-slate-300 mt-0.5 block">
                      {selectedCandidate.scorecard.promises_made}
                    </span>
                  </div>
                  <div className="w-px bg-slate-800 self-stretch" />
                  <div className="text-center">
                    <span className="text-emerald-400 block">
                      Fulfilled Pillars
                    </span>
                    <span className="text-base font-bold text-emerald-400 mt-0.5 block">
                      {selectedCandidate.scorecard.promises_fulfilled}
                    </span>
                  </div>
                  <div className="w-px bg-slate-800 self-stretch" />
                  <div className="text-center">
                    <span className="text-rose-400 block">
                      Unfulfilled Deficits
                    </span>
                    <span className="text-base font-bold text-rose-400 mt-0.5 block">
                      {selectedCandidate.scorecard.promises_made -
                        selectedCandidate.scorecard.promises_fulfilled}
                    </span>
                  </div>
                </div>

                {/* Sub-Section Array 1: Tracked Misinformation/Propaganda Stream */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Flagged Propaganda & Structural Contradictions</span>
                  </h4>
                  <div className="space-y-1.5">
                    {selectedCandidate.scorecard.social_propaganda_news.map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="bg-rose-950/10 border border-rose-500/10 text-rose-300/90 text-xs p-3 rounded-lg leading-relaxed"
                        >
                          {item}
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Sub-Section Array 2: Verified Historical Achievements */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified Structural Achievements</span>
                  </h4>
                  <div className="space-y-1.5">
                    {selectedCandidate.scorecard.recent_achievements.map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="bg-emerald-950/10 border border-emerald-500/10 text-emerald-300/90 text-xs p-3 rounded-lg leading-relaxed"
                        >
                          {item}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
