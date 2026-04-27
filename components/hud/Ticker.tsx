'use client';

const DEFAULT_ITEMS = [
  { text: 'NVIDIA ACADEMIC RESEARCH GRANT — ACTIVE', color: 'var(--green)' },
  { text: 'PHD CANDIDATE • UNIVERSITY OF ARKANSAS AT LITTLE ROCK • GPA 4.0/4.0', color: 'var(--cyan)' },
  { text: 'PAVA LA PERE INNOVATION AWARD — $50K NON-DILUTIVE GRANT', color: 'var(--amber)' },
  { text: 'CTO • KAIROS NEXUS GLOBAL • KAIROSNG.COM', color: 'var(--cyan)' },
  { text: 'NSBE 25 UNDER 25 HONOR AWARD 2026', color: 'var(--green)' },
  { text: 'INCOMING PHD DATA SCIENCE INTERN • HERE TECHNOLOGIES', color: 'var(--amber)' },
  { text: '4 PUBLICATIONS • 6 AWARDS 2025-26 • RSO PRESIDENT OF THE YEAR', color: 'var(--cyan)' },
  { text: '2022 MT SCHOLAR • 0.07% ACCEPTANCE RATE', color: 'var(--amber)' },
];

interface TickerItem {
  text: string;
  color: string;
}

interface TickerProps {
  items?: TickerItem[];
}

export function Ticker({ items = DEFAULT_ITEMS }: TickerProps) {
  const displayItems = items.length > 0 ? items : DEFAULT_ITEMS;
  const doubled = [...displayItems, ...displayItems];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 overflow-hidden flex items-center"
      style={{
        height: '36px',
        background: 'var(--ticker-bg)',
        borderTop: '1px solid var(--ticker-border)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center mr-12 font-mono-hud text-[10px] tracking-[0.18em] uppercase">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full mr-3 animate-pulse-glow"
              style={{ backgroundColor: item.color }}
            />
            <span style={{ color: item.color }}>{item.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
