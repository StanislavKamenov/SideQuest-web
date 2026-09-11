import { useState, useEffect, useCallback } from 'react';

/**
 * Returns a normalized 0-1 scroll progress for the document.
 * Also provides the raw scrollY value.
 * Throttled via requestAnimationFrame for smooth performance.
 */
export default function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(y / max, 1) : 0;
    setScrollY(y);
    setProgress(p);
  }, []);

  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll(); // Initial value
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);

  return { progress, scrollY };
}
