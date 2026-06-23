"use client";

import { useState } from "react";
import {
  BarChart3,
  Activity,
  Users,
  FileText,
  UploadCloud,
  Lock,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Server,
} from "lucide-react";

export default function IntelSubmissionPortal() {
  const [targetLeader, setTargetLeader] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "processing_payment" | "uploading" | "success" | "error"
  >("idle");

  const BACKEND_API_BASE_URL = "http://localhost:8000";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handlePaymentAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLeader || !file) {
      alert("Please select a target and attach the intel document.");
      return;
    }

    // Step 1: Initialize Payment (Simulated M-Pesa / Stripe Gateway)
    setStatus("processing_payment");

    setTimeout(async () => {
      // Step 2: Upload File to Secure Backend
      setStatus("uploading");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("target_leader", targetLeader);
      formData.append("context", description);

      try {
        let token: string | null = null;

        if (typeof window !== "undefined") {
          token = localStorage.getItem("facts_tupu_token");
        } // Retrieve active session token

        const response = await fetch(
          `${BACKEND_API_BASE_URL}/api/v1/intel/submit`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`, // Inject secure header
            },
            body: formData,
          },
        );

        if (response.ok) {
          setStatus("success");
          // Reset form after delay
          setTimeout(() => {
            setStatus("idle");
            setFile(null);
            setTargetLeader("");
            setDescription("");
          }, 4000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Submission failed:", error);
        setStatus("error");
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white">
      {/* Top Fixed Global Context Header Strip */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded tracking-tighter uppercase animate-pulse">
              LIVE MATRIX
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                FACTS TUPU{" "}
                <span className="text-red-500 text-xs font-mono font-normal">
                  v1.0
                </span>
              </h1>
              <p className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                Autonomous Anti-Corruption Registry Matrix
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Primary Navigation System */}
      <nav className="bg-slate-950 border-b border-slate-900 sticky top-[68px] z-40 px-4">
        <div className="max-w-7xl mx-auto flex overflow-x-auto space-x-8">
          <a
            href="/dashboard"
            className="border-b-2 border-transparent text-slate-400 hover:text-slate-200 py-3.5 text-xs font-mono font-bold uppercase whitespace-nowrap flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" /> Accountability Wall
          </a>
          <a
            href="/dashboard/monitor"
            className="border-b-2 border-transparent text-slate-400 hover:text-slate-200 py-3.5 text-xs font-mono font-bold uppercase whitespace-nowrap flex items-center gap-2"
          >
            <Activity className="w-4 h-4" /> AI Live Monitor
          </a>
          <a
            href="/dashboard/chipukizi"
            className="border-b-2 border-transparent text-slate-400 hover:text-slate-200 py-3.5 text-xs font-mono font-bold uppercase whitespace-nowrap flex items-center gap-2"
          >
            <Users className="w-4 h-4" /> Chipukizi Hub
          </a>
          <a
            href="/dashboard/submit"
            className="border-b-2 border-amber-500 text-amber-500 py-3.5 text-xs font-mono font-bold uppercase whitespace-nowrap flex items-center gap-2 ml-auto"
          >
            <FileText className="w-4 h-4" /> Submit Intel (Journalists)
          </a>
        </div>
      </nav>

      {/* Main Container Layout */}
      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        {/* Portal Information Header */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="bg-amber-500/20 p-4 rounded-xl text-amber-500 shrink-0">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-black text-amber-500 tracking-tight">
              Encrypted Dossier Ingestion Portal
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Upload primary evidence (Auditor General leaks, county procurement
              contracts, or media recordings). Files are processed through our
              isolated AI logic gates to verify authenticity, map financial
              discrepancies, and update the target&apos;s Jaba/Impact scores.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-amber-400/80 uppercase font-bold tracking-wider">
              <ShieldCheck className="w-4 h-4" /> End-to-End Encrypted Data
              Pipeline
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <form
          onSubmit={handlePaymentAndSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6"
        >
          <div className="space-y-4">
            {/* Target Leader Selection */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
                Target Representative Identity
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Hon. Governor [Name] - [County]"
                value={targetLeader}
                onChange={(e) => setTargetLeader(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Context Notes */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
                Context & Metadata (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Provide specific pages to scan, contract IDs, or context for the AI processing engine..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:border-amber-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* File Dropzone */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider">
                Secure Upload (PDF, CSV, Audio, Image)
              </label>
              <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 bg-slate-950 rounded-xl p-8 text-center transition-colors relative cursor-pointer group">
                <input
                  type="file"
                  required
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.mp3,.png,.jpg"
                />
                <UploadCloud className="w-8 h-8 text-slate-600 group-hover:text-amber-500 mx-auto mb-3 transition-colors" />
                {file ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-200">
                      {file.name}
                    </p>
                    <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                      Payload Ready
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm text-slate-400">
                      Drag and drop your file here, or click to browse
                    </p>
                    <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                      Max file size: 50MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action & Payment Footer */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-300 font-medium">
                  Processing Fee Required
                </p>
                <p className="text-[10px] text-slate-500 mt-1 max-w-sm">
                  To prevent DDOS attacks on our AI processing nodes, a standard
                  verification fee of{" "}
                  <strong className="text-slate-300">KES 200</strong> is
                  required per submission.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={status !== "idle"}
              className="w-full md:w-auto bg-amber-600 hover:bg-amber-500 text-slate-950 font-black px-6 py-3 rounded-lg text-sm uppercase tracking-tight transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "idle" && (
                <>
                  <CreditCard className="w-4 h-4" /> Pay & Submit Intel
                </>
              )}
              {status === "processing_payment" && (
                <>
                  <Activity className="w-4 h-4 animate-spin" /> Verifying
                  Payment...
                </>
              )}
              {status === "uploading" && (
                <>
                  <Server className="w-4 h-4 animate-pulse" /> Encrypting &
                  Routing...
                </>
              )}
              {status === "success" && (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Pipeline Secured
                </>
              )}
              {status === "error" && "Connection Failed - Retry"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
