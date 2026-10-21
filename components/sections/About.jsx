'use client';

import { Gem, Layers, PenTool, Hammer } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import { SITE } from '../../data/site';
import { useI18n } from '../AppProvider';

const PILLARS = [
  { id: 'structure', icon: Layers },
  { id: 'materials', icon: Gem },
  { id: 'architecture', icon: PenTool },
  { id: 'finishing', icon: Hammer },
];

// Company introduction. Only facts supplied by the owner are stated (name, owner, city, trades).
export default function About() {
  const { t } = useI18n();
  return (
    <section id="about" aria-labelledby="about-title" className="section-pad border-t border-ivory/10 bg-ink">
      <div className="content-wrap">
        <div className="grid gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          <div>
            <SectionHeading id="about-title" eyebrow={t('about.eyebrow')} title={t('about.title')} />
            <Reveal delay={0.1} className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-steel sm:text-lg">
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="self-start">
            <figure className="relative border border-ivory/10 bg-graphite p-8">
              <span aria-hidden="true" className="absolute start-0 top-0 h-10 w-px bg-gold" />
              <span aria-hidden="true" className="absolute start-0 top-0 h-px w-10 bg-gold" />
              <p className="font-mono text-[0.68rem] uppercase tracking-technical text-gold">{SITE.shortName}</p>
              <p className="mt-6 font-display text-3xl leading-tight text-ivory">{SITE.owner}</p>
              <p className="mt-2 text-steel">{t('about.ownerRole')}</p>
              <p className="mt-8 border-t border-ivory/10 pt-5 font-mono text-[0.7rem] uppercase tracking-technical text-steel">
                {t('about.location')}
              </p>
            </figure>
          </Reveal>
        </div>

        <div className="mt-20">
          <Reveal>
            <h3 className="font-mono text-[0.72rem] uppercase tracking-technical text-steel">{t('about.pillarsTitle')}</h3>
          </Reveal>
          <ul className="mt-6 grid gap-px border border-ivory/10 bg-ivory/10 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ id, icon: Icon }, i) => (
              <li key={id} className="bg-ink">
                <Reveal delay={i * 0.08} className="h-full p-7">
                  <Icon size={22} strokeWidth={1.25} aria-hidden="true" className="text-gold" />
                  <h4 className="mt-5 font-display text-2xl text-ivory">{t(`about.pillars.${id}.title`)}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-steel">{t(`about.pillars.${id}.text`)}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
