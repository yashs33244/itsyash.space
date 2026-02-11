"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import {
  DEFAULTS,
  DEFAULT_MESH,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  generateLocalPalette,
  fetchGeminiPalette,
  applyPaletteToDom,
  type ThemePalette,
} from "@/lib/colorConfig";

export interface SpotifyTrack {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumArt?: string;
  accentColor?: string;
  dominantColor?: string;
}

interface SpotifyContextType {
  track: SpotifyTrack | null;
  setTrack: (track: SpotifyTrack) => void;
  backgroundGradient: string;
  meshColors: [string, string, string, string];
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

// ─── Genre-based fallback color map ─────────────────────────────

const genreColorMap: Record<string, string> = {
  pop: "#FF6B9D",
  rock: "#FF4757",
  electronic: "#00E5FF",
  edm: "#00E5FF",
  hip: "#FFD700",
  rap: "#FFD700",
  jazz: "#DDA0DD",
  classical: "#F5DEB3",
  indie: "#98D8C8",
  rnb: "#E6A8D7",
  soul: "#E6A8D7",
  metal: "#8B4513",
  country: "#DEB887",
  folk: "#D2691E",
  blues: "#4169E1",
  reggae: "#32CD32",
  latin: "#FF6347",
  kpop: "#FF69B4",
  lofi: "#8B9DC3",
  ambient: "#B0C4DE",
  house: "#7B68EE",
  techno: "#483D8B",
};

function getColorFromArtist(artist: string, title: string): string {
  const text = (artist + " " + title).toLowerCase();
  for (const [genre, color] of Object.entries(genreColorMap)) {
    if (text.includes(genre)) return color;
  }
  return DEFAULTS.accent;
}

// ─── Album art color extraction ─────────────────────────────────

async function extractDominantColor(imageUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 64;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }

      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);

      let total = 0;
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;

      let vividTotal = 0;
      let vividR = 0;
      let vividG = 0;
      let vividB = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 200) continue;

        total += 1;
        rSum += r;
        gSum += g;
        bSum += b;

        const { s, l } = rgbToHsl(r, g, b);
        if (s > 0.35 && l > 0.2 && l < 0.85) {
          vividTotal += 1;
          vividR += r;
          vividG += g;
          vividB += b;
        }
      }

      if (total === 0) {
        resolve(null);
        return;
      }

      if (vividTotal > 0) {
        resolve(
          rgbToHex(
            Math.round(vividR / vividTotal),
            Math.round(vividG / vividTotal),
            Math.round(vividB / vividTotal)
          )
        );
        return;
      }

      resolve(
        rgbToHex(
          Math.round(rSum / total),
          Math.round(gSum / total),
          Math.round(bSum / total)
        )
      );
    };

    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
}

// ─── Provider ───────────────────────────────────────────────────

export function SpotifyProvider({ children }: { children: ReactNode }) {
  const [track, setTrackState] = useState<SpotifyTrack | null>(null);
  const [backgroundGradient, setBackgroundGradient] = useState(
    "radial-gradient(ellipse at top, #0A0A1A 0%, #050508 50%, #020205 100%)"
  );
  const [meshColors, setMeshColors] =
    useState<[string, string, string, string]>(DEFAULT_MESH);
  const requestIdRef = useRef(0);
  // Track the last song we fetched Gemini colors for to avoid re-fetching
  const lastGeminiKeyRef = useRef<string>("");

  /**
   * Apply a palette to both React state and the DOM.
   */
  const applyPalette = useCallback((palette: ThemePalette) => {
    setBackgroundGradient(palette.backgroundGradient);
    setMeshColors(palette.meshColors);
    applyPaletteToDom(palette);
  }, []);

  const setTrack = useCallback(
    (newTrack: SpotifyTrack) => {
      const fallbackColor = getColorFromArtist(
        newTrack.artist || "",
        newTrack.title || ""
      );
      const baseColor = newTrack.dominantColor || fallbackColor;

      const trackWithColor: SpotifyTrack = {
        ...newTrack,
        accentColor: baseColor,
      };

      setTrackState(trackWithColor);

      // Step 1: Apply LOCAL palette immediately (no delay)
      const localPalette = generateLocalPalette(baseColor, newTrack.isPlaying);
      applyPalette(localPalette);

      // Step 2: If playing, try Gemini for a better palette (async, non-blocking)
      const geminiKey = `${baseColor}:${newTrack.title}:${newTrack.artist}`;
      if (
        newTrack.isPlaying &&
        geminiKey !== lastGeminiKeyRef.current
      ) {
        lastGeminiKeyRef.current = geminiKey;

        fetchGeminiPalette(
          baseColor,
          newTrack.title || "",
          newTrack.artist || ""
        ).then((geminiPalette) => {
          if (geminiPalette && lastGeminiKeyRef.current === geminiKey) {
            // Update the track accent color with Gemini's choice
            setTrackState((prev) =>
              prev
                ? { ...prev, accentColor: geminiPalette.accent }
                : prev
            );
            applyPalette(geminiPalette);
          }
        });
      }

      // Step 3: If no dominant color yet, extract from album art
      if (!newTrack.dominantColor && newTrack.isPlaying && newTrack.albumArt) {
        const currentRequestId = requestIdRef.current + 1;
        requestIdRef.current = currentRequestId;

        extractDominantColor(newTrack.albumArt).then((dominant) => {
          if (!dominant || requestIdRef.current !== currentRequestId) return;

          const updatedTrack: SpotifyTrack = {
            ...newTrack,
            accentColor: dominant,
            dominantColor: dominant,
          };

          setTrackState(updatedTrack);

          // Apply local palette with extracted color
          const extractedLocalPalette = generateLocalPalette(dominant, true);
          applyPalette(extractedLocalPalette);

          // Try Gemini again with the better extracted color
          const extractedGeminiKey = `${dominant}:${newTrack.title}:${newTrack.artist}`;
          if (extractedGeminiKey !== lastGeminiKeyRef.current) {
            lastGeminiKeyRef.current = extractedGeminiKey;

            fetchGeminiPalette(
              dominant,
              newTrack.title || "",
              newTrack.artist || ""
            ).then((geminiPalette) => {
              if (
                geminiPalette &&
                lastGeminiKeyRef.current === extractedGeminiKey
              ) {
                setTrackState((prev) =>
                  prev
                    ? { ...prev, accentColor: geminiPalette.accent }
                    : prev
                );
                applyPalette(geminiPalette);
              }
            });
          }
        });
      }
    },
    [applyPalette]
  );

  return (
    <SpotifyContext.Provider
      value={{ track, setTrack, backgroundGradient, meshColors }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export function useSpotify() {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error("useSpotify must be used within a SpotifyProvider");
  }
  return context;
}
