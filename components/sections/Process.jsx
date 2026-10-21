'use client';

import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import VerifyBadge from '../ui/VerifyBadge';
import { useI18n } from '../AppProvider';

const STEPS = ['listen', 'visit', 'quote', 'plan', 'build', 'handover'];

// Construction process. The sequence is a proposal to be confirmed by the owner (badge shown).
export default function Process() {
  const { t } = useI18n();
  return (
    <section id="process" aria-labelledby="process-title" className="section-pad border-t border-ivory/10 bg-ink">
      <div className="content-wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="process-title" eyebrow={t('process.eyebrow')} title={t('process.title')} intro={t('process.intro')} />
          <VerifyBadge labelKey="process.verifyBadge" />
        </div>

        <ol className="relative mt-16 grid gap-px border border-ivory/10 bg-ivory/10 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((id, i) => (
            <li key={id} className="bg-ink">
              <Reveal delay={(i % 3) * 0.08} className="h-full p-8">
                <span className="font-display text-6xl leading-none text-gold/80" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 font-display text-2xl text-ivory">{t(`process.steps.${id}.title`)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-steel">{t(`process.steps.${id}.text`)}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
