"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  duration?: number;
  className?: string;
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  direction = "left",
  duration = 30,
  className,
  pauseOnHover = true,
}: MarqueeProps) {
  const animClass =
    direction === "left" ? "animate-marquee" : "animate-marquee-reverse";

  return (
    <div
      data-slot="marquee"
      className={cn(
        "relative flex overflow-hidden",
        pauseOnHover && "marquee-track",
        className
      )}
    >
      <div
        className={cn("flex shrink-0 gap-3", animClass)}
        style={{ "--duration": `${duration}s` } as React.CSSProperties}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
