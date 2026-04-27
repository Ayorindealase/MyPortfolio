import { SectionHeader } from '@/components/hud/SectionHeader';
import { ExperienceCard } from '@/components/hud/ExperienceCard';
import { prisma } from '@/lib/prisma';

type ExperienceRecord = Awaited<ReturnType<typeof prisma.experience.findMany>>[number];
type CertificationRecord = Awaited<ReturnType<typeof prisma.certification.findMany>>[number];

export default async function OpsPage() {
  const [experiences, certifications] = await Promise.all([
    prisma.experience.findMany({
      where: { visible: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.certification.findMany({
      where: { visible: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <SectionHeader
        tag="SYS.OPS"
        title="Operations Log"
        subtitle="Professional experience, technical deployments, and the execution layer behind the research."
      />

      <section className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(0,243,255,0.12),transparent_28%),linear-gradient(145deg,rgba(8,10,18,0.96),rgba(4,6,12,0.92))] p-6 sm:p-8">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="relative z-10 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Deployment Mode', value: 'Research into production systems', color: 'var(--cyan)' },
            { label: 'Operating Style', value: 'Build, lead, ship, iterate', color: 'var(--green)' },
            { label: 'Coverage', value: `${experiences.length} experience nodes / ${certifications.length} certifications`, color: 'var(--amber)' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm">
              <div className="font-mono-hud text-[11px] tracking-[0.18em] uppercase" style={{ color: item.color }}>
                {item.label}
              </div>
              <div className="mt-2 font-body text-[16px] leading-7 text-white">{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="font-mono-hud text-[11px] tracking-[0.22em] uppercase text-[var(--text-dim)]">
            Career Timeline
          </div>
          <div className="h-px flex-1 bg-white/8" />
        </div>
        <div className="space-y-4">
        {experiences.map((exp: ExperienceRecord) => (
          <ExperienceCard key={exp.id} {...exp} />
        ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="font-mono-hud text-[11px] tracking-[0.22em] uppercase text-[var(--text-dim)]">
            Certifications // Verified
          </div>
          <div className="rounded-full border border-green/25 bg-green/10 px-3 py-1.5 font-mono-hud text-[10px] tracking-[0.16em] uppercase text-green">
            {certifications.length} Active
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {certifications.map((cert: CertificationRecord) => (
            <div
              key={cert.title}
              className="min-w-[260px] flex-1 rounded-[22px] border border-white/8 bg-black/20 px-5 py-4"
            >
              <div className="font-body text-[16px] font-medium text-white">{cert.title}</div>
              {cert.certId && (
                <div className="mt-2 font-mono-hud text-[10px] tracking-[0.12em] uppercase text-[var(--text-dim)]">
                  ID: {cert.certId}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
