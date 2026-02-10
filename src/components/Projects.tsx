"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Github, ArrowUpRight, Users, Zap } from "lucide-react";
import { Badge } from "./ui/Badge";
import { GlowCard } from "./ui/GlowCard";
import { AnimatedText } from "./ui/AnimatedText";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  stat?: string;
  statIcon: "users" | "zap";
  github: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: "SynthaText",
    tagline: "AI-Powered Text-to-Slides",
    description:
      "Transform text into beautiful presentations using AI. Fully containerized with Docker and orchestrated on Kubernetes for production-grade reliability.",
    tech: ["AI/ML", "Docker", "Kubernetes", "Next.js", "Python"],
    github: "https://github.com/yashs33244/synthatext",
    featured: true,
    statIcon: "zap",
  },
  {
    title: "Resume Builder",
    tagline: "Smart Resume Generation",
    description:
      "AI-powered resume builder that has helped 1000+ users create professional resumes with Gemini API for intelligent content suggestions.",
    tech: ["Next.js", "Gemini API", "TypeScript", "Prisma"],
    stat: "1K+ users",
    statIcon: "users",
    github: "https://github.com/yashs33244/resume-builder",
    featured: true,
  },
  {
    title: "Payment System",
    tagline: "High-Throughput Fintech",
    description:
      "Full-stack payment processing platform handling 2000+ daily transactions with robust error handling and real-time processing.",
    tech: ["Next.js", "PostgreSQL", "Redis", "TypeScript"],
    stat: "2K+ daily txns",
    statIcon: "zap",
    github: "https://github.com/yashs33244/fin-app",
  },
  {
    title: "Chess Game",
    tagline: "Multiplayer Chess",
    description:
      "Real-time multiplayer chess with WebSocket communication, move validation, and an elegant dark interface.",
    tech: ["React", "WebSocket", "Node.js", "TypeScript"],
    github: "https://github.com/yashs33244/chess-game",
    statIcon: "zap",
  },
];

export function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card");
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="projects" ref={sectionRef} className="section-spacing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <span className="font-mono text-cyan text-xs mb-3 block tracking-wider">
            03 / PROJECTS
          </span>
          <AnimatedText
            text="What I've Built"
            as="h2"
            className="font-display text-4xl md:text-5xl lg:text-6xl text-text"
            scrollTrigger
          />
          <p className="text-text-secondary mt-4 max-w-xl text-base md:text-lg">
            Production systems, open-source tools, and creative experiments.
          </p>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className={`project-card ${
                project.featured ? "md:col-span-7" : "md:col-span-5"
              } ${i === 2 ? "md:col-span-5" : ""} ${i === 3 ? "md:col-span-7" : ""}`}
            >
              <GlowCard className="p-6 md:p-7 h-full">
                <div className="flex flex-col h-full">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg md:text-xl text-text font-display mb-1">
                        {project.title}
                      </h3>
                      <p className="font-mono text-xs text-cyan">
                        {project.tagline}
                      </p>
                    </div>
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="p-2 rounded-xl border border-border hover:border-cyan/20 text-text-muted hover:text-cyan transition-all flex-shrink-0"
                    >
                      <Github size={16} />
                    </motion.a>
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Stat */}
                  {project.stat && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-ghost border border-cyan/15">
                        {project.statIcon === "users" ? (
                          <Users size={11} className="text-cyan" />
                        ) : (
                          <Zap size={11} className="text-cyan" />
                        )}
                        <span className="font-mono text-[11px] text-cyan">
                          {project.stat}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tech */}
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-border">
                    {project.tech.map((t) => (
                      <Badge key={t} variant="default" size="sm">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </GlowCard>
            </div>
          ))}
        </div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <a
            href="https://github.com/yashs33244"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-text-secondary font-mono text-sm
              hover:border-cyan/20 hover:text-cyan transition-all duration-500 group"
          >
            View all on GitHub
            <ArrowUpRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
