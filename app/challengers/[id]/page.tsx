"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const fetchChallengerData = async (id: string) => {
  try {
    const response = await fetch(`${BASE_API_URL}/api/v1/challengers/${id}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch challenger data from registry source.");
    }
    return await response.json();
  } catch (error) {
    console.error("Backend pipeline lookup error:", error);
    return null;
  }
};

// Defensive normalization structures for flexible DB inputs
interface ManifestoPillar {
  title: string;
  confidence: "High" | "Medium" | "Low" | "Verified";
  description?: string;
}

interface Challenger {
  challenger_id: string;
  full_name: string;
  target_role: string;
  target_location_name: string;
  party_affiliation: string;
  ai_feasibility_score: number;
  public_traction_velocity: number;
  background_dossier?: string;
  manifesto_pillars?: ManifestoPillar[]; // Can hold objects or strings dynamically
}

export default function ChallengerScorecardPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [challenger, setChallenger] = useState<Challenger | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getChallengerData = async () => {
      if (!id) return;
      setLoading(true);
      const data = await fetchChallengerData(id);
      if (data) {
        setChallenger(data as Challenger);
      }
      setLoading(false);
    };
    getChallengerData();
  }, [id]);

  // Safe normalization function to parse strings, colon arrays, or JSON rows cleanly
  const normalizePillar = (
    rawPillar: string | ManifestoPillar,
  ): ManifestoPillar => {
    if (!rawPillar) {
      return { title: "Unspecified Directive", confidence: "Low" };
    }

    // Case A: Standard Structured JSON object from Supabase/PostgreSQL
    if (typeof rawPillar === "object" && rawPillar !== null) {
      return {
        title: rawPillar.title || "Untitled Priority",
        confidence: rawPillar.confidence || "Verified",
        description: rawPillar.description || "",
      };
    }

    // Case B: Colon-delimited historical tracking string (title:confidence:description)
    if (typeof rawPillar === "string" && rawPillar.includes(":")) {
      const parts = rawPillar.split(":");
      return {
        title: parts[0]?.trim() || "Priority Pillar",
        confidence:
          (parts[1]?.trim() as "High" | "Medium" | "Low" | "Verified") ||
          "Verified",
        description: parts[2]?.trim() || "",
      };
    }

    // Case C: Flat description narrative string fallback
    return {
      title: rawPillar.toString(),
      confidence: "Verified",
      description: "Verified community manifesto deliverable tracking segment.",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex flex-col items-center justify-center p-6">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest animate-pulse">
          Querying alternate track ledger...
        </p>
      </div>
    );
  }

  if (!challenger) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex flex-col items-center justify-center p-6">
        <p className="text-sm font-semibold mb-2">
          Record unavailable or out of sync scope.
        </p>
        <Link
          href="/dashboard"
          className="text-xs text-emerald-400 hover:underline"
        >
          Return to Citizen Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-12 antialiased selection:bg-emerald-500/30">
      {/* HEADER NAVIGATION CRUMB */}
      <div className="max-w-6xl mx-auto mb-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-400 transition-all duration-200 group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">
            ←
          </span>{" "}
          Back to Citizen Dashboard
        </button>
      </div>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COMPACT SECTION: IDENTITY AUDIT MATRIX */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-900 bg-slate-900/10 p-6 backdrop-blur-md shadow-2xl h-fit sticky top-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-400 border border-cyan-500/20">
            Aspirant Track
          </span>

          <h1 className="mt-4 text-2xl font-black tracking-tight text-white leading-tight">
            {challenger.full_name}
          </h1>

          {/* FIXED: Displaying proper target role and clear spatial designations */}
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mt-1">
            {challenger.target_role}
          </p>
          <div className="mt-3 space-y-1 border-l-2 border-slate-900 pl-3">
            <p className="text-xs text-slate-400">
              Contesting For:{" "}
              <span className="text-slate-200 font-semibold">
                {challenger.target_location_name}
              </span>
            </p>
            <p className="text-xs text-slate-500">
              Political Affiliation:{" "}
              <span className="text-slate-300 font-medium">
                {challenger.party_affiliation}
              </span>
            </p>
          </div>

          <hr className="my-6 border-slate-900" />

          {/* DYNAMIC TRACKING DIALS */}
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-[10px] font-black tracking-wider uppercase text-slate-400 mb-1.5">
                <span>AI Feasibility Score</span>
                <span className="text-emerald-400 font-mono text-xs">
                  {challenger.ai_feasibility_score}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
                  style={{ width: `${challenger.ai_feasibility_score}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl bg-slate-950/60 border border-slate-900 p-3.5 flex justify-between items-center">
              <span className="text-[10px] font-black tracking-wider uppercase text-slate-400">
                Traction Pulse Index
              </span>
              <span className="text-sm font-black text-cyan-400 font-mono bg-cyan-500/5 border border-cyan-500/10 px-2.5 py-0.5 rounded-md">
                {challenger.public_traction_velocity}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MANIFESTO OBJECTIVES & COMPREHENSIVE REVIEWS */}
        <div className="lg:col-span-2 space-y-6">
          {/* BACKGROUND DOSSIER BLOCK */}
          {challenger.background_dossier && (
            <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Candidate Core Background & Motivation
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {challenger.background_dossier}
              </p>
            </div>
          )}

          {/* PRIMARY DIRECTIVE PRESENTATION ACCENT CARD */}
          <div className="rounded-2xl border border-slate-900 bg-gradient-to-b from-slate-900/60 to-slate-900/20 p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">
              Primary Manifesto Directive
            </h3>
            <p className="text-white text-lg leading-relaxed font-semibold italic tracking-tight">
              &quot;
              {normalizePillar(challenger.manifesto_pillars?.[0] ?? "").title}
              &quot;
            </p>
          </div>

          {/* DETAILED COMPREHENSIVE INTEGRITY SEGMENT */}
          <div className="space-y-4">
            <h2 className="text-base font-black uppercase tracking-wider text-slate-200 flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Manifesto Integrity Audit Breakdown
            </h2>

            <div className="space-y-3.5">
              {challenger.manifesto_pillars?.map(
                (rawPillar: ManifestoPillar | string, index: number) => {
                  const pillar = normalizePillar(rawPillar);
                  return (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-900/70 bg-slate-900/10 p-5 hover:border-slate-800 hover:bg-slate-900/20 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start gap-4 mb-2.5">
                        <h4 className="text-sm font-bold text-white tracking-tight">
                          {pillar.title}
                        </h4>
                        <span
                          className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded border transition-colors ${
                            pillar.confidence === "High" ||
                            pillar.confidence === "Verified"
                              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                              : "bg-amber-500/5 border-amber-500/20 text-amber-400"
                          }`}
                        >
                          Confidence: {pillar.confidence}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        {pillar.description}
                      </p>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
