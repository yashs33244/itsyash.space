"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Github,
  Linkedin,
  Copy,
  Check,
  ArrowUpRight,
  Code2,
  Trophy,
} from "lucide-react";
import { AnimatedText } from "./ui/AnimatedText";
import { MagneticButton } from "./ui/MagneticButton";
import { GlowCard } from "./ui/GlowCard";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/yashs33244",
    icon: <Github size={18} />,
    handle: "@yashs33244",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/yash-singh-2757aa1b4/",
    icon: <Linkedin size={18} />,
    handle: "Yash Singh",
  },
  {
    label: "LeetCode",
    href: "https://leetcode.com/yashs33244",
    icon: <Code2 size={18} />,
    handle: "@yashs33244",
  },
  {
    label: "Codeforces",
    href: "https://codeforces.com/profile/yashs3324",
    icon: <Trophy size={18} />,
    handle: "@yashs3324",
  },
];

const achievements = [
  "4th place HD crypto wallet",
  "Top 4 AlgoUniversity",
  "7th Music Similarity ML",
];

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const email = "yashs3324@gmail.com";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>(".contact-el");
      els.forEach((el, i) => {
        gsap.from(el, {
          y: 35,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="contact" ref={sectionRef} className="section-spacing">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12 contact-el">
          <span className="font-mono text-cyan text-xs mb-3 block tracking-wider">
            06 / CONTACT
          </span>
          <AnimatedText
            text="Let's Build Something"
            as="h2"
            className="font-display text-4xl md:text-5xl lg:text-6xl text-text"
            scrollTrigger
          />
          <p className="text-text-secondary mt-4 max-w-lg mx-auto text-base md:text-lg">
            Got an idea or want to collaborate? I&apos;m always open to
            discussing new opportunities.
          </p>
        </div>

        {/* Email CTA */}
        <div className="contact-el mb-10">
          <MagneticButton>
            <button
              onClick={copyEmail}
              className="group relative inline-flex items-center gap-3 px-7 py-4 rounded-2xl border border-border
                bg-bg-surface hover:border-cyan/20 hover:bg-bg-elevated transition-all duration-500"
            >
              <Mail size={17} className="text-cyan" />
              <span className="font-mono text-text text-base md:text-lg">
                {email}
              </span>
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-success"
                  >
                    <Check size={17} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-text-muted group-hover:text-cyan transition-colors"
                  >
                    <Copy size={17} />
                  </motion.span>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-success/10 border border-success/20 text-success font-mono text-xs"
                  >
                    Copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </MagneticButton>
        </div>

        {/* Social grid */}
        <div className="contact-el grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {socials.map((s) => (
            <GlowCard key={s.label} className="p-5" hoverLift>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 group"
              >
                <span className="text-text-muted group-hover:text-cyan transition-colors duration-300">
                  {s.icon}
                </span>
                <div>
                  <p className="text-sm text-text font-medium flex items-center gap-1 justify-center">
                    {s.label}
                    <ArrowUpRight
                      size={11}
                      className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </p>
                  <p className="font-mono text-[10px] text-text-muted">
                    {s.handle}
                  </p>
                </div>
              </a>
            </GlowCard>
          ))}
        </div>

        {/* Achievements */}
        <div className="contact-el">
          <p className="font-mono text-[10px] text-text-muted uppercase tracking-[0.15em] mb-4">
            Achievements
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
            {achievements.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-text-secondary"
              >
                <Trophy size={11} className="text-warning flex-shrink-0" />
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
