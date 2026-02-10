export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-line"
      style={{ borderColor: "#161624" }}
    >
      <div className="section-container py-8">
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="font-mono text-sm text-txt"
            style={{ color: "#EDEDF0" }}
          >
            Yash Singh
          </span>
          <span
            className="font-mono text-sm text-txt-secondary"
            style={{ color: "#8E8EA0" }}
          >
            {currentYear}
          </span>
        </div>

        {/* Bottom row */}
        <p
          className="text-txt-muted text-xs"
          style={{ color: "#5C5C6F" }}
        >
          Built with Next.js, Tailwind, and too much coffee
        </p>
      </div>
    </footer>
  );
}
