"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Camera, ExternalLink, Instagram } from "lucide-react";
import { AnimatedText } from "./ui/AnimatedText";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: "Mountains",
    gradient: "from-cyan/25 via-blue-600/15 to-indigo-600/25",
  },
  {
    title: "City Lights",
    gradient: "from-violet/25 via-purple-500/15 to-pink-500/25",
  },
  {
    title: "Golden Hour",
    gradient: "from-orange-500/25 via-amber-500/15 to-yellow-500/25",
  },
  {
    title: "Street Life",
    gradient: "from-emerald-500/25 via-teal-500/15 to-cyan/25",
  },
  {
    title: "Portraits",
    gradient: "from-rose-500/25 via-pink-500/15 to-fuchsia-500/25",
  },
  {
    title: "Architecture",
    gradient: "from-slate-400/25 via-zinc-500/15 to-neutral-600/25",
  },
];

export function Photography() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".photo-item");
      items.forEach((el, i) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          scale: 0.96,
          duration: 0.6,
          delay: i * 0.07,
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
    <section ref={sectionRef} className="section-spacing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <span className="font-mono text-cyan text-xs mb-3 block tracking-wider">
            05 / LENS
          </span>
          <AnimatedText
            text="Through the Lens"
            as="h2"
            className="font-display text-4xl md:text-5xl lg:text-6xl text-text"
            scrollTrigger
          />
          <p className="text-text-secondary mt-4 max-w-xl text-base md:text-lg">
            Photography is my way of seeing the world differently.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {cards.map((card, i) => (
            <a
              key={i}
              href="https://www.instagram.com/yash_s3324/"
              target="_blank"
              rel="noopener noreferrer"
              className="photo-item block"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -3 }}
                transition={{ duration: 0.3 }}
                className={`relative aspect-[4/5] rounded-2xl bg-gradient-to-br ${card.gradient} border border-border overflow-hidden group cursor-pointer`}
              >
                {/* Dot pattern */}
                <div className="absolute inset-0 bg-dot-grid opacity-40" />

                {/* Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-[1200ms]" />

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-white/[0.04] flex items-center justify-center backdrop-blur-sm border border-white/[0.08] opacity-30 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500">
                    <Camera size={18} className="text-white/60" />
                  </div>
                </div>

                {/* Label */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                  <p className="font-mono text-[10px] text-white/50 group-hover:text-white/80 transition-colors uppercase tracking-wider">
                    {card.title}
                  </p>
                </div>

                {/* External icon */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ExternalLink size={12} className="text-white/50" />
                </div>
              </motion.div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <a
            href="https://www.instagram.com/yash_s3324/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-text-secondary font-mono text-sm
              hover:border-violet/20 hover:text-violet transition-all duration-500 group"
          >
            <Instagram size={15} />
            View on Instagram
            <ExternalLink
              size={11}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
