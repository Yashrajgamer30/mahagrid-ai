/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – useReducedMotion hook
   Respects OS media query AND user preference saved in localStorage.
   ────────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';
const STORAGE_KEY = 'mahagrid_reduced_motion';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      return stored === 'true';
    }
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const handler = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === null) {
        setReduced(e.matches);
      }
    };
    mq.addEventListener('change', handler);

    // Also listen to storage changes from Settings
    const storageHandler = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setReduced(stored === 'true');
      }
    };
    window.addEventListener('storage', storageHandler);

    return () => {
      mq.removeEventListener('change', handler);
      window.removeEventListener('storage', storageHandler);
    };
  }, []);

  return reduced;
}
