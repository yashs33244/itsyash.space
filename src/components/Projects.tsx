"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Github, ArrowUpRight } from "lucide-react";

/* ─── Data ───────────────────────────────────────── */

interface Project {
  number: string;
  title: string;
  description: string;
  github: string;
  tech: string[];
  large?: boolean;
}

const projects: Project[] = [
  {
    number: "01",
    title: "SynthaText",
    description: "AI-powered text-to-slides generator",
    github: "https://github.com/yashs33244/synthatext",
    tech: ["AI", "LLM", "Next.js"],
    large: true,
  },
  {
    number: "02",
    title: "Resume Builder",
    description: "Production resume builder with 1,000+ active users",
    github: "https://github.com/yashs33244/resume-builder",
    tech: ["Next.js", "Prisma", "PostgreSQL"],
  },
  {
    number: "03",
    title: "Payment System",
    description:
      "Financial transaction system handling 2,000+ daily transactions",
    github: "https://github.com/yashs33244/fin-app",
    tech: ["Node.js", "PostgreSQL", "Redis"],
  },
  {
    number: "04",
    title: "Chess Game",
    description: "Real-time multiplayer chess with WebSocket architecture",
    github: "https://github.com/yashs33244/chess-game",
    tech: ["WebSocket", "React", "TypeScript"],
    large: true,
  },
];

/* ─── Animation Variants ─────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, filter: "blur(6px)" },
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

/* ─── Project Card ───────────────────────────────── */

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`${project.large ? "md:col-span-2" : "md:col-span-1"}`}
    >
      <div
        className="card group relative h-full p-6 md:p-8 flex flex-col justify-between transition-all duration-500"
        style={{
          backgroundColor: "#0A0A12",
          borderColor: "#161624",
          minHeight: project.large ? "280px" : "240px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(0, 229, 255, 0.18)";
          e.currentTarget.style.boxShadow =
            "0 0 30px rgba(0, 229, 255, 0.04), 0 0 60px rgba(0, 229, 255, 0.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#161624";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* ── Number watermark ── */}
        <span
          className="absolute top-5 right-6 font-mono text-4xl md:text-5xl font-bold select-none pointer-events-none"
          style={{ color: "rgba(0, 229, 255, 0.07)" }}
          aria-hidden="true"
        >
          {project.number}
        </span>

        {/* ── Content ── */}
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Title Row */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3
              className="font-display text-xl md:text-2xl tracking-tight"
              style={{
                color: "#EDEDF0",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                fontWeight: 700,
              }}
            >
              {project.title}
            </h3>

            {/* GitHub Button */}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} on GitHub`}
              className="flex-shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-lg border transition-all duration-300 group/btn"
              style={{
                borderColor: "#161624",
                backgroundColor: "rgba(10, 10, 18, 0.6)",
                color: "#5C5C6F",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "rgba(0, 229, 255, 0.3)";
                e.currentTarget.style.color = "#00E5FF";
                e.currentTarget.style.backgroundColor =
                  "rgba(0, 229, 255, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#161624";
                e.currentTarget.style.color = "#5C5C6F";
                e.currentTarget.style.backgroundColor =
                  "rgba(10, 10, 18, 0.6)";
              }}
            >
              <Github size={16} />
            </a>
          </div>

          {/* Description */}
          <p
            className="text-sm md:text-[15px] leading-relaxed font-body mb-6 max-w-md"
            style={{ color: "#8E8EA0" }}
          >
            {project.description}
          </p>

          {/* Spacer to push tags to bottom */}
          <div className="flex-1" />

          {/* Footer: Tech tags + Arrow */}
          <div className="flex items-end justify-between gap-4">
            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 font-mono text-[11px] tracking-wide"
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

            {/* Arrow indicator */}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title} repository`}
              className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: "#5C5C6F" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#00E5FF")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#5C5C6F")
              }
            >
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>

        {/* ── Hover gradient wash ── */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 30% 80%, rgba(0,229,255,0.03) 0%, transparent 70%)",
          }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Projects Section ───────────────────────────── */

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative section-py overflow-hidden"
      style={{ backgroundColor: "#050508" }}
    >
      {/* Subtle radial wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 80% 50%, rgba(123,97,255,0.02) 0%, transparent 70%)",
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
          <span className="section-label mb-4 block">Projects</span>
          <h2
            className="font-display text-display-md"
            style={{ color: "#EDEDF0" }}
          >
            Things I&rsquo;ve Shipped
          </h2>
        </motion.div>

        {/* ── Asymmetric Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"
        >
          {/* Row 1: SynthaText (2 cols) + Resume Builder (1 col) */}
          <ProjectCard project={projects[0]} />
          <ProjectCard project={projects[1]} />

          {/* Row 2: Payment System (1 col) + Chess Game (2 cols) */}
          <ProjectCard project={projects[2]} />
          <ProjectCard project={projects[3]} />
        </motion.div>
      </div>
    </section>
  );
}
