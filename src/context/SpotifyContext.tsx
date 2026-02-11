"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";

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
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

// Map common genres/artists to colors for when we can't extract from image
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
  metal: "#2F3542",
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
    if (text.includes(genre)) {
      return color;
    }
  }
  
  // Default to cyan if no match
  return "#00E5FF";
}

function generateGradient(baseColor: string, isPlaying: boolean): string {
  if (!isPlaying) {
    return "radial-gradient(ellipse at top, #0A0A1A 0%, #050508 50%, #020205 100%)";
  }
  
  // Create a dark, moody gradient based on the track color
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);
  
  // Darken the colors for background
  const darkR = Math.floor(r * 0.15);
  const darkG = Math.floor(g * 0.15);
  const darkB = Math.floor(b * 0.15);
  
  const midR = Math.floor(r * 0.08);
  const midG = Math.floor(g * 0.08);
  const midB = Math.floor(b * 0.08);
  
  return `radial-gradient(ellipse at top, rgb(${darkR}, ${darkG}, ${darkB}) 0%, rgb(${midR}, ${midG}, ${midB}) 40%, #050508 100%)`;
}

function setCssVar(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty(name, value);
}

function applyThemeFromColor(color: string, isPlaying: boolean) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  const darkR = Math.floor(r * 0.16);
  const darkG = Math.floor(g * 0.16);
  const darkB = Math.floor(b * 0.16);

  const elevatedR = Math.floor(r * 0.28);
  const elevatedG = Math.floor(g * 0.28);
  const elevatedB = Math.floor(b * 0.28);

  if (!isPlaying) {
    setCssVar("--accent", "#00e5ff");
    setCssVar("--accent-rgb", "0 229 255");
    setCssVar("--bg-base", "#050508");
    setCssVar("--bg-elevated", "#10101c");
    return;
  }

  setCssVar("--accent", color.toLowerCase());
  setCssVar("--accent-rgb", `${r} ${g} ${b}`);
  setCssVar("--bg-base", `rgb(${darkR} ${darkG} ${darkB})`);
  setCssVar("--bg-elevated", `rgb(${elevatedR} ${elevatedG} ${elevatedB})`);
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / delta + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      case bn:
        h = (rn - gn) / delta + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  return { h, s, l };
}

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

export function SpotifyProvider({ children }: { children: ReactNode }) {
  const [track, setTrackState] = useState<SpotifyTrack | null>(null);
  const [backgroundGradient, setBackgroundGradient] = useState(
    "radial-gradient(ellipse at top, #0A0A1A 0%, #050508 50%, #020205 100%)"
  );
  const requestIdRef = useRef(0);

  const setTrack = useCallback((newTrack: SpotifyTrack) => {
    const fallbackColor = getColorFromArtist(
      newTrack.artist || "",
      newTrack.title || ""
    );
    const baseColor = newTrack.dominantColor || fallbackColor;

    const trackWithColor = {
      ...newTrack,
      accentColor: baseColor,
    };

    setTrackState(trackWithColor);
    setBackgroundGradient(generateGradient(baseColor, newTrack.isPlaying));
    applyThemeFromColor(baseColor, newTrack.isPlaying);

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
        setBackgroundGradient(generateGradient(dominant, newTrack.isPlaying));
        applyThemeFromColor(dominant, newTrack.isPlaying);
      });
    }
  }, []);

  return (
    <SpotifyContext.Provider
      value={{ track, setTrack, backgroundGradient }}
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
