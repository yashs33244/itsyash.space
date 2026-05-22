import { NextRequest, NextResponse } from "next/server";
import { deleteBlog } from "@/lib/github-blog";

export async function POST(req: NextRequest) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });
  const { slug, sha } = await req.json();
  const ok = await deleteBlog(slug, sha, token);
  if (!ok) return NextResponse.json({ error: "Failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
