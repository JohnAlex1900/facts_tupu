"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/app/lib/api_client";

type CeremonyStep = "INPUT" | "GENERATING" | "REVIEW" | "SIGNING" | "SUCCESS";

interface PetitionPayload {
  title: string;
  body: string;
  target_id: string;
}

export default function PetitionGeneratorPage() {
  const [currentStep, setCurrentStep] = useState<CeremonyStep>("INPUT");

  // Form input fields
  const [targetId, setTargetId] = useState("");
  const [grievance, setGrievance] = useState("");
  const [signerName, setSignerName] = useState("");

  // Engine states
  const [generatedPetition, setGeneratedPetition] =
    useState<PetitionPayload | null>(null);
  const [signatureBlock, setSignatureBlock] = useState<{
    signature: string;
    publicKey: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stage 1: Trigger the FastAPI AI generation pipeline
  const handleGeneratePetition = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("GENERATING");

    try {
      // Direct call out to our backend AI router
      const { data } = await apiClient.post("/petitions/generate", {
        representative_id: targetId,
        core_issue: grievance,
      });

      setGeneratedPetition({
        title: data.title || `Official Redress Request: Target ID ${targetId}`,
        body: data.generated_text || data.body,
        target_id: targetId,
      });
      setCurrentStep("REVIEW");
    } catch (error) {
      console.error("AI composition error:", error);
      setCurrentStep("INPUT");
    }
  };

  // Stages 2 & 3: Local Cryptographic Signing Ceremony via Web Crypto API
  const executeCryptographicSignature = async () => {
    if (!generatedPetition || !signerName) return;
    setIsSubmitting(true);
    setCurrentStep("SIGNING");

    try {
      // 1. Text Encoder captures raw byte streams
      const encoder = new TextEncoder();
      const documentBytes = encoder.encode(JSON.stringify(generatedPetition));

      // 2. Provision native browser asymmetric key structure
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true, // extractable
        ["sign", "verify"],
      );

      // 3. Generate raw digital cryptosignature from bytes payload
      const rawSignature = await window.crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        keyPair.privateKey,
        documentBytes,
      );

      // 4. Export Key to SPKI format to package for backend tracking safely
      const exportedPublicKey = await window.crypto.subtle.exportKey(
        "spki",
        keyPair.publicKey,
      );

      // Convert formats to readable Base64/Hex notation blocks
      const signatureHex = Array.from(new Uint8Array(rawSignature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const publicKeyB64 = btoa(
        String.fromCharCode(...new Uint8Array(exportedPublicKey)),
      );

      // 5. Package full transaction payload out to permanent storage
      await apiClient.post("/petitions/commit-signed", {
        petition: generatedPetition,
        signature: signatureHex,
        public_key: publicKeyB64,
        signer_identity: signerName,
      });

      setSignatureBlock({ signature: signatureHex, publicKey: publicKeyB64 });
      setCurrentStep("SUCCESS");
    } catch (error) {
      console.error("Cryptographic signing process failed:", error);
      setCurrentStep("REVIEW");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-slate-100 min-h-[80vh] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {/* State A: Parameters Configuration Input */}
        {currentStep === "INPUT" && (
          <motion.div
            key="input-stage"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6"
          >
            <div>
              <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">
                Civic Engine Room
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Initialize AI Civic Petition
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Draft verifiable collective action blueprints using
                decentralized identity footprints.
              </p>
            </div>

            <form onSubmit={handleGeneratePetition} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Target Representative ID Reference
                </label>
                <input
                  type="text"
                  required
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  placeholder="e.g. REP-89021"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 font-mono transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Core Grievance & Issue Outline
                </label>
                <textarea
                  required
                  rows={4}
                  value={grievance}
                  onChange={(e) => setGrievance(e.target.value)}
                  placeholder="Describe the policy divergence or drift observed in floor votes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-semibold text-sm py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-[0.98]"
              >
                Assemble AI Petition Layout
              </button>
            </form>
          </motion.div>
        )}

        {/* State B: AI Composition Intermediary */}
        {currentStep === "GENERATING" && (
          <motion.div
            key="generating-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center p-12 space-y-4"
          >
            <div className="relative w-12 h-12 mx-auto">
              <div className="absolute inset-0 border-2 border-amber-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="font-mono text-xs tracking-wider text-amber-500 uppercase animate-pulse">
              Synthesizing Legislative Variance Data Logs...
            </div>
          </motion.div>
        )}

        {/* State C: Document Verification Review */}
        {currentStep === "REVIEW" && generatedPetition && (
          <motion.div
            key="review-stage"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6"
          >
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-mono bg-amber-950 text-amber-400 px-2 py-0.5 rounded border border-amber-900 uppercase">
                Generated Draft Blueprint Pending Signature
              </span>
              <h3 className="text-lg font-bold text-white mt-3">
                {generatedPetition.title}
              </h3>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-sm leading-relaxed text-slate-300 max-h-60 overflow-y-auto whitespace-pre-wrap font-sans">
              {generatedPetition.body}
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Legal Citizen Name / Cryptographic Identity Label
                </label>
                <input
                  type="text"
                  required
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="Enter full legal signature identity token"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors font-mono"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep("INPUT")}
                  className="flex-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold py-3 rounded-xl transition-colors"
                >
                  Discard Draft
                </button>
                <button
                  onClick={executeCryptographicSignature}
                  disabled={!signerName}
                  className="flex-1 bg-white hover:bg-slate-200 text-slate-950 text-xs font-bold py-3 rounded-xl disabled:opacity-40 transition-opacity shadow-lg"
                >
                  Authorize Local Cryptographic Lock
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* State D: Cryptographic Ceremony Execution */}
        {currentStep === "SIGNING" && (
          <motion.div
            key="signing-stage"
            className="text-center p-12 space-y-4"
          >
            <div className="w-8 h-8 border border-white border-dashed rounded-full animate-spin mx-auto"></div>
            <p className="font-mono text-xs text-slate-400 uppercase tracking-widest">
              Injecting Hardware Entropy & Asserting RSA Signature Block...
            </p>
          </motion.div>
        )}

        {/* State E: Complete Success Ledger State */}
        {currentStep === "SUCCESS" && signatureBlock && (
          <motion.div
            key="success-stage"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-emerald-900/60 bg-gradient-to-b from-slate-900 to-emerald-950/10 rounded-2xl p-6 text-center space-y-6"
          >
            <div className="w-12 h-12 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-800">
              ✓
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Petition Signed & Committed
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                The transaction payload has successfully integrated with the
                public audit trail architecture.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left space-y-3 font-mono text-[10px]">
              <div>
                <span className="text-slate-500 uppercase block font-semibold">
                  Signer Key Fingerprint (SPKI Base64):
                </span>
                <span className="text-slate-300 break-all block bg-slate-900 p-2 rounded mt-1 border border-slate-800/60">
                  {signatureBlock.publicKey.substring(0, 80)}...
                </span>
              </div>
              <div>
                <span className="text-slate-500 uppercase block font-semibold">
                  Asymmetric Signature Signature Hash Block:
                </span>
                <span className="text-amber-400/90 break-all block bg-slate-900 p-2 rounded mt-1 border border-slate-800/60">
                  {signatureBlock.signature}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setTargetId("");
                setGrievance("");
                setSignerName("");
                setGeneratedPetition(null);
                setSignatureBlock(null);
                setCurrentStep("INPUT");
              }}
              className="px-6 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition-colors"
            >
              {isSubmitting ? "Resetting..." : "Start New Petition"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
