import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    const safeError = escapeHtml(error);
    return new NextResponse(
      `<html><body style="background:#050508;color:#ededf0;font-family:monospace;padding:2rem;">
        <h1>Authorization Failed</h1>
        <p>Error: ${safeError}</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  if (!code) {
    return new NextResponse(
      `<html><body style="background:#050508;color:#ededf0;font-family:monospace;padding:2rem;">
        <h1>No authorization code received</h1>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return new NextResponse(
      `<html><body style="background:#050508;color:#ededf0;font-family:monospace;padding:2rem;">
        <h1>Missing environment variables</h1>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      const safeErrorText = escapeHtml(errorText);
      return new NextResponse(
        `<html><body style="background:#050508;color:#ededf0;font-family:monospace;padding:2rem;">
          <h1>Token exchange failed</h1>
          <p>${safeErrorText}</p>
        </body></html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    const data = await response.json();
    const safeRefreshToken = escapeHtml(data.refresh_token || "none");

    return new NextResponse(
      `<html><body style="background:#050508;color:#ededf0;font-family:monospace;padding:2rem;">
        <h1 style="color:#00E5FF;">Success!</h1>
        <p>Your refresh token:</p>
        <pre style="background:#0A0A12;padding:1rem;border-radius:8px;border:1px solid #161624;word-break:break-all;max-width:600px;">${safeRefreshToken}</pre>
        <p style="color:#8E8EA0;margin-top:1rem;">Copy this token and add it as SPOTIFY_REFRESH_TOKEN in your Vercel environment variables.</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const safeMessage = escapeHtml(message);
    return new NextResponse(
      `<html><body style="background:#050508;color:#ededf0;font-family:monospace;padding:2rem;">
        <h1>Error</h1>
        <p>${safeMessage}</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}
