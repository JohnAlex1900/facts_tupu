"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SummaryStats {
  active_red_flags: number;
  deviation_trend_mom: number;
  audited_frameworks: number;
}

interface SectorAnomaly {
  sector: string;
  anomalies: number;
}

// Update your interface in CorruptionWatch.tsx
interface PipelineLog {
  id: number;
  title: string;
  project: string;
  sector: string;
  status: "Critical" | "Investigation" | "Review Required";
  variance_bounds: string;
  risk_index: number;
  timestamp: string;
  news_source_url?: string; // New field for News API integration
  summary?: string; // New field for news excerpts
}

export default function CorruptionWatch({
  onSelectRepresentative,
}: {
  onSelectRepresentative: (id: number) => void;
}) {
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [sectors, setSectors] = useState<SectorAnomaly[]>([]);
  const [logs, setLogs] = useState<PipelineLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);

        const [summaryRes, sectorsRes, logsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/corruption-watch/summary"),
          fetch("http://127.0.0.1:8000/api/corruption-watch/sector-anomalies"),
          fetch("http://127.0.0.1:8000/api/corruption-watch/pipeline-logs"),
        ]);

        if (!summaryRes.ok || !sectorsRes.ok || !logsRes.ok) throw new Error();

        const summaryData = await summaryRes.json();
        const sectorsData = await sectorsRes.json();
        const logsData = await logsRes.json();

        setSummary(summaryData);
        setSectors(sectorsData);
        setLogs(logsData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching corruption watch data:", err.message);
        } else {
          console.error("Unknown error fetching corruption watch data.");
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500 font-semibold text-sm">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        Synchronizing anomaly tracking arrays...
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl m-6 bg-white p-6 shadow-sm">
        <ShieldAlert className="w-10 h-10 text-rose-500 mb-2" />
        Engine core failed to respond. Check backend server connection status.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Index Heading Title Unit */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Corruption Watch Index
            </h1>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Automated algorithmic discrepancy matrix for public funds
            distribution.
          </p>
        </div>
        <button className="px-4 py-2 bg-rose-600 text-white rounded-lg font-bold text-xs shadow hover:bg-rose-700 transition flex items-center gap-1.5">
          Export Watchlist <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Top Level Summary Statistics Metrics Row Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800 tracking-tight">
              {summary.active_red_flags}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Active Red Flags
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800 tracking-tight">
              +{summary.deviation_trend_mom}%
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Deviation Trend (MoM)
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <div className="w-6 h-6 border-2 border-blue-600 rounded-md flex items-center justify-center font-bold text-xs">
              🏛
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800 tracking-tight">
              {summary.audited_frameworks}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Audited Frameworks
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Sector Anomaly Map Engine Block */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Anomalies Detected By Sector
        </h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sectors}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="sector"
                tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip cursor={{ fill: "#f8fafc" }} />
              <Bar
                dataKey="anomalies"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Layout Pipeline Logs Stream Feed */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          High-Risk Pipeline Logs
        </h3>
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs text-slate-500 mt-0.5">
                  🏢
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-slate-800">
                      {log.title}
                    </h4>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        log.status === "Critical"
                          ? "bg-rose-50 text-rose-600 border border-rose-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    {log.project}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                    Sector: {log.sector} • {log.timestamp}
                  </p>

                  <a
                    href={log.news_source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline mt-2"
                  >
                    Read Source Report ↗
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-50">
                <div className="text-left sm:text-right">
                  <div className="text-xs font-black text-rose-600 tracking-tight">
                    {log.variance_bounds}
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Variance Bounds
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs font-black text-slate-700">
                    {log.risk_index}/100
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Risk Index
                  </div>
                </div>
                <button
                  onClick={() => onSelectRepresentative(log.id)}
                  className="p-1.5 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg transition text-slate-400 hover:text-slate-700 hidden sm:block"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
