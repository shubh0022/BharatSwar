"use client";

import { useStore, UiLanguage } from "@/lib/store";
import { UI_TRANSLATIONS } from "@/lib/translations";
import { Radio, Compass, Globe, Sliders, Milestone, FolderHeart, LogOut } from "lucide-react";
import Logo from "./Logo";

const LANGUAGES_LIST: { code: UiLanguage; name: string; native: string }[] = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", native: "অসমীয়া" },
  { code: "ur", name: "Urdu", native: "اردو" },
];

export const ERAS_LIST = [
  { id: "Ancient", name: "Ancient", range: "1000-1499", desc: "Classical roots" },
  { id: "Medieval", name: "Medieval", range: "1500-1799", desc: "Mughal & Dhrupad" },
  { id: "Colonial", name: "Colonial", range: "1800-1946", desc: "Gramophone & Thumri" },
  { id: "Golden Age", name: "Golden Age", range: "1947-1969", desc: "Bollywood Golden Era" },
  { id: "Classic", name: "Classic", range: "1770-1989", desc: "Kishore & RD Burman" },
  { id: "Modern", name: "Modern", range: "1990-2009", desc: "AR Rahman Revolution" },
  { id: "Digital", name: "Digital", range: "2010-2019", desc: "Indie & Streaming" },
  { id: "Now", name: "Now", range: "2020-2026", desc: "AI & Global Indian" },
];

interface SidebarProps {
  onSelectEra: (eraId: string | null) => void;
  selectedEra: string | null;
}

export default function Sidebar({ onSelectEra, selectedEra }: SidebarProps) {
  const { activeLanguage, setActiveLanguage, activeTab, setActiveTab, userProfile, logout } = useStore();
  const t = UI_TRANSLATIONS[activeLanguage] || UI_TRANSLATIONS.en;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveLanguage(e.target.value as UiLanguage);
  };

  const isRtl = activeLanguage === "ur";

  return (
    <aside
      className={`w-64 glass-panel hidden md:flex flex-col h-full overflow-y-auto px-4 py-6 border-r border-white/5 select-none shrink-0 ${isRtl ? "text-right font-lyrics" : "text-left"
        }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Brand Header — matches uploaded BharatSwar logo */}
      <div className="flex flex-col items-center gap-2 mb-8 px-2 py-3 border-b border-white/5">
        {/* Logo Mark */}
        <div className="drop-shadow-[0_0_16px_rgba(255,85,0,0.35)]">
          <Logo size={54} />
        </div>
        {/* Wordmark */}
        <div className="text-center">
          <h1
            className="text-[22px] font-bold leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            <span className="text-white">Bharat</span>
            <span className="text-[#FF5500]">S</span>
            <span className="text-white">war</span>
          </h1>
          {/* Gold divider + Devanagari */}
          <div className="flex items-center justify-center gap-2 mt-0.5">
            <div className="h-px w-6 bg-gradient-to-r from-transparent to-[#FFB800]/60" />
            <span className="text-[11px] font-semibold text-[#FFB800]/90 tracking-[0.12em]">
              भारत स्वर
            </span>
            <div className="h-px w-6 bg-gradient-to-l from-transparent to-[#FFB800]/60" />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-1.5 mb-8">
        <button
          onClick={() => setActiveTab("Home")}
          className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl border text-left transition-all duration-200 ${
            activeTab === "Home"
              ? "bg-white/5 text-white border-white/5 shadow-inner"
              : "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <Compass className={`w-4 h-4 ${activeTab === "Home" ? "text-accent-orange" : ""}`} />
          <span className="text-sm font-medium">{t.home}</span>
        </button>
        <button
          onClick={() => setActiveTab("Discover")}
          className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl border text-left transition-all duration-200 ${
            activeTab === "Discover"
              ? "bg-white/5 text-white border-white/5 shadow-inner"
              : "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <Globe className={`w-4 h-4 ${activeTab === "Discover" ? "text-teal" : ""}`} />
          <span className="text-sm font-medium">{t.worldMusic}</span>
        </button>
        <button
          onClick={() => setActiveTab("Radio")}
          className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl border text-left transition-all duration-200 ${
            activeTab === "Radio"
              ? "bg-white/5 text-white border-white/5 shadow-inner"
              : "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <Radio className={`w-4 h-4 ${activeTab === "Radio" ? "text-gold" : ""}`} />
          <span className="text-sm font-medium">Radio Broadcasts</span>
        </button>
        <button
          onClick={() => setActiveTab("Library")}
          className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl border text-left transition-all duration-200 ${
            activeTab === "Library"
              ? "bg-white/5 text-white border-white/5 shadow-inner"
              : "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <FolderHeart className={`w-4 h-4 ${activeTab === "Library" ? "text-red-400" : ""}`} />
          <span className="text-sm font-medium">{t.library}</span>
        </button>
      </nav>

      {/* Language Preferences */}
      <div className="mb-8 px-2">
        <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5" />
          {t.languages}
        </h3>
        <div className="relative">
          <select
            value={activeLanguage}
            onChange={handleLanguageChange}
            className="w-full bg-white/5 hover:bg-white/8 border border-white/10 text-white rounded-xl py-2.5 px-3 text-sm transition-all outline-none appearance-none cursor-pointer focus:border-accent-orange/50"
          >
            {LANGUAGES_LIST.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-surface text-white">
                {lang.native} ({lang.name})
              </option>
            ))}
          </select>
          <div
            className={`absolute pointer-events-none top-1/2 -translate-y-1/2 ${isRtl ? "left-3" : "right-3"
              } text-white/40 text-xs`}
          >
            ▼
          </div>
        </div>
      </div>

      {/* Era Navigation (Timeline Machine) */}
      <div className="px-2 flex-grow">
        <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Milestone className="w-3.5 h-3.5" />
          {t.eraExplorer}
        </h3>

        <div className="relative pl-3 border-l-2 border-white/10 space-y-4">
          {ERAS_LIST.map((era) => {
            const isSelected = selectedEra === era.id;
            return (
              <button
                key={era.id}
                onClick={() => onSelectEra(isSelected ? null : era.id)}
                className="w-full group text-left flex flex-col justify-start relative focus:outline-none"
              >
                {/* Visual marker dot */}
                <div
                  className={`absolute w-3 h-3 rounded-full -left-[18.5px] top-1 transition-all duration-200 ${isSelected
                      ? "bg-accent-orange border-2 border-primary-bg scale-125 shadow-glow"
                      : "bg-white/20 group-hover:bg-white/40"
                    }`}
                />
                <span
                  className={`text-xs font-semibold tracking-wide transition-all ${isSelected ? "text-accent-orange" : "text-white/80 group-hover:text-white"
                    }`}
                >
                  {era.name} <span className="text-[9px] text-white/40">({era.range})</span>
                </span>
                <span className="text-[9px] text-white/40 group-hover:text-white/60 line-clamp-1">
                  {era.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {/* User Profile Section */}
      {userProfile && (
        <div className="mt-auto pt-4 border-t border-white/5 px-2">
          <div className="flex items-center gap-3 py-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35]/30 to-[#F7C948]/20 flex items-center justify-center text-lg shrink-0">
              {userProfile.avatarEmoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userProfile.displayName}</p>
              <p className="text-xs text-white/35 capitalize truncate">
                {userProfile.authMethod === "guest" ? "Guest" : `via ${userProfile.authMethod}`}
              </p>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="text-white/25 hover:text-[#FF6B35] transition-colors p-1.5 rounded-lg hover:bg-[#FF6B35]/10 cursor-pointer"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
