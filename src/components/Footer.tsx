"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-border">
      {/* Cyan accent line */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan/25 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-7">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left */}
          <p className="font-mono text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Yash Singh
          </p>

          {/* Center */}
          <p className="font-mono text-xs text-text-muted/50">
            Built with Next.js &middot; Deployed on Vercel
          </p>

          {/* Right */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 font-mono text-xs text-text-muted hover:text-cyan transition-colors group"
          >
            Back to top
            <div className="w-7 h-7 rounded-full border border-border group-hover:border-cyan/25 flex items-center justify-center transition-colors">
              <ArrowUp size={11} />
            </div>
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
