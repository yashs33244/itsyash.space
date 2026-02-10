"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { forwardRef } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        data-slot="card"
        whileHover={
          hover ? { y: -3, transition: { duration: 0.3 } } : undefined
        }
        className={cn(
          "relative rounded-2xl border border-border bg-bg-surface p-6 transition-all duration-500",
          hover && "hover:border-border-hover hover:bg-bg-elevated",
          className
        )}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";
export { Card };
