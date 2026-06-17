import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────

const products = [
  {
    date: "2026",
    title: "doxa.itsyash.space",
    href: "https://doxa.itsyash.space",
    tags: ["Healthtech", "AI Scribe", "Voice", "India", "Founder"],
    description:
      "Problem: 800,000 Indian clinics run on 3-minute paper consultations, doctors forget patients the moment they leave, losing ~₹50K/month in follow-ups. Doxa is an AI scribe that listens to a 15-second Hinglish voice memo after each patient and turns it into a structured record + automatic follow-up SMS. Zero workflow change, no EMR. The startup I'm building now.",
  },
  {
    date: "2026",
    title: "pilot.itsyash.space",
    href: "https://pilot.itsyash.space",
    tags: ["AI Agents", "DevOps", "SRE", "Kubernetes"],
    description:
      "Problem: SRE work is mostly pattern-matching against past incidents, but engineers spend hours doing it manually at 3am. Pilot is a fleet of AI agents that triage incidents, parse logs, gate deploys, and audit infra hygiene, Claude-driven, runs against your real stack, escalates only when humans actually need to look.",
  },
  {
    date: "2026",
    title: "outreach.itsyash.space",
    href: "https://outreach.itsyash.space",
    tags: ["AI", "Sales", "Cold Email", "Automation"],
    description:
      "Problem: cold-email tools either spray-and-pray (low reply rates, deliverability tanked) or require 30 min of manual research per prospect (doesn't scale). Outreach combines per-prospect research, AI-personalized copy, warm-up rotation, and reply tracking, campaigns that actually feel hand-written.",
  },
  {
    date: "2026",
    title: "chess.itsyash.space",
    href: "https://chess.itsyash.space",
    tags: ["TypeScript", "WebSockets", "Redis", "Multiplayer"],
    description:
      "Problem: chess.com is bloated and Lichess UI feels dated to me. Built a clean multiplayer chess platform with sub-50ms move propagation, Redis-backed game state, ELO matchmaking, OAuth login, and containerized deploys. Real-time chess that just feels fast.",
  },
  {
    date: "2026",
    title: "shots.itsyash.space",
    href: "https://shots.itsyash.space",
    tags: ["Photography", "Portfolio", "Next.js"],
    description:
      "Problem: my photo work was scattered across Instagram, Drive, and an old Lightroom catalog. shots is a self-hosted portfolio for the street, portrait, and travel work I've shot across Bangalore and India, built so I own the canvas and the metadata, not a platform.",
  },
  {
    date: "2026",
    title: "finalcv.co",
    href: "https://finalcv.co",
    tags: ["Next.js", "Prisma", "Gemini", "AI"],
    description:
      "Problem: students keep losing job opportunities to ATS filters because they don't know what a 'good' bullet looks like. finalcv is an AI resume builder with ATS-tuned templates and Gemini-powered bullet rewrites tailored to the JD. 1,000+ monthly users, sub-second suggestions.",
  },
];

const achievements = [
  {
    title: "267th Global Rank, HackerRank AI Agent Challenge (12,885 participants)",
    href: "https://github.com/yashs33244",
    date: "May 2026",
  },
  {
    title: "4th Place, HD Cryptocurrency Wallet with Biometric Auth Hackathon (50+ teams)",
    date: "Feb 2025",
  },
  {
    title: "Top 4, AlgoUniversity Contest (200+ participants) · ₹2,000 prize",
    date: "Feb 2024",
  },
];

const skillCategories = [
  {
    label: "AI & LLM Tools",
    skills: [
      "Claude",
      "LangChain",
      "AI Agents",
      "Prompt Engineering",
      "RAG",
      "Human-in-the-Loop Systems",
      "OpenAI Codex",
    ],
  },
  {
    label: "Languages",
    skills: ["Python", "TypeScript", "JavaScript", "Go", "C++", "SQL", "HTML/CSS"],
  },
  {
    label: "Frameworks",
    skills: ["React", "Next.js", "FastAPI", "Node.js", "Express.js", "Electron.js", "Prisma ORM"],
  },
  {
    label: "Cloud & DevOps",
    skills: ["AWS", "GCP", "Docker", "Kubernetes", "Terraform", "Helm", "GitHub Actions", "Grafana"],
  },
  {
    label: "Databases",
    skills: ["PostgreSQL", "MongoDB", "Redis", "WebSockets", "Microservices"],
  },
  {
    label: "Machine Learning",
    skills: [
      "TensorFlow",
      "Keras",
      "PyTorch",
      "Scikit-learn",
      "Graph Neural Networks",
      "NLP",
    ],
  },
];

// ─── Shared styles ────────────────────────────────────────────────────────────

const SectionHeadingStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "20px",
  fontWeight: 600,
  color: "#f0efe8",
  marginBottom: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const SubtitleStyle: React.CSSProperties = {
  fontSize: "15px",
  color: "#888",
  marginBottom: "16px",
  fontFamily: "var(--font-body)",
};

const DateStyle: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "14px",
  color: "#666",
  whiteSpace: "nowrap",
};

const LinkStyle: React.CSSProperties = {
  color: "#c8f000",
  fontWeight: 500,
  fontSize: "16px",
  fontFamily: "var(--font-body)",
  textDecoration: "none",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TagPill({ label }: { label: string }) {
  return (
    <span
      style={{
        backgroundColor: "#141414",
        border: "1px solid #333",
        borderRadius: "4px",
        padding: "3px 10px",
        fontSize: "12px",
        fontFamily: "var(--font-body)",
        color: "#888",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {label}
    </span>
  );
}

function SkillPill({ label }: { label: string }) {
  return (
    <span
      style={{
        backgroundColor: "#141414",
        border: "1px solid #333",
        borderRadius: "4px",
        padding: "3px 10px",
        fontSize: "12px",
        fontFamily: "var(--font-body)",
        color: "#f0efe8",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {label}
    </span>
  );
}

function ProjectCard({
  project,
}: {
  project: (typeof products)[number];
}) {
  return (
    <div
      style={{
        backgroundColor: "#0f0f0f",
        border: "1px solid #222",
        borderRadius: "8px",
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* Title + date */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
        <Link href={project.href} target="_blank" style={LinkStyle}>
          {project.title}
        </Link>
        <span style={DateStyle}>{project.date}</span>
      </div>

      {/* Tag pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {project.tags.map((tag) => (
          <TagPill key={tag} label={tag} />
        ))}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: "14px",
          color: "#a8a8a0",
          fontFamily: "var(--font-body)",
          margin: 0,
          lineHeight: 1.6,
          overflowWrap: "anywhere",
        }}
      >
        {project.description}
      </p>
    </div>
  );
}

function SkillRow({ label, skills }: { label: string; skills: string[] }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "12px",
        paddingBottom: "12px",
      }}
    >
      <span
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#888",
          fontFamily: "var(--font-body)",
          minWidth: "120px",
          paddingTop: "3px",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", flex: "1 1 200px" }}>
        {skills.map((s) => (
          <SkillPill key={s} label={s} />
        ))}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ContentSections() {
  return (
    <div style={{ maxWidth: "1344px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 24px) 48px" }}>
      {/* Products section */}
      <div
        id="projects"
        style={{ marginBottom: "48px" }}
      >
        <h2 style={SectionHeadingStyle}>
          <span>Products I&apos;m building</span>
          <Link
            href="https://github.com/yashs33244"
            target="_blank"
            style={{ color: "#c8f000", fontSize: "16px", fontWeight: 400 }}
          >
            GitHub ➔
          </Link>
        </h2>
        <p style={SubtitleStyle}>Six products shipped in three days after leaving Binocs. All live.</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 380px), 1fr))",
            gap: "16px",
          }}
        >
          {products.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div id="achievements" style={{ marginBottom: "48px" }}>
        <h2 style={SectionHeadingStyle}>
          <span>Achievements</span>
        </h2>
        <p style={SubtitleStyle}>Competitions and contests I have placed in.</p>
        <ul
          style={{
            listStyle: "disc",
            paddingLeft: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {achievements.map((a) => (
            <li key={a.title}>
              {a.href ? (
                <Link href={a.href} target="_blank" style={LinkStyle}>
                  {a.title}
                </Link>
              ) : (
                <span
                  style={{
                    fontSize: "16px",
                    color: "#f0efe8",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {a.title}
                </span>
              )}
              {a.date && (
                <span style={{ ...DateStyle, marginLeft: "8px" }}>· {a.date}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Skills / tech depth */}
      <div
        id="skills"
        style={{ borderTop: "1px solid #222", paddingTop: "32px" }}
      >
        <h2 style={SectionHeadingStyle}>
          <span>Tech depth</span>
          <Link
            href="https://github.com/yashs33244"
            target="_blank"
            style={{ color: "#c8f000", fontSize: "16px", fontWeight: 400 }}
          >
            All projects ➔
          </Link>
        </h2>
        <p style={SubtitleStyle}>What I build with and specialize in.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {skillCategories.map((cat) => (
            <SkillRow key={cat.label} label={cat.label} skills={cat.skills} />
          ))}
        </div>
      </div>
    </div>
  );
}
