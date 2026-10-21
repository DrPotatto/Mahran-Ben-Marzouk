'use client';

import { useI18n } from '../AppProvider';

// First focusable element: lets keyboard users jump past the navigation.
export default function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="fixed start-4 top-3 z-[100] -translate-y-24 bg-gold px-4 py-3 text-sm font-semibold text-ink transition-transform focus:translate-y-0"
    >
      {t('a11y.skip')}
    </a>
  );
}
