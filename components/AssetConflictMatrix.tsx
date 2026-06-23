"use client";

import React, { useState, useEffect } from "react";
import { getApiBaseUrl } from "@/app/lib/api_client";
import {
  Building2,
  Network,
  ArrowUpRight,
  ShieldAlert,
  Link2,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface MatrixSummary {
  mattered_corporate_links: number;
  critical_intersects: number;
  proxy_confidence_level: number;
}

interface ConflictNode {
  id: string;
  representativeName: string;
  representativeId: number;
  corporateEntity: string;
  relationship: string;
  riskIndex: number;
  tenderInvolved: string;
  tenderValue: string;
  status: "High Conflict" | "Review Required" | "Clearance Pending";
}

export default function AssetConflictMatrix({
  onSelectRepresentative,
}: {
  onSelectRepresentative: (id: number) => void;
}) {
  const [summary, setSummary] = useState<MatrixSummary | null>(null);
  const [clusters, setClusters] = useState<ConflictNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMatrixData = async () => {
      try {
        setLoading(true);
        setError(false);

        const baseUrl = getApiBaseUrl();
        const [summaryRes, clustersRes] = await Promise.all([
          fetch(`${baseUrl}/api/conflict-matrix/summary`),
          fetch(`${baseUrl}/api/conflict-matrix/nexus-clusters`),
        ]);

        if (!summaryRes.ok || !clustersRes.ok) throw new Error();

        const summaryData = await summaryRes.json();
        const clustersData = await clustersRes.json();

        setSummary(summaryData);
        setClusters(clustersData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching conflict matrix data:", err.message);
        } else {
          console.error("Unknown error fetching conflict matrix data.");
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMatrixData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500 font-semibold text-sm">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        Cross-referencing shareholder registries with BRS endpoints...
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl m-6 bg-white p-6 shadow-sm">
        <ShieldAlert className="w-10 h-10 text-rose-500 mb-2" />
        Conflict Engine core failed to respond. Check backend server connection
        status.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER NODES */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Network className="w-6 h-6 text-indigo-600" /> Asset & Corporate
            Entity Conflict Matrix
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Cross-referencing Business Registration Service (BRS) shareholder
            structures against public procurement contracts.
          </p>
        </div>
      </div>

      {/* METRIC CARD OVERVIEW HIGHLIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Mattered Corporate Links
          </div>
          <div className="text-2xl font-black text-slate-800">
            {summary.mattered_corporate_links}
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            Cross-matched entities verified
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">
            Critical Intersects
          </div>
          <div className="text-2xl font-black text-red-600">
            {summary.critical_intersects}
          </div>
          <p className="text-[11px] text-red-400 font-medium mt-1">
            Active oversight conflicts
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">
            Proxy Confidence Level
          </div>
          <div className="text-2xl font-black text-indigo-600">
            {summary.proxy_confidence_level}%
          </div>
          <p className="text-[11px] text-indigo-400 font-medium mt-1">
            Neural clustering threshold
          </p>
        </div>
      </div>

      {/* MATRIX ENTRIES */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Tracked Nexus Clusters
        </div>

        {clusters.map((node) => (
          <div
            key={node.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition space-y-4"
          >
            {/* Top row metadata */}
            <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span
                    onClick={() =>
                      onSelectRepresentative(node.representativeId)
                    }
                    className="text-sm font-black text-slate-900 hover:text-blue-600 cursor-pointer transition flex items-center gap-1"
                  >
                    {node.representativeName}{" "}
                    <ArrowUpRight className="w-3 h-3 text-slate-400" />
                  </span>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />{" "}
                    {node.corporateEntity}
                  </div>
                </div>
                <p className="text-xs font-semibold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-md inline-block">
                  Relationship: {node.relationship}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-black text-slate-800">
                    {node.riskIndex}/100
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Matrix Risk
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    node.status === "High Conflict"
                      ? "bg-red-50 text-red-700 border border-red-100"
                      : node.status === "Review Required"
                        ? "bg-amber-50 text-amber-700 border border-amber-100"
                        : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {node.status}
                </span>
              </div>
            </div>

            {/* Pipeline Intersect Map Visual */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 text-xs font-medium text-slate-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="space-y-1 flex-1">
                <span className="font-bold text-slate-400 block uppercase tracking-wider text-[9px]">
                  Intersecting Public Procurement Flow
                </span>
                <p className="font-bold text-slate-800 text-sm flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-indigo-500" />{" "}
                  {node.tenderInvolved}
                </p>
              </div>
              <div className="text-left md:text-right flex-shrink-0">
                <span className="font-bold text-slate-400 block uppercase tracking-wider text-[9px]">
                  Contract Value
                </span>
                <p className="font-black text-emerald-600 text-sm">
                  {node.tenderValue}
                </p>
              </div>
            </div>

            {/* Footer verification anchors */}
            <div className="flex items-center justify-between pt-1 text-[11px] font-bold text-slate-400">
              <div className="flex items-center gap-3">
                <a
                  href="https://brs.go.ke"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-600 flex items-center gap-0.5"
                >
                  BRS Corporate Dossier <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <span>•</span>
                <a
                  href="#"
                  className="hover:text-slate-600 flex items-center gap-0.5"
                >
                  Procurement Log Ref: {node.id}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
