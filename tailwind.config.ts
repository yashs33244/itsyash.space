import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#050508",
          surface: "#0A0A12",
          elevated: "#10101C",
          overlay: "rgba(5, 5, 8, 0.88)",
        },
        accent: {
          DEFAULT: "#00E5FF",
          dim: "rgba(0, 229, 255, 0.12)",
          ghost: "rgba(0, 229, 255, 0.05)",
          muted: "rgba(0, 229, 255, 0.35)",
        },
        violet: {
          DEFAULT: "#7B61FF",
          dim: "rgba(123, 97, 255, 0.12)",
        },
        txt: {
          DEFAULT: "#EDEDF0",
          secondary: "#8E8EA0",
          muted: "#5C5C6F",
        },
        line: {
          DEFAULT: "#161624",
          hover: "rgba(0, 229, 255, 0.18)",
        },
        success: "#22C55E",
        warning: "#FACC15",
        danger: "#EF4444",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "'Courier New'", "monospace"],
      },
      fontSize: {
        "display-xl": [
          "clamp(3.5rem, 8vw, 8rem)",
          { lineHeight: "0.9", letterSpacing: "-0.04em" },
        ],
        "display-lg": [
          "clamp(2.5rem, 5vw, 5rem)",
          { lineHeight: "0.95", letterSpacing: "-0.03em" },
        ],
        "display-md": [
          "clamp(1.5rem, 3vw, 2.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em" },
        ],
      },
      spacing: {
        section: "clamp(5rem, 10vh, 9rem)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      animation: {
        marquee: "marquee var(--duration, 40s) linear infinite",
        "marquee-reverse":
          "marquee-reverse var(--duration, 40s) linear infinite",
        "pulse-slow": "pulse-slow 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        blink: "blink 1.2s step-end infinite",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-up":
          "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "audio-bar": "audio-bar 1.2s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        blink: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "audio-bar": {
          "0%, 100%": { height: "20%" },
          "50%": { height: "100%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
