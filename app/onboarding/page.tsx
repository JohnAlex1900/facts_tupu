/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApiV1BaseUrl } from "@/app/lib/api_client";
import {
  FileText,
  Loader2,
  AlertCircle,
  ChevronRight,
  User,
  UploadCloud,
  CheckCircle,
  MapPin,
  Briefcase,
} from "lucide-react";
import PremiumCheckoutTerminal from "@/components/PremiumCheckoutTerminal";

// 1. Core Constitutional Kenyan Electoral Registries
const KENYAN_COUNTIES = [
  "Nairobi",
  "Mombasa",
  "Kwale",
  "Kilifi",
  "Tana River",
  "Lamu",
  "Taita Taveta",
  "Garissa",
  "Wajir",
  "Mandera",
  "Marsabit",
  "Isiolo",
  "Meru",
  "Tharaka-Nithi",
  "Embu",
  "Kitui",
  "Machakos",
  "Makueni",
  "Nyandarua",
  "Nyeri",
  "Kirinyaga",
  "Murang'a",
  "Kiambu",
  "Turkana",
  "West Pokot",
  "Samburu",
  "Trans Nzoia",
  "Uasin Gishu",
  "Elgeyo-Marakwet",
  "Nandi",
  "Baringo",
  "Laikipia",
  "Nakuru",
  "Narok",
  "Kajiado",
  "Kericho",
  "Bomet",
  "Kakamega",
  "Vihiga",
  "Bungoma",
  "Busia",
  "Siaya",
  "Kisumu",
  "Homa Bay",
  "Migori",
  "Kisii",
  "Nyamira",
].sort();

const LEADERSHIP_ROLES = [
  { id: "governor", label: "County Governor", scope: "county" },
  { id: "senator", label: "County Senator", scope: "county" },
  { id: "woman_rep", label: "County Woman Representative", scope: "county" },
  {
    id: "mp",
    label: "Member of National Assembly (MP)",
    scope: "constituency",
  },
  { id: "mca", label: "Member of County Assembly (MCA)", scope: "ward" },
];

// 2. Comprehensive Nairobi Sub-Electoral Node Tree Mapping
const NAIROBI_GEOGRAPHY: Record<string, string[]> = {
  "Lang'ata": [
    "Karen",
    "South C",
    "Nyayo Highrise",
    "Mugumo-ini",
    "Nairobi West",
  ],
  Westlands: ["Kitisuru", "Parklands", "Karura", "Kangemi", "Mountain View"],
  Kibra: ["Laini Saba", "Lindi", "Makina", "Woodley", "Sarang'ombe"],
  Roysambu: ["Roysambu", "Garden Estate", "Ridgeways", "Kahawa", "Zimmerman"],
  Starehe: [
    "Nairobi Central",
    "Ngara",
    "Pangani",
    "Ziwani",
    "Landimawe",
    "Nairobi South",
  ],
  "Dagoretti North": [
    "Kilimani",
    "Kawangware",
    "Gatina",
    "Kileleshwa",
    "Kabiro",
  ],
  "Embakasi East": [
    "Pipeline",
    "Savannah",
    "Imara Daima",
    "Upper Savannah",
    "Mihango",
  ],
};

export default function ChallengerOnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedChallengerId, setGeneratedChallengerId] = useState("");

  // Target Location and Position States
  const [selectedRole, setSelectedRole] = useState(LEADERSHIP_ROLES[0]);
  const [selectedCounty, setSelectedCounty] = useState("Nairobi");
  const [selectedConstituency, setSelectedConstituency] = useState("Lang'ata");
  const [selectedWard, setSelectedWard] = useState("Karen");

  // Document Upload States
  const [fileName, setFileName] = useState("");
  const [documentText, setDocumentText] = useState("");

  // Form Fields State
  const [formData, setFormData] = useState({
    name: "",
    national_id: "",
    party_affiliation: "Independent",
    background_dossier: "",
    manifesto_headline: "",
    target_seat_id: "",
  });

  const handlePaymentSuccess = () => {
    router.push(`/dashboard`);
  };

  // Automatically reset options when the role or county updates
  useEffect(() => {
    if (selectedCounty !== "Nairobi") {
      setSelectedConstituency("");
      setSelectedWard("");
    } else {
      const defaultConst = Object.keys(NAIROBI_GEOGRAPHY)[0];
      setSelectedConstituency(defaultConst);
      setSelectedWard(NAIROBI_GEOGRAPHY[defaultConst][0]);
    }
  }, [selectedCounty, selectedRole]);

  useEffect(() => {
    if (
      selectedCounty === "Nairobi" &&
      NAIROBI_GEOGRAPHY[selectedConstituency]
    ) {
      setSelectedWard(NAIROBI_GEOGRAPHY[selectedConstituency][0]);
    }
  }, [selectedCounty, selectedConstituency]);

  // Document parsing loop
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setDocumentText(text);
    };
    reader.readAsText(file);
  };

  const handleRegisterChallenger = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Derive a unique, trackable seat code based on choices
    let dynamicSeatId = `SEAT-${selectedCounty.toLowerCase()}`;
    if (selectedRole.scope === "constituency") {
      dynamicSeatId += `-${selectedConstituency.toLowerCase().replace(/[^a-z0-9]/g, "-")}-mp`;
    } else if (selectedRole.scope === "ward") {
      dynamicSeatId += `-${selectedWard.toLowerCase().replace(/[^a-z0-9]/g, "-")}-mca`;
    } else {
      dynamicSeatId += `-${selectedRole.id}`;
    }

    let token: string | null = null;

    if (typeof window !== "undefined") {
      token = localStorage.getItem("facts_tupu_token");
    }

    const payload = {
      name: formData.name,
      national_id_or_passport: formData.national_id.toString(),
      target_seat_id: dynamicSeatId,
      party_affiliation: formData.party_affiliation,
      background_dossier: formData.background_dossier,
      manifesto_pillars: [
        `Role Objective: ${selectedRole.label}`,
        `Electoral Bounds: County: ${selectedCounty}${selectedConstituency ? `, Constituency: ${selectedConstituency}` : ""}${selectedWard ? `, Ward: ${selectedWard}` : ""}`,
        `Strategic Agenda: ${formData.manifesto_headline}`,
        documentText
          ? `Uploaded Ingested Text: ${documentText.substring(0, 3000)}`
          : "No supplementary documentation file attached.",
      ],
      declared_achievements: ["Verified Onboarded Candidate Match Profile"],
      social_handles: {
        county: selectedCounty,
        constituency: selectedConstituency || "N/A",
        ward: selectedWard || "N/A",
      },
    };

    try {
      const baseUrl = getApiV1BaseUrl();
      const res = await fetch(`${baseUrl}/challengers/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && Array.isArray(data.detail)) {
          const exactErrors = data.detail
            .map(
              (err: unknown) =>
                `${(err as { loc?: string[] }).loc?.join(".")}: ${(err as { msg?: string }).msg}`,
            )
            .join(" | ");
          throw new Error(`Registration Match Failure -> ${exactErrors}`);
        }
        throw new Error(
          data.detail || "Failed to finalize candidate ledger footprint.",
        );
      }

      setGeneratedChallengerId(data.challenger_id);
      setStep(2);
    } catch (err: unknown) {
      console.error("[Payload Error]:", (err as Error).message);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl space-y-6 py-10">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">
            Candidate Ledger Onboarding Gateway
          </h1>
          <p className="text-xs text-slate-400 font-mono tracking-wider">
            Step {step} of 2:{" "}
            {step === 1
              ? "Electoral Target Coordinates"
              : "Premium Activation Matrix"}
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <div
              className={`h-1.5 w-12 rounded-full ${step >= 1 ? "bg-emerald-500" : "bg-slate-800"}`}
            />
            <div
              className={`h-1.5 w-12 rounded-full ${step >= 2 ? "bg-emerald-500" : "bg-slate-800"}`}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-rose-950/30 border border-rose-500/20 p-4 rounded-xl text-rose-400 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {step === 1 && (
          <form
            onSubmit={handleRegisterChallenger}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-8 shadow-2xl"
          >
            {/* SECTION 1: Core Profile Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2 uppercase tracking-wide">
                <User className="w-4 h-4 text-emerald-400" /> 1. Identity
                Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Full Candidate Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Hon. Silas Kiprop"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    National ID / Passport String
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.national_id}
                    onChange={(e) =>
                      setFormData({ ...formData, national_id: e.target.value })
                    }
                    placeholder="e.g. 34890211"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Political Party Affiliation
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.party_affiliation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        party_affiliation: e.target.value,
                      })
                    }
                    placeholder="e.g. ODM, UDA, Jubilee or Independent"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Dynamic Electoral Location Selection Matrix */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2 uppercase tracking-wide">
                <MapPin className="w-4 h-4 text-emerald-400" /> 2. Targeted Seat
                Coordinates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    <Briefcase className="w-3 h-3 inline mr-1 text-slate-500" />{" "}
                    Contested Position Role
                  </label>
                  <select
                    value={selectedRole.id}
                    onChange={(e) => {
                      const match = LEADERSHIP_ROLES.find(
                        (r) => r.id === e.target.value,
                      );
                      if (match) setSelectedRole(match);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono cursor-pointer"
                  >
                    {LEADERSHIP_ROLES.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Designated Target County
                  </label>
                  <select
                    value={selectedCounty}
                    onChange={(e) => setSelectedCounty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono cursor-pointer"
                  >
                    {KENYAN_COUNTIES.map((county) => (
                      <option key={county} value={county}>
                        {county} County
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-Region Options: Rendered cleanly for Nairobi */}
                {selectedCounty === "Nairobi" &&
                  selectedRole.scope !== "county" && (
                    <div className="space-y-1 animate-fadeIn">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                        Target Constituency Bounds
                      </label>
                      <select
                        value={selectedConstituency}
                        onChange={(e) =>
                          setSelectedConstituency(e.target.value)
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono cursor-pointer"
                      >
                        {Object.keys(NAIROBI_GEOGRAPHY).map((constituency) => (
                          <option key={constituency} value={constituency}>
                            {constituency} Constituency
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                {selectedCounty === "Nairobi" &&
                  selectedRole.scope === "ward" && (
                    <div className="space-y-1 animate-fadeIn">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                        Target Assembly Local Ward
                      </label>
                      <select
                        value={selectedWard}
                        onChange={(e) => setSelectedWard(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono cursor-pointer"
                      >
                        {(NAIROBI_GEOGRAPHY[selectedConstituency] || []).map(
                          (ward) => (
                            <option key={ward} value={ward}>
                              {ward} Ward
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  )}
              </div>
            </div>

            {/* SECTION 3: Deep Document Upload Loop */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2 uppercase tracking-wide">
                <FileText className="w-4 h-4 text-emerald-400" /> 3. Policy
                Manifestos & Action Plan Dossier
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Core Background Biography Summary
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.background_dossier}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        background_dossier: e.target.value,
                      })
                    }
                    placeholder="Brief historical analysis of your civic, executive, or business background..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Primary Core Agenda Promise Pillar
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.manifesto_headline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        manifesto_headline: e.target.value,
                      })
                    }
                    placeholder="e.g. Committing 25% of development funding pipeline directly to automated tracking dashboards..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans resize-none leading-relaxed"
                  />
                </div>

                {/* Interactive Document Attachment Dropzone */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Supplementary Full Manifesto Document (.txt File Block)
                  </label>
                  <div className="border-2 border-dashed border-slate-800 hover:border-emerald-800/60 rounded-xl bg-slate-950 p-6 text-center transition relative cursor-pointer group">
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2 pointer-events-none">
                      <UploadCloud className="w-8 h-8 text-slate-600 mx-auto group-hover:text-emerald-500 transition" />
                      {fileName ? (
                        <div className="text-emerald-400 text-xs font-mono flex items-center justify-center gap-1.5 font-bold">
                          <CheckCircle className="w-4 h-4 shrink-0" /> Attached:{" "}
                          {fileName}
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-slate-300 font-medium">
                            Click or drag a text draft document to load
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                            Supports direct semantic text embedding extraction
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingestion Matrix Trigger Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase tracking-wider text-xs py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/20"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Compile Document Footprint & Proceed"
              )}
              {!loading && <ChevronRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PremiumCheckoutTerminal
              challengerId={generatedChallengerId}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        )}
      </div>
    </div>
  );
}
