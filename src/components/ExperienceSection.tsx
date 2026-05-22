import Link from "next/link";

const experiences = [
  {
    company: "Binocs",
    companyHref: "https://binocs.co",
    role: "Software Development Engineer",
    duration: "July 2025 – Present",
    location: "Onsite, Bangalore",
    stack: ["Python", "FastAPI", "Go", "React", "AWS", "Kubernetes", "Terraform", "Claude", "Docker"],
    highlights: [
      "Reduced Claude API cost by 99% ($1.00 → $0.01/slide) by redesigning the AI pipeline with prompt chaining",
      "Shipped 5+ production AI agents with human-in-the-loop orchestration",
      "Launched full-stack admin dashboard in 24 hours (React + FastAPI + Terraform + K8s) serving 40+ users",
      "Integrated Stripe payments across 3 microservices with zero transaction failures",
      "Cut dev environment costs 40% via infrastructure and CI/CD optimization",
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
