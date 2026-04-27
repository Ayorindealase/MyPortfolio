import { SectionHeader } from '@/components/hud/SectionHeader';
import { prisma } from '@/lib/prisma';

type PublicationRecord = Awaited<ReturnType<typeof prisma.publication.findMany>>[number];
type EducationRecord = Awaited<ReturnType<typeof prisma.education.findMany>>[number];

export default async function RndPage() {
  const [publications, education] = await Promise.all([
    prisma.publication.findMany({
      where: { visible: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.education.findMany({
      where: { visible: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <SectionHeader
        tag="SYS.RND"
        title="Research & Development"
        subtitle="Active research, publications, academic training, and the systems thinking behind the work."
      />

      <section
        className="relative overflow-hidden rounded-[30px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(255,184,0,0.12),transparent_28%),linear-gradient(145deg,rgba(8,10,18,0.96),rgba(4,6,12,0.92))] p-6 sm:p-8"
        style={{ borderLeft: '3px solid var(--amber)' }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(circle at 0% 50%, var(--amber) 0%, transparent 60%)' }}
        />
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono-hud text-[11px] tracking-[0.18em] uppercase text-amber">Active Research</span>
            <span
              className="w-2 h-2 rounded-full animate-pulse-glow"
              style={{ backgroundColor: 'var(--green)' }}
            />
            <span className="font-mono-hud text-[10px] tracking-[0.14em] uppercase text-green">Online</span>
          </div>
          <h3 className="mb-3 font-oxanium text-2xl sm:text-3xl font-semibold uppercase tracking-[0.06em] text-white">
            Biomechanics &amp; Human Movement Laboratory
          </h3>
          <p className="mb-5 max-w-3xl font-body text-[16px] leading-8 text-[var(--text)]">
            Deep learning applications in biomechanics and human movement analysis.
            Investigating neural network architectures for motion prediction, injury prevention,
            and rehabilitation optimization.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              'Advisors: Prof. Kamran Iqbal & Prof. AbdelRahman Elfikky',
              'Focus: motion prediction, injury prevention, rehabilitation',
              'Backed by NVIDIA Academic Research Grant',
            ].map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                <div className="font-mono-hud text-[10px] tracking-[0.16em] uppercase text-[var(--text-dim)]">
                  0{index + 1}
                </div>
                <div className="mt-2 font-body text-[15px] leading-7 text-white">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="font-mono-hud text-[11px] tracking-[0.22em] uppercase text-[var(--text-dim)]">
            Academic Formation
          </div>
          <div className="h-px flex-1 bg-white/8" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {education.map((edu: EducationRecord) => (
          <div key={edu.id} className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
            <div className="mb-3 font-mono-hud text-[10px] tracking-[0.16em] uppercase text-[var(--text-dim)]">
              {edu.period}
            </div>
            <div className="mb-2 font-oxanium text-[28px] font-semibold uppercase tracking-[0.05em] text-cyan">{edu.degree}</div>
            <div className="mb-2 font-body text-[17px] text-white">{edu.field}</div>
            <div className="mb-4 font-body text-[15px] text-[var(--text-dim)]">
              {edu.institution} — {edu.location}
            </div>
            <span
              className="rounded-full border px-3 py-1.5 font-mono-hud text-[10px] tracking-[0.14em] uppercase"
              style={{ color: 'var(--green)', borderColor: 'var(--green)', background: 'rgba(0,255,65,0.08)' }}
            >
              GPA {edu.gpa}
            </span>
          </div>
        ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="font-mono-hud text-[11px] tracking-[0.22em] uppercase text-[var(--text-dim)]">
            Publications // {publications.length} Indexed
          </div>
          <div className="h-px flex-1 bg-white/8" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {publications.map((pub: PublicationRecord) => (
          <PubCard key={pub.id} pub={pub} />
        ))}
        </div>
      </section>
    </div>
  );
}

function PubCard({
  pub,
}: {
  pub: {
    id: string;
    title: string;
    abstract: string | null;
    tags: string[];
    type: string;
    date: string;
    doiUrl: string | null;
  };
}) {
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
      <div
        className="absolute top-0 left-0 h-[2px] w-[42%] transition-all duration-500 group-hover:w-full"
        style={{ background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }}
      />
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono-hud text-[10px] tracking-[0.18em] text-cyan uppercase">{pub.type}</span>
          <span className="font-mono-hud text-[10px] text-[var(--text-dim)]">{pub.date}</span>
        </div>
        <h3 className="mb-3 font-oxanium text-[22px] font-semibold leading-tight text-white">
          {pub.title}
        </h3>
        {pub.abstract && (
          <p className="mb-4 font-body text-[14px] leading-7 text-[var(--text)]">
            {pub.abstract}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {pub.tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="hud-tag" style={{ color: 'var(--text-dim)', borderColor: 'var(--glass-border)' }}>
              {tag}
            </span>
          ))}
        </div>
        {pub.doiUrl && (
          <a
            href={pub.doiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-mono-hud text-[10px] tracking-[0.14em] text-cyan transition-all hover:text-glow-cyan"
          >
            DOI ↗
          </a>
        )}
      </div>
    </div>
  );
}
