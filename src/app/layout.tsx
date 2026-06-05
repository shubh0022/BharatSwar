import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Noto_Sans } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "BharatSwar | Every song. Every language. Every era.",
  description: "Experience the world's most comprehensive Indian music platform. Supporting 110+ languages and eras from 1000 CE classical to 2026 hits, powered by an intelligent AI DJ.",
  keywords: ["Indian Music", "Classical Ragas", "Bollywood", "Ghazals", "Folk Music", "Multilingual", "BharatSwar"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${notoSans.variable}`}>
      <body className="animated-mesh-bg text-white font-body selection:bg-accent-orange/40 min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
