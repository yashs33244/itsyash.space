"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ExternalLink, Play, Award, MapPin, Calendar } from "lucide-react";
import { Badge } from "./ui/Badge";
import { GlowCard } from "./ui/GlowCard";
import { AnimatedText } from "./ui/AnimatedText";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  tech: string[];
  links?: { label: string; url: string; icon: "external" | "play" | "award" }[];
  accent: string;
}

const experiences: ExperienceEntry[] = [
  {
    company: "Binocs",
    role: "SDE Intern",
    period: "Jul 2025 — Present",
    location: "Bangalore, India",
    bullets: [
      "Admin dashboard with CI/CD, microservices proxy serving 40+ internal users",
      "LLM sales workflows: portfolio deck gen, email sequencing, CRM — 100+ campaigns/month, 40% conversion improvement",
      "Refactored 6000+ LOC PPT pipeline, 20% LLM API improvement via async Python",
      "AWS SES/SQS: 500+ daily notifications, 98% delivery rate, full Grafana dashboards",
    ],
    tech: ["Python", "FastAPI", "AWS", "Docker", "Helm", "Grafana", "Go"],
    accent: "0, 229, 255",
  },
  {
    company: "ViewR",
    role: "SWE Intern",
    period: "Jan — Jul 2025",
    location: "IIT Delhi Startup",
    bullets: [
      "Electron + React desktop app with 5 microservices architecture",
      "Real-time video streaming (ONVIF, RTSP, WebSocket) with sub-100ms latency",
      "4 AI/ML models + AWS Rekognition, 98%+ accuracy on 10K+ daily requests",
      "Kubernetes infrastructure: ingress, load balancing, Redis, PostgreSQL",
    ],
    tech: [
      "Electron",
      "React",
      "RTSP",
      "WebSocket",
      "Kubernetes",
      "AWS",
      "Redis",
      "PostgreSQL",
    ],
    links: [
      {
        label: "View Demo",
        url: "https://drive.google.com/file/d/1pBk5vLbvhIoxj_DxfUEF6_LRfk80NcWH/view",
        icon: "play",
      },
      {
        label: "Acknowledgment",
        url: "https://www.instagram.com/reel/DSfPSaODffL/?igsh=Nm5yMzF4cTk1YzY=",
        icon: "award",
      },
      {
        label: "Visit Site",
        url: "https://viewr.in/",
        icon: "external",
      },
    ],
    accent: "123, 97, 255",
  },
  {
    company: "IIT Mandi",
    role: "Research Assistant",
    period: "May — Sep 2024",
    location: "Himachal Pradesh, India",
    bullets: [
      "Continuous authentication research: improved accuracy from 89% to 92%",
      "GNN-based molecular olfaction model for predicting smell properties",
      "Transformer-based NLP experiments for language understanding tasks",
    ],
    tech: ["Python", "PyTorch", "GNN", "Transformers", "NLP", "ML"],
    accent: "139, 92, 246",
  },
];

function LinkIcon({ type }: { type: "external" | "play" | "award" }) {
  switch (type) {
    case "play":
      return <Play size={11} />;
    case "award":
      return <Award size={11} />;
    default:
      return <ExternalLink size={11} />;
  }
}

export function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".exp-card");
      cards.forEach((card) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 87%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="experience" ref={sectionRef} className="section-spacing">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <span className="font-mono text-cyan text-xs mb-3 block tracking-wider">
            02 / WORK
          </span>
          <AnimatedText
            text="Where I've Built"
            as="h2"
            className="font-display text-4xl md:text-5xl lg:text-6xl text-text"
            scrollTrigger
          />
        </div>

        {/* Cards stack */}
        <div className="space-y-5">
          {experiences.map((exp, i) => (
            <div key={i} className="exp-card">
              <GlowCard
                className="p-6 md:p-8"
                glowColor={exp.accent}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: `rgb(${exp.accent})`,
                          boxShadow: `0 0 8px rgba(${exp.accent}, 0.4)`,
                        }}
                      />
                      <h3 className="text-xl md:text-2xl text-text font-display">
                        {exp.company}
                      </h3>
                    </div>
                    <p className="text-text-secondary text-sm ml-[18px]">
                      {exp.role}
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1 ml-[18px] sm:ml-0">
                    <div className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
                      <Calendar size={11} />
                      {exp.period}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
                      <MapPin size={11} />
                      {exp.location}
                    </div>
                  </div>
                </div>

                {/* Bullets */}
                <ul className="space-y-2.5 mb-5">
                  {exp.bullets.map((bullet, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed"
                    >
                      <span
                        className="mt-2 w-1 h-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: `rgb(${exp.accent})` }}
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>

                {/* Tech */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {exp.tech.map((t) => (
                    <Badge key={t} variant="default" size="sm">
                      {t}
                    </Badge>
                  ))}
                </div>

                {/* Links */}
                {exp.links && (
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                    {exp.links.map((link) => (
                      <motion.a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 2 }}
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-cyan hover:text-cyan/70 transition-colors"
                      >
                        <LinkIcon type={link.icon} />
                        {link.label}
                      </motion.a>
                    ))}
                  </div>
                )}
              </GlowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
