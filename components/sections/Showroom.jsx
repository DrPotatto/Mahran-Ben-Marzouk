'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import SectionHeading from '../ui/SectionHeading';
import LoadingIndicator from '../ui/LoadingIndicator';
import ErrorBoundary from '../ui/ErrorBoundary';
import WebGLFallback from '../three/WebGLFallback';
import { useInView } from '../../lib/hooks';
import { useI18n } from '../AppProvider';

function ViewerLoading() {
  const { t } = useI18n();
  return (
    <div className="flex aspect-[16/10] items-center justify-center border border-ivory/10 bg-ink">
      <LoadingIndicator label={t('viewer.loading')} />
    </div>
  );
}

// Three.js + React Three Fiber are only downloaded when the section nears the viewport.
const ThreeViewer = dynamic(() => import('../three/ThreeViewer'), { ssr: false, loading: () => <ViewerLoading /> });

export default function Showroom() {
  const { t } = useI18n();
  const hostRef = useRef(null);
  const near = useInView(hostRef, { rootMargin: '500px 0px', once: true });

  return (
    <section id="showroom" aria-labelledby="showroom-title" className="section-pad border-t border-ivory/10 bg-graphite">
      <div className="content-wrap">
        <SectionHeading id="showroom-title" eyebrow={t('showroom.eyebrow')} title={t('showroom.title')} intro={t('showroom.intro')} />
        <div ref={hostRef} className="mt-14 min-h-[300px]">
          {near ? (
            <ErrorBoundary
              fallback={({ reset }) => (
                <div className="border border-ivory/10 bg-ink">
                  <WebGLFallback title={t('viewer.errorTitle')} text={t('viewer.errorText')} onRetry={reset} />
                </div>
              )}
            >
              <ThreeViewer />
            </ErrorBoundary>
          ) : (
            <ViewerLoading />
          )}
        </div>
      </div>
    </section>
  );
}
