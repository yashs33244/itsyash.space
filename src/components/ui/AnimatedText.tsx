"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  scrollTrigger?: boolean;
}

export function AnimatedText({
  text,
  className,
  delay = 0,
  stagger = 0.025,
  as: Tag = "span",
  scrollTrigger = false,
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const chars = containerRef.current.querySelectorAll(".at-char");

      const config: gsap.TweenVars = {
        y: 50,
        opacity: 0,
        rotateX: -30,
        stagger,
        duration: 0.7,
        ease: "power3.out",
        delay,
      };

      if (scrollTrigger) {
        gsap.from(chars, {
          ...config,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        });
      } else {
        gsap.from(chars, config);
      }
    },
    { scope: containerRef }
  );

  const words = text.split(" ");

  return (
    <div ref={containerRef} data-slot="animated-text" className="overflow-hidden">
      <Tag className={cn("inline-block", className)}>
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-pre">
            {word.split("").map((char, ci) => (
              <span
                key={`${wi}-${ci}`}
                className="at-char inline-block"
                style={{ perspective: "500px" }}
              >
                {char}
              </span>
            ))}
            {wi < words.length - 1 && (
              <span className="at-char inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </Tag>
    </div>
  );
}
