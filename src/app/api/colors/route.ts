import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/colors
 *
 * Accepts an extracted album art color + song info,
 * asks Gemini to suggest an optimized color palette for a dark-themed portfolio,
 * and returns the palette.
 *
 * If Gemini fails or is not configured, returns a 503 so the client falls back
 * to the locally-generated palette.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Simple in-memory cache to avoid repeated calls for the same song
const cache = new Map<string, { palette: GeminiPalette; ts: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

interface GeminiPalette {
  accent: string;
  accentMuted: string;
  bgBase: string;
  bgElevated: string;
  meshColors: [string, string, string, string];
}

function cleanJsonResponse(text: string): string {
  // Gemini sometimes wraps the JSON in ```json ... ``` markdown blocks
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    // Remove opening ```json or ```
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "");
    // Remove closing ```
    cleaned = cleaned.replace(/\n?```\s*$/, "");
  }
  return cleaned.trim();
}

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Gemini not configured" },
      { status: 503 }
    );
  }

  let body: { extractedColor: string; songTitle: string; artist: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { extractedColor, songTitle, artist } = body;

  if (!extractedColor) {
    return NextResponse.json(
      { error: "extractedColor is required" },
      { status: 400 }
    );
  }

  // Check cache
  const cacheKey = `${extractedColor}:${songTitle}:${artist}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.palette);
  }

  const prompt = `You are a color expert for a dark-themed portfolio website. The background is very dark (#050508). 

A user is listening to "${songTitle || "unknown"}" by "${artist || "unknown"}".
The dominant color extracted from the album art is: ${extractedColor}

Your job: Generate an optimized color palette that:
1. "accent" — The PRIMARY accent color. Must be VIBRANT and clearly visible on a #050508 dark background. If the extracted color is too dark (lightness < 35%), too desaturated (saturation < 40%), or too close to black/gray, you MUST brighten and saturate it significantly. The accent should feel energetic and match the mood of the song/artist. Minimum lightness: 40%. Minimum saturation: 50%.
2. "accentMuted" — A subtle version of accent at ~15% opacity for borders/glows. Format: "rgb(R G B / 0.15)" using accent RGB values.
3. "bgBase" — Very dark background tinted slightly toward accent hue. Must be very dark (lightness 3-8%).
4. "bgElevated" — Slightly lighter surface for cards. Lightness 6-12%, tinted toward accent.
5. "meshColors" — Array of 4 very dark hex colors for an animated mesh gradient background. Each should be between lightness 2-10%, subtly tinted toward accent hue with slight variations.

IMPORTANT RULES:
- ALL hex colors must be valid 6-digit hex (#RRGGBB format)
- accent MUST have enough contrast on dark backgrounds — think neon signs, vivid highlights
- bgBase and bgElevated must remain very dark to maintain readability
- meshColors should be dark moody variants, NOT bright
- Match the vibe/mood of the song if possible (e.g. energetic pop = warm vivid, chill lofi = cool muted-but-visible)

Return ONLY valid JSON, no markdown, no explanation:
{
  "accent": "#HEXCOLOR",
  "accentMuted": "rgb(R G B / 0.15)",
  "bgBase": "#HEXCOLOR",
  "bgElevated": "#HEXCOLOR",
  "meshColors": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"]
}`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      console.error(
        "Gemini API error:",
        geminiRes.status,
        await geminiRes.text()
      );
      return NextResponse.json(
        { error: "Gemini API request failed" },
        { status: 503 }
      );
    }

    const geminiData = await geminiRes.json();

    // Extract text from Gemini response
    const text =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("No text in Gemini response:", JSON.stringify(geminiData));
      return NextResponse.json(
        { error: "Empty Gemini response" },
        { status: 503 }
      );
    }

    // Parse the JSON
    const cleaned = cleanJsonResponse(text);
    const palette: GeminiPalette = JSON.parse(cleaned);

    // Validate required fields
    if (
      !palette.accent ||
      !palette.meshColors ||
      palette.meshColors.length !== 4
    ) {
      console.error("Invalid palette structure:", palette);
      return NextResponse.json(
        { error: "Invalid palette from Gemini" },
        { status: 503 }
      );
    }

    // Validate hex format
    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    if (!hexRegex.test(palette.accent)) {
      console.error("Invalid accent hex:", palette.accent);
      return NextResponse.json(
        { error: "Invalid accent color format" },
        { status: 503 }
      );
    }

    for (const mc of palette.meshColors) {
      if (!hexRegex.test(mc)) {
        console.error("Invalid mesh hex:", mc);
        return NextResponse.json(
          { error: "Invalid mesh color format" },
          { status: 503 }
        );
      }
    }

    // Cache the result
    cache.set(cacheKey, { palette, ts: Date.now() });

    // Evict old cache entries
    if (cache.size > 50) {
      const now = Date.now();
      for (const [key, val] of cache.entries()) {
        if (now - val.ts > CACHE_TTL) cache.delete(key);
      }
    }

    return NextResponse.json(palette);
  } catch (err) {
    console.error("Color API error:", err);
    return NextResponse.json(
      { error: "Failed to generate colors" },
      { status: 503 }
    );
  }
}
