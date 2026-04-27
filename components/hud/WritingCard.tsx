'use client';

import Link from 'next/link';

interface WritingCardProps {
  title: string;
  slug: string;
  abstract?: string;
  tags: string[];
  type: string;
  publishedDate: string;
  readingTime?: number;
  href?: string;
  external?: boolean;
}

const typeColors: Record<string, string> = {
  article: 'var(--cyan)',
  research: 'var(--green)',
  publication: 'var(--amber)',
  external: 'var(--amber)',
};

export function WritingCard({ title, slug, abstract, tags, type, publishedDate, readingTime, href, external = false }: WritingCardProps) {
  const color = typeColors[type] || typeColors.article;
  const destination = href ?? `/writings/${slug}`;

  return (
    <Link href={destination} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
      <div
        className="hud-card p-5 cursor-pointer transition-all duration-300 group relative overflow-hidden"
      >
        {/* Accent line */}
        <div
          className="absolute top-0 left-0 h-[2px] transition-all duration-500"
          style={{
            background: color,
            width: '42%',
            boxShadow: `0 0 8px ${color}`,
          }}
        />

        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono-hud text-[10px] tracking-[0.18em] uppercase" style={{ color }}>
              {type}
            </span>
            <span className="font-mono-hud text-[10px] text-[var(--text-dim)]">{publishedDate}</span>
          </div>

          <h3 className="mb-3 font-oxanium text-[20px] font-semibold leading-tight text-white transition-all group-hover:text-glow-cyan">
            {title}
          </h3>

          {abstract && (
            <p className="mb-3 font-body text-[14px] leading-7 text-[var(--text)]">
              {abstract}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.slice(0, 4).map((tag) => (
              <span key={tag} className="hud-tag" style={{ color: 'var(--text-dim)', borderColor: 'var(--glass-border)' }}>
                {tag}
              </span>
            ))}
          </div>

          {readingTime && (
            <div className="mt-3 font-mono-hud text-[10px] text-[var(--text-dim)]">
              {readingTime} MIN READ
            </div>
          )}

          {external && (
            <div className="mt-3 font-mono-hud text-[10px] text-amber">
              OPEN EXTERNAL ↗
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
