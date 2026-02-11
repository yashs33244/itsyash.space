import { NextResponse } from "next/server";
import sharp from "sharp";

export const dynamic = "force-dynamic";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_NOW_PLAYING_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyAlbum {
  name: string;
  images: SpotifyImage[];
}

interface SpotifyTrack {
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
}

interface SpotifyNowPlayingResponse {
  is_playing: boolean;
  item: SpotifyTrack | null;
}

async function extractDominantColor(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl, { cache: "no-store" });
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());

    const { data, info } = await sharp(buffer)
      .resize(32, 32, { fit: "inside" })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { channels } = info;
    if (channels < 3) return null;

    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      rSum += r;
      gSum += g;
      bSum += b;
      count += 1;
    }

    if (count === 0) return null;

    const r = Math.round(rSum / count);
    const g = Math.round(gSum / count);
    const b = Math.round(bSum / count);

    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? `0${hex}` : hex;
        })
        .join("")
    );
  } catch (error) {
    console.error("Error extracting dominant color:", error);
    return null;
  }
}

async function getAccessToken(): Promise<string | null> {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return null;
  }

  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64"
  );

  try {
    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: REFRESH_TOKEN,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to refresh Spotify token:", response.status);
      return null;
    }

    const data: SpotifyTokenResponse = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error refreshing Spotify token:", error);
    return null;
  }
}

async function getNowPlaying(
  accessToken: string
): Promise<SpotifyNowPlayingResponse | null> {
  try {
    const response = await fetch(SPOTIFY_NOW_PLAYING_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    // 204 means no track is currently playing
    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      console.error("Failed to fetch now playing:", response.status);
      return null;
    }

    const data: SpotifyNowPlayingResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching now playing:", error);
    return null;
  }
}

export async function GET() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json({ isPlaying: false });
  }

  const nowPlaying = await getNowPlaying(accessToken);

  if (!nowPlaying || !nowPlaying.is_playing || !nowPlaying.item) {
    return NextResponse.json({ isPlaying: false });
  }

  const track = nowPlaying.item;

  // Get the smallest image that's at least 64px, or the last one
  const albumArt =
    track.album.images.find((img) => img.width >= 64 && img.width <= 300)
      ?.url ||
    track.album.images[track.album.images.length - 1]?.url ||
    null;

  const dominantColor = albumArt ? await extractDominantColor(albumArt) : null;

  return NextResponse.json({
    isPlaying: true,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    albumArt,
    dominantColor,
  });
}
