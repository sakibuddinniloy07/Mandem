import clsx from "clsx";
import { socialLinks, type SocialId } from "@/lib/social";

// Outline glyphs (24×24, stroke-based) so they match the lucide icons used
// elsewhere. Paths adapted from Tabler Icons (MIT).
const glyphs: Record<SocialId, React.ReactNode> = {
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M16.5 7.5v.01" />
    </>
  ),
  facebook: (
    <path d="M7 10v4h3v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3V3h-3a5 5 0 0 0-5 5v2H7" />
  ),
  tiktok: (
    <path d="M21 7.917v4.034a9.948 9.948 0 0 1-5-1.951v4.5a6.5 6.5 0 1 1-8-6.326v4.326a2.5 2.5 0 1 0 4 2V3h4.083A6.005 6.005 0 0 0 21 7.917z" />
  ),
  whatsapp: (
    <>
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </>
  ),
};

export function SocialIcons({
  size = 22,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <ul className={clsx("flex items-center gap-4", className)}>
      {socialLinks.map(({ id, label, url }) => {
        const icon = (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {glyphs[id]}
          </svg>
        );
        return (
          <li key={id}>
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`MANDEM on ${label}`}
                title={label}
                className="block transition-[opacity,transform] duration-200 hover:opacity-70 hover:-translate-y-0.5"
              >
                {icon}
              </a>
            ) : (
              // No link yet: show the icon without making it clickable.
              <span role="img" aria-label={`${label} (coming soon)`} title={`${label} — coming soon`} className="block">
                {icon}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
