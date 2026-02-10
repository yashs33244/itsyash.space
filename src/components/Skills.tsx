"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedText } from "./ui/AnimatedText";
import { Marquee } from "./ui/Marquee";

gsap.registerPlugin(ScrollTrigger);

interface SkillCategory {
  label: string;
  status: string;
  skills: string[];
}

const categories: SkillCategory[] = [
  {
    label: "LANGUAGES",
    status: "loaded",
    skills: ["Python", "TypeScript", "Go", "C++", "JavaScript", "SQL", "Rust", "Java"],
  },
  {
    label: "FRAMEWORKS",
    status: "active",
    skills: [
      "React",
      "Next.js",
      "FastAPI",
      "Node.js",
      "Electron",
      "Express",
      "TailwindCSS",
      "Prisma",
    ],
  },
  {
    label: "INFRASTRUCTURE",
    status: "running",
    skills: [
      "Kubernetes",
      "Docker",
      "AWS",
      "Helm",
      "Grafana",
      "Redis",
      "PostgreSQL",
      "Nginx",
      "CI/CD",
      "Git",
    ],
  },
  {
    label: "AI / ML / REAL-TIME",
    status: "active",
    skills: [
      "PyTorch",
      "Transformers",
      "GNN",
      "OpenCV",
      "LLM APIs",
      "AWS Rekognition",
      "WebSocket",
      "RTSP",
      "Gemini API",
    ],
  },
];

function SkillChip({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-bg-surface hover:border-cyan/20 hover:bg-bg-elevated transition-all duration-300 group whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-text-muted group-hover:bg-cyan transition-colors duration-300" />
      <span className="font-mono text-xs text-text-secondary group-hover:text-text transition-colors duration-300">
        {name}
      </span>
    </div>
  );
}

export function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".skill-row", {
        opacity: 0,
        y: 25,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-spacing overflow-hidden"
    >
      <div className="max-w-7xl mx-auto mb-14">
        <span className="font-mono text-cyan text-xs mb-3 block tracking-wider">
          04 / SKILLS
        </span>
        <AnimatedText
          text="System Status"
          as="h2"
          className="font-display text-4xl md:text-5xl lg:text-6xl text-text"
          scrollTrigger
        />
        <p className="text-text-secondary mt-4 max-w-xl text-base md:text-lg">
          Technologies currently loaded and running in production.
        </p>
      </div>

      {/* System-status style rows + marquee */}
      <div className="space-y-6">
        {categories.map((cat, i) => (
          <div key={cat.label} className="skill-row">
            {/* Category label */}
            <div className="max-w-7xl mx-auto px-6 mb-3 flex items-center gap-3">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.15em]">
                {cat.label}
              </span>
              <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                {cat.status}
              </span>
            </div>

            <Marquee
              direction={i % 2 === 0 ? "left" : "right"}
              duration={35 + i * 5}
            >
              {cat.skills.map((skill) => (
                <SkillChip key={skill} name={skill} />
              ))}
            </Marquee>
          </div>
        ))}
      </div>
    </section>
  );
}
