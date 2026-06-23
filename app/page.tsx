"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Flame,
  ShieldAlert,
  BarChart3,
  MapPin,
  Search,
  ArrowUpRight,
  UserCheck,
  Zap,
  Lock,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";

// Simplified Multilingual Dictionary
const LOCALIZATION = {
  en: {
    tagline: "Tuna-anika Story za Jaba",
    jabaMeter: "Jaba Meter",
    impactRating: "Performance Score",
    rvs: "Chance of Re-election",
    filterTitle: "Filter by Location",
    redFlag: "WARNING",
    searchPlaceholder: "Search Governors, Senators, MPs, MCAs...",
    heroTitle: "Hold Your Leaders Accountable with Real Facts.",
    heroDesc:
      "Facts Tupu helps you separate political promises from reality. We track what politicians say, check official budget reports, and verify if the work was actually done on the ground.",
    ctaGetStarted: "Create Account",
    ctaLogin: "Log In",
    previewTitle: "Preview: Live Leader Scorecards",
  },
  sw: {
    tagline: "Tunafichua Hadithi za Uongo",
    jabaMeter: "Kipimo cha Jaba",
    impactRating: "Alama ya Utendakazi",
    rvs: "Nafasi ya Kuchaguliwa Tena",
    filterTitle: "Chuja kwa Eneo",
    redFlag: "ONYO",
    searchPlaceholder: "Tafuta Magavana, Maseneta, Wabunge...",
    heroTitle: "Wajibisha Viongozi Wako Kwa Kutumia Ukweli.",
    heroDesc:
      "Facts Tupu inakusaidia kutofautisha ahadi za wanasiasa na ukweli. Tunafuatilia wanachosema, kukagua ripoti za bajeti, na kuhakikisha kama kazi imefanywa kweli mashinani.",
    ctaGetStarted: "Tengeneza Akaunti",
    ctaLogin: "Ingia",
    previewTitle: "Muhtasari: Matokeo ya Viongozi",
  },
  sheng: {
    tagline: "Tuna-anika Story za Jaba",
    jabaMeter: "Jaba Meter",
    impactRating: "Wira Imepigwa",
    rvs: "Chance ya Kurudi Ndani",
    filterTitle: "Saka Mtaa Yako",
    redFlag: "NGORI ALERT",
    searchPlaceholder: "Saka Mhesh, Gavana au MCA...",
    heroTitle: "Anika Wanasiasa Wako na Ma-Fact.",
    heroDesc:
      "Facts Tupu inakusaidia kujua kama mhesh anacheza jaba au anachapa kazi. Tunacheki chenye wanasema na ku-confirm kwa ground kama form ina-flow.",
    ctaGetStarted: "Fungua Akaunti",
    ctaLogin: "Ingia Ndani",
    previewTitle: "Preview: Ripoti za Mavedi",
  },
};

interface LeaderProfile {
  id: string;
  name: string;
  role: "Governor" | "Senator" | "MP" | "MCA";
  county: string;
  constituency?: string;
  jaba_score: number;
  impact_score: number;
  rvs: number;
  latest_red_flag?: string;
  traffic_light: "GREEN" | "YELLOW" | "RED";
}

export default function PlatformLandingPage() {
  const [lang, setLang] = useState<"en" | "sw" | "sheng">("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("All");
  let token: string | null = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("facts_tupu_token");
  }

  const [leaders] = useState<LeaderProfile[]>([
    {
      id: "LD-001",
      name: "Hon. Arthur Johnson Kiarie",
      role: "MP",
      county: "Nairobi",
      constituency: "Lang'ata",
      jaba_score: 74,
      impact_score: 42,
      rvs: 29,
      latest_red_flag:
        "Speech claimed 100% distribution of NG-CDF bursaries, but Auditor General report flagged KES 45M missing.",
      traffic_light: "RED",
    },
    {
      id: "LD-002",
      name: "H.E. Susan Mutheu Wambua",
      role: "Governor",
      county: "Mombasa",
      jaba_score: 22,
      impact_score: 81,
      rvs: 78,
      traffic_light: "GREEN",
    },
  ]);

  const t = LOCALIZATION[lang];

  const filteredLeaders = leaders.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.county.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCounty =
      selectedCounty === "All" || l.county === selectedCounty;
    return matchesSearch && matchesCounty;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-600 selection:text-white flex flex-col justify-between">
      {/* Simple Navigation Bar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded tracking-widest uppercase">
              LIVE
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                FACTS TUPU
              </h1>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="hidden md:flex bg-slate-900 p-1 border border-slate-800 rounded-lg">
              {(["en", "sw", "sheng"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    lang === l
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <Link
              href="/register"
              className="text-sm font-bold text-slate-400 hover:text-white transition-colors px-3 py-2"
            >
              {t.ctaLogin}
            </Link>

            <Link
              href="/register"
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4 text-red-500" /> Sign Up
            </Link>

            {(!token || token === "undefined") && (
              <Link
                href="/onboarding"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
              >
                <Zap className="w-4 h-4" /> Are you a Candidate?
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-grow">
        <section className="relative overflow-hidden pt-20 pb-16 border-b border-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.07),transparent_50%)]" />

          <div className="max-w-5xl mx-auto text-center px-4 space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 bg-red-950/40 border border-red-500/20 px-4 py-1.5 rounded-full text-xs font-bold text-red-400">
              <Sparkles className="w-4 h-4 text-red-400" /> The Citizens&apos;
              Watchdog Platform
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
              {t.heroTitle}
            </h1>

            <p className="text-base md:text-lg text-slate-400 font-normal max-w-2xl mx-auto leading-relaxed">
              {t.heroDesc}
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-sm px-6 py-3.5 rounded-lg transition-all flex items-center gap-2"
              >
                {t.ctaGetStarted} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/onboarding"
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm font-bold px-6 py-3.5 rounded-lg transition-all flex items-center gap-2"
              >
                Claim Your Leader Profile{" "}
                <ArrowUpRight className="w-4 h-4 text-red-500" />
              </Link>
            </div>
          </div>
        </section>

        {/* Core Features - Simplified */}
        <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-900 p-6 rounded-2xl space-y-3">
            <div className="bg-red-950/50 border border-red-900/30 w-10 h-10 rounded-lg flex items-center justify-center text-red-500 font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">
              The Jaba Meter (Lie Detector)
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We compare what politicians promise during rallies with official
              government reports to show you how much of it is actually true.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-900 p-6 rounded-2xl space-y-3">
            <div className="bg-red-950/50 border border-red-900/30 w-10 h-10 rounded-lg flex items-center justify-center text-red-500 font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Actual Performance Score
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We track how public funds like NG-CDF and Ward funds are spent to
              see if they are actually benefiting your community on the ground.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-900 p-6 rounded-2xl space-y-3">
            <div className="bg-red-950/50 border border-red-900/30 w-10 h-10 rounded-lg flex items-center justify-center text-red-500 font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Re-Election Chances
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Based on their track record, unfulfilled promises, and citizen
              feedback, we calculate the likelihood of them being re-elected.
            </p>
          </div>
        </section>

        {/* Teaser Preview - Simple Auth Gate */}
        <section className="max-w-7xl mx-auto px-4 pb-20 space-y-6">
          <div className="flex justify-between items-end border-b border-slate-900 pb-3">
            <div>
              <p className="text-xl font-black text-white">{t.previewTitle}</p>
            </div>
          </div>

          {/* Dummy Filters */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm opacity-60 pointer-events-none">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                readOnly
                placeholder={t.searchPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-slate-400"
              />
            </div>
            <select
              disabled
              className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-500"
            >
              <option>All Counties</option>
            </select>
          </div>

          {/* Blurred Teaser Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            {/* The Paywall / Authwall Message */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm z-20 rounded-2xl border border-slate-800/40 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="bg-slate-900 border border-slate-800 w-12 h-12 rounded-xl flex items-center justify-center shadow-2xl">
                <Lock className="w-5 h-5 text-red-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">
                  Log in to view the full list of politicians
                </h4>
                <p className="text-sm text-slate-300 max-w-sm mx-auto">
                  Create a free account to search any politician, view their
                  full scorecard, and see exactly how public money is being
                  used.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Link
                  href="/register"
                  className="bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-all"
                >
                  Register Free
                </Link>
                <Link
                  href="/login"
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-all"
                >
                  Log In
                </Link>
              </div>
            </div>

            {/* Blurred Background Cards */}
            {filteredLeaders.map((leader) => (
              <div
                key={leader.id}
                className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-5 space-y-4 filter blur-[3px] opacity-40 select-none"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {leader.county} County
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {leader.name}
                    </h3>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-950 p-2 rounded">
                    <span className="text-[10px] text-slate-500 block uppercase">
                      {t.jabaMeter}
                    </span>
                    <span className="text-sm font-bold text-red-400">
                      {leader.jaba_score}%
                    </span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded">
                    <span className="text-[10px] text-slate-500 block uppercase">
                      {t.impactRating}
                    </span>
                    <span className="text-sm font-bold text-slate-200">
                      {leader.impact_score}/100
                    </span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded">
                    <span className="text-[10px] text-slate-500 block uppercase">
                      {t.rvs}
                    </span>
                    <span className="text-sm font-bold text-red-400">
                      {leader.rvs}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 p-6 text-center text-xs text-slate-500">
        © 2026 Facts Tupu. Empowering Citizens.
      </footer>
    </div>
  );
}
