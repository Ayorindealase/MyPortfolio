'use client';

export function DataCore() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,243,255,0.14),transparent_58%)] blur-2xl" />
      <div
        className="absolute rounded-full opacity-80"
        style={{
          width: 236,
          height: 236,
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 68%)',
        }}
      />
      <div
        className="absolute rounded-full border border-cyan/40 opacity-40 animate-spin-slow"
        style={{ width: 232, height: 232 }}
      />
      <div
        className="absolute rounded-full border border-dashed border-white/12 animate-spin-reverse"
        style={{ width: 184, height: 184 }}
      />
      <div
        className="absolute rounded-full border border-green/30 opacity-50 animate-spin-reverse"
        style={{ width: 148, height: 148, animationDuration: '13s' }}
      />
      <div
        className="absolute rounded-full border border-amber/30 opacity-50 animate-spin-slow"
        style={{ width: 104, height: 104, animationDuration: '8s' }}
      />
      <div className="absolute" style={{ width: 232, height: 232 }}>
        <div
          className="absolute h-2.5 w-2.5 rounded-full bg-cyan"
          style={{
            top: '50%',
            left: '50%',
            marginTop: -5,
            marginLeft: -5,
            animation: 'orbit 9s linear infinite',
            '--radius': '112px',
            boxShadow: '0 0 10px var(--cyan), 0 0 24px rgba(0,243,255,0.65)',
          } as React.CSSProperties}
        />
      </div>
      <div className="absolute" style={{ width: 184, height: 184 }}>
        <div
          className="absolute h-2 w-2 rounded-full bg-green"
          style={{
            top: '50%',
            left: '50%',
            marginTop: -4,
            marginLeft: -4,
            animation: 'orbit 5.5s linear infinite reverse',
            '--radius': '88px',
            boxShadow: '0 0 10px var(--green), 0 0 20px rgba(0,255,65,0.4)',
          } as React.CSSProperties}
        />
      </div>
      <div className="absolute" style={{ width: 104, height: 104 }}>
        <div
          className="absolute h-2 w-2 rounded-full bg-amber"
          style={{
            top: '50%',
            left: '50%',
            marginTop: -4,
            marginLeft: -4,
            animation: 'orbit 3.8s linear infinite',
            '--radius': '48px',
            boxShadow: '0 0 10px var(--amber), 0 0 20px rgba(255,184,0,0.35)',
          } as React.CSSProperties}
        />
      </div>

      <div
        className="absolute h-24 w-24 rounded-full animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(0,243,255,0.45) 0%, rgba(0,243,255,0.12) 45%, transparent 75%)',
        }}
      />
      <div className="absolute h-14 w-14 rounded-full border border-cyan/25 bg-black/30 backdrop-blur-md" />
      <div className="relative z-10 text-center">
        <div className="font-oxanium text-2xl uppercase tracking-[0.24em] text-cyan text-glow-cyan">AI</div>
        <div className="mt-1 font-mono-hud text-[10px] tracking-[0.22em] text-white/55">CORE</div>
      </div>
    </div>
  );
}
