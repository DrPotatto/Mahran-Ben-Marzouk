'use client';

import { Ruler, Mountain, ShieldCheck, MessagesSquare } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import VerifyBadge from '../ui/VerifyBadge';
import { useI18n } from '../AppProvider';

const ITEMS = [
  { id: 'precision', icon: Ruler },
  { id: 'materials', icon: Mountain },
  { id: 'safety', icon: ShieldCheck },
  { id: 'communication', icon: MessagesSquare },
];

// Quality principles = commitments of method, never numbers, awards or certifications.
export default function Quality() {
  const { t } = useI18n();
  return (
    <section id="quality" aria-labelledby="quality-title" className="section-pad border-t border-ivory/10 bg-graphite">
      <div className="content-wrap">
        <SectionHeading id="quality-title" eyebrow={t('quality.eyebrow')} title={t('quality.title')} intro={t('quality.intro')} />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ id, icon: Icon }, i) => (
            <li key={id}>
              <Reveal delay={i * 0.08} className="h-full border-t border-gold/60 pt-6">
                <Icon size={24} strokeWidth={1.25} aria-hidden="true" className="text-gold" />
                <h3 className="mt-5 font-display text-2xl text-ivory">{t(`quality.items.${id}.title`)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-steel">{t(`quality.items.${id}.text`)}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mt-12 flex flex-wrap items-center gap-3 text-xs text-steel">
          <VerifyBadge labelKey="process.verifyBadge" />
          {t('quality.note')}
        </p>
      </div>
    </section>
  );
}
