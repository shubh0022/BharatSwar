"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

export default function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    activeTrack,
    isPlaying,
    volume,
    muted,
    seekTo,
    setProgress,
    setDuration,
    clearSeek,
    nextTrack,
    togglePlay,
  } = useStore();

  // Initialize Audio Element once in browser
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    // Expose audio globally for Web Audio API visualizer
    if (typeof window !== "undefined") {
      (window as any).__bharatSwarAudio = audio;
    }

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleDurationChange = () => {
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      nextTrack();
    };

    const handleError = (e: any) => {
      console.warn("Audio playback error, auto-skipping or playing fallback:", e);
      // Auto-skip on broken URLs
      setTimeout(() => {
        nextTrack();
      }, 1500);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      if (typeof window !== "undefined") {
        delete (window as any).__bharatSwarAudio;
      }
    };
  }, [setProgress, setDuration, nextTrack]);

  // Handle source changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (activeTrack) {
      // Prioritize preview_url or audio_url
      const url = activeTrack.preview_url || activeTrack.audio_url;
      if (audio.src !== url) {
        audio.src = url;
        audio.load();
        if (isPlaying) {
          audio.play().catch((err) => {
            console.warn("Playback prevented by browser policy, pausing state.", err);
            // If autoplay was blocked, sync play state back to store
            if (isPlaying) togglePlay();
          });
        }
      }
    } else {
      audio.src = "";
      audio.pause();
    }
  }, [activeTrack, isPlaying, togglePlay]);

  // Handle Play/Pause commands
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (isPlaying) {
      audio.play().catch(() => {
        // Safe check for browser interaction rules
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Handle Volume & Mute changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);

  // Handle seeks
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || seekTo === null) return;

    audio.currentTime = seekTo;
    clearSeek();
  }, [seekTo, clearSeek]);

  return null; // This component provides audio logic only
}
