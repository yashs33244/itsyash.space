"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import SpotifyNowPlaying from "./SpotifyNowPlaying";

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
      className={`card group rounded-2xl border p-5 md:p-6 transition-colors duration-300 hover:border-[#00E5FF]/20 ${className}`}
      style={{
        backgroundColor: "#0A0A12",
        borderColor: "#161624",
      }}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-py relative overflow-hidden"
    >
      <div className="section-container">
        {/* ── Section Label ── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-label">About</span>
        </motion.div>

        {/* ── Bento Grid ── */}
        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-auto">
          {/* ─── 1. Bio Card — spans 2 cols on desktop ─── */}
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
                I&apos;m a 4th year CS student at IIIT Una, currently an SDE
                intern at Binocs, Bangalore. I build production infrastructure
                — microservices, CI/CD pipelines, Kubernetes clusters, and
                LLM-powered workflows.
              </p>
              <p
                className="font-body text-sm md:text-[15px] leading-relaxed md:leading-[1.75] mt-4"
                style={{ color: "#8E8EA0" }}
              >
                Previously at ViewR (IIT Delhi startup) building real-time
                video systems with sub-100ms latency, and at IIT Mandi as a
                research assistant working on GNNs and Transformers. I care
                about systems that work under pressure and code that reads
                like prose.
              </p>
            </div>

            {/* Decorative line at bottom of bio card */}
            <div className="mt-6 flex items-center gap-2">
              <div
                className="h-px flex-1"
                style={{ backgroundColor: "#161624" }}
              />
              <span
                className="font-mono text-[10px]"
                style={{ color: "#5C5C6F" }}
              >
                //
              </span>
            </div>
          </GridCard>

          {/* ─── 2. Profile Photo Card ─── */}
          <GridCard
            className="md:col-span-1 lg:col-span-2 flex items-center justify-center overflow-hidden"
            index={1}
            inView={isInView}
          >
            <div className="relative w-full aspect-square max-w-[320px] rounded-xl overflow-hidden transition-shadow duration-500 group-hover:shadow-[0_0_40px_-12px_rgba(0,229,255,0.15)]">
              {/* Cyan border glow on hover */}
              <div
                className="absolute inset-0 rounded-xl border-2 border-transparent transition-colors duration-500 group-hover:border-[#00E5FF]/30 z-10 pointer-events-none"
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

          {/* ─── 3. Location Card ─── */}
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
                  className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
                  style={{
                    backgroundColor: "#00E5FF",
                    animationDuration: "2s",
                  }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: "#00E5FF" }}
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

          {/* ─── 4. Education Card ─── */}
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
                className="font-mono text-xs"
                style={{ color: "#00E5FF" }}
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

          {/* ─── 5. Currently Card ─── */}
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

          {/* ─── 6. Spotify Card ─── */}
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
        </div>
      </div>
    </section>
  );
}
