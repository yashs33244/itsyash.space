"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Status bar fade in
      if (statusRef.current) {
        tl.from(statusRef.current, {
          y: -20,
          opacity: 0,
          duration: 0.6,
        });
      }

      // YASH - staggered letter reveal
      if (line1Ref.current) {
        const chars = line1Ref.current.querySelectorAll(".hero-letter");
        tl.from(
          chars,
          {
            y: 140,
            rotateX: -50,
            opacity: 0,
            stagger: 0.05,
            duration: 1,
          },
          "-=0.2"
        );
      }

      // Marquee line
      if (marqueeRef.current) {
        tl.from(
          marqueeRef.current,
          {
            scaleX: 0,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5"
        );
      }

      // SINGH - staggered letter reveal
      if (line2Ref.current) {
        const chars = line2Ref.current.querySelectorAll(".hero-letter");
        tl.from(
          chars,
          {
            y: 140,
            rotateX: -50,
            opacity: 0,
            stagger: 0.05,
            duration: 1,
          },
          "-=0.7"
        );
      }

      // Tagline
      if (taglineRef.current) {
        tl.from(
          taglineRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.4"
        );
      }

      // Scroll indicator
      if (scrollRef.current) {
        tl.from(
          scrollRef.current,
          {
            opacity: 0,
            duration: 0.5,
          },
          "-=0.1"
        );
      }
    },
    { scope: containerRef }
  );

  const marqueeWords = [
    "systems",
    "infrastructure",
    "kubernetes",
    "ml",
    "production",
    "real-time",
    "devops",
    "distributed",
  ];

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ─── Background layers ─────────────────── */}
      <div className="absolute inset-0 bg-dot-grid opacity-50" />

      {/* Drifting radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-cyan/[0.03] blur-[150px] animate-gradient-drift" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet/[0.02] blur-[120px]" />

      {/* Subtle scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02]">
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan to-transparent animate-scan-line" />
      </div>

      {/* ─── Content ───────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8">
        {/* Status line */}
        <div
          ref={statusRef}
          className="flex items-center gap-2.5 mb-10 md:mb-14 justify-center"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="font-mono text-xs md:text-sm text-text-secondary tracking-wide">
            SDE Intern @ Binocs, Bangalore
          </span>
        </div>

        {/* Name typography */}
        <div className="text-center">
          <h1 className="sr-only">Yash Singh</h1>

          {/* YASH */}
          <div
            ref={line1Ref}
            className="overflow-hidden"
            style={{ perspective: "800px" }}
            aria-hidden="true"
          >
            <span className="font-display text-[15vw] md:text-[12vw] lg:text-[10vw] text-text leading-[0.9] tracking-tighter block">
              {"YASH".split("").map((char, i) => (
                <span key={i} className="hero-letter inline-block">
                  {char}
                </span>
              ))}
            </span>
          </div>

          {/* Animated keyword marquee between lines */}
          <div
            ref={marqueeRef}
            className="relative flex items-center gap-4 my-3 md:my-4 origin-left"
            aria-hidden="true"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="overflow-hidden max-w-xs md:max-w-md">
              <div className="flex gap-4 animate-marquee" style={{ "--duration": "20s" } as React.CSSProperties}>
                {[...marqueeWords, ...marqueeWords].map((word, i) => (
                  <span
                    key={i}
                    className="font-mono text-[10px] md:text-xs text-text-muted whitespace-nowrap uppercase tracking-widest"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* SINGH */}
          <div
            ref={line2Ref}
            className="overflow-hidden"
            style={{ perspective: "800px" }}
            aria-hidden="true"
          >
            <span className="font-display text-[15vw] md:text-[12vw] lg:text-[10vw] text-text leading-[0.9] tracking-tighter block">
              {"SINGH".split("").map((char, i) => (
                <span key={i} className="hero-letter inline-block">
                  {char}
                </span>
              ))}
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-center text-text-secondary text-base md:text-lg mt-8 md:mt-10 max-w-xl mx-auto leading-relaxed"
        >
          Building production systems that solve real problems
        </p>
      </div>

      {/* ─── Scroll indicator ──────────────────── */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[9px] text-text-muted uppercase tracking-[0.2em]">
          Scroll
        </span>
        <div className="w-5 h-8 rounded-full border border-border flex items-start justify-center pt-1.5">
          <ChevronDown
            size={10}
            className="text-cyan animate-scroll-hint"
          />
        </div>
      </div>
    </section>
  );
}
