/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { getApiBaseUrl } from "@/app/lib/api_client";
import {
  Activity,
  ShieldAlert,
  Cpu,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface GlobalInsight {
  insight_id: string;
  politician_id: string;
  politician_name: string;
  role_type: string;
  category: string;
  raw_text: string;
  ai_summary: string;
  confidence_score: number;
  risk_level: string;
  timestamp: string;
  source_url: string;
}

interface GlobalMonitorData {
  major_representatives: GlobalInsight[];
  other_representatives: GlobalInsight[];
}

export default function GlobalAIMonitorDashboard() {
  const [data, setData] = useState<GlobalMonitorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGlobalFeed = async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/ai-monitor/global`);
      if (!response.ok)
        throw new Error("Failed to fetch global AI intelligence feed.");
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalFeed();
    // Poll the global feed every 30 seconds for new scraped insights
    const interval = setInterval(() => fetchGlobalFeed(true), 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading && !data) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
          <Activity className="w-10 h-10 text-blue-600 relative z-10" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Synchronizing Global Feed...
        </h3>
        <p className="text-sm text-slate-500">
          Querying real-time intelligence nodes.
        </p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="w-full p-8 bg-red-50 text-red-700 border border-red-200 rounded-xl flex flex-col items-center">
        <AlertCircle className="w-10 h-10 mb-3 text-red-500" />
        <h3 className="font-bold text-lg">Engine Offline</h3>
        <p className="text-sm mb-4">{error}</p>
        <button
          onClick={() => fetchGlobalFeed()}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-red-200 font-bold hover:bg-red-50"
        >
          <RefreshCw className="w-4 h-4" /> Reconnect Engine
        </button>
      </div>
    );
  }

  const renderInsightCard = (insight: GlobalInsight) => {
    const isHighRisk = insight.risk_level === "High";
    const isElevated = insight.risk_level === "Elevated";

    return (
      <div
        key={insight.insight_id}
        className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-base font-black text-slate-900">
              {insight.politician_name}
            </h4>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              {insight.role_type}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                isHighRisk
                  ? "bg-red-100 text-red-700"
                  : isElevated
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {insight.risk_level} Risk
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {new Date(insight.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Cpu
              className={`w-5 h-5 ${isHighRisk ? "text-red-500" : "text-blue-500"}`}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800 leading-relaxed mb-3">
              {insight.ai_summary}
            </p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
              <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                Vector: {insight.category.replace("_", " ")}
              </span>
              {insight.source_url && (
                <a
                  href={insight.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  Source Logs <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <Activity className="w-6 h-6 text-blue-600" /> National AI Monitor
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Real-time surveillance across all registered officials.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
          <span className="text-xs font-bold uppercase tracking-wider">
            Live Feed Active
          </span>
        </div>
      </div>

      {/* Major Representatives Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-slate-700" />
          <h3 className="text-lg font-bold text-slate-800">
            Major Representatives (Governors, MPs, Senators)
          </h3>
        </div>
        {data?.major_representatives.length === 0 ? (
          <div className="p-6 text-center text-slate-500 border border-dashed rounded-xl bg-slate-50">
            No recent anomalies detected.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data?.major_representatives.map(renderInsightCard)}
          </div>
        )}
      </section>

      {/* Other Representatives Section */}
      <section>
        <div className="flex items-center gap-2 mb-4 mt-8">
          <Activity className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-bold text-slate-800">
            Regional & Appointed Officials (MCAs, CSs)
          </h3>
        </div>
        {data?.other_representatives.length === 0 ? (
          <div className="p-6 text-center text-slate-500 border border-dashed rounded-xl bg-slate-50">
            No recent anomalies detected.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data?.other_representatives.map(renderInsightCard)}
          </div>
        )}
      </section>
    </div>
  );
}
