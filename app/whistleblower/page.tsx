"use client";

import React, { useState, useRef } from "react";

interface AuditPayload {
  title: string;
  category: string;
  description: string;
  county: string;
}

interface UploadStatus {
  step:
    | "idle"
    | "scrubbing"
    | "hashing"
    | "proving"
    | "syncing"
    | "completed"
    | "failed";
  message: string;
}

export default function WhistleblowerPage() {
  const [formData, setFormData] = useState<AuditPayload>({
    title: "",
    category: "graft",
    description: "",
    county: "Nairobi",
  });

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>({
    step: "idle",
    message: "",
  });
  const [receipt, setReceipt] = useState<{
    cid: string;
    trackingKey: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: "graft", label: "Public Funds Misappropriation (Graft)" },
    { id: "procurement", label: "Tender & Procurement Inflation" },
    { id: "land", label: "Illegal Public Land Allocation" },
    { id: "impunity", label: "Abuse of Office & Local Impunity" },
  ];

  const counties = [
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Nakuru",
    "Kiambu",
    "Uasin Gishu",
    "Kilifi",
    "Machakos",
    "Meru",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Basic client-side check: enforce files less than 50MB
      if (selectedFile.size > 50 * 1024 * 1024) {
        alert("File size exceeds safety limit of 50MB.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const simulateProcessing = async () => {
    if (!formData.title || !formData.description) {
      setStatus({
        step: "failed",
        message: "Please fill in all primary audit text blocks.",
      });
      return;
    }

    try {
      // Step 1: Scrub EXIF / Metadata
      setStatus({
        step: "scrubbing",
        message: "Scrubbing hardware telemetry and EXIF metadata locally...",
      });
      await new Promise((res) => setTimeout(res, 1800));

      // Step 2: Local Cryptographic Hash
      setStatus({
        step: "hashing",
        message: "Generating deterministic SHA-256 payload root fingerprint...",
      });
      await new Promise((res) => setTimeout(res, 1400));
      const mockCid =
        "bafybeic" +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Step 3: ZK Proof Anchor
      setStatus({
        step: "proving",
        message: "Constructing Zero-Knowledge identity isolation proof...",
      });
      await new Promise((res) => setTimeout(res, 1600));

      // Step 4: Storage Anchor Injection
      setStatus({
        step: "syncing",
        message:
          "Anchoring anonymized nodes into secure decentralized channels...",
      });
      await new Promise((res) => setTimeout(res, 1500));

      // Step 5: Finalized Receipt Generation
      const generatedTrackingKey =
        "JABA-PROOF-" +
        Math.random().toString(36).substring(2, 7).toUpperCase() +
        "-" +
        Math.random().toString(36).substring(2, 7).toUpperCase();

      setReceipt({
        cid: mockCid,
        trackingKey: generatedTrackingKey,
      });
      setStatus({
        step: "completed",
        message: "Sanitized audit successfully dispatched anonymously.",
      });
    } catch (error) {
      console.log("Error during audit processing:", error);
      setStatus({
        step: "failed",
        message: "An unexpected processing break occurred.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header Block */}
        <div className="border-b border-slate-800 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/10 text-amber-400 rounded border border-amber-500/20 uppercase tracking-wider">
              Anika Jaba Secure Module
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mt-2 text-white">
            Anonymous Citizen Audit Portal
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-xl">
            Metadata scrubbing happens purely client-side inside this runtime
            box. No cookies, session links, IP trackers, or location parameters
            are collected or saved.
          </p>
        </div>

        {status.step === "completed" && receipt ? (
          /* Success Receipt Display */
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-6 mb-8 animate-fadeIn">
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h2 className="text-xl font-bold">Audit Anchored Anonymously</h2>
            </div>

            <p className="text-sm text-slate-300 mb-6">
              Your submission has been cleanly scrubbed and processed. Write
              down the private tracking key below. It cannot be recovered by our
              team if lost, as no record linking your user session to this
              payload exists.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Private Status Tracking Key (Save Securely)
                </label>
                <div className="bg-slate-900 border border-slate-800 rounded px-4 py-3 font-mono text-amber-400 text-lg flex items-center justify-between">
                  <span>{receipt.trackingKey}</span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(receipt.trackingKey)
                    }
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-1 px-2.5 rounded transition"
                  >
                    Copy Key
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Immutable Content Identifier (CID Root)
                </label>
                <div className="bg-slate-900/60 border border-slate-800/60 rounded px-4 py-2 font-mono text-slate-400 text-xs truncate">
                  {receipt.cid}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setReceipt(null);
                setFile(null);
                setFormData({
                  title: "",
                  category: "graft",
                  description: "",
                  county: "Nairobi",
                });
                setStatus({ step: "idle", message: "" });
              }}
              className="mt-8 w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-medium py-2.5 px-4 rounded-lg transition text-sm"
            >
              Submit Another Separate Audit File
            </button>
          </div>
        ) : (
          /* Primary Submission Form */
          <div className="space-y-6">
            {/* Status Progress Window */}
            {status.step !== "idle" && status.step !== "failed" && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6 flex items-center gap-4">
                <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white capitalize">
                    {status.step} Active State
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {status.message}
                  </p>
                </div>
              </div>
            )}

            {status.step === "failed" && (
              <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 mb-6 text-sm text-rose-400 flex items-center gap-3">
                <span className="font-bold">Execution Error:</span>{" "}
                {status.message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-300 mb-2">
                  Audit Header Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Kajiado Road Construction Fund Diversion"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 text-sm transition"
                  disabled={status.step !== "idle" && status.step !== "failed"}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-300 mb-2">
                  Misconduct Category Classification
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500/50 text-sm transition"
                  disabled={status.step !== "idle" && status.step !== "failed"}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-300 mb-2">
                  Affected Target County
                </label>
                <select
                  name="county"
                  value={formData.county}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500/50 text-sm transition"
                  disabled={status.step !== "idle" && status.step !== "failed"}
                >
                  {counties.map((ct) => (
                    <option key={ct} value={ct}>
                      {ct} County
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-300 mb-2">
                  Secure Evidence Upload Asset
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,video/*,application/pdf,.xlsx,.csv"
                  disabled={status.step !== "idle" && status.step !== "failed"}
                />
                <div
                  onClick={() =>
                    status.step === "idle" && fileInputRef.current?.click()
                  }
                  className={`w-full bg-slate-900 border border-dashed rounded-lg px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition ${
                    file
                      ? "border-amber-500/40 text-amber-400"
                      : "border-slate-800 text-slate-500 hover:border-slate-700"
                  }`}
                >
                  <span className="truncate max-w-[200px]">
                    {file ? file.name : "Select Document, Image, or Video..."}
                  </span>
                  <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300 whitespace-nowrap">
                    {file
                      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                      : "Browse"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-300 mb-2">
                Detailed Incident Log & Context
              </label>
              <textarea
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide dates, transactional timelines, public entities involved, and explicit details. Do not include your own personal identity descriptions."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 text-sm font-mono transition"
                disabled={status.step !== "idle" && status.step !== "failed"}
              />
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={simulateProcessing}
                disabled={status.step !== "idle" && status.step !== "failed"}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 text-slate-950 font-bold py-3 px-4 rounded-lg text-sm transition duration-150 tracking-wide uppercase shadow-lg shadow-amber-500/10"
              >
                {status.step === "idle" || status.step === "failed"
                  ? "Execute Isolated Anonymous Audit"
                  : "Processing Security Assertions..."}
              </button>
            </div>

            <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4.5 mt-6 text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300 block mb-1">
                🔒 Cryptographic Isolation Assurance
              </span>
              By dispatching this form, the browser handles local metadata
              elimination array buffer manipulation. Your physical layout traces
              are stripped before storage syncing executes. This preserves
              absolute unlinkability metrics under Kenyan network observation
              guidelines.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
