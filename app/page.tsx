import { DataCore } from '@/components/hud/DataCore';
import { AnimatedStat } from '@/components/hud/AnimatedStat';
import { SkillCluster } from '@/components/hud/SkillCluster';
import { SectionHeader } from '@/components/hud/SectionHeader';
import { prisma } from '@/lib/prisma';

const SIGNALS = [
  { label: 'Research', value: 'Biomechanics x Deep Learning', color: 'var(--cyan)' },
  { label: 'Current Seat', value: 'NVIDIA Academic Grant', color: 'var(--green)' },
  { label: 'Leadership', value: 'CTO, Kairos Nexus Global', color: 'var(--amber)' },
];

const STATUS_BADGES = [
  { label: 'PHD CANDIDATE', color: 'var(--cyan)' },
  { label: 'NVIDIA RESEARCH', color: 'var(--green)', pulse: true },
  { label: '4.0 GPA', color: 'var(--cyan)' },
  { label: 'BUILDS AT SCALE', color: 'var(--amber)' },
];

const LIVE_METRICS = [
  { code: 'SYS.FOCUS', value: 'Human Movement Intelligence' },
  { code: 'LAB.MODE', value: 'Research + Product Execution' },
  { code: 'NEXT.RUN', value: 'Agentic Systems / Applied ML' },
];

type StatRecord = Awaited<ReturnType<typeof prisma.stat.findMany>>[number];

export default async function HomePage() {
  const [profile, allStats, skills] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.stat.findMany({
      where: { visible: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.skill.findMany({
      where: { visible: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  const heroLinks = [
    { label: 'LINKEDIN', href: profile?.linkedinUrl },
    { label: 'GITHUB', href: profile?.githubUrl },
    { label: profile?.companyName?.toUpperCase() ?? 'COMPANY', href: profile?.companyUrl },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));
  const stats = allStats.filter((stat: StatRecord) => !stat.label.toUpperCase().includes('MT SCHOLAR'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <section className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(0,243,255,0.16),transparent_32%),radial-gradient(circle_at_82%_24%,rgba(255,184,0,0.14),transparent_26%),linear-gradient(145deg,rgba(8,10,18,0.96),rgba(4,6,12,0.92))] px-5 py-6 sm:px-8 sm:py-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute -left-16 top-14 h-36 w-36 rounded-full bg-cyan/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-amber/10 blur-3xl" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 font-mono-hud text-[11px] tracking-[0.24em] text-cyan uppercase">
                <span className="h-2 w-2 rounded-full bg-cyan animate-pulse-glow" />
                Neural Profile
              </span>
              <span className="font-mono-hud text-[11px] tracking-[0.18em] uppercase text-[var(--text-dim)]">
                Research Systems / Applied Intelligence / Technical Leadership
              </span>
            </div>

            <div className="max-w-4xl space-y-4">
              <h1 className="font-oxanium text-5xl leading-[0.94] sm:text-6xl xl:text-7xl font-semibold tracking-[0.05em] uppercase text-white">
                {profile?.name ?? 'Ayorinde Alase'}
              </h1>
              <div className="font-mono-hud text-[12px] sm:text-[13px] tracking-[0.28em] uppercase text-[var(--text-dim)]">
                {profile?.title ?? 'AI Scientist / PhD Candidate / Builder of high-stakes systems'}
              </div>
              <p className="max-w-2xl text-[17px] sm:text-[19px] leading-8 text-[var(--text)]">
                {profile?.bio ?? 'Profile bio not configured yet.'}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {SIGNALS.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="font-mono-hud text-[11px] tracking-[0.2em] uppercase" style={{ color: signal.color }}>
                    {signal.label}
                  </div>
                  <div className="mt-2 text-[15px] leading-7 text-white">{signal.value}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {STATUS_BADGES.map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono-hud text-[11px] tracking-[0.16em] uppercase"
                  style={{
                    color: badge.color,
                    border: `1px solid ${badge.color}40`,
                    background: `${badge.color}10`,
                    boxShadow: `inset 0 0 0 1px ${badge.color}10`,
                  }}
                >
                  {badge.pulse && (
                    <span
                      className="h-2 w-2 rounded-full animate-pulse-glow"
                      style={{ backgroundColor: badge.color }}
                    />
                  )}
                  {badge.label}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {heroLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 font-mono-hud text-[11px] tracking-[0.18em] text-[var(--text-bright)] uppercase transition-all duration-200 hover:border-cyan/40 hover:bg-cyan/8"
                >
                  <span>{link.label}</span>
                  <span className="text-cyan transition-transform duration-200 group-hover:translate-x-1">↗</span>
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="relative overflow-hidden rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 sm:p-6">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent opacity-60" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono-hud text-[11px] tracking-[0.22em] uppercase text-cyan">Neural Core</div>
                  <div className="mt-2 text-[15px] leading-7 text-[var(--text)]">
                    Live system map of research, shipping velocity, and leadership signals.
                  </div>
                </div>
                <div className="rounded-full border border-green/30 bg-green/10 px-3 py-1.5 font-mono-hud text-[11px] tracking-[0.18em] text-green uppercase">
                  Online
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <DataCore />
              </div>
            </div>

            <div className="rounded-[26px] border border-white/8 bg-black/25 p-5 backdrop-blur-sm">
              <div className="font-mono-hud text-[11px] tracking-[0.22em] uppercase text-amber">Active Channels</div>
              <div className="mt-4 space-y-4">
                {LIVE_METRICS.map((metric, index) => (
                  <div key={metric.code} className="flex items-start justify-between gap-4 border-b border-white/6 pb-4 last:border-b-0 last:pb-0">
                    <div>
                      <div className="font-mono-hud text-[10px] tracking-[0.18em] uppercase text-[var(--text-dim)]">
                        {metric.code}
                      </div>
                      <div className="mt-1 text-[15px] leading-7 text-white">{metric.value}</div>
                    </div>
                    <div className="font-oxanium text-xl text-white/25">0{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat: StatRecord) => (
          <AnimatedStat
            key={stat.id}
            value={stat.value}
            suffix={stat.suffix ?? ''}
            label={stat.label}
            color={stat.color}
          />
        ))}
      </section>

      <section className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 sm:p-7 shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
        <SectionHeader
          tag="SYS.SKILLS"
          title="Tech Arsenal"
          subtitle="The stack spans research prototyping, production AI systems, and the data infrastructure behind them."
        />
        <SkillCluster skills={skills} />
      </section>
    </div>
  );
}
