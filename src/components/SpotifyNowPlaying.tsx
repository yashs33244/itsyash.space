"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Music } from "lucide-react";

interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumArt?: string;
}

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchNowPlaying = useCallback(async () => {
    try {
      const res = await fetch("/api/spotify", { cache: "no-store" });
      if (!res.ok) {
        setError(true);
        return;
      }
      const json: SpotifyData = await res.json();
      setData(json);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNowPlaying();

    const interval = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(interval);
  }, [fetchNowPlaying]);

  // Audio bars component
  const AudioBars = () => (
    <div className="flex items-end gap-[2px] h-3">
      <span
        className="w-[3px] bg-accent rounded-full animate-audio-bar"
        style={{ backgroundColor: "#00E5FF", animationDelay: "0ms" }}
      />
      <span
        className="w-[3px] bg-accent rounded-full animate-audio-bar"
        style={{ backgroundColor: "#00E5FF", animationDelay: "200ms" }}
      />
      <span
        className="w-[3px] bg-accent rounded-full animate-audio-bar"
        style={{ backgroundColor: "#00E5FF", animationDelay: "400ms" }}
      />
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center gap-3 p-3">
        <div
          className="w-[64px] h-[64px] rounded-lg bg-bg-elevated animate-pulse"
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
      <div className="flex items-center gap-3 p-3">
        <div
          className="w-[64px] h-[64px] rounded-lg bg-bg-elevated flex items-center justify-center"
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
      </div>
    );
  }

  // Playing state
  return (
    <div className="flex items-center gap-3 p-3">
      {/* Album Art */}
      {data.albumArt ? (
        <Image
          src={data.albumArt}
          alt={`${data.title} album art`}
          width={64}
          height={64}
          className="rounded-lg object-cover shrink-0"
          unoptimized
        />
      ) : (
        <div
          className="w-[64px] h-[64px] rounded-lg bg-bg-elevated flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#10101C" }}
        >
          <Music size={20} className="text-accent" style={{ color: "#00E5FF" }} />
        </div>
      )}

      {/* Track Info */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <AudioBars />
          <span
            className="font-mono text-[10px] uppercase tracking-wider text-accent"
            style={{ color: "#00E5FF" }}
          >
            Now Playing
          </span>
        </div>
        <p
          className="font-body text-sm text-txt truncate leading-tight"
          style={{ color: "#EDEDF0" }}
          title={data.title}
        >
          {data.title}
        </p>
        <p
          className="font-body text-xs text-txt-secondary truncate leading-tight"
          style={{ color: "#8E8EA0" }}
          title={data.artist}
        >
          {data.artist}
        </p>
      </div>
    </div>
  );
}
