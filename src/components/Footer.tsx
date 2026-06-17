"use client";

import Link from "next/link";

const footerCols = [
  {
    heading: "Writings and Learnings",
    links: [
      { label: "All Posts", href: "/blogs" },
      { label: "New Post", href: "/blogs/new" },
      { label: "GitHub (code)", href: "https://github.com/yashs33244" },
    ],
  },
  {
    heading: "Work & Projects",
    links: [
      { label: "Resume Builder", href: "https://github.com/yashs33244/resume-build" },
      { label: "Chess Platform", href: "https://github.com/yashs33244/chess-app" },
      { label: "Binocs (SDE)", href: "https://binocs.co" },
      { label: "ViewR (Intern)", href: "https://viewr.in" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/yashs3324" },
      { label: "Twitter", href: "https://x.com/yash_s33244" },
      { label: "Email", href: "mailto:yashs3324@gmail.com" },
      { label: "GitHub", href: "https://github.com/yashs33244" },
    ],
  },
  {
    heading: "Everything Else",
    links: [
      { label: "LeetCode", href: "https://leetcode.com/yashs33244" },
      { label: "Codeforces", href: "https://codeforces.com/profile/yashs3324" },
      { label: "HackerRank", href: "https://hackerrank.com/profile/yashs3324" },
      { label: "IIIT Una", href: "https://iiitu.ac.in" },
    ],
  },
];

const LinkStyle: React.CSSProperties = {
  color: "#888",
  fontSize: "15px",
  fontFamily: "var(--font-body)",
  textDecoration: "none",
  display: "block",
  marginBottom: "8px",
};

const SocialBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "7px 16px",
  backgroundColor: "#0f0f0f",
  color: "#f0efe8",
  fontSize: "15px",
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  textDecoration: "none",
  marginRight: "8px",
  marginBottom: "8px",
};

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#0f0f0f",
        borderTop: "1px solid #222",
        padding: "48px clamp(16px, 4vw, 24px) 24px",
        fontFamily: "var(--font-body)",
      }}
    >
      <div style={{ maxWidth: "1344px", margin: "0 auto" }}>
        {/* 4-col grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "32px",
            marginBottom: "48px",
          }}
        >
          {footerCols.map((col) => (
            <div key={col.heading}>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#f0efe8",
                  marginBottom: "16px",
                }}
              >
                {col.heading}
              </p>
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={LinkStyle}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#c8f000")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#888")}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div style={{ borderTop: "1px solid #222", paddingTop: "32px", marginBottom: "32px" }}>
          <p style={{ fontSize: "20px", fontWeight: 700, color: "#f0efe8", marginBottom: "8px" }}>
            <span style={{ color: "#c8f000" }}>Yash&apos;s Newsletter</span>{" "}
            read by engineers &amp; builders
          </p>
          <p style={{ color: "#888", marginBottom: "16px", fontSize: "15px" }}>
            Weekly essays on AI agents, full-stack systems, and what I&apos;m building.
          </p>
          <Link
            href="https://www.linkedin.com/in/yashs3324"
            target="_blank"
            style={{
              ...SocialBtn,
              backgroundColor: "#c8f000",
              color: "#000",
              border: "none",
              fontWeight: 700,
            }}
          >
            Follow on LinkedIn
          </Link>
          <Link
            href="https://github.com/yashs33244"
            target="_blank"
            style={SocialBtn}
          >
            GitHub ↗
          </Link>
        </div>

        {/* Social icons row + copyright */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <ul style={{ display: "flex", gap: "8px", listStyle: "none", flexWrap: "wrap" }}>
            {[
              { label: "GitHub", href: "https://github.com/yashs33244" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/yashs3324" },
              { label: "Twitter", href: "https://x.com/yash_s33244" },
            ].map((s) => (
              <li key={s.label}>
                <Link href={s.href} target="_blank" style={SocialBtn}>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
          <p style={{ color: "#555", fontSize: "14px" }}>
            © Yash Singh, 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
