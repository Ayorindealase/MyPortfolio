'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExperienceCardProps {
  role: string;
  company: string;
  location: string;
  period: string;
  accentColor?: string;
  highlights: string[];
}

const colorMap: Record<string, string> = {
  cyan: 'var(--cyan)',
  green: 'var(--green)',
  amber: 'var(--amber)',
  red: 'var(--red)',
};

export function ExperienceCard({
  role,
  company,
  location,
  period,
  accentColor = 'cyan',
  highlights,
}: ExperienceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const color = colorMap[accentColor] || colorMap.cyan;

  return (
    <div className="hud-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
      <button
        className="flex w-full items-start justify-between gap-4 p-6 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="mb-3 inline-flex rounded-full border px-3 py-1 font-mono-hud text-[10px] tracking-[0.16em] uppercase" style={{ color, borderColor: `${color}55`, background: `${color}10` }}>
            Mission Node
          </div>
          <h3 className="mb-2 font-oxanium text-[24px] font-semibold uppercase tracking-[0.06em] text-white">
            {role}
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono-hud text-[12px] tracking-[0.14em] uppercase" style={{ color }}>
              {company}
            </span>
            <span className="font-body text-[15px] text-[var(--text-dim)]">{location}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="mb-2 font-mono-hud text-[11px] tracking-[0.12em] uppercase text-[var(--text-dim)]">{period}</div>
          <div
            className="font-mono-hud text-[10px] tracking-[0.14em] uppercase"
            style={{ color }}
          >
            {expanded ? '▲ COLLAPSE' : '▼ EXPAND INTEL'}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              className="space-y-2 border-t px-6 pb-6"
              style={{ borderColor: 'var(--glass-border)' }}
            >
              <div className="space-y-3 pt-5">
                {highlights.map((h, i) => (
                  <p key={i} className="border-l-2 pl-4 font-body text-[15px] leading-7 text-[var(--text)]" style={{ borderColor: color }}>
                    <span className="mr-2 opacity-60">▸</span>
                    {h}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
