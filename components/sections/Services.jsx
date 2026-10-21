'use client';

import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import ServiceGlyph from '../ui/ServiceGlyph';
import VerifyBadge from '../ui/VerifyBadge';
import { SERVICES } from '../../data/services';
import { useI18n, useInquiry } from '../AppProvider';

export default function Services() {
  const { t } = useI18n();
  const { setTopic } = useInquiry();

  return (
    <section id="services" aria-labelledby="services-title" className="section-pad border-t border-ivory/10 bg-ink">
      <div className="content-wrap">
        <SectionHeading id="services-title" eyebrow={t('services.eyebrow')} title={t('services.title')} intro={t('services.intro')} />

        <ul className="mt-16 grid gap-px border border-ivory/10 bg-ivory/10 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((service, i) => {
            const title = t(`services.items.${service.id}.title`);
            return (
              <li key={service.id} className="bg-ink">
                <Reveal delay={(i % 4) * 0.07} className="group relative flex h-full flex-col p-7 transition-colors duration-500 ease-cinematic hover:bg-graphite">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono text-[0.68rem] tracking-technical text-steel/70">{String(i + 1).padStart(2, '0')}</span>
                    <VerifyBadge verified={service.verified} />
                  </div>
                  <ServiceGlyph accent={service.accent} className="mt-6 h-24 w-full text-steel transition-colors duration-500 group-hover:text-gold" />
                  <h3 className="mt-7 font-display text-2xl leading-tight text-ivory">{title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-steel">{t(`services.items.${service.id}.text`)}</p>
                  <a
                    href="#contact"
                    onClick={() => setTopic(title)}
                    className="mt-7 inline-flex min-h-[44px] items-center gap-2 self-start text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:text-gold"
                  >
                    {t('services.inquire')}
                    <ArrowRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
                  </a>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
