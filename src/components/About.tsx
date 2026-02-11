"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import SpotifyNowPlaying from "./SpotifyNowPlaying";
import GitHubGraph from "./GitHubGraph";
import { useSpotify } from "@/context/SpotifyContext";

/* ── Animation helpers ── */
const cardVariants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.1 + i * 0.12,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

/* ── Reusable card wrapper ── */
function GridCard({
  children,
  className = "",
  index = 0,
  inView = false,
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
  inView?: boolean;
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={`card group rounded-2xl border p-5 md:p-6 transition-all duration-500 hover:border-[var(--accent)]/20 ${className}`}
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--line)",
        transition: "background-color 1.5s ease, border-color 1.5s ease",
      }}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const { track } = useSpotify();
  const accent = track?.accentColor || "#00E5FF";

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-py relative overflow-hidden"
    >
      <div className="section-container">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-label">About</span>
        </motion.div>

        {/* Bento Grid */}
        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-auto">
          {/* 1. Bio Card */}
          <GridCard
            className="md:col-span-2 lg:col-span-2 lg:row-span-2 flex flex-col justify-between"
            index={0}
            inView={isInView}
          >
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4"
                style={{ color: "#5C5C6F" }}
              >
                Bio
              </p>
              <p
                className="font-body text-sm md:text-[15px] leading-relaxed md:leading-[1.75]"
                style={{ color: "#8E8EA0" }}
              >
                I&apos;m a 4th year CS student at IIIT Una, currently pursuing
                an internship at{" "}
                <a
                  href="https://binocs.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:underline underline-offset-4"
                  style={{ color: accent }}
                >
                  Binocs.co
                </a>
                , Bangalore. I build production infrastructure that doesn&apos;t
                fail — microservices, CI/CD pipelines, Kubernetes clusters, and
                LLM-powered workflows.
              </p>
              <p
                className="font-body text-sm md:text-[15px] leading-relaxed md:leading-[1.75] mt-4"
                style={{ color: "#8E8EA0" }}
              >
                Sure, you can use AI to build systems. But if you want{" "}
                <span style={{ color: "#EDEDF0", fontWeight: 500 }}>
                  production-grade systems
                </span>{" "}
                that handle real traffic, survive edge cases, and don&apos;t
                crumble at 3 AM — you need someone who&apos;s built them. From
                Kubernetes orchestration to real-time video pipelines with
                sub-100ms latency, I ship things that work under pressure.
              </p>
              <p
                className="font-body text-sm md:text-[15px] leading-relaxed md:leading-[1.75] mt-4"
                style={{ color: "#8E8EA0" }}
              >
                When I&apos;m not writing code, I&apos;m behind a camera lens
                — capturing the world one frame at a time.
              </p>
            </div>

            {/* Decorative line */}
            <div className="mt-6 flex items-center gap-2">
              <div
                className="h-px flex-1 transition-colors duration-1000"
                style={{ backgroundColor: "var(--line)" }}
              />
              <span
                className="font-mono text-[10px] transition-colors duration-1000"
                style={{ color: "#5C5C6F" }}
              >
                //
              </span>
            </div>
          </GridCard>

          {/* 2. Profile Photo Card */}
          <GridCard
            className="md:col-span-1 lg:col-span-2 flex items-center justify-center overflow-hidden"
            index={1}
            inView={isInView}
          >
            <div
              className="relative w-full aspect-square max-w-[320px] rounded-xl overflow-hidden transition-shadow duration-500"
              style={{
                boxShadow: `0 0 0px transparent`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 40px -12px ${accent}26`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0px transparent`;
              }}
            >
              <div
                className="absolute inset-0 rounded-xl border-2 border-transparent transition-all duration-500 group-hover:border-[var(--accent)]/30 z-10 pointer-events-none"
              />
              <Image
                src="/images/yash-profile.png"
                alt="Yash Singh — Software Engineer"
                width={800}
                height={800}
                priority
                className="w-full h-full object-cover rounded-xl"
                style={{ filter: "saturate(0.9) contrast(1.05)" }}
              />
            </div>
          </GridCard>

          {/* 3. Location Card */}
          <GridCard
            className="md:col-span-1 lg:col-span-1"
            index={2}
            inView={isInView}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-[0.2em] mb-3"
              style={{ color: "#5C5C6F" }}
            >
              Location
            </p>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping transition-colors duration-1000"
                  style={{
                    backgroundColor: accent,
                    animationDuration: "2s",
                  }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2 transition-colors duration-1000"
                  style={{ backgroundColor: accent }}
                />
              </span>
              <span
                className="font-display text-lg md:text-xl font-medium"
                style={{ color: "#EDEDF0" }}
              >
                Bangalore, IN
              </span>
            </div>
          </GridCard>

          {/* 4. Education Card */}
          <GridCard
            className="md:col-span-1 lg:col-span-1"
            index={3}
            inView={isInView}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-[0.2em] mb-3"
              style={{ color: "#5C5C6F" }}
            >
              Education
            </p>
            <p
              className="font-display text-lg md:text-xl font-medium"
              style={{ color: "#EDEDF0" }}
            >
              B.Tech CS
            </p>
            <p
              className="font-body text-sm mt-1"
              style={{ color: "#8E8EA0" }}
            >
              IIIT Una
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span
                className="font-mono text-xs transition-colors duration-500"
                style={{ color: accent }}
              >
                GPA 8.3/10
              </span>
              <span
                className="font-mono text-[11px]"
                style={{ color: "#5C5C6F" }}
              >
                2022–2026
              </span>
            </div>
          </GridCard>

          {/* 5. Currently Card */}
          <GridCard
            className="md:col-span-1 lg:col-span-1"
            index={4}
            inView={isInView}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-[0.2em] mb-3"
              style={{ color: "#5C5C6F" }}
            >
              Currently
            </p>
            <p
              className="font-display text-lg md:text-xl font-medium"
              style={{ color: "#EDEDF0" }}
            >
              SDE Intern
            </p>
            <p
              className="font-body text-sm mt-1"
              style={{ color: "#8E8EA0" }}
            >
              @ Binocs
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
                  style={{
                    backgroundColor: "#22C55E",
                    animationDuration: "1.8s",
                  }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: "#22C55E" }}
                />
              </span>
              <span
                className="font-mono text-xs"
                style={{ color: "#22C55E" }}
              >
                Active
              </span>
            </div>
          </GridCard>

          {/* 6. Spotify Card */}
          <GridCard
            className="md:col-span-1 lg:col-span-1"
            index={5}
            inView={isInView}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-[0.2em] mb-3"
              style={{ color: "#5C5C6F" }}
            >
              Listening
            </p>
            <SpotifyNowPlaying />
          </GridCard>

          {/* 7. GitHub Contributions — full width */}
          <motion.div
            custom={6}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="md:col-span-2 lg:col-span-4"
          >
            <GitHubGraph />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
