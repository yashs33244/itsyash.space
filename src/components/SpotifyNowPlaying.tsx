"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Music, Pause } from "lucide-react";

interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumArt?: string;
  songUrl?: string;
}

function AudioBars() {
  return (
    <div className="flex items-end gap-[2px] h-3">
      {[0, 0.15, 0.3, 0.1].map((delay, i) => (
        <div
          key={i}
          className="w-[3px] bg-success rounded-full"
          style={{
            animation: `audio-bar 0.8s ease-in-out ${delay}s infinite`,
            height: "40%",
          }}
        />
      ))}
    </div>
  );
}

export function SpotifyNowPlaying() {
  const [data, setData] = useState<SpotifyData>({ isPlaying: false });

  useEffect(() => {
    const fetchSpotify = async () => {
      try {
        const res = await fetch("/api/spotify");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        setData({ isPlaying: false });
      }
    };
    fetchSpotify();
    const interval = setInterval(fetchSpotify, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      data-slot="spotify-now-playing"
      className="rounded-2xl border border-border bg-bg-surface hover:border-success/20 transition-all duration-500 p-5 h-full group"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
        <span className="font-mono text-xs text-text-muted">
          {data.isPlaying ? "Now Playing" : "Spotify"}
        </span>
        {data.isPlaying && (
          <div className="ml-auto">
            <AudioBars />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex items-center gap-3">
        {/* Album art / placeholder */}
        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-bg-elevated">
          {data.isPlaying && data.albumArt ? (
            <Image
              src={data.albumArt}
              alt={data.title || "Album art"}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {data.isPlaying ? (
                <Music size={18} className="text-success/50" />
              ) : (
                <Pause size={18} className="text-text-muted" />
              )}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {data.isPlaying && data.title ? (
            <>
              <a
                href={data.songUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text font-medium truncate block hover:text-success transition-colors"
              >
                {data.title}
              </a>
              <p className="text-xs text-text-muted font-mono truncate">
                {data.artist}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-text-secondary">Not playing</p>
              <p className="text-xs text-text-muted font-mono">
                Nothing right now
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
