/* eslint-disable @next/next/no-img-element */

import { SectionHeader } from '@/components/hud/SectionHeader';
import { prisma } from '@/lib/prisma';

const accents = ['var(--cyan)', 'var(--green)', 'var(--amber)', 'var(--red)'];

export default async function FieldNotesPage() {
  const notes = await prisma.writing.findMany({
    where: {
      type: 'gallery',
      isPublished: true,
    },
    orderBy: [{ sortOrder: 'asc' }, { publishedDate: 'desc' }],
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <SectionHeader
        tag="SYS.VIS"
        title="Field Notes"
        subtitle="A visual log for research, building, leadership, and the work happening behind the portfolio."
      />

      <div className="mb-8 rounded-[28px] border border-white/8 bg-[linear-gradient(145deg,rgba(8,10,18,0.96),rgba(4,6,12,0.92))] p-6 sm:p-8 overflow-hidden relative">
        <div className="absolute inset-0 grid-pattern opacity-25" />
        <div className="relative z-10 max-w-3xl">
          <div className="font-mono-hud text-[11px] tracking-[0.24em] uppercase text-cyan">
            Visual Journal
          </div>
          <h1 className="mt-3 font-oxanium text-4xl sm:text-5xl font-semibold uppercase tracking-[0.08em] text-white">
            Behind The Work
          </h1>
          <p className="mt-4 text-[17px] leading-8 text-[var(--text)]">
            This page is where lab moments, speaking engagements, team sessions, and build-in-public snapshots live.
            Every card here is now designed to be managed through the admin panel.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {notes.map((note, index) => {
          const accent = accents[index % accents.length];
          return (
            <article
              key={note.id}
              className="relative overflow-hidden rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] min-h-[320px] p-4"
            >
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background: `radial-gradient(circle at top left, ${accent}22, transparent 42%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.08))`,
                }}
              />
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-4 overflow-hidden rounded-[18px] border border-white/8 bg-black/30">
                  <img
                    src={note.content}
                    alt={note.title}
                    className="h-[240px] w-full object-cover"
                  />
                </div>
                <div className="font-mono-hud text-[11px] tracking-[0.2em] uppercase" style={{ color: accent }}>
                  Frame {String(index + 1).padStart(2, '0')}
                </div>
                <h2 className="mt-2 font-oxanium text-[28px] uppercase tracking-[0.06em] text-white">
                  {note.title}
                </h2>
                {note.abstract && (
                  <p className="mt-3 text-[15px] leading-7 text-[var(--text)]">{note.abstract}</p>
                )}
                {note.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 px-3 py-1.5 font-mono-hud text-[10px] tracking-[0.12em] uppercase text-white/55"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {notes.length === 0 && (
        <div className="mt-8 rounded-[24px] border border-dashed border-white/12 p-8 text-center text-[var(--text-dim)]">
          No field notes published yet. Add gallery entries from the admin panel.
        </div>
      )}
    </div>
  );
}
