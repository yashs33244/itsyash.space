"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Photography } from "@/components/Photography";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

function SectionDivider() {
  return (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen bg-bg">
      {/* Global background pattern */}
      <div className="fixed inset-0 bg-dot-grid opacity-30 pointer-events-none" />

      <Navbar />
      <Hero />
      <SectionDivider />
      <About />
      <SectionDivider />
      <Experience />
      <SectionDivider />
      <Projects />
      <SectionDivider />
      <Skills />
      <SectionDivider />
      <Photography />
      <SectionDivider />
      <Contact />
      <Footer />
    </main>
  );
}
