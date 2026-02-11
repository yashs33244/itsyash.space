"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ExternalLink,
  Calendar,
  MapPin,
  Play,
  Instagram,
} from "lucide-react";

/* ─── Data ───────────────────────────────────────── */

interface ExperienceEntry {
  role: string;
  company: string;
  companyUrl?: string;
  period: string;
  location?: string;
  active?: boolean;
  tech: string[];
  bullets: string[];
  links?: { label: string; url: string; icon: "play" | "instagram" | "external" }[];
}

const experiences: ExperienceEntry[] = [
  {
    role: "SDE Intern",
    company: "Binocs",
    period: "Jul 2025 — Present",
    location: "Bangalore, IN",
    active: true,
    tech: ["Python", "FastAPI", "AWS", "Docker", "Helm", "Grafana", "Go"],
    bullets: [
      "Built admin dashboard with CI/CD pipeline and microservices proxy serving 40+ users",
      "Engineered LLM-powered sales workflows: portfolio deck generation, email sequencing, CRM integration — 100+ campaigns/month, 40% conversion",
      "Refactored 6000+ LOC PPT pipeline, achieving 20% LLM API cost reduction via async optimization",
      "Implemented AWS SES/SQS notification system: 500+ daily emails, 98% delivery rate with Grafana dashboards",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "ViewR",
    companyUrl: "https://viewr.in/",
    period: "Jan 2025 — Jul 2025",
    location: "IIT Delhi Startup",
    tech: ["Electron", "React", "Python", "Kubernetes", "AWS Rekognition"],
    bullets: [
      "Built Electron + React desktop app with 5 microservices for real-time video processing",
      "Achieved sub-100ms latency for live video streams using optimized RTSP pipelines",
      "Deployed 4 AI/ML models including AWS Rekognition with 98%+ accuracy",
      "Managed Kubernetes infrastructure for production deployment",
    ],
    links: [
      {
        label: "Demo Video",
        url: "https://drive.google.com/file/d/1pBk5vLbvhIoxj_DxfUEF6_LRfk80NcWH/view",
        icon: "play",
      },
      {
        label: "Instagram Reel",
        url: "https://www.instagram.com/reel/DSfPSaODffL/?igsh=Nm5yMzF4cTk1YzY=",
        icon: "instagram",
      },
    ],
  },
  {
    role: "Research Assistant",
    company: "IIT Mandi",
    period: "May 2024 — Sep 2024",
    tech: ["PyTorch", "GNN", "Transformers", "ML"],
    bullets: [
      "Improved continuous authentication accuracy from 89% to 92%",
      "Built GNN-based molecular olfaction prediction model",
      "Conducted Transformer-based NLP experiments",
    ],
  },
];

/* ─── Animation Variants ─────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

/* ─── Link Icon Map ──────────────────────────────── */

const linkIconMap = {
  play: Play,
  instagram: Instagram,
  external: ExternalLink,
};

/* ─── Timeline Entry ─────────────────────────────── */

function TimelineEntry({
  entry,
  index,
}: {
  entry: ExperienceEntry;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative pl-8 md:pl-12"
    >
      {/* ── Timeline Node ── */}
      <div className="absolute left-0 top-2 flex items-center justify-center">
        {/* Glow ring for active entry */}
        {entry.active && (
          <span
            className="absolute h-5 w-5 rounded-full animate-ping"
            style={{ backgroundColor: "rgba(0, 229, 255, 0.2)" }}
          />
        )}
        <span
          className="relative z-10 h-3 w-3 rounded-full border-2"
          style={{
            borderColor: index === 0 ? "#00E5FF" : "#161624",
            backgroundColor: index === 0 ? "#00E5FF" : "#0A0A12",
            boxShadow:
              index === 0
                ? "0 0 12px rgba(0, 229, 255, 0.4), 0 0 30px rgba(0, 229, 255, 0.15)"
                : "none",
          }}
        />
      </div>

      {/* ── Card ── */}
      <div
        className="card p-5 md:p-7 group"
        style={{
          backgroundColor: "#0A0A12",
          borderColor: "#161624",
        }}
      >
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
          <div className="flex-1">
            {/* Role */}
            <h3
              className="font-display text-lg md:text-xl tracking-tight"
              style={{ color: "#EDEDF0", lineHeight: 1.2, letterSpacing: "-0.02em", fontWeight: 700 }}
            >
              {entry.role}
            </h3>

            {/* Company */}
            <div className="flex items-center gap-1.5 mt-1">
              {entry.companyUrl ? (
                <a
                  href={entry.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium transition-colors duration-300 hover:underline underline-offset-4"
                  style={{ color: "#00E5FF" }}
                >
                  {entry.company}
                  <ExternalLink
                    size={13}
                    className="opacity-60"
                    style={{ color: "#00E5FF" }}
                  />
                </a>
              ) : (
                <span
                  className="font-medium"
                  style={{ color: "#00E5FF" }}
                >
                  {entry.company}
                </span>
              )}
            </div>
          </div>

          {/* Active Badge */}
          {entry.active && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider whitespace-nowrap self-start"
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                color: "#22C55E",
                border: "1px solid rgba(34, 197, 94, 0.2)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: "#22C55E" }}
              />
              Active
            </span>
          )}
        </div>

        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-5">
          <span
            className="inline-flex items-center gap-1.5 font-mono text-xs"
            style={{ color: "#8E8EA0" }}
          >
            <Calendar size={12} style={{ color: "#5C5C6F" }} />
            {entry.period}
          </span>
          {entry.location && (
            <span
              className="inline-flex items-center gap-1.5 font-mono text-xs"
              style={{ color: "#8E8EA0" }}
            >
              <MapPin size={12} style={{ color: "#5C5C6F" }} />
              {entry.location}
            </span>
          )}
        </div>

        {/* Bullets */}
        <ul className="space-y-2.5 mb-5">
          {entry.bullets.map((bullet, i) => (
            <li
              key={i}
              className="relative pl-4 text-sm leading-relaxed font-body"
              style={{ color: "#8E8EA0" }}
            >
              <span
                className="absolute left-0 top-[9px] h-1 w-1 rounded-full"
                style={{ backgroundColor: "#00E5FF", opacity: 0.5 }}
              />
              {bullet}
            </li>
          ))}
        </ul>

        {/* Tech Tags */}
        <div className="flex flex-wrap gap-2 mb-1">
          {entry.tech.map((tag) => (
            <span
              key={tag}
              className="rounded-full px-3 py-1 font-mono text-[11px] tracking-wide transition-colors duration-300"
              style={{
                backgroundColor: "rgba(0, 229, 255, 0.05)",
                color: "rgba(0, 229, 255, 0.7)",
                border: "1px solid rgba(0, 229, 255, 0.08)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Extra Links */}
        {entry.links && entry.links.length > 0 && (
          <div
            className="flex flex-wrap gap-3 mt-4 pt-4"
            style={{ borderTop: "1px solid rgba(22, 22, 36, 0.6)" }}
          >
            {entry.links.map((link) => {
              const Icon = linkIconMap[link.icon];
              return (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wide transition-all duration-300 hover:gap-2"
                  style={{ color: "#8E8EA0" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#00E5FF")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#8E8EA0")
                  }
                >
                  <Icon size={13} />
                  {link.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Experience Section ─────────────────────────── */

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative section-py overflow-hidden"
    >
      {/* Subtle radial wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 20% 50%, rgb(var(--accent-rgb) / 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="section-container relative z-10">
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-20"
        >
          <span className="section-label mb-4 block">Experience</span>
          <h2
            className="font-display text-display-md"
            style={{ color: "#EDEDF0" }}
          >
            Where I&rsquo;ve Built
          </h2>
        </motion.div>

        {/* ── Timeline ── */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className="absolute left-[5px] md:left-[5px] top-0 bottom-0 w-px"
            style={{
              background:
                "linear-gradient(to bottom, #00E5FF 0%, rgba(22, 22, 36, 0.8) 30%, rgba(22, 22, 36, 0.4) 70%, transparent 100%)",
            }}
          />

          {/* Entries */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-col gap-8 md:gap-10"
          >
            {experiences.map((entry, index) => (
              <TimelineEntry key={entry.company} entry={entry} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
