"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-mono text-xs font-medium transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "bg-bg-surface border border-border text-text-secondary hover:border-border-hover hover:text-cyan",
        cyan: "bg-cyan-ghost border border-cyan/20 text-cyan",
        violet: "bg-violet-dim border border-violet/20 text-violet",
        success: "bg-success/10 border border-success/20 text-success",
        outline:
          "border border-border text-text-muted hover:border-cyan/20 hover:text-cyan",
        ghost: "text-text-muted hover:text-text-secondary",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}
