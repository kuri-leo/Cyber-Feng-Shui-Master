"use client";

import { useState } from 'react';
import type { AssessAuspiciousnessOutput } from '@/ai/schemas';
import { LanguageSwitcher } from '@/components/language-switcher';
import { SettingsDialog } from '@/components/settings-dialog';
import { useLocale } from '@/contexts/locale-context';
import { AuspiciousnessForm } from '@/components/auspiciousness-form';
import { AuspiciousnessResult } from '@/components/auspiciousness-result';
import { SunMoon } from 'lucide-react';

export default function Home() {
  const [result, setResult] = useState<AssessAuspiciousnessOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { t } = useLocale();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <SunMoon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-primary">{t('title')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <SettingsDialog />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <section className="text-center">
            <p className="mt-2 text-lg text-muted-foreground">{t('subtitle')}</p>
          </section>

          <AuspiciousnessForm
            setResult={setResult}
            setIsLoading={setIsLoading}
            setError={setError}
            isFormSubmitting={isLoading}
          />
          
          <AuspiciousnessResult
            result={result}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>

      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            Built with ❤️ and a touch of cosmic wisdom.
          </p>
        </div>
      </footer>
    </div>
  );
}
