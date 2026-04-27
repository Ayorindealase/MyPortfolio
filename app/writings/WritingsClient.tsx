'use client';

import { useMemo, useState } from 'react';
import { WritingCard } from '@/components/hud/WritingCard';

interface WritingItem {
  id: string;
  title: string;
  slug: string;
  abstract: string | null;
  tags: string[];
  type: string;
  publishedDate: string;
  readingTime: number | null;
  href: string;
  external: boolean;
}

const FILTERS = ['ALL', 'ARTICLES', 'RESEARCH', 'PUBLICATIONS', 'EXTERNALS'];

export function WritingsClient({ writings }: { writings: WritingItem[] }) {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filtered = useMemo(() => {
    return writings.filter((w) => {
      if (activeFilter === 'ALL') return true;
      return w.type.toUpperCase() === activeFilter.slice(0, -1) || w.type.toUpperCase() + 'S' === activeFilter;
    });
  }, [activeFilter, writings]);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="font-mono-hud text-[10px] tracking-[0.18em] px-4 py-2.5 transition-all duration-200"
            style={{
              color: activeFilter === f ? 'var(--cyan)' : 'var(--text-dim)',
              border: `1px solid ${activeFilter === f ? 'var(--cyan)' : 'var(--glass-border)'}`,
              background: activeFilter === f ? 'rgba(0,243,255,0.08)' : 'transparent',
              borderRadius: '999px',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filtered.map((w) => (
          <WritingCard
            key={w.id}
            title={w.title}
            slug={w.slug}
            abstract={w.abstract ?? undefined}
            tags={w.tags}
            type={w.type}
            publishedDate={w.publishedDate}
            readingTime={w.readingTime ?? undefined}
            href={w.href}
            external={w.external}
          />
        ))}
      </div>
    </>
  );
}
