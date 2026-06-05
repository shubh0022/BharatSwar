"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Phone, Mail, ArrowRight, Loader2 } from "lucide-react";

interface LoginScreenProps {
  onSuccess: (method: "google" | "phone" | "email" | "guest") => void;
}

const TAGLINES = [
  { text: "Every Song. Every Language. Every Era.", lang: "English" },
  { text: "हर गीत। हर भाषा। हर युग।", lang: "Hindi" },
  { text: "প্রতিটি গান। প্রতিটি ভাষা। প্রতিটি যুগ।", lang: "Bengali" },
  { text: "ஒவ்வொரு பாடலும். ஒவ்வொரு மொழியும். ஒவ்வொரு சகாப்தமும்।", lang: "Tamil" },
  { text: "ప్రతి పాట. ప్రతి భాష. ప్రతి యుగం.", lang: "Telugu" },
  { text: "ਹਰ ਗੀਤ। ਹਰ ਭਾਸ਼ਾ। ਹਰ ਯੁਗ।", lang: "Punjabi" },
  { text: "هر نغمہ۔ ہر زبان۔ ہر دور۔", lang: "Urdu" },
];

const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  opacity: Math.random() * 0.4 + 0.1,
  duration: Math.random() * 8 + 4,
  delay: Math.random() * 5,
  color: ["#FF6B35", "#F7C948", "#00C9A7", "#9333EA"][Math.floor(Math.random() * 4)],
}));

type AuthMode = "landing" | "phone" | "email" | "otp";

export default function LoginScreen({ onSuccess }: LoginScreenProps) {
  const [mode, setMode] = useState<AuthMode>("landing");
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [taglineFade, setTaglineFade] = useState(true);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState("");
  const [logoAnimated, setLogoAnimated] = useState(false);
  const [wavePhase, setWavePhase] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const animRef = useRef<number>();

  // Tagline rotator
  useEffect(() => {
    const cycle = () => {
      setTaglineFade(false);
      setTimeout(() => {
        setTaglineIdx((i) => (i + 1) % TAGLINES.length);
        setTaglineFade(true);
      }, 400);
    };
    const iv = setInterval(cycle, 3200);
    return () => clearInterval(iv);
  }, []);

  // Logo entrance
  useEffect(() => {
    const t = setTimeout(() => setLogoAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Live wave animation
  useEffect(() => {
    let startTime: number | null = null;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = (ts - startTime) / 1000;
      setWavePhase(elapsed);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const simulateAuth = (action: string, ms = 1800) => {
    setLoading(true);
    setLoadingAction(action);
    return new Promise<void>((resolve) => setTimeout(() => { setLoading(false); setLoadingAction(""); resolve(); }, ms));
  };

  const handleGoogle = async () => {
    await simulateAuth("Connecting to Google…");
    onSuccess("google");
  };

  const handlePhoneSubmit = async () => {
    if (phone.length < 10) return;
    await simulateAuth("Sending OTP…");
    setMode("otp");
  };

  const handleEmailSubmit = async () => {
    if (!email || !password) return;
    await simulateAuth("Signing in…");
    onSuccess("email");
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleOtpSubmit = async () => {
    if (otp.some((d) => d === "")) return;
    await simulateAuth("Verifying…");
    onSuccess("phone");
  };

  // SVG animated waveform logo path
  const getWavePath = (phase: number) => {
    const pts: string[] = [];
    const W = 200, H = 80, mid = H / 2;
    const amplitudes = [28, 18, 12, 22, 16, 8];
    const freqs = [2.2, 3.5, 5, 1.8, 4, 6.5];
    const phases = [0, 1.2, 2.4, 0.6, 1.8, 3.0];
    for (let x = 0; x <= W; x += 2) {
      let y = mid;
      for (let h = 0; h < amplitudes.length; h++) {
        const amp = amplitudes[h] * (1 - Math.abs(x - W / 2) / W);
        y += amp * Math.sin(freqs[h] * (x / W) * Math.PI * 2 + phase * 0.8 + phases[h]);
      }
      pts.push(`${x === 0 ? "M" : "L"} ${x},${y}`);
    }
    return pts.join(" ");
  };

  const wavePath = getWavePath(wavePhase);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#05050A]">
      {/* Animated Particles Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              opacity: p.opacity,
              animation: `float-particle ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>

      {/* Radial Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[#FF6B35]/6 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#00C9A7]/5 blur-[100px]" />
        <div className="absolute top-[30%] left-[50%] w-[40vw] h-[40vw] rounded-full bg-[#F7C948]/4 blur-[90px] -translate-x-1/2" />
      </div>

      {/* Left Panel — Branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-col items-center justify-center w-1/2 relative px-16 gap-10">
        {/* Animated Live Logo */}
        <div
          className="relative flex flex-col items-center gap-6"
          style={{
            opacity: logoAnimated ? 1 : 0,
            transform: logoAnimated ? "translateY(0) scale(1)" : "translateY(30px) scale(0.92)",
            transition: "all 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* SVG Logo Mark */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" fill="none">
              {/* Outer Chakra ring */}
              <circle cx="100" cy="100" r="90" stroke="url(#chakraGrad)" strokeWidth="2" opacity="0.6" />
              {/* Inner glow ring */}
              <circle cx="100" cy="100" r="80" stroke="url(#innerGrad)" strokeWidth="0.8" opacity="0.3" strokeDasharray="4 8" />
              {/* Spoke lines (Ashoka-inspired) */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x1 = 100 + 65 * Math.cos(angle);
                const y1 = 100 + 65 * Math.sin(angle);
                const x2 = 100 + 82 * Math.cos(angle);
                const y2 = 100 + 82 * Math.sin(angle);
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="url(#chakraGrad)" strokeWidth="1.5" opacity="0.4" />
                );
              })}

              {/* Center Sound Wave */}
              <g clipPath="url(#waveClip)">
                <path d={wavePath} stroke="url(#waveGrad)" strokeWidth="3" fill="none"
                  strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <clipPath id="waveClip">
                <circle cx="100" cy="100" r="62" />
              </clipPath>

              {/* Center dot — Sa (first swara) */}
              <circle cx="100" cy="100" r="5" fill="#FF6B35">
                <animate attributeName="r" values="4;7;4" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.6;1" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx="100" cy="100" r="14" stroke="#FF6B35" strokeWidth="1" fill="none" opacity="0.2">
                <animate attributeName="r" values="12;20;12" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="2.4s" repeatCount="indefinite" />
              </circle>

              <defs>
                <linearGradient id="chakraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B35" />
                  <stop offset="50%" stopColor="#F7C948" />
                  <stop offset="100%" stopColor="#00C9A7" />
                </linearGradient>
                <linearGradient id="innerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F7C948" />
                  <stop offset="100%" stopColor="#00C9A7" />
                </linearGradient>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6B35" />
                  <stop offset="40%" stopColor="#F7C948" />
                  <stop offset="100%" stopColor="#00C9A7" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Wordmark */}
          <div className="text-center">
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-[#FF6B35] via-[#F7C948] to-[#00C9A7] bg-clip-text text-transparent leading-none">
              BharatSwar
            </h1>
            <p className="mt-1 text-xl font-light text-white/50 tracking-[0.3em]">भारत स्वर</p>
          </div>

          {/* Rotating Tagline */}
          <div className="text-center h-12 flex flex-col items-center justify-center">
            <p
              className="text-base text-white/60 font-light transition-all duration-400"
              style={{ opacity: taglineFade ? 1 : 0, transform: taglineFade ? "translateY(0)" : "translateY(6px)" }}
            >
              {TAGLINES[taglineIdx].text}
            </p>
            <span className="text-xs text-white/25 mt-1 uppercase tracking-widest">{TAGLINES[taglineIdx].lang}</span>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="flex gap-8 mt-4"
          style={{
            opacity: logoAnimated ? 1 : 0,
            transition: "opacity 1.2s 0.5s ease",
          }}
        >
          {[
            { value: "110+", label: "Languages" },
            { value: "5000", label: "Years of Heritage" },
            { value: "50M+", label: "Songs" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black text-[#FF6B35]">{s.value}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Waveform decoration at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20">
          <svg viewBox="0 0 800 96" className="w-full h-full" preserveAspectRatio="none">
            <path d={`M 0,48 ${Array.from({ length: 40 }).map((_, i) => {
              const x = (i / 39) * 800;
              const y = 48 + Math.sin(wavePhase * 0.8 + i * 0.5) * 24 + Math.sin(wavePhase * 1.5 + i * 0.8) * 12;
              return `L ${x},${y}`;
            }).join(" ")} L 800,96 L 0,96 Z`}
              fill="url(#bgWaveGrad)" />
            <defs>
              <linearGradient id="bgWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#F7C948" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00C9A7" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Right Panel — Auth Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:px-8 relative z-10">
        <div
          className="w-full max-w-md"
          style={{
            opacity: logoAnimated ? 1 : 0,
            transform: logoAnimated ? "translateX(0)" : "translateX(20px)",
            transition: "all 0.9s 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Mobile logo (shown only on mobile) */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="relative w-20 h-20 flex items-center justify-center mb-3">
              <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
                <circle cx="100" cy="100" r="90" stroke="url(#mChakraGrad)" strokeWidth="3" opacity="0.7" />
                <g clipPath="url(#mWaveClip)">
                  <path d={wavePath} stroke="url(#mWaveGrad)" strokeWidth="4" fill="none" strokeLinecap="round" />
                </g>
                <clipPath id="mWaveClip"><circle cx="100" cy="100" r="62" /></clipPath>
                <circle cx="100" cy="100" r="5" fill="#FF6B35">
                  <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
                </circle>
                <defs>
                  <linearGradient id="mChakraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B35" />
                    <stop offset="100%" stopColor="#00C9A7" />
                  </linearGradient>
                  <linearGradient id="mWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF6B35" />
                    <stop offset="100%" stopColor="#00C9A7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-[#FF6B35] via-[#F7C948] to-[#00C9A7] bg-clip-text text-transparent">
              BharatSwar
            </h1>
            <p className="text-sm text-white/40 mt-1">भारत स्वर</p>
          </div>

          {/* Glass Auth Card */}
          <div className="glass-panel rounded-3xl p-8 border border-white/[0.06] shadow-2xl">
            {/* Modes */}
            {mode === "landing" && (
              <LandingMode
                onGoogle={handleGoogle}
                onPhone={() => setMode("phone")}
                onEmail={() => setMode("email")}
                onGuest={() => onSuccess("guest")}
                loading={loading}
                loadingAction={loadingAction}
              />
            )}
            {mode === "phone" && (
              <PhoneMode
                phone={phone}
                setPhone={setPhone}
                onSubmit={handlePhoneSubmit}
                onBack={() => setMode("landing")}
                loading={loading}
                loadingAction={loadingAction}
              />
            )}
            {mode === "email" && (
              <EmailMode
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onSubmit={handleEmailSubmit}
                onBack={() => setMode("landing")}
                loading={loading}
                loadingAction={loadingAction}
              />
            )}
            {mode === "otp" && (
              <OtpMode
                phone={phone}
                otp={otp}
                otpRefs={otpRefs}
                onChange={handleOtpChange}
                onSubmit={handleOtpSubmit}
                onBack={() => setMode("phone")}
                loading={loading}
                loadingAction={loadingAction}
              />
            )}
          </div>

          <p className="text-center text-xs text-white/20 mt-6 px-4">
            By continuing, you agree to BharatSwar&apos;s{" "}
            <span className="text-white/40 underline cursor-pointer hover:text-[#FF6B35] transition-colors">Terms of Service</span>{" "}
            and{" "}
            <span className="text-white/40 underline cursor-pointer hover:text-[#FF6B35] transition-colors">Privacy Policy</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float-particle {
          from { transform: translateY(0px) translateX(0px); }
          to { transform: translateY(-20px) translateX(10px); }
        }
      `}</style>
    </div>
  );
}

// ——— Sub-components ———

function LandingMode({
  onGoogle, onPhone, onEmail, onGuest, loading, loadingAction,
}: {
  onGoogle: () => void; onPhone: () => void; onEmail: () => void; onGuest: () => void;
  loading: boolean; loadingAction: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
        <p className="text-sm text-white/45 mt-1">Sign in to your BharatSwar account</p>
      </div>

      {/* Google */}
      <AuthButton
        id="btn-google-login"
        onClick={onGoogle}
        loading={loading && loadingAction.includes("Google")}
        disabled={loading}
        variant="outline"
        icon={
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        }
      >
        {loading && loadingAction.includes("Google") ? loadingAction : "Continue with Google"}
      </AuthButton>

      {/* Phone */}
      <AuthButton
        id="btn-phone-login"
        onClick={onPhone}
        loading={false}
        disabled={loading}
        variant="outline"
        icon={<Phone className="w-4.5 h-4.5 text-[#00C9A7]" />}
      >
        Continue with Phone
      </AuthButton>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-xs text-white/30 uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      {/* Email */}
      <AuthButton
        id="btn-email-login"
        onClick={onEmail}
        loading={false}
        disabled={loading}
        variant="ghost"
        icon={<Mail className="w-4.5 h-4.5 text-[#F7C948]" />}
      >
        Continue with Email
      </AuthButton>

      {/* Guest */}
      <button
        id="btn-guest-login"
        onClick={onGuest}
        disabled={loading}
        className="w-full text-sm text-white/35 hover:text-white/60 transition-colors duration-200 py-2 cursor-pointer"
      >
        Explore as Guest →
      </button>
    </div>
  );
}

function PhoneMode({
  phone, setPhone, onSubmit, onBack, loading, loadingAction,
}: {
  phone: string; setPhone: (v: string) => void; onSubmit: () => void;
  onBack: () => void; loading: boolean; loadingAction: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      <BackHeader onBack={onBack} title="Phone Sign In" subtitle="We'll send a 6-digit OTP to your number" />

      <div className="flex gap-2">
        <div className="glass-input rounded-xl px-3 py-3.5 text-sm text-white/70 border border-white/8 shrink-0 flex items-center gap-1">
          🇮🇳 +91
        </div>
        <input
          id="input-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          placeholder="Mobile Number"
          className="flex-1 glass-input rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/25 w-full"
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        />
      </div>

      <AuthButton
        id="btn-send-otp"
        onClick={onSubmit}
        loading={loading}
        disabled={phone.length < 10 || loading}
        variant="primary"
        icon={loading ? undefined : <ArrowRight className="w-4 h-4" />}
        iconRight
      >
        {loading ? loadingAction : "Send OTP"}
      </AuthButton>
    </div>
  );
}

function EmailMode({
  email, setEmail, password, setPassword, showPassword, setShowPassword,
  onSubmit, onBack, loading, loadingAction,
}: {
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  showPassword: boolean; setShowPassword: (v: boolean) => void;
  onSubmit: () => void; onBack: () => void; loading: boolean; loadingAction: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      <BackHeader onBack={onBack} title="Email Sign In" subtitle="Enter your credentials to continue" />

      <input
        id="input-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="glass-input rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/25 w-full"
      />

      <div className="relative">
        <input
          id="input-password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="glass-input rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder:text-white/25 w-full"
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="text-right">
        <button className="text-xs text-[#FF6B35]/80 hover:text-[#FF6B35] transition-colors">Forgot password?</button>
      </div>

      <AuthButton
        id="btn-email-submit"
        onClick={onSubmit}
        loading={loading}
        disabled={!email || !password || loading}
        variant="primary"
        icon={loading ? undefined : <ArrowRight className="w-4 h-4" />}
        iconRight
      >
        {loading ? loadingAction : "Sign In"}
      </AuthButton>

      <p className="text-center text-xs text-white/30">
        Don&apos;t have an account?{" "}
        <span className="text-[#FF6B35] cursor-pointer hover:underline">Create one free</span>
      </p>
    </div>
  );
}

function OtpMode({
  phone, otp, otpRefs, onChange, onSubmit, onBack, loading, loadingAction,
}: {
  phone: string; otp: string[];
  otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onChange: (idx: number, val: string) => void;
  onSubmit: () => void; onBack: () => void; loading: boolean; loadingAction: string;
}) {
  const [resendCountdown, setResendCountdown] = useState(30);
  useEffect(() => {
    if (resendCountdown === 0) return;
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  return (
    <div className="flex flex-col gap-6">
      <BackHeader onBack={onBack} title="Enter OTP" subtitle={`Sent to +91 ${phone}`} />

      <div className="flex gap-2 justify-center">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => { otpRefs.current[idx] = el; }}
            id={`otp-input-${idx}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => onChange(idx, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !otp[idx] && idx > 0) {
                otpRefs.current[idx - 1]?.focus();
              }
            }}
            className={`w-12 h-14 text-center text-xl font-bold rounded-xl border transition-all duration-200 outline-none
              ${digit
                ? "bg-[#FF6B35]/15 border-[#FF6B35]/60 text-white"
                : "glass-input border-white/10 text-white"
              }
              focus:border-[#FF6B35] focus:bg-[#FF6B35]/10 focus:shadow-[0_0_15px_rgba(255,107,53,0.2)]`}
          />
        ))}
      </div>

      <AuthButton
        id="btn-verify-otp"
        onClick={onSubmit}
        loading={loading}
        disabled={otp.some((d) => d === "") || loading}
        variant="primary"
      >
        {loading ? loadingAction : "Verify & Continue"}
      </AuthButton>

      <div className="text-center text-sm text-white/35">
        {resendCountdown > 0 ? (
          <span>Resend OTP in {resendCountdown}s</span>
        ) : (
          <button
            onClick={() => setResendCountdown(30)}
            className="text-[#FF6B35] hover:underline"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}

function BackHeader({ onBack, title, subtitle }: { onBack: () => void; title: string; subtitle: string }) {
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 mb-4 transition-colors cursor-pointer group"
      >
        <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="text-sm text-white/40 mt-1">{subtitle}</p>
    </div>
  );
}

function AuthButton({
  id, children, onClick, loading, disabled, variant, icon, iconRight,
}: {
  id: string; children: React.ReactNode; onClick: () => void;
  loading: boolean; disabled: boolean;
  variant: "primary" | "outline" | "ghost";
  icon?: React.ReactNode; iconRight?: boolean;
}) {
  const base = `relative w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl text-sm font-semibold
    transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`;

  const variants = {
    primary: `bg-gradient-to-r from-[#FF6B35] to-[#E55A25] text-white shadow-lg shadow-[#FF6B35]/20
      hover:shadow-xl hover:shadow-[#FF6B35]/30 hover:scale-[1.02] active:scale-[0.98]`,
    outline: `border border-white/10 text-white/80 hover:bg-white/5 hover:border-white/20 hover:text-white active:scale-[0.98]`,
    ghost: `text-white/60 hover:text-white hover:bg-white/5 active:scale-[0.98]`,
  };

  return (
    <button id={id} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]}`}>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {!iconRight && icon}
          <span>{children}</span>
          {iconRight && icon}
        </>
      )}
    </button>
  );
}
