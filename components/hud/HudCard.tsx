import { cn } from '@/lib/utils';

interface HudCardProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: 'cyan' | 'green' | 'amber' | 'red';
  glowOnHover?: boolean;
}

export function HudCard({ children, className, accentColor = 'cyan', glowOnHover = false }: HudCardProps) {
  const glowMap = {
    cyan: 'hover:shadow-[0_0_30px_rgba(0,243,255,0.15)]',
    green: 'hover:shadow-[0_0_30px_rgba(0,255,65,0.15)]',
    amber: 'hover:shadow-[0_0_30px_rgba(255,184,0,0.15)]',
    red: 'hover:shadow-[0_0_30px_rgba(255,62,62,0.15)]',
  };

  return (
    <div
      className={cn(
        'hud-card transition-shadow duration-300',
        glowOnHover && glowMap[accentColor],
        className
      )}
    >
      {children}
    </div>
  );
}
