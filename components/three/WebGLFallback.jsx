'use client';

import BlueprintThumb from '../ui/BlueprintThumb';
import { useI18n } from '../AppProvider';

// Shown when WebGL is unavailable or the 3D viewer crashed. It still communicates the four
// pillars of the company (structure, materials, architecture, finishing) as a labelled drawing.
export default function WebGLFallback({ model = 'villa', title, text, onRetry, retryLabel, className = '' }) {
  const { t } = useI18n();
  const tags = ['structure', 'materials', 'architecture', 'finishing'];

  return (
    <div role="group" aria-label={title || t('viewer.fallbackTitle')} className={`blueprint-grid flex flex-col items-center justify-center gap-6 p-6 text-center sm:p-10 ${className}`}>
      <div className="relative w-full max-w-xl text-steel">
        <BlueprintThumb model={model} className="h-auto w-full" />
        <span className="absolute bottom-1 end-1 font-mono text-[0.6rem] uppercase tracking-technical text-steel/70">
          {t('viewer.fallbackLegend')}
        </span>
      </div>
      <ul className="flex flex-wrap items-center justify-center gap-2" aria-label={t('hero.annotations.structure')}>
        {tags.map((k) => (
          <li key={k} className="border border-gold/40 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-technical text-gold">
            {t(`hero.annotations.${k}`)}
          </li>
        ))}
      </ul>
      <div className="max-w-md">
        <p className="font-display text-xl text-ivory">{title || t('viewer.fallbackTitle')}</p>
        <p className="mt-2 text-sm leading-relaxed text-steel">{text || t('viewer.fallbackText')}</p>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="min-h-[44px] border border-ivory/30 px-5 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:border-gold hover:text-gold"
        >
          {retryLabel || t('viewer.retry')}
        </button>
      ) : null}
    </div>
  );
}
