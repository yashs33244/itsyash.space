"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Camera } from "lucide-react";
import Image from "next/image";
import { useSpotify } from "@/context/SpotifyContext";

interface Photo {
  id: string;
  url: string;
  title: string;
  category: string;
  description?: string;
  location?: string;
  camera?: string;
}

export default function Photography() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [photos, setPhotos] = useState<Photo[]>([]);
  const { track } = useSpotify();
  const accent = track?.accentColor || "#00E5FF";

  useEffect(() => {
    fetch("/api/photos")
      .then((r) => r.json())
      .then((data) => {
        if (data.photos?.length) {
          setPhotos(data.photos.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="photography" ref={sectionRef} className="section-py">
      <div className="section-container">
        {/* Section Label */}
        <p className="section-label">Photography</p>

        {/* Section Heading */}
        <h2
          className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-txt mb-4 tracking-tight"
          style={{ color: "#EDEDF0" }}
        >
          Through the Lens
        </h2>
        <p
          className="font-body text-sm md:text-base mb-12"
          style={{ color: "#8E8EA0" }}
        >
          Capturing moments between deployments
        </p>

        {/* Photo Grid */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10"
        >
          {photos.length > 0
            ? photos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.95 }
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.1 * i,
                    ease: "easeOut",
                  }}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden border transition-all duration-500 hover:border-[var(--accent)]/30"
                  style={{ borderColor: "var(--line)", transition: "border-color 1.5s ease" }}
                >
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                    <p
                      className="font-display text-sm font-medium"
                      style={{ color: "#EDEDF0" }}
                    >
                      {photo.title}
                    </p>
                    {photo.location && (
                      <p
                        className="font-mono text-[10px] mt-1"
                        style={{ color: "#8E8EA0" }}
                      >
                        {photo.location}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))
            : // Placeholder cards when no photos uploaded yet
              Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.95 }
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.1 * i,
                    ease: "easeOut",
                  }}
                  className="aspect-[3/4] rounded-2xl border overflow-hidden flex items-center justify-center"
                  style={{
                    borderColor: "var(--line)",
                    backgroundColor: "var(--bg-surface)",
                    transition: "background-color 1.5s ease, border-color 1.5s ease",
                  }}
                >
                  <Camera size={24} style={{ color: "#5C5C6F" }} />
                </motion.div>
              ))}
        </motion.div>

        {/* CTA Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="/photography"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border bg-bg-surface text-txt-secondary hover:text-txt transition-all duration-300 font-mono text-sm"
            style={{
              borderColor: `${accent}30`,
              backgroundColor: `${accent}08`,
              color: accent,
            }}
          >
            View Gallery
            <Camera size={14} />
          </a>
          <a
            href="https://www.instagram.com/yash_s3324/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 font-mono text-sm hover:shadow-[0_0_20px_rgba(var(--accent-rgb)/0.06)]"
            style={{
              borderColor: "var(--line)",
              backgroundColor: "var(--bg-surface)",
              color: "#8E8EA0",
              transition: "background-color 1.5s ease, border-color 1.5s ease",
            }}
          >
            Instagram
            <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
