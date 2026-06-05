"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { UI_TRANSLATIONS } from "@/lib/translations";
import { detectUserRegion } from "@/lib/api";
import { Search, MapPin, WifiOff, Wifi, User, Menu, Sparkles } from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  const {
    activeLanguage,
    userRegion,
    setRegion,
    isAiDjOpen,
    toggleAiDj,
    offlineMode,
    toggleOfflineMode,
    userProfile,
  } = useStore();

  const [isLocating, setIsLocating] = useState(false);
  const t = UI_TRANSLATIONS[activeLanguage] || UI_TRANSLATIONS.en;

  // Auto-detect region on mount
  useEffect(() => {
    async function initRegion() {
      setIsLocating(true);
      const region = await detectUserRegion();
      setRegion(region);
      setIsLocating(false);
    }
    initRegion();
  }, [setRegion]);

  const handleManualRelocate = async () => {
    setIsLocating(true);
    const region = await detectUserRegion();
    setRegion(region);
    setIsLocating(false);
  };

  const isRtl = activeLanguage === "ur";

  return (
    <header
      className={`h-20 glass-panel border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-10 select-none ${isRtl ? "flex-row-reverse text-right" : "flex-row"
        }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Menu & Search Container */}
      <div className={`flex items-center gap-4 w-1/2 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
        <button className="md:hidden text-white/70 hover:text-white">
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full py-2.5 rounded-full glass-input text-sm text-white/90 focus:ring-1 focus:ring-accent-orange/40 ${isRtl ? "pr-11 pl-4" : "pl-11 pr-4"
              }`}
          />
          <Search
            className={`w-4 h-4 text-white/40 absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-4" : "left-4"
              }`}
          />
        </div>
      </div>

      {/* Right Action Badges */}
      <div className={`flex items-center gap-4 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
        {/* Geolocation Badge */}
        <button
          onClick={handleManualRelocate}
          disabled={isLocating}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/8 border border-white/8 text-xs text-white/80 transition-all font-medium active:scale-95"
        >
          <MapPin className={`w-3.5 h-3.5 text-teal ${isLocating ? "animate-bounce" : ""}`} />
          <span className="truncate max-w-[140px]">
            {isLocating ? "Locating..." : userRegion}
          </span>
        </button>

        {/* Offline Mode Switch */}
        <button
          onClick={toggleOfflineMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all font-medium ${offlineMode
              ? "bg-accent-orange/15 text-accent-orange border-accent-orange/30 shadow-[0_0_12px_rgba(255,107,53,0.15)]"
              : "bg-white/5 text-white/70 border-white/5 hover:bg-white/8"
            }`}
          title={offlineMode ? "Switch to Online Mode" : "Switch to Offline Mode"}
        >
          {offlineMode ? (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-teal/80" />
              <span>Online</span>
            </>
          )}
        </button>

        {/* AI DJ Assistant Trigger */}
        <button
          onClick={() => toggleAiDj()}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold tracking-wide transition-all duration-300 ${isAiDjOpen
              ? "bg-gradient-to-r from-ai-purple to-accent-orange text-white border-transparent glow-purple hover:brightness-105"
              : "bg-white/5 text-white hover:bg-white/8 border-white/10 hover:border-white/20"
            }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.askDjBtn}</span>
        </button>

        {/* User Profile avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF5500] to-[#FFBB00] flex items-center justify-center p-[1.5px] cursor-pointer hover:opacity-90 hover:scale-105 transition-all">
          <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center text-base">
            {userProfile?.avatarEmoji
              ? <span>{userProfile.avatarEmoji}</span>
              : <User className="w-4 h-4 text-white/80" />}
          </div>
        </div>
      </div>
    </header>
  );
}
