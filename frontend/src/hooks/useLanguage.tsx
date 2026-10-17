/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Language & Regional Context & Hook
   Provides real-time localization, translation helper t(),
   fallback guarantees, and localStorage persistence.
   ────────────────────────────────────────────────────────────────── */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  type SupportedLanguage,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  formatLocalizedDate,
  formatLocalizedNumber,
} from '@/lib/i18n';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  formatDate: (date: Date | string | number) => string;
  formatNumber: (value: number) => string;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'mahagrid_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'mr')) {
      return saved;
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute('lang', lang);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  /** Translation lookup with strict fallback: Selected Language -> English -> Provided fallback -> Key */
  const t = useCallback(
    (key: string, fallback?: string): string => {
      const activeDict = TRANSLATIONS[language] || {};
      if (activeDict[key] !== undefined) {
        return activeDict[key];
      }
      const enDict = TRANSLATIONS.en || {};
      if (enDict[key] !== undefined) {
        return enDict[key];
      }
      return fallback !== undefined ? fallback : key;
    },
    [language],
  );

  const formatDate = useCallback(
    (date: Date | string | number) => formatLocalizedDate(date, language),
    [language],
  );

  const formatNumber = useCallback(
    (value: number) => formatLocalizedNumber(value, language),
    [language],
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatDate,
        formatNumber,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
