import type { Metadata } from "next";
import { Lora, Assistant } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Yash Singh",
  description:
    "AI-Fueled Full-Stack Engineer | Built Different. Ships Faster. SDE at Binocs, Bangalore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${assistant.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
