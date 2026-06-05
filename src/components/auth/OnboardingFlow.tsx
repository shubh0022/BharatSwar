"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, Check, Music, Mic2, Globe, Sparkles, Volume2 } from "lucide-react";

interface OnboardingFlowProps {
  onComplete: (prefs: OnboardingPreferences) => void;
}

export interface OnboardingPreferences {
  name: string;
  languages: string[];
  genres: string[];
  eras: string[];
  artists: string[];
}

type Step = "welcome" | "name" | "languages" | "genres" | "eras" | "artists" | "ready";

const LANGUAGES = [
  { code: "hi", name: "Hindi", native: "हिंदी", flag: "🇮🇳", color: "#FF6B35" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳", color: "#00C9A7" },
  { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳", color: "#F7C948" },
  { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇮🇳", color: "#9333EA" },
  { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳", color: "#EF4444" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳", color: "#06B6D4" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", flag: "🇮🇳", color: "#84CC16" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳", color: "#F59E0B" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳", color: "#EC4899" },
  { code: "ur", name: "Urdu", native: "اردو", flag: "🇮🇳", color: "#8B5CF6" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ", flag: "🇮🇳", color: "#10B981" },
  { code: "en", name: "English", native: "English", flag: "🌐", color: "#64748B" },
];

const GENRES = [
  { id: "classical", name: "Classical", icon: "🎵", desc: "Hindustani & Carnatic" },
  { id: "folk", name: "Folk", icon: "🪘", desc: "Regional traditions" },
  { id: "bollywood", name: "Bollywood", icon: "🎬", desc: "Hindi cinema hits" },
  { id: "ghazal", name: "Ghazal", icon: "🌹", desc: "Poetic Sufi tradition" },
  { id: "devotional", name: "Devotional", icon: "🕉️", desc: "Bhajans & Kirtans" },
  { id: "indie", name: "Indie", icon: "🎸", desc: "Independent artists" },
  { id: "fusion", name: "Fusion", icon: "✨", desc: "East meets West" },
  { id: "instrumental", name: "Instrumental", icon: "🪈", desc: "Pure music, no words" },
  { id: "sufi", name: "Sufi", icon: "🌀", desc: "Mystical devotion" },
  { id: "pop", name: "Pop", icon: "🎤", desc: "Modern hits" },
];

const ERAS = [
  { id: "ancient", name: "Ancient", range: "1000–1700 CE", icon: "🏺", desc: "Vedic & classical origins" },
  { id: "medieval", name: "Medieval", range: "1700–1900", icon: "🕌", desc: "Mughal court music" },
  { id: "golden", name: "Golden Era", range: "1940s–70s", icon: "🌅", desc: "Lata, Rafi, Kishore" },
  { id: "retro", name: "Retro", range: "1980s–90s", icon: "📻", desc: "Cassette era classics" },
  { id: "modern", name: "Modern", range: "2000–2015", icon: "💿", desc: "Digital revolution" },
  { id: "now", name: "Now", range: "2016–Today", icon: "🔥", desc: "Streaming era hits" },
];

const FEATURED_ARTISTS = [
  { id: "ar-rahman", name: "A.R. Rahman", genre: "Fusion", img: "🎼" },
  { id: "lata-ji", name: "Lata Mangeshkar", genre: "Classical", img: "🌸" },
  { id: "kishore-da", name: "Kishore Kumar", genre: "Golden Era", img: "🎤" },
  { id: "pandit-ravi", name: "Ravi Shankar", genre: "Sitar", img: "🪕" },
  { id: "zakir-hussain", name: "Zakir Hussain", genre: "Tabla", img: "🥁" },
  { id: "arijit", name: "Arijit Singh", genre: "Bollywood", img: "💫" },
  { id: "asha", name: "Asha Bhosle", genre: "Playback", img: "🌺" },
  { id: "ms-subbalakshmi", name: "M.S. Subbulakshmi", genre: "Carnatic", img: "🎵" },
  { id: "shankar-mahadevan", name: "Shankar Mahadevan", genre: "Fusion", img: "🎶" },
  { id: "shreya", name: "Shreya Ghoshal", genre: "Playback", img: "⭐" },
  { id: "abida-parveen", name: "Abida Parveen", genre: "Sufi", img: "🌙" },
  { id: "gulzar", name: "Gulzar", genre: "Poetry", img: "✍️" },
];

const STEPS: Step[] = ["welcome", "name", "languages", "genres", "eras", "artists", "ready"];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>("welcome");
  const [prefs, setPrefs] = useState<OnboardingPreferences>({
    name: "",
    languages: [],
    genres: [],
    eras: [],
    artists: [],
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const stepIndex = STEPS.indexOf(step);
  const progress = (stepIndex / (STEPS.length - 1)) * 100;

  const goNext = () => {
    const nextStep = STEPS[stepIndex + 1];
    if (nextStep) setStep(nextStep);
  };

  const goBack = () => {
    const prevStep = STEPS[stepIndex - 1];
    if (prevStep) setStep(prevStep);
  };

  const toggleItem = (key: keyof OnboardingPreferences, id: string) => {
    if (key === "name") return;
    const arr = prefs[key] as string[];
    const updated = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
    setPrefs({ ...prefs, [key]: updated });
  };

  const canNext = () => {
    if (step === "name") return prefs.name.trim().length >= 2;
    if (step === "languages") return prefs.languages.length >= 1;
    if (step === "genres") return prefs.genres.length >= 1;
    if (step === "eras") return prefs.eras.length >= 1;
    return true;
  };

  return (
    <div className="fixed inset-0 bg-[#05050A] flex flex-col overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-[#FF6B35]/5 blur-[100px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#00C9A7]/4 blur-[120px]" />
      </div>

      {/* Progress Bar */}
      {step !== "welcome" && step !== "ready" && (
        <div className="relative z-20 px-6 pt-6 pb-2">
          <div className="flex items-center gap-4">
            {stepIndex > 1 && (
              <button
                onClick={goBack}
                className="text-white/40 hover:text-white/70 transition-colors shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex-1">
              <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF6B35] via-[#F7C948] to-[#00C9A7] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-white/25 mt-1.5">{stepIndex - 1} of {STEPS.length - 3} steps</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className="flex-1 flex flex-col items-center overflow-y-auto px-4 pb-24"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        {step === "welcome" && <WelcomeStep onNext={goNext} />}
        {step === "name" && <NameStep name={prefs.name} onChange={(n) => setPrefs({ ...prefs, name: n })} onNext={goNext} />}
        {step === "languages" && (
          <PickStep
            title="Choose your languages"
            subtitle="Pick the languages you love listening in"
            emoji="🌏"
            items={LANGUAGES.map((l) => ({ id: l.code, label: l.name, sub: l.native, color: l.color, icon: l.flag }))}
            selected={prefs.languages}
            onToggle={(id) => toggleItem("languages", id)}
            min={1}
          />
        )}
        {step === "genres" && (
          <PickStep
            title="Your musical taste"
            subtitle="Select the genres that resonate with you"
            emoji="🎵"
            items={GENRES.map((g) => ({ id: g.id, label: g.name, sub: g.desc, icon: g.icon, color: "#FF6B35" }))}
            selected={prefs.genres}
            onToggle={(id) => toggleItem("genres", id)}
            min={1}
          />
        )}
        {step === "eras" && (
          <PickStep
            title="Travel through time"
            subtitle="Which musical eras speak to your soul?"
            emoji="⏳"
            items={ERAS.map((e) => ({ id: e.id, label: e.name, sub: `${e.range} · ${e.desc}`, icon: e.icon, color: "#00C9A7" }))}
            selected={prefs.eras}
            onToggle={(id) => toggleItem("eras", id)}
            min={1}
          />
        )}
        {step === "artists" && (
          <ArtistStep
            selected={prefs.artists}
            onToggle={(id) => toggleItem("artists", id)}
            artists={FEATURED_ARTISTS}
          />
        )}
        {step === "ready" && (
          <ReadyStep name={prefs.name} prefs={prefs} onComplete={() => onComplete(prefs)} />
        )}
      </div>

      {/* Bottom CTA */}
      {step !== "welcome" && step !== "ready" && (
        <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-4 bg-gradient-to-t from-[#05050A] to-transparent z-20">
          <button
            id="onboarding-next-btn"
            onClick={goNext}
            disabled={!canNext()}
            className={`w-full max-w-md mx-auto flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold
              transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed
              ${canNext()
                ? "bg-gradient-to-r from-[#FF6B35] to-[#E55A25] text-white shadow-lg shadow-[#FF6B35]/25 hover:scale-[1.02] active:scale-[0.98]"
                : "bg-white/5 text-white/30 border border-white/10"
              }`}
          >
            {step === "artists" ? "Finish Setup" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ——— Step Components ———

function WelcomeStep({ onNext }: { onNext: () => void }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-full text-center px-4 py-16 gap-8">
      {/* Animated logo */}
      <div className="relative">
        <div
          className="w-28 h-28 rounded-full border-2 border-[#FF6B35]/40 flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at center, rgba(255,107,53,0.15) 0%, transparent 70%)",
            boxShadow: pulse ? "0 0 60px rgba(255,107,53,0.3)" : "0 0 20px rgba(255,107,53,0.1)",
            transition: "box-shadow 2s ease",
          }}
        >
          <Volume2 className="w-12 h-12 text-[#FF6B35]" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#00C9A7] rounded-full flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      <div>
        <h1 className="text-4xl font-black text-white mb-2">Namaste! 🙏</h1>
        <p className="text-lg font-bold bg-gradient-to-r from-[#FF6B35] via-[#F7C948] to-[#00C9A7] bg-clip-text text-transparent mb-3">
          Welcome to BharatSwar
        </p>
        <p className="text-white/50 text-base leading-relaxed max-w-sm">
          India&apos;s most comprehensive music platform. 110+ languages, 5,000 years of heritage, and AI-powered discovery — all in one place.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {[
          { icon: Globe, text: "110+ Indian languages supported", color: "#00C9A7" },
          { icon: Music, text: "Classical to contemporary music", color: "#F7C948" },
          { icon: Mic2, text: "AI DJ curates your perfect playlist", color: "#FF6B35" },
        ].map(({ icon: Icon, text, color }) => (
          <div key={text} className="flex items-center gap-3 glass-panel rounded-2xl px-4 py-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
              <Icon className="w-4.5 h-4.5" style={{ color }} />
            </div>
            <span className="text-sm text-white/70">{text}</span>
          </div>
        ))}
      </div>

      <button
        id="welcome-get-started"
        onClick={onNext}
        className="w-full max-w-sm flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold
          bg-gradient-to-r from-[#FF6B35] to-[#E55A25] text-white shadow-lg shadow-[#FF6B35]/25
          hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer mt-2"
      >
        Let&apos;s Get Started
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function NameStep({
  name, onChange, onNext,
}: {
  name: string; onChange: (n: string) => void; onNext: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full text-center px-4 py-16 gap-8 w-full max-w-md">
      <div>
        <p className="text-5xl mb-4">👤</p>
        <h2 className="text-3xl font-black text-white mb-2">What should we call you?</h2>
        <p className="text-white/45 text-sm">Your personal name or musical alias</p>
      </div>

      <div className="w-full">
        <input
          id="onboarding-name-input"
          type="text"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Ravi, Meera, Musician27..."
          className="glass-input w-full rounded-2xl px-5 py-4 text-lg text-white placeholder:text-white/20 text-center font-medium"
          onKeyDown={(e) => e.key === "Enter" && name.trim().length >= 2 && onNext()}
          autoFocus
          maxLength={30}
        />
        {name.length > 0 && (
          <p className="mt-2 text-sm text-white/30">{30 - name.length} characters remaining</p>
        )}
      </div>

      {name.trim().length >= 2 && (
        <p className="text-base text-white/60 animate-in fade-in duration-300">
          Great to meet you, <span className="text-[#FF6B35] font-semibold">{name}</span>! 🎵
        </p>
      )}
    </div>
  );
}

function PickStep({
  title, subtitle, emoji, items, selected, onToggle, min,
}: {
  title: string; subtitle: string; emoji: string;
  items: { id: string; label: string; sub: string; icon: string; color: string }[];
  selected: string[]; onToggle: (id: string) => void; min: number;
}) {
  return (
    <div className="w-full max-w-2xl pt-8 pb-4">
      <div className="text-center mb-8">
        <p className="text-4xl mb-3">{emoji}</p>
        <h2 className="text-2xl font-black text-white mb-1">{title}</h2>
        <p className="text-white/40 text-sm">{subtitle}</p>
        <p className="text-xs text-white/25 mt-1">Select at least {min} · tap to toggle</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <button
              key={item.id}
              id={`pick-${item.id}`}
              onClick={() => onToggle(item.id)}
              className={`relative flex flex-col items-start gap-1.5 p-4 rounded-2xl text-left transition-all duration-200
                cursor-pointer border active:scale-[0.97]
                ${isSelected
                  ? "bg-[#FF6B35]/15 border-[#FF6B35]/50 shadow-[0_0_20px_rgba(255,107,53,0.15)]"
                  : "glass-panel border-white/5 hover:border-white/15 hover:bg-white/5"
                }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-[#FF6B35] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <span className="text-2xl">{item.icon}</span>
              <span className={`text-sm font-bold ${isSelected ? "text-white" : "text-white/80"}`}>{item.label}</span>
              <span className="text-xs text-white/35 leading-tight">{item.sub}</span>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-center text-xs text-[#00C9A7] mt-4">{selected.length} selected</p>
      )}
    </div>
  );
}

function ArtistStep({
  selected, onToggle, artists,
}: {
  selected: string[];
  onToggle: (id: string) => void;
  artists: { id: string; name: string; genre: string; img: string }[];
}) {
  return (
    <div className="w-full max-w-2xl pt-8 pb-4">
      <div className="text-center mb-8">
        <p className="text-4xl mb-3">🌟</p>
        <h2 className="text-2xl font-black text-white mb-1">Artists you love</h2>
        <p className="text-white/40 text-sm">Pick your favorites to personalize your feed</p>
        <p className="text-xs text-white/25 mt-1">Optional · You can always change this later</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {artists.map((artist) => {
          const isSelected = selected.includes(artist.id);
          return (
            <button
              key={artist.id}
              id={`artist-${artist.id}`}
              onClick={() => onToggle(artist.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 cursor-pointer border active:scale-[0.95]
                ${isSelected
                  ? "bg-gradient-to-br from-[#FF6B35]/20 to-[#F7C948]/10 border-[#FF6B35]/40"
                  : "glass-panel border-white/5 hover:border-white/15 hover:bg-white/5"
                }`}
            >
              <div className={`relative w-14 h-14 rounded-full flex items-center justify-center text-2xl
                transition-all duration-200
                ${isSelected
                  ? "bg-gradient-to-br from-[#FF6B35]/30 to-[#F7C948]/20 ring-2 ring-[#FF6B35]/50"
                  : "bg-white/5"
                }`}
              >
                {artist.img}
                {isSelected && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FF6B35] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className={`text-xs font-bold leading-tight ${isSelected ? "text-white" : "text-white/70"}`}>{artist.name}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{artist.genre}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReadyStep({
  name, prefs, onComplete,
}: {
  name: string; prefs: OnboardingPreferences; onComplete: () => void;
}) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-full text-center px-4 py-16 gap-8">
      <div
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "scale(1)" : "scale(0.8)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Animated check */}
        <div className="w-28 h-28 mx-auto mb-8 relative">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FF6B35] to-[#F7C948] flex items-center justify-center shadow-2xl shadow-[#FF6B35]/40">
            <Check className="w-14 h-14 text-white" strokeWidth={3} />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#F7C948] opacity-30 blur-xl" />
        </div>

        <h2 className="text-3xl font-black text-white mb-2">
          You&apos;re all set{name ? `, ${name}` : ""}! 🎉
        </h2>
        <p className="text-white/50 text-base leading-relaxed max-w-sm">
          Your BharatSwar is personalized and ready. Time to explore 5,000 years of Indian music heritage.
        </p>

        {/* Summary */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {prefs.languages.slice(0, 3).map((lang) => (
            <span key={lang} className="px-3 py-1.5 rounded-full bg-[#FF6B35]/15 text-[#FF6B35] text-xs font-semibold">{lang}</span>
          ))}
          {prefs.genres.slice(0, 2).map((g) => (
            <span key={g} className="px-3 py-1.5 rounded-full bg-[#00C9A7]/15 text-[#00C9A7] text-xs font-semibold capitalize">{g}</span>
          ))}
          {prefs.artists.length > 0 && (
            <span className="px-3 py-1.5 rounded-full bg-[#F7C948]/15 text-[#F7C948] text-xs font-semibold">
              {prefs.artists.length} artists
            </span>
          )}
        </div>
      </div>

      <button
        id="onboarding-complete-btn"
        onClick={onComplete}
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="w-full max-w-sm flex items-center justify-center gap-2 py-5 rounded-2xl text-lg font-black
          bg-gradient-to-r from-[#FF6B35] to-[#E55A25] text-white shadow-2xl shadow-[#FF6B35]/30
          hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200 cursor-pointer"
      >
        Enter BharatSwar
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
