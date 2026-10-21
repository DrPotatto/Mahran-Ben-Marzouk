'use client';

import SectionHeading from '../ui/SectionHeading';
import QuoteEstimator from '../estimator/QuoteEstimator';
import { useI18n } from '../AppProvider';

export default function Estimator() {
  const { t } = useI18n();
  return (
    <section id="estimator" aria-labelledby="estimator-title" className="section-pad border-t border-ivory/10 bg-ink">
      <div className="content-wrap">
        <SectionHeading id="estimator-title" eyebrow={t('estimator.eyebrow')} title={t('estimator.title')} intro={t('estimator.intro')} />
        <div className="mt-14">
          <QuoteEstimator />
        </div>
      </div>
    </section>
  );
}
