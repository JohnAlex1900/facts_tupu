import React, { useState } from "react";
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { getApiBaseUrl } from "@/app/lib/api_client";

interface CheckoutProps {
  challengerId: string;
  onSuccess: () => void;
}

export default function PremiumCheckoutTerminal({
  challengerId,
  onSuccess,
}: CheckoutProps) {
  const [status, setStatus] = useState<
    "IDLE" | "PROCESSING" | "SUCCESS" | "ERROR"
  >("IDLE");
  const [errorMessage, setErrorMessage] = useState("");

  const simulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("PROCESSING");

    // Grab the system JWT we stored during Firebase Token Exchange
    let token: string | null = null;

    if (typeof window !== "undefined") {
      token = localStorage.getItem("facts_tupu_token");
    }

    try {
      // Fake a 2.5 second network delay to simulate M-PESA processing
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/payments/simulate-success`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ challenger_id: challengerId }),
      });

      if (!res.ok) throw new Error("Backend verification failed.");

      setStatus("SUCCESS");

      // Update local storage tier to reflect premium access
      if (typeof window !== "undefined") {
        localStorage.setItem("facts_tupu_tier", "PREMIUM_VERIFIED");
      }

      // Trigger callback to re-render the dashboard
      setTimeout(onSuccess, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Payment simulation error:", err.message);
      } else {
        console.error("Payment simulation error:", err);
      }
      setStatus("ERROR");
      setErrorMessage("Simulation failed. Ensure backend server is running.");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md mx-auto w-full space-y-6">
      <div className="text-center space-y-2">
        <div className="bg-emerald-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight">
          Activate Premium Verification
        </h3>
        <p className="text-xs text-slate-400 font-mono">
          Simulated Environment: Bypass M-PESA Daraja
        </p>
      </div>

      <form onSubmit={simulatePayment}>
        {status === "IDLE" || status === "ERROR" ? (
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase tracking-wider text-xs py-3 rounded-lg transition-all"
          >
            Simulate Successful Payment
          </button>
        ) : status === "PROCESSING" ? (
          <div className="w-full bg-slate-800 text-slate-400 font-bold uppercase tracking-wider text-xs py-3 rounded-lg flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Verifying
            Transaction...
          </div>
        ) : (
          <div className="w-full bg-emerald-500 text-slate-950 p-4 rounded-lg flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Account Upgraded
            </span>
          </div>
        )}

        {status === "ERROR" && (
          <div className="mt-4 flex items-start gap-2 bg-rose-950/30 border border-rose-500/20 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] font-mono text-rose-300 leading-relaxed">
              {errorMessage}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
