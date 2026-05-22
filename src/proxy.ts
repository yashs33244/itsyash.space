import { NextRequest, NextResponse } from "next/server";

const PROTECTED_APIS = ["/api/blogs/create", "/api/blogs/update", "/api/blogs/delete"];

async function computeHmac(password: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(password));

  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedApi = PROTECTED_APIS.some((p) => pathname.startsWith(p));
  const isProtectedPage =
    pathname === "/blogs/new" ||
    (pathname.startsWith("/blogs/") && pathname.endsWith("/edit"));

  if (!isProtectedApi && !isProtectedPage) return NextResponse.next();

  const session = req.cookies.get("_session")?.value;
  const password = process.env.ACCESS_PASSWORD || "";
  const secret = process.env.SESSION_SECRET || "fallback-secret";
  const expected = await computeHmac(password, secret);
  const valid = session && constantTimeEqual(session, expected);

  if (!valid) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/blogs/new", "/blogs/:slug/edit", "/api/blogs/:path*"],
};
