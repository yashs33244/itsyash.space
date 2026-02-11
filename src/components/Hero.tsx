"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpotify } from "@/context/SpotifyContext";

const taglines = [
  "Engineer. Photographer. Problem Solver.",
  "Building production systems that don't break",
  "From Kubernetes clusters to pixel-perfect UIs",
];

const nameTop = "YASH";
const nameBottom = "SINGH";

const letterVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.3 + i * 0.06,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const badges = [
  "4th Year IIIT Una",
  "SDE @ Binocs",
  "K8s + AWS + Go",
];

export default function Hero() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const { track } = useSpotify();

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const allLetters = [...nameTop];
  const allLettersBottom = [...nameBottom];

  // Build a CSS gradient string that uses the dynamic accent
  // The gradient sweeps across YASH SINGH as one unit
  const isPlaying = track?.isPlaying && track?.accentColor;
  const accent = track?.accentColor || "#00E5FF";

  // Lighten the accent color for a nice shimmer
  const shimmerColor = useMemo(() => {
    // Mix accent with white for a lighter variant
    const r = parseInt(accent.slice(1, 3), 16);
    const g = parseInt(accent.slice(3, 5), 16);
    const b = parseInt(accent.slice(5, 7), 16);
    const lr = Math.min(255, r + Math.floor((255 - r) * 0.5));
    const lg = Math.min(255, g + Math.floor((255 - g) * 0.5));
    const lb = Math.min(255, b + Math.floor((255 - b) * 0.5));
    return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
  }, [accent]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-dot-grid"
    >
      {/* Radial gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgb(var(--accent-rgb) / 0.12) 0%, transparent 70%)",
        }}
      />

      {/* SEO h1 */}
      <h1 className="sr-only">Yash Singh — Software Engineer</h1>

      <div className="relative z-10 flex flex-col items-center gap-0 px-4">
        {/* Name Block */}
        <div className="flex flex-col items-center select-none">
          {/* Inject a dynamic style tag for the gradient animation */}
          <style>{`
            @keyframes hero-gradient-shift {
              0%   { background-position: 0% 50%; }
              50%  { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .hero-gradient-text {
              background: linear-gradient(
                90deg,
                #EDEDF0 0%,
                ${isPlaying ? shimmerColor : "#C0C0D0"} 25%,
                ${isPlaying ? accent : "#8E8EA0"} 50%,
                ${isPlaying ? shimmerColor : "#C0C0D0"} 75%,
                #EDEDF0 100%
              );
              background-size: 300% 100%;
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              animation: hero-gradient-shift ${isPlaying ? "4s" : "8s"} ease infinite;
              transition: background 1.5s ease;
            }
          `}</style>

          {/* YASH */}
          <div className="flex overflow-hidden" aria-hidden="true">
            {allLetters.map((char, i) => (
              <motion.span
                key={`top-${i}`}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="hero-gradient-text font-display font-bold tracking-[-0.04em] leading-[0.85] text-[clamp(5rem,15vw,13rem)]"
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* SINGH */}
          <div
            className="flex overflow-hidden -mt-2 md:-mt-4"
            aria-hidden="true"
          >
            {allLettersBottom.map((char, i) => (
              <motion.span
                key={`bot-${i}`}
                custom={i + allLetters.length}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="hero-gradient-text font-display font-bold tracking-[-0.04em] leading-[0.85] text-[clamp(5rem,15vw,13rem)]"
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Rotating Tagline */}
        <motion.div
          custom={1.4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-8 md:mt-12 h-8 flex items-center justify-center overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={taglineIndex}
              initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-mono text-sm md:text-base tracking-wide"
              style={{ color: "var(--txt-secondary, #8E8EA0)" }}
            >
              {taglines[taglineIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Horizontal Line with Pulsing Dot */}
        <motion.div
          custom={1.8}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10 md:mt-14 flex items-center gap-0 w-full max-w-xs md:max-w-md"
        >
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "#161624" }}
          />
          <span className="relative flex h-2.5 w-2.5 ml-1">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{ backgroundColor: "var(--accent)" }}
            />
          </span>
        </motion.div>

        {/* Stat Badges */}
        <motion.div
          custom={2.2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10 md:mt-14 flex flex-wrap items-center justify-center gap-3"
        >
          {badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center rounded-full border px-4 py-1.5 font-mono text-xs tracking-wider transition-all duration-500"
              style={{
                borderColor: "#161624",
                color: "#8E8EA0",
                backgroundColor: "rgba(10,10,18,0.6)",
              }}
            >
              {badge}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span
          className="font-mono text-[10px] uppercase tracking-[0.25em]"
          style={{ color: "#5C5C6F" }}
        >
          scroll
        </span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ y: [0, 5, 0] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path
            d="M3 6L8 11L13 6"
            stroke="#5C5C6F"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
    </section>
  );
}
