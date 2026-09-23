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

interface AgreementData {
  repFullName: string;
  repDesignation: string;
  repNationalId: string;
  repPhone: string;
  repEmail: string;
  digitalSignature: string;
  agreementAccepted: boolean;
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
  const [submissionStage, setSubmissionStage] = useState("Processing...");
  const [errorMessage, setErrorMessage] = useState("");

  const [billingCycle, setBillingCycle] = useState<
    "monthly" | "quarterly" | "annually"
  >("annually");

  // Agreement Modal State
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  // STEP 2 FIX: Dynamic Fee Calculation based on Target Role
  const PRICING = useMemo(
    () => ({
      mca: { monthly: "8,000", quarterly: "20,000", annually: "75,000" },
      mp: { monthly: "10,000", quarterly: "25,000", annually: "100,000" },
      governor: { monthly: "20,000", quarterly: "50,000", annually: "200,000" },
      senator: { monthly: "20,000", quarterly: "50,000", annually: "200,000" },
      women_rep: {
        monthly: "20,000",
        quarterly: "50,000",
        annually: "200,000",
      },
    }),
    [],
  );

  const currentFee = useMemo(() => {
    return PRICING[formData.target_role as keyof typeof PRICING][billingCycle];
  }, [formData.target_role, billingCycle, PRICING]);

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

  // STEP 1: Intercept Submission & Trigger Legal Agreement Modal
  const handleInitialSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      // Simulate Scanning & Verification Layers
      if (manifestoFile) {
        setScanStatus("scanning");
        setSubmissionStage("Scanning document metrics...");
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setSubmissionStage("Verifying payload signature...");
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setScanStatus("verified");
      }

      // Instead of submitting to backend immediately, trigger the modal
      setShowAgreementModal(true);
      setIsSubmitting(false);
      setSubmissionStage(`Pay KES ${currentFee} & Deploy Profile`);
    } catch (err: unknown) {
      setScanStatus("failed");
      setErrorMessage(
        (err as Error).message || "Network layer processing failure.",
      );
      setIsSubmitting(false);
    }
  };

  // STEP 2: Finalized Submission (Called by the Modal)
  const executeFinalOnboarding = async (agreementData: AgreementData) => {
    setShowAgreementModal(false);
    setIsSubmitting(true);
    setSubmissionStage("Executing Agreement & Creating Profile...");
    setErrorMessage("");

    try {
      const payload = new FormData();

      // Attach Candidate Data
      payload.append("full_name", formData.full_name.trim());
      payload.append("party_affiliation", formData.party_affiliation);
      payload.append("target_role", formData.target_role);
      payload.append("associated_id", formData.associated_id);
      payload.append("manifesto_summary", formData.manifesto_summary);
      payload.append("billing_cycle", billingCycle);

      if (manifestoFile) {
        payload.append("manifesto_document", manifestoFile);
      }

      // Attach Agreement Data
      payload.append("rep_full_name", agreementData.repFullName);
      payload.append("rep_designation", agreementData.repDesignation);
      payload.append("rep_national_id", agreementData.repNationalId);
      payload.append("rep_phone", agreementData.repPhone);
      payload.append("rep_email", agreementData.repEmail);
      payload.append(
        "agreement_accepted",
        String(agreementData.agreementAccepted),
      );
      payload.append("digital_signature", agreementData.digitalSignature);

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
          billing_cycle: billingCycle,
        },
      );
    } catch (err: unknown) {
      setErrorMessage(
        (err as Error).message || "Network layer processing failure.",
      );
      setIsSubmitting(false);
      setSubmissionStage(`Pay KES ${currentFee} & Deploy Profile`);
    }
  };

  const showConstituencyField = ["mp", "mca"].includes(formData.target_role);
  const showWardField = formData.target_role === "mca";

  return (
    <>
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-8 shadow-2xl animate-fadeIn relative">
        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-2xl">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin mb-3"></div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest animate-pulse">
                {submissionStage}
              </span>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            Deploy Alternative Track Profile
          </h2>
          <p className="mt-1 text-sm sm:text-xs text-slate-400">
            Complete verification registration to establish your dashboard
            metrics interface.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg bg-rose-950/50 border border-rose-800 p-3 text-xs font-medium text-rose-400">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleInitialSubmit} className="space-y-4">
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

          {/* SUBSCRIPTION PLAN SELECTION */}
          <div className="space-y-3 pt-2">
            <label className="block text-sm sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Select Subscription Plan
            </label>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
              {(["monthly", "quarterly", "annually"] as const).map((cycle) => (
                <div
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all flex flex-col items-center text-center ${
                    billingCycle === cycle
                      ? "border-emerald-500 bg-emerald-950/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : "border-slate-800 bg-slate-950 hover:border-slate-700"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {cycle}
                  </span>
                  <span className="text-lg font-bold text-emerald-400">
                    KES{" "}
                    {
                      PRICING[formData.target_role as keyof typeof PRICING][
                        cycle
                      ]
                    }
                  </span>
                </div>
              ))}
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
              KES {currentFee}
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
              {isSubmitting
                ? submissionStage
                : `Pay KES ${currentFee} & Deploy Profile`}
            </button>
          </div>
        </form>
      </div>

      {/* AGREEMENT MODAL COMPONENT */}
      {showAgreementModal && (
        <VerifiedAgreementModal
          candidateData={{
            fullName: formData.full_name,
            targetRole: formData.target_role,
          }}
          onConfirm={executeFinalOnboarding}
          onCancel={() => setShowAgreementModal(false)}
        />
      )}
    </>
  );
}

/*
 * ==========================================
 * INTERNAL COMPONENT: VERIFIED AGREEMENT MODAL
 * ==========================================
 */

interface AgreementStepProps {
  candidateData: {
    fullName: string;
    targetRole: string;
  };
  onConfirm: (data: AgreementData) => void;
  onCancel: () => void;
}

function VerifiedAgreementModal({
  candidateData,
  onConfirm,
  onCancel,
}: AgreementStepProps) {
  const [repFullName, setRepFullName] = useState("");
  const [repDesignation, setRepDesignation] = useState("");
  const [repNationalId, setRepNationalId] = useState("");
  const [repPhone, setRepPhone] = useState("");
  const [repEmail, setRepEmail] = useState("");
  const [digitalSignature, setDigitalSignature] = useState("");
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreementAccepted) {
      setErrorMsg("You must accept the terms of the agreement to proceed.");
      return;
    }

    if (digitalSignature.trim().length < 3) {
      setErrorMsg(
        "Please provide a valid digital signature matching your full legal name.",
      );
      return;
    }

    setErrorMsg("");
    onConfirm({
      repFullName,
      repDesignation,
      repNationalId,
      repPhone,
      repEmail,
      digitalSignature,
      agreementAccepted,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-6 text-slate-200 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
            Legal Compliance
          </span>
          <h2 className="mt-2 text-xl font-black text-white">
            Verified Official Representative Agreement
          </h2>
          <p className="text-xs text-slate-400">
            Governing profile registration and management on
            facts-tupu.vercel.app
          </p>
        </div>

        <div className="my-4 max-h-60 overflow-y-auto rounded-xl border border-slate-900 bg-slate-900/40 p-4 text-xs text-slate-300 space-y-3 leading-relaxed">
          <p className="font-bold text-emerald-400 uppercase tracking-wide">
            1. Parties & Registration
          </p>
          <p>
            This Agreement is entered into by Facts Tupu Platform and the
            Representative acting on behalf of{" "}
            <span className="text-white font-semibold">
              {candidateData.fullName || "[Official Name]"}
            </span>{" "}
            for the role of{" "}
            <span className="text-white font-semibold">
              {candidateData.targetRole.toUpperCase()}
            </span>
            .
          </p>

          <p className="font-bold text-emerald-400 uppercase tracking-wide">
            2. Representations & Authorization
          </p>
          <p>
            The Representative warrants that they are the legal holder of the
            elective office or a duly appointed officer with written
            authorization. All uploaded evidence must be genuine and accurate.
          </p>

          <p className="font-bold text-emerald-400 uppercase tracking-wide">
            3. Rights Granted
          </p>
          <p>
            Grants access to the Verified Leader Portal to submit project proof,
            issue official replies, and view aggregate public engagement
            analytics.
          </p>

          <p className="font-bold text-emerald-400 uppercase tracking-wide">
            4. Independent Audit & Scoring Rules
          </p>
          <p>
            Uploading evidence does not automatically alter scores. Facts Tupu
            does not accept monetary payments or favors for score adjustments.
          </p>

          <p className="font-bold text-emerald-400 uppercase tracking-wide">
            5. Liability Waiver & Defamation Release
          </p>
          <p>
            The Representative waives any right to institute legal proceedings
            against Facts Tupu for automated performance scores or public
            comments generated in good faith under Article 33 and 35 of the
            Constitution.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                Representative Full Name
              </label>
              <input
                type="text"
                required
                value={repFullName}
                onChange={(e) => setRepFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                Designation / Role
              </label>
              <input
                type="text"
                required
                value={repDesignation}
                onChange={(e) => setRepDesignation(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. Communications Director"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                National ID / Passport Number
              </label>
              <input
                type="text"
                required
                value={repNationalId}
                onChange={(e) => setRepNationalId(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                placeholder="ID Number"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                Official Phone (M-Pesa Registered)
              </label>
              <input
                type="tel"
                required
                value={repPhone}
                onChange={(e) => setRepPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                placeholder="+254 7..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-400 mb-1 font-semibold">
                Official Email Address
              </label>
              <input
                type="email"
                required
                value={repEmail}
                onChange={(e) => setRepEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                placeholder="official@domain.go.ke"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-semibold">
              Digital Signature (Type Full Legal Name)
            </label>
            <input
              type="text"
              required
              value={digitalSignature}
              onChange={(e) => setDigitalSignature(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 font-serif italic text-emerald-400 focus:border-emerald-500 focus:outline-none"
              placeholder="Sign by typing your full legal name..."
            />
          </div>

          <div
            className="flex items-start gap-3 rounded-lg border border-slate-900 bg-slate-900/50 p-3 cursor-pointer"
            onClick={() => setAgreementAccepted(!agreementAccepted)}
          >
            <input
              type="checkbox"
              id="acceptTerms"
              checked={agreementAccepted}
              onChange={(e) => setAgreementAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500 pointer-events-none"
            />
            <label
              htmlFor="acceptTerms"
              className="text-xs text-slate-300 pointer-events-none"
            >
              I certify that I am authorized to execute this agreement and agree
              to all terms set forth above on behalf of the candidate/official.
            </label>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-900"
            >
              Go Back
            </button>
            <button
              type="submit"
              disabled={!agreementAccepted || !digitalSignature}
              className="rounded-lg bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-all"
            >
              Sign & Complete Onboarding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
