import { SectionHeader } from '@/components/hud/SectionHeader';
import { prisma } from '@/lib/prisma';

const colorMap: Record<string, string> = {
  cyan: 'var(--cyan)',
  green: 'var(--green)',
  amber: 'var(--amber)',
};

export default async function LeadershipPage() {
  const [roles, awards, profile] = await Promise.all([
    prisma.leadershipRole.findMany({
      where: { visible: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.award.findMany({
      where: { visible: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.profile.findFirst(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <SectionHeader
        tag="SYS.CMD"
        title="Command Roster"
        subtitle="Leadership roles, honors, philosophy, and the public-facing signals of how the work is carried."
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {roles.map((role) => {
          const color = colorMap[role.accentColor] || colorMap.cyan;
          return (
            <div
              key={role.id}
              className="relative overflow-hidden rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.24)]"
              style={{ borderTop: `2px solid ${color}` }}
            >
              <div
                className="absolute inset-0 opacity-5"
                style={{ background: `radial-gradient(circle at 0% 0%, ${color} 0%, transparent 60%)` }}
              />
              <div className="relative z-10">
                <div className="mb-3 inline-flex rounded-full border px-3 py-1 font-mono-hud text-[10px] tracking-[0.16em] uppercase" style={{ color, borderColor: `${color}50`, background: `${color}10` }}>
                  Leadership Node
                </div>
                <div className="mb-2 font-oxanium text-[26px] font-semibold uppercase tracking-[0.05em]" style={{ color }}>
                  {role.title}
                </div>
                <div className="mb-4 font-mono-hud text-[11px] tracking-[0.14em] uppercase text-[var(--text-dim)]">
                  {role.organization}
                </div>
                <p className="mb-4 font-body text-[15px] leading-7 text-[var(--text)]">
                  {role.description}
                </p>
                {role.link && (
                  <a
                    href={role.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-hud text-[10px] tracking-[0.14em] uppercase transition-all"
                    style={{ color }}
                  >
                    VISIT ↗
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <section className="rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(255,184,0,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="font-mono-hud text-[11px] tracking-[0.22em] uppercase text-[var(--text-dim)]">
            Honors &amp; Awards
          </div>
          <div className="rounded-full border border-amber/25 bg-amber/10 px-3 py-1.5 font-mono-hud text-[10px] tracking-[0.16em] uppercase text-amber">
            {awards.length} Entries
          </div>
        </div>
        <div className="space-y-0">
          {awards.map((award, i) => (
            <div
              key={award.title}
              className="flex items-center gap-4 py-4"
              style={{ borderBottom: i < awards.length - 1 ? '1px solid var(--glass-border)' : 'none' }}
            >
              <span
                className="font-oxanium text-2xl font-bold w-10 flex-shrink-0 text-right"
                style={{ color: 'var(--text-dim)', opacity: 0.4 }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <div className="font-body text-[16px] leading-7 text-white">{award.title}</div>
              </div>
              <span
                className="flex-shrink-0 rounded-full border px-3 py-1.5 font-mono-hud text-[10px] tracking-[0.14em] uppercase"
                style={{ color: 'var(--amber)', borderColor: 'rgba(255,184,0,0.3)', background: 'rgba(255,184,0,0.08)' }}
              >
                {award.year}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-white/8 bg-[linear-gradient(145deg,rgba(8,10,18,0.96),rgba(4,6,12,0.92))] p-8" style={{ borderLeft: '3px solid var(--cyan)' }}>
        <div className="mb-4 font-mono-hud text-[11px] tracking-[0.22em] uppercase text-[var(--text-dim)]">
          Philosophy // Core Directive
        </div>
        <blockquote className="mb-5 max-w-4xl font-oxanium text-[24px] leading-[1.5] text-white italic">
          &ldquo;{profile?.philosophy ?? 'Profile philosophy not configured in admin yet.'}&rdquo;
        </blockquote>
        <div className="font-mono-hud text-[11px] tracking-[0.14em] uppercase text-cyan">— {profile?.name ?? 'Ayorinde Alase'}</div>
      </section>

      <section className="rounded-[28px] border border-white/8 bg-black/25 p-6 sm:p-7">
        <div className="mb-5 font-mono-hud text-[11px] tracking-[0.22em] uppercase text-[var(--text-dim)]">Contact Terminal v1.0</div>
        <div className="space-y-3 font-mono-hud text-[13px] leading-7">
          {[
            { cmd: 'echo $CONTACT_EMAIL', val: profile?.email ?? 'Not configured', color: 'var(--cyan)' },
            { cmd: 'echo $LOCATION', val: profile?.location ?? 'Not configured', color: 'var(--text)' },
            { cmd: 'echo $STATUS', val: 'Open to research collaborations & speaking engagements', color: 'var(--green)' },
          ].map(({ cmd, val, color }) => (
            <div key={cmd}>
              <span className="text-[var(--text-dim)]">$ </span>
              <span className="text-white">{cmd}</span>
              <br />
              <span style={{ color }}>{val}</span>
            </div>
          ))}
          <div>
            <span className="text-[var(--text-dim)]">$ </span>
            <span className="animate-blink text-cyan">_</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { label: 'EMAIL', href: profile?.email ? `mailto:${profile.email}` : '' },
            { label: 'LINKEDIN', href: profile?.linkedinUrl ?? '' },
            { label: 'GITHUB', href: profile?.githubUrl ?? '' },
          ].filter((link) => Boolean(link.href)).map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border px-4 py-2.5 font-mono-hud text-[10px] tracking-[0.16em] uppercase transition-all hover:bg-[rgba(255,184,0,0.08)]"
              style={{ color: 'var(--amber)', borderColor: 'rgba(255,184,0,0.4)' }}
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
