/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Users2,
  ArrowUpRight,
  Users,
  FileText,
  BarChart3,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { getApiV1BaseUrl } from "@/app/lib/api_client";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface ChallengerMatch {
  id: string;
  name: string;
  role_type: string;
  accountability_score: number;
  jaba_meter: number;
}

interface IncumbentProfile {
  id: string;
  name: string;
  role: string;
  constituency: string;
  county: string;
  ward: string;
  term: string;
  jaba_score: number;
  impact_score: number;
  rvs: number;
  target_seat_id: string;
  challengers: ChallengerMatch[];
}

const KENYAN_COUNTIES = [
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
  "Nairobi",
];

// Focus list for Nairobi wards setup
const NAIROBI_WARDS = [
  "Kilimani",
  "Kitisuru",
  "Kangemi",
  "Karura",
  "Roysambu",
  "Kahawa West",
  "Kasarani",
  "Clay City",
  "Mwiki",
  "Dandora",
  "Kariobangi",
  "Eastleigh",
  "Airbase",
  "Pangani",
  "California",
  "Ngara",
  "Kibera",
  "Woodley",
  "Mugumo-ini",
  "Pipeline",
  "Imara Daima",
  "Kwa Njenga",
  "Laini Saba",
];

const LEADERSHIP_ROLES = [
  { label: "Governor", value: "Governor" },
  { label: "Senator", value: "Senator" },
  { label: "Member of National Assembly (MP)", value: "MP" },
  { label: "County Woman Representative", value: "Woman Rep" },
  { label: "Member of County Assembly (MCA)", value: "MCA" },
];

export default function AccountabilityWallDashboard() {
  const [profiles, setProfiles] = useState<IncumbentProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [countyFilter, setCountyFilter] = useState("all");
  const [wardFilter, setWardFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"en" | "sw" | "sheng">("en");

  useEffect(() => {
    setWardFilter("all");
  }, [countyFilter]);

  // Solves the massive structural overflow layout issue shown in image_668860.png
  const displayGeoHeader = (prof: IncumbentProfile) => {
    const rawCounty = prof.county?.trim() || "";
    const rawConstituency = prof.constituency?.trim() || "";
    const rawSeatId = prof.target_seat_id?.trim() || "";

    // 1. If we have a genuine county string, use it
    if (
      rawCounty &&
      rawCounty.toLowerCase() !== "seat" &&
      rawCounty.toLowerCase() !== "ken"
    ) {
      return `SEAT County → ${rawCounty}`;
    }

    // 2. Fall back to constituency if available
    if (rawConstituency) {
      return `County → ${rawConstituency}`;
    }

    // 3. Catch and neutralize massive unparsed string leaks (as seen in image_668860.png)
    if (rawSeatId.length > 25) {
      return "SEAT Layer → National Spectrum";
    }

    return `SEAT Node → ${rawSeatId || "General Track"}`;
  };

  useEffect(() => {
    async function loadDashboardRegistry() {
      const baseUrl = getApiV1BaseUrl();
      const requestUrl = `${baseUrl}/profiles`;

      try {
        const res = await fetch(requestUrl);
        if (res.ok) {
          const data = await res.json();
          setProfiles(data);
        } else {
          console.error(
            "Failed to fetch dashboard profiles.",
            requestUrl,
            res.status,
            res.statusText,
          );
        }
      } catch (err) {
        console.error(
          "Critical tracking stream synchronization execution failure:",
          requestUrl,
          err,
        );
      } finally {
        setLoading(false);
      }
    }
    loadDashboardRegistry();
  }, []);

  const filteredProfiles = profiles.filter((prof) => {
    const normSearch = searchQuery.toLowerCase();
    const normCounty = countyFilter.toLowerCase();
    const normRole = roleFilter.toLowerCase();
    const normWard = wardFilter.toLowerCase();

    // 1. Unified Text Search Box Filter
    const matchesSearch =
      !searchQuery ||
      prof.name?.toLowerCase().includes(normSearch) ||
      prof.constituency?.toLowerCase().includes(normSearch) ||
      prof.county?.toLowerCase().includes(normSearch) ||
      prof.ward?.toLowerCase().includes(normSearch) ||
      prof.role?.toLowerCase().includes(normSearch) ||
      prof.target_seat_id?.toLowerCase().includes(normSearch);

    // 2. Cascading County Matcher (Checks county, constituency, or seat IDs to prevent blanking out)
    const profileCountyStr = (prof.county || "").toLowerCase();
    const profileConstituencyStr = (prof.constituency || "").toLowerCase();
    const profileSeatStr = (prof.target_seat_id || "").toLowerCase();

    const matchesCounty =
      countyFilter === "all" ||
      profileCountyStr === normCounty ||
      profileCountyStr.includes(normCounty) ||
      profileConstituencyStr.includes(normCounty) ||
      profileSeatStr.includes(normCounty);

    // 3. Resilient Ward Matcher
    const profileWardStr = (prof.ward || "").toLowerCase();
    const matchesWard =
      wardFilter === "all" ||
      profileWardStr === normWard ||
      profileWardStr.includes(normWard) ||
      profileConstituencyStr.includes(normWard);

    // 4. Flexible Role Matcher (Bridges modern titles with standard backend matrix roles)
    let matchesRole = roleFilter === "all";
    if (!matchesRole) {
      const profileRoleStr = (prof.role || "").toLowerCase();

      if (normRole === "governor") {
        matchesRole =
          profileRoleStr.includes("governor") ||
          profileRoleStr.includes("executive");
      } else if (normRole === "senator") {
        matchesRole = profileRoleStr.includes("senator");
      } else if (normRole === "mp") {
        matchesRole =
          profileRoleStr.includes("mp") ||
          profileRoleStr.includes("member") ||
          profileRoleStr.includes("representative");
      } else if (normRole === "woman rep") {
        matchesRole =
          profileRoleStr.includes("woman") || profileRoleStr.includes("rep");
      } else if (normRole === "mca") {
        matchesRole =
          profileRoleStr.includes("mca") ||
          profileRoleStr.includes("assembly") ||
          profileRoleStr.includes("ward");
      } else {
        matchesRole =
          profileRoleStr.includes(normRole) ||
          profileSeatStr.includes(normRole);
      }
    }

    return matchesSearch && matchesCounty && matchesWard && matchesRole;
  });

  // Framer Motion Variants for Clean Layout Entrance Cascades
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 25 },
    },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Upper Navigation Identity Strip */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50 py-3 mx-[-1rem] sm:mx-[-1.5rem] lg:mx-[-2rem] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded tracking-tighter uppercase animate-pulse">
              LIVE DATA
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                FACTS TUPU{" "}
                <span className="text-red-500 text-xs font-mono font-normal">
                  v1.0
                </span>
              </h1>
              <p className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                Accountability Wall Dashboard
              </p>
            </div>
          </div>

          <div className="flex bg-slate-900 p-1 border border-slate-800 rounded-lg">
            {(["en", "sw", "sheng"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  lang === l
                    ? "bg-red-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Navigation Sub-System */}
      <nav className="bg-slate-950 border-b border-slate-900 sticky top-[61px] z-40 mx-[-1rem] sm:mx-[-1.5rem] lg:mx-[-2rem] px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto hide-scrollbar space-x-8">
          <a
            href="/dashboard"
            className="border-b-2 border-red-500 text-red-500 py-3.5 text-xs font-mono font-bold uppercase whitespace-nowrap flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" /> Accountability Wall
          </a>
          <a
            href="/dashboard/monitor"
            className="border-b-2 border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700 py-3.5 text-xs font-mono font-bold uppercase whitespace-nowrap transition-all flex items-center gap-2"
          >
            <Activity className="w-4 h-4" /> AI Live Monitor
          </a>
          <a
            href="/dashboard/chipukizi"
            className="border-b-2 border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700 py-3.5 text-xs font-mono font-bold uppercase whitespace-nowrap transition-all flex items-center gap-2"
          >
            <Users className="w-4 h-4" /> Chipukizi Hub
          </a>
          <a
            href="/dashboard/submit"
            className="border-b-2 border-transparent text-amber-500 hover:text-amber-400 hover:border-amber-900/50 py-3.5 text-xs font-mono font-bold uppercase whitespace-nowrap transition-all flex items-center gap-2 ml-auto"
          >
            <FileText className="w-4 h-4" /> Submit Intel (Journalists)
          </a>
        </div>
      </nav>

      {/* Filters Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 mb-6">
        {/* Query String Input */}
        <div className="relative lg:col-span-4 sm:col-span-2">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search Governors, Senators, MPs, MCAs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-900 transition"
          />
        </div>

        {/* 47 Counties Selection Core Dropdown */}
        <div
          className={
            countyFilter === "nairobi" ? "lg:col-span-3" : "lg:col-span-4"
          }
        >
          <select
            value={countyFilter}
            onChange={(e) => setCountyFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Counties (47)</option>
            {KENYAN_COUNTIES.map((county) => (
              <option key={county} value={county.toLowerCase()}>
                {county} County
              </option>
            ))}
          </select>
        </div>

        {/* Conditional Ward Dropdown - Shows immediately when Nairobi is active */}
        {countyFilter === "nairobi" && (
          <div className="lg:col-span-2 animate-fadeIn">
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all">All Wards</option>
              {NAIROBI_WARDS.map((ward) => (
                <option key={ward} value={ward.toLowerCase()}>
                  {ward} Ward
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Constitutional Leadership Role Dropdown */}
        <div
          className={
            countyFilter === "nairobi" ? "lg:col-span-3" : "lg:col-span-4"
          }
        >
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Leadership Roles</option>
            {LEADERSHIP_ROLES.map((role) => (
              <option key={role.value} value={role.value.toLowerCase()}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Matrix Grid Container */}
      {loading ? (
        <div className="text-center font-mono text-xs text-slate-500 py-24 border border-dashed border-slate-850 rounded-xl">
          Parsing live representative records...
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProfiles.map((prof) => (
              <motion.div
                key={prof.id}
                variants={cardVariants}
                layout
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 hover:shadow-xl hover:shadow-black/40 transition-all duration-300 space-y-4 overflow-hidden"
              >
                {/* Header Geo Section */}
                <div className="space-y-1 overflow-hidden">
                  <div className="flex justify-between items-start gap-2">
                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1 uppercase tracking-wider truncate max-w-[90%]">
                      <MapPin className="w-3 h-3 text-red-500 shrink-0" />{" "}
                      <span className="truncate">{displayGeoHeader(prof)}</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                  </div>
                  <h3 className="text-[15px] font-bold text-white tracking-tight leading-snug truncate">
                    {prof.name}
                  </h3>
                </div>

                {/* Core Incumbent Telemetry Meters */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="bg-slate-950 p-2 border border-slate-850 rounded-lg hover:border-slate-800 transition">
                    <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-tight">
                      Jaba Meter
                    </span>
                    <span className="text-xs font-black text-emerald-400">
                      {prof.jaba_score}%
                    </span>
                  </div>
                  <div className="bg-slate-950 p-2 border border-slate-850 rounded-lg hover:border-slate-800 transition">
                    <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-tight">
                      Impact Rating
                    </span>
                    <span className="text-xs font-black text-slate-200">
                      {prof.impact_score}
                      <span className="text-[9px] font-normal text-slate-600">
                        /100
                      </span>
                    </span>
                  </div>
                  <div className="bg-slate-950 p-2 border border-slate-850 rounded-lg hover:border-slate-800 transition">
                    <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-tight">
                      Rvs
                    </span>
                    <span className="text-xs font-black text-red-400">
                      {prof.rvs}%
                    </span>
                  </div>
                </div>

                {/* INCUMBENT VS ASPIRING CHALLENGER INTERACTIVE SPLIT MATRIX */}
                <div className="border-t border-b border-slate-850/60 py-2.5 space-y-2">
                  <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    <Users2 className="w-3.5 h-3.5 text-cyan-400" /> Aspiring
                    Track Challengers
                  </div>

                  {prof.challengers && prof.challengers.length > 0 ? (
                    <div className="space-y-1.5">
                      {prof.challengers.map((challenger) => (
                        <Link
                          key={challenger.id}
                          href={`/dashboard/challengers/${challenger.id}`}
                          className="bg-slate-950 border border-slate-850/80 hover:border-cyan-500/40 hover:bg-slate-950/40 rounded-lg p-2 flex justify-between items-center font-mono text-[11px] transition-all duration-200 active:scale-[0.99] group/chal block"
                        >
                          <div className="truncate max-w-[60%]">
                            <span className="text-slate-200 font-bold block truncate group-hover/chal:text-cyan-400 transition-colors">
                              {challenger.name}
                            </span>
                            <span className="text-[9px] text-slate-500 block truncate uppercase tracking-tight">
                              {challenger.role_type}
                            </span>
                          </div>

                          <div className="flex gap-2 text-right shrink-0 items-center">
                            <div>
                              <span className="text-[7px] text-slate-500 block uppercase font-black">
                                Accountability
                              </span>
                              <span className="text-cyan-400 font-extrabold text-[10px]">
                                {challenger.accountability_score}%
                              </span>
                            </div>
                            <div className="border-l border-slate-850 pl-2">
                              <span className="text-[7px] text-slate-500 block uppercase font-black">
                                Jaba
                              </span>
                              <span className="text-amber-400 font-extrabold text-[10px]">
                                {challenger.jaba_meter}%
                              </span>
                            </div>
                            <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover/chal:text-cyan-400 opacity-0 group-hover/chal:opacity-100 transition-all ml-0.5 transform group-hover/chal:translate-x-0.5" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-950/40 border border-dashed border-slate-850/60 rounded-lg p-2.5 text-center text-[10px] font-mono text-slate-600 italic">
                      No active alternative track contenders registered.
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="flex justify-between items-center text-[11px] font-mono pt-1">
                  <span className="text-slate-500">
                    Role Layer:{" "}
                    <strong className="text-slate-400 uppercase text-[10px]">
                      {prof.role === "Executive" ? "EXECUTIVE" : "INCUMBENT"}
                    </strong>
                  </span>
                  <Link
                    href={`/dashboard/profiles/${prof.id}`}
                    className="text-red-400 hover:text-red-300 font-bold flex items-center gap-0.5 transition group"
                  >
                    Inspect Full Dossier
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
