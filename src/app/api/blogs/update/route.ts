import { NextRequest, NextResponse } from "next/server";
import { updateBlog } from "@/lib/github-blog";

export async function POST(req: NextRequest) {
  const token = process.env.GH_TOKEN;
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });
  const post = await req.json();
  const ok = await updateBlog(post, token);
  if (!ok) return NextResponse.json({ error: "Failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
