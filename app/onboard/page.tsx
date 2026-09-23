"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ChallengerOnboardingForm from "@/components/ChallengerOnboardingForm"; // Adjust this import path to match your folder file location

export default function OnboardPage() {
  const router = useRouter();
  type RegistrationSuccessData = {
    full_name?: string;
    target_role?: string;
    associated_id?: string;
  };

  const [successData, setSuccessData] = useState<RegistrationSuccessData | null>(null);

  const handleCancel = () => {
    // Route back to landing hero view seamlessly on cancel triggers
    router.push("/");
  };

  const handleRegistrationSuccess = (data: unknown) => {
    // Intercept successful payload deployment context
    setSuccessData(data as RegistrationSuccessData);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Background Ambience Layer */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl z-10 space-y-6">
        {/* TOP BRAND BACKLINK HEADER */}
        <div className="flex items-center justify-between px-2">
          <Link 
            href="/" 
            className="text-xs font-bold tracking-wider text-slate-400 hover:text-white transition flex items-center gap-1.5"
          >
            ← Back to Portal Home
          </Link>
          <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-500">
            Secure Node Gateway
          </span>
        </div>

        {!successData ? (
          /* ACTIVE TRANSACTION ONBOARDING COMPONENT EXECUTION */
          <ChallengerOnboardingForm 
            onCancel={handleCancel}
            onRegistrationSuccess={handleRegistrationSuccess}
          />
        ) : (
          /* DISPATCHED REGISTRATION SUCCESS SCREEN */
          <div className="w-full max-w-xl rounded-2xl border border-emerald-900/40 bg-slate-900/60 p-6 sm:p-8 text-center space-y-5 shadow-2xl animate-fadeIn backdrop-blur-md">
            <div className="w-12 h-12 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full flex items-center justify-center text-xl mx-auto shadow-inner shadow-emerald-500/10">
              ✓
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                Profile Deployed Successfully
              </h2>
              <p className="text-xs text-slate-400">
                Your alternative challenger token validation has completed registration clearance.
              </p>
            </div>

            {/* Verification Metadata Summary Readout */}
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 text-left text-xs space-y-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 block border-b border-slate-850 pb-1.5 mb-2">
                Deployment Identity Metrics
              </span>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Track Profile:</span>
                <span className="text-white font-extrabold">{successData?.full_name || "Unknown Leader"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Role Seat:</span>
                <span className="text-indigo-400 uppercase font-bold text-[11px]">{successData?.target_role || "MP"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Escrow Boundary Assignment:</span>
                <span className="text-slate-300 font-mono text-[11px]">{successData?.associated_id || "N/A"}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-block w-full rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-emerald-950/40 transition"
              >
                Access Main Dashboard Progress Hub →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}