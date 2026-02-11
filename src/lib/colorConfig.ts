/**
 * Centralized Color Configuration for itsyash.space
 *
 * This is the SINGLE SOURCE OF TRUTH for all colors used across the portfolio.
 * The color system works in three layers:
 *
 * 1. DEFAULTS — Static fallback palette (used when nothing is playing)
 * 2. EXTRACTED — Colors extracted from Spotify album art via canvas
 * 3. GEMINI-OPTIMIZED — AI-enhanced colors that look good on a dark theme
 *
 * Flow: Album art → extract dominant color → send to Gemini → get optimized palette
 * If Gemini fails → use extracted color directly with local enhancement
 */

// ─── Default Palette (nothing playing) ──────────────────────────

export const DEFAULTS = {
  accent: "#00e5ff",
  accentRgb: "0 229 255",
  bgBase: "#050508",
  bgElevated: "#10101c",
  bgSurface: "#0A0A12",
  txt: "#EDEDF0",
  txtSecondary: "#8E8EA0",
  txtMuted: "#5C5C6F",
  line: "#161624",
  lineHover: "#222236",
} as const;

// ─── Mesh Gradient Defaults ─────────────────────────────────────

export const DEFAULT_MESH: [string, string, string, string] = [
  "#020818",
  "#050a1a",
  "#0a0e24",
  "#02060f",
];

// ─── Types ──────────────────────────────────────────────────────

export interface ThemePalette {
  /** Primary accent color (hex) — used for highlights, links, active states */
  accent: string;
  /** Accent as RGB triplet string "R G B" for use with rgb() / opacity */
  accentRgb: string;
  /** Muted/secondary accent — for borders, subtle glows, tag backgrounds */
  accentMuted: string;
  /** Background base — deepest layer, tinted slightly toward accent */
  bgBase: string;
  /** Elevated background — cards, surfaces with slight accent tint */
  bgElevated: string;
  /** 4 colors for the mesh gradient background [c1, c2, c3, c4] */
  meshColors: [string, string, string, string];
  /** Radial gradient string for the page background */
  backgroundGradient: string;
}

// ─── Color Math Utilities ───────────────────────────────────────

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

export function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
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
    }
    h /= 6;
  }

  return { h, s, l };
}

export function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// ─── Local Color Enhancement ────────────────────────────────────

/**
 * Ensures a color has enough lightness & saturation for a dark theme.
 * If the extracted color is too dark or muddy, boost it.
 */
export function ensureVisibleOnDark(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);

  // If already vivid enough, keep it
  if (s > 0.4 && l > 0.35 && l < 0.75) {
    return hex;
  }

  // Boost saturation to at least 0.55, lightness to at least 0.5
  const newS = Math.max(s, 0.55);
  const newL = l < 0.35 ? 0.5 : l > 0.75 ? 0.65 : l;
  const { r: nr, g: ng, b: nb } = hslToRgb(h, newS, newL);
  return rgbToHex(nr, ng, nb);
}

/**
 * Generate the full theme palette from a single accent color.
 * This is the LOCAL fallback — used when Gemini is unavailable.
 */
export function generateLocalPalette(
  rawColor: string,
  isPlaying: boolean
): ThemePalette {
  if (!isPlaying) {
    return {
      accent: DEFAULTS.accent,
      accentRgb: DEFAULTS.accentRgb,
      accentMuted: "rgb(0 229 255 / 0.15)",
      bgBase: DEFAULTS.bgBase,
      bgElevated: DEFAULTS.bgElevated,
      meshColors: [...DEFAULT_MESH],
      backgroundGradient:
        "radial-gradient(ellipse at top, #0A0A1A 0%, #050508 50%, #020205 100%)",
    };
  }

  // Enhance the color for dark theme visibility
  const accent = ensureVisibleOnDark(rawColor);
  const { r, g, b } = hexToRgb(accent);

  return {
    accent,
    accentRgb: `${r} ${g} ${b}`,
    accentMuted: `rgb(${r} ${g} ${b} / 0.15)`,
    bgBase: `rgb(${Math.floor(r * 0.16)} ${Math.floor(g * 0.16)} ${Math.floor(b * 0.16)})`,
    bgElevated: `rgb(${Math.floor(r * 0.28)} ${Math.floor(g * 0.28)} ${Math.floor(b * 0.28)})`,
    meshColors: generateMeshColors(accent),
    backgroundGradient: generateGradient(accent),
  };
}

/**
 * Generate 4 dark mesh gradient colors from an accent.
 */
export function generateMeshColors(
  accent: string
): [string, string, string, string] {
  const { r, g, b } = hexToRgb(accent);

  const c1 = rgbToHex(
    Math.floor(r * 0.12),
    Math.floor(g * 0.12),
    Math.floor(b * 0.12)
  );
  const c2 = rgbToHex(
    Math.floor(r * 0.08 + 5),
    Math.floor(g * 0.06),
    Math.floor(b * 0.15)
  );
  const c3 = rgbToHex(
    Math.floor(r * 0.06),
    Math.floor(g * 0.1 + 3),
    Math.floor(b * 0.08)
  );
  const c4 = rgbToHex(
    Math.floor(r * 0.04),
    Math.floor(g * 0.04),
    Math.floor(b * 0.06)
  );

  return [c1, c2, c3, c4];
}

/**
 * Generate the background radial gradient from accent color.
 */
export function generateGradient(accent: string): string {
  const { r, g, b } = hexToRgb(accent);
  const darkR = Math.floor(r * 0.15);
  const darkG = Math.floor(g * 0.15);
  const darkB = Math.floor(b * 0.15);
  const midR = Math.floor(r * 0.08);
  const midG = Math.floor(g * 0.08);
  const midB = Math.floor(b * 0.08);

  return `radial-gradient(ellipse at top, rgb(${darkR}, ${darkG}, ${darkB}) 0%, rgb(${midR}, ${midG}, ${midB}) 40%, #050508 100%)`;
}

// ─── Apply Theme to DOM ─────────────────────────────────────────

/**
 * Write all CSS custom properties to the document root.
 * This is the ONLY place that touches document.documentElement.style for colors.
 */
export function applyPaletteToDom(palette: ThemePalette): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement.style;
  root.setProperty("--accent", palette.accent);
  root.setProperty("--accent-rgb", palette.accentRgb);
  root.setProperty("--bg-base", palette.bgBase);
  root.setProperty("--bg-elevated", palette.bgElevated);
}

// ─── Gemini Integration ─────────────────────────────────────────

/**
 * Gemini-optimized palette shape — what the API returns.
 */
export interface GeminiPaletteResponse {
  accent: string;
  accentMuted: string;
  bgBase: string;
  bgElevated: string;
  meshColors: [string, string, string, string];
}

/**
 * Call our /api/colors endpoint to get Gemini-optimized colors.
 * Returns null if the request fails (network error, timeout, bad response).
 */
export async function fetchGeminiPalette(
  extractedColor: string,
  songTitle: string,
  artist: string
): Promise<ThemePalette | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const res = await fetch("/api/colors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        extractedColor,
        songTitle,
        artist,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) return null;

    const data: GeminiPaletteResponse = await res.json();

    // Validate the response has all required fields
    if (!data.accent || !data.meshColors || data.meshColors.length !== 4) {
      return null;
    }

    const { r, g, b } = hexToRgb(data.accent);

    return {
      accent: data.accent,
      accentRgb: `${r} ${g} ${b}`,
      accentMuted: data.accentMuted || `rgb(${r} ${g} ${b} / 0.15)`,
      bgBase: data.bgBase || `rgb(${Math.floor(r * 0.16)} ${Math.floor(g * 0.16)} ${Math.floor(b * 0.16)})`,
      bgElevated: data.bgElevated || `rgb(${Math.floor(r * 0.28)} ${Math.floor(g * 0.28)} ${Math.floor(b * 0.28)})`,
      meshColors: data.meshColors,
      backgroundGradient: generateGradient(data.accent),
    };
  } catch {
    // Network error, timeout, JSON parse error — all return null
    return null;
  }
}
