/* eslint-disable react-hooks/static-components */
"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  PlusCircle,
  Sparkles,
  ExternalLink,
  Info,
  Image as ImageIcon,
  Video as VideoIcon,
} from "lucide-react";
import Image from "next/image";

export interface AdCampaign {
  id: string;
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageUrl?: string;
  videoUrl?: string;
  isPortrait?: boolean;
}

export default function TopAdBanner() {
  const [ads, setAds] = useState<AdCampaign[]>([
    {
      id: "official-facts-tupu-ad",
      badge: "Official Platform Ad",
      title: "Know Your Candidate — 2027 General Elections",
      description:
        "Question, ask, and scrutinize. Make informed decisions with verified candidate insights on Facts-Tupu.com.",
      ctaText: "Explore Candidates",
      ctaLink: "https://www.factstupu.com",
      videoUrl: "/videos/video_ad_2.mp4", // <-- Update this path to your new landscape video
      isPortrait: false, // <-- Change to false for landscape
    },
    {
      id: "ad-1",
      badge: "Sponsored",
      title: "Supercharge Your AI Development",
      description:
        "Build, deploy, and scale AI models faster with the ultimate SaaS AI Launchpad.",
      ctaText: "Start Free Trial",
      ctaLink: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "ad-2",
      badge: "Partner",
      title: "Secure High-Yield Investments",
      description:
        "Discover secure and high-yield opportunities in emerging markets.",
      ctaText: "Learn More",
      ctaLink: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [fadeState, setFadeState] = useState(
    "opacity-100 translate-y-0 blur-none",
  );

  // Form State
  const [newBadge, setNewBadge] = useState("Sponsored");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCtaText, setNewCtaText] = useState("Learn More");
  const [newCtaLink, setNewCtaLink] = useState("https://");
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [isMediaVideo, setIsMediaVideo] = useState(false);

  // Auto-Rotation Logic
  useEffect(() => {
    if (ads.length <= 1 || !isVisible) return;

    const interval = setInterval(() => {
      setFadeState("opacity-0 translate-y-2 blur-[2px]");

      setTimeout(() => {
        const isDesktop = window.innerWidth >= 1024;
        const step = isDesktop && ads.length > 1 ? 2 : 1;

        setCurrentIndex((prev) => (prev + step) % ads.length);
        setFadeState("opacity-100 translate-y-0 blur-none");
      }, 500);
    }, 10000); // 10 seconds per rotation to allow video playback

    return () => clearInterval(interval);
  }, [ads.length, isVisible]);

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newMediaUrl)
      return alert("Please provide a title, description, and media URL.");

    const createdAd: AdCampaign = {
      id: `ad-${Date.now()}`,
      badge: newBadge,
      title: newTitle,
      description: newDescription,
      ctaText: newCtaText,
      ctaLink: newCtaLink,
      imageUrl: !isMediaVideo ? newMediaUrl : undefined,
      videoUrl: isMediaVideo ? newMediaUrl : undefined,
      isPortrait: isMediaVideo,
    };

    setAds([createdAd, ...ads]);
    setCurrentIndex(0);
    setIsFormOpen(false);

    // Reset Form
    setNewTitle("");
    setNewDescription("");
    setNewMediaUrl("");
    setNewCtaText("Learn More");
    setNewCtaLink("https://");
  };

  if (!isVisible || ads.length === 0) return null;

  const ad1 = ads[currentIndex % ads.length];
  const ad2 = ads.length > 1 ? ads[(currentIndex + 1) % ads.length] : null;

  // Reusable Ad Card Component (Supports Portrait Video & Images)
  const AdCard = ({ ad }: { ad: AdCampaign }) => (
    <div className="relative w-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl flex flex-col sm:flex-row group overflow-hidden h-auto sm:h-44 lg:h-48 transition-all hover:border-slate-700 hover:shadow-2xl">
      {/* Badge */}
      <div className="absolute top-0 right-0 bg-slate-950/90 backdrop-blur-md text-slate-400 text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded-bl-lg z-20 flex items-center gap-1 border-b border-l border-slate-800">
        {ad.badge}
        <Info className="w-2.5 h-2.5 ml-0.5" />
      </div>

      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1.5 left-1.5 z-20 bg-black/50 hover:bg-black/90 text-white p-1 rounded-full backdrop-blur-md transition-all border border-white/10"
        title="Close Ad"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Media Section (Portrait Video vs Standard Image) */}
      <div className="w-full h-44 sm:w-[38%] sm:h-full relative overflow-hidden bg-slate-950 border-b sm:border-b-0 sm:border-r border-slate-800 shrink-0 flex items-center justify-center">
        {ad.videoUrl ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
            {/* Ambient Background Blur for Portrait Fit */}
            <video
              src={ad.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-md scale-110"
            />
            {/* Main Smooth Looping Video */}
            <video
              src={ad.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="relative z-10 max-h-full max-w-full object-contain"
            />
          </div>
        ) : (
          <Image
            src={
              ad.imageUrl ||
              "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop"
            }
            alt={ad.title}
            height={200}
            width={200}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop";
            }}
          />
        )}
      </div>

      {/* Content Section */}
      <div className="w-full sm:w-[62%] p-4 lg:p-5 flex flex-col justify-center relative bg-gradient-to-br from-slate-900 to-slate-950">
        <h3 className="text-sm lg:text-base font-bold text-slate-100 mb-1.5 leading-snug pr-8 line-clamp-2">
          {ad.title}
        </h3>
        <p className="text-slate-400 text-xs lg:text-sm mb-4 sm:mb-3 line-clamp-2 leading-relaxed">
          {ad.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <a
            href={ad.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] lg:text-xs font-bold rounded-md transition-all shadow-md hover:shadow-blue-500/25 group/btn w-fit"
          >
            {ad.ctaText}
            <ExternalLink className="w-3 h-3 ml-1.5 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </a>

          <span className="text-[9px] text-slate-600 font-medium hidden sm:block">
            Advertisement
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full mb-8 flex flex-col">
      <div
        className={`w-full grid grid-cols-1 ${
          ad2 ? "lg:grid-cols-2" : ""
        } gap-4 lg:gap-6 transition-all duration-500 ease-in-out ${fadeState} will-change-transform`}
      >
        <div className="w-full">
          <AdCard ad={ad1} />
        </div>

        {ad2 && (
          <div className="hidden lg:block w-full">
            <AdCard ad={ad2} />
          </div>
        )}
      </div>

      {/* ADMIN TOGGLE */}
      <div className="w-full mt-3 flex justify-end">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1.5 text-[9px] lg:text-[10px] font-bold text-slate-500 hover:text-blue-400 tracking-wider transition-colors uppercase"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          {isFormOpen ? "Close Ad Manager" : "Admin: Add Display Ad"}
        </button>
      </div>

      {/* ADMIN FORM DRAWER */}
      {isFormOpen && (
        <div className="w-full mt-3 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-5 shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Create New Display Ad
            </h4>
          </div>

          <form
            onSubmit={handleCreateAd}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
          >
            <div className="md:col-span-2">
              <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-tight text-[10px]">
                Media URL (Image or Video)
              </label>
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  {isMediaVideo ? (
                    <VideoIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  ) : (
                    <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  )}
                  <input
                    type="url"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder={
                      isMediaVideo
                        ? "https://.../video.mp4"
                        : "https://images.unsplash.com/..."
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsMediaVideo(!isMediaVideo)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                    isMediaVideo
                      ? "bg-blue-600/20 border-blue-500 text-blue-300"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  {isMediaVideo ? "Video Mode" : "Image Mode"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-tight text-[10px]">
                Headline
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter eye-catching title..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-tight text-[10px]">
                Badge Text
              </label>
              <input
                type="text"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                placeholder="Sponsored, Ad, Partner..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-tight text-[10px]">
                Description
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Write the ad copy..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-tight text-[10px]">
                Button Text
              </label>
              <input
                type="text"
                value={newCtaText}
                onChange={(e) => setNewCtaText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-tight text-[10px]">
                Destination Link
              </label>
              <input
                type="url"
                value={newCtaLink}
                onChange={(e) => setNewCtaLink(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="md:col-span-2 pt-1">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-lg transition-colors shadow-lg shadow-blue-900/20 uppercase tracking-wider text-xs"
              >
                Publish Display Ad
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
