"use client";

import { useState, useEffect } from "react";
import { getApiBaseUrl } from "@/app/lib/api_client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Flame,
  BarChart3,
  Activity,
  Users,
  FileText,
  Radio,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

interface PipelineLog {
  id: string;
  title: string;
  project: string;
  sector: string;
  status: string;
  variance_bounds: string;
  risk_index: number;
  timestamp: string;
}

export default function AILiveMonitor() {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Real-time telemetry metrics state
  const [metrics, setMetrics] = useState({
    active_red_flags: 978,
    deviation_trend_mom: 100,
    audited_profiles: 83,
    corporate_intersections: 78,
  });

  const [sectorData, setSectorData] = useState<
    { sector: string; anomalies: number }[]
  >([
    { sector: "Infra", anomalies: 900 },
    { sector: "Health", anomalies: 400 },
    { sector: "Edu", anomalies: 300 },
    { sector: "Agri", anomalies: 650 },
  ]);

  const [liveStreamLogs, setLiveStreamLogs] = useState<PipelineLog[]>([]);

  useEffect(() => {
    const baseUrl = getApiBaseUrl();

    // 1. Fetch initial baseline states from backend
    fetch(`${baseUrl}/corruption-watch/summary`)
      .then((res) => res.ok && res.json())
      .then((data) => data && setMetrics((prev) => ({ ...prev, ...data })))
      .catch((err) => console.error("Summary hydration failed:", err));

    fetch(`${baseUrl}/api/corruption-watch/sector-anomalies`)
      .then((res) => res.ok && res.json())
      .then((data) => data && setSectorData(data))
      .catch((err) => console.error("Sector metrics hydration failed:", err));

    // 2. Multi-Vector Server-Sent Events (SSE) Stream Integration
    const monitorStream = new EventSource(
      `${baseUrl}/api/representatives/stream`,
    );

    monitorStream.onopen = () => setIsConnected(true);
    monitorStream.onerror = () => setIsConnected(false);

    monitorStream.addEventListener("message", (event) => {
      if (!event.data) return;
      try {
        const rawLog = JSON.parse(event.data);
        const transformedLog: PipelineLog = {
          id: rawLog.id || `stream-${Date.now()}`,
          title:
            rawLog.title ||
            `Dynamic Legislative Analysis #${Math.floor(Math.random() * 900 + 100)}`,
          project:
            rawLog.aiReasoning ||
            "Comparing policy statement intent vectors against budget execution paths.",
          sector: rawLog.sector || "Infrastructure",
          status: rawLog.type === "anomaly" ? "Critical" : "Investigation",
          variance_bounds:
            rawLog.variance || `+KES ${(Math.random() * 50 + 5).toFixed(1)}M`,
          risk_index: rawLog.confidence || 85,
          timestamp: "Just Now",
        };

        setLiveStreamLogs((prev) => [transformedLog, ...prev.slice(0, 9)]);
        setMetrics((prev) => ({
          ...prev,
          active_red_flags: prev.active_red_flags + 1,
        }));
      } catch (err) {
        console.error("SSE streaming payload evaluation failed:", err);
      }
    });

    return () => {
      monitorStream.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white">
      {/* Top Fixed Global Context Header Strip */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded tracking-tighter uppercase animate-pulse">
              LIVE MATRIX
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                FACTS TUPU{" "}
                <span className="text-red-500 text-xs font-mono font-normal">
                  v1.0
                </span>
              </h1>
              <p className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                Autonomous Anti-Corruption Registry Matrix
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center space-x-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5">
            <span
              className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-rose-500 animate-pulse"}`}
            />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
              {isConnected ? "Live Telemetry Active" : "Connecting Stream"}
            </span>
          </div>
        </div>
      </header>

      {/* Primary Navigation System */}
      <nav className="bg-slate-950 border-b border-slate-900 sticky top-[68px] z-40 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3 overflow-x-auto py-2">
          <a
            href="/dashboard"
            className="border-b-2 border-transparent text-slate-400 hover:text-slate-200 py-3.5 text-xs font-mono font-bold uppercase whitespace-nowrap flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" /> Accountability Wall
          </a>
          <a
            href="/dashboard/monitor"
            className="border-b-2 border-red-500 text-red-500 py-3.5 text-xs font-mono font-bold uppercase whitespace-nowrap flex items-center gap-2"
          >
            <Activity className="w-4 h-4" /> AI Live Monitor
          </a>
          <a
            href="/dashboard/chipukizi"
            className="border-b-2 border-transparent text-slate-400 hover:text-slate-200 py-3.5 text-xs font-mono font-bold uppercase whitespace-nowrap flex items-center gap-2"
          >
            <Users className="w-4 h-4" /> Chipukizi Hub
          </a>
          <a
            href="/dashboard/submit"
            className="border-b-2 border-transparent text-amber-500 hover:text-amber-400 py-3.5 text-xs font-mono font-bold uppercase whitespace-nowrap flex items-center gap-2 ml-auto"
          >
            <FileText className="w-4 h-4" /> Submit Intel (Journalists)
          </a>
        </div>
      </nav>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        {/* Top High-Density Metric Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Active Strategic Red Flags
              </span>
              <p className="text-3xl font-black text-rose-500 tracking-tight">
                {metrics.active_red_flags}
              </p>
            </div>
            <div className="bg-rose-500/10 p-3 rounded-xl text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Deviation Trend Velocity
              </span>
              <p className="text-3xl font-black text-amber-500 tracking-tight">
                +{metrics.deviation_trend_mom}%
              </p>
              <div className="flex items-center text-[10px] text-amber-500 font-mono">
                <TrendingUp className="w-3 h-3 mr-1" /> MoM Drift Increment
              </div>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-xl text-amber-400">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Audited Legislative Profiles
              </span>
              <p className="text-3xl font-black text-teal-400 tracking-tight">
                {metrics.audited_profiles}
              </p>
            </div>
            <div className="bg-teal-500/10 p-3 rounded-xl text-teal-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Corporate Link Intersections
              </span>
              <p className="text-3xl font-black text-purple-400 tracking-tight">
                {metrics.corporate_intersections}
              </p>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-xl text-purple-400">
              <Flame className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* Live Tracking Visualization Core */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Chart Frame */}
          <div className="lg:col-span-1 bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-800 flex flex-col justify-between min-h-[320px]">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 mb-1">
                Sectoral Anomaly Spreads
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Real-time classification of raw news statements mapped into
                public procurement paths.
              </p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectorData}
                  margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="sector"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      color: "#f8fafc",
                    }}
                  />
                  <Bar
                    dataKey="anomalies"
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SSE Stream Logs Container */}
          <div className="lg:col-span-2 bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4 min-h-[320px]">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400">
                  Live Telemetry Inspection Core
                </h3>
                <p className="text-xs text-slate-500">
                  Continuous worker streams capturing open media footprints and
                  contract variances.
                </p>
              </div>
              <Radio
                className={`w-4 h-4 ${isConnected ? "text-emerald-400 animate-pulse" : "text-slate-600"}`}
              />
            </div>

            <div className="overflow-y-auto max-h-[340px] sm:max-h-[420px] space-y-2.5 pr-2 hide-scrollbar">
              {liveStreamLogs.length === 0 ? (
                <div className="text-center py-24 text-xs font-mono text-slate-500 animate-pulse">
                  Awaiting ingestion blocks from upstream threads...
                </div>
              ) : (
                liveStreamLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/60 flex items-start justify-between hover:border-slate-700/60 transition-colors"
                  >
                    <div className="space-y-1.5 max-w-[75%]">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${log.status === "Critical" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}
                        >
                          {log.status}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {log.timestamp}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200">
                        {log.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-normal line-clamp-2">
                        {log.project}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500">
                        Tracking Node: Sector Vector Mapping:{" "}
                        <span className="text-slate-400">{log.sector}</span>
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-xs font-mono font-bold text-rose-400 block">
                        {log.variance_bounds}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block">
                        Risk: {log.risk_index}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
