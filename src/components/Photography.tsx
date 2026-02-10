"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";

const placeholderGradients = [
  "from-[#0A0A12] via-[#10101C] to-[#1a1a2e]",
  "from-[#10101C] via-[#0e1a2a] to-[#0A0A12]",
  "from-[#0A0A12] via-[#161624] to-[#10101C]",
  "from-[#10101C] via-[#1a102e] to-[#0A0A12]",
];

export default function Photography() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="photography" ref={sectionRef} className="section-py">
      <div className="section-container">
        {/* Section Label */}
        <p className="section-label">Photography</p>

        {/* Section Heading */}
        <h2
          className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-txt mb-12 tracking-tight"
          style={{ color: "#EDEDF0" }}
        >
          Through the Lens
        </h2>

        {/* Photo Grid */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {placeholderGradients.map((gradient, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: 0.1 * i, ease: "easeOut" }}
              className={`
                aspect-[3/4] rounded-2xl bg-gradient-to-br ${gradient}
                border border-line overflow-hidden
                hover:border-line-hover transition-colors duration-300
              `}
              style={{ borderColor: "#161624" }}
            >
              {/* Subtle texture overlay */}
              <div className="w-full h-full bg-dot-grid opacity-20" />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <a
            href="https://www.instagram.com/yash_s3324/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2 px-5 py-2.5 rounded-full
              border border-line bg-bg-surface text-txt-secondary
              hover:border-accent/30 hover:text-accent
              transition-all duration-300 font-mono text-sm
              hover:shadow-[0_0_20px_rgba(0,229,255,0.06)]
            "
            style={{
              borderColor: "#161624",
              backgroundColor: "#0A0A12",
              color: "#8E8EA0",
            }}
          >
            View on Instagram
            <ExternalLink size={14} />
          </a>

          {/* Note */}
          <p
            className="text-txt-muted text-sm italic"
            style={{ color: "#5C5C6F" }}
          >
            Capturing moments between deployments
          </p>
        </motion.div>
      </div>
    </section>
  );
}
