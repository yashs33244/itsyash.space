"use client";

import { useRouter } from "next/navigation";

export default function DeleteBlogButton({ slug, sha }: { slug: string; sha: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    const res = await fetch("/api/blogs/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, sha }),
    });
    if (res.ok) router.push("/blogs");
    else alert("Delete failed — check your GH_TOKEN env var.");
  }

  return (
    <button
      onClick={handleDelete}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#555",
        fontSize: "13px",
        padding: 0,
      }}
    >
      Delete
    </button>
  );
}
