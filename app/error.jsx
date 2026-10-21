'use client';

import { useEffect } from 'react';
import Button from '../components/ui/Button';
import { useI18n } from '../components/AppProvider';

// Route-level error boundary (Next.js App Router).
export default function ErrorPage({ error, reset }) {
  const { t } = useI18n();

  useEffect(() => {
    console.error('[7DCONSTRUCTION] route error:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-6 text-center">
      <p className="eyebrow">ERR</p>
      <h1 className="font-display text-4xl text-ivory sm:text-5xl">{t('errors.title')}</h1>
      <p className="max-w-md text-steel">{t('errors.text')}</p>
      <Button onClick={() => reset()}>{t('errors.retry')}</Button>
    </main>
  );
}
