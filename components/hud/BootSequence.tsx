'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  { text: 'KAIROS_OS v4.0 // NEURAL RUNTIME', delay: 400 },
  { text: 'AUTHENTICATING CLEARANCE... ██████ OK', delay: 700 },
  { text: 'PROFILE: AYORINDE ALASE', delay: 1000 },
  { text: 'ROLE: AI SCIENTIST • PHD CANDIDATE • CTO', delay: 1200 },
  { text: 'AFFILIATION: NVIDIA RESEARCH • NSBE • UA LITTLE ROCK', delay: 1400 },
  { text: 'LOADING NEURAL ARCHITECTURE MAP...', delay: 1700 },
  { text: 'CONNECTIONS ESTABLISHED: 4 PUBLICATIONS • 6 AWARDS', delay: 2000 },
  { text: 'ALL SYSTEMS NOMINAL. WELCOME, ARCHITECT.', delay: 2300 },
];

const GLITCH_CHARS = '█▓▒░╬╫╪┼';
const TARGET_NAME = 'AYORINDE ALASE';

function useGlitchText(target: string, startDelay: number, duration: number) {
  const [text, setText] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      let frame = 0;
      const totalFrames = duration / 50;
      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const revealed = Math.floor(progress * target.length);
        let result = '';
        for (let i = 0; i < target.length; i++) {
          if (i < revealed) {
            result += target[i];
          } else if (target[i] === ' ') {
            result += ' ';
          } else {
            result += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          }
        }
        setText(result);
        if (frame >= totalFrames) {
          setText(target);
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timer);
  }, [target, startDelay, duration]);

  return text;
}

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const glitchName = useGlitchText(TARGET_NAME, 300, 1200);

  useEffect(() => {
    const duration = 2800;
    const start = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(p * 100);
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
      }, line.delay);
    });

    setTimeout(() => {
      setDone(true);
      setTimeout(onComplete, 600);
    }, 3000);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center z-[9999]"
          style={{ background: 'var(--bg)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full max-w-lg px-8">
            {/* Name glitch */}
            <div
              className="font-oxanium text-4xl font-bold mb-8 text-center tracking-[6px]"
              style={{ color: 'var(--cyan)', textShadow: '0 0 20px var(--cyan)', minHeight: '48px' }}
            >
              {glitchName}
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between font-mono-hud text-[9px] text-[var(--text-dim)] mb-1">
                <span>SYSTEM INITIALIZATION</span>
                <span>{Math.floor(progress)}%</span>
              </div>
              <div className="h-1 w-full rounded-none" style={{ background: 'rgba(0,243,255,0.1)' }}>
                <motion.div
                  className="h-full"
                  style={{ background: 'var(--cyan)', boxShadow: '0 0 10px var(--cyan)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Boot log */}
            <div className="space-y-1">
              {BOOT_LINES.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={visibleLines.includes(i) ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3 }}
                  className="font-mono-hud text-[10px] tracking-[1px]"
                  style={{
                    color: i === BOOT_LINES.length - 1 ? 'var(--green)' : 'var(--text-dim)',
                  }}
                >
                  &gt; {line.text}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
