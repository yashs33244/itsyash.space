"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSpotify } from "@/context/SpotifyContext";

export default function DynamicBackground() {
  const { backgroundGradient, track } = useSpotify();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="fixed inset-0 -z-10 transition-all duration-1000"
        style={{
          background:
            "radial-gradient(ellipse at top, #0A0A1A 0%, #050508 50%, #020205 100%)",
        }}
      />
    );
  }

  return (
    <>
      {/* Main gradient background */}
      <motion.div
        className="fixed inset-0 -z-10"
        initial={false}
        animate={{
          background: backgroundGradient,
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Ambient glow effects */}
      {track?.isPlaying && track?.accentColor && (
      <motion.div
        className="fixed -z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        style={{
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          height: "80vh",
          background: `radial-gradient(ellipse at center, ${track.accentColor} 0%, transparent 60%)`,
          filter: "blur(70px)",
        }}
      />
      )}

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          opacity: 0.05,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />
    </>
  );
}
