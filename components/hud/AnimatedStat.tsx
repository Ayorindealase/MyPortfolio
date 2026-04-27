'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedStatProps {
  value: string;
  suffix?: string;
  label: string;
  color?: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function AnimatedStat({ value, suffix = '', label, color = 'cyan' }: AnimatedStatProps) {
  const [displayed, setDisplayed] = useState('0');
  const startedRef = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  const colorMap: Record<string, string> = {
    cyan: 'var(--cyan)',
    green: 'var(--green)',
    amber: 'var(--amber)',
  };

  const accentColor = colorMap[color] || colorMap.cyan;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const numericValue = parseFloat(value);
          if (isNaN(numericValue)) {
            setDisplayed(value);
            return;
          }
          const duration = 2000;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            const current = numericValue * eased;
            setDisplayed(
              numericValue < 1
                ? current.toFixed(2)
                : Math.floor(current).toString()
            );
            if (progress < 1) requestAnimationFrame(animate);
            else setDisplayed(value);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 sm:p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/14 hover:shadow-[0_20px_80px_rgba(0,0,0,0.32)]"
    >
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{ background: `linear-gradient(180deg, ${accentColor}, transparent)` }}
      />
      <div className="font-mono-hud text-[11px] tracking-[0.22em] uppercase text-[var(--text-dim)]">
        {label}
      </div>
      <div
        className="mt-4 font-oxanium text-[2.75rem] sm:text-[3.5rem] leading-none font-semibold"
        style={{ color: accentColor, textShadow: `0 0 20px ${accentColor}` }}
      >
        {displayed}{suffix}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="h-px flex-1 bg-white/8" />
        <div className="pl-4 font-mono-hud text-[11px] tracking-[0.18em] uppercase text-white/35">
          Live Metric
        </div>
      </div>
    </div>
  );
}
