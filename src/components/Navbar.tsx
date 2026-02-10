"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "About", href: "#about", num: "01" },
  { label: "Work", href: "#experience", num: "02" },
  { label: "Projects", href: "#projects", num: "03" },
  { label: "Skills", href: "#skills", num: "04" },
  { label: "Contact", href: "#contact", num: "05" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      const ids = navItems.map((i) => i.href.slice(1));
      for (let k = ids.length - 1; k >= 0; k--) {
        const el = document.getElementById(ids[k]);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActive(ids[k]);
          return;
        }
      }
      setActive("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ─── Desktop floating pill ──────────────── */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500",
          scrolled ? "top-3" : "top-5"
        )}
      >
        <div
          className={cn(
            "glass-heavy rounded-full px-1.5 py-1.5 flex items-center gap-0.5 transition-all duration-500",
            scrolled && "shadow-lg shadow-black/30"
          )}
        >
          {/* Desktop items */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-mono rounded-full transition-colors duration-300",
                    isActive ? "text-cyan" : "text-text-secondary hover:text-text"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-cyan/[0.08] border border-cyan/20"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2.5 text-text-secondary hover:text-cyan transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* ─── Mobile fullscreen overlay ──────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-2xl md:hidden flex flex-col items-start justify-center px-8"
          >
            <div className="space-y-6">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onClick={() => navigate(item.href)}
                  className="block group"
                >
                  <span className="text-cyan/40 font-mono text-sm block mb-1">
                    {item.num}/
                  </span>
                  <span
                    className={cn(
                      "font-display text-4xl transition-colors duration-300",
                      active === item.href.slice(1)
                        ? "text-cyan"
                        : "text-text group-hover:text-cyan"
                    )}
                  >
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Email at bottom */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-10 left-8 font-mono text-sm text-text-muted"
            >
              yashs3324@gmail.com
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
