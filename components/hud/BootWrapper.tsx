'use client';

import { useState, useEffect } from 'react';
import { BootSequence } from './BootSequence';

export function BootWrapper() {
  const [showBoot, setShowBoot] = useState(false);

  useEffect(() => {
    const booted = sessionStorage.getItem('__architect_booted');
    if (!booted) {
      const timer = window.setTimeout(() => setShowBoot(true), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem('__architect_booted', '1');
    setShowBoot(false);
  };

  if (!showBoot) return null;

  return <BootSequence onComplete={handleComplete} />;
}
