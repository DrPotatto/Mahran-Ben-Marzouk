'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Button from '../ui/Button';
import BlueprintThumb from '../ui/BlueprintThumb';
import { useDeviceCaps, useInView, useReducedMotionPref } from '../../lib/hooks';
import { formatCoordinate, formatNumber } from '../../lib/formatters';
import { SITE } from '../../data/site';
import { useI18n } from '../AppProvider';

const HeroScene = dynamic(() => import('../three/HeroScene'), { ssr: false });

const TAGS = ['structure', 'materials', 'architecture', 'finishing'];

function Rise({ children, delay = 0, reduced, as = 'div', className = '' }) {
  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

export default function Hero() {
  const { t, lang } = useI18n();
  const caps = useDeviceCaps();
  const reduced = useReducedMotionPref();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);
  const scrollRef = useRef(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      scrollRef.current = Math.min(Math.max(window.scrollY / (el.offsetHeight * 0.9), 0), 1);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const wants3d = Boolean(caps && caps.webgl && !caps.saveData);
  const show3d = wants3d && !failed;
  const quality = caps?.quality ?? 'high';

  const labels = useMemo(
    () => ({
      structure: t('hero.annotations.structure'),
      materials: t('hero.annotations.materials'),
      architecture: t('hero.annotations.architecture'),
      finishing: t('hero.annotations.finishing'),
    }),
    [t]
  );

  const dimensions = useMemo(
    () => ({
      width: `${formatNumber(17, lang, { minimumFractionDigits: 2 })} m`,
      height: `${formatNumber(6.65, lang, { minimumFractionDigits: 2 })} m`,
    }),
    [lang]
  );

  return (
    <section id="hero" ref={sectionRef} aria-labelledby="hero-title" className="relative min-h-[100svh] overflow-hidden bg-ink">
      <div className="absolute inset-0" role="img" aria-label={t('hero.sceneLabel')}>
        {/* 🔥 The Canvas is rendered ONLY if wants3d is true, and it NEVER unmounts once mounted. */}
        {wants3d && (
          <div
            className={
              show3d
                ? 'absolute inset-0'
                : 'pointer-events-none invisible absolute inset-0' // Hides the canvas gracefully instead of unmounting
            }
          >
            <HeroScene
              quality={quality}
              paused={!inView || !show3d}
              reducedMotion={reduced}
              scrollRef={scrollRef}
              labels={labels}
              dimensions={dimensions}
              onFail={() => setFailed(true)}
            />
          </div>
        )}

        {!show3d && (
          <div className="blueprint-grid relative h-full w-full">
            {caps ? (
              <div className="absolute inset-0 flex items-center justify-end text-steel/40 sm:pe-[6%]">
                <BlueprintThumb model="villa" className="w-full max-w-4xl" />
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/40" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/35 to-transparent rtl:bg-gradient-to-l" />

      {!reduced ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-ink"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.8, delay: 0.25, ease: 'easeOut' }}
        />
      ) : null}

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-content flex-col justify-end px-5 pb-14 pt-32 sm:px-8 lg:px-12">
        <Rise reduced={reduced} delay={0.9} className="max-w-3xl">
          <h1 id="hero-title">
            <span className="block font-mono text-[0.78rem] uppercase tracking-[0.42em] text-gold sm:text-sm">{t('hero.company1')}</span>
            <span className="mt-3 block font-display text-[2.6rem] leading-[0.95] text-ivory sm:text-7xl lg:text-[6.5rem]">{t('hero.company2')}</span>
          </h1>
        </Rise>

        <Rise reduced={reduced} delay={1.15} className="mt-8 max-w-2xl">
          <p className="font-display text-2xl leading-snug text-ivory sm:text-3xl">{t('hero.headline')}</p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-steel sm:text-lg">{t('hero.copy')}</p>
        </Rise>

        <Rise reduced={reduced} delay={1.4} className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="#projects" size="lg">
            {t('hero.ctaPrimary')}
          </Button>
          <Button href="#estimator" variant="secondary" size="lg">
            {t('hero.ctaSecondary')}
          </Button>
        </Rise>

        <Rise reduced={reduced} delay={1.7} className="mt-12 flex flex-col gap-4 border-t border-ivory/15 pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="font-mono text-[0.68rem] uppercase tracking-technical text-steel">
            <p className="text-ivory">{t('hero.location')}</p>
            <p className="mt-1" dir="ltr">
              {formatCoordinate(SITE.coordinates.lat, 'N', 'S')} {formatCoordinate(SITE.coordinates.lon, 'E', 'W')}
            </p>
          </div>
          <div className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-steel sm:text-end">
            <p className="text-gold">{t('hero.cam')}</p>
            <p className="mt-1 max-w-xs normal-case tracking-normal sm:ms-auto">{t('hero.concept')}</p>
          </div>
        </Rise>

        {caps && !show3d ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {TAGS.map((k) => (
              <li key={k} className="border border-gold/40 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-technical text-gold">
                {t(`hero.annotations.${k}`)}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <a
        href="#about"
        aria-label={t('hero.scroll')}
        className="absolute bottom-5 end-5 z-10 hidden h-11 w-11 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:border-gold hover:text-gold lg:flex"
      >
        <ArrowDown size={18} aria-hidden="true" />
      </a>
    </section>
  );
}