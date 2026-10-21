'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { X, Box } from 'lucide-react';
import Button from '../ui/Button';
import BeforeAfter from '../ui/BeforeAfter';
import BlueprintThumb from '../ui/BlueprintThumb';
import LoadingIndicator from '../ui/LoadingIndicator';
import ErrorBoundary from '../ui/ErrorBoundary';
import WebGLFallback from '../three/WebGLFallback';
import { projectText, pickText } from '../../lib/content';
import { useI18n } from '../AppProvider';

const ThreeViewer = dynamic(() => import('../three/ThreeViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[16/10] items-center justify-center bg-ink">
      <LoadingIndicator label="…" />
    </div>
  ),
});

const STAGE_STYLE = {
  done: 'border-gold bg-gold text-ink',
  inProgress: 'border-amber text-amber',
  planned: 'border-ivory/25 text-steel',
  illustrative: 'border-ivory/25 text-steel',
};

// Immersive, accessible dialog: Esc closes, focus is moved in and restored, page scroll is locked.
export default function ProjectDetail({ project, onClose, onInquire }) {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const closeRef = useRef(null);
  const [show3d, setShow3d] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [brokenImages, setBrokenImages] = useState({});

  useEffect(() => {
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      if (opener && typeof opener.focus === 'function') opener.focus();
    };
  }, [onClose]);

  const title = projectText(project, 'title', lang, t);
  const location = projectText(project, 'location', lang, t);
  const description = projectText(project, 'description', lang, t);
  const images = (project.images || []).filter((img) => !brokenImages[img.src]);
  const hasImages = images.length > 0;
  const current = hasImages ? images[Math.min(imageIndex, images.length - 1)] : null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-detail-title"
      className="fixed inset-0 z-[80] overflow-y-auto bg-ink/95 backdrop-blur-sm"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mx-auto max-w-content px-5 pb-20 pt-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.7rem] uppercase tracking-technical text-gold">{t('projects.gallery')}</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t('projects.closeDetail')}
            className="flex h-11 w-11 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:border-gold hover:text-gold"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <motion.div
          className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr]"
          initial={reduce ? false : { y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Visual column */}
          <div>
            {show3d ? (
              <ErrorBoundary
                fallback={({ reset }) => (
                  <div className="border border-ivory/10 bg-ink">
                    <WebGLFallback model={project.model || 'villa'} title={t('viewer.errorTitle')} text={t('viewer.errorText')} onRetry={reset} />
                  </div>
                )}
              >
                <ThreeViewer initialModel={project.model || 'villa'} fixedModel compact />
              </ErrorBoundary>
            ) : (
              <div className="relative aspect-[16/10] overflow-hidden border border-ivory/10 bg-graphite">
                {current ? (
                  <Image
                    src={current.src}
                    alt={pickText(current.alt, lang) || title}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                    priority
                    onError={() => setBrokenImages((prev) => ({ ...prev, [current.src]: true }))}
                  />
                ) : (
                  <div className="blueprint-grid flex h-full items-center justify-center text-gold/70">
                    <BlueprintThumb model={project.model || 'villa'} className="h-full w-full p-8" />
                  </div>
                )}
              </div>
            )}

            {hasImages && !show3d && images.length > 1 ? (
              <ul className="mt-3 grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <li key={img.src}>
                    <button
                      type="button"
                      onClick={() => setImageIndex(i)}
                      aria-label={`${t('projects.gallery')} ${i + 1}`}
                      aria-current={i === imageIndex ? 'true' : undefined}
                      className={`relative block aspect-[4/3] w-full overflow-hidden border ${i === imageIndex ? 'border-gold' : 'border-ivory/10'}`}
                    >
                      <Image src={img.src} alt="" fill sizes="120px" className="object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            {!hasImages ? <p className="mt-3 text-sm text-steel">{t('projects.noImages')}</p> : null}

            {project.model ? (
              <button
                type="button"
                aria-pressed={show3d}
                onClick={() => setShow3d((v) => !v)}
                className="mt-4 inline-flex min-h-[44px] items-center gap-2.5 border border-ivory/20 px-4 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                <Box size={16} aria-hidden="true" />
                {show3d ? t('projects.hide3d') : t('projects.show3d')}
              </button>
            ) : null}

            {project.beforeAfter ? (
              <div className="mt-10">
                <h3 className="mb-4 font-mono text-[0.72rem] uppercase tracking-technical text-gold">{t('projects.beforeAfter')}</h3>
                <BeforeAfter
                  before={project.beforeAfter.before}
                  after={project.beforeAfter.after}
                  labels={{ before: t('projects.before'), after: t('projects.after'), slider: t('projects.slider') }}
                />
              </div>
            ) : null}
          </div>

          {/* Metadata column */}
          <div>
            {project.conceptual ? (
              <p className="inline-block border border-amber/60 px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-amber">
                {t('projects.conceptBadge')}
              </p>
            ) : null}
            <h2 id="project-detail-title" className="mt-4 font-display text-4xl leading-tight text-ivory sm:text-5xl">
              {title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">{description}</p>
            {project.conceptual ? <p className="mt-4 border-s border-amber/60 ps-4 text-sm text-amber/90">{t('projects.conceptNote')}</p> : null}

            <dl className="mt-8 divide-y divide-ivory/10 border-y border-ivory/10 text-sm">
              <Row label={t('projects.category')} value={project.categories.map((c) => t(`projects.filters.${c}`)).join(' · ')} />
              <Row label={t('projects.location')} value={location} />
              <Row label={t('projects.statusLabel')} value={t(`projects.status.${project.status}`)} />
            </dl>

            {project.stages?.length ? (
              <div className="mt-8">
                <h3 className="font-mono text-[0.72rem] uppercase tracking-technical text-gold">{t('projects.stagesLabel')}</h3>
                <ol className="mt-4 space-y-2">
                  {project.stages.map((stage, i) => (
                    <li key={stage.key} className="flex items-center gap-3">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center border font-mono text-[0.68rem] ${STAGE_STYLE[stage.status] || STAGE_STYLE.planned}`}>
                        {i + 1}
                      </span>
                      <span className="text-ivory">{t(`projects.stages.${stage.key}`)}</span>
                      <span className="ms-auto font-mono text-[0.64rem] uppercase tracking-[0.14em] text-steel">{t(`projects.stageStatus.${stage.status}`)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            <Button href="#contact" size="lg" className="mt-10 w-full sm:w-auto" onClick={() => onInquire(title)}>
              {t('projects.inquire')}
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3">
      <dt className="text-steel">{label}</dt>
      <dd className="text-end text-ivory">{value}</dd>
    </div>
  );
}
