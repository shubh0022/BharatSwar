"use client";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function Logo({ className = "", size = 40, showText = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6B35" /> {/* Saffron Orange */}
            <stop offset="100%" stopColor="#F7C948" /> {/* Turmeric Gold */}
          </linearGradient>
        </defs>

        {/* Outer Circle with Gradient */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="url(#logoGrad)"
          strokeWidth="4"
          className="drop-shadow-[0_0_8px_rgba(255,107,53,0.3)]"
        />

        {/* Central Saffron Dot */}
        <circle cx="50" cy="48" r="6" fill="#FF6B35" />

        {/* Golden Wave Path */}
        <path
          d="M 5 52 C 20 52, 22 25, 32 25 C 42 25, 40 70, 50 70 C 60 70, 58 25, 68 25 C 78 25, 80 52, 95 52"
          stroke="#F7C948"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Optional Brand Text (useful in Header/Sidebar) */}
      {showText && (
        <div className="flex flex-col">
          <h1 className="text-xl font-bold font-display tracking-wide bg-gradient-to-r from-accent-orange via-gold to-teal bg-clip-text text-transparent">
            BharatSwar
          </h1>
          <p className="text-[9px] text-white/40 tracking-widest font-mono uppercase mt-0.5">
            भारत स्वर
          </p>
        </div>
      )}
    </div>
  );
}
