import { create } from "zustand";

export interface Track {
  id: string;
  title: string;
  title_translations: Record<string, string>;
  artist: string;
  artist_id: string;
  album: string;
  album_id: string;
  cover_url: string;
  audio_url: string;
  preview_url: string;
  duration: number; // in seconds
  language: string;
  era: string;
  genre: string;
  lyrics?: Array<{ time: number; text: string; translation?: string }>;
  biography?: string;
  raga_info?: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
  isDay: boolean;
}

export interface LocationData {
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

export type UiLanguage = "en" | "hi" | "bn" | "ta" | "te" | "kn" | "ml" | "mr" | "gu" | "pa" | "or" | "as" | "ur";
export type NavigationTab = "Home" | "Discover" | "Radio" | "Library" | "Profile";
export type AuthMethod = "google" | "phone" | "email" | "guest" | null;

export interface UserProfile {
  name: string;
  displayName: string;
  avatarEmoji: string;
  authMethod: AuthMethod;
  joinedAt: string;
  preferredLanguages: string[];
  preferredGenres: string[];
  preferredEras: string[];
  preferredArtists: string[];
}

export interface ChatMessage {
  sender: "user" | "dj";
  text: string;
  tracks?: Track[];
  reasoning?: string;
  time: string;
}

interface BharatSwarState {
  // Auth State
  isAuthenticated: boolean;
  isOnboarded: boolean;
  userProfile: UserProfile | null;

  // Auth Actions
  login: (method: AuthMethod, profile?: Partial<UserProfile>) => void;
  logout: () => void;
  completeOnboarding: (prefs: { name: string; languages: string[]; genres: string[]; eras: string[]; artists: string[] }) => void;

  // Preferences
  activeLanguage: UiLanguage;
  activeTab: NavigationTab;
  preferredLanguages: string[];
  preferredEras: string[];
  likedSongs: string[]; // Track IDs
  lowBandwidthMode: boolean;
  offlineMode: boolean;

  // Audio Player State
  activeTrack: Track | null;
  isPlaying: boolean;
  volume: number; // 0 to 1
  muted: boolean;
  progress: number; // in seconds
  duration: number; // in seconds
  seekTo: number | null; // Trigger for engine to seek
  queue: Track[];
  queueIndex: number;
  history: Track[];
  visualizerOn: boolean;

  // UI Panels
  isLyricsOpen: boolean;
  isAiDjOpen: boolean;
  aiChatHistory: ChatMessage[];
  currentMood: string;
  currentWeather: string;
  userRegion: string;
  weatherDetails: WeatherData | null;
  locationDetails: LocationData | null;
  festivalName: string;
  themeMode: "dark" | "light" | "auto";
  festivalTheme: "None" | "Diwali" | "Holi" | "Navratri" | "Ganga";
  equalizerPreset: "Flat" | "Bass Boost" | "Vocal" | "Custom";
  equalizerBands: number[];
  isAdminOpen: boolean;
  isExpandedPlayerOpen: boolean;

  // Actions
  setActiveLanguage: (lang: UiLanguage) => void;
  setActiveTab: (tab: NavigationTab) => void;
  togglePreferredLanguage: (lang: string) => void;
  togglePreferredEra: (era: string) => void;
  toggleLikeSong: (trackId: string) => void;
  toggleLowBandwidth: () => void;
  toggleOfflineMode: () => void;

  // Player Actions
  playTrack: (track: Track) => void;
  playPlaylist: (tracks: Track[], startIndex?: number) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  seek: (time: number) => void;
  clearSeek: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  nextTrack: () => void;
  prevTrack: () => void;

  // UI Actions
  toggleLyrics: (open?: boolean) => void;
  toggleAiDj: (open?: boolean) => void;
  addChatMessage: (msg: Omit<ChatMessage, "time">) => void;
  setMood: (mood: string) => void;
  setWeather: (weather: string) => void;
  setRegion: (region: string) => void;
  setWeatherDetails: (weather: WeatherData) => void;
  setLocationDetails: (location: LocationData) => void;
  setFestivalName: (festivalName: string) => void;
  setThemeMode: (mode: "dark" | "light" | "auto") => void;
  setFestivalTheme: (fest: "None" | "Diwali" | "Holi" | "Navratri" | "Ganga") => void;
  setEqualizerPreset: (preset: "Flat" | "Bass Boost" | "Vocal" | "Custom") => void;
  setEqualizerBand: (index: number, val: number) => void;
  setIsAdminOpen: (open: boolean) => void;
  setIsExpandedPlayerOpen: (open: boolean) => void;
}

export const useStore = create<BharatSwarState>((set, get) => ({
  // Auth Initial State
  isAuthenticated: false,
  isOnboarded: false,
  userProfile: null,

  login: (method, profile) => {
    const avatarEmojis = ["🎵", "🎸", "🥁", "🎹", "🎺", "🎻", "🪕", "🪘", "🎙️", "🎤"];
    const randomAvatar = avatarEmojis[Math.floor(Math.random() * avatarEmojis.length)];
    set({
      isAuthenticated: true,
      userProfile: {
        name: profile?.name || (method === "guest" ? "Guest" : "Music Lover"),
        displayName: profile?.displayName || (method === "guest" ? "Guest" : "Music Lover"),
        avatarEmoji: profile?.avatarEmoji || randomAvatar,
        authMethod: method,
        joinedAt: new Date().toISOString(),
        preferredLanguages: profile?.preferredLanguages || ["Hindi", "English"],
        preferredGenres: profile?.preferredGenres || [],
        preferredEras: profile?.preferredEras || ["Modern", "Now"],
        preferredArtists: profile?.preferredArtists || [],
      },
      // Guests skip onboarding
      isOnboarded: method === "guest" ? true : false,
    });
  },

  logout: () => set({ isAuthenticated: false, isOnboarded: false, userProfile: null }),

  completeOnboarding: (prefs) => {
    const current = get().userProfile;
    if (!current) return;
    set({
      isOnboarded: true,
      userProfile: {
        ...current,
        name: prefs.name || current.name,
        displayName: prefs.name || current.displayName,
        preferredLanguages: prefs.languages,
        preferredGenres: prefs.genres,
        preferredEras: prefs.eras,
        preferredArtists: prefs.artists,
      },
      preferredLanguages: prefs.languages,
      preferredEras: prefs.eras,
    });
  },

  // Initial State
  activeLanguage: "en",
  activeTab: "Home",
  preferredLanguages: ["Hindi", "English"],
  preferredEras: ["Modern", "Digital", "Now"],
  likedSongs: [],
  lowBandwidthMode: false,
  offlineMode: false,

  activeTrack: null,
  isPlaying: false,
  volume: 0.8,
  muted: false,
  progress: 0,
  duration: 0,
  seekTo: null,
  queue: [],
  queueIndex: 0,
  history: [],
  visualizerOn: true,

  isLyricsOpen: false,
  isAiDjOpen: false,
  aiChatHistory: [
    {
      sender: "dj",
      text: "Namaste! I am your BharatSwar AI DJ. Tell me what mood or language you're feeling, or ask for a morning Raga to kickstart your day!",
      time: "08:30 AM",
    },
  ],
  currentMood: "Peaceful",
  currentWeather: "Sunny",
  userRegion: "Detecting location...",
  weatherDetails: null,
  locationDetails: null,
  festivalName: "Traditional Curation Cycle",
  themeMode: "dark",
  festivalTheme: "None",
  equalizerPreset: "Flat",
  equalizerBands: [0, 0, 0, 0, 0],
  isAdminOpen: false,
  isExpandedPlayerOpen: false,

  // Actions implementation
  setActiveLanguage: (lang) => set({ activeLanguage: lang }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  togglePreferredLanguage: (lang) => {
    const current = get().preferredLanguages;
    const updated = current.includes(lang)
      ? current.filter((l) => l !== lang)
      : [...current, lang];
    set({ preferredLanguages: updated });
  },

  togglePreferredEra: (era) => {
    const current = get().preferredEras;
    const updated = current.includes(era)
      ? current.filter((e) => e !== era)
      : [...current, era];
    set({ preferredEras: updated });
  },

  toggleLikeSong: (trackId) => {
    const current = get().likedSongs;
    const updated = current.includes(trackId)
      ? current.filter((id) => id !== trackId)
      : [...current, trackId];
    set({ likedSongs: updated });
  },

  toggleLowBandwidth: () => set((state) => ({ lowBandwidthMode: !state.lowBandwidthMode })),
  toggleOfflineMode: () => set((state) => ({ offlineMode: !state.offlineMode })),

  playTrack: (track) => {
    const history = get().history;
    // Add to history, avoiding consecutive duplicates
    const updatedHistory = history[0]?.id === track.id ? history : [track, ...history.slice(0, 49)];

    set({
      activeTrack: track,
      isPlaying: true,
      progress: 0,
      history: updatedHistory,
      // If queue is empty, make this track the only queue item
      queue: get().queue.length === 0 ? [track] : get().queue,
      queueIndex: get().queue.length === 0 ? 0 : get().queueIndex,
    });
  },

  playPlaylist: (tracks, startIndex = 0) => {
    if (tracks.length === 0) return;
    const active = tracks[startIndex];
    const history = get().history;
    const updatedHistory = history[0]?.id === active.id ? history : [active, ...history.slice(0, 49)];

    set({
      queue: tracks,
      queueIndex: startIndex,
      activeTrack: active,
      isPlaying: true,
      progress: 0,
      history: updatedHistory,
    });
  },

  togglePlay: () => set((state) => ({ isPlaying: state.activeTrack ? !state.isPlaying : false })),
  setVolume: (volume) => set({ volume }),
  toggleMute: () => set((state) => ({ muted: !state.muted })),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  seek: (time) => set({ seekTo: time }),
  clearSeek: () => set({ seekTo: null }),

  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  removeFromQueue: (trackId) =>
    set((state) => {
      const index = state.queue.findIndex((t) => t.id === trackId);
      if (index === -1) return {};
      const updatedQueue = state.queue.filter((t) => t.id !== trackId);
      let newIndex = state.queueIndex;
      if (index < state.queueIndex) {
        newIndex = state.queueIndex - 1;
      } else if (index === state.queueIndex) {
        newIndex = Math.min(state.queueIndex, updatedQueue.length - 1);
      }
      return {
        queue: updatedQueue,
        queueIndex: newIndex,
        activeTrack: updatedQueue[newIndex] || null,
      };
    }),

  nextTrack: () => {
    const { queue, queueIndex } = get();
    if (queue.length === 0) return;
    const nextIndex = (queueIndex + 1) % queue.length;
    const nextTrack = queue[nextIndex];
    if (nextTrack) {
      set({
        queueIndex: nextIndex,
        activeTrack: nextTrack,
        isPlaying: true,
        progress: 0,
      });
    }
  },

  prevTrack: () => {
    const { queue, queueIndex } = get();
    if (queue.length === 0) return;
    const prevIndex = queueIndex - 1 < 0 ? queue.length - 1 : queueIndex - 1;
    const prevTrack = queue[prevIndex];
    if (prevTrack) {
      set({
        queueIndex: prevIndex,
        activeTrack: prevTrack,
        isPlaying: true,
        progress: 0,
      });
    }
  },

  toggleLyrics: (open) =>
    set((state) => ({
      isLyricsOpen: open !== undefined ? open : !state.isLyricsOpen,
      // close AI DJ if lyrics is opened to conserve screen space
      isAiDjOpen: open !== undefined && open ? false : state.isAiDjOpen,
    })),

  toggleAiDj: (open) =>
    set((state) => ({
      isAiDjOpen: open !== undefined ? open : !state.isAiDjOpen,
      // close lyrics if AI DJ is opened
      isLyricsOpen: open !== undefined && open ? false : state.isLyricsOpen,
    })),

  addChatMessage: (msg) => {
    const date = new Date();
    const timeString = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    set((state) => ({
      aiChatHistory: [
        ...state.aiChatHistory,
        {
          ...msg,
          time: timeString,
        },
      ],
    }));
  },

  setMood: (mood) => set({ currentMood: mood }),
  setWeather: (weather) => set({ currentWeather: weather }),
  setRegion: (region) => set({ userRegion: region }),
  setWeatherDetails: (weatherDetails) => set({ weatherDetails }),
  setLocationDetails: (locationDetails) => set({ locationDetails }),
  setFestivalName: (festivalName) => set({ festivalName }),
  setThemeMode: (themeMode) => set({ themeMode }),
  setFestivalTheme: (festivalTheme) => set({ festivalTheme }),
  setEqualizerPreset: (preset) => {
    let bands = [0, 0, 0, 0, 0];
    if (preset === "Bass Boost") bands = [8, 5, 1, 0, 0];
    else if (preset === "Vocal") bands = [-2, 1, 6, 4, -1];
    set({ equalizerPreset: preset, equalizerBands: bands });
  },
  setEqualizerBand: (index, val) => {
    const bands = [...get().equalizerBands];
    bands[index] = val;
    set({ equalizerBands: bands, equalizerPreset: "Custom" });
  },
  setIsAdminOpen: (isAdminOpen) => set({ isAdminOpen }),
  setIsExpandedPlayerOpen: (isExpandedPlayerOpen) => set({ isExpandedPlayerOpen }),
}));
