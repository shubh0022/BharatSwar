"use client";

import { useState, useRef, useEffect } from "react";
import { useStore, Track } from "@/lib/store";
import { UI_TRANSLATIONS } from "@/lib/translations";
import { searchTracks, generateAiDjPlaylist } from "@/lib/api";
import { X, Send, Play, Radio, Loader2 } from "lucide-react";
import Logo from "./Logo";

export default function AiDjPanel() {
  const {
    isAiDjOpen,
    toggleAiDj,
    aiChatHistory,
    addChatMessage,
    playPlaylist,
    activeLanguage,
    currentMood,
    setMood,
  } = useStore();

  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const t = UI_TRANSLATIONS[activeLanguage] || UI_TRANSLATIONS.en;
  const isRtl = activeLanguage === "ur";

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChatHistory, isTyping]);

  if (!isAiDjOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const query = inputVal;
    setInputVal("");

    // 1. Add User Message
    addChatMessage({
      sender: "user",
      text: query,
    });

    // 2. Show Typing Indicator
    setIsTyping(true);

    // 3. Process Prompt (Simulated LLM + Deezer Query Bridge)
    setTimeout(async () => {
      let djText = "";
      let recommendedTracks: Track[] = [];
      let reasoning = "";

      const queryLower = query.toLowerCase();

      // Wire AI DJ mood outputs to automatically update active mood theme
      if (
        queryLower.includes("workout") ||
        queryLower.includes("dance") ||
        queryLower.includes("gym") ||
        queryLower.includes("energetic") ||
        queryLower.includes("garba")
      ) {
        setMood("Energetic");
      } else if (
        queryLower.includes("love") ||
        queryLower.includes("romantic") ||
        queryLower.includes("romance")
      ) {
        setMood("Romantic");
      } else if (
        queryLower.includes("sad") ||
        queryLower.includes("ghazal") ||
        queryLower.includes("soulful")
      ) {
        setMood("Soulful");
      } else if (
        queryLower.includes("bhajan") ||
        queryLower.includes("devotional") ||
        queryLower.includes("temple")
      ) {
        setMood("Devotional");
      } else if (
        queryLower.includes("meditation") ||
        queryLower.includes("peaceful") ||
        queryLower.includes("calm") ||
        queryLower.includes("raga")
      ) {
        setMood("Peaceful");
      }

      // Check heuristics for custom tracks first
      if (
        queryLower.includes("raga") ||
        queryLower.includes("classical") ||
        queryLower.includes("morning") ||
        queryLower.includes("meditation") ||
        queryLower.includes("calm")
      ) {
        const res = generateAiDjPlaylist("Peaceful", "All", "All", "Sunny", "Morning");
        recommendedTracks = res.tracks;
        reasoning = res.reasoning;
        djText = `I have compiled a tranquil selection of morning Ragas and Vedic chants. These selections focus on traditional sitar and vocal performance, perfect for bringing peace and alignment to your mind.`;
      } else if (
        queryLower.includes("ghazal") ||
        queryLower.includes("sad") ||
        queryLower.includes("romantic") ||
        queryLower.includes("urdu") ||
        queryLower.includes("love")
      ) {
        const res = generateAiDjPlaylist("Melancholic", "All", "All", "Cloudy", "Evening");
        recommendedTracks = res.tracks;
        reasoning = res.reasoning;
        djText = `Longing and sweet romance represent the core of Hindustani light classical music. Here is a curated Ghazal and Thumri playlist set in evening ragas like Yaman and Bhairavi.`;
      } else {
        // Run a live search query on Deezer to find relevant music!
        try {
          const results = await searchTracks(query);
          if (results.length > 0) {
            recommendedTracks = results.slice(0, 5);
            djText = `I checked the live catalog for "${query}". I found these top tracks for your vibe. Queuing them up in your AI player console.`;
            reasoning = `Based on your request for "${query}", I have selected the highest matches from the modern Indian and world streams.`;
          } else {
            recommendedTracks = [];
            djText = `I searched the library for "${query}" but couldn't find matches. Try typing a mood like "relaxing", an artist like "A.R. Rahman", or a song name.`;
          }
        } catch (e) {
          djText = `I encountered a connection error. Let's fall back to some peaceful classical ragas.`;
          recommendedTracks = [];
        }
      }

      // Add DJ response
      addChatMessage({
        sender: "dj",
        text: djText,
        tracks: recommendedTracks.length > 0 ? recommendedTracks : undefined,
        reasoning: reasoning || undefined,
      });

      // Play the compiled list automatically
      if (recommendedTracks.length > 0) {
        playPlaylist(recommendedTracks, 0);
      }

      setIsTyping(false);
    }, 1200);
  };

  return (
    <aside
      className={`w-80 glass-panel border-l border-white/5 flex flex-col h-full shrink-0 z-20 ${
        isRtl ? "text-right" : "text-left"
      }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header Panel */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-ai-purple font-bold text-sm uppercase tracking-wider">
          <Logo size={18} />
          <span>{t.aiDjTitle}</span>
        </div>
        <button
          onClick={() => toggleAiDj(false)}
          className="p-1.5 text-white/40 hover:text-white transition rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {aiChatHistory.map((msg, idx) => {
          const isDj = msg.sender === "dj";
          return (
            <div
              key={idx}
              className={`flex flex-col max-w-[85%] ${
                isDj ? "self-start" : "self-end ml-auto"
              } space-y-1`}
            >
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  isDj
                    ? "bg-white/5 text-white/90 rounded-tl-none border border-white/5"
                    : "bg-gradient-to-r from-ai-purple to-accent-orange text-white rounded-tr-none shadow-md shadow-purple-950/10"
                }`}
              >
                {msg.text}

                {/* Playlist Embed within Chat */}
                {msg.tracks && msg.tracks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-teal font-bold flex items-center gap-1">
                      <Radio className="w-3 h-3" />
                      <span>Compiled Tracklist</span>
                    </p>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {msg.tracks.map((track) => (
                        <div
                          key={track.id}
                          onClick={() => playPlaylist(msg.tracks!, msg.tracks!.indexOf(track))}
                          className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 cursor-pointer flex items-center gap-2 group transition"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={track.cover_url}
                            alt=""
                            className="w-7 h-7 rounded object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold truncate group-hover:text-accent-orange transition">
                              {track.title}
                            </p>
                            <p className="text-[8px] text-white/40 truncate">{track.artist}</p>
                          </div>
                          <Play className="w-2.5 h-2.5 text-white fill-white opacity-0 group-hover:opacity-100 transition" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[9px] text-white/30 px-1">{msg.time}</span>
            </div>
          );
        })}

        {/* Typing bubble */}
        {isTyping && (
          <div className="flex items-center gap-2 self-start bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5 text-xs text-white/50">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-ai-purple" />
            <span>AI DJ is tuning frequencies...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Composer Bar */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/5 bg-black/20 flex gap-2">
        <input
          type="text"
          placeholder={t.aiDjPromptPlaceholder}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 bg-white/5 border border-white/8 text-xs py-2 px-3 rounded-xl text-white outline-none focus:border-ai-purple/50 focus:ring-1 focus:ring-ai-purple/30 transition"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-gradient-to-r from-ai-purple to-accent-orange text-white hover:brightness-105 active:scale-95 transition-all shadow-md shrink-0 flex items-center justify-center"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </aside>
  );
}
