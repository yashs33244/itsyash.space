"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import hljs from "highlight.js";
import { useEffect, useRef, ComponentPropsWithoutRef } from "react";
import "highlight.js/styles/github-dark.css";

// Mermaid diagram component — uses mermaid.render() (v10+ API)
function MermaidBlock({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`;
    import("mermaid").then(async ({ default: mermaid }) => {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            background: "#0f0f0f",
            primaryColor: "#1a2a1a",
            primaryTextColor: "#c8f000",
            lineColor: "#555",
            secondaryColor: "#141414",
            tertiaryColor: "#0a0a0a",
          },
        });
        const { svg } = await mermaid.render(id, code);
        el.innerHTML = svg;
      } catch (err) {
        el.innerHTML = `<pre style="color:#ff4444;font-size:12px;padding:12px">[Mermaid error] ${String(err)}</pre>`;
      }
    });
  }, [code]);
  return (
    <div
      ref={ref}
      style={{ backgroundColor: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "24px", margin: "20px 0", overflowX: "auto", minHeight: "60px" }}
    />
  );
}

// Recursively extract plain text from React children (handles hljs-processed spans)
function extractText(node: unknown): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in (node as object)) {
    return extractText((node as { props: { children?: unknown } }).props.children);
  }
  return "";
}

// Custom code block — highlights via hljs directly so we control indentation and mermaid detection
function CodeBlock({ className, children }: ComponentPropsWithoutRef<"code">) {
  const lang = className?.replace("language-", "") ?? "";
  // children is a plain string here (no rehypeHighlight in pipeline)
  const rawCode = extractText(children).replace(/\n$/, "");

  if (lang === "mermaid") return <MermaidBlock code={rawCode} />;

  let highlighted = rawCode;
  try {
    if (lang && hljs.getLanguage(lang)) {
      highlighted = hljs.highlight(rawCode, { language: lang }).value;
    } else {
      highlighted = hljs.highlightAuto(rawCode).value;
    }
  } catch {
    // fallback: raw text
  }

  return (
    <pre style={{ backgroundColor: "#0f0f0f", border: "1px solid #222", borderRadius: "6px", padding: "20px", overflowX: "auto", margin: "16px 0", lineHeight: 1.6 }}>
      <code
        className={`hljs ${className ?? ""}`}
        style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: "13px", whiteSpace: "pre", display: "block" }}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  );
}

// Callout component for > [!NOTE] etc.
function parseCallout(text: string): { type: string; content: string } | null {
  const match = text.match(/^\[!(NOTE|WARNING|IMPORTANT|TIP|CAUTION)\]\s*([\s\S]*)/i);
  if (!match) return null;
  return { type: match[1].toUpperCase(), content: match[2] };
}

const calloutColors: Record<string, { bg: string; border: string; label: string; color: string }> = {
  NOTE:      { bg: "#0a1628", border: "#2255aa", label: "Note",      color: "#4488ff" },
  TIP:       { bg: "#0a1a0a", border: "#225522", label: "Tip",       color: "#44cc44" },
  IMPORTANT: { bg: "#1a0a28", border: "#552288", label: "Important", color: "#aa44ff" },
  WARNING:   { bg: "#1a1200", border: "#664400", label: "Warning",   color: "#ffaa00" },
  CAUTION:   { bg: "#1a0a0a", border: "#882222", label: "Caution",   color: "#ff4444" },
};

export default function MarkdownRenderer({ content }: { content: string }) {
  const processed = content
    .replace(/<DNT>([\s\S]*?)<\/DNT>/g, "$1")
    .replace(/<InlineCode>([\s\S]*?)<\/InlineCode>/g, "`$1`")
    .replace(/<Callout variant="important">([\s\S]*?)<\/Callout>/g, (_m, inner) =>
      inner.trim().split("\n").map((l: string) => `> [!IMPORTANT] ${l}`).join("\n"))
    .replace(/<Callout variant="tip">([\s\S]*?)<\/Callout>/g, (_m, inner) =>
      inner.trim().split("\n").map((l: string) => `> [!TIP] ${l}`).join("\n"))
    .replace(/<Callout variant="warning">([\s\S]*?)<\/Callout>/g, (_m, inner) =>
      inner.trim().split("\n").map((l: string) => `> [!WARNING] ${l}`).join("\n"))
    .replace(/<Callout[^>]*>([\s\S]*?)<\/Callout>/g, (_m, inner) =>
      inner.trim().split("\n").map((l: string) => `> [!NOTE] ${l}`).join("\n"))
    .replace(/<\/?CollapserGroup>/g, "")
    .replace(/<Collapser[^>]*title="([^"]*)"[^>]*>/g, "\n### $1\n")
    .replace(/<Collapser[^>]*title=\{[^}]*\}[^>]*>/g, "\n### [Section]\n")
    .replace(/<\/Collapser>/g, "\n---\n")
    .replace(/<\/?Steps>/g, "")
    .replace(/<Step>/g, "")
    .replace(/<\/Step>/g, "")
    .replace(/<Icon[^/]*\/>/g, "")
    .replace(/<figcaption>([\s\S]*?)<\/figcaption>/g, "\n*$1*\n")
    .replace(/<[A-Z][^>]*>([\s\S]*?)<\/[A-Z][^>]*>/g, "$1")
    .replace(/<[A-Z][^/]*\/>/g, "");

  return (
    <div style={{ color: "#c8c8b8", fontSize: "16px", lineHeight: 1.8, fontFamily: "var(--font-body)" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 600, color: "#f0efe8", margin: "40px 0 16px", fontStyle: "italic" }}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 600, color: "#f0efe8", margin: "32px 0 12px" }}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#f0efe8", margin: "24px 0 10px" }}>{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#f0efe8", margin: "20px 0 8px" }}>{children}</h4>
          ),
          p: ({ children }) => (
            <p style={{ marginBottom: "16px", lineHeight: 1.8 }}>{children}</p>
          ),
          a: ({ href, children }) => (
            <a href={href} style={{ color: "#c8f000", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer">{children}</a>
          ),
          strong: ({ children }) => <strong style={{ color: "#f0efe8", fontWeight: 600 }}>{children}</strong>,
          em: ({ children }) => <em style={{ color: "#aaa" }}>{children}</em>,
          ul: ({ children }) => <ul style={{ paddingLeft: "24px", marginBottom: "16px", listStyleType: "disc" }}>{children}</ul>,
          ol: ({ children }) => <ol style={{ paddingLeft: "24px", marginBottom: "16px" }}>{children}</ol>,
          li: ({ children }) => <li style={{ marginBottom: "6px" }}>{children}</li>,
          hr: () => <hr style={{ border: "none", borderTop: "1px solid #222", margin: "32px 0" }} />,
          img: ({ src, alt }) => (
            <figure style={{ margin: "24px 0" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt || ""} style={{ maxWidth: "100%", borderRadius: "8px", border: "1px solid #222" }} />
              {alt && <figcaption style={{ color: "#666", fontSize: "13px", marginTop: "8px", fontStyle: "italic" }}>{alt}</figcaption>}
            </figure>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = className?.startsWith("language-");
            if (!isBlock) {
              return (
                <code style={{ backgroundColor: "#141414", border: "1px solid #2a2a2a", borderRadius: "3px", padding: "2px 6px", fontFamily: "monospace", fontSize: "13px", color: "#c8f000" }} {...props}>
                  {children}
                </code>
              );
            }
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },
          pre: ({ children }) => <>{children}</>,
          blockquote: ({ children }) => {
            const text = String(children);
            const callout = parseCallout(text.replace(/^<p>|<\/p>$/g, "").trim());
            if (callout) {
              const style = calloutColors[callout.type] || calloutColors.NOTE;
              return (
                <div style={{ backgroundColor: style.bg, border: `1px solid ${style.border}`, borderLeft: `4px solid ${style.color}`, borderRadius: "6px", padding: "16px 20px", margin: "20px 0" }}>
                  <div style={{ color: style.color, fontWeight: 700, fontSize: "13px", marginBottom: "8px", textTransform: "uppercase" }}>{style.label}</div>
                  <div style={{ color: "#c8c8b8" }}>{callout.content}</div>
                </div>
              );
            }
            return (
              <blockquote style={{ borderLeft: "3px solid #333", paddingLeft: "16px", margin: "16px 0", color: "#888", fontStyle: "italic" }}>
                {children}
              </blockquote>
            );
          },
          table: ({ children }) => (
            <div style={{ overflowX: "auto", margin: "20px 0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead style={{ backgroundColor: "#0f0f0f" }}>{children}</thead>,
          th: ({ children }) => (
            <th style={{ padding: "10px 14px", borderBottom: "1px solid #333", textAlign: "left", color: "#f0efe8", fontWeight: 600, fontSize: "13px" }}>{children}</th>
          ),
          td: ({ children }) => (
            <td style={{ padding: "10px 14px", borderBottom: "1px solid #1a1a1a", color: "#c8c8b8", verticalAlign: "top" }}>{children}</td>
          ),
          tr: ({ children }) => <tr style={{ borderBottom: "1px solid #1a1a1a" }}>{children}</tr>,
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}
