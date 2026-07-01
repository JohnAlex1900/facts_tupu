"use client";

import React, { useState } from "react";
import { getApiBaseUrl } from "@/app/lib/api_client";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Loader2,
  Cpu,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface ExportJob {
  id: string;
  name: string;
  format: "PDF" | "CSV" | "JSON";
  status: "Ready" | "Compiling" | "Idle";
  size?: string;
}

export default function ExportCenterPanel() {
  const [jobs, setJobs] = useState<ExportJob[]>([
    {
      id: "job-1",
      name: "Comprehensive Accountability Intelligence Dossier (Hon. Silas Mwangi)",
      format: "PDF",
      status: "Ready",
      size: "142 KB",
    },
    {
      id: "job-2",
      name: "National Procurement Discrepancy Index Ledger",
      format: "CSV",
      status: "Idle",
    },
    {
      id: "job-3",
      name: "13th Parliament Beneficial Ownership Intersect Matrix",
      format: "JSON",
      status: "Ready",
      size: "1.2 MB",
    },
  ]);

  const triggerCompilation = (id: string) => {
    // Set matching item status to Compiling to simulate the backend engine assembly pipeline
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, status: "Compiling" } : job,
      ),
    );

    setTimeout(() => {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === id ? { ...job, status: "Ready", size: "318 KB" } : job,
        ),
      );
    }, 2500);
  };

  const downloadFile = async (format: string) => {
    if (format === "PDF") {
      // Direct integration link hitting the Python backend route
      const baseUrl = getApiBaseUrl();
      window.open(`${baseUrl}/api/export/dossier`, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION PANEL HEADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" /> Export Center & PDF
            Dossier Compiler
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Assemble high-precision investigative reporting dossiers and
            compliance ledgers on demand.
          </p>
        </div>
      </div>

      {/* COMPILER QUEUE CARD ENGINE */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex justify-between items-center">
          <span>Available Generation Scripts</span>
          <span className="text-sm sm:text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-black">
            Compiler Pipeline Online
          </span>
        </div>

        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition"
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  job.format === "PDF"
                    ? "bg-red-50 text-red-600"
                    : job.format === "CSV"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-blue-50 text-blue-600"
                }`}
              >
                {job.format === "PDF" ? (
                  <FileText className="w-5 h-5" />
                ) : (
                  <FileSpreadsheet className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 leading-tight">
                  {job.name}
                </h4>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <span>Format: {job.format}</span>
                  {job.size && (
                    <>
                      <span>•</span>
                      <span className="text-slate-500">Size: {job.size}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-50">
              {job.status === "Idle" && (
                <button
                  onClick={() => triggerCompilation(job.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Compile Ledger
                </button>
              )}

              {job.status === "Compiling" && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-600 bg-amber-50 rounded-lg">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Structuring
                  HTML Media...
                </span>
              )}

              {job.status === "Ready" && (
                <button
                  onClick={() => downloadFile(job.format)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm shadow-blue-100"
                >
                  <Download className="w-3.5 h-3.5" /> Download Stream
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* METRIC PIPELINE FOOTER OVERLAY */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-xs font-semibold text-slate-500 flex gap-2 items-start">
        <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-700 block mb-0.5">
            Automated WeasyPrint Paged-Media Layout Matrix
          </span>
          PDF files are structured asynchronously using strict HTML styles
          inside the backend environment before being packed into binary stream
          downloads. No local canvas tools are run client-side, preserving high
          memory efficiency.
        </div>
      </div>
    </div>
  );
}
