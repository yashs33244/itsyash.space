"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { useSpotify } from "@/context/SpotifyContext";
import { Github, GitCommit, Star, Users } from "lucide-react";

interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface GitHubData {
  totalContributions: number | null;
  weeks: ContributionWeek[];
  publicRepos: number;
  followers: number;
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

export default function GitHubGraph() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const { track } = useSpotify();

  const accent = track?.accentColor || "#00E5FF";

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  // Take only the last 26 weeks (half year) for display
  const recentWeeks = useMemo(() => {
    if (!data?.weeks?.length) return [];
    return data.weeks.slice(-26);
  }, [data]);

  // Map contribution count to color intensity using the accent color
  const getCellColor = (count: number) => {
    if (count === 0) return "var(--line)";
    const { r, g, b } = hexToRgb(accent);
    const levels = [0.15, 0.35, 0.55, 0.85];
    const level = count >= 10 ? 3 : count >= 5 ? 2 : count >= 2 ? 1 : 0;
    const intensity = levels[level];
    return `rgb(${Math.round(r * intensity)}, ${Math.round(g * intensity)}, ${Math.round(b * intensity)})`;
  };

  if (!data || !data.weeks?.length) {
    return null; // Don't render if no data
  }

  const monthLabels = (() => {
    const labels: { label: string; col: number }[] = [];
    let lastMonth = "";
    recentWeeks.forEach((week, i) => {
      if (week.contributionDays.length > 0) {
        const d = new Date(week.contributionDays[0].date);
        const month = d.toLocaleString("en", { month: "short" });
        if (month !== lastMonth) {
          labels.push({ label: month, col: i });
          lastMonth = month;
        }
      }
    });
    return labels;
  })();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="card rounded-2xl border p-5 md:p-6 transition-all duration-500"
      style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--line)", transition: "background-color 1.5s ease, border-color 1.5s ease" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Github size={16} style={{ color: accent }} />
          <span
            className="font-mono text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "#5C5C6F" }}
          >
            GitHub Activity
          </span>
        </div>
        <a
          href="https://github.com/yashs33244"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] transition-colors duration-300 hover:underline underline-offset-4"
          style={{ color: accent }}
        >
          @yashs33244
        </a>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-6 mb-5">
        {data.totalContributions !== null && (
          <div className="flex items-center gap-1.5">
            <GitCommit size={13} style={{ color: "#5C5C6F" }} />
            <span className="font-mono text-xs" style={{ color: "#8E8EA0" }}>
              <span style={{ color: "#EDEDF0", fontWeight: 600 }}>
                {data.totalContributions}
              </span>{" "}
              contributions
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Star size={13} style={{ color: "#5C5C6F" }} />
          <span className="font-mono text-xs" style={{ color: "#8E8EA0" }}>
            <span style={{ color: "#EDEDF0", fontWeight: 600 }}>
              {data.publicRepos}
            </span>{" "}
            repos
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={13} style={{ color: "#5C5C6F" }} />
          <span className="font-mono text-xs" style={{ color: "#8E8EA0" }}>
            <span style={{ color: "#EDEDF0", fontWeight: 600 }}>
              {data.followers}
            </span>{" "}
            followers
          </span>
        </div>
      </div>

      {/* Contribution Grid */}
      <div className="relative overflow-x-auto">
        {/* Month labels */}
        <div className="flex gap-0 mb-1 ml-0" style={{ minWidth: "fit-content" }}>
          {monthLabels.map(({ label, col }) => (
            <span
              key={`${label}-${col}`}
              className="font-mono text-[9px] absolute"
              style={{
                color: "#5C5C6F",
                left: col * 14 + 2,
                top: 0,
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div
          className="relative flex gap-[3px] pt-4"
          style={{ minWidth: "fit-content" }}
        >
          {recentWeeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.contributionDays.map((day, di) => (
                <div
                  key={day.date}
                  className="rounded-[2px] transition-all duration-300 cursor-pointer"
                  style={{
                    width: 11,
                    height: 11,
                    backgroundColor: getCellColor(day.contributionCount),
                    boxShadow:
                      day.contributionCount > 0
                        ? `0 0 ${Math.min(day.contributionCount * 2, 10)}px ${accent}15`
                        : "none",
                  }}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  title={`${day.date}: ${day.contributionCount} contribution${day.contributionCount !== 1 ? "s" : ""}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {hoveredDay && (
          <div
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap pointer-events-none z-20"
            style={{
              backgroundColor: "var(--line)",
              color: "#EDEDF0",
              border: `1px solid ${accent}33`,
            }}
          >
            {hoveredDay.contributionCount} contribution
            {hoveredDay.contributionCount !== 1 ? "s" : ""} on{" "}
            {new Date(hoveredDay.date).toLocaleDateString("en", {
              month: "short",
              day: "numeric",
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span
          className="font-mono text-[9px]"
          style={{ color: "#5C5C6F" }}
        >
          Less
        </span>
        {[0, 1, 3, 6, 12].map((count) => (
          <div
            key={count}
            className="rounded-[2px]"
            style={{
              width: 10,
              height: 10,
              backgroundColor: getCellColor(count),
            }}
          />
        ))}
        <span
          className="font-mono text-[9px]"
          style={{ color: "#5C5C6F" }}
        >
          More
        </span>
      </div>
    </motion.div>
  );
}
