"use client";

import { useState, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { UI_TRANSLATIONS } from "@/lib/translations";
import { X, Globe, Mic2, AlertCircle } from "lucide-react";

export default function LyricsDrawer() {
  const { activeTrack, progress, isLyricsOpen, toggleLyrics, seek, activeLanguage } = useStore();
  const [showTranslations, setShowTranslations] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const t = UI_TRANSLATIONS[activeLanguage] || UI_TRANSLATIONS.en;
  const isRtl = activeLanguage === "ur";

  // Auto-scroll to active lyric line
  useEffect(() => {
    if (!isLyricsOpen || !activeTrack?.lyrics) return;

    const activeEl = containerRef.current?.querySelector(".lyric-line.active");
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [progress, isLyricsOpen, activeTrack]);

  if (!isLyricsOpen) return null;

  const lyrics = activeTrack?.lyrics || [];

  // Determine active index
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (progress >= lyrics[i].time) {
      if (i === lyrics.length - 1 || progress < lyrics[i + 1].time) {
        activeIndex = i;
        break;
      }
    }
  }

  return (
    <aside
      className={`w-80 glass-panel border-l border-white/5 flex flex-col h-full shrink-0 z-20 ${
        isRtl ? "text-right" : "text-left"
      }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header Panel */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-accent-orange font-bold text-sm uppercase tracking-wide">
          <Mic2 className="w-4 h-4" />
          <span>{t.lyrics}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Translation Toggle */}
          <button
            onClick={() => setShowTranslations(!showTranslations)}
            className={`p-1.5 rounded-lg border transition ${
              showTranslations
                ? "bg-teal/15 text-teal border-teal/20"
                : "text-white/40 hover:text-white border-transparent"
            }`}
            title={t.translationToggle}
          >
            <Globe className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleLyrics(false)}
            className="p-1.5 text-white/40 hover:text-white transition rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sync Scroll Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-6 py-12 space-y-7 scroll-smooth font-lyrics selection:bg-teal/20"
      >
        {lyrics.length > 0 ? (
          lyrics.map((line, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={idx}
                onClick={() => seek(line.time)}
                className={`lyric-line ${
                  isActive ? "active text-accent-orange text-lg font-bold" : "text-white/40 hover:text-white/80 text-sm font-medium"
                }`}
              >
                {/* Native Lyric Line */}
                <p className="leading-relaxed">{line.text}</p>
                {/* Translated Lyric Line */}
                {showTranslations && line.translation && (
                  <p
                    className={`text-xs mt-1.5 font-light leading-relaxed ${
                      isActive ? "text-teal font-medium" : "text-white/20"
                    }`}
                  >
                    {line.translation}
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-white/30 space-y-3 px-4">
            <AlertCircle className="w-8 h-8 text-white/20" />
            <p className="text-xs">
              No synced lyrics available for this preview track. Select a custom historical raga to view synced translation karaoke!
            </p>
          </div>
        )}
      </div>

      {/* Footer Song Context */}
      {activeTrack && (
        <div className="p-4 bg-white/5 border-t border-white/5 text-[11px] text-white/50 space-y-1.5">
          <p className="font-semibold text-white/80">Track Meta Detail:</p>
          <p>Language: {activeTrack.language}</p>
          <p>Era Class: {activeTrack.era}</p>
          {activeTrack.raga_info && (
            <div className="mt-2 pt-2 border-t border-white/5">
              <p className="font-semibold text-accent-orange/80">Raga Info:</p>
              <p className="line-clamp-3 text-[10px] mt-0.5 leading-relaxed">
                {activeTrack.raga_info}
              </p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
