"use client";

import { useEffect, useState, useRef } from "react";
import { useStore, Track, NavigationTab, UiLanguage } from "@/lib/store";
import { UI_TRANSLATIONS } from "@/lib/translations";
import {
  detectLocation,
  fetchWeather,
  getContextRecommendations,
  searchTracks,
  getTrending,
  getCountryCharts,
  generateAiDjPlaylist,
} from "@/lib/api";
import {
  Play,
  Heart,
  Calendar,
  CloudSun,
  Droplets,
  Wind,
  Sunrise,
  Sunset,
  Sparkles,
  Search,
  Radio,
  Clock,
  Compass,
  User,
  CheckCircle,
  ShieldAlert,
  Volume2,
  FolderHeart,
  History as HistoryIcon,
  Download,
  Languages as LangIcon,
  ArrowRight,
  TrendingUp,
  Mic,
  Headphones,
  Flame,
  Music,
  Tv,
  Milestone,
} from "lucide-react";
import Logo from "./Logo";

interface DashboardProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedEra: string | null;
  onSelectEra: (eraId: string | null) => void;
}

// 12 Languages configuration for quick toggle
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

export default function Dashboard({
  searchQuery,
  onSearchChange,
  selectedEra,
  onSelectEra,
}: DashboardProps) {
  const {
    activeLanguage,
    activeTab,
    setActiveTab,
    playTrack,
    playPlaylist,
    activeTrack,
    isPlaying,
    togglePlay,
    likedSongs,
    toggleLikeSong,
    history,
    progress,
    duration,
    offlineMode,
    toggleOfflineMode,
    addChatMessage,
    toggleAiDj,
    weatherDetails,
    locationDetails,
    festivalName,
    setWeatherDetails,
    setLocationDetails,
    setFestivalName,
    currentMood,
    setMood,
    setActiveLanguage,
    themeMode,
    festivalTheme,
    setThemeMode,
    setFestivalTheme,
  } = useStore();

  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("Good Day");
  const [timeOfDay, setTimeOfDay] = useState<"Morning" | "Afternoon" | "Evening" | "Night">("Morning");
  const [localTimeStr, setLocalTimeStr] = useState("");
  const [localDateStr, setLocalDateStr] = useState("");

  // Search/Discover tab state
  const [searchResult, setSearchResult] = useState<Track[]>([]);
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [activeCountry, setActiveCountry] = useState("IN");
  const [countryTracks, setCountryTracks] = useState<Track[]>([]);

  // Discovery regional charts active tab
  const [activeRegTab, setActiveRegTab] = useState("Hindi");

  // Custom AI DJ state variables
  const [djLanguage, setDjLanguage] = useState("Gujarati");
  const [djMood, setDjMood] = useState("Peaceful");
  const [djActivity, setDjActivity] = useState("Relaxing");
  const [djDuration, setDjDuration] = useState("30 minute");
  const [djFestival, setDjFestival] = useState("None");
  const [djWeather, setDjWeather] = useState("Clear Sky");

  const t = UI_TRANSLATIONS[activeLanguage] || UI_TRANSLATIONS.en;
  const isRtl = activeLanguage === "ur";

  // Clock, Time, Date & Greeting Handler
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      // Date: Friday, June 5
      setLocalDateStr(
        now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
      );
      // Time: 08:30 AM
      setLocalTimeStr(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));

      const hour = now.getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting("Good Morning");
        setTimeOfDay("Morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good Afternoon");
        setTimeOfDay("Afternoon");
      } else if (hour >= 17 && hour < 21) {
        setGreeting("Good Evening");
        setTimeOfDay("Evening");
      } else {
        setGreeting("Good Night");
        setTimeOfDay("Night");
      }
    }
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  // Weather & Location initial fetch
  useEffect(() => {
    async function loadGeoData() {
      setLoading(true);
      try {
        const loc = await detectLocation();
        setLocationDetails(loc);

        const weather = await fetchWeather(loc.latitude, loc.longitude);
        setWeatherDetails(weather);
        setDjWeather(weather.condition);

        // Festival awareness schedule
        const now = new Date();
        const month = now.getMonth();
        const date = now.getDate();
        if (month === 5 && date === 5) {
          setFestivalName("Ganga Dussehra Celebration");
        } else if (month === 10) {
          setFestivalName("Diwali Festival Lights");
        } else if (month === 2) {
          setFestivalName("Holi Spring Curation");
        } else {
          setFestivalName("Traditional Curation Cycle");
        }
      } catch (e) {
        console.warn("Failed to retrieve location/weather details", e);
      } finally {
        setLoading(false);
      }
    }
    loadGeoData();
  }, [setLocationDetails, setWeatherDetails, setFestivalName]);

  // Load catalogs for search, trending and country
  useEffect(() => {
    async function fetchCatalog() {
      const trend = await getTrending();
      setTrendingTracks(trend);

      const country = await getCountryCharts("IN");
      setCountryTracks(country);
    }
    fetchCatalog();
  }, []);

  // Update search list
  useEffect(() => {
    async function loadSearch() {
      let query = searchQuery;
      if (selectedEra) query = query ? `${query} ${selectedEra}` : selectedEra;
      const res = await searchTracks(query);
      setSearchResult(res);
    }
    loadSearch();
  }, [searchQuery, selectedEra]);

  // Handle country chart tab changes
  const handleCountryChange = async (countryCode: string) => {
    setActiveCountry(countryCode);
    const countryData = await getCountryCharts(countryCode);
    setCountryTracks(countryData);
  };

  // Compile AI DJ custom playlist
  const handleGenerateCuration = () => {
    const { tracks: aiTracks, reasoning } = generateAiDjPlaylist(
      djMood,
      djLanguage,
      selectedEra || "All",
      djWeather,
      timeOfDay,
      djActivity,
      djDuration.replace(" minute", "")
    );

    addChatMessage({
      sender: "user",
      text: `Create a ${djDuration} ${djLanguage} ${timeOfDay.toLowerCase()} playlist for ${djActivity.toLowerCase()}.`,
    });

    setTimeout(() => {
      addChatMessage({
        sender: "dj",
        text: `Here is your customized session. ${reasoning}`,
        tracks: aiTracks,
        reasoning,
      });
      playPlaylist(aiTracks, 0);
      toggleAiDj(true);
    }, 600);
  };

  // Dynamic Context-aware recommendations
  const recommendedTracks = weatherDetails && locationDetails
    ? getContextRecommendations(timeOfDay, weatherDetails, locationDetails, djLanguage)
    : trendingTracks.slice(0, 4);

  // Regional language charts tracks filtering
  const regionalTracks = trendingTracks.filter(
    (t) => t.language.toLowerCase() === activeRegTab.toLowerCase()
  );

  // Dynamic Theme Definitions
  const THEMES = {
    Morning: {
      accent: "#F7C948", // Gold
      bgGlow: "rgba(247, 201, 72, 0.08)",
      glowClass: "shadow-[0_0_50px_rgba(247,201,72,0.12)]",
      gradient: "from-amber-500/10 via-yellow-600/5 to-transparent",
      highlightClass: "text-[#F7C948]",
      pillBg: "bg-amber-500/10 border-amber-500/20 text-[#F7C948]",
    },
    Afternoon: {
      accent: "#00C9A7", // Light Teal
      bgGlow: "rgba(0, 201, 167, 0.08)",
      glowClass: "shadow-[0_0_50px_rgba(0,201,167,0.12)]",
      gradient: "from-teal-500/10 via-emerald-600/5 to-transparent",
      highlightClass: "text-[#00C9A7]",
      pillBg: "bg-teal-500/10 border-teal-500/20 text-[#00C9A7]",
    },
    Evening: {
      accent: "#FF6B35", // Saffron
      bgGlow: "rgba(255, 107, 53, 0.08)",
      glowClass: "shadow-[0_0_50px_rgba(255,107,53,0.12)]",
      gradient: "from-orange-500/10 via-red-600/5 to-transparent",
      highlightClass: "text-[#FF6B35]",
      pillBg: "bg-orange-500/10 border-orange-500/20 text-[#FF6B35]",
    },
    Night: {
      accent: "#8B5CF6", // Deep Purple
      bgGlow: "rgba(139, 92, 246, 0.08)",
      glowClass: "shadow-[0_0_50px_rgba(139,92,246,0.12)]",
      gradient: "from-purple-500/10 via-indigo-900/5 to-transparent",
      highlightClass: "text-[#8B5CF6]",
      pillBg: "bg-purple-500/10 border-purple-500/20 text-[#8B5CF6]",
    },
  };

  const activeTheme = THEMES[timeOfDay] || THEMES.Morning;

  // Language list open toggle state for Languages quick action
  const [showLangDialog, setShowLangDialog] = useState(false);
  const [showLiveEventsDialog, setShowLiveEventsDialog] = useState(false);

  return (
    <main
      className={`flex-1 overflow-y-auto px-6 py-6 space-y-8 select-none pb-36 ${isRtl ? "text-right" : "text-left"
        }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Offline Alert */}
      {offlineMode && (
        <div className="flex items-center gap-3 px-4 py-3 bg-accent-orange/10 border border-accent-orange/20 rounded-2xl text-accent-orange text-xs font-semibold animate-pulse">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{t.offlineWarning}</span>
        </div>
      )}

      {/* RENDER VIEW DEPENDING ON ACTIVE BOTTOM NAV TAB */}

      {activeTab === "Home" && (
        <>
          {/* 1. GREETING HEADER */}
          <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h1 className="text-3xl font-extrabold font-display tracking-tight text-[#f0f0f0]">
                {greeting}, Shubham
              </h1>
              <p className="text-xs text-white/50 tracking-wide mt-1">
                {localDateStr} • {localTimeStr}
              </p>
            </div>
            {locationDetails && (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/8 text-xs font-semibold text-white/80 self-start sm:self-auto shadow-inner">
                <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                <span>
                  {locationDetails.city}, {locationDetails.state}
                </span>
              </div>
            )}
          </section>

          {/* 2. CONTINUE LISTENING */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display tracking-wider text-[#f0f0f0] flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent-orange" />
                <span>Continue Listening</span>
              </h3>
              <span className="text-[10px] uppercase font-mono tracking-widest text-white/30">
                Recent Sessions
              </span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {(history.length > 0 ? history : trendingTracks.slice(0, 4)).map((track, idx) => {
                const isActive = activeTrack?.id === track.id;
                // Generate a simulated listening progress percentage (e.g. 35% to 85%) based on track ID hash
                const simulatedProgress = Math.abs(track.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 50) + 35;
                return (
                  <div
                    key={`${track.id}-${idx}`}
                    onClick={() => playTrack(track)}
                    className="w-48 shrink-0 glass-card p-3 rounded-2xl cursor-pointer group relative overflow-hidden"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={track.cover_url}
                        alt={track.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                        <div className="w-10 h-10 rounded-full bg-[#FF6B35] text-white flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all shadow-lg">
                          <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                    <h4 className={`text-xs font-bold truncate ${isActive ? "text-accent-orange" : "text-white"}`}>
                      {track.title}
                    </h4>
                    <p className="text-[10px] text-white/50 truncate mt-0.5">{track.artist}</p>

                    {/* Visual Listening Progress Line */}
                    <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-orange to-gold rounded-full"
                        style={{ width: `${isActive ? (duration > 0 ? (progress / duration) * 100 : 0) : simulatedProgress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. AI DJ FOR YOU */}
          <section
            id="ai-generator"
            className="p-6 rounded-3xl bg-gradient-to-br from-[#13131a]/85 via-[#13131a]/60 to-transparent border border-white/8 shadow-2xl relative overflow-hidden group transition-all duration-500 glow-purple"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-ai-purple/15 blur-3xl group-hover:bg-ai-purple/20 transition-all duration-700" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
              {/* Left/Middle Columns: AI Status & Configuration */}
              <div className="space-y-4 lg:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-ai-purple animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest font-bold font-mono text-ai-purple">
                      AI DJ For You
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold font-display text-white mt-1">
                    Curation Vibe: {currentMood} Mood
                  </h3>

                  <p className="text-xs text-white/70 leading-relaxed mt-2.5 max-w-xl">
                    Inspired by the <span className="text-teal font-semibold">{timeOfDay.toLowerCase()}</span> in{" "}
                    <span className="text-teal font-semibold">{locationDetails?.city || "Vadodara"}</span> (
                    {weatherDetails?.condition || "Clear Sky"}, {weatherDetails?.temp || 29}°C) during{" "}
                    <span className="text-accent-orange font-semibold">{festivalName}</span>. Optimized for your personal listening habits.
                  </p>
                </div>

                {/* Dynamic UI Sentence */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs sm:text-sm font-semibold text-white/95 leading-relaxed text-center font-display tracking-wide max-w-xl">
                  &ldquo;Create a{" "}
                  <select
                    value={djDuration}
                    onChange={(e) => setDjDuration(e.target.value)}
                    className="bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-lg text-teal outline-none border border-transparent hover:border-teal/30 cursor-pointer font-bold mx-1 transition-all"
                  >
                    <option value="15 minute" className="bg-[#13131a] text-white">15 minute</option>
                    <option value="30 minute" className="bg-[#13131a] text-white">30 minute</option>
                    <option value="45 minute" className="bg-[#13131a] text-white">45 minute</option>
                    <option value="60 minute" className="bg-[#13131a] text-white">60 minute</option>
                  </select>{" "}
                  <select
                    value={djLanguage}
                    onChange={(e) => setDjLanguage(e.target.value)}
                    className="bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-lg text-accent-orange outline-none border border-transparent hover:border-accent-orange/30 cursor-pointer font-bold mx-1 transition-all"
                  >
                    <option value="Gujarati" className="bg-[#13131a] text-white">Gujarati</option>
                    <option value="Hindi" className="bg-[#13131a] text-white">Hindi</option>
                    <option value="Tamil" className="bg-[#13131a] text-white">Tamil</option>
                    <option value="Punjabi" className="bg-[#13131a] text-white">Punjabi</option>
                    <option value="Bengali" className="bg-[#13131a] text-white">Bengali</option>
                    <option value="Telugu" className="bg-[#13131a] text-white">Telugu</option>
                    <option value="Kannada" className="bg-[#13131a] text-white">Kannada</option>
                    <option value="Malayalam" className="bg-[#13131a] text-white">Malayalam</option>
                    <option value="English" className="bg-[#13131a] text-white">English</option>
                  </select>{" "}
                  playlist optimized for{" "}
                  <select
                    value={djActivity}
                    onChange={(e) => setDjActivity(e.target.value)}
                    className="bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-lg text-gold outline-none border border-transparent hover:border-gold/30 cursor-pointer font-bold mx-1 transition-all"
                  >
                    <option value="Relaxing" className="bg-[#13131a] text-white">Relaxing</option>
                    <option value="Workout" className="bg-[#13131a] text-white">Workout</option>
                    <option value="Commuting" className="bg-[#13131a] text-white">Commuting</option>
                    <option value="Focus" className="bg-[#13131a] text-white">Focus</option>
                    <option value="Sleep" className="bg-[#13131a] text-white">Sleep</option>
                  </select>
                  .&rdquo;
                </div>
              </div>

              {/* Right Column: Mood selection and compilation */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-col gap-1.5 text-xs">
                    <span className="text-white/40 font-medium">Select Mood</span>
                    <select
                      value={djMood}
                      onChange={(e) => {
                        setDjMood(e.target.value);
                        setMood(e.target.value);
                      }}
                      className="bg-[#13131a] border border-white/10 py-2 px-3 rounded-xl text-white outline-none cursor-pointer hover:bg-white/5 focus:border-ai-purple/50"
                    >
                      <option value="Peaceful">Peaceful 🧘</option>
                      <option value="Energetic">Energetic ⚡</option>
                      <option value="Romantic">Romantic 💖</option>
                      <option value="Melancholic">Soulful 🥀</option>
                      <option value="Devotional">Devotional 🪔</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs">
                    <span className="text-white/40 font-medium">Festival Override</span>
                    <select
                      value={djFestival}
                      onChange={(e) => setDjFestival(e.target.value)}
                      className="bg-[#13131a] border border-white/10 py-2 px-3 rounded-xl text-white outline-none cursor-pointer hover:bg-white/5 focus:border-ai-purple/50"
                    >
                      <option value="None">None</option>
                      <option value="Diwali">Diwali lights 🪔</option>
                      <option value="Holi">Holi colors 🎨</option>
                      <option value="Navratri">Navratri Garba 💃</option>
                      <option value="Christmas">Christmas 🎄</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerateCuration}
                  className="w-full bg-gradient-to-r from-ai-purple to-accent-orange hover:brightness-110 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all duration-300 active:scale-95"
                >
                  Generate Curation
                </button>
              </div>
            </div>
          </section>

          {/* 4. LANGUAGES GRID */}
          <section className="space-y-4">
            <div>
              <h3 className="text-lg font-bold font-display tracking-wider text-[#f0f0f0]">
                Explore Music Hubs
              </h3>
              <p className="text-xs text-white/40 mt-1">Rich visual entry points replacing traditional tabs</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Hindi Music",
                  desc: "Chants, Bollywood, Ghazals & Pop",
                  gradient: "from-orange-600/20 to-rose-950/10 hover:border-[#FF6B35]/40 hover:shadow-[0_0_20px_rgba(255,107,53,0.15)]",
                  icon: Music,
                  iconColor: "text-[#FF6B35]",
                  action: () => {
                    setActiveRegTab("Hindi");
                    setActiveTab("Discover");
                    onSearchChange("");
                  }
                },
                {
                  title: "Gujarati Music",
                  desc: "Heritage Garba, Folk & Lyrical Pop",
                  gradient: "from-amber-600/20 to-yellow-900/10 hover:border-[#F7C948]/40 hover:shadow-[0_0_20px_rgba(247,201,72,0.15)]",
                  icon: Flame,
                  iconColor: "text-[#F7C948]",
                  action: () => {
                    setActiveRegTab("Gujarati");
                    setActiveTab("Discover");
                    onSearchChange("");
                  }
                },
                {
                  title: "Tamil Music",
                  desc: "Classical Sangam & Modern Rhythms",
                  gradient: "from-teal-600/20 to-cyan-900/10 hover:border-[#00C9A7]/40 hover:shadow-[0_0_20px_rgba(0,201,167,0.15)]",
                  icon: Compass,
                  iconColor: "text-[#00C9A7]",
                  action: () => {
                    setActiveRegTab("Tamil");
                    setActiveTab("Discover");
                    onSearchChange("");
                  }
                },
                {
                  title: "Classical Heritage",
                  desc: "1000 CE - Present Hindustani & Carnatic Ragas",
                  gradient: "from-amber-800/20 to-orange-950/10 hover:border-amber-600/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]",
                  icon: Milestone,
                  iconColor: "text-amber-500",
                  action: () => {
                    document.getElementById("section-classical")?.scrollIntoView({ behavior: "smooth" });
                  }
                },
                {
                  title: "Folk Traditions",
                  desc: "Desert melodies, Assamese Bihu & regional archives",
                  gradient: "from-red-800/20 to-orange-900/10 hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]",
                  icon: FolderHeart,
                  iconColor: "text-red-400",
                  action: () => {
                    document.getElementById("section-folk")?.scrollIntoView({ behavior: "smooth" });
                  }
                },
                {
                  title: "AI DJ Curation",
                  desc: "Personalized LLM assistant & weather tracks",
                  gradient: "from-purple-800/20 to-indigo-950/10 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]",
                  icon: Sparkles,
                  iconColor: "text-purple-400",
                  action: () => {
                    toggleAiDj(true);
                  }
                },
                {
                  title: "Radio Stations",
                  desc: "Live simulated regional FM broadcasts",
                  gradient: "from-blue-800/20 to-indigo-900/10 hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]",
                  icon: Radio,
                  iconColor: "text-blue-400",
                  action: () => {
                    setActiveTab("Radio");
                  }
                },
                {
                  title: "Podcasts Hub",
                  desc: "Swar Shastra & music evolution lectures",
                  gradient: "from-indigo-800/20 to-violet-950/10 hover:border-indigo-500/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]",
                  icon: Headphones,
                  iconColor: "text-indigo-400",
                  action: () => {
                    document.getElementById("section-podcasts")?.scrollIntoView({ behavior: "smooth" });
                  }
                },
                {
                  title: "Live Events",
                  desc: "Upcoming virtual concerts & Indian music festivals",
                  gradient: "from-pink-800/20 to-rose-950/10 hover:border-pink-500/40 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]",
                  icon: Tv,
                  iconColor: "text-pink-400",
                  action: () => {
                    setShowLiveEventsDialog(true);
                  }
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={item.action}
                    className={`p-5 rounded-3xl bg-gradient-to-br ${item.gradient} border border-white/5 transition-all duration-300 text-left flex flex-col justify-between h-36 relative overflow-hidden group glass-card`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className={`p-3 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 ${item.iconColor} group-hover:scale-110 transition duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition duration-300 translate-x-1 text-white/70" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide group-hover:text-accent-orange transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-white/50 leading-normal line-clamp-2 mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 5. TRENDING TODAY */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display tracking-wider text-[#f0f0f0] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal" />
                <span>Trending Today</span>
              </h3>
              <span className="text-[10px] uppercase font-mono tracking-widest text-white/30">
                National Top Charts
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingTracks.slice(0, 4).map((track, index) => {
                const isActive = activeTrack?.id === track.id;
                const isLiked = likedSongs.includes(track.id);
                // Simulated stream counts
                const streams = ["4.8M", "3.9M", "3.2M", "2.5M"][index] || "1.2M";
                return (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer group hover:bg-white/5 ${isActive ? "bg-white/5 border-[#FF6B35]/30 shadow-[0_0_15px_rgba(255,107,53,0.1)]" : "bg-[#13131a]/60 border-white/5"
                      }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="text-sm font-black font-mono text-white/20 w-5 text-center group-hover:text-accent-orange transition-colors">
                        {index + 1}
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={track.cover_url}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover bg-white/5 shadow"
                      />
                      <div className="min-w-0">
                        <h4 className={`text-xs font-bold truncate transition group-hover:text-accent-orange ${isActive ? "text-accent-orange" : "text-white"}`}>
                          {track.title}
                        </h4>
                        <p className="text-[10px] text-white/50 truncate mt-0.5">
                          {track.artist}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[9px] px-1.5 py-0.25 rounded bg-white/5 text-white/40 uppercase font-mono">
                            {streams} plays
                          </span>
                          <span className="text-[9px] px-1.5 py-0.25 rounded bg-teal/10 text-teal font-medium">
                            {track.language}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLikeSong(track.id);
                        }}
                        className="p-2 text-white/40 hover:text-accent-orange transition"
                      >
                        <Heart className={`w-4.5 h-4.5 ${isLiked ? "text-[#FF6B35] fill-[#FF6B35]" : ""}`} />
                      </button>
                      <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#FF6B35] flex items-center justify-center transition">
                        <Play className="w-3.5 h-3.5 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 6. REGIONAL GEMS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display tracking-wider text-[#f0f0f0] flex items-center gap-2">
                <Compass className="w-5 h-5 text-gold" />
                <span>Regional Gems ({djLanguage})</span>
              </h3>
              <span className="text-[10px] uppercase font-mono tracking-widest text-white/30">
                Curated For You
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingTracks
                .filter((t) => t.language.toLowerCase() === djLanguage.toLowerCase())
                .slice(0, 4)
                .map((track) => {
                  const isActive = activeTrack?.id === track.id;
                  const isLiked = likedSongs.includes(track.id);
                  return (
                    <div
                      key={track.id}
                      onClick={() => playTrack(track)}
                      className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer group hover:bg-white/5 ${isActive ? "bg-white/5 border-[#FF6B35]/30 shadow-[0_0_15px_rgba(255,107,53,0.1)]" : "bg-[#13131a]/60 border-white/5"
                        }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={track.cover_url}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover bg-white/5 shadow"
                        />
                        <div className="min-w-0">
                          <h4 className={`text-xs font-bold truncate transition group-hover:text-accent-orange ${isActive ? "text-accent-orange" : "text-white"}`}>
                            {track.title}
                          </h4>
                          <p className="text-[10px] text-white/50 truncate mt-0.5">
                            {track.artist}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[9px] px-1.5 py-0.25 rounded bg-[#00C9A7]/10 text-[#00C9A7] font-semibold">
                              {track.genre}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLikeSong(track.id);
                          }}
                          className="p-2 text-white/40 hover:text-accent-orange transition"
                        >
                          <Heart className={`w-4.5 h-4.5 ${isLiked ? "text-[#FF6B35] fill-[#FF6B35]" : ""}`} />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#FF6B35] flex items-center justify-center transition">
                          <Play className="w-3.5 h-3.5 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              {trendingTracks.filter((t) => t.language.toLowerCase() === djLanguage.toLowerCase()).length === 0 && (
                <div className="col-span-full py-8 text-center bg-white/5 border border-white/5 rounded-3xl text-xs text-white/40">
                  Select another language in the AI DJ panel to unlock regional curations.
                </div>
              )}
            </div>
          </section>

          {/* 7. CLASSICAL HERITAGE */}
          <section id="section-classical" className="space-y-4 scroll-mt-24">
            <div>
              <h3 className="text-lg font-bold font-display tracking-wider text-[#f0f0f0] flex items-center gap-2">
                <Milestone className="w-5 h-5 text-amber-500" />
                <span>Classical Heritage</span>
              </h3>
              <p className="text-xs text-white/40 mt-1">Preserving Hindustani & Carnatic traditions since 1000 CE</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingTracks
                .filter((t) => t.id.startsWith("class-"))
                .map((track) => {
                  const isActive = activeTrack?.id === track.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => playTrack(track)}
                      className={`p-4 rounded-3xl border transition-all duration-300 cursor-pointer group hover:bg-white/5 flex flex-col justify-between gap-4 ${isActive ? "bg-white/5 border-amber-500/30" : "bg-[#13131a]/60 border-white/5"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={track.cover_url}
                            alt=""
                            className="w-14 h-14 rounded-2xl object-cover bg-white/5 shadow"
                          />
                          <div className="min-w-0">
                            <h4 className={`text-sm font-bold truncate transition group-hover:text-accent-orange ${isActive ? "text-accent-orange" : "text-white"}`}>
                              {track.title}
                            </h4>
                            <p className="text-xs text-white/50 truncate mt-0.5">
                              {track.artist}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold tracking-wider uppercase">
                                {track.era} Era
                              </span>
                              <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-white/40">
                                {track.genre}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-white/5 group-hover:bg-amber-500 flex items-center justify-center transition shrink-0 shadow">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>

                      {/* Raga Details Box */}
                      {track.raga_info && (
                        <div className="p-3 rounded-2xl bg-black/30 border border-white/5 text-[10px] text-white/70 leading-relaxed font-sans">
                          <span className="font-bold text-amber-500 block mb-0.5">Rāga Analysis:</span>
                          {track.raga_info}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>

          {/* 8. FOLK ARCHIVES */}
          <section id="section-folk" className="space-y-4 scroll-mt-24">
            <div>
              <h3 className="text-lg font-bold font-display tracking-wider text-[#f0f0f0] flex items-center gap-2">
                <FolderHeart className="w-5 h-5 text-red-500" />
                <span>Folk Archives</span>
              </h3>
              <p className="text-xs text-white/40 mt-1">Traditional folk recordings from the deserts of Rajasthan to the rivers of Assam</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingTracks
                .filter((t) => t.id.startsWith("folk-"))
                .map((track) => {
                  const isActive = activeTrack?.id === track.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => playTrack(track)}
                      className={`p-4 rounded-3xl border transition-all duration-300 cursor-pointer group hover:bg-white/5 flex flex-col justify-between gap-4 ${isActive ? "bg-white/5 border-red-500/30" : "bg-[#13131a]/60 border-white/5"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={track.cover_url}
                            alt=""
                            className="w-14 h-14 rounded-2xl object-cover bg-white/5 shadow"
                          />
                          <div className="min-w-0">
                            <h4 className={`text-sm font-bold truncate transition group-hover:text-accent-orange ${isActive ? "text-accent-orange" : "text-white"}`}>
                              {track.title}
                            </h4>
                            <p className="text-xs text-white/50 truncate mt-0.5">
                              {track.artist}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="text-[9px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold tracking-wider uppercase">
                                {track.language}
                              </span>
                              <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-white/40">
                                {track.genre}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-white/5 group-hover:bg-red-500 flex items-center justify-center transition shrink-0 shadow">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>

                      {/* Archive Context */}
                      {track.raga_info && (
                        <div className="p-3 rounded-2xl bg-black/30 border border-white/5 text-[10px] text-white/70 leading-relaxed">
                          <span className="font-bold text-red-400 block mb-0.5">Archival Context:</span>
                          {track.raga_info}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>

          {/* 9. PODCASTS */}
          <section id="section-podcasts" className="space-y-4 scroll-mt-24">
            <div>
              <h3 className="text-lg font-bold font-display tracking-wider text-[#f0f0f0] flex items-center gap-2">
                <Mic className="w-5 h-5 text-indigo-400" />
                <span>Cultural Podcasts & Swar lectures</span>
              </h3>
              <p className="text-xs text-white/40 mt-1">Spoken-word lectures and historical audio documents</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingTracks
                .filter((t) => t.id.startsWith("pod-"))
                .map((track) => {
                  const isActive = activeTrack?.id === track.id;
                  const durationMin = Math.round(track.duration / 60);
                  return (
                    <div
                      key={track.id}
                      onClick={() => playTrack(track)}
                      className={`p-4 rounded-3xl border transition-all duration-300 cursor-pointer group hover:bg-white/5 flex items-center justify-between gap-4 ${isActive ? "bg-white/5 border-indigo-500/30" : "bg-[#13131a]/60 border-white/5"
                        }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={track.cover_url}
                          alt=""
                          className="w-14 h-14 rounded-2xl object-cover bg-white/5 shadow"
                        />
                        <div className="min-w-0">
                          <h4 className={`text-sm font-bold truncate transition group-hover:text-accent-orange ${isActive ? "text-accent-orange" : "text-white"}`}>
                            {track.title}
                          </h4>
                          <p className="text-xs text-white/50 truncate mt-0.5">
                            {track.artist}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold uppercase">
                              {durationMin} Min Episode
                            </span>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-white/40">
                              {track.genre}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-white/5 group-hover:bg-indigo-500 flex items-center justify-center transition shrink-0 shadow">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* 10. QUICK ACTIONS */}
          <section className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-lg font-bold font-display tracking-wider text-[#f0f0f0]">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  id: "Search",
                  label: "Search Database",
                  icon: Search,
                  color: "hover:border-teal/30 hover:bg-teal/5 text-teal",
                  action: () => setActiveTab("Discover"),
                },
                {
                  id: "Radio",
                  label: "Language Radios",
                  icon: Radio,
                  color: "hover:border-gold/30 hover:bg-gold/5 text-gold",
                  action: () => setActiveTab("Radio"),
                },
                {
                  id: "Languages",
                  label: "Choose Language",
                  icon: LangIcon,
                  color: "hover:border-accent-orange/30 hover:bg-accent-orange/5 text-accent-orange",
                  action: () => setShowLangDialog(true),
                },
                {
                  id: "Trending",
                  label: "Trending Charts",
                  icon: TrendingUp,
                  color: "hover:border-purple-500/30 hover:bg-purple-500/5 text-purple-400",
                  action: () => {
                    setActiveTab("Discover");
                    onSearchChange("");
                  },
                },
                {
                  id: "Playlists",
                  label: "AI Playlist Creator",
                  icon: Sparkles,
                  color: "hover:border-pink-500/30 hover:bg-pink-500/5 text-pink-400",
                  action: () => {
                    const el = document.getElementById("ai-generator");
                    el?.scrollIntoView({ behavior: "smooth" });
                  },
                },
                {
                  id: "Downloads",
                  label: "Offline Settings",
                  icon: Download,
                  color: "hover:border-blue-500/30 hover:bg-blue-500/5 text-blue-400",
                  action: () => toggleOfflineMode(),
                },
                {
                  id: "Favorites",
                  label: "Library Favorites",
                  icon: FolderHeart,
                  color: "hover:border-rose-500/30 hover:bg-rose-500/5 text-rose-400",
                  action: () => setActiveTab("Library"),
                },
                {
                  id: "History",
                  label: "Play History",
                  icon: HistoryIcon,
                  color: "hover:border-indigo-500/30 hover:bg-indigo-500/5 text-indigo-400",
                  action: () => {
                    addChatMessage({
                      sender: "dj",
                      text: "Loading play history tracks in your AI compiler...",
                    });
                    toggleAiDj(true);
                  },
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={`p-4 rounded-3xl bg-[#13131a] border border-white/5 transition-all duration-300 flex flex-col justify-between items-start gap-4 cursor-pointer text-left group ${item.color} glass-card`}
                  >
                    <div className="w-9 h-9 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-105 transition duration-300 shadow">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold text-white/80 group-hover:text-white">
                        {item.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition duration-300 translate-x-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </>
      )}

      {activeTab === "Discover" && (
        <>
          {/* SEARCH & DISCOVER PAGE */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold font-display tracking-tight text-[#f0f0f0]">
              Discover
            </h2>

            {/* Custom search input inside Discover view */}
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Search songs, artists, genres..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full py-3.5 pl-12 pr-4 rounded-2xl bg-[#13131a] border border-white/8 text-sm outline-none text-white/90 focus:border-teal/50 focus:ring-1 focus:ring-teal/20 transition-all shadow-md"
              />
              <Search className="w-5 h-5 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {searchQuery ? (
              /* Search results */
              <div className="space-y-4 pt-2">
                <h3 className="text-base font-bold text-white/50">Search Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResult.map((track) => (
                    <div
                      key={track.id}
                      onClick={() => playTrack(track)}
                      className="p-3 rounded-2xl bg-[#13131a]/60 border border-white/5 hover:border-white/10 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={track.cover_url}
                          alt=""
                          className="w-11 h-11 rounded-lg object-cover bg-white/5"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate group-hover:text-accent-orange transition">
                            {track.title}
                          </h4>
                          <p className="text-[10px] text-white/40 truncate mt-0.5">{track.artist}</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/40">
                        {track.language}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Discovery views */
              <div className="space-y-8">
                {/* Regional Charts Segmented Tabs */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold font-display tracking-wider text-[#f0f0f0] flex items-center gap-2">
                    <Compass className="w-5 h-5 text-gold" />
                    <span>Regional Charts</span>
                  </h3>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {[
                      "Hindi",
                      "Gujarati",
                      "Tamil",
                      "Punjabi",
                      "Bengali",
                      "Telugu",
                      "Kannada",
                      "Malayalam",
                      "English",
                    ].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveRegTab(tab)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-all duration-300 ${activeRegTab === tab
                            ? "bg-accent-orange/15 text-accent-orange border-accent-orange/30 shadow-[0_0_12px_rgba(255,107,53,0.15)]"
                            : "bg-white/5 text-white/60 border-white/5 hover:bg-white/8 hover:text-white"
                          }`}
                      >
                        {tab === "English" ? "International" : tab}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {regionalTracks.map((track) => (
                      <div
                        key={track.id}
                        onClick={() => playTrack(track)}
                        className="p-3.5 rounded-2xl bg-[#13131a]/60 border border-white/5 hover:border-white/10 flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={track.cover_url}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover bg-white/5"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate group-hover:text-accent-orange transition">
                              {track.title}
                            </h4>
                            <p className="text-[10px] text-white/50 truncate mt-0.5">
                              {track.artist}
                            </p>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-accent-orange flex items-center justify-center transition scale-90 group-hover:scale-100">
                          <Play className="w-3.5 h-3.5 text-white fill-white group-hover:text-white" />
                        </div>
                      </div>
                    ))}

                    {regionalTracks.length === 0 && (
                      <p className="col-span-full text-center py-6 text-xs text-white/30">
                        No songs compiled for this region chart yet. Choose custom weather playlist or search to add streams.
                      </p>
                    )}
                  </div>
                </div>

                {/* Country Top Charts Selection */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5 pt-6">
                    <h3 className="text-lg font-bold font-display tracking-wider text-[#f0f0f0]">
                      International Charts
                    </h3>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {[
                        { code: "IN", name: "🇮🇳 India" },
                        { code: "US", name: "🇺🇸 US Billboard" },
                        { code: "KR", name: "🇰🇷 Korea" },
                        { code: "GB", name: "🇬🇧 UK Charts" },
                        { code: "JP", name: "🇯🇵 Japan" },
                      ].map((country) => (
                        <button
                          key={country.code}
                          onClick={() => handleCountryChange(country.code)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all duration-200 ${activeCountry === country.code
                              ? "bg-teal/15 text-teal border-teal/30"
                              : "bg-white/5 text-white/60 border-white/5 hover:bg-white/8 hover:text-white"
                            }`}
                        >
                          {country.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {countryTracks.map((track) => (
                      <div
                        key={track.id}
                        className="p-3 rounded-2xl bg-surface/35 border border-white/5 hover:border-white/10 transition-all flex items-center gap-3 cursor-pointer group"
                        onClick={() => playTrack(track)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={track.cover_url}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover bg-white/5"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate group-hover:text-accent-orange transition">
                            {track.title}
                          </h4>
                          <p className="text-[10px] text-white/50 truncate mt-0.5">{track.artist}</p>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <Play className="w-3 h-3 text-white fill-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {activeTab === "Radio" && (
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-display tracking-tight text-[#f0f0f0]">Radio</h2>
          <p className="text-sm text-white/40">Broadcasting simulated regional language streams 24/7.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "Ganga Waves FM", lang: "Hindi", freq: "98.3 MHz", color: "from-accent-orange to-gold" },
              { name: "Kaveri Breeze FM", lang: "Tamil", freq: "91.1 MHz", color: "from-teal to-blue-500" },
              { name: "Rabindra Melody AM", lang: "Bengali", freq: "840 kHz", color: "from-red-500 to-accent-orange" },
              { name: "Dhol Beats FM", lang: "Punjabi", freq: "104.8 MHz", color: "from-yellow-400 to-purple-600" },
            ].map((station, idx) => (
              <div
                key={idx}
                onClick={() => {
                  const filtered = trendingTracks.filter(
                    (t) => t.language.toLowerCase() === station.lang.toLowerCase()
                  );
                  playPlaylist(filtered.length > 0 ? filtered : trendingTracks, 0);
                }}
                className={`p-6 rounded-3xl bg-gradient-to-br ${station.color} bg-opacity-10 border border-white/5 hover:border-white/10 cursor-pointer transition duration-300 group flex items-center justify-between`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center group-hover:scale-105 transition duration-300">
                    <Radio className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{station.name}</h3>
                    <p className="text-xs text-white/50 mt-1">
                      {station.lang} • {station.freq}
                    </p>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-white flex items-center justify-center transition">
                  <Play className="w-4 h-4 text-white group-hover:text-black fill-current" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "Library" && (
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-display tracking-tight text-[#f0f0f0]">Library</h2>

          {/* Liked Songs list */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">Liked Songs</h3>
            <div className="grid grid-cols-1 gap-2.5">
              {trendingTracks
                .filter((t) => likedSongs.includes(t.id))
                .map((track) => (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className="p-3 rounded-2xl bg-[#13131a]/40 border border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition"
                  >
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={track.cover_url}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{track.title}</h4>
                        <p className="text-[10px] text-white/40 mt-0.5">{track.artist}</p>
                      </div>
                    </div>
                    <Heart className="w-4 h-4 text-accent-orange fill-accent-orange" />
                  </div>
                ))}

              {likedSongs.length === 0 && (
                <p className="text-xs text-white/30 text-center py-8">
                  Your library is empty. Click the heart icon on any song to save it here!
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {activeTab === "Profile" && (
        <section className="space-y-6">
          <h2 className="text-3xl font-bold font-display tracking-tight text-[#f0f0f0]">Profile</h2>

          <div className="p-6 rounded-3xl bg-[#13131a] border border-white/5 space-y-6">
            {/* User Meta */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-accent-orange to-gold flex items-center justify-center p-[1px]">
                <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
                  <User className="w-6 h-6 text-white/80" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Shubham</h3>
                <p className="text-xs text-teal">BharatSwar Premium Subscriber</p>
              </div>
            </div>

            {/* Offline Mode switch */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Offline Curation Mode</h4>
                <p className="text-[10px] text-white/40 mt-0.5">Plays cached tracks without connections.</p>
              </div>
              <button
                onClick={toggleOfflineMode}
                className={`px-4 py-2 rounded-2xl text-xs font-bold border transition ${offlineMode
                    ? "bg-accent-orange/15 text-accent-orange border-accent-orange/30 shadow-glow animate-pulse"
                    : "bg-white/5 text-white/70 border-white/5 hover:bg-white/8"
                  }`}
              >
                {offlineMode ? "Active" : "Inactive"}
              </button>
            </div>

            {/* Theme Mode Toggles */}
            <div className="pt-6 border-t border-white/5 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-white">Theme Preferences</h4>
                <p className="text-[10px] text-white/40 mt-0.5">Choose your base layout color system.</p>
              </div>
              <div className="flex gap-2.5">
                {[
                  { id: "dark", label: "Dark Mode 🌙" },
                  { id: "light", label: "Light Mode ☀️" },
                  { id: "auto", label: "System Auto ⚙️" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setThemeMode(mode.id as any)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                      themeMode === mode.id
                        ? "bg-accent-orange/10 text-accent-orange border-accent-orange/30 shadow-inner"
                        : "bg-white/5 text-white/60 border-white/5 hover:bg-white/8"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Festival Override Selector */}
            <div className="pt-6 border-t border-white/5 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-white">Dynamic Festival Overrides</h4>
                <p className="text-[10px] text-white/40 mt-0.5">Transform the app styling with festival colors.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: "None", label: "None ✕" },
                  { id: "Diwali", label: "Diwali 🪔" },
                  { id: "Holi", label: "Holi 🎨" },
                  { id: "Navratri", label: "Navratri 💃" },
                  { id: "Ganga", label: "Dussehra 🌊" },
                ].map((fest) => (
                  <button
                    key={fest.id}
                    onClick={() => {
                      setFestivalTheme(fest.id as any);
                      // Update active festival name display globally
                      if (fest.id === "None") setFestivalName("Traditional Curation Cycle");
                      else if (fest.id === "Diwali") setFestivalName("Diwali Festival Lights");
                      else if (fest.id === "Holi") setFestivalName("Holi Spring Curation");
                      else if (fest.id === "Navratri") setFestivalName("Navratri Garba Celebration");
                      else if (fest.id === "Ganga") setFestivalName("Ganga Dussehra Celebration");
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition ${
                      festivalTheme === fest.id
                        ? "bg-teal/10 text-teal border-teal/30 shadow-inner"
                        : "bg-white/5 text-white/60 border-white/5 hover:bg-white/8"
                    }`}
                  >
                    {fest.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Mood Indicator & Trigger */}
            <div className="pt-6 border-t border-white/5 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-white">Active AI Mood Accent</h4>
                <p className="text-[10px] text-white/40 mt-0.5">Current mood accent matching active curations.</p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {[
                  { id: "Peaceful", label: "Peaceful 🧘" },
                  { id: "Energetic", label: "Energetic ⚡" },
                  { id: "Romantic", label: "Romantic 💖" },
                  { id: "Soulful", label: "Soulful 🥀" },
                  { id: "Devotional", label: "Devotional 🪔" },
                ].map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setMood(mood.id)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition ${
                      currentMood === mood.id
                        ? "bg-gold/10 text-gold border-gold/30 shadow-inner"
                        : "bg-white/5 text-white/60 border-white/5 hover:bg-white/8"
                    }`}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* QUICK TOGGLE DIALOG BOX FOR LANGUAGES (RAILONE ACCESSIBILITY PRINCIPLE) */}
      {showLangDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#13131a] border border-white/10 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <LangIcon className="w-5 h-5 text-accent-orange" />
                <span>Select Language (12 Indian Languages UI)</span>
              </h3>
              <button
                onClick={() => setShowLangDialog(false)}
                className="p-1 rounded bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {LANGUAGES_LIST.map((lang) => {
                const isSelected = activeLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setActiveLanguage(lang.code);
                      setShowLangDialog(false);
                    }}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${isSelected
                        ? "bg-accent-orange/15 text-accent-orange border-accent-orange/30 shadow-[0_0_12px_rgba(255,107,53,0.15)]"
                        : "bg-white/5 text-white/60 border-white/5 hover:bg-white/8 hover:text-white"
                      }`}
                  >
                    <span className="text-sm">{lang.native}</span>
                    <span className="text-[10px] text-white/40 font-normal">{lang.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LIVE EVENTS INTERACTIVE DIALOG */}
      {showLiveEventsDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#13131a] border border-white/10 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Tv className="w-5 h-5 text-pink-500" />
                <span>Live Events & Festivals Broadcast</span>
              </h3>
              <button
                onClick={() => setShowLiveEventsDialog(false)}
                className="p-1.5 rounded bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: "Swar Utsav 2026 - Classical Legends Stream",
                  date: "June 12 - June 14, 2026",
                  desc: "Featuring virtual concerts by legendary sitarists, vocalists, and fusion bands celebrating 1000 CE classic forms.",
                  status: "Registering",
                  badgeColor: "bg-teal/10 text-teal border-teal/20"
                },
                {
                  name: "Rajasthan Sufi Festival Live",
                  date: "July 08, 2026",
                  desc: "Live field recordings under the open desert sky. Visual audio stream from Jodhpur dunes.",
                  status: "Upcoming",
                  badgeColor: "bg-gold/10 text-gold border-gold/20"
                },
                {
                  name: "National Navratri Garba Broadcast",
                  date: "Oct 11 - Oct 19, 2026",
                  desc: "24/7 high-fidelity Garba dhol feeds broadcasted directly from Vadodara's main grounds.",
                  status: "Scheduled",
                  badgeColor: "bg-accent-orange/10 text-accent-orange border-accent-orange/20"
                }
              ].map((evt, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{evt.name}</h4>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border ${evt.badgeColor} font-semibold`}>
                      {evt.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/40">{evt.date}</p>
                  <p className="text-[10px] text-white/70 leading-relaxed">{evt.desc}</p>
                  <button
                    onClick={() => {
                      alert(`Successfully registered for ${evt.name}! We'll alert you via push notification before the stream starts.`);
                      setShowLiveEventsDialog(false);
                    }}
                    className="text-[10px] font-bold text-[#FF6B35] hover:underline pt-1 block"
                  >
                    Get Broadcast Pass →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
