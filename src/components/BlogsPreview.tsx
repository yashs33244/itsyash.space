import Link from "next/link";
import { listBlogs } from "@/lib/github-blog";

export default async function BlogsPreview() {
  let posts: Awaited<ReturnType<typeof listBlogs>> = [];
  try {
    posts = await listBlogs();
  } catch {
    // show fallback on error
  }

  const recent = posts.slice(0, 3);

  return (
    <div
      style={{
        maxWidth: "1344px",
        margin: "0 auto",
        padding: "0 24px 48px",
      }}
    >
      <div
        style={{
          borderTop: "1px solid var(--border-light)",
          paddingTop: "32px",
        }}
      >
        {/* Section heading */}
        <h2
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "20px",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>Writings and Learnings</span>
          <Link
            href="/blogs"
            style={{
              color: "var(--link-color)",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Full archive ➔
          </Link>
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "#7a7a7a",
            marginBottom: "16px",
            fontFamily: "var(--font-body)",
          }}
        >
          Essays on AI agents, full-stack systems, and building in public.
        </p>

        {/* Post rows */}
        {recent.length === 0 ? (
          <p style={{ color: "#555", fontSize: "15px" }}>
            No posts yet. Coming soon.
          </p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0",
            }}
          >
            {recent.map((post) => (
              <li
                key={post.slug}
                style={{
                  borderBottom: "1px solid #1a1a1a",
                  padding: "14px 0",
                  display: "flex",
                  gap: "20px",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "13px",
                    color: "#555",
                    whiteSpace: "nowrap",
                    minWidth: "90px",
                    flexShrink: 0,
                  }}
                >
                  {post.date}
                </span>
                <Link
                  href={`/blogs/${post.slug}`}
                  style={{
                    color: "#c8f000",
                    fontSize: "16px",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
