"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import PersistentPlayer from "@/components/PersistentPlayer";
import LyricsDrawer from "@/components/LyricsDrawer";
import AiDjPanel from "@/components/AiDjPanel";
import AudioEngine from "@/components/AudioEngine";
import LoginScreen from "@/components/auth/LoginScreen";
import OnboardingFlow from "@/components/auth/OnboardingFlow";
import type { OnboardingPreferences } from "@/components/auth/OnboardingFlow";
import { useStore } from "@/lib/store";
import { Compass, Globe, Radio, FolderHeart, User } from "lucide-react";

type AppView = "login" | "onboarding" | "app";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  // Track the transition animation
  const [transitioning, setTransitioning] = useState(false);

  const {
    activeLanguage,
    activeTab,
    setActiveTab,
    isAuthenticated,
    isOnboarded,
    login,
    completeOnboarding,
  } = useStore();

  const isRtl = activeLanguage === "ur";

  // Determine current view based on auth state
  const getView = (): AppView => {
    if (!isAuthenticated) return "login";
    if (!isOnboarded) return "onboarding";
    return "app";
  };

  const [view, setView] = useState<AppView>("login");

  // Sync view with store state + animate transitions
  useEffect(() => {
    const newView = getView();
    if (newView !== view) {
      setTransitioning(true);
      setTimeout(() => {
        setView(newView);
        setTransitioning(false);
      }, 350);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isOnboarded]);

  const handleLoginSuccess = (method: "google" | "phone" | "email" | "guest") => {
    login(method);
    // State update triggers the useEffect above
  };

  const handleOnboardingComplete = (prefs: OnboardingPreferences) => {
    completeOnboarding({
      name: prefs.name,
      languages: prefs.languages,
      genres: prefs.genres,
      eras: prefs.eras,
      artists: prefs.artists,
    });
  };

  const transitionStyle = {
    opacity: transitioning ? 0 : 1,
    transform: transitioning ? "scale(0.98)" : "scale(1)",
    transition: "opacity 0.35s ease, transform 0.35s ease",
  };

  return (
    <div style={transitionStyle} className="h-screen overflow-hidden">
      {view === "login" && (
        <LoginScreen onSuccess={handleLoginSuccess} />
      )}

      {view === "onboarding" && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}

      {view === "app" && (
        <div className="flex flex-col h-screen overflow-hidden bg-[#0a0a0f] text-white">
          {/* Client Audio Player Engine */}
          <AudioEngine />

          {/* Main Screen Shell */}
          <div className="flex flex-1 overflow-hidden relative">
            {/* Sidebar Left Component */}
            <Sidebar onSelectEra={setSelectedEra} selectedEra={selectedEra} />

            {/* Dashboard Center Column */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-gradient-to-b from-[#13131a]/40 to-[#0a0a0f]">
              <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
              <Dashboard
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedEra={selectedEra}
                onSelectEra={setSelectedEra}
              />
            </div>

            {/* Side Panel: Lyrics Karaoke (Drawer) */}
            <LyricsDrawer />

            {/* Side Panel: Conversational AI DJ Chat Assistant (Drawer) */}
            <AiDjPanel />
          </div>

          {/* Playback Console footer bar */}
          <PersistentPlayer />

          {/* Mobile Bottom Navigation Bar */}
          <div
            className={`md:hidden glass-panel border-t border-white/5 flex items-center justify-around py-2 shrink-0 z-30 ${
              isRtl ? "flex-row-reverse" : "flex-row"
            }`}
            dir={isRtl ? "rtl" : "ltr"}
          >
            {[
              { id: "Home", label: "Home", icon: Compass },
              { id: "Discover", label: "Discover", icon: Globe },
              { id: "Radio", label: "Radio", icon: Radio },
              { id: "Library", label: "Library", icon: FolderHeart },
              { id: "Profile", label: "Profile", icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`mobile-tab-${tab.id.toLowerCase()}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-2xl transition-all duration-200 active:scale-90 ${
                    isActive ? "text-[#FF6B35]" : "text-white/50 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[9px] font-bold mt-1 tracking-wider uppercase">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
