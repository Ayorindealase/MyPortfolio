interface SectionHeaderProps {
  tag: string;
  title: string;
  subtitle?: string;
}

export function SectionHeader({ tag, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="mb-3 font-mono-hud text-[11px] tracking-[0.28em] text-cyan uppercase opacity-80">
        {tag}
      </div>
      <h2 className="mb-4 font-oxanium text-4xl sm:text-5xl font-semibold text-white uppercase tracking-[0.08em]">
        {title}
      </h2>
      <div className="flex items-center gap-4">
        <div className="h-px w-28 bg-gradient-to-r from-cyan to-cyan/0 opacity-90" />
        <div className="h-px flex-1 bg-white/8" />
      </div>
      {subtitle && (
        <p className="mt-4 max-w-2xl font-body text-[16px] sm:text-[17px] leading-8 text-[var(--text)]">{subtitle}</p>
      )}
    </div>
  );
}
