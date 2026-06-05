import { Track } from "./store";

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

// Deep regional variety database (Tamil, Hindi, Gujarati, Punjabi, Bengali, etc.)
export const BHARATSWAR_CATALOG: Track[] = [
  {
    id: "guj-1",
    title: "Moti Verana (Garba Edit)",
    title_translations: { en: "Moti Verana", hi: "मोती वेराणा" },
    artist: "Amit Trivedi & Osman Mir",
    artist_id: "art-guj-1",
    album: "Songs of Gujarat",
    album_id: "alb-guj-1",
    cover_url: "https://images.unsplash.com/photo-1628563694622-5a76d6e0686e?w=400&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 250,
    language: "Gujarati",
    era: "Digital",
    genre: "Garba / Folk",
    lyrics: [
      { time: 0, text: "[Heavy Dhol & Shehnai introduction]" },
      { time: 10, text: "Moti verana chowk ma re... lolo..." },
      { time: 15, text: "Pearls are scattered in the courtyard...", translation: "Pearls are scattered in the courtyard..." },
    ],
  },
  {
    id: "guj-2",
    title: "Vhalam Aavo Ne",
    title_translations: { en: "Beloved, Come Home", hi: "व्हालम आवो ने" },
    artist: "Jigardan Gadhavi",
    artist_id: "art-guj-2",
    album: "Love Ni Bhavai",
    album_id: "alb-guj-2",
    cover_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 312,
    language: "Gujarati",
    era: "Digital",
    genre: "Romantic Pop",
    lyrics: [
      { time: 0, text: "[Acoustic guitar and flute intro]" },
      { time: 12, text: "Vhalam aavo ne, koi thal aavo ne..." },
    ],
  },
  {
    id: "tam-1",
    title: "Kannalane (Bombay)",
    title_translations: { en: "Kehna Hi Kya", hi: "कहना ही क्या" },
    artist: "A.R. Rahman & K.S. Chithra",
    artist_id: "art-tam-1",
    album: "Bombay",
    album_id: "alb-tam-1",
    cover_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 340,
    language: "Tamil",
    era: "Modern",
    genre: "Bollywood Classical Fusion",
    lyrics: [
      { time: 0, text: "[A cappella chorus starts]" },
      { time: 10, text: "Kannalane, enadhu kannai netrodu kanavillai..." },
    ],
  },
  {
    id: "hin-1",
    title: "Tum Hi Ho",
    title_translations: { en: "You Are The One" },
    artist: "Arijit Singh",
    artist_id: "art-hin-1",
    album: "Aashiqui 2",
    album_id: "alb-hin-1",
    cover_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: 262,
    language: "Hindi",
    era: "Digital",
    genre: "Romantic / Sad",
    lyrics: [
      { time: 0, text: "[Piano introduction]" },
      { time: 8, text: "Hum tere bin ab reh nahi sakte..." },
    ],
  },
  {
    id: "pun-1",
    title: "Brown Munde",
    title_translations: { en: "Brown Boys" },
    artist: "AP Dhillon, Gurinder Gill",
    artist_id: "art-pun-1",
    album: "Brown Munde",
    album_id: "alb-pun-1",
    cover_url: "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?w=400&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    duration: 208,
    language: "Punjabi",
    era: "Now",
    genre: "Punjabi Hip-hop",
    lyrics: [
      { time: 0, text: "[Trap beat intro]" },
      { time: 12, text: "Aah... Desi nakhras, Brown Munde..." },
    ],
  },
  {
    id: "ben-1",
    title: "Ami Chini Go Chini Tomare",
    title_translations: { en: "I Know You" },
    artist: "Shreya Ghoshal",
    artist_id: "art-ben-1",
    album: "Tagore Songs Collection",
    album_id: "alb-ben-1",
    cover_url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    duration: 240,
    language: "Bengali",
    era: "Classic",
    genre: "Rabindra Sangeet",
    lyrics: [
      { time: 0, text: "[Esraj introduction]" },
      { time: 10, text: "Ami chini go chini tomare, ogo bideshini..." },
    ],
  },
  {
    id: "tel-1",
    title: "Samajavaragamana",
    title_translations: { en: "Elegant Walk" },
    artist: "Sid Sriram",
    artist_id: "art-tel-1",
    album: "Ala Vaikunthapurramuloo",
    album_id: "alb-tel-1",
    cover_url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    duration: 220,
    language: "Telugu",
    era: "Now",
    genre: "Pop / Classical Fusion",
    lyrics: [
      { time: 0, text: "[Bass guitar solo intro]" },
      { time: 8, text: "Samajavaragamana..." },
    ],
  },
  {
    id: "kan-1",
    title: "Singara Siriye",
    title_translations: { en: "Beautiful Lady" },
    artist: "Vijay Prakash",
    artist_id: "art-kan-1",
    album: "Kantara",
    album_id: "alb-kan-1",
    cover_url: "https://images.unsplash.com/photo-1604881990409-b9f246db39da?w=400&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    duration: 282,
    language: "Kannada",
    era: "Now",
    genre: "Folk / Devotional",
    lyrics: [
      { time: 0, text: "[Folk drums introduction]" },
      { time: 14, text: "Singara siriye, angaladalli..." },
    ],
  },
  {
    id: "mal-1",
    title: "Malare (Premam)",
    title_translations: { en: "Flower" },
    artist: "Vijay Yesudas",
    artist_id: "art-mal-1",
    album: "Premam",
    album_id: "alb-mal-1",
    cover_url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    duration: 310,
    language: "Malayalam",
    era: "Digital",
    genre: "Melodic Pop",
    lyrics: [
      { time: 0, text: "[Violin intro]" },
      { time: 10, text: "Malare ninne kaanadhirundhal..." },
    ],
  },
  {
    id: "int-1",
    title: "Shape of You",
    title_translations: { hi: "शेप ऑफ़ यू" },
    artist: "Ed Sheeran",
    artist_id: "art-int-1",
    album: "Divide",
    album_id: "alb-int-1",
    cover_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    duration: 233,
    language: "English",
    era: "Digital",
    genre: "Pop",
    lyrics: [
      { time: 0, text: "[Marimba loop starts]" },
      { time: 6, text: "The club isn't the best place to find a lover..." },
    ],
  },
  {
    id: "class-1",
    title: "Raga Yaman - Sitar Alap",
    title_translations: { en: "Raga Yaman - Sitar Alap", hi: "राग यमन - सितार आलाप" },
    artist: "Ustad Shahid Parvez",
    artist_id: "art-class-1",
    album: "Legacy of Sitar",
    album_id: "alb-class-1",
    cover_url: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    duration: 380,
    language: "Sanskrit",
    era: "Medieval",
    genre: "Hindustani Classical",
    raga_info: "Raga Yaman is a deeply meditative evening raga from 16th century CE. It utilizes all sharp (tivra) notes except Ma, creating a serene and introspective mood suitable for nightfall.",
    lyrics: [
      { time: 0, text: "[Slow introductory Sitar pluck - Alap]" },
      { time: 15, text: "[Gat composition in Teentaal begins]" },
      { time: 30, text: "A resonant dialogue between strings and heartbeat..." },
    ],
  },
  {
    id: "class-2",
    title: "Vatapi Ganapatim Bhaje",
    title_translations: { en: "Vatapi Ganapatim Bhaje", hi: "वातापि गणपतिं भजे" },
    artist: "M.S. Subbulakshmi",
    artist_id: "art-class-2",
    album: "Carnatic Devotionals",
    album_id: "alb-class-2",
    cover_url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    duration: 315,
    language: "Sanskrit",
    era: "Colonial",
    genre: "Carnatic Classical",
    raga_info: "Set in Raga Hamsadhwani, Adi Tala. Muthuswami Dikshitar composed this song in the 18th century CE, invoking Lord Ganesha. It is celebrated for its bright and auspicious quality.",
    lyrics: [
      { time: 0, text: "[Tambura and Violin tuning]" },
      { time: 10, text: "Vatapi Ganapatim Bhajeham, Varanasyam..." },
      { time: 25, text: "I worship the Elephant-faced Lord Vatapi Ganapati..." },
    ],
  },
  {
    id: "folk-1",
    title: "Kesariya Balam (Maand)",
    title_translations: { en: "Kesariya Balam", hi: "केसरिया बालम" },
    artist: "Allah Jilai Bai",
    artist_id: "art-folk-1",
    album: "Desert Melodies",
    album_id: "alb-folk-1",
    cover_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    duration: 290,
    language: "Hindi",
    era: "Classic",
    genre: "Rajasthani Folk",
    raga_info: "Based on the Rajasthani folk raga 'Maand'. Historically sung to welcome Rajput warriors returning home, this song captures the vast emotion of the Thar desert.",
    lyrics: [
      { time: 0, text: "[Soulful vocal Alaap starts without dholak]" },
      { time: 12, text: "Kesariya balam, aao ni padharo mare des..." },
      { time: 28, text: "Saffron-robed beloved, welcome to my homeland..." },
    ],
  },
  {
    id: "folk-2",
    title: "Bihu Re Bihu",
    title_translations: { en: "Bihu Festival Song", as: "বিহু ৰে বিহু" },
    artist: "Bhupen Hazarika",
    artist_id: "art-folk-2",
    album: "Echoes of Brahmaputra",
    album_id: "alb-folk-2",
    cover_url: "https://images.unsplash.com/photo-1628563694622-5a76d6e0686e?w=400&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    duration: 210,
    language: "Assamese",
    era: "Classic",
    genre: "Assamese Folk",
    raga_info: "Traditional Assamese spring festival Bihu tune, expressing joy, harvest celebrations, and youthful romance with dhol, pepa, and gogona.",
    lyrics: [
      { time: 0, text: "[Traditional Pepa horn intro]" },
      { time: 10, text: "Bihu re bihu, borosaa bihu aahi paale..." },
    ],
  },
  {
    id: "pod-1",
    title: "The Sitar Evolution",
    title_translations: { en: "The Sitar Evolution", hi: "सितार का विकास" },
    artist: "BharatSwar Archives",
    artist_id: "art-pod-1",
    album: "Swar Charcha Podcast",
    album_id: "alb-pod-1",
    cover_url: "https://images.unsplash.com/photo-1610116306796-6ebd30d79140?w=400&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    duration: 480,
    language: "English",
    era: "Now",
    genre: "Podcast / History",
    lyrics: [
      { time: 0, text: "[Lofi intro music]" },
      { time: 8, text: "Welcome to Swar Charcha. Today we trace the Sitar from Amir Khusrau to modern concerts." },
    ],
  },
  {
    id: "pod-2",
    title: "Ragas: The 10 Thaat Systems",
    title_translations: { en: "Ragas: The 10 Thaats", hi: "रागास: १० थाट सिस्टम्स" },
    artist: "Dr. Jaya Dodiya",
    artist_id: "art-pod-2",
    album: "Swar Shastra Lecture Series",
    album_id: "alb-pod-2",
    cover_url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=80",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    duration: 540,
    language: "Hindi",
    era: "Now",
    genre: "Podcast / Educational",
    lyrics: [
      { time: 0, text: "[Mild sitar backdrop]" },
      { time: 6, text: "Namaskar. Swar Shastra me aaj hum Bhatkhande ji ke 10 thaat vishay par charcha karenge..." },
    ],
  },
];

// Helper to bridge Deezer search items to our Track model
export function mapDeezerTrackToBharatSwar(deezerTrack: any): Track {
  const eraOptions = ["Digital", "Now", "Modern"];
  const randomEra = eraOptions[Math.floor(Math.random() * eraOptions.length)];
  const randomLang = ["Hindi", "Tamil", "Punjabi", "Bengali", "English", "Gujarati"][Math.floor(Math.random() * 6)];

  return {
    id: String(deezerTrack.id),
    title: deezerTrack.title,
    title_translations: {
      en: deezerTrack.title,
      hi: deezerTrack.title,
    },
    artist: deezerTrack.artist?.name || "Unknown Artist",
    artist_id: String(deezerTrack.artist?.id || ""),
    album: deezerTrack.album?.title || "Single",
    album_id: String(deezerTrack.album?.id || ""),
    cover_url: deezerTrack.album?.cover_medium || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80",
    audio_url: deezerTrack.preview || "",
    preview_url: deezerTrack.preview || "",
    duration: deezerTrack.duration || 30,
    language: randomLang,
    era: randomEra,
    genre: "Pop / Bollywood",
    lyrics: [
      { time: 0, text: "[Music Starts]" },
      { time: 10, text: "Enjoy this preview streaming live via Deezer CDN." },
    ],
  };
}

// Open Location API & IP fallback
export async function detectLocation(): Promise<LocationData> {
  if (typeof window !== "undefined" && navigator.geolocation) {
    try {
      const coords = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 });
      });

      const { latitude, longitude } = coords.coords;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
      );

      if (response.ok) {
        const data = await response.json();
        const city = data.address?.city || data.address?.town || data.address?.state_district || "Vadodara";
        const state = data.address?.state || "Gujarat";
        const country = data.address?.country || "India";
        return { city, state, country, latitude, longitude };
      }
    } catch (e) {
      console.log("GPS geolocation failed. Falling back to IP.");
    }
  }

  // Fallback to IP Geolocation
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = await res.json();
      return {
        city: data.city || "Vadodara",
        state: data.region || "Gujarat",
        country: data.country_name || "India",
        latitude: data.latitude || 22.3072,
        longitude: data.longitude || 73.1812,
      };
    }
  } catch (e) {
    console.log("IP geolocation failed.");
  }

  return {
    city: "Vadodara",
    state: "Gujarat",
    country: "India",
    latitude: 22.3072,
    longitude: 73.1812,
  };
}

export async function detectUserRegion(): Promise<string> {
  try {
    const loc = await detectLocation();
    return `${loc.city}, ${loc.state}`;
  } catch (e) {
    return "Vadodara, Gujarat";
  }
}

// Open-Meteo Weather API Integration
export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=sunrise,sunset&timezone=auto`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const temp = Math.round(data.current?.temperature_2m || 29);
      const humidity = data.current?.relative_humidity_2m || 60;
      const windSpeed = Math.round(data.current?.wind_speed_10m || 10);
      const isDay = data.current?.is_day === 1;

      const code = data.current?.weather_code || 0;
      let condition = "Clear Sky";
      if (code >= 1 && code <= 3) condition = "Partly Cloudy";
      else if (code >= 45 && code <= 48) condition = "Foggy";
      else if (code >= 51 && code <= 67) condition = "Rainy / Showers";
      else if (code >= 71 && code <= 77) condition = "Snowy";
      else if (code >= 80 && code <= 82) condition = "Heavy Showers";
      else if (code >= 95) condition = "Thunderstorm";

      const sunriseRaw = data.daily?.sunrise?.[0] || "";
      const sunsetRaw = data.daily?.sunset?.[0] || "";
      const formatHour = (raw: string) => {
        if (!raw) return "06:00 AM";
        const date = new Date(raw);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      };

      return {
        temp,
        condition,
        humidity,
        windSpeed,
        sunrise: formatHour(sunriseRaw),
        sunset: formatHour(sunsetRaw),
        isDay,
      };
    }
  } catch (e) {
    console.warn("Weather API failed.");
  }

  return {
    temp: 29,
    condition: "Clear Sky",
    humidity: 55,
    windSpeed: 8,
    sunrise: "06:04 AM",
    sunset: "06:50 PM",
    isDay: true,
  };
}

// Geolocation recommendation logic
export function getContextRecommendations(
  timeOfDay: string,
  weather: WeatherData,
  location: LocationData,
  langPref: string
): Track[] {
  let list = [...BHARATSWAR_CATALOG];

  if (langPref && langPref !== "English" && langPref !== "All") {
    const langTracks = list.filter((t) => t.language.toLowerCase() === langPref.toLowerCase());
    if (langTracks.length > 0) list = langTracks;
  }

  if (weather.condition.toLowerCase().includes("rain") || weather.condition.toLowerCase().includes("shower")) {
    return list.filter((t) => t.id === "guj-1" || t.id === "tam-1" || t.id === "ben-1");
  }

  if (timeOfDay === "Evening" || timeOfDay === "Night") {
    return list.filter((t) => t.id === "guj-2" || t.id === "hin-1" || t.id === "mal-1");
  }

  return list.filter((t) => t.id === "guj-1" || t.id === "tel-1" || t.id === "kan-1" || t.id === "int-1");
}

export function normalizePhonetic(str: string): string {
  if (!str) return "";
  let s = str.toLowerCase();

  const unicodeDevanagari: Record<string, string> = {
    "अ": "a", "आ": "a", "इ": "i", "ई": "i", "उ": "u", "ऊ": "u", "ऋ": "ri",
    "ए": "e", "ऐ": "ai", "ओ": "o", "औ": "au",
    "क": "k", "ख": "k", "ग": "g", "घ": "g", "ङ": "n",
    "च": "c", "छ": "c", "ज": "j", "झ": "j", "ञ": "n",
    "ट": "t", "ठ": "t", "ड": "d", "ढ": "d", "ण": "n",
    "त": "t", "थ": "t", "द": "d", "ध": "d", "न": "n",
    "प": "p", "फ": "p", "ब": "b", "भ": "b", "म": "m",
    "य": "y", "र": "r", "ल": "l", "व": "v", "श": "s", "ष": "s", "स": "s", "ह": "h",
    "ा": "a", "ि": "i", "ी": "i", "ु": "u", "ू": "u", "ृ": "ri", "े": "e", "ै": "ai", "ो": "o", "ौ": "au", "ं": "n", "ः": "h"
  };

  const unicodeTamil: Record<string, string> = {
    "அ": "a", "ஆ": "a", "இ": "i", "ஈ": "i", "உ": "u", "ஊ": "u",
    "க": "k", "ங": "n", "ச": "c", "ஞ": "n", "ட": "t", "ண": "n",
    "த": "t", "ந": "n", "ப": "p", "ம": "m", "ய": "y", "ர": "r", "ல": "l", "வ": "v", "ழ": "l", "ள": "l", "ற": "r", "ன": "n",
    "ா": "a", "ி": "i", "ீ": "i", "ு": "u", "ூ": "u", "ெ": "e", "ே": "e", "ை": "ai", "ொ": "o", "ோ": "o"
  };

  let normalized = "";
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (unicodeDevanagari[char] !== undefined) {
      normalized += unicodeDevanagari[char];
    } else if (unicodeTamil[char] !== undefined) {
      normalized += unicodeTamil[char];
    } else {
      normalized += char;
    }
  }

  normalized = normalized.replace(/[^a-z0-9]/g, "");

  // Standardize common phonetic equivalents
  normalized = normalized.replaceAll("ee", "i")
                         .replaceAll("oo", "u")
                         .replaceAll("aa", "a")
                         .replaceAll("gh", "g")
                         .replaceAll("kh", "k")
                         .replaceAll("sh", "s")
                         .replaceAll("dh", "d")
                         .replaceAll("bh", "b")
                         .replaceAll("ph", "p")
                         .replaceAll("jh", "j")
                         .replaceAll("ch", "c")
                         .replaceAll("th", "t");
  return normalized;
}

export async function searchTracks(query: string): Promise<Track[]> {
  if (!query || query.trim() === "") {
    return BHARATSWAR_CATALOG;
  }

  const queryNormalized = normalizePhonetic(query);
  const matchedCatalog = BHARATSWAR_CATALOG.filter((track) => {
    // Check direct lowercase matching for languages, genres, eras
    const queryLower = query.toLowerCase();
    if (
      track.language.toLowerCase().includes(queryLower) ||
      track.genre.toLowerCase().includes(queryLower) ||
      track.era.toLowerCase().includes(queryLower)
    ) {
      return true;
    }

    // Run phonetic normalization check on titles and artists
    const trackTitleNormalized = normalizePhonetic(track.title);
    const trackArtistNormalized = normalizePhonetic(track.artist);
    
    // Check translations list (like title_translations)
    let translationMatch = false;
    if (track.title_translations) {
      translationMatch = Object.values(track.title_translations).some(trans => 
        normalizePhonetic(trans).includes(queryNormalized)
      );
    }

    return (
      trackTitleNormalized.includes(queryNormalized) ||
      trackArtistNormalized.includes(queryNormalized) ||
      translationMatch
    );
  });

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (response.ok) {
      const result = await response.json();
      if (result && result.data && Array.isArray(result.data)) {
        const mappedDeezer = result.data.map(mapDeezerTrackToBharatSwar);
        // Deduplicate or append results
        const combined = [...matchedCatalog, ...mappedDeezer];
        const seen = new Set();
        return combined.filter(item => {
          const key = `${item.title}-${item.artist}`.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }
    }
  } catch (error) {
    console.error("Error searching tracks", error);
  }

  return matchedCatalog;
}

export async function getTrending(language?: string, era?: string): Promise<Track[]> {
  let tracks = [...BHARATSWAR_CATALOG];

  try {
    const response = await fetch(`/api/charts`);
    if (response.ok) {
      const result = await response.json();
      if (result && result.tracks && result.tracks.data && Array.isArray(result.tracks.data)) {
        const mappedDeezer = result.tracks.data.map(mapDeezerTrackToBharatSwar);
        tracks = [...tracks, ...mappedDeezer];
      }
    }
  } catch (error) {
    console.error("Error fetching trending tracks", error);
  }

  if (language) {
    tracks = tracks.filter((t) => t.language.toLowerCase() === language.toLowerCase());
  }
  if (era) {
    tracks = tracks.filter((t) => t.era.toLowerCase() === era.toLowerCase());
  }

  return tracks;
}

export async function getCountryCharts(country: string): Promise<Track[]> {
  let searchQuery = "Indian Hits";
  if (country === "KR") searchQuery = "K-Pop";
  if (country === "US") searchQuery = "US Billboard Hits";
  if (country === "GB") searchQuery = "UK Top Hits";
  if (country === "JP") searchQuery = "J-Pop Hits";

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
    if (response.ok) {
      const result = await response.json();
      if (result && result.data && Array.isArray(result.data)) {
        return result.data.map(mapDeezerTrackToBharatSwar);
      }
    }
  } catch (e) {
    console.error("Country charts fetch failed", e);
  }

  return BHARATSWAR_CATALOG.slice(0, 3);
}

// AI DJ Dynamic sentence generator
export function generateAiDjPlaylist(
  mood: string,
  language: string,
  era: string,
  weather: string,
  timeOfDay: string,
  activity?: string,
  duration?: string
): { tracks: Track[]; reasoning: string } {
  let eligible = [...BHARATSWAR_CATALOG];

  if (language && language !== "All" && language !== "English") {
    const langTracks = eligible.filter((t) => t.language.toLowerCase() === language.toLowerCase());
    if (langTracks.length > 0) eligible = langTracks;
  }

  let reasoning = `Compiled a ${duration || "30"} minute ${language} playlist for ${activity || "your activity"} during a ${weather.toLowerCase()} ${timeOfDay.toLowerCase()} to match a ${mood.toLowerCase()} mood.`;

  if (mood === "Peaceful" || mood === "Devotional" || activity === "Sleep") {
    eligible = eligible.filter((t) => t.genre.includes("Classical") || t.genre.includes("Devotional") || t.genre.includes("Folk"));
  } else if (mood === "Energetic" || activity === "Workout") {
    eligible = eligible.filter((t) => t.genre.includes("Pop") || t.genre.includes("Hip-hop") || t.genre.includes("Garba"));
  }

  return {
    tracks: eligible.length > 0 ? eligible : BHARATSWAR_CATALOG.slice(0, 3),
    reasoning,
  };
}
