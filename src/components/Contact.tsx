"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Github,
  Linkedin,
  ExternalLink,
  Copy,
  Check,
  Trophy,
} from "lucide-react";

const EMAIL = "yashs3324@gmail.com";

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/yashs33244",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yash-singh-2757aa1b4/",
    icon: Linkedin,
  },
  {
    label: "LeetCode",
    href: "https://leetcode.com/yashs33244",
    icon: ExternalLink,
  },
  {
    label: "Codeforces",
    href: "https://codeforces.com/profile/yashs3324",
    icon: ExternalLink,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/yash_s3324/",
    icon: ExternalLink,
  },
];

const achievements = [
  "4th Place — HD Crypto Wallet Hackathon",
  "Top 4 — AlgoUniversity",
  "7th Place — Music Similarity ML Challenge",
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = EMAIL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="section-py">
      <div className="section-container">
        {/* Section Label */}
        <p className="section-label">Contact</p>

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-txt mb-16 tracking-tight text-center"
          style={{ color: "#EDEDF0" }}
        >
          Let&apos;s Connect
        </motion.h2>

        {/* Email Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col items-center gap-5 mb-16"
        >
          <a
            href={`mailto:${EMAIL}`}
            className="
              font-mono text-lg sm:text-xl md:text-2xl text-accent
              hover:text-glow transition-all duration-300
            "
            style={{ color: "#00E5FF" }}
          >
            {EMAIL}
          </a>

          <button
            onClick={handleCopy}
            className={`
              inline-flex items-center gap-2 px-5 py-2.5 rounded-full
              border font-mono text-sm transition-all duration-300
              ${
                copied
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : "border-line bg-bg-surface text-txt-secondary hover:border-accent/30 hover:text-txt"
              }
            `}
            style={{
              borderColor: copied ? "rgba(0, 229, 255, 0.5)" : "#161624",
              backgroundColor: copied ? "rgba(0, 229, 255, 0.1)" : "#0A0A12",
              color: copied ? "#00E5FF" : "#8E8EA0",
            }}
          >
            {copied ? (
              <>
                <Check size={14} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy Email
              </>
            )}
          </button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl
                  border border-line bg-bg-surface text-txt-secondary
                  hover:border-accent/30 hover:text-txt hover:bg-bg-elevated
                  transition-all duration-300 font-mono text-sm
                  hover:shadow-[0_0_16px_rgba(0,229,255,0.05)]
                "
                style={{
                  borderColor: "#161624",
                  backgroundColor: "#0A0A12",
                  color: "#8E8EA0",
                }}
              >
                <Icon size={15} />
                {social.label}
              </a>
            );
          })}
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={14} className="text-accent" style={{ color: "#00E5FF" }} />
            <span
              className="font-mono text-xs uppercase tracking-widest text-txt-muted"
              style={{ color: "#5C5C6F" }}
            >
              Achievements
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {achievements.map((achievement) => (
              <span
                key={achievement}
                className="
                  inline-flex items-center px-3 py-1.5 rounded-full
                  border border-line bg-bg-surface text-txt-secondary
                  font-mono text-xs
                "
                style={{
                  borderColor: "#161624",
                  backgroundColor: "#0A0A12",
                  color: "#8E8EA0",
                }}
              >
                {achievement}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
