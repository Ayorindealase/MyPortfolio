'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'COMMAND', short: 'CMD', href: '/' },
  { label: 'OPERATIONS', short: 'OPS', href: '/ops' },
  { label: 'R&D', short: 'R&D', href: '/rnd' },
  { label: 'FIELD NOTES', short: 'FLD', href: '/field-notes' },
  { label: 'TRANSMISSIONS', short: 'TRX', href: '/writings' },
  { label: 'LEADERSHIP', short: 'LDR', href: '/leadership' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 h-[72px]"
      style={{
        background: 'linear-gradient(180deg, rgba(3,3,8,0.94), rgba(3,3,8,0.72))',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
      }}
    >
      <Link href="/" className="group">
        <div className="font-oxanium text-cyan text-base sm:text-lg font-semibold tracking-[0.32em] uppercase transition-all group-hover:text-glow-cyan">
          A.ALASE
        </div>
        <div className="font-mono-hud text-[10px] tracking-[0.18em] uppercase text-white/36">
          Neural Portfolio
        </div>
      </Link>

      <div className="flex items-center gap-1 rounded-full border p-1.5" style={{ borderColor: 'var(--nav-shell-border)', background: 'var(--nav-shell-bg)' }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative rounded-full px-3.5 sm:px-5 py-2.5 font-mono-hud transition-all duration-200 ${active ? '' : 'animate-nav-beacon'}`}
              style={{
                fontSize: '10px',
                letterSpacing: '0.18em',
                color: active ? 'var(--cyan)' : 'var(--text-dim)',
                background: active
                  ? 'linear-gradient(180deg, rgba(0,243,255,0.12), rgba(0,243,255,0.05))'
                  : 'var(--nav-pill-bg)',
                boxShadow: active
                  ? 'inset 0 0 0 1px rgba(0,243,255,0.24), 0 0 28px rgba(0,243,255,0.16)'
                  : 'inset 0 0 0 1px var(--nav-pill-border), 0 0 12px rgba(0,243,255,0.05)',
                textShadow: active ? '0 0 12px rgba(0,243,255,0.65)' : '0 0 10px rgba(255,255,255,0.08)',
              }}
            >
              {!active && (
                <span className="absolute inset-0 rounded-full pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.08),transparent_70%)] opacity-70" />
              )}
              <span className="hidden sm:block">{item.label}</span>
              <span className="sm:hidden">{item.short}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
