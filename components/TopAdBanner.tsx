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
} from "lucide-react";
import Image from "next/image";

export interface AdCampaign {
  id: string;
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

export default function TopAdBanner() {
  const [ads, setAds] = useState<AdCampaign[]>([
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
      badge: "Ad",
      title: "Secure High-Yield Investments",
      description:
        "Discover secure and high-yield opportunities in emerging markets. Join thousands securing their future.",
      ctaText: "Learn More",
      ctaLink: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "ad-3",
      badge: "Partner",
      title: "Advanced Cloud Infrastructure",
      description:
        "Migrate your databases with zero downtime. Get $500 in free credits for your first month.",
      ctaText: "Claim Credits",
      ctaLink: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "ad-4",
      badge: "Sponsored",
      title: "Enterprise Cybersecurity",
      description:
        "Protect your platform from DDoS attacks and data breaches with our military-grade firewall.",
      ctaText: "Get Protected",
      ctaLink: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
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
  const [newImageUrl, setNewImageUrl] = useState("");

  // Responsive Auto-Rotation Logic
  useEffect(() => {
    if (ads.length <= 1 || !isVisible) return;

    const interval = setInterval(() => {
      // 1. Fade out smoothly
      setFadeState("opacity-0 translate-y-2 blur-[2px]");

      setTimeout(() => {
        // 2. Check screen width securely on the client to determine steps
        const isDesktop = window.innerWidth >= 1024; // 'lg' breakpoint
        const step = isDesktop && ads.length > 1 ? 2 : 1; // 2 steps for desktop, 1 for mobile

        setCurrentIndex((prev) => (prev + step) % ads.length);

        // 3. Fade back in
        setFadeState("opacity-100 translate-y-0 blur-none");
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, [ads.length, isVisible]);

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newImageUrl)
      return alert("Please provide a title, description, and image URL.");

    const createdAd: AdCampaign = {
      id: `ad-${Date.now()}`,
      badge: newBadge,
      title: newTitle,
      description: newDescription,
      ctaText: newCtaText,
      ctaLink: newCtaLink,
      imageUrl: newImageUrl,
    };

    setAds([createdAd, ...ads]);
    setCurrentIndex(0);
    setIsFormOpen(false);

    // Reset Form
    setNewTitle("");
    setNewDescription("");
    setNewImageUrl("");
    setNewCtaText("Learn More");
    setNewCtaLink("https://");
  };

  if (!isVisible || ads.length === 0) return null;

  const ad1 = ads[currentIndex % ads.length];
  const ad2 = ads.length > 1 ? ads[(currentIndex + 1) % ads.length] : null;

  // Reusable Ad Card Component updated for perfect mobile ratios
  const AdCard = ({ ad }: { ad: AdCampaign }) => (
    <div className="relative w-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl flex flex-col sm:flex-row group overflow-hidden h-auto sm:h-40 lg:h-44 transition-all hover:border-slate-700 hover:shadow-2xl">
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

      {/* Image Section - Adjusted for mobile single-row height */}
      <div className="w-full h-36 sm:w-[35%] sm:h-full relative overflow-hidden bg-slate-950 border-b sm:border-b-0 sm:border-r border-slate-800 shrink-0">
        <Image
          src={ad.imageUrl}
          alt={ad.title}
          height={120}
          width={120}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop";
          }}
        />
      </div>

      {/* Content Section */}
      <div className="w-full sm:w-[65%] p-4 lg:p-5 flex flex-col justify-center relative bg-gradient-to-br from-slate-900 to-slate-950">
        <h3 className="text-sm lg:text-base font-bold text-slate-100 mb-1.5 leading-snug pr-8 line-clamp-2">
          {ad.title}
        </h3>
        <p className="text-slate-400 text-xs lg:text-sm mb-4 sm:mb-3 line-clamp-2 sm:line-clamp-2 leading-relaxed">
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
      {/* 
        GRID LOGIC UPDATE:
        - Mobile: grid-cols-1 (Only the first child renders because the second child is wrapped in `hidden lg:block`)
        - Desktop: lg:grid-cols-2 (Both render side-by-side)
      */}
      <div
        className={`w-full grid grid-cols-1 ${ad2 ? "lg:grid-cols-2" : ""} gap-4 lg:gap-6 transition-all duration-500 ease-in-out ${fadeState} will-change-transform`}
      >
        <div className="w-full">
          <AdCard ad={ad1} />
        </div>

        {/* Hide the second ad slot completely on anything smaller than desktop breakpoints */}
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
          {/* ... Rest of your form exactly as it was ... */}
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
                Image URL (Required)
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 outline-none focus:border-blue-500 transition-colors"
                />
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
