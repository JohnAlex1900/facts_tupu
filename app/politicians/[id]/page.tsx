"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  usePoliticianCompliance,
  AuditedVote,
} from "@/hooks/usePoliticianCompliance";

export default function PoliticianProfilePage() {
  const { id } = useParams() as { id: string };
  const { data, isLoading, isError } = usePoliticianCompliance(id);
  const [expandedVoteId, setExpandedVoteId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6 animate-pulse">
        <div className="h-24 bg-slate-800 rounded-xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-slate-800 rounded-xl"></div>
          <div className="md:col-span-2 h-96 bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <div className="p-4 bg-red-950/40 border border-red-900 text-red-400 rounded-xl">
          Error sourcing live legislative telemetry streams for Representative
          code: {id}
        </div>
      </div>
    );
  }

  const score = data.aggregate_manifesto_alignment_index;

  return (
    <div className="max-w-6xl mx-auto p-6 text-slate-100">
      {/* 1. Executive Status Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">
            Core Audit Ledger Profile
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-white">
            ID Signature Ref: {data.representative_id}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Verified Legislative Activity Tracked System-wide
          </p>
        </div>

        {/* Dynamic Color Gauge Assignment */}
        <div className="flex items-center gap-4 bg-slate-950 px-4 py-3 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">
              Manifesto Alignment
            </span>
            <span
              className={`text-2xl font-bold font-mono ${score >= 75 ? "text-green-400" : score >= 45 ? "text-yellow-400" : "text-red-400"}`}
            >
              {score}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Analytical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Metric Summary Column */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-300 uppercase font-mono tracking-wider mb-4">
              Efficacy Breakdown
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 block">
                  Audited Vote Events
                </span>
                <span className="text-xl font-bold text-white font-mono">
                  {data.audited_records.length}
                </span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 block">
                  Current Risk Vector Status
                </span>
                <span
                  className={`text-sm font-bold font-mono ${score < 50 ? "text-red-400" : "text-green-400"}`}
                >
                  {score < 50
                    ? "CRITICAL COMPLIANCE DRIFT"
                    : "WITHIN STABLE MARGINS"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Timeline List Column */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold tracking-tight text-white mb-2">
            Historical Floor Audit Ledger
          </h3>

          {data.audited_records.length === 0 ? (
            <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-2xl text-center text-slate-500 text-sm font-mono">
              Zero recorded floor alignment events currently logged for this
              profile target.
            </div>
          ) : (
            <div className="space-y-3">
              {data.audited_records.map((vote: AuditedVote) => {
                const isExpanded = expandedVoteId === vote.vote_id;

                return (
                  <div
                    key={vote.vote_id}
                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-colors hover:border-slate-700"
                  >
                    {/* Header Bar Row - Toggle Target */}
                    <div
                      onClick={() =>
                        setExpandedVoteId(isExpanded ? null : vote.vote_id)
                      }
                      className="p-4 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                            {vote.bill_category}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {new Date(vote.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm text-slate-200 truncate">
                          {vote.bill_title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right">
                          <span
                            className={`text-xs font-bold font-mono px-2 py-1 rounded ${
                              vote.vote_cast === "YES"
                                ? "bg-green-950 text-green-400"
                                : "bg-red-950 text-red-400"
                            }`}
                          >
                            VOTED {vote.vote_cast}
                          </span>
                        </div>
                        <div className="text-center w-12">
                          <span className="text-[9px] text-slate-500 block font-mono">
                            Match
                          </span>
                          <span
                            className={`text-xs font-mono font-bold ${vote.alignment_score >= 70 ? "text-green-400" : "text-red-400"}`}
                          >
                            {vote.alignment_score}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expandable AI Context Panel */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-slate-950 bg-slate-950/60"
                        >
                          <div className="p-4 text-xs text-slate-300 leading-relaxed font-sans border-l-2 border-amber-500 m-3 bg-slate-950 rounded">
                            <span className="block font-mono text-[10px] text-amber-500 uppercase font-semibold mb-1">
                              System AI Forensic Audit Rationale:
                            </span>
                            {vote.ai_alignment_rationale}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
