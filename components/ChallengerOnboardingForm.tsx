/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";

interface WardLookupElement {
  ward_id: number;
  ward_name: string;
}

interface ConstituencyLookupElement {
  constituency_id: number;
  constituency_name: string;
  wards: WardLookupElement[];
}

interface CountyLookupElement {
  county_code: string;
  county_name: string;
  hq_town: string;
  constituencies: ConstituencyLookupElement[];
}

interface RegionLookupResponse {
  region_id: number;
  zone_name: string;
  counties: CountyLookupElement[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ChallengerOnboardingForm({
  onCancel,
  onRegistrationSuccess,
}: {
  onCancel: () => void;
  onRegistrationSuccess: (data: unknown) => void;
}) {
  const [formData, setFormData] = useState({
    full_name: "",
    party_affiliation: "",
    target_role: "mp",
    associated_id: "",
    manifesto_summary: "",
  });

  // Document Management States
  const [manifestoFile, setManifestoFile] = useState<File | null>(null);
  const [scanStatus, setScanStatus] = useState<
    "idle" | "scanning" | "verified" | "failed"
  >("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Geo Engine States
  const [geoTree, setGeoTree] = useState<RegionLookupResponse[]>([]);
  const [isLoadingGeo, setIsLoadingGeo] = useState(true);

  // Selected Hierarchical Node Keys
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStage, setSubmissionStage] = useState(
    "Pay KES 2,500 & Deploy Profile",
  );
  const [errorMessage, setErrorMessage] = useState("");

  // Synchronize Administrative Tree Structures
  useEffect(() => {
    async function loadGeoHierarchy() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/geo/lookup`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        if (!res.ok)
          throw new Error(
            "Could not parse operational administrative boundaries.",
          );
        const data: RegionLookupResponse[] = await res.json();
        setGeoTree(data);
      } catch (err) {
        console.error("Geo Tree Engine crash:", err);
        setErrorMessage(
          "Failed to acquire regional routing indices from server.",
        );
      } finally {
        setIsLoadingGeo(false);
      }
    }
    loadGeoHierarchy();
  }, []);

  // Cascading Selection Memoization
  const availableCounties = useMemo(() => {
    if (!selectedRegion) return [];
    const matchedRegion = geoTree.find(
      (r) => String(r.region_id) === selectedRegion,
    );
    return matchedRegion ? matchedRegion.counties : [];
  }, [geoTree, selectedRegion]);

  const availableConstituencies = useMemo(() => {
    if (!selectedCounty) return [];
    const matchedCounty = availableCounties.find(
      (c) => c.county_code === selectedCounty,
    );
    return matchedCounty ? matchedCounty.constituencies : [];
  }, [availableCounties, selectedCounty]);

  const availableWards = useMemo(() => {
    if (!selectedConstituency) return [];
    const matchedConstituency = availableConstituencies.find(
      (c) => String(c.constituency_id) === selectedConstituency,
    );
    return matchedConstituency ? matchedConstituency.wards : [];
  }, [availableConstituencies, selectedConstituency]);

  // Handle auto ID sync based on targeted seat assignment layer
  useEffect(() => {
    let targetId = "";
    const role = formData.target_role;

    if (["governor", "senator", "women_rep"].includes(role)) {
      targetId = selectedCounty;
    } else if (role === "mp") {
      targetId = selectedConstituency;
    } else if (role === "mca") {
      targetId = selectedWard;
    }

    setFormData((prev) => ({ ...prev, associated_id: targetId }));
  }, [
    formData.target_role,
    selectedCounty,
    selectedConstituency,
    selectedWard,
  ]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "target_role") {
      setSelectedRegion("");
      setSelectedCounty("");
      setSelectedConstituency("");
      setSelectedWard("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        setErrorMessage(
          "Invalid format. Please attach a valid PDF document dossier.",
        );
        setManifestoFile(null);
        setScanStatus("failed");
        return;
      }
      setManifestoFile(file);
      setScanStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    if (!formData.associated_id) {
      setErrorMessage(
        "Please complete all dependent location dropdowns for your targeted track tier.",
      );
      setIsSubmitting(false);
      return;
    }

    if (formData.manifesto_summary.length < 20) {
      setErrorMessage(
        "Manifesto summary text must be at least 20 characters long.",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      // Step A: Simulate Scanning & Verification Layers
      if (manifestoFile) {
        setScanStatus("scanning");
        setSubmissionStage("Scanning document metrics...");
        await new Promise((resolve) => setTimeout(resolve, 1500)); // OCR execution simulator

        setSubmissionStage("Verifying payload signature...");
        await new Promise((resolve) => setTimeout(resolve, 1200)); // Integrity block simulator
        setScanStatus("verified");
      }

      setSubmissionStage("Processing gateway context...");

      // Step B: Package multi-part dataset transmission payload
      const payload = new FormData();
      payload.append("full_name", formData.full_name.trim());
      payload.append("party_affiliation", formData.party_affiliation);
      payload.append("target_role", formData.target_role);
      payload.append("associated_id", formData.associated_id);
      payload.append("manifesto_summary", formData.manifesto_summary);

      if (manifestoFile) {
        payload.append("manifesto_document", manifestoFile);
      }

      // NOTE: Content-Type headers are excluded here to let the client agent define boundary limits implicitly
      const response = await fetch(
        `${API_BASE_URL}/api/v1/challengers/onboard`,
        {
          method: "POST",
          body: payload,
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to register challenger profile.",
        );
      }

      onRegistrationSuccess(
        data.challenger_data || {
          full_name: formData.full_name,
          target_role: formData.target_role,
          associated_id: formData.associated_id,
        },
      );
    } catch (err: unknown) {
      setScanStatus("failed");
      setErrorMessage(
        (err as Error).message || "Network layer processing failure.",
      );
    }
    {
      setIsSubmitting(false);
      setSubmissionStage("Pay KES 2,500 & Deploy Profile");
    }
  };

  const showConstituencyField = ["mp", "mca"].includes(formData.target_role);
  const showWardField = formData.target_role === "mca";

  return (
    <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-8 shadow-2xl animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
          Deploy Alternative Track Profile
        </h2>
        <p className="mt-1 text-sm sm:text-xs text-slate-400">
          Complete verification registration to establish your dashboard metrics
          interface.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-lg bg-rose-950/50 border border-rose-800 p-3 text-xs font-medium text-rose-400">
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* OFFICIAL NAME */}
        <div>
          <label className="block text-sm sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Official Name
          </label>
          <input
            type="text"
            name="full_name"
            required
            value={formData.full_name}
            onChange={handleChange}
            placeholder="e.g., Hon. Janet Omwamba"
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-emerald-500"
          />
        </div>

        {/* PARTY & TARGET LEVEL */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div>
            <label className="block text-sm sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Party Affiliation
            </label>
            <input
              type="text"
              name="party_affiliation"
              required
              value={formData.party_affiliation}
              onChange={handleChange}
              placeholder="e.g., Independent / ODM / UDA"
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Target Seat Layer
            </label>
            <select
              name="target_role"
              value={formData.target_role}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-500"
            >
              <option value="governor">Governor</option>
              <option value="senator">Senator</option>
              <option value="women_rep">Women Representative</option>
              <option value="mp">Member of Parliament (MP)</option>
              <option value="mca">Member of County Assembly (MCA)</option>
            </select>
          </div>
        </div>

        {/* CASCADING BOUNDARY MATRIX */}
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 space-y-4">
          <span className="text-base sm:text-[11px] font-bold text-emerald-400 uppercase tracking-widest block border-b border-slate-800/60 pb-1">
            Target Boundary Area Lookup
          </span>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div>
              <label className="block text-xs sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                1. Region Zone
              </label>
              <select
                required
                disabled={isLoadingGeo}
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedCounty("");
                  setSelectedConstituency("");
                  setSelectedWard("");
                }}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-500 disabled:opacity-40"
              >
                <option value="">
                  {isLoadingGeo
                    ? "-- Synchronizing... --"
                    : "-- Select Region --"}
                </option>
                {geoTree.map((r) => (
                  <option key={r.region_id} value={r.region_id}>
                    {r.zone_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                2. County Jurisdiction
              </label>
              <select
                required
                disabled={!selectedRegion}
                value={selectedCounty}
                onChange={(e) => {
                  setSelectedCounty(e.target.value);
                  setSelectedConstituency("");
                  setSelectedWard("");
                }}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-500 disabled:opacity-40"
              >
                <option value="">-- Select County --</option>
                {availableCounties.map((c) => (
                  <option key={c.county_code} value={c.county_code}>
                    {c.county_name}
                  </option>
                ))}
              </select>
            </div>

            {showConstituencyField && (
              <div>
                <label className="block text-xs sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  3. Constituency
                </label>
                <select
                  required
                  disabled={!selectedCounty}
                  value={selectedConstituency}
                  onChange={(e) => {
                    setSelectedConstituency(e.target.value);
                    setSelectedWard("");
                  }}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-500 disabled:opacity-40"
                >
                  <option value="">-- Select Constituency --</option>
                  {availableConstituencies.map((constItem) => (
                    <option
                      key={constItem.constituency_id}
                      value={constItem.constituency_id}
                    >
                      {constItem.constituency_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {showWardField && (
              <div>
                <label className="block text-xs sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  4. Local Assembly Ward
                </label>
                <select
                  required
                  disabled={!selectedConstituency}
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-500 disabled:opacity-40"
                >
                  <option value="">-- Select Ward --</option>
                  {availableWards.map((w) => (
                    <option key={w.ward_id} value={w.ward_id}>
                      {w.ward_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* TEXT SUMMARY FIELDS */}
        <div>
          <label className="block text-sm sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Manifesto Executive Summary
          </label>
          <textarea
            name="manifesto_summary"
            required
            rows={3}
            value={formData.manifesto_summary}
            onChange={handleChange}
            placeholder="Outline your baseline structural pillars and developmental objectives for evaluation..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-emerald-500 resize-none"
          />
        </div>

        {/* UPGRADED PDF SCANNING & VERIFICATION COMPONENT */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Full Manifesto Documentation (Scanned PDF Check)
          </label>
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`w-full rounded-xl border border-dashed p-4 flex flex-col items-center justify-center cursor-pointer transition bg-slate-950/20 ${
              scanStatus === "scanning"
                ? "border-amber-500/60 bg-amber-950/5"
                : scanStatus === "verified"
                  ? "border-emerald-500/60 bg-emerald-950/5"
                  : scanStatus === "failed"
                    ? "border-rose-500/60 bg-rose-950/5"
                    : manifestoFile
                      ? "border-slate-600 bg-slate-950/60"
                      : "border-slate-800 hover:border-slate-700"
            }`}
          >
            {!manifestoFile ? (
              <>
                <svg
                  className="w-6 h-6 text-slate-500 mb-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-sm sm:text-xs font-medium text-slate-300">
                  Click to attach manifesto file
                </span>
                <span className="text-sm sm:text-[10px] text-slate-500 mt-0.5">
                  Supports Scanned PDFs up to 15MB
                </span>
              </>
            ) : (
              <div className="w-full flex items-center justify-between text-xs px-1">
                <div className="flex items-center gap-2.5 truncate max-w-[85%]">
                  <svg
                    className={`w-5 h-5 flex-shrink-0 ${scanStatus === "verified" ? "text-emerald-400" : "text-rose-400"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div className="flex flex-col truncate">
                    <span className="text-slate-200 font-medium truncate">
                      {manifestoFile.name}
                    </span>
                    <span className="text-sm sm:text-[10px] text-slate-500">
                      {(manifestoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>

                {/* Sub-status Indicator Badges */}
                {scanStatus === "idle" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setManifestoFile(null);
                      setScanStatus("idle");
                    }}
                    className="text-sm sm:text-[10px] font-bold tracking-wide uppercase text-slate-500 hover:text-slate-300 transition"
                  >
                    Remove
                  </button>
                )}
                {scanStatus === "scanning" && (
                  <span className="text-sm sm:text-[10px] font-bold text-amber-400 uppercase animate-pulse flex items-center gap-1">
                    ⚡ Scanning OCR...
                  </span>
                )}
                {scanStatus === "verified" && (
                  <span className="text-sm sm:text-[10px] font-bold text-emerald-400 uppercase bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.5 rounded">
                    ✓ Verified Structure
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* FEE ESCROW STATEMENT */}
        <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800/60 text-base sm:text-[11px] text-slate-400">
          <span className="font-bold text-white uppercase block mb-0.5">
            Verification Fee Commitment
          </span>
          By deploying this alternative tracking model, you are initiating a
          tokenized gateway request of{" "}
          <span className="text-emerald-400 font-mono font-bold">
            KES 2,500
          </span>
          .
        </div>

        {/* ACTION BLOCK */}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-slate-800 px-4 py-3 text-sm font-bold text-slate-400 hover:bg-slate-800 transition sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoadingGeo}
            className="w-full rounded-lg bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition disabled:opacity-50 sm:w-auto sm:min-w-[220px]"
          >
            {isSubmitting ? submissionStage : "Pay KES 2,500 & Deploy Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
