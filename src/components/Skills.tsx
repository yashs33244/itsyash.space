"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const skillCategories = [
  {
    name: "Languages",
    items: ["Python", "TypeScript", "Go", "C++", "JavaScript", "SQL", "Rust", "Java"],
  },
  {
    name: "Frameworks",
    items: ["React", "Next.js", "FastAPI", "Node.js", "Electron", "Express", "TailwindCSS", "Prisma"],
  },
  {
    name: "Infrastructure",
    items: ["Kubernetes", "Docker", "AWS", "Helm", "Grafana", "Redis", "PostgreSQL", "Nginx", "CI/CD", "Git"],
  },
  {
    name: "AI/ML",
    items: ["PyTorch", "Transformers", "GNN", "OpenCV", "LLM APIs", "AWS Rekognition", "WebSocket", "Gemini API"],
  },
];

const allSkills = skillCategories.flatMap((cat) => cat.items);

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.58, 1] as [number, number, number, number] },
  },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0, 0, 0.58, 1] as [number, number, number, number] },
  },
};

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="skills" ref={sectionRef} className="section-py">
      <div className="section-container">
        {/* Section Label */}
        <p className="section-label">Skills</p>

        {/* Section Heading */}
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-txt mb-12 tracking-tight"
            style={{ color: "#EDEDF0" }}>
          System Status
        </h2>

        {/* Skill Categories Dashboard */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-6 mb-16"
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.name}
              variants={rowVariants}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
            >
              {/* Category Name */}
              <span
                className="font-mono text-accent text-sm uppercase tracking-widest shrink-0 w-32"
                style={{ color: "#00E5FF" }}
              >
                {category.name}
              </span>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-2">
                {category.items.map((skill, idx) => (
                  <motion.span
                    key={skill}
                    variants={tagVariants}
                    custom={idx}
                    className="
                      font-mono text-xs px-3 py-1.5 rounded-full
                      border border-line bg-bg-surface text-txt-secondary
                      hover:border-accent/40 hover:text-txt hover:shadow-[0_0_12px_rgba(0,229,255,0.08)]
                      transition-all duration-300 cursor-default select-none
                    "
                    style={{
                      borderColor: "rgba(22, 22, 36, 1)",
                      backgroundColor: "rgba(10, 10, 18, 1)",
                      color: "#8E8EA0",
                    }}
                    whileHover={{
                      borderColor: "rgba(0, 229, 255, 0.4)",
                      color: "#EDEDF0",
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Marquee Ticker */}
        <div className="relative overflow-hidden py-4 border-t border-b border-line"
             style={{ borderColor: "#161624" }}>
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-bg to-transparent pointer-events-none"
               style={{ background: "linear-gradient(to right, #050508, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-bg to-transparent pointer-events-none"
               style={{ background: "linear-gradient(to left, #050508, transparent)" }} />

          <div className="flex animate-marquee whitespace-nowrap">
            {/* First copy */}
            <div className="flex gap-6 mr-6">
              {allSkills.map((skill, i) => (
                <span
                  key={`marquee-a-${i}`}
                  className="font-mono text-xs text-txt-muted"
                  style={{ color: "#5C5C6F" }}
                >
                  {skill}
                </span>
              ))}
            </div>
            {/* Duplicate for seamless loop */}
            <div className="flex gap-6 mr-6" aria-hidden="true">
              {allSkills.map((skill, i) => (
                <span
                  key={`marquee-b-${i}`}
                  className="font-mono text-xs text-txt-muted"
                  style={{ color: "#5C5C6F" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
