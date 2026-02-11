import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SpotifyProvider } from "@/context/SpotifyContext";
import DynamicBackground from "@/components/DynamicBackground";

/* ─── Fonts ──────────────────────────────────────── */

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
});

/* ─── Metadata ───────────────────────────────────── */

export const metadata: Metadata = {
  metadataBase: new URL("https://itsyash.space"),
  title: "Yash Singh — Software Engineer",
  description:
    "Software engineer building infrastructure, designing systems, and shipping production-grade software. Focused on developer tooling, full-stack architecture, and things that work at scale.",
  keywords: [
    "Yash Singh",
    "Software Engineer",
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Infrastructure",
    "Systems Design",
  ],
  authors: [{ name: "Yash Singh", url: "https://itsyash.space" }],
  creator: "Yash Singh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://itsyash.space",
    siteName: "Yash Singh",
    title: "Yash Singh — Software Engineer",
    description:
      "Building infrastructure, designing systems, and shipping production-grade software.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yash Singh — Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yash Singh — Software Engineer",
    description:
      "Building infrastructure, designing systems, and shipping production-grade software.",
    images: ["/og-image.png"],
    creator: "@yashsingh",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/* ─── Theme Color ────────────────────────────────── */

export const viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
};

/* ─── Layout ─────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-body text-txt antialiased"
        style={{
          color: "#EDEDF0",
        }}
      >
        <SpotifyProvider>
          {/* Noise overlay — sits above everything visually but passes through pointer events */}
          <div className="noise" aria-hidden="true" />

          {/* Dynamic background */}
          <DynamicBackground />

          {/* Navigation */}
          <Navbar />

          {/* Main content */}
          <main id="main-content">{children}</main>
        </SpotifyProvider>
      </body>
    </html>
  );
}
