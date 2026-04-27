import Link from 'next/link';

const SECTIONS = [
  { label: 'Profile', href: '/admin/profile', desc: 'Edit bio, links, philosophy' },
  { label: 'Experience', href: '/admin/experience', desc: 'Work history entries', createHref: '/admin/experience?new=1' },
  { label: 'Education', href: '/admin/education', desc: 'Degrees and institutions', createHref: '/admin/education?new=1' },
  { label: 'Publications', href: '/admin/publications', desc: 'Research papers', createHref: '/admin/publications?new=1' },
  { label: 'Writings', href: '/admin/writings', desc: 'Blog articles with MDX', createHref: '/admin/writings/new' },
  { label: 'Field Notes', href: '/admin/field-notes', desc: 'Photo gallery cards', createHref: '/admin/field-notes/new' },
  { label: 'Leadership', href: '/admin/leadership', desc: 'Roles and organizations', createHref: '/admin/leadership?new=1' },
  { label: 'Awards', href: '/admin/awards', desc: 'Honors and recognition', createHref: '/admin/awards?new=1' },
  { label: 'Certifications', href: '/admin/certifications', desc: 'Professional certs', createHref: '/admin/certifications?new=1' },
  { label: 'Skills', href: '/admin/skills', desc: 'Tech stack by category', createHref: '/admin/skills?new=1' },
  { label: 'Stats', href: '/admin/stats', desc: 'Homepage counter values', createHref: '/admin/stats?new=1' },
  { label: 'Ticker', href: '/admin/ticker', desc: 'Status bar items', createHref: '/admin/ticker?new=1' },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Control Deck</h1>
      <p className="text-gray-400 text-sm mb-8">Manage all portfolio content from here.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <Link
          href="/admin/writings/new"
          className="rounded border border-cyan-400/30 bg-cyan-400/10 p-5 hover:bg-cyan-400/15 transition-colors"
        >
          <div className="text-sm font-bold text-white mb-1">+ New Writing</div>
          <div className="text-xs text-gray-300">Create a normal on-site article or research post.</div>
        </Link>
        <Link
          href="/admin/writings/new?type=external"
          className="rounded border border-amber-400/30 bg-amber-400/10 p-5 hover:bg-amber-400/15 transition-colors"
        >
          <div className="text-sm font-bold text-white mb-1">+ Add Medium Link</div>
          <div className="text-xs text-gray-300">Paste a Medium article URL and publish it through the same writings system.</div>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {SECTIONS.map((s) => (
          <div
            key={s.href}
            className="bg-[#111118] border border-[#1e1e2e] rounded p-4 hover:border-cyan-400/30 hover:bg-[#13131f] transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <Link href={s.href} className="flex-1">
                <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors mb-1">
                  {s.label}
                </div>
                <div className="text-xs text-gray-500">{s.desc}</div>
              </Link>
              {s.createHref && (
                <Link
                  href={s.createHref}
                  aria-label={`Add new ${s.label}`}
                  className="h-8 w-8 rounded flex items-center justify-center text-sm font-bold text-cyan-400 border border-cyan-400/20 bg-cyan-400/5 hover:bg-cyan-400/10 transition-colors"
                >
                  +
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
