"use client";

import React, { useState, useEffect } from "react";
import { getApiBaseUrl } from "@/app/lib/api_client";
import {
  Loader2,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  Shield,
  Award,
  Activity,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface ScorecardData {
  id: string;
  name: string;
  role: string;
  accountabilityScore: number; // Renamed from overall_score
  radarData: Array<{ subject: string; A: number; fullMark: number }>;
  recent_logs: Array<{
    category: string;
    raw_text: string;
    risk_level: string;
    timestamp: string;
    source_url: string;
  }>;
}

export default function RepresentativeScorecard({
  repId,
  onBack,
}: {
  repId: string | number;
  onBack: () => void;
}) {
  const [data, setData] = useState<ScorecardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchScorecard() {
      // 1. Guard clause to stop execution if ID is invalid
      if (!repId || repId === "undefined") {
        setError(
          "Invalid profile ID detected. Please return to the grid and try again.",
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const baseUrl = getApiBaseUrl();
        const response = await fetch(
          `${baseUrl}/api/representatives/${repId}`,
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(
            errData.detail || "Failed to load real-time profile metrics.",
          );
        }

        const result = await response.json();
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchScorecard();
  }, [repId]);

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        Compiling real-time oversight dossier...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full p-6 bg-rose-50 border border-rose-200 rounded-xl flex flex-col gap-4">
        <div className="flex items-center gap-3 text-rose-800">
          <AlertTriangle className="w-6 h-6 text-rose-600" />
          <span className="font-bold">Analysis Interrupted</span>
        </div>
        <p className="text-sm text-rose-600">{error}</p>
        <button
          onClick={onBack}
          className="self-start text-sm font-medium text-rose-700 hover:underline"
        >
          &larr; Return to Grid
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Navigation & Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to National Summary
      </button>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold uppercase shadow-inner">
            {data.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{data.name}</h2>
            <p className="text-slate-500 font-medium">{data.role}</p>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition-colors">
          Export Report ↗
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Intro Card */}
        <div className="col-span-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Intro
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <Award className="w-5 h-5 text-blue-500" /> Current Term Active
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <Shield className="w-5 h-5 text-green-500" /> Monitored by AI
                Engine
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-end gap-2">
            <span className="text-sm font-bold text-slate-900">Score:</span>
            <span
              className={`text-3xl font-black ${data.accountabilityScore > 60 ? "text-blue-600" : "text-red-600"}`}
            >
              {data.accountabilityScore}/100
            </span>
          </div>
        </div>

        {/* Radar Chart section inside RepresentativeScorecard.tsx */}
        <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Sectoral Performance Radar
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={data.radarData} // Use the key from your backend response
              >
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <Radar
                  name="Performance"
                  dataKey="A" // Backend maps your values to 'A'
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-red-500" /> Real-Time Pipeline Logs
        </h3>

        {data.recent_logs.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            No recent anomalies or alerts detected by the AI core.
          </p>
        ) : (
          <div className="space-y-4">
            {data.recent_logs.map((log, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${
                      log.risk_level === "High"
                        ? "bg-red-100 text-red-700"
                        : log.risk_level === "Elevated"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {log.risk_level} RISK
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-slate-700">{log.raw_text}</p>
                <a
                  href={log.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline w-max mt-1"
                >
                  View Source Log <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
