"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSpotify } from "@/context/SpotifyContext";
import dynamic from "next/dynamic";

// Dynamically import MeshGradient to avoid SSR issues with WebGL
const MeshGradientRenderer = dynamic(
  () =>
    import("@mesh-gradient/react").then((mod) => mod.MeshGradient),
  { ssr: false }
);

export default function DynamicBackground() {
  const { track, meshColors, backgroundGradient } = useSpotify();
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

  const isPlaying = track?.isPlaying && track?.accentColor;

  return (
    <>
      {/* Base layer: dark gradient fallback (always present) */}
      <motion.div
        className="fixed inset-0 -z-10"
        initial={false}
        animate={{ background: backgroundGradient }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Mesh gradient layer: ALWAYS visible
          - When playing: slow animation (0.15 speed)
          - When not playing: static (0 speed) with default colors */}
      <div
        className="fixed inset-0 -z-10"
        style={{ opacity: 1 }}
      >
        <MeshGradientRenderer
          options={{
            colors: meshColors,
            seed: 7,
            animationSpeed: isPlaying ? 0.15 : 0,
            transition: true,
            transitionDuration: 2000,
          }}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
          }}
        />
      </div>

      {/* Ambient glow from accent color — only when playing */}
      {isPlaying && (
        <motion.div
          className="fixed -z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ duration: 1.5 }}
          style={{
            top: "0%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "120vw",
            height: "70vh",
            background: `radial-gradient(ellipse at center top, ${track.accentColor}22 0%, transparent 55%)`,
            filter: "blur(80px)",
          }}
        />
      )}

      {/* Subtle noise/grid overlay */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          opacity: 0.04,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />
    </>
  );
}
