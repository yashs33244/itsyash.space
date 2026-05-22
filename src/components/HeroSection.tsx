"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const socialLinks = [
  {
    label: "GitHub",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    href: "https://github.com/yashs33244",
    showCount: false,
  },
  {
    label: "LinkedIn",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    href: "https://linkedin.com/in/yash-singh-bb1a1a212",
    showCount: false,
  },
  {
    label: "Twitter",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
    href: "https://twitter.com/yashs33244",
    showCount: false,
  },
  {
    label: "LeetCode",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
      </svg>
    ),
    href: "https://leetcode.com/yashs33244",
    showCount: false,
  },
];

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      <section
        style={{
          maxWidth: "1344px",
          margin: "0 auto",
          padding: "110px 24px 48px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
          gap: "48px",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "40px",
              fontWeight: 600,
              fontStyle: "italic",
              color: "#f0efe8",
              lineHeight: "45px",
              marginBottom: "24px",
            }}
          >
            Hey, I am Yash
          </h1>

          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "24px",
              fontWeight: 600,
              fontStyle: "italic",
              color: "#c8f000",
              marginBottom: "24px",
              lineHeight: "1.3",
            }}
          >
            AI, full-stack, and systems. always building.
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "24px",
              color: "#f0efe8",
              maxWidth: "820px",
            }}
          >
            <p style={{ lineHeight: "1.7" }}>
              I am an AI-fueled full-stack engineer passionate about building systems that scale and
              ship fast. Currently, I am a Software Development Engineer at{" "}
              <Link href="https://binocs.co" style={{ color: "#c8f000" }}>
                Binocs
              </Link>
              , Bangalore, where I build production AI agents, automate workflows with LLMs, and ship
              end-to-end features from infrastructure to UI. I reduced Claude API cost by 99% ($1.00 →
              $0.01 per slide) by redesigning the AI presentation pipeline with prompt chaining and
              structured outputs.
            </p>

            <p style={{ lineHeight: "1.7" }}>
              Previously, I was a Software Engineering Intern at{" "}
              <Link href="https://viewr.in" style={{ color: "#c8f000" }}>
                ViewR
              </Link>
              , where I built a cross-platform desktop app with Electron + React spanning 5
              microservices, implemented real-time ONVIF/RTSP video streaming at sub-100ms latency,
              and deployed 4 AI/ML models for attendance and face recognition reaching 98%+ accuracy on
              10,000+ daily requests.
            </p>

            <p style={{ lineHeight: "1.7" }}>
              I also did research at{" "}
              <Link href="https://iitmandi.ac.in" style={{ color: "#c8f000" }}>
                IIT Mandi
              </Link>
              , improving continuous authentication accuracy for banking apps from 89% to 92%, and
              analyzing molecular olfaction using Graph Neural Networks across 15,000+ pharmaceutical
              compounds.
            </p>

            <p style={{ lineHeight: "1.7" }}>
              I am a final-year B.Tech CS student at{" "}
              <Link href="https://iiitu.ac.in" style={{ color: "#c8f000" }}>
                IIIT Una
              </Link>{" "}
              (GPA 8.3/10, graduating July 2026). I keep building in public — follow along on my{" "}
              <Link href="https://github.com/yashs33244" style={{ color: "#c8f000" }}>
                GitHub
              </Link>{" "}
              and{" "}
              <Link href="https://linkedin.com/in/yash-singh-bb1a1a212" style={{ color: "#c8f000" }}>
                LinkedIn
              </Link>
              .
            </p>
          </div>

          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              listStyle: "none",
              padding: 0,
            }}
          >
            {socialLinks.map((s) => (
              <li key={s.label}>
                <Link
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
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
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#141414")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0f0f0f")
                  }
                >
                  {s.icon}
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Photo — on mobile it renders below text due to grid column order */}
        <div
          style={{
            flexShrink: 0,
            order: isMobile ? -1 : 0,
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-end",
          }}
        >
          <Image
            src="/images/yash.png"
            alt="Yash Singh"
            width={380}
            height={400}
            style={{
              borderRadius: "16px",
              objectFit: "cover",
              display: "block",
              maxWidth: isMobile ? "260px" : "380px",
              width: "100%",
              height: "auto",
            }}
            priority
          />
        </div>
      </section>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #222",
          margin: "0 24px",
          maxWidth: "1344px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
    </>
  );
}
