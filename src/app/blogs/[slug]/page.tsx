import { getBlog } from "@/lib/github-blog";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { isValidSession } from "@/lib/auth";
import DeleteBlogButton from "./DeleteBlogButton";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlog(slug);
  if (!post) notFound();

  const cookieStore = await cookies();
  const session = cookieStore.get("_session")?.value;
  const isAuthed = isValidSession(session);

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
      {/* Top bar */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "88px 32px 0" }}>
        <Link href="/blogs" style={{ color: "#555", fontSize: "13px", textDecoration: "none", letterSpacing: "0.03em" }}>
          ← Writings
        </Link>
      </div>

      {/* Article card */}
      <article style={{ maxWidth: "800px", margin: "24px auto", backgroundColor: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "40px 48px 32px", borderBottom: "1px solid #1a1a1a" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "32px", fontWeight: 600, fontStyle: "italic", color: "#f0efe8", lineHeight: 1.35, marginBottom: "20px" }}>
            {post.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#444", letterSpacing: "0.05em" }}>{post.date}</span>
            {post.tags?.map(t => (
              <span key={t} style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "4px", padding: "2px 8px", fontSize: "11px", color: "#666", letterSpacing: "0.03em" }}>{t}</span>
            ))}
            {isAuthed && (
              <div style={{ marginLeft: "auto", display: "flex", gap: "16px" }}>
                <Link href={`/blogs/${slug}/edit`} style={{ color: "#444", fontSize: "12px", textDecoration: "none" }}>Edit</Link>
                <DeleteBlogButton slug={slug} sha={post.sha || ""} />
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "40px 48px 56px" }}>
          <MarkdownRenderer content={post.content} />
        </div>
      </article>

      <div style={{ height: "80px" }} />
    </div>
  );
}
