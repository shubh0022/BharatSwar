"use client";

import { useStore } from "@/lib/store";
import { UI_TRANSLATIONS } from "@/lib/translations";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Languages,
  Sparkles,
  Zap,
  Activity,
  Maximize2,
} from "lucide-react";
import Visualizer from "./Visualizer";

export default function PersistentPlayer() {
  const {
    activeTrack,
    isPlaying,
    volume,
    muted,
    progress,
    duration,
    lowBandwidthMode,
    isLyricsOpen,
    isAiDjOpen,
    visualizerOn,
    togglePlay,
    setVolume,
    toggleMute,
    seek,
    toggleLowBandwidth,
    toggleLyrics,
    toggleAiDj,
    nextTrack,
    prevTrack,
    activeLanguage,
  } = useStore();

  const t = UI_TRANSLATIONS[activeLanguage] || UI_TRANSLATIONS.en;
  const isRtl = activeLanguage === "ur";

  if (!activeTrack) return null;

  // Format time helpers (seconds -> MM:SS)
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const percent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <footer
      className={`h-24 glass-panel border-t border-white/5 flex items-center justify-between px-4 sm:px-6 select-none shrink-0 relative ${
        isRtl ? "flex-row-reverse text-right" : "flex-row"
      }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Absolute top progress indicator bar (Sleek Apple Music style mini-player progress) */}
      <div className="absolute top-0 inset-x-0 h-1 bg-white/5 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-accent-orange via-gold to-teal transition-all duration-100"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Visualizer Panel Overlay inside player (Sleek Apple integration) */}
      <div className="absolute inset-x-0 -top-20 h-20 pointer-events-none px-6 hidden sm:block">
        <div className="w-full h-full pointer-events-auto">
          <Visualizer />
        </div>
      </div>

      {/* Track Metadata Info */}
      <div className={`flex items-center gap-3.5 flex-1 sm:flex-initial sm:w-1/4 min-w-0 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeTrack.cover_url}
          alt={activeTrack.title}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-white/5 shadow-md shadow-black bg-white/5 shrink-0"
        />
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-white truncate">
            {activeTrack.title_translations[activeLanguage] || activeTrack.title}
          </h4>
          <p className="text-xs text-white/50 truncate mt-0.5">{activeTrack.artist}</p>
          <div className="hidden sm:flex items-center gap-1.5 mt-1">
            <span className="text-[9px] px-1.5 py-0.25 rounded bg-accent-orange/10 text-accent-orange font-semibold uppercase tracking-wider">
              {activeTrack.era}
            </span>
            <span className="text-[9px] px-1.5 py-0.25 rounded bg-teal/10 text-teal font-medium">
              {activeTrack.language}
            </span>
          </div>
        </div>
      </div>

      {/* Central Playback Controls & Progress Bar (Desktop only) */}
      <div className="hidden md:flex flex-col items-center gap-2 w-1/3">
        {/* Row 1: Buttons */}
        <div className={`flex items-center gap-5 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
          <button
            onClick={prevTrack}
            className="p-3 text-white/60 hover:text-white transition active:scale-90"
            title="Previous Song"
          >
            <SkipBack className="w-4.5 h-4.5 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-accent-orange to-gold flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent-orange/10 border border-white/10 shrink-0"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5.5 h-5.5 text-white fill-current" />
            ) : (
              <Play className="w-5.5 h-5.5 text-white fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-3 text-white/60 hover:text-white transition active:scale-90"
            title="Next Song"
          >
            <SkipForward className="w-4.5 h-4.5 fill-current" />
          </button>
        </div>

        {/* Row 2: Progress Slider */}
        <div className={`w-full flex items-center gap-3 text-[10px] text-white/40 font-mono ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
          <span>{formatTime(progress)}</span>
          <div className="flex-1 relative group py-1.5 cursor-pointer">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={progress}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* Custom Range Track */}
            <div className="h-1 w-full bg-white/10 rounded-full relative overflow-hidden">
              <div
                className="absolute h-full bg-gradient-to-r from-accent-orange to-gold rounded-full"
                style={{ width: `${percent}%` }}
              />
            </div>
            {/* Custom Range thumb hover indicator */}
            <div
              className="absolute w-2.5 h-2.5 rounded-full bg-white border border-accent-orange opacity-0 group-hover:opacity-100 shadow transition-opacity -top-[1px]"
              style={{
                left: isRtl ? undefined : `calc(${percent}% - 5px)`,
                right: isRtl ? `calc(${percent}% - 5px)` : undefined,
              }}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right Controls / Mobile One-hand triggers */}
      <div className={`flex items-center gap-3.5 sm:w-1/4 justify-end shrink-0 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
        {/* Mobile-only play button */}
        <button
          onClick={togglePlay}
          className="w-11 h-11 rounded-full bg-[#FF6B35] text-white flex items-center justify-center md:hidden hover:scale-105 active:scale-95 transition-all shadow shadow-[#FF6B35]/25"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white fill-current" />
          ) : (
            <Play className="w-5 h-5 text-white fill-current translate-x-0.5" />
          )}
        </button>

        {/* Mobile-only next button */}
        <button
          onClick={nextTrack}
          className="p-3 text-white/60 hover:text-white transition active:scale-90 md:hidden"
          title="Next Song"
        >
          <SkipForward className="w-4.5 h-4.5 fill-current" />
        </button>

        {/* Bandwidth Quality Indicator (Hidden on mobile) */}
        <button
          onClick={toggleLowBandwidth}
          className={`p-2.5 rounded-xl transition-all hidden sm:flex items-center gap-1.5 text-[10px] font-bold border ${
            lowBandwidthMode
              ? "bg-accent-orange/10 text-accent-orange border-accent-orange/20"
              : "text-white/40 hover:text-white border-transparent"
          }`}
          title={lowBandwidthMode ? "Switch to High Quality" : "Switch to Low Data Mode"}
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">
            {lowBandwidthMode ? "Low Data (30s)" : "HQ Audio"}
          </span>
        </button>

        {/* Synced Lyrics Toggle */}
        <button
          onClick={() => toggleLyrics()}
          className={`p-3 rounded-xl border transition shrink-0 ${
            isLyricsOpen
              ? "bg-teal/15 text-teal border-teal/20"
              : "text-white/50 hover:text-white border-transparent"
          }`}
          title={t.lyricsTitle}
        >
          <Languages className="w-4.5 h-4.5" />
        </button>

        {/* Volume Controls (Hidden on mobile) */}
        <div className={`hidden sm:flex items-center gap-2 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
          <button onClick={toggleMute} className="text-white/50 hover:text-white p-2">
            {muted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 rounded bg-white/10 appearance-none outline-none cursor-pointer accent-accent-orange"
          />
        </div>
      </div>
    </footer>
  );
}
