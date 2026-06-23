"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Users,
  Search,
  AlertCircle,
} from "lucide-react";

interface BillSummary {
  bill_id: string;
  title: string;
  category: string;
  status: "PASSED" | "REJECTED" | "PENDING";
  total_ayes: number;
  total_nays: number;
  total_abstentions: number;
  date_introduced: string;
  ai_impact_brief: string;
}

export default function BillsHubPage() {
  const router = useRouter();
  const [bills, setBills] = useState<BillSummary[]>([]);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBillsTelemetry() {
      try {
        setLoading(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
        const res = await fetch(`${baseUrl}/bills`, { cache: "no-store" });

        if (!res.ok)
          throw new Error("Could not pull legislative indices from database.");
        const data = await res.json();
        setBills(data);

        if (data.length > 0) {
          setSelectedBillId(data[0].bill_id);
        }
      } catch (err: unknown) {
        console.error("FastAPI connection fault:", err);
        // Fallback localized mock dataset to keep development seamless if backend is compiling
        setBills([
          {
            bill_id: "BILL-2024-01",
            title: "Finance Bill 2024 (Division Matrix)",
            category: "Taxation & Revenue",
            status: "PASSED",
            total_ayes: 195,
            total_nays: 106,
            total_abstentions: 3,
            date_introduced: "2024-05-12",
            ai_impact_brief:
              "Implements structural adjustments to secondary excise brackets, directly altering consumer index thresholds within local manufacturing loops.",
          },
          {
            bill_id: "BILL-2024-02",
            title: "Division of Revenue Bill (County Allocation)",
            category: "Devolution Finance",
            status: "PENDING",
            total_ayes: 47,
            total_nays: 20,
            total_abstentions: 0,
            date_introduced: "2024-06-02",
            ai_impact_brief:
              "Dictates the shared revenue ceiling baseline across the 47 decentralized county budgets, directly controlling regional infrastructure spending caps.",
          },
        ]);
        if (!selectedBillId) setSelectedBillId("BILL-2024-01");
      } finally {
        setLoading(false);
      }
    }

    fetchBillsTelemetry();
  }, []);

  const activeBill = bills.find((b) => b.bill_id === selectedBillId);
  const totalVotes = activeBill
    ? activeBill.total_ayes +
      activeBill.total_nays +
      activeBill.total_abstentions
    : 0;
  const ayePercentage =
    activeBill && totalVotes > 0
      ? (activeBill.total_ayes / totalVotes) * 180
      : 0; // standard bar mapping

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Module Breadcrumb Header */}
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-red-500 uppercase">
            Legislative Division Ledger
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">
            National Assembly & Senate Bills
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit vote aggregations, macro consensus charts, and constitutional
            threshold compliance metrics.
          </p>
        </div>

        {loading ? (
          <div className="h-64 bg-slate-900 animate-pulse rounded-2xl w-full"></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: List of Audited Bills */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 px-1">
                Audited Documents
              </h3>

              <div className="space-y-2">
                {bills.map((bill) => (
                  <div
                    key={bill.bill_id}
                    onClick={() => setSelectedBillId(bill.bill_id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedBillId === bill.bill_id
                        ? "bg-slate-900 border-amber-500/60 shadow-md"
                        : "bg-slate-900/40 border-slate-900 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-[9px] font-mono uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                        {bill.category}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 rounded ${
                          bill.status === "PASSED"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                            : "bg-amber-950 text-amber-400 border border-amber-900"
                        }`}
                      >
                        {bill.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                      {bill.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono block mt-2">
                      Introduced: {bill.date_introduced}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Active Bill Statistical Breakdown (Spans 2 Columns) */}
            {activeBill && (
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                  {/* Bill Title Header */}
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      {activeBill.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      Reference Code Cluster: {activeBill.bill_id}
                    </p>
                  </div>

                  {/* Division Breakdown Metrics Bar */}
                  <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-900">
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                      <span>Division Count Split</span>
                      <span className="text-slate-300 font-bold">
                        {totalVotes} Total Votes Cast
                      </span>
                    </div>

                    {/* Progress Track Chart */}
                    <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{
                          width: `${(activeBill.total_ayes / totalVotes) * 100}%`,
                        }}
                      />
                      <div
                        className="bg-rose-500 h-full"
                        style={{
                          width: `${(activeBill.total_nays / totalVotes) * 100}%`,
                        }}
                      />
                      <div
                        className="bg-slate-700 h-full"
                        style={{
                          width: `${(activeBill.total_abstentions / totalVotes) * 100}%`,
                        }}
                      />
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-3 gap-2 pt-2 text-center font-mono text-xs">
                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/40">
                        <span className="text-emerald-400 font-bold block">
                          {activeBill.total_ayes}
                        </span>
                        <span className="text-[9px] text-slate-500 uppercase">
                          Ayes (Yes)
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/40">
                        <span className="text-rose-400 font-bold block">
                          {activeBill.total_nays}
                        </span>
                        <span className="text-[9px] text-slate-500 uppercase">
                          Nays (No)
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/40">
                        <span className="text-slate-400 font-bold block">
                          {activeBill.total_abstentions}
                        </span>
                        <span className="text-[9px] text-slate-500 uppercase">
                          Abstentions
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Forensic Impact Brief Block */}
                  <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-1.5 border-l-2 border-red-500">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-red-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> AI Policy Context
                      Summary
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {activeBill.ai_impact_brief}
                    </p>
                  </div>

                  {/* Primary Linkage Element */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard?bill_filter=${activeBill.bill_id}`,
                        )
                      }
                      className="text-xs font-mono bg-white text-slate-950 font-bold py-2.5 px-4 rounded-xl hover:bg-slate-200 transition-colors shadow-md"
                    >
                      Examine Member-by-Member Vote Log →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
