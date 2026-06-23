"use client";

import { useState, useEffect, use } from "react";
import {
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Layers,
  HardDrive,
  FileText,
  Satellite,
  Activity,
} from "lucide-react";
import Link from "next/link";

interface AuditLog {
  date: string;
  source: string;
  finding: string;
  severity: "GREEN" | "YELLOW" | "RED";
}

interface ProjectTrackingNode {
  name: string;
  allocated: string;
  spent: string;
  satellite_status: "COMPLETED" | "STALLED" | "NOT_STARTED";
  last_pass_date: string;
}

interface PillarMetrics {
  legislation: number;
  fiduciary: number;
  responsiveness: number;
  fidelity: number;
  integrity: number;
}

interface LeaderProfile {
  id: string;
  name: string;
  role: string;
  constituency: string;
  county: string;
  term: string;
  impact_score: number;
  jaba_score: number;
  rvs: number;
  pillars: PillarMetrics;
  projects: ProjectTrackingNode[];
  audit_trail: AuditLog[];
  assessment_summary?: string;
}

export default function LeaderDossierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState<
    "matrix" | "fiduciary" | "satellite"
  >("matrix");
  const [leaderData, setLeaderData] = useState<LeaderProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderDossier = async () => {
      try {
        setLoading(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(
          `${baseUrl}/api/v1/profiles/${resolvedParams.id}`,
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch profile dossier data (Status: ${response.status})`,
          );
        }

        const data = await response.json();
        setLeaderData(data);
      } catch (err: unknown) {
        setError(
          (err as Error).message || "An unexpected network error occurred.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchLeaderDossier();
    }
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 font-mono flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs">
            Decrypting Ledger Archives for Node: {resolvedParams.id}...
          </p>
        </div>
      </div>
    );
  }

  if (error || !leaderData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 font-mono flex items-center justify-center p-4">
        <div className="max-w-md bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="text-white font-bold">Dossier Access Error</h3>
          <p className="text-xs leading-relaxed text-slate-400">
            {error ||
              "Requested representative registry entry could not be parsed."}
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-slate-950 hover:bg-slate-850 border border-slate-800 px-4 py-2 rounded text-xs transition text-white"
          >
            Return to Safety
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Breadcrumb Strip */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Member Wall Feed
          </Link>
          <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 px-3 py-1 rounded text-slate-500">
            Node Core UUID: {leaderData.id}
          </span>
        </div>

        {/* Profile Master Banner Display */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-900/60 px-2 py-0.5 rounded uppercase">
                {leaderData.role || "Representative"}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {leaderData.constituency || "General"} Constituency →{" "}
                {leaderData.county || "National"}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {leaderData.name}
            </h2>
            <p className="text-xs font-mono text-slate-500">
              Active Legislative Tenure Tracking Framework:{" "}
              {leaderData.term || "2022 - 2027"}
            </p>
          </div>

          {/* Aggregated Tri-Telemetry Display Rings */}
          <div className="grid grid-cols-3 gap-2 font-mono text-center">
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-850">
              <span className="text-[9px] text-slate-500 font-bold block uppercase">
                Jaba Meter
              </span>
              <span className="text-lg font-black text-red-400">
                {leaderData.jaba_score}%
              </span>
            </div>
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-850">
              <span className="text-[9px] text-slate-500 font-bold block uppercase">
                Impact Score
              </span>
              <span className="text-lg font-black text-slate-200">
                {leaderData.impact_score}
              </span>
            </div>
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-850">
              <span className="text-[9px] text-slate-500 font-bold block uppercase">
                RVS Rate
              </span>
              <span className="text-lg font-black text-red-400">
                {leaderData.rvs}%
              </span>
            </div>
          </div>
        </div>

        {/* Operational Segment Control Tabs */}
        <div className="flex border-b border-slate-900 gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab("matrix")}
            className={`pb-3 px-2 font-bold cursor-pointer border-b-2 transition-all ${
              activeTab === "matrix"
                ? "border-red-500 text-white"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            5-Pillar Score Breakdown
          </button>
          <button
            onClick={() => setActiveTab("fiduciary")}
            className={`pb-3 px-2 font-bold cursor-pointer border-b-2 transition-all ${
              activeTab === "fiduciary"
                ? "border-red-500 text-white"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            Tri-Source Audit Ingestion Logs (
            {leaderData.audit_trail?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("satellite")}
            className={`pb-3 px-2 font-bold cursor-pointer border-b-2 transition-all ${
              activeTab === "satellite"
                ? "border-red-500 text-white"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            Satellite Project Fidelity Space Tracker
          </button>
        </div>

        {/* Context Output Panel */}
        <div className="min-h-[350px]">
          {activeTab === "matrix" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 font-mono text-xs">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-red-500" /> Weighted Index
                  Verification Metrics
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      label: "Legislation Index (Weight: 25%)",
                      val: leaderData.pillars?.legislation || 0,
                      color: "bg-blue-500",
                    },
                    {
                      label: "Fiduciary Duty Allocation Audit (Weight: 30%)",
                      val: leaderData.pillars?.fiduciary || 0,
                      color: "bg-red-500",
                    },
                    {
                      label: "Constituent Digital Responsiveness (Weight: 20%)",
                      val: leaderData.pillars?.responsiveness || 0,
                      color: "bg-emerald-500",
                    },
                    {
                      label:
                        "Project Fidelity Satellite Verification (Weight: 15%)",
                      val: leaderData.pillars?.fidelity || 0,
                      color: "bg-amber-500",
                    },
                    {
                      label: "Integrity & Court Mentions Track (Weight: 10%)",
                      val: leaderData.pillars?.integrity || 0,
                      color: "bg-slate-700",
                    },
                  ].map((p, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400">{p.label}</span>
                        <strong className="text-slate-200">{p.val}%</strong>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div
                          className={p.color + " h-full"}
                          style={{ width: `${p.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-sm font-mono font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-red-500" /> Automated
                    Assessment Summary
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">
                    {leaderData.assessment_summary || (
                      <>
                        This official profile falls into processing parameters
                        indexed under live telemetry frameworks. The alignment
                        path shows a variance metrics tracking window across
                        active constituency deployment flows.
                      </>
                    )}
                  </p>
                </div>
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-lg text-xs font-mono text-slate-400 mt-4">
                  💡 **Tri-Source Insight Engine Rule:** Legislative floor
                  attendance matches baseline averages, but structural updates
                  rely heavily on decentralized satellite data audits.
                </div>
              </div>
            </div>
          )}

          {activeTab === "fiduciary" && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <h3 className="text-sm font-mono font-bold text-white flex items-center gap-1.5 mb-2">
                <HardDrive className="w-4 h-4 text-red-500" /> Decentralized
                Ingestion Event Feed
              </h3>
              <div className="space-y-3 font-mono text-xs">
                {leaderData.audit_trail?.length > 0 ? (
                  leaderData.audit_trail.map((log, index) => (
                    <div
                      key={index}
                      className="bg-slate-950 border border-slate-850 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-850 text-slate-400">
                            {log.date}
                          </span>
                          <span className="text-[10px] text-red-400 font-bold tracking-tight uppercase flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Data Stream
                            Context: {log.source}
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs font-sans leading-normal">
                          {log.finding}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold rounded tracking-wider shrink-0 ${
                          log.severity === "RED"
                            ? "bg-red-950/40 text-red-400 border border-red-900/50"
                            : "bg-amber-950/40 text-amber-400 border border-amber-900/50"
                        }`}
                      >
                        {log.severity} EXCEPTION
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-6">
                    No historical forensic audit data registered for this
                    representative.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "satellite" && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-mono font-bold text-white flex items-center gap-1.5">
                  <Satellite className="w-4 h-4 text-red-500" /> Infrastructure
                  Coordinate Verification Logs
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-2 py-0.5 rounded flex items-center gap-1">
                  Spatial APIs Polling Live
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {leaderData.projects?.length > 0 ? (
                  leaderData.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 border border-slate-850 rounded-lg p-4 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-white font-bold leading-tight font-sans text-sm">
                            {proj.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 text-[9px] font-bold rounded shrink-0 ${
                              proj.satellite_status === "STALLED"
                                ? "bg-red-950/40 text-red-400 border border-red-900/40"
                                : "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40"
                            }`}
                          >
                            {proj.satellite_status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 pt-1">
                          Latest Imagery Ground Pass: {proj.last_pass_date}
                        </p>
                      </div>

                      <div className="bg-slate-900/60 p-2.5 rounded border border-slate-900 grid grid-cols-2 gap-2 text-center text-[11px] pt-2">
                        <div>
                          <span className="text-[9px] text-slate-500 block uppercase">
                            Allocated Capital
                          </span>
                          <span className="text-slate-300 font-bold">
                            {proj.allocated}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block uppercase">
                            Drawn Disbursement
                          </span>
                          <span className="text-slate-300 font-bold">
                            {proj.spent}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-6 col-span-2">
                    No infrastructure track coordinates provided for satellite
                    verification.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
