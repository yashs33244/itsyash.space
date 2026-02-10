import { NextRequest } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "";
const REDIRECT_URI =
  process.env.SPOTIFY_REDIRECT_URI ||
  "https://itsyash-space.vercel.app/api/callback";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function page(title: string, body: string) {
  return new Response(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
    <body style="background:#050508;color:#f0f0f0;font-family:monospace;padding:40px;max-width:600px;">
      ${body}
    </body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return page(
      "Authorization Failed",
      `<h1 style="color:#ff4444;">Authorization Failed</h1>
       <p>Error: ${escapeHtml(error)}</p>`
    );
  }

  if (!code) {
    return page(
      "No Code",
      `<h1>No authorization code received</h1>`
    );
  }

  try {
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      "base64"
    );
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
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
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return page(
        "Token Exchange Failed",
        `<h1 style="color:#ff4444;">Token Exchange Failed</h1>
         <p>Error: ${escapeHtml(tokenData.error)}</p>
         <p>${escapeHtml(tokenData.error_description || "")}</p>`
      );
    }

    const safeToken = escapeHtml(tokenData.refresh_token || "");

    return page(
      "Spotify Connected",
      `<h1 style="color:#00E5FF;">Spotify Connected!</h1>
       <p style="color:#22C55E;font-size:18px;">Authorization successful.</p>
       <br/>
       <p style="color:#5A5A6A;">Your refresh token (add this to Vercel env vars as SPOTIFY_REFRESH_TOKEN):</p>
       <div id="token-box" style="background:#0C0C14;border:1px solid #1A1A2E;border-radius:8px;padding:16px;margin:16px 0;word-break:break-all;">
         <code style="color:#00E5FF;font-size:14px;">${safeToken}</code>
       </div>
       <button id="copy-btn"
         style="background:#00E5FF;color:#050508;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-family:monospace;font-weight:bold;">
         Copy Refresh Token
       </button>
       <script>
         document.getElementById('copy-btn').addEventListener('click', function() {
           var t = document.getElementById('token-box').textContent.trim();
           navigator.clipboard.writeText(t).then(function() {
             document.getElementById('copy-btn').textContent = 'Copied!';
           });
         });
       </script>
       <br/><br/>
       <p style="color:#5A5A6A;font-size:12px;">After copying, add it as SPOTIFY_REFRESH_TOKEN in your Vercel project environment variables, then redeploy.</p>`
    );
  } catch (err) {
    return page(
      "Error",
      `<h1 style="color:#ff4444;">Error</h1>
       <p>${escapeHtml(String(err))}</p>`
    );
  }
}
