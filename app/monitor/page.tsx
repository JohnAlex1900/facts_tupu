"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PropagandaAlert {
  id: string;
  politicianName: string;
  slug: string;
  tier: string;
  textStream: string;
  flaggedVectors: string[];
  severity: "HIGH" | "MEDIUM" | "NONE";
  riskDelta: number;
  timestamp: string;
  integrityScore: number;
  engagementScore: number;
  accountabilityScore: number;
}

interface WatchlistItem {
  id: string;
  name: string;
  risk_radar_index: number;
  accountabilityScore: number;
}

export default function LivePropagandaMonitor() {
  const [alerts, setAlerts] = useState<PropagandaAlert[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [systemError, setSystemError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLiveStream = async () => {
    try {
      const response = await fetch("/api/monitor");
      const data = await response.json();

      if (response.ok) {
        if (data.error) {
          setSystemError(data.error);
        } else {
          setSystemError(null);
          setAlerts(data.alerts);
          setWatchlist(data.watchlist);
        }
      } else {
        setSystemError(data.error || "Failed to parse streaming framework.");
      }
    } catch (err) {
      console.error("Error fetching live stream data:", err);
      setSystemError(
        "Cannot establish connection to local Next.js API router server.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loopInterval = setInterval(fetchLiveStream, 3000);
    return () => clearInterval(loopInterval);
  }, []);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return "bg-red-950/10 text-red-400 border-red-900/40 hover:border-red-800/60";
      case "MEDIUM":
        return "bg-amber-950/10 text-amber-400 border-amber-900/40 hover:border-amber-800/60";
      default:
        return "bg-zinc-950 border-zinc-900 text-zinc-100 hover:border-zinc-800";
    }
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="min-h-screen bg-black text-zinc-500 flex items-center justify-center font-mono text-xs tracking-widest">
        CONNECTING TO LIVE STREAM PIPELINE...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 md:p-12">
      <div className="mb-10 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <h1 className="text-3xl font-bold tracking-tight">
            Propaganda Live Monitor
          </h1>
        </div>
        <p className="text-zinc-400 max-w-2xl text-sm">
          Real-time computational analysis of digital public statements across
          the 13th Parliament layout.
        </p>
      </div>

      {systemError && (
        <div className="mb-8 p-4 bg-zinc-950 border border-amber-500/30 rounded-xl text-amber-400 text-sm font-mono flex flex-col gap-1">
          <span className="font-bold uppercase tracking-wider text-xs text-amber-500">
            ⚠️ System Pipeline Notice:
          </span>
          <span>{systemError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN FEED STREAM */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">
            Real-Time Ingestion Stream
          </h2>

          {alerts.length === 0 && !systemError && (
            <div className="p-8 text-center border border-zinc-900 rounded-xl text-zinc-600 font-mono text-sm">
              Stream connected. Waiting for new statements to be processed...
            </div>
          )}

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className={`p-5 rounded-xl border transition-colors backdrop-blur-md ${getSeverityStyles(alert.severity)}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-white tracking-tight">
                        {alert.politicianName}
                      </h3>
                      <p className="text-xs tracking-wider opacity-60 uppercase font-semibold">
                        {alert.tier.replace("_", " ")}
                      </p>
                    </div>

                    {/* REPRESENTATIVE DATA METRICS PANEL */}
                    <div className="flex gap-2 text-[10px] font-mono bg-black/40 border border-zinc-800/60 rounded-lg p-2">
                      <div className="px-1.5 border-r border-zinc-800">
                        <span className="text-zinc-500 block text-right uppercase">
                          Accountability
                        </span>
                        <span className="text-white font-bold block text-right text-xs">
                          {alert.accountabilityScore}%
                        </span>
                      </div>
                      <div className="px-1.5 border-r border-zinc-800">
                        <span className="text-zinc-500 block text-right uppercase">
                          Integrity
                        </span>
                        <span className="text-emerald-400 font-bold block text-right text-xs">
                          {alert.integrityScore}%
                        </span>
                      </div>
                      <div className="px-1.5">
                        <span className="text-zinc-500 block text-right uppercase">
                          Engagement
                        </span>
                        <span className="text-blue-400 font-bold block text-right text-xs">
                          {alert.engagementScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm font-mono leading-relaxed opacity-90 border-l-2 border-zinc-700 pl-3 my-4 italic text-zinc-300">
                    &quot;{alert.textStream}&quot;
                  </p>

                  {alert.flaggedVectors.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 items-center">
                      {alert.flaggedVectors.map((v, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* SIDEBAR RADAR WATCHLIST */}
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">
              Risk Radar Watchlist
            </h3>
            <div className="space-y-3">
              {watchlist.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm border-b border-zinc-900 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <span className="text-zinc-200 font-medium block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">
                      Core Score: {item.accountabilityScore}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-red-400 font-mono font-bold text-xs">
                      Index: {item.risk_radar_index}
                    </span>
                  </div>
                </div>
              ))}
              {watchlist.length === 0 && (
                <span className="text-xs text-zinc-600 font-mono block">
                  No records synchronized.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
