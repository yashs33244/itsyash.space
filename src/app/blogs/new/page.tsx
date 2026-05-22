"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const toSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0f0f0f",
  border: "1px solid #333",
  borderRadius: "6px",
  padding: "10px 14px",
  color: "#f0efe8",
  fontSize: "15px",
  fontFamily: "var(--font-body)",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  color: "#888",
  fontSize: "13px",
  fontWeight: 600,
  display: "block",
  marginBottom: "6px",
};

const fieldStyle: React.CSSProperties = {
  marginBottom: "24px",
};

export default function NewBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState("2026-05-21");
  const [tags, setTags] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const slugManuallyEdited = useRef(false);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugManuallyEdited.current) {
      setSlug(toSlug(val));
    }
  }

  function handleSlugChange(val: string) {
    slugManuallyEdited.current = true;
    setSlug(val);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/blogs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, title, date, tags: parsedTags, excerpt, content }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to create post.");
        setStatus("error");
        return;
      }

      setStatus("success");
      router.push(`/blogs/${slug}`);
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/blogs";
  }

  return (
    <main style={{ maxWidth: "720px", margin: "0 auto", padding: "110px 24px 80px", position: "relative" }}>
      <button
        onClick={logout}
        style={{
          position: "absolute",
          top: "110px",
          right: "24px",
          background: "none",
          border: "1px solid #333",
          color: "#555",
          padding: "6px 12px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        Log out
      </button>
      <div style={{ marginBottom: "32px" }}>
        <Link href="/blogs" style={{ color: "#888", fontSize: "14px", textDecoration: "none" }}>
          ← Back
        </Link>
      </div>

      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "32px",
          fontWeight: 600,
          fontStyle: "italic",
          color: "#f0efe8",
          marginBottom: "32px",
        }}
      >
        New post
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#c8f000")}
            onBlur={(e) => (e.target.style.borderColor = "#333")}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#c8f000")}
            onBlur={(e) => (e.target.style.borderColor = "#333")}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#c8f000")}
            onBlur={(e) => (e.target.style.borderColor = "#333")}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="react, nextjs, typescript"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#c8f000")}
            onBlur={(e) => (e.target.style.borderColor = "#333")}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Excerpt</label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#c8f000")}
            onBlur={(e) => (e.target.style.borderColor = "#333")}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Content (Markdown)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{
              ...inputStyle,
              minHeight: "400px",
              fontFamily: "monospace",
              fontSize: "14px",
              resize: "vertical",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#c8f000")}
            onBlur={(e) => (e.target.style.borderColor = "#333")}
          />
        </div>

        {status === "error" && (
          <p style={{ color: "#ff5555", fontSize: "14px", marginBottom: "16px" }}>{errorMsg}</p>
        )}
        {status === "success" && (
          <p style={{ color: "#c8f000", fontSize: "14px", marginBottom: "16px" }}>
            Post created! Redirecting...
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            href="/blogs"
            style={{ color: "#888", fontSize: "14px", textDecoration: "none", marginRight: "auto" }}
          >
            ← Back
          </Link>
          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              background: "#c8f000",
              color: "#000",
              fontWeight: 700,
              padding: "12px 24px",
              borderRadius: "6px",
              border: "none",
              cursor: status === "loading" ? "not-allowed" : "pointer",
              fontSize: "15px",
              opacity: status === "loading" ? 0.7 : 1,
            }}
          >
            {status === "loading" ? "Publishing..." : "Publish post"}
          </button>
        </div>
      </form>
    </main>
  );
}
