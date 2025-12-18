'use client';

import { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '@/language/i18n';
import { I18nProviderProps } from '@/types/i18Type';

export default function I18nProvider({ children }: I18nProviderProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    </I18nextProvider>
  );
}