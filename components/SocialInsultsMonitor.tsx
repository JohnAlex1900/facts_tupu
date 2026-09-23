"use client";

import React, { useState, useEffect } from "react";

interface SocialStatement {
  platform: string;
  statement: string;
  context_or_target: string;
  severity: string;
  date_approx: string;
}

interface SocialInsultsMonitorProps {
  leaderName: string;
  leaderRole: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SocialInsultsMonitor({
  leaderName,
  leaderRole,
}: SocialInsultsMonitorProps) {
  const [insults, setInsults] = useState<SocialStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchInsults() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/monitor/social/insults?name=${encodeURIComponent(leaderName)}&role=${encodeURIComponent(leaderRole)}`,
          {
            headers: { "ngrok-skip-browser-warning": "true" },
          },
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setInsults(data.insults_found || []);
      } catch (err) {
        console.error("Failed to fetch social statements:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchInsults();
  }, [leaderName, leaderRole]);

  if (loading) {
    return (
      <div className="mt-6 rounded-xl border border-rose-900/30 bg-rose-950/10 p-5 w-full flex items-center justify-center shadow-inner">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-rose-500 border-t-transparent"></div>
        <span className="ml-3 text-xs text-rose-400 font-medium tracking-wide animate-pulse">
          Scanning social feeds for {leaderName}...
        </span>
      </div>
    );
  }

  if (error || insults.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/40 p-5 w-full text-center">
        <p className="text-xs text-slate-500">
          No verified negative public statements or insults detected in recent
          social footprints for this representative.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full">
      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-3 flex items-center gap-2">
        <span className="text-base">⚠️</span> Social Media Sentiment & Rhetoric
        Flags
      </h4>
      <div className="grid gap-3 sm:grid-cols-2">
        {insults.map((insult, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-rose-900/40 bg-rose-950/20 p-4 transition hover:bg-rose-950/40 hover:border-rose-800/60 shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold uppercase bg-rose-900/50 text-rose-300 px-2 py-0.5 rounded border border-rose-800/50">
                {insult.platform}
              </span>
              <span className="text-[10px] font-semibold text-rose-400/80">
                {insult.date_approx}
              </span>
            </div>

            <p className="text-sm font-medium text-slate-200 mt-2 mb-3 leading-relaxed italic">
              &quot;{insult.statement}&quot;
            </p>

            <div className="border-t border-rose-900/30 pt-2 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400">
                <strong className="text-slate-300">Target:</strong>{" "}
                {insult.context_or_target}
              </span>
              <span className="text-[10px] text-slate-400">
                <strong className="text-slate-300">Severity:</strong>{" "}
                <span
                  className={
                    insult.severity === "CRITICAL"
                      ? "text-red-400 font-bold"
                      : "text-amber-400 font-bold"
                  }
                >
                  {insult.severity}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
