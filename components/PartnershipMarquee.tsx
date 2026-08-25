"use client";

import React from "react";
import { Handshake } from "lucide-react";
import Image from "next/image";
import image from "./image.png"; // Import the image asset

interface Partner {
  name: string;
  role: string;
  icon?: string;
  image?: string; // Added to support custom image assets
}

export default function PartnershipMarquee() {
  const basePartners: Partner[] = [
    { name: "Transparency International", role: "Governance", icon: "🏛️" },
    { name: "Mzalendo Trust", role: "Parliament Watch", icon: "👁️" },
    { name: "Africa Data Hub", role: "Data Integrity", icon: "📊" },
    { name: "Ushahidi", role: "Tech Infrastructure", icon: "🌐" },
    { name: "Code for Africa", role: "Civic Tech", icon: "💻" },
    { name: "Katiba Institute", role: "Constitutionalism", icon: "📜" },
    // Added ONUG with the image reference
    {
      name: "One Nation Under God (ONUG)",
      role: "Strategic Partner",
      image: image.src, // Use the imported image asset
    },
  ];

  // Duplicate the list to ensure a flawless, gapless loop during transition
  const scrollingPartners = [...basePartners, ...basePartners, ...basePartners];

  return (
    <section className="w-full mt-16 mb-12 border-t border-b border-slate-900/60 bg-slate-950 py-8 relative overflow-hidden">
      {/* Scope-injected styles to guarantee buttery-smooth infinite tracking without breaking tailwind configs */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.3333%);
          }
        }
        .animate-infinite-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-infinite-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header / Sub-title section */}
      <div className="max-w-7xl mx-auto px-4 mb-6 flex items-center gap-2 text-slate-400">
        <Handshake className="w-4 h-4 text-emerald-500" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
          Supported Platforms & Governance Data Integrity Partners
        </span>
      </div>

      {/* Marquee Wrapper with fading edge masks */}
      <div className="relative w-full overflow-hidden flex items-center">
        {/* Left Side Shadow Fade Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />

        {/* Right Side Shadow Fade Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        {/* Scrolling Flex Row Container */}
        <div className="flex w-max gap-6 animate-infinite-marquee will-change-transform py-2">
          {scrollingPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex items-center gap-4 bg-slate-900/30 border border-slate-900 px-5 py-3 rounded-xl min-w-[240px] sm:min-w-[280px] hover:border-emerald-500/30 hover:bg-slate-900/60 transition-all duration-300 group cursor-pointer"
            >
              {/* Desaturated icon/image that lights up on hover */}
              <div className="text-2xl flex items-center justify-center w-8 h-8 opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
                {partner.image ? (
                  <Image
                    src={partner.image}
                    alt={`${partner.name} logo`}
                    className="w-full h-full object-contain drop-shadow-md"
                    height={128}
                    width={128}
                  />
                ) : (
                  partner.icon
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-slate-300 group-hover:text-white transition-colors duration-200 whitespace-nowrap">
                  {partner.name}
                </span>
                <span className="text-[10px] text-slate-500 font-medium group-hover:text-emerald-400 transition-colors duration-200 uppercase tracking-wider mt-0.5">
                  {partner.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
