/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { useQuota } from "@/components/QuotaContext";
import InterceptorModal from "@/components/InterceptorModal";
import ChallengerOnboardingForm from "@/components/ChallengerOnboardingForm";
import ChallengerWorkspace from "@/components/ChallengerWorkspace";
import IndividualScorecard from "@/components/IndividualScorecard";
import { useRouter } from "next/navigation";
import AIMonitorSector from "@/components/AIMonitorSector";
import TopAdBanner from "@/components/TopAdBanner";
import Link from "next/link";

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
}

interface CustomWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
}

interface Challenger {
  challenger_id: string;
  full_name: string;
  public_traction_velocity: number;
  party_affiliation: string;
  ai_feasibility_score: number;
  manifesto_pillars?: string[] | string;
}

interface AICorePriority {
  id: string;
  title: string;
}

interface AIDeepDiveMonitor {
  action_plan_practicality: number;
  unrealistic_promises_risk: number;
  core_priorities: AICorePriority[];
  leadership_matchup: {
    vulnerability_index: number;
    performance_score: number;
  };
  office_mandate: string;
  talk_vs_action_justification: string[];
  legislative_delivery_justification: string[];
  developmental_delivery_justification: string[];
  risk_level_justification: string[];
}

interface ChallengerWorkspaceSession {
  full_name?: string;
  target_role?: string;
  associated_id?: string;
  manifesto_summary?: string;
}

interface Profile {
  id: string;
  seat_layer: string;
  name: string;
  county: string;
  role: string;
  jaba_meter: number;
  impact_rating: number;
  party_affiliation: string;
  rvs: number;
  challengers: Challenger[];
  ai_monitor_data?: AIDeepDiveMonitor;
}

interface DirectoryChallenger {
  challenger_id: string;
  full_name: string;
  party_affiliation: string;
  target_role: string;
  target_location_name: string;
  ai_feasibility_score: number;
  public_traction_velocity: number;
  background_dossier: string;
  manifesto_pillars: string[] | string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const playAccessibilityAudio = async (text: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/accessibility/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text_content: text }),
    });
    const blob = await res.blob();
    const audio = new Audio(URL.createObjectURL(blob));
    audio.play();
  } catch (error) {
    console.error("Audio access failed:", error);
  }
};

export default function PublicDashboard() {
  const isInitialMount = React.useRef(true);

  const { lookupCount, maxQuota, accountTier, registerLookup } = useQuota();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [aiSearchQuery, setAiSearchQuery] = useState("");

  const [activeLayer, setActiveLayer] = useState("ALL");
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "feed" | "ai-monitor" | "challengers"
  >("feed");

  const [hasVisitedAiMonitor, setHasVisitedAiMonitor] = useState(false);

  const [challengerSession, setChallengerSession] =
    useState<ChallengerWorkspaceSession | null>(null);

  const [currentView, setCurrentView] = useState<
    "DASHBOARD" | "ONBOARDING" | "CHALLENGER_WORKSPACE" | "SCORECARD"
  >("DASHBOARD");
  const [selectedLeader, setSelectedLeader] = useState<Profile | null>(null);

  const [directoryChallengers, setDirectoryChallengers] = useState<
    DirectoryChallenger[]
  >([]);
  const [loadingChallengers, setLoadingChallengers] = useState(false);
  const [hasVisitedChallengers, setHasVisitedChallengers] = useState(false);

  // Fetch Challengers Tab Data
  // Fetch Challengers Tab Data
  useEffect(() => {
    let isMounted = true;
    if (activeTab === "challengers" && !hasVisitedChallengers) {
      setHasVisitedChallengers(true);
      setLoadingChallengers(true);

      fetch(`${API_BASE_URL}/api/v1/challengers`, {
        headers: { "ngrok-skip-browser-warning": "true" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) {
            const parsedList = Array.isArray(data)
              ? data
              : Array.isArray(data?.data)
                ? data.data
                : [];
            setDirectoryChallengers(parsedList);
            console.log("Challengers loaded:", parsedList.length);
          }
        })
        .catch((err) => console.error("Failed to load challengers:", err))
        .finally(() => {
          if (isMounted) setLoadingChallengers(false);
        });
    }
    return () => {
      isMounted = false;
    };
    // FIX: Removed hasVisitedChallengers from this array
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "ai-monitor" && !hasVisitedAiMonitor) {
      setHasVisitedAiMonitor(true);
    }
  }, [activeTab, hasVisitedAiMonitor]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [searchQuery, activeLayer]);

  // Main Feed Polling & Fetching
  useEffect(() => {
    let isMounted = true;
    let pollInterval: NodeJS.Timeout;

    async function loadProfiles(isBackgroundPoll = false) {
      try {
        if (!isBackgroundPoll) {
          if (page === 1 && isInitialMount.current && !searchQuery) {
            setLoading(true);
          } else {
            setLoadingMore(true);
          }
        }

        const params = new URLSearchParams({
          page: page.toString(),
          limit: "20",
        });

        if (searchQuery) params.append("search", searchQuery);
        if (activeLayer && activeLayer !== "ALL")
          params.append("seat_layer", activeLayer);

        const response = await fetch(
          `${API_BASE_URL}/api/v1/profiles?${params.toString()}`,
          { headers: { "ngrok-skip-browser-warning": "true" } },
        );
        const rawData = await response.json();
        const safeRawData: Profile[] = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.data)
            ? rawData.data
            : [];

        const data = safeRawData.map((profile) => {
          let parsedChallengers = profile.challengers;
          if (typeof parsedChallengers === "string") {
            try {
              parsedChallengers = JSON.parse(parsedChallengers);
            } catch (e) {
              console.error("Failed to parse challengers:", e);
              parsedChallengers = [];
            }
          }
          return {
            ...profile,
            challengers: Array.isArray(parsedChallengers)
              ? parsedChallengers
              : [],
          };
        });

        if (isMounted) {
          setHasMore(data.length >= 20);

          setProfiles((prev) => {
            const uniqueMap = new Map<string, Profile>();
            if (!(page === 1 && !isBackgroundPoll)) {
              prev.forEach((profile) => uniqueMap.set(profile.id, profile));
            }
            data.forEach((profile) => uniqueMap.set(profile.id, profile));
            return Array.from(uniqueMap.values());
          });

          isInitialMount.current = false;
        }
      } catch (error) {
        console.error("Data Layer Connection Failure:", error);
      } finally {
        if (isMounted && !isBackgroundPoll) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    }

    const delaySearch = setTimeout(() => {
      loadProfiles(false);

      pollInterval = setInterval(() => {
        loadProfiles(true);
      }, 20000);
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(delaySearch);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [page, searchQuery, activeLayer]);

  const handleOpenScorecard = (leader: Profile) => {
    registerLookup(leader.id);
    const lookupPermitted =
      accountTier !== "anonymous" || lookupCount < maxQuota;
    if (lookupPermitted) {
      setSelectedLeader(leader);
      setCurrentView("SCORECARD");
    }
  };

  // Safe Null-Checked Search Filters
  const filteredProfiles = (Array.isArray(profiles) ? profiles : []).filter(
    (p) => {
      const matchesLayer =
        activeLayer === "ALL" || p.seat_layer === activeLayer;
      const searchLower = (searchQuery || "").toLowerCase();

      const nameMatches = (p.name || "").toLowerCase().includes(searchLower);
      const countyMatches = (p.county || "")
        .toLowerCase()
        .includes(searchLower);
      const roleMatches = (p.role || "").toLowerCase().includes(searchLower);
      const challengerMatches =
        Array.isArray(p.challengers) &&
        p.challengers.some((c) =>
          (c?.full_name || "").toLowerCase().includes(searchLower),
        );

      return (
        matchesLayer &&
        (nameMatches || countyMatches || roleMatches || challengerMatches)
      );
    },
  );

  const filteredChallengers = (
    Array.isArray(directoryChallengers) ? directoryChallengers : []
  ).filter((c) => {
    const searchLower = (searchQuery || "").toLowerCase();
    const nameMatches = (c.full_name || "").toLowerCase().includes(searchLower);
    const locationMatches = (c.target_location_name || "")
      .toLowerCase()
      .includes(searchLower);
    const roleMatches = (c.target_role || "")
      .toLowerCase()
      .includes(searchLower);

    return nameMatches || locationMatches || roleMatches;
  });

  const [isListening, setIsListening] = useState(false);
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);

  useEffect(() => {
    if (voiceSearchActive && !loadingMore && !loading) {
      const count = filteredProfiles.length;
      if (count > 0) {
        const top = filteredProfiles[0];
        playAccessibilityAudio(
          `Search matched. Found ${count} representative${count > 1 ? "s" : ""}. Top result is ${top.name}, ${top.role} of ${top.county}.`,
        );
      } else {
        playAccessibilityAudio("Search complete. Representative not found.");
      }
      setVoiceSearchActive(false);
    }
  }, [loadingMore, loading, voiceSearchActive, filteredProfiles]);

  const handleVoiceSearch = () => {
    const customWindow = window as unknown as CustomWindow;
    const SpeechRecognitionConstructor =
      customWindow.SpeechRecognition || customWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.replace(/\.$/, "");
      setSearchQuery(transcript);
      setVoiceSearchActive(true);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const getPillarText = (pillars?: string[] | string): string => {
    if (!pillars) return "";
    if (Array.isArray(pillars) && pillars.length > 0) return pillars[0];
    if (typeof pillars === "string") {
      try {
        const parsed = JSON.parse(pillars);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      } catch (e) {
        return pillars;
      }
    }
    return "";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (currentView === "ONBOARDING") {
    return (
      <div className="min-h-screen bg-slate-950 p-4 sm:p-6 flex flex-col items-center justify-start overflow-y-auto md:justify-center py-10">
        <div className="w-full max-w-2xl">
          <ChallengerOnboardingForm
            onCancel={() => setCurrentView("DASHBOARD")}
            onRegistrationSuccess={(challengerAccount) => {
              setChallengerSession(
                challengerAccount as ChallengerWorkspaceSession,
              );
              setCurrentView("CHALLENGER_WORKSPACE");
            }}
          />
        </div>
      </div>
    );
  }

  if (currentView === "CHALLENGER_WORKSPACE") {
    if (!challengerSession) return null;
    return (
      <div className="min-h-screen bg-slate-950 p-4 sm:p-6 flex flex-col items-center justify-start overflow-y-auto lg:p-12">
        <div className="w-full max-w-5xl">
          <ChallengerWorkspace
            sessionData={challengerSession}
            onLogout={() => {
              setChallengerSession(null);
              setCurrentView("DASHBOARD");
            }}
          />
        </div>
      </div>
    );
  }

  if (currentView === "SCORECARD" && selectedLeader) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 md:p-12 flex flex-col items-center justify-start overflow-y-auto md:justify-center py-8">
        <div className="w-full max-w-4xl">
          <IndividualScorecard
            leader={selectedLeader}
            onBack={() => {
              setCurrentView("DASHBOARD");
              setSelectedLeader(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 md:p-12 text-slate-100 max-w-7xl mx-auto w-full transition-all">
      <InterceptorModal
        onNavigateToOnboarding={() => setCurrentView("ONBOARDING")}
      />

      {currentView === "DASHBOARD" && <TopAdBanner />}

      {/* HEADER SECTION */}
      <header className="mb-6 md:mb-8 flex flex-col justify-between gap-6 border-b border-slate-900 pb-6 md:pb-8 md:flex-row md:items-center">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
              Facts Tupu
            </h1>
          </Link>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Clear, honest tracking of our elected leaders and their performance
            promises.
          </p>
        </div>

        <div className="rounded-xl border border-slate-900 bg-slate-900/40 p-4 shadow-xl w-full md:w-auto md:min-w-[280px]">
          <div className="flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span>
              {accountTier === "anonymous"
                ? "Free Profile Views"
                : "Pipeline Access Status"}
            </span>
            <span
              className={
                accountTier !== "anonymous"
                  ? "text-emerald-400 animate-pulse"
                  : lookupCount >= maxQuota
                    ? "text-rose-400"
                    : "text-amber-400"
              }
            >
              {accountTier === "weekly_uploader" &&
                "Weekly Uploader Tier (Unlimited)"}
              {accountTier === "journalist" &&
                "Journalist Enterprise Tier (API Mode)"}
              {accountTier === "anonymous" &&
                `${lookupCount} of ${maxQuota} Used`}
            </span>
          </div>

          <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-950 border border-slate-900 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                accountTier !== "anonymous"
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
                  : lookupCount >= maxQuota
                    ? "bg-rose-500"
                    : "bg-amber-500"
              }`}
              style={{
                width:
                  accountTier !== "anonymous"
                    ? "100%"
                    : `${Math.min((lookupCount / maxQuota) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </header>

      {/* STICKY CONTROL & NAVIGATION HEADER */}
      <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md pt-2 pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-12 md:px-12 border-b border-slate-900/80 mb-6 shadow-2xl transition-all">
        <nav className="flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none mb-4">
          <button
            onClick={() => setActiveTab("feed")}
            className={`px-3 sm:px-4 py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider border-b-2 -mb-px transition-all ${
              activeTab === "feed"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            📢 Representative Feed
          </button>
          <button
            onClick={() => setActiveTab("ai-monitor")}
            className={`px-3 sm:px-4 py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider border-b-2 -mb-px transition-all ${
              activeTab === "ai-monitor"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            🤖 AI Progress Monitor
          </button>
          <button
            onClick={() => setActiveTab("challengers")}
            className={`px-3 sm:px-4 py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider border-b-2 -mb-px transition-all ${
              activeTab === "challengers"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            👥 Challengers Hub
          </button>
        </nav>

        {activeTab !== "ai-monitor" && (
          <section className="mb-2 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 shadow-md transition-all">
            <div className="relative w-full lg:max-w-md">
              <input
                type="text"
                placeholder="Search by leader name, county, or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-4 pr-24 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition focus:border-emerald-500"
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {loadingMore && (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                )}

                <button
                  onClick={handleVoiceSearch}
                  className={`transition-colors text-lg ${
                    isListening
                      ? "text-rose-400 animate-pulse"
                      : "text-slate-400 hover:text-emerald-400"
                  }`}
                  aria-label="Search by voice"
                >
                  {isListening ? "🎙️" : "🎤"}
                </button>

                <button
                  onClick={() => {
                    if (!searchQuery) return;
                    const count = filteredProfiles.length;
                    const topResult =
                      count > 0
                        ? `Top result is ${filteredProfiles[0].name}, ${filteredProfiles[0].role}.`
                        : "";
                    playAccessibilityAudio(
                      `Search complete for ${searchQuery}. Found ${count} representatives. ${topResult}`,
                    );
                  }}
                  className="text-slate-400 hover:text-emerald-400 text-lg"
                  aria-label="Read current search results aloud"
                >
                  🔊
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-900 overflow-x-auto scrollbar-none max-w-full">
              {["ALL", "COUNTY", "CONSTITUENCY", "WARD"].map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  className={`rounded px-3 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition whitespace-nowrap flex-1 text-center ${
                    activeLayer === layer
                      ? "bg-emerald-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {layer}
                </button>
              ))}
            </div>
          </section>
        )}

        {activeTab === "ai-monitor" && (
          <section className="mb-2 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 shadow-md transition-all">
            <div>
              <h2 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Leader Analysis Panel
              </h2>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Live evaluation matrices constructed continuously
              </p>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full lg:w-72">
                <input
                  type="text"
                  placeholder="Search leader or location..."
                  value={aiSearchQuery}
                  onChange={(e) => setAiSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition focus:border-emerald-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                  🔍
                </span>
              </div>
            </div>
          </section>
        )}
      </div>

      <main className="w-full">
        {/* FEED SECTOR */}
        <div className={activeTab === "feed" ? "block" : "hidden"}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProfiles.map((leader, idx) => (
              <div
                key={leader.id || idx}
                onClick={() => handleOpenScorecard(leader)}
                className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition-all hover:border-emerald-500/40 hover:bg-slate-900/80 cursor-pointer group shadow-sm w-full"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {leader.seat_layer || "N/A"}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-400 transition">
                      #{leader.id ? leader.id.split("-").pop() : idx}
                    </span>
                  </div>

                  <h3 className="mt-3 font-bold text-base sm:text-lg text-slate-100 group-hover:text-emerald-400 transition-colors duration-200 line-clamp-1">
                    {leader.name}
                  </h3>
                  <p className="text-xs text-emerald-500 font-medium mt-0.5">
                    {leader.role}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-1">
                    Party Affiliation:{" "}
                    <span className="text-slate-300 font-semibold">
                      {leader.party_affiliation}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-1">
                    Region Area:{" "}
                    <span className="text-slate-300 font-semibold">
                      {leader.county}
                    </span>
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-1 border-t border-b border-slate-800/60 py-3 text-center">
                    <div>
                      <div className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-tight line-clamp-1">
                        Jaba Meter
                      </div>
                      <div className="mt-1 font-mono font-bold text-amber-400 text-xs sm:text-sm">
                        {leader.jaba_meter}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-tight line-clamp-1">
                        Impact Rating
                      </div>
                      <div className="mt-1 font-mono font-bold text-cyan-400 text-xs sm:text-sm">
                        {leader.impact_rating}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-tight line-clamp-1">
                        Risk Level
                      </div>
                      <div className="mt-1 font-mono font-bold text-rose-400 text-xs sm:text-sm">
                        {leader.rvs}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-1">
                  <span className="block text-center w-full rounded-lg bg-slate-800/80 py-2 text-xs font-bold text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-200">
                    Open Framework Scorecard →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center w-full">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={loadingMore}
                className="px-6 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-bold uppercase tracking-wider text-xs hover:bg-slate-800 hover:text-emerald-400 hover:border-emerald-500/50 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></span>
                    Retrieving Next Batch...
                  </span>
                ) : (
                  "Load More Representatives ↓"
                )}
              </button>
            </div>
          )}
        </div>

        {/* AI MONITOR SECTOR */}
        {hasVisitedAiMonitor && (
          <div className={activeTab === "ai-monitor" ? "block" : "hidden"}>
            <AIMonitorSector searchQuery={aiSearchQuery} />
          </div>
        )}

        {/* CHALLENGERS SECTOR */}
        <div className={activeTab === "challengers" ? "block" : "hidden"}>
          <div className="space-y-4">
            <div className="bg-cyan-950/20 border border-cyan-900/30 p-4 rounded-xl text-xs text-cyan-400 w-full max-w-3xl">
              👥 <strong>Aspirant Information Matrix:</strong> View
              community-driven profiles of alternate candidates who have
              provided their verified manifesto documents for evaluation.
            </div>

            {loadingChallengers ? (
              <div className="flex justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
              </div>
            ) : filteredChallengers.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredChallengers.map((challenger, idx) => {
                  const manifestoSnippet = getPillarText(
                    challenger.manifesto_pillars,
                  );

                  return (
                    <div
                      key={challenger.challenger_id || idx}
                      onClick={() =>
                        router.push(`/challengers/${challenger.challenger_id}`)
                      }
                      className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 w-full cursor-pointer hover:bg-slate-900/80 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-900/50 px-2 py-0.5 rounded">
                            Aspirant Track
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            {challenger.party_affiliation || "N/A"}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white mt-3 line-clamp-1">
                          {challenger.full_name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Contesting For:{" "}
                          <span className="text-emerald-400 font-medium">
                            {challenger.target_role || "N/A"} (
                            {challenger.target_location_name || "N/A"})
                          </span>
                        </p>

                        {manifestoSnippet && (
                          <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-900/60 text-xs text-slate-300">
                            <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider mb-1">
                              Manifesto Brief:
                            </span>
                            <p className="line-clamp-2 leading-relaxed">
                              {manifestoSnippet}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-center">
                        <div>
                          <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                            Feasibility Rate
                          </span>
                          <span className="block text-sm font-bold text-cyan-400 font-mono mt-0.5">
                            {challenger.ai_feasibility_score ?? 0}%
                          </span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                            Traction Velocity
                          </span>
                          <span className="block text-sm font-bold text-slate-300 font-mono mt-0.5">
                            +{challenger.public_traction_velocity ?? 0}%
                          </span>
                        </div>
                        <div className="col-span-2 mt-2">
                          <span className="block w-full cursor-pointer rounded-lg bg-cyan-500/10 py-2 text-xs font-bold text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 hover:text-white transition-all duration-200">
                            Open Scorecard - Click to View
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/10 border border-slate-900 border-dashed rounded-xl max-w-md mx-auto w-full px-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  No upcoming alternative challengers have registered or
                  uploaded their tracking files matching this criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
