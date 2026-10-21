'use client';

import Button from '../components/ui/Button';
import { useI18n } from '../components/AppProvider';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 className="font-display text-4xl text-ivory sm:text-5xl">{t('errors.notFoundTitle')}</h1>
      <p className="max-w-md text-steel">{t('errors.notFoundText')}</p>
      <Button href="/">{t('errors.home')}</Button>
    </main>
  );
}
