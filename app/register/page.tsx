"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuota } from "@/components/QuotaContext";

type PlanType = "weekly_uploader" | "journalist";

export default function CitizenRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const { setAccountTier } = useQuota();

  // Registration data structure states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    chosenPlan: "weekly_uploader" as PlanType,
  });

  const handlePlanSelect = (plan: PlanType) => {
    setFormData((prev) => ({ ...prev, chosenPlan: plan }));
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorFeedback(null);

    if (formData.password !== formData.confirmPassword) {
      setErrorFeedback("Passwords do not match. Please verify.");
      return;
    }

    if (formData.password.length < 8) {
      setErrorFeedback("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/register-citizen",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: formData.fullName,
            email: formData.email,
            password: formData.password,
            chosen_plan: formData.chosenPlan,
          }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        // Store the new operating framework tier down into context state layer
        setAccountTier(result.chosen_plan); // 'weekly_uploader' or 'journalist'

        alert(
          `Registration Successful! Assigned Model Tier: ${result.chosen_plan.toUpperCase()}`,
        );
        router.push("/dashboard");
      }

      if (!response.ok) {
        // FIX: Check if FastAPI returned structural Pydantic validation objects
        if (Array.isArray(result.detail)) {
          const structuralErrorMessage = result.detail
            .map((err: unknown) =>
              (err as { msg: string }).msg.replace("Value error, ", ""),
            )
            .join(" | ");
          throw new Error(structuralErrorMessage);
        }
        throw new Error(
          result.detail || "Account deployment failure. Try again.",
        );
      }

      alert(
        `Registration Successful! Assigned Model Tier: ${result.chosen_plan.toUpperCase()}`,
      );
      router.push("/dashboard");
    } catch (err: unknown) {
      setErrorFeedback(
        (err as Error).message || "Data pipeline communication error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start overflow-y-auto px-4 py-12 text-slate-100">
      <div className="w-full max-w-2xl bg-slate-900/40 border border-slate-900 rounded-2xl p-6 md:p-10 shadow-2xl transition-all">
        {/* HEADER BRAND BLOCK */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full uppercase tracking-widest">
            Quota Limit Reached
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-4 tracking-tight">
            Provision Premium Citizen Access
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Upgrade your auditing pipeline to continuous sync modes to unlock
            comprehensive analytical capabilities.
          </p>
        </div>

        {errorFeedback && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/20 border border-rose-900/50 text-rose-400 text-xs font-medium">
            ⚠️ {errorFeedback}
          </div>
        )}

        <form onSubmit={handleSubmitRegistration} className="space-y-6">
          {/* STEP 1: CHOOSE PLAN SEGMENT */}
          <div className="space-y-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Select Operating Framework Tier
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* PLAN A: WEEKLY UPLOADER */}
              <div
                onClick={() => handlePlanSelect("weekly_uploader")}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  formData.chosenPlan === "weekly_uploader"
                    ? "bg-emerald-950/20 border-emerald-500 shadow-md shadow-emerald-950/50"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">
                      Weekly Uploader
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.chosenPlan === "weekly_uploader" ? "border-emerald-500" : "border-slate-600"}`}
                    >
                      {formData.chosenPlan === "weekly_uploader" && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Designed for active community observers uploading regional
                    tracking records.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-900 text-emerald-400 font-mono font-bold text-sm">
                  KSH 50{" "}
                  <span className="text-[10px] text-slate-500 font-normal">
                    / week
                  </span>
                </div>
              </div>

              {/* PLAN B: JOURNALIST */}
              <div
                onClick={() => handlePlanSelect("journalist")}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  formData.chosenPlan === "journalist"
                    ? "bg-emerald-950/20 border-emerald-500 shadow-md shadow-emerald-950/50"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">
                      Media Journalist
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.chosenPlan === "journalist" ? "border-emerald-500" : "border-slate-600"}`}
                    >
                      {formData.chosenPlan === "journalist" && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Unrestricted bulk enterprise queries, API access handles,
                    and full historical metrics download.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-900 text-emerald-400 font-mono font-bold text-sm">
                  KSH 80,000{" "}
                  <span className="text-[10px] text-slate-500 font-normal">
                    / month
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-900/60 my-6" />

          {/* STEP 2: CREDENTIAL ASSIGNMENT */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Official Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g., John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 outline-none transition focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="citizen@domain.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 outline-none transition focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Secure Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 outline-none transition focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Confirm Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 outline-none transition focus:border-emerald-500"
              />
            </div>
          </div>

          {/* DISPATCH AND ACTION BLOCK */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center rounded-xl bg-emerald-500 text-slate-950 py-3 text-xs font-bold uppercase tracking-wider hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-950/20"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              ) : (
                `Complete Account Setup — Pay ${formData.chosenPlan === "weekly_uploader" ? "KSH 50" : "KSH 80,000"}`
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full text-center text-slate-500 hover:text-slate-400 text-[11px] font-medium transition mt-4"
            >
              Cancel and Return to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
