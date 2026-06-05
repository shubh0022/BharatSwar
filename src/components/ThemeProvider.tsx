"use client";

import React, { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeMode, festivalTheme, currentMood } = useStore();

  useEffect(() => {
    const root = document.documentElement;

    // 1. Resolve Theme Mode (Dark, Light, Auto)
    const applyTheme = (mode: "dark" | "light" | "auto") => {
      if (mode === "auto") {
        const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.setAttribute("data-theme", isSystemDark ? "dark" : "light");
      } else {
        root.setAttribute("data-theme", mode);
      }
    };

    applyTheme(themeMode);

    // Dynamic listener for Auto mode preference shifts
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (themeMode === "auto") {
        applyTheme("auto");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    // 2. Set Festival Theme Overrides
    if (festivalTheme && festivalTheme !== "None") {
      root.setAttribute("data-festival", festivalTheme);
    } else {
      root.removeAttribute("data-festival");
    }

    // 3. Set AI Mood Overlays
    if (currentMood) {
      root.setAttribute("data-mood", currentMood);
    } else {
      root.removeAttribute("data-mood");
    }

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [themeMode, festivalTheme, currentMood]);

  return <>{children}</>;
}
