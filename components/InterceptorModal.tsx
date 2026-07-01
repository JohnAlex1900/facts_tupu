"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuota } from "@/components/QuotaContext";

export default function InterceptorModal({
  onNavigateToOnboarding,
}: {
  onNavigateToOnboarding: () => void;
}) {
  const router = useRouter();
  const { isGateOpen, setIsGateOpen } = useQuota();

  if (!isGateOpen) return null;

  const handleNavigateToCitizenRegistration = () => {
    // Safely lower the modal state tracking layer before pushing to history stack
    setIsGateOpen(false);
    router.push("/register");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-900 bg-slate-950 shadow-2xl transition-all">
        {/* WARNING SYSTEM ALIGNMENT RIBBON */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 px-6 py-2.5 text-center text-sm sm:text-[10px] font-bold uppercase tracking-widest text-white">
          Verification Query Balance Exhausted
        </div>

        <div className="p-6 sm:p-10 bg-gradient-to-b from-slate-900/40 to-slate-950">
          <div className="text-center">
            <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl lg:text-3xl">
              Expand Your Accountability Toolkit
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              You have reached your limit of 5 free tracking tokens. Select an
              account profile below to unlock continuous, raw auditing
              capabilities.
            </p>
          </div>

          {/* DUAL LAYER CONFIGURATION MATRIX */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {/* TIER 1: SECURE CITIZEN / JOURNALIST TRACK */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/20 p-5 transition hover:border-slate-800 hover:bg-slate-900/40 group">
              <div>
                <div className="text-sm sm:text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Auditor Pipeline
                </div>
                <h3 className="mt-1 text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                  Citizen Premium Tiers
                </h3>
                <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
                  Unlock access options tailored for active citizen uploaders or
                  media institutions conducting bulk analytics.
                </p>

                <div className="mt-4 space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-900 font-mono text-base sm:text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span>• Weekly Uploader:</span>
                    <span className="text-emerald-400 font-bold">
                      KSH 50/wk
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Media Journalist:</span>
                    <span className="text-cyan-400 font-bold">KSH 80k/mo</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNavigateToCitizenRegistration}
                className="mt-6 w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 transition-all duration-200"
              >
                Choose Citizen Plan
              </button>
            </div>

            {/* TIER 2: ALTERNATIVE ROADMAP CHALLENGER TIERS */}
            <div className="flex flex-col justify-between rounded-xl border border-emerald-500/20 bg-slate-900/20 p-5 shadow-inner transition hover:border-emerald-500/40 hover:bg-slate-900/40 group">
              <div>
                <div className="inline-flex rounded-full bg-emerald-950/80 px-2 py-0.5 text-sm sm:text-[9px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-900/50">
                  Political Track
                </div>
                <h3 className="mt-1 text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                  Aspiring Challenger
                </h3>
                <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
                  Claim your administrative target boundary layer, upload your
                  policy manifesto framework directly to voters, and trace
                  dynamic traction models.
                </p>
                <div className="mt-4 font-mono text-lg font-black text-white">
                  KES 2,500{" "}
                  <span className="text-sm sm:text-[10px] text-slate-500 font-normal">
                    / validation
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsGateOpen(false);
                  onNavigateToOnboarding();
                }}
                className="mt-6 w-full rounded-lg bg-slate-100 py-2.5 text-xs font-bold text-slate-950 hover:bg-white transition-all duration-200"
              >
                Onboard as Candidate
              </button>
            </div>
          </div>

          {/* FALLBACK OVERLAY DISMISS ACTION */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setIsGateOpen(false)}
              className="text-base sm:text-[11px] font-medium text-slate-500 hover:text-slate-400 transition underline underline-offset-4"
            >
              Return to Public Grid View (Locked Mode)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
