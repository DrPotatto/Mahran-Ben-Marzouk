'use client';

import { SITE } from '@/data/site';
import { useI18n } from '@/components/AppProvider';

// Marks owner-unverified content. Hidden once `verified` is true or badges are disabled in data/site.js.
export default function VerifyBadge({ verified = false, labelKey = 'services.verifyBadge', className = '' }) {
  const { t } = useI18n();
  if (verified || !SITE.showVerificationBadges) return null;
  return (
    <span
      className={`inline-flex items-center border border-amber/50 px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-amber ${className}`}
    >
      {t(labelKey)}
    </span>
  );
}
