"use client";

import React, { useState } from "react";
import {
  Search,
  BarChart2,
  Bell,
  Shield,
  Activity,
  Briefcase,
  DownloadCloud,
} from "lucide-react";

// Subcomponents for the views
import AISynthesisOverlay from "./AISynthesisOverlay";
import NationalSummaryGrid from "./NationalSummaryGrid";
import RepresentativeScorecard from "./RepresentativeScorecard";
import CorruptionWatchPanel from "./CorruptionWatchPanel";
import AssetConflictMatrix from "./AssetConflictMatrix";
import { RepresentativeCard } from "./RepresentativeCard";
import ExportCenterPanel from "./ExportCenterPanel";
import { simulatedRepresentatives } from "../data/simulatedRepresentatives";

export interface FilterState {
  searchQuery: string;
  tier: "All" | "Senate" | "National_Assembly" | "Gubernatorial";
  county: string;
}

export type ViewState =
  | "summary"
  | "monitor"
  | "scorecard"
  | "corruption"
  | "conflict"
  | "representative"
  | "export";

export default function DashboardLayout() {
  const [activeView, setActiveView] = useState<ViewState>("monitor");

  // Relaxed type state definition to support both string and number asset IDs cleanly
  const [selectedRepId, setSelectedRepId] = useState<string | number>(0);

  // High-level navigation trigger helper using flexible types
  const navigateToProfile = (id: string | number) => {
    setSelectedRepId(id);
    setActiveView("scorecard");
  };

  // Find the selected representative's data safely converting lookups to string match lines
  const selectedRep =
    simulatedRepresentatives.find(
      (rep) => String(rep.id) === String(selectedRepId),
    ) || simulatedRepresentatives[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* TOP NAVIGATION BAR */}
      <header className="h-auto min-h-14 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-4 sticky top-0 z-50">
        <div className="flex items-center gap-3 w-auto md:w-1/3">
          <div
            className="flex items-center gap-2 text-blue-600 font-bold text-base sm:text-xl tracking-tight cursor-pointer"
            onClick={() => setActiveView("monitor")}
          >
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 fill-blue-600 text-white" />
            <span className="hidden sm:inline">Facts Tupu</span>
            <span className="sm:hidden">FT</span>
          </div>
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Facts Tupu"
              className="w-full bg-slate-100 border-none rounded-full py-1.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Dynamic Top Tabs */}
        <nav className="hidden md:flex items-center gap-8 w-1/3 justify-center text-slate-500">
          <button
            onClick={() => setActiveView("monitor")}
            className={`p-2 transition font-medium ${activeView === "monitor" ? "text-blue-600 border-b-2 border-blue-600" : "hover:text-slate-800"}`}
          >
            Monitor
          </button>
          <button
            onClick={() => setActiveView("summary")}
            className={`p-2 transition font-medium ${activeView === "summary" ? "text-blue-600 border-b-2 border-blue-600" : "hover:text-slate-800"}`}
          >
            Summary Grid
          </button>
        </nav>

        <div className="flex items-center justify-end gap-2 sm:gap-3 w-auto md:w-1/3">
          <button className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-300 border border-slate-400"></div>
        </div>
      </header>

      {/* APPLICATION BODY */}
      <div className="flex flex-1 max-w-[1600px] mx-auto w-full">
        {/* LEFT SIDEBAR (Navigation Controls) */}
        <aside className="w-[280px] flex-shrink-0 hidden md:block p-4 sticky top-14 h-[calc(100vh-3.5rem)] border-r border-slate-100 bg-white/50">
          <div className="text-xs font-bold text-slate-400 mb-2 mt-4 uppercase tracking-wider px-2">
            Navigation
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveView("corruption")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition ${
                activeView === "corruption"
                  ? "bg-red-50 text-red-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Activity className="w-5 h-5 text-red-500" /> Corruption Watch
            </button>
            <button
              onClick={() => setActiveView("export")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition ${
                activeView === "export"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <DownloadCloud className="w-5 h-5 text-blue-500" /> Export Center
            </button>
            <button
              onClick={() => setActiveView("conflict")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition ${
                activeView === "conflict"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Briefcase className="w-5 h-5 text-indigo-500" /> Conflict Matrix
            </button>
            <button
              onClick={() => setActiveView("summary")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition ${
                activeView === "summary"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <BarChart2 className="w-5 h-5" /> National Summary
            </button>
            <button
              onClick={() => setActiveView("monitor")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition ${
                activeView === "monitor"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Activity className="w-5 h-5" /> AI Monitor
            </button>
          </nav>
        </aside>

        {/* CENTER VIEWPORT (Dynamic Execution Panel) */}
        <main className="flex-1 max-w-[1000px] mx-auto p-3 sm:p-4 w-full pb-24 md:pb-4">
          {activeView === "monitor" && <AISynthesisOverlay />}

          {activeView === "corruption" && (
            <CorruptionWatchPanel onSelectRepresentative={navigateToProfile} />
          )}

          {activeView === "conflict" && (
            <AssetConflictMatrix onSelectRepresentative={navigateToProfile} />
          )}

          {activeView === "summary" && (
            <NationalSummaryGrid onSelectRepresentative={navigateToProfile} />
          )}

          {activeView === "representative" && (
            <RepresentativeCard rep={selectedRep} />
          )}

          {activeView === "scorecard" && (
            <RepresentativeScorecard
              repId={selectedRepId}
              onBack={() => setActiveView("summary")}
            />
          )}

          {activeView === "export" && <ExportCenterPanel />}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden sticky bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          <button
            onClick={() => setActiveView("monitor")}
            className={`flex flex-col items-center justify-center rounded-xl px-1 py-2 text-sm sm:text-[10px] font-semibold ${activeView === "monitor" ? "text-blue-600 bg-blue-50" : "text-slate-500"}`}
          >
            <Activity className="w-4 h-4 mb-1" />
            Monitor
          </button>
          <button
            onClick={() => setActiveView("corruption")}
            className={`flex flex-col items-center justify-center rounded-xl px-1 py-2 text-sm sm:text-[10px] font-semibold ${activeView === "corruption" ? "text-red-600 bg-red-50" : "text-slate-500"}`}
          >
            <Shield className="w-4 h-4 mb-1" />
            Watch
          </button>
          <button
            onClick={() => setActiveView("conflict")}
            className={`flex flex-col items-center justify-center rounded-xl px-1 py-2 text-sm sm:text-[10px] font-semibold ${activeView === "conflict" ? "text-indigo-600 bg-indigo-50" : "text-slate-500"}`}
          >
            <Briefcase className="w-4 h-4 mb-1" />
            Conflict
          </button>
          <button
            onClick={() => setActiveView("export")}
            className={`flex flex-col items-center justify-center rounded-xl px-1 py-2 text-sm sm:text-[10px] font-semibold ${activeView === "export" ? "text-blue-600 bg-blue-50" : "text-slate-500"}`}
          >
            <DownloadCloud className="w-4 h-4 mb-1" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
