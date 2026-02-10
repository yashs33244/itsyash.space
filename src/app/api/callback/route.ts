import { NextRequest } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || "https://itsyash.space/api/callback";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return new Response(
      `<html><body style="background:#050508;color:#f0f0f0;font-family:monospace;padding:40px;">
        <h1 style="color:#ff4444;">Authorization Failed</h1>
        <p>Error: ${error}</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  if (!code) {
    return new Response(
      `<html><body style="background:#050508;color:#f0f0f0;font-family:monospace;padding:40px;">
        <h1>No authorization code received</h1>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return new Response(
        `<html><body style="background:#050508;color:#f0f0f0;font-family:monospace;padding:40px;">
          <h1 style="color:#ff4444;">Token Exchange Failed</h1>
          <p>Error: ${tokenData.error}</p>
          <p>${tokenData.error_description || ""}</p>
        </body></html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    return new Response(
      `<html><body style="background:#050508;color:#f0f0f0;font-family:monospace;padding:40px;max-width:600px;">
        <h1 style="color:#00E5FF;">Spotify Connected!</h1>
        <p style="color:#22C55E;font-size:18px;">Authorization successful.</p>
        <br/>
        <p style="color:#5A5A6A;">Your refresh token (add this to Vercel env vars as SPOTIFY_REFRESH_TOKEN):</p>
        <div style="background:#0C0C14;border:1px solid #1A1A2E;border-radius:8px;padding:16px;margin:16px 0;word-break:break-all;">
          <code style="color:#00E5FF;font-size:14px;">${tokenData.refresh_token}</code>
        </div>
        <button onclick="navigator.clipboard.writeText('${tokenData.refresh_token}');this.textContent='Copied!'" 
          style="background:#00E5FF;color:#050508;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-family:monospace;font-weight:bold;">
          Copy Refresh Token
        </button>
        <br/><br/>
        <p style="color:#5A5A6A;font-size:12px;">After copying, add it as SPOTIFY_REFRESH_TOKEN in your Vercel project environment variables, then redeploy.</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (err) {
    return new Response(
      `<html><body style="background:#050508;color:#f0f0f0;font-family:monospace;padding:40px;">
        <h1 style="color:#ff4444;">Error</h1>
        <p>${String(err)}</p>
      </body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}
