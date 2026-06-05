"use client";

import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  /** Use 'mark' for just the circular icon, 'full' for the complete logo with wordmark */
  variant?: "mark" | "full";
}

export default function Logo({
  className = "",
  size = 40,
  showText = false,
  variant = "mark",
}: LogoProps) {
  if (variant === "full") {
    // Full logo: use the complete SVG (icon + wordmark + devanagari + tagline)
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Image
          src="/bharatswar-logo.svg"
          alt="BharatSwar — भारत स्वर"
          width={size * 4}
          height={size * 4}
          className="object-contain"
          priority
        />
      </div>
    );
  }

  // variant === "mark" — just the circular waveform icon
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Circular logo mark — matches uploaded logo exactly */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        aria-label="BharatSwar logo mark"
      >
        <defs>
          <linearGradient id="bsRingGrad" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF5500" />
            <stop offset="100%" stopColor="#FFBB00" />
          </linearGradient>
          <linearGradient id="bsWaveGrad" x1="10" y1="0" x2="90" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFB800" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFB800" />
          </linearGradient>
        </defs>

        {/* Outer ring — open at bottom like the uploaded logo */}
        <circle
          cx="50"
          cy="48"
          r="40"
          stroke="url(#bsRingGrad)"
          strokeWidth="4.5"
          fill="none"
          strokeDasharray="210 48"
          strokeDashoffset="-24"
          strokeLinecap="round"
        />

        {/* M-shaped waveform — matches the uploaded logo's waveform shape */}
        {/* Left flat → dip → left hump → center valley with dot → right hump → dip → right flat */}
        <path
          d="M 10,48
             L 20,48
             Q 23,48 25,52
             L 29,62
             Q 31,68 34,62
             L 38,36
             Q 40,28 43,36
             L 46,46
             Q 48,50 50,48
             Q 52,50 54,46
             L 57,36
             Q 60,28 62,36
             L 66,62
             Q 69,68 71,62
             L 75,52
             Q 77,48 80,48
             L 90,48"
          stroke="url(#bsWaveGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Center Sa dot — orange, sits in the valley of the waveform */}
        <circle cx="50" cy="48" r="5.5" fill="#FF5500" />
        {/* Subtle glow ring around dot */}
        <circle cx="50" cy="48" r="8" fill="#FF5500" opacity="0.15" />
      </svg>

      {/* Optional Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className="text-xl font-bold font-display tracking-wide leading-none">
            <span className="text-white">Bharat</span>
            <span className="text-[#FF5500]">S</span>
            <span className="text-white">war</span>
          </h1>
          <p className="text-[9px] text-[#FFB800]/70 tracking-widest font-mono uppercase mt-0.5">
            भारत स्वर
          </p>
        </div>
      )}
    </div>
  );
}
