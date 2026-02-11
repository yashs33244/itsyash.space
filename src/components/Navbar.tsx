"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Navigation Items ───────────────────────────── */

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Photography", href: "/photography", isPage: true },
  { label: "Contact", href: "#contact" },
] as const;

type SectionId = (typeof NAV_ITEMS)[number]["href"];

/* ─── Navbar Component ───────────────────────────── */

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  /* ── Scroll detection ─────────────────────────── */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Intersection Observer for active section ── */

  useEffect(() => {
    // Small delay to let sections mount
    const timer = setTimeout(() => {
      const sectionIds = NAV_ITEMS.map((item) => item.href.slice(1));
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];

      if (sections.length === 0) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          // Find the entry that is most visible
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (visible.length > 0) {
            setActiveSection(`#${visible[0].target.id}` as SectionId);
          }
        },
        {
          rootMargin: "-20% 0px -60% 0px",
          threshold: [0, 0.25, 0.5, 0.75, 1],
        }
      );

      sections.forEach((section) => observerRef.current?.observe(section));
    }, 500);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, []);

  /* ── Lock body scroll when mobile menu is open ─ */

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* ── Close mobile menu on ESC ──────────────── */

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* ── Smooth scroll handler ─────────────────── */

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string, isPage?: boolean) => {
      if (isPage || href.startsWith("/")) {
        setMobileOpen(false);
        return;
      }

      if (href.startsWith("#") && pathname !== "/") {
        e.preventDefault();
        router.push(`/${href}`);
        setMobileOpen(false);
        return;
      }

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setMobileOpen(false);
    },
    [pathname, router]
  );

  /* ── Animation variants ────────────────────── */

  const outExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: { duration: 0.3, ease: outExpo },
    },
    open: {
      opacity: 1,
      transition: { duration: 0.4, ease: outExpo },
    },
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: outExpo },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: outExpo,
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -16 },
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: outExpo },
    },
  };

  return (
    <>
      {/* ── Desktop Floating Pill ──────────────────── */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-5 px-4 pointer-events-none"
      >
        <nav
          role="navigation"
          aria-label="Main navigation"
          className={`
            pointer-events-auto
            relative flex items-center gap-1
            rounded-full px-1.5 py-1.5
            transition-all duration-500 ease-out-expo
            ${
              scrolled
                ? "glass-strong glow-accent shadow-lg shadow-accent/5"
                : "glass"
            }
          `}
          style={{
            /* Hardcoded fallback for glassmorphism */
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isPage = (item as { isPage?: boolean }).isPage;
              const isActive = isPage
                ? pathname === item.href
                : activeSection === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, (item as {isPage?: boolean}).isPage)}
                  aria-label={`Navigate to ${item.label} section`}
                  aria-current={isActive ? "true" : undefined}
                  className={`
                    relative flex items-center gap-2
                    rounded-full px-4 py-2
                    text-[13px] font-medium tracking-wide
                    transition-all duration-300 ease-out-expo
                    outline-none focus-visible:ring-2 focus-visible:ring-accent
                    ${
                      isActive
                        ? "text-txt bg-accent-ghost"
                        : "text-txt-muted hover:text-txt-secondary"
                    }
                  `}
                  style={{
                    color: isActive ? "#EDEDF0" : undefined,
                  }}
                >
                  {/* Active indicator dot */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="nav-dot"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 28,
                        }}
                        className="absolute left-2 h-1 w-1 rounded-full bg-accent"
                        style={{ backgroundColor: "#00E5FF" }}
                        aria-hidden="true"
                      />
                    )}
                  </AnimatePresence>

                  <span className={isActive ? "pl-1.5" : ""}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className={`
              md:hidden relative flex items-center justify-center
              h-9 w-9 rounded-full
              transition-colors duration-300
              text-txt-secondary hover:text-txt
              outline-none focus-visible:ring-2 focus-visible:ring-accent
            `}
          >
            <div className="flex flex-col items-center justify-center gap-[5px] w-4">
              <motion.span
                animate={{
                  rotate: mobileOpen ? 45 : 0,
                  y: mobileOpen ? 3.5 : 0,
                  width: mobileOpen ? 16 : 16,
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="block h-[1.5px] w-4 rounded-full bg-current origin-center"
              />
              <motion.span
                animate={{
                  opacity: mobileOpen ? 0 : 1,
                  scaleX: mobileOpen ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="block h-[1.5px] w-3 rounded-full bg-current"
              />
              <motion.span
                animate={{
                  rotate: mobileOpen ? -45 : 0,
                  y: mobileOpen ? -3.5 : 0,
                  width: mobileOpen ? 16 : 10,
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="block h-[1.5px] w-2.5 rounded-full bg-current origin-center"
              />
            </div>
          </button>
        </nav>
      </motion.header>

      {/* ── Mobile Full-Screen Overlay ──────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-30 md:hidden"
            style={{
              backgroundColor: "rgba(5, 5, 8, 0.96)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
            }}
          >
            {/* Subtle dot grid in background */}
            <div
              className="absolute inset-0 bg-dot-grid opacity-40"
              aria-hidden="true"
            />

            {/* Menu content */}
            <motion.nav
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="relative flex flex-col items-start justify-center h-full px-8 sm:px-12"
              aria-label="Mobile navigation"
            >
              {NAV_ITEMS.map((item, index) => {
                const isPage = (item as { isPage?: boolean }).isPage;
                const isActive = isPage
                  ? pathname === item.href
                  : activeSection === item.href;

                return (
                  <motion.div
                    key={item.href}
                    variants={itemVariants}
                    className="w-full"
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href, (item as {isPage?: boolean}).isPage)}
                      aria-label={`Navigate to ${item.label} section`}
                      aria-current={isActive ? "true" : undefined}
                      className={`
                        group relative flex items-center gap-4
                        py-5 w-full
                        border-b transition-colors duration-300
                        outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg
                        ${
                          index === NAV_ITEMS.length - 1
                            ? "border-transparent"
                            : "border-line"
                        }
                      `}
                      style={{
                        borderColor:
                          index === NAV_ITEMS.length - 1
                            ? "transparent"
                            : "#161624",
                      }}
                    >
                      {/* Section number */}
                      <span
                        className="font-mono text-xs text-txt-muted tabular-nums w-6"
                        style={{ color: "#5C5C6F" }}
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Active dot */}
                      <span
                        className={`
                          h-1.5 w-1.5 rounded-full
                          transition-all duration-300
                          ${
                            isActive
                              ? "bg-accent scale-100 opacity-100"
                              : "bg-transparent scale-0 opacity-0"
                          }
                        `}
                        style={{
                          backgroundColor: isActive ? "#00E5FF" : "transparent",
                        }}
                        aria-hidden="true"
                      />

                      {/* Label */}
                      <span
                        className={`
                          font-display text-2xl sm:text-3xl tracking-tight
                          transition-colors duration-300
                          ${
                            isActive
                              ? "text-txt"
                              : "text-txt-muted group-hover:text-txt-secondary"
                          }
                        `}
                        style={{
                          fontFamily:
                            "var(--font-space-grotesk), system-ui, sans-serif",
                          fontWeight: 700,
                          letterSpacing: "-0.03em",
                          color: isActive ? "#EDEDF0" : undefined,
                        }}
                      >
                        {item.label}
                      </span>

                      {/* Hover arrow */}
                      <motion.span
                        className="ml-auto text-txt-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-hidden="true"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 8h10M9 4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.span>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Bottom accent line */}
              <motion.div
                variants={itemVariants}
                className="mt-12 flex items-center gap-3"
                aria-hidden="true"
              >
                <span
                  className="h-px w-8 bg-accent/30"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,229,255,0.3), transparent)",
                  }}
                />
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.25em] text-txt-muted"
                  style={{ color: "#5C5C6F" }}
                >
                  itsyash.space
                </span>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
