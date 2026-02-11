"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Disc3, ExternalLink } from "lucide-react";
import { useSpotify } from "@/context/SpotifyContext";
import { createPortal } from "react-dom";

interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumArt?: string;
  dominantColor?: string;
}

// Animated audio visualizer bars
function AudioVisualizer({ isPlaying, color = "#00E5FF" }: { isPlaying: boolean; color?: string }) {
  return (
    <div className="flex items-end gap-[3px] h-6">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full"
          style={{ backgroundColor: color }}
          animate={
            isPlaying
              ? {
                  height: ["20%", "100%", "40%", "80%", "30%"],
                }
              : { height: "20%" }
          }
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setTrack, track } = useSpotify();

  const fetchNowPlaying = useCallback(async () => {
    try {
      const res = await fetch("/api/spotify", { cache: "no-store" });
      if (!res.ok) {
        setError(true);
        return;
      }
      const json: SpotifyData = await res.json();
      setData(json);
      
      // Update global track context
      if (json.isPlaying && json.title && json.artist) {
        setTrack(json);
      } else {
        // Still update with offline status
        setTrack({ isPlaying: false });
      }
      
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [setTrack]);

  useEffect(() => {
    setMounted(true);
    fetchNowPlaying();

    const interval = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(interval);
  }, [fetchNowPlaying]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center gap-5 p-5">
        <div
          className="w-[88px] h-[88px] rounded-xl bg-bg-elevated animate-pulse"
          style={{ backgroundColor: "#10101C" }}
        />
        <div className="flex flex-col gap-2">
          <div
            className="w-24 h-3 rounded bg-bg-elevated animate-pulse"
            style={{ backgroundColor: "#10101C" }}
          />
          <div
            className="w-16 h-2.5 rounded bg-bg-elevated animate-pulse"
            style={{ backgroundColor: "#10101C" }}
          />
        </div>
      </div>
    );
  }

  // Error or offline state
  if (error || !data || !data.isPlaying) {
    return (
      <motion.div 
        className="flex items-center gap-5 p-5 opacity-60"
        whileHover={{ opacity: 1 }}
      >
        <div
          className="w-[88px] h-[88px] rounded-xl bg-bg-elevated flex items-center justify-center"
          style={{ backgroundColor: "#10101C" }}
        >
          <Music
            size={20}
            className="text-txt-muted"
            style={{ color: "#5C5C6F" }}
          />
        </div>
        <div className="flex flex-col">
          <span
            className="font-mono text-xs text-txt-muted"
            style={{ color: "#5C5C6F" }}
          >
            Spotify
          </span>
          <span
            className="font-mono text-sm text-txt-secondary"
            style={{ color: "#8E8EA0" }}
          >
            Offline
          </span>
        </div>
      </motion.div>
    );
  }

  const accentColor = track?.accentColor || "#00E5FF";

  // Playing state - Compact
  if (!expanded) {
    return (
      <motion.div
        layoutId="spotify-widget"
        className="flex items-center gap-5 p-5 cursor-pointer group"
        onClick={() => setExpanded(true)}
      >
        {/* Album Art */}
        <div className="relative">
          <div 
            className="relative w-[88px] h-[88px] rounded-xl overflow-hidden"
            style={{ boxShadow: `0 0 20px ${accentColor}30` }}
          >
            {data.albumArt ? (
              <Image
                src={data.albumArt}
                alt={`${data.title} album art`}
                width={88}
                height={88}
                className="object-cover"
                unoptimized
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: "#10101C" }}
              >
                <Music size={24} style={{ color: accentColor }} />
              </div>
            )}
          </div>
        </div>

        {/* Track Info */}
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
            className="font-mono text-xs uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            Now Playing
          </span>
        </div>
        <p
          className="font-body text-base text-txt truncate leading-tight"
          style={{ color: "#EDEDF0" }}
          title={data.title}
        >
          {data.title}
        </p>
        <p
          className="font-body text-sm text-txt-secondary truncate leading-tight"
          style={{ color: "#8E8EA0" }}
          title={data.artist}
        >
          {data.artist}
        </p>
        </div>
      </motion.div>
    );
  }

  if (!mounted) {
    return null;
  }

  const expandedView = (
    <motion.div
      layoutId="spotify-widget"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(5, 5, 8, 0.95)" }}
      onClick={() => setExpanded(false)}
    >
      <motion.div
        className="relative max-w-md w-full rounded-3xl overflow-hidden"
        style={{
          backgroundColor: "#0A0A12",
          border: `1px solid ${accentColor}30`,
        }}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 50 }}
        animate={{ y: 0 }}
      >
        <div
          className="absolute inset-0 opacity-30 blur-3xl"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${accentColor} 0%, transparent 70%)`,
          }}
        />

        <div className="relative p-8">
          <button
            onClick={() => setExpanded(false)}
            className="absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 hover:bg-white/10"
          >
            <span className="sr-only">Close</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="relative mx-auto w-64 h-64 mb-8">
            <div
              className="absolute inset-0 rounded-full opacity-30 blur-xl"
              style={{ backgroundColor: accentColor }}
            />
            <div
              className="relative w-full h-full rounded-2xl overflow-hidden"
              style={{ boxShadow: `0 20px 60px ${accentColor}40` }}
            >
              {data.albumArt ? (
                <Image
                  src={data.albumArt}
                  alt={`${data.title} album art`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: "#10101C" }}
                >
                  <Disc3 size={64} style={{ color: accentColor }} />
                </div>
              )}
            </div>
          </div>

          <div className="text-center mb-6">
            <motion.div
              className="flex items-center justify-center gap-2 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span
                className="font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-full"
                style={{
                  color: accentColor,
                  backgroundColor: `${accentColor}15`,
                }}
              >
                Now Playing
              </span>
            </motion.div>
            <motion.h2
              className="font-display text-2xl font-semibold mb-1"
              style={{ color: "#EDEDF0" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {data.title}
            </motion.h2>
            <motion.p
              className="font-body text-base"
              style={{ color: "#8E8EA0" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {data.artist}
            </motion.p>
          </div>

          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <AudioVisualizer isPlaying={data.isPlaying} color={accentColor} />
          </motion.div>

          <motion.a
            href={`https://open.spotify.com/search/${encodeURIComponent(
              `${data.title} ${data.artist}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-body text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: `${accentColor}15`,
              color: accentColor,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ExternalLink size={16} />
            Open in Spotify
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(expandedView, document.body);
}
