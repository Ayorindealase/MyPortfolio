import { SectionHeader } from '@/components/hud/SectionHeader';
import { prisma } from '@/lib/prisma';
import { WritingsClient } from './WritingsClient';

function formatPublishedDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
}

export default async function WritingsPage() {
  const writings = await prisma.writing.findMany({
    where: {
      isPublished: true,
      type: {
        not: 'gallery',
      },
    },
    orderBy: [{ sortOrder: 'asc' }, { publishedDate: 'desc' }],
  });

  const items = writings.map((writing) => ({
    id: writing.id,
    title: writing.title,
    slug: writing.slug,
    abstract: writing.abstract,
    tags: writing.tags,
    type: writing.type,
    publishedDate: formatPublishedDate(writing.publishedDate),
    readingTime: writing.type === 'external' ? null : writing.readingTime,
    href: writing.type === 'external' ? writing.content : `/writings/${writing.slug}`,
    external: writing.type === 'external',
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <SectionHeader tag="SYS.TX" title="Transmissions" subtitle="Writings on AI, engineering, leadership, and the systems behind the work." />
      <section className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(0,243,255,0.12),transparent_28%),linear-gradient(145deg,rgba(8,10,18,0.96),rgba(4,6,12,0.92))] p-6 sm:p-8">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="relative z-10 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Focus', value: 'AI, systems, leadership, research notes', color: 'var(--cyan)' },
            { label: 'Formats', value: 'Articles, publications, external posts', color: 'var(--green)' },
            { label: 'Archive', value: `${items.length} published transmissions`, color: 'var(--amber)' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <div className="font-mono-hud text-[11px] tracking-[0.18em] uppercase" style={{ color: item.color }}>
                {item.label}
              </div>
              <div className="mt-2 font-body text-[16px] leading-7 text-white">{item.value}</div>
            </div>
          ))}
        </div>
      </section>
      <WritingsClient writings={items} />

      <section className="rounded-[28px] border border-white/8 bg-[linear-gradient(145deg,rgba(8,10,18,0.96),rgba(4,6,12,0.92))] p-8 text-center" style={{ borderLeft: '3px solid var(--cyan)' }}>
        <blockquote className="mb-4 font-oxanium text-[28px] leading-tight text-white italic">
          &ldquo;Writing is thinking made visible.&rdquo;
        </blockquote>
        <p className="mx-auto mb-5 max-w-2xl font-body text-[16px] leading-8 text-[var(--text)]">
          Follow along for insights on AI research, engineering systems at scale, and leading with purpose.
        </p>
        <a
          href="https://www.linkedin.com/in/ayorinde-alase/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full border px-5 py-3 font-mono-hud text-[10px] tracking-[0.16em] uppercase transition-all hover:bg-[rgba(0,243,255,0.08)]"
          style={{ color: 'var(--cyan)', borderColor: 'var(--cyan)' }}
        >
          FOLLOW ON LINKEDIN ↗
        </a>
      </section>
    </div>
  );
}
