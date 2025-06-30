"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { translations, Locale } from '@/lib/i18n';

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof typeof translations.en) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    try {
      const browserLang = navigator.language.split('-')[0] as Locale;
      if (translations[browserLang]) {
        setLocale(browserLang);
      }
    } catch (e) {
      // In case navigator is not available (e.g. SSR)
      console.warn("Could not detect browser language.");
    }
  }, []);

  const t = (key: keyof typeof translations.en) => {
    return translations[locale][key] || translations.en[key];
  };
  
  const value = { locale, setLocale, t };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
