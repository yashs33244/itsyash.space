import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────

const projects = [
  {
    date: "2024",
    title: "Resume Builder Platform",
    href: "https://github.com/yashs33244/resume-build",
    tags: ["TypeScript", "Next.js", "Prisma", "PostgreSQL", "Docker", "Gemini API"],
    description:
      "Serving 1,000+ monthly users with AI-powered resume suggestions. 99.9% uptime on AWS.",
  },
  {
    date: "2024",
    title: "Real-Time Chess Platform",
    href: "https://github.com/yashs33244/chess-app",
    tags: ["TypeScript", "React", "Node.js", "WebSockets", "Redis", "PostgreSQL"],
    description:
      "Sub-50ms move propagation, ELO-based matchmaking, OAuth login, containerized deployment.",
  },
];

const achievements = [
  {
    title: "267th Global Rank — HackerRank AI Agent Challenge (12,885 participants)",
    href: "https://github.com/yashs33244",
    date: "May 2026",
  },
  {
    title: "4th Place — HD Cryptocurrency Wallet with Biometric Auth Hackathon (50+ teams)",
    date: "Feb 2025",
  },
  {
    title: "Top 4 — AlgoUniversity Contest (200+ participants) · ₹2,000 prize",
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
        whiteSpace: "nowrap",
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
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function ProjectCard({
  project,
}: {
  project: (typeof projects)[number];
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
          color: "#888",
          fontFamily: "var(--font-body)",
          margin: 0,
          lineHeight: "1.5",
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
        gap: "16px",
        paddingBottom: "12px",
      }}
    >
      <span
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#888",
          fontFamily: "var(--font-body)",
          minWidth: "140px",
          paddingTop: "3px",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
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
    <div style={{ maxWidth: "1344px", margin: "0 auto", padding: "0 24px 48px" }}>
      {/* Projects + Achievements row */}
      <div
        id="projects"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          marginBottom: "48px",
        }}
      >
        {/* Projects */}
        <div>
          <h2 style={SectionHeadingStyle}>
            <span>Recent projects</span>
            <Link
              href="https://github.com/yashs33244"
              target="_blank"
              style={{ color: "#c8f000", fontSize: "16px", fontWeight: 400 }}
            >
              GitHub ➔
            </Link>
          </h2>
          <p style={SubtitleStyle}>Things I have built recently.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {projects.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div id="achievements">
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
