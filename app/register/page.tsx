"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { getApiBaseUrl } from "../lib/api_client";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Authenticate with Firebase
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
      } else {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
      }

      const user = userCredential.user;

      // 2. Exchange Firebase Identity for Facts Tupu Backend JWT
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/auth/firebase-exchange`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email }),
      });

      if (!res.ok)
        throw new Error("Failed to synchronize with platform backend.");

      const data = await res.json();

      // 3. Store system token securely
      if (typeof window !== "undefined") {
        localStorage.setItem("facts_tupu_token", data.access_token);
        localStorage.setItem("facts_tupu_tier", data.tier);
      }

      // 4. SMART REDIRECT LOGIC
      // If the user is newly registered or hasn't paid, send them to the setup wizard
      if (data.tier === "FREE") {
        router.push("/onboarding");
      } else {
        // Already premium/verified, send to the main feed or challenger dashboard
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError((err as Error).message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="bg-emerald-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            FACTS TUPU
          </h1>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            {isLogin ? "Secure Gateway Login" : "Candidate Registration Portal"}
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-rose-950/30 border border-rose-500/20 p-3 rounded-lg text-rose-400 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase tracking-wider text-xs py-3.5 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isLogin ? (
              "Authenticate Identity"
            ) : (
              "Initialize Profile"
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-800">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-mono text-slate-500 hover:text-emerald-400 transition-colors"
          >
            {isLogin
              ? "New candidate? Initialize your profile here."
              : "Already registered? Authenticate here."}
          </button>
        </div>
      </div>
    </div>
  );
}
