"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/blogs/new";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push(next);
    } else {
      setError("Wrong password.");
      setPassword("");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "360px" }}>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "28px",
            fontWeight: 600,
            fontStyle: "italic",
            color: "#f0efe8",
            marginBottom: "8px",
          }}
        >
          Admin access
        </h1>
        <p style={{ color: "#555", fontSize: "14px", marginBottom: "32px" }}>
          Enter your password to manage blog posts.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            style={{
              width: "100%",
              backgroundColor: "#0f0f0f",
              border: "1px solid #333",
              borderRadius: "6px",
              padding: "12px 16px",
              color: "#f0efe8",
              fontSize: "15px",
              fontFamily: "var(--font-body)",
              outline: "none",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#c8f000")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#333")}
          />

          {error && (
            <p style={{ color: "#ff4444", fontSize: "13px", margin: 0 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              backgroundColor: loading || !password ? "#333" : "#c8f000",
              color: loading || !password ? "#666" : "#000",
              border: "none",
              borderRadius: "6px",
              padding: "12px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: loading || !password ? "not-allowed" : "pointer",
              fontFamily: "var(--font-body)",
              transition: "background 0.15s",
            }}
          >
            {loading ? "Checking..." : "Enter →"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
