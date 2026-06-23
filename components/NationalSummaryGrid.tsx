"use client";

import React, { useState, useEffect } from "react";
import { Loader2, AlertTriangle } from "lucide-react";

// Explicit TypeScript shape mapping to backend schema returns
interface RepresentativeNode {
  id: string;
  name: string;
  party: string;
  status: string;
  accountabilityScore: number;
  integrityVector: number;
  publicEngagement: number;
  riskRadarIndex: number;
  locationLabel: string;
}

export default function NationalSummaryGrid({
  onSelectRepresentative,
}: {
  onSelectRepresentative: (id: string) => void;
}) {
  const [representatives, setRepresentatives] = useState<RepresentativeNode[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchLiveSummary() {
      try {
        setLoading(true);
        // Correct path alignment with the main FastAPI engine core route
        const response = await fetch(
          "http://127.0.0.1:8000/api/representatives",
        );

        if (!response.ok) {
          throw new Error(
            "Failed to pull live open governance pipeline matrix metrics.",
          );
        }
        const data = await response.json();
        setRepresentatives(data);
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
    fetchLiveSummary();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-3 text-slate-500 font-semibold text-sm">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        Synchronizing real-time geo-administrative verification streams...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-sm font-medium">
        <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
        <div>
          <p className="font-bold">Live Grid Core Offline</p>
          <p className="text-rose-600/80 text-xs mt-0.5">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          National Accountability Summary
        </h2>
        <p className="text-sm text-slate-500">
          Real-time geo-administrative verification network across the Republic
          of Kenya.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {representatives.map((rep) => (
          <div
            key={rep.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between cursor-pointer"
            onClick={() => onSelectRepresentative(rep.id)}
          >
            {/* Card Top: Party/Status & Main Score */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {rep.party} • {rep.status}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900">
                    {rep.accountabilityScore}%
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Accountability
                  </div>
                </div>
              </div>

              {/* Name and Specific Location */}
              <h3 className="text-lg font-bold text-blue-900 leading-tight mb-1">
                {rep.name}
              </h3>
              <p className="text-sm text-slate-500 mb-6 line-clamp-1">
                {rep.locationLabel}
              </p>
            </div>

            {/* Card Bottom: Metrics */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">
                  Integrity Vector
                </span>
                <span
                  className={`font-bold ${rep.integrityVector >= 75 ? "text-green-600" : "text-amber-500"}`}
                >
                  {rep.integrityVector}%
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">
                  Public Engagement
                </span>
                <span className="font-bold text-slate-800">
                  {rep.publicEngagement}%
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">
                  Risk Radar Index
                </span>
                <span
                  className={`font-bold ${rep.riskRadarIndex > 25 ? "text-red-500" : "text-green-600"}`}
                >
                  {rep.riskRadarIndex}/100
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
