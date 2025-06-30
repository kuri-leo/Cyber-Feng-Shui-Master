"use client";

import React, { ReactNode } from 'react';
import { LocaleProvider } from '@/contexts/locale-context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      {children}
    </LocaleProvider>
  );
}
