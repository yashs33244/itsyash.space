import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://itsyash.space"),
  title: "Yash Singh — Systems Engineer",
  description:
    "Systems engineer building production infrastructure, LLM pipelines, and real-time applications at scale. SDE Intern at Binocs, Bangalore.",
  keywords: [
    "Yash Singh",
    "Systems Engineer",
    "Software Engineer",
    "Kubernetes",
    "Docker",
    "Python",
    "TypeScript",
    "React",
    "Next.js",
    "LLM",
    "Infrastructure",
    "Binocs",
    "IIIT Una",
  ],
  authors: [{ name: "Yash Singh" }],
  openGraph: {
    title: "Yash Singh — Systems Engineer",
    description:
      "Building production systems that scale. SDE Intern at Binocs, Bangalore.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yash Singh — Systems Engineer",
    description:
      "Building production systems that scale. SDE Intern at Binocs, Bangalore.",
  },
  robots: { index: true, follow: true },
  other: {
    "theme-color": "#050508",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${syne.variable} ${jakarta.variable} ${jetbrains.variable} antialiased noise`}
      >
        {children}
      </body>
    </html>
  );
}
