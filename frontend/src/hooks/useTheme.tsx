/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Global Theme & Preferences Provider
   Supports Cinematic Grid (default), Light Utility, and High Contrast.
   Controls density, reduced motion, sidebar state, and instant DOM updates.
   ────────────────────────────────────────────────────────────────── */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AppTheme = 'cinematic' | 'light' | 'high-contrast';
export type AppDensity = 'comfortable' | 'compact';

export interface ThemeOption {
  id: AppTheme;
  title: string;
  subtitle: string;
  accent: string;
  bgPreview: string;
  cardPreview: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'cinematic',
    title: 'Cinematic Grid',
    subtitle: 'Deep midnight charcoal, luminous teal pulses, and selective glass panels matching the reference.',
    accent: '#2dd4bf',
    bgPreview: '#090e0c',
    cardPreview: 'rgba(16, 26, 21, 0.9)',
  },
  {
    id: 'light',
    title: 'Light Utility',
    subtitle: 'Classic ivory, forest green, and high contrast for daytime field utility operations.',
    accent: '#245746',
    bgPreview: '#F6F1E7',
    cardPreview: '#FFFFFF',
  },
  {
    id: 'high-contrast',
    title: 'High Contrast',
    subtitle: 'Pure dark black with vivid neon markers and solid high-contrast borders for accessibility.',
    accent: '#4ade80',
    bgPreview: '#000000',
    cardPreview: '#0f0f0f',
  },
];

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  density: AppDensity;
  setDensity: (density: AppDensity) => void;
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;
  restrainedAnimations: boolean;
  setRestrainedAnimations: (restrained: boolean) => void;
  resetToDefaults: () => void;
  themeOptions: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'mahagrid_theme';
const DENSITY_KEY = 'mahagrid_density';
const MOTION_KEY = 'mahagrid_reduced_motion';
const RESTRAINED_KEY = 'mahagrid_restrained_anim';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 1. Theme State (default: 'cinematic')
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem(THEME_KEY) as AppTheme | null;
    if (saved && (saved === 'cinematic' || saved === 'light' || saved === 'high-contrast')) {
      return saved;
    }
    return 'cinematic';
  });

  // 2. Density State (default: 'comfortable')
  const [density, setDensityState] = useState<AppDensity>(() => {
    const saved = localStorage.getItem(DENSITY_KEY) as AppDensity | null;
    if (saved && (saved === 'comfortable' || saved === 'compact')) {
      return saved;
    }
    return 'comfortable';
  });

  // 3. Reduced Motion
  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    const saved = localStorage.getItem(MOTION_KEY);
    if (saved !== null) return saved === 'true';
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // 4. Restrained Animations
  const [restrainedAnimations, setRestrainedAnimationsState] = useState<boolean>(() => {
    const saved = localStorage.getItem(RESTRAINED_KEY);
    return saved !== null ? saved === 'true' : true;
  });

  // Apply to Document Element Immediately
  const applyThemeToDOM = useCallback((t: AppTheme, d: AppDensity, rm: boolean, ra: boolean) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', t);
    root.setAttribute('data-density', d);
    root.setAttribute('data-reduced-motion', rm ? 'true' : 'false');
    root.setAttribute('data-restrained-anim', ra ? 'true' : 'false');
  }, []);

  useEffect(() => {
    applyThemeToDOM(theme, density, reducedMotion, restrainedAnimations);
  }, [theme, density, reducedMotion, restrainedAnimations, applyThemeToDOM]);

  const setTheme = useCallback((newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  const setDensity = useCallback((newDensity: AppDensity) => {
    setDensityState(newDensity);
    localStorage.setItem(DENSITY_KEY, newDensity);
    document.documentElement.setAttribute('data-density', newDensity);
  }, []);

  const setReducedMotion = useCallback((reduced: boolean) => {
    setReducedMotionState(reduced);
    localStorage.setItem(MOTION_KEY, String(reduced));
    document.documentElement.setAttribute('data-reduced-motion', reduced ? 'true' : 'false');
  }, []);

  const setRestrainedAnimations = useCallback((restrained: boolean) => {
    setRestrainedAnimationsState(restrained);
    localStorage.setItem(RESTRAINED_KEY, String(restrained));
    document.documentElement.setAttribute('data-restrained-anim', restrained ? 'true' : 'false');
  }, []);

  const resetToDefaults = useCallback(() => {
    setTheme('cinematic');
    setDensity('comfortable');
    setReducedMotion(false);
    setRestrainedAnimations(true);
  }, [setTheme, setDensity, setReducedMotion, setRestrainedAnimations]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        density,
        setDensity,
        reducedMotion,
        setReducedMotion,
        restrainedAnimations,
        setRestrainedAnimations,
        resetToDefaults,
        themeOptions: THEME_OPTIONS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
