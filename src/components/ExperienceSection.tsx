import Link from "next/link";

const experiences = [
  {
    company: "Binocs",
    companyHref: "https://binocs.co",
    role: "Software Development Engineer",
    duration: "July 2025 – May 2026",
    location: "Onsite, Bangalore · 1 year",
    stack: [
      "Python",
      "FastAPI",
      "Go",
      "React",
      "AWS/EKS",
      "Kubernetes",
      "Terraform",
      "Helm",
      "Claude",
      "Gemini",
      "Stripe",
      "Cloudflare",
      "Redis",
      "PostgreSQL",
      "MongoDB",
    ],
    highlights: [
      "Re-architected the 130-page CDD investment-deck pipeline as a dedicated microservice, hybrid AI + code flow (Claude fills HTML narrative placeholders, deterministic covers/TOCs/charts code-generated). Cut deck cost from $130–260 to ~$1.30 (99% reduction).",
      "Owned the LLM Engine: prompt routing, context assembly, schema validation, output normalization, Redis caching (~30% AI-call reduction), Claude/Gemini orchestration across reports, decks, admin and email workflows.",
      "Shipped Admin Panel + Deal Generator in 24 hours (React + FastAPI + RBAC + JWT + Apollo enrichment), 40+ internal users, zero production errors, supporting sales conversion incl. POINT Broadband.",
      "Launched the Fibre CDD vertical end-to-end in 7–8 days, backend, frontend, ingestion, geospatial mapping, opening a new commercial due-diligence revenue path.",
      "Built 60–70% of the Stripe international payments stack across 3 microservices (checkout, tax, geo-pricing, subscriptions, webhooks), zero transaction failures in production.",
      "Migrated transactional email from SendGrid → Amazon SES (IAM, identities, templates, smoke tests) as my first production project.",
      "Cut dev cloud spend from ~$3K to $1K–1.2K/month (~60%) via scheduled scaling on EKS/RDS with Terraform; kept envs recoverable in ~3 minutes. Cloudflare tuning reduced origin load ~20%.",
      "Built a QA regression agent (Python CLI/container) that diffs 15K–22K-line report JSONs for missing sections, numerical drift (±2% tolerance), and narrative changes, integrated with CI/Grafana.",
      "Rolled out Claude Code, OpenAI Codex, and Gemini CLI org-wide; WireMock POC for mock AI responses cut testing roundtrips. Compressed recurring product workflows from 3–4 days to ~1 day.",
      "Zero-downtime domain + Cloudflare security migration: DNS cutover, WAF hardening, HSTS, CSP, key rotation, audit logs.",
    ],
  },
  {
    company: "ViewR",
    companyHref: "https://viewr.app",
    role: "Software Engineering Intern",
    duration: "January 2025 – July 2025",
    location: "Remote",
    stack: ["React", "Elysia.js", "Python", "AWS Rekognition", "Docker", "Kubernetes"],
    highlights: [
      "Built cross-platform desktop app with Electron + React spanning 5 microservices (DMG in 8 weeks)",
      "Real-time ONVIF/RTSP video streaming at sub-100ms latency",
      "Deployed 4 AI/ML models for attendance and face recognition: 98%+ accuracy on 10,000+ daily requests",
    ],
  },
  {
    company: "IIT Mandi",
    companyHref: "https://www.iitmandi.ac.in",
    role: "Research Assistant (Intern)",
    duration: "May 2024 – September 2024",
    location: "Himachal Pradesh",
    stack: ["Python", "Keras", "NumPy", "Pandas", "Machine Learning"],
    highlights: [
      "Improved continuous authentication accuracy from 89% → 92% for banking apps",
      "Analyzed molecular olfaction with Graph Neural Networks across 15,000+ pharmaceutical compounds",
    ],
  },
];

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
  marginBottom: "24px",
  fontFamily: "var(--font-body)",
};

export default function ExperienceSection() {
  return (
    <div
      id="experience"
      style={{
        maxWidth: "1344px",
        margin: "0 auto",
        padding: "0 24px 48px",
      }}
    >
      <div style={{ borderTop: "1px solid #222", paddingTop: "32px" }}>
        <h2 style={SectionHeadingStyle}>
          <span>Experience</span>
        </h2>
        <p style={SubtitleStyle}>Where I&apos;ve worked.</p>

        <div>
          {experiences.map((exp) => (
            <div
              key={exp.company + exp.role}
              style={{
                backgroundColor: "#0f0f0f",
                border: "1px solid #222",
                borderRadius: "8px",
                padding: "20px 24px",
                marginBottom: "16px",
              }}
            >
              {/* Header row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#f0efe8",
                      marginRight: "6px",
                    }}
                  >
                    {exp.role}
                  </span>
                  <span style={{ color: "#888", fontSize: "15px" }}>at </span>
                  <Link
                    href={exp.companyHref}
                    target="_blank"
                    style={{
                      color: "#c8f000",
                      fontWeight: 600,
                      fontSize: "15px",
                      fontFamily: "var(--font-body)",
                      textDecoration: "none",
                    }}
                  >
                    {exp.company}
                  </Link>
                </div>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "14px",
                    color: "#888",
                    whiteSpace: "nowrap",
                  }}
                >
                  {exp.duration} · {exp.location}
                </span>
              </div>

              {/* Stack tags */}
              <div style={{ marginBottom: "12px" }}>
                {exp.stack.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      backgroundColor: "#141414",
                      border: "1px solid #333",
                      borderRadius: "4px",
                      padding: "2px 8px",
                      fontSize: "13px",
                      fontFamily: "monospace",
                      display: "inline-block",
                      marginRight: "4px",
                      marginBottom: "4px",
                      color: "#888",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bullet highlights */}
              <ul
                style={{
                  listStyle: "disc",
                  paddingLeft: "20px",
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {exp.highlights.map((point) => (
                  <li
                    key={point}
                    style={{
                      fontSize: "15px",
                      color: "#f0efe8",
                      lineHeight: 1.65,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
