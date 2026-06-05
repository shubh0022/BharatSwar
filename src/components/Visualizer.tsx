"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const { isPlaying, activeTrack, visualizerOn } = useStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visualizerOn) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle resizing
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = (rect?.width || 300) * window.devicePixelRatio;
      canvas.height = (rect?.height || 80) * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Try setting up Web Audio API on client
    const setupAudioAnalysis = () => {
      const audio = (window as any).__bharatSwarAudio as HTMLAudioElement;
      if (!audio || audioContextRef.current) return;

      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64; // Small fft for simple visualizer bars

        // Media element source connection (frequently blocked by CORS for external CDNs)
        const source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;
        sourceRef.current = source;
      } catch (err) {
        console.log("Web Audio API binding failed (CORS/Permissions). Using visual simulation.");
      }
    };

    // Attempt setup when user starts playing
    if (isPlaying) {
      setupAudioAnalysis();
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
    }

    // Animation variables
    const bufferLength = analyserRef.current?.frequencyBinCount || 32;
    const dataArray = new Uint8Array(bufferLength);
    let simPhase = 0;

    const render = () => {
      animationRef.current = requestAnimationFrame(render);

      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // Clear canvas with subtle trail
      ctx.fillStyle = "rgba(10, 10, 15, 0.2)";
      ctx.fillRect(0, 0, width, height);

      const isUsingRealData = analyserRef.current && isPlaying;
      if (isUsingRealData) {
        analyserRef.current!.getByteFrequencyData(dataArray);
      }

      // Draw bars
      const barWidth = (width / bufferLength) * 0.75;
      const barSpacing = (width / bufferLength) * 0.25;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        let barHeight = 0;

        if (isUsingRealData) {
          // Normalize height
          barHeight = (dataArray[i] / 255) * height * 0.85;
        } else if (isPlaying) {
          // Generative simulation using multiple sinusoids
          const wave1 = Math.sin(i * 0.3 + simPhase) * 0.4 + 0.6;
          const wave2 = Math.cos(i * 0.7 - simPhase * 1.5) * 0.3 + 0.3;
          barHeight = (wave1 + wave2) * height * 0.45;
        } else {
          // Idle state - flat wave with slight idle flutter
          barHeight = (Math.sin(i * 0.5 + simPhase * 0.2) * 2) + 4;
        }

        // Keep heights in range
        barHeight = Math.max(2, Math.min(barHeight, height - 10));

        // Create colorful gradient for each bar (Saffron to Gold to Teal/Purple)
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, "#FF6B35"); // Saffron
        gradient.addColorStop(0.5, "#F7C948"); // Gold
        gradient.addColorStop(1, "#00C9A7"); // Peacock Teal

        ctx.fillStyle = gradient;

        // Draw rounded bars
        const rx = x;
        const ry = height - barHeight;
        const rw = barWidth;
        const rh = barHeight;
        const radius = Math.min(rw / 2, 4);

        ctx.beginPath();
        ctx.moveTo(rx + radius, ry);
        ctx.lineTo(rx + rw - radius, ry);
        ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius);
        ctx.lineTo(rx + rw, ry + rh);
        ctx.lineTo(rx, ry + rh);
        ctx.lineTo(rx, ry + radius);
        ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
        ctx.closePath();
        ctx.fill();

        x += barWidth + barSpacing;
      }

      // Increment phase for simulated waving animation speed
      simPhase += 0.08;
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, activeTrack, visualizerOn]);

  if (!visualizerOn) return null;

  return (
    <div className="w-full h-full relative overflow-hidden rounded bg-black/40 border border-white/5">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute top-2 right-2 text-[10px] uppercase tracking-wider text-white/30 pointer-events-none select-none">
        {isPlaying ? "Live Frequency" : "Idle"}
      </div>
    </div>
  );
}
