'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Profile', href: '/admin/profile' },
  { label: 'Experience', href: '/admin/experience', createHref: '/admin/experience?new=1' },
  { label: 'Education', href: '/admin/education', createHref: '/admin/education?new=1' },
  { label: 'Publications', href: '/admin/publications', createHref: '/admin/publications?new=1' },
  { label: 'Writings', href: '/admin/writings', createHref: '/admin/writings/new' },
  { label: 'Field Notes', href: '/admin/field-notes', createHref: '/admin/field-notes/new' },
  { label: 'Leadership', href: '/admin/leadership', createHref: '/admin/leadership?new=1' },
  { label: 'Awards', href: '/admin/awards', createHref: '/admin/awards?new=1' },
  { label: 'Certifications', href: '/admin/certifications', createHref: '/admin/certifications?new=1' },
  { label: 'Skills', href: '/admin/skills', createHref: '/admin/skills?new=1' },
  { label: 'Stats', href: '/admin/stats', createHref: '/admin/stats?new=1' },
  { label: 'Ticker', href: '/admin/ticker', createHref: '/admin/ticker?new=1' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="w-56 bg-[#060609] border-r border-[#1a1a2e] flex flex-col h-full">
      <div className="p-4 border-b border-[#1a1a2e]">
        <div className="text-xs font-mono text-cyan-400 tracking-[3px]">CONTROL DECK</div>
        <div className="text-[10px] text-gray-600 font-mono mt-0.5">Ayorinde Alase Portfolio</div>
      </div>
      <nav className="flex-1 p-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <div
              key={item.href}
              className="flex items-center gap-1 mb-0.5"
            >
              <Link
                href={item.href}
                className="flex-1 flex items-center px-3 py-2 rounded text-sm transition-colors"
                style={{
                  background: active ? 'rgba(0,243,255,0.08)' : 'transparent',
                  color: active ? '#00f3ff' : '#6b7280',
                  borderLeft: active ? '2px solid #00f3ff' : '2px solid transparent',
                }}
              >
                {item.label}
              </Link>
              {item.createHref && (
                <Link
                  href={item.createHref}
                  aria-label={`Add new ${item.label}`}
                  className="h-8 w-8 rounded flex items-center justify-center text-sm transition-colors"
                  style={{
                    color: '#00f3ff',
                    background: 'rgba(0,243,255,0.08)',
                    border: '1px solid rgba(0,243,255,0.18)',
                  }}
                >
                  +
                </Link>
              )}
            </div>
          );
        })}
      </nav>
      <div className="p-3 border-t border-[#1a1a2e]">
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:text-red-400 font-mono tracking-wider transition-colors"
        >
          LOGOUT
        </button>
        <Link
          href="/"
          target="_blank"
          className="block px-3 py-1 text-xs text-gray-600 hover:text-cyan-400 font-mono tracking-wider transition-colors"
        >
          VIEW SITE ↗
        </Link>
      </div>
    </aside>
  );
}
