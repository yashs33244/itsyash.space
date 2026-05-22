import Link from "next/link";
import { cookies } from "next/headers";
import { isValidSession } from "@/lib/auth";
import { listBlogs } from "@/lib/github-blog";

export default async function BlogsPage() {
  let posts: Awaited<ReturnType<typeof listBlogs>> = [];
  try {
    posts = await listBlogs();
  } catch {
    // show empty state on error
  }

  const cookieStore = await cookies();
  const session = cookieStore.get("_session")?.value;
  const isAuthed = isValidSession(session);

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "110px 32px 80px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "48px" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "34px", fontWeight: 600, fontStyle: "italic", color: "#f0efe8", marginBottom: "8px", lineHeight: 1.3 }}>
              Writings and Learnings
            </h1>
            <p style={{ color: "#555", fontSize: "14px" }}>
              Essays on AI agents, full-stack systems, and building in public.
            </p>
          </div>
          {isAuthed && (
            <Link
              href="/blogs/new"
              style={{ backgroundColor: "#1a1a1a", color: "#888", border: "1px solid #2a2a2a", padding: "8px 16px", borderRadius: "6px", fontWeight: 500, fontSize: "13px", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}
            >
              + New Post
            </Link>
          )}
        </div>

        {/* Post list */}
        {posts.length === 0 ? (
          <div style={{ padding: "64px 0", textAlign: "center" }}>
            <p style={{ color: "#444", fontSize: "15px" }}>No posts yet.</p>
            <p style={{ color: "#333", fontSize: "13px", marginTop: "8px" }}>
              Add markdown files to <code style={{ color: "#555" }}>yashs33244/blogs</code> on GitHub.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {posts.map((post, i) => (
              <div
                key={post.slug}
                style={{
                  padding: "24px 0",
                  borderTop: i === 0 ? "1px solid #1a1a1a" : undefined,
                  borderBottom: "1px solid #1a1a1a",
                  display: "flex",
                  gap: "32px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#3a3a3a", whiteSpace: "nowrap", paddingTop: "4px", minWidth: "86px", letterSpacing: "0.04em" }}>
                  {post.date}
                </span>
                <div>
                  <Link
                    href={`/blogs/${post.slug}`}
                    style={{ color: "#d4d0c8", fontSize: "16px", fontWeight: 500, textDecoration: "none", lineHeight: 1.4 }}
                  >
                    {post.title}
                  </Link>
                  {post.excerpt && (
                    <p style={{ color: "#4a4a4a", fontSize: "13px", marginTop: "6px", lineHeight: 1.6 }}>
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags?.length > 0 && (
                    <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
                      {post.tags.map(t => (
                        <span key={t} style={{ backgroundColor: "#141414", border: "1px solid #1e1e1e", borderRadius: "3px", padding: "1px 7px", fontSize: "11px", color: "#4a4a4a", letterSpacing: "0.03em" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
