"use client";

import { useLocale } from '@/contexts/locale-context';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'zh' : 'en');
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleLocale} aria-label="Switch language">
      <Languages className="h-5 w-5" />
      <span className="sr-only">
        Switch to {locale === 'en' ? 'Chinese' : 'English'}
      </span>
    </Button>
  );
}
