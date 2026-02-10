"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ExternalLink, Camera } from "lucide-react";
import { GlowCard } from "./ui/GlowCard";
import { Badge } from "./ui/Badge";
import { AnimatedText } from "./ui/AnimatedText";
import { SpotifyNowPlaying } from "./SpotifyNowPlaying";

gsap.registerPlugin(ScrollTrigger);

const PROFILE_IMAGE = "/images/yash-profile.png";

const terminalLines = [
  '$ cat ~/.config/yash.toml',
  '',
  '[identity]',
  'name = "Yash Singh"',
  'role = "SDE Intern"',
  'org = "Binocs"',
  'location = "Bangalore, IN"',
  'education = "IIIT Una, B.Tech CS"',
  'gpa = 8.3',
  '',
  '[interests]',
  'active = ["distributed_systems", "k8s", "llm_infra", "real_time_systems"]',
];

function colorize(line: string): string {
  if (line.startsWith('$')) {
    return `<span class="text-success">${line}</span>`;
  }
  return line
    .replace(
      /\[([^\]]+)\]/g,
      '<span class="text-cyan">[$1]</span>'
    )
    .replace(
      /"([^"]+)"/g,
      '<span class="text-success">"$1"</span>'
    )
    .replace(
      /= ([\d.]+)$/gm,
      '= <span class="text-warning">$1</span>'
    )
    .replace(
      /^(\w+)\s*=/gm,
      '<span class="text-text">$1</span> ='
    );
}

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".about-card");
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.08,
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
    <section id="about" ref={sectionRef} className="section-spacing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <span className="font-mono text-cyan text-xs mb-3 block tracking-wider">
            01 / ABOUT
          </span>
          <AnimatedText
            text="Who I Am"
            as="h2"
            className="font-display text-4xl md:text-5xl lg:text-6xl text-text"
            scrollTrigger
          />
        </div>

        {/* Bento Grid - 12 column */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* ─── Bio card (8 cols) ──────────────── */}
          <GlowCard className="about-card md:col-span-8 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan" />
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.15em]">
                Bio
              </span>
            </div>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-4">
              I&apos;m a systems engineer who builds{" "}
              <span className="text-text font-medium">
                infrastructure that actually works at scale
              </span>
              . Currently at{" "}
              <span className="text-cyan">Binocs</span> in Bangalore, I
              architect microservices, design LLM pipelines, and manage
              Kubernetes clusters that handle real production traffic.
            </p>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-5">
              I don&apos;t just write code &mdash; I handle{" "}
              <span className="text-text font-medium">
                networking, Docker orchestration, CI/CD pipelines
              </span>
              , and the messy reality of distributed systems. Previously
              shipped a desktop app with 5 microservices at{" "}
              <span className="text-cyan">ViewR</span> (IIT Delhi startup)
              and conducted GNN/Transformer research at{" "}
              <span className="text-cyan">IIT Mandi</span>.
            </p>
            <p className="font-mono text-xs text-text-muted">
              4th year B.Tech CS @ IIIT Una &middot; GPA 8.3/10
            </p>
          </GlowCard>

          {/* ─── Photo card (4 cols) ────────────── */}
          <GlowCard className="about-card md:col-span-4 p-3">
            <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
              <span className="font-mono text-[10px] text-text-muted tracking-wider">
                about:// yash
              </span>
            </div>
            <div className="relative w-full aspect-square rounded-xl overflow-hidden group">
              <Image
                src={PROFILE_IMAGE}
                alt="Yash Singh"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
              <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-cyan/20 transition-colors duration-500" />
            </div>
          </GlowCard>

          {/* ─── Terminal card (6 cols) ─────────── */}
          <GlowCard className="about-card md:col-span-6 p-0">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-danger/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-warning/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-success/70" />
              </div>
              <span className="font-mono text-[10px] text-text-muted ml-2">
                ~/.config/yash.toml
              </span>
            </div>
            {/* Terminal body */}
            <pre className="font-mono text-xs leading-relaxed p-4 overflow-x-auto">
              <code>
                {terminalLines.map((line, i) => (
                  <div key={i} className="flex">
                    <span className="text-text-muted/40 mr-3 select-none w-4 text-right text-[10px]">
                      {i + 1}
                    </span>
                    <span
                      className="text-text-secondary"
                      dangerouslySetInnerHTML={{
                        __html: colorize(line) || "&nbsp;",
                      }}
                    />
                  </div>
                ))}
                <div className="flex mt-1">
                  <span className="text-text-muted/40 mr-3 select-none w-4 text-right text-[10px]">
                    {terminalLines.length + 1}
                  </span>
                  <span className="text-success">
                    $<span className="animate-blink text-cyan ml-1">_</span>
                  </span>
                </div>
              </code>
            </pre>
          </GlowCard>

          {/* ─── Competitive coding (3 cols) ────── */}
          <GlowCard className="about-card md:col-span-3 p-5">
            <div className="flex flex-col h-full">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.15em] mb-4">
                Competitive Coding
              </span>

              <a
                href="https://leetcode.com/yashs33244"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-2.5 border-b border-border group"
              >
                <div>
                  <p className="text-sm text-text font-medium">LeetCode</p>
                  <p className="font-mono text-[10px] text-text-muted">
                    @yashs33244
                  </p>
                </div>
                <ExternalLink
                  size={12}
                  className="text-text-muted group-hover:text-cyan transition-colors"
                />
              </a>

              <a
                href="https://codeforces.com/profile/yashs3324"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-2.5 group"
              >
                <div>
                  <p className="text-sm text-text font-medium">Codeforces</p>
                  <p className="font-mono text-[10px] text-text-muted">
                    @yashs3324
                  </p>
                </div>
                <ExternalLink
                  size={12}
                  className="text-text-muted group-hover:text-cyan transition-colors"
                />
              </a>
            </div>
          </GlowCard>

          {/* ─── Photography card (3 cols) ──────── */}
          <GlowCard className="about-card md:col-span-3 p-5">
            <a
              href="https://www.instagram.com/yash_s3324/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col h-full group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet/20 to-cyan/10 flex items-center justify-center mb-4">
                <Camera size={18} className="text-violet" />
              </div>
              <p className="text-sm text-text font-medium mb-1">
                Through the Lens
              </p>
              <p className="text-xs text-text-muted leading-relaxed mb-3">
                I also capture moments
              </p>
              <Badge variant="outline" size="sm" className="mt-auto w-fit">
                @yash_s3324
              </Badge>
            </a>
          </GlowCard>

          {/* ─── Spotify (6 cols) ───────────────── */}
          <div className="about-card md:col-span-6">
            <SpotifyNowPlaying />
          </div>
        </div>
      </div>
    </section>
  );
}
