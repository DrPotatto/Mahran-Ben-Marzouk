'use client';

import { AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDate, formatNumber, formatPercent } from '../../lib/formatters';
import { parseLocaleNumber } from '../../lib/validation';
import { useI18n } from '../AppProvider';

// Transparent breakdown of the preliminary estimate (or, when numbers are disabled,
// only the entered scope). Every selected option appears as its own line.
export default function QuoteSummary({ input, estimate }) {
  const { t, lang } = useI18n();
  const money = (n) => formatCurrency(n, lang);
  const disabled = estimate === null;
  const area = parseLocaleNumber(input.area);
  const floors = parseLocaleNumber(input.floors);
  const categoryLabel = t(`estimator.categories.${input.category}`);
  const demo = estimate?.assumptions?.mode === 'demo';

  return (
    <div className="space-y-8">
      {disabled ? (
        <div role="note" className="border border-amber/50 bg-amber/10 p-5">
          <p className="flex items-center gap-2 font-semibold text-ivory">
            <AlertTriangle size={18} aria-hidden="true" className="text-amber" />
            {t('summary.disabledTitle')}
          </p>
          <p className="mt-2 text-sm text-steel">{t('summary.disabledNotice')}</p>
        </div>
      ) : demo ? (
        <p role="note" className="flex gap-3 border border-amber/50 bg-amber/10 p-4 text-sm text-amber">
          <AlertTriangle size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
          {t('summary.demoNotice')}
        </p>
      ) : null}

      {/* Dimensions + scope */}
      <div className="grid gap-8 md:grid-cols-2">
        <section aria-labelledby="sum-dim">
          <h4 id="sum-dim" className="font-mono text-[0.7rem] uppercase tracking-technical text-gold">
            {t('summary.dimensionsTitle')}
          </h4>
          <dl className="mt-3 divide-y divide-ivory/10 border-y border-ivory/10 text-sm">
            <Row label={t('estimator.steps.category')} value={categoryLabel} />
            <Row label={t('summary.area')} value={`${formatNumber(area, lang)} m²`} />
            <Row label={t('summary.floors')} value={formatNumber(floors, lang)} />
            <Row label={t('summary.location')} value={input.location} />
            {input.startDate ? <Row label={t('summary.startDate')} value={formatDate(input.startDate, lang)} /> : null}
          </dl>
        </section>

        <section aria-labelledby="sum-scope">
          <h4 id="sum-scope" className="font-mono text-[0.7rem] uppercase tracking-technical text-gold">
            {t('summary.scopeTitle')}
          </h4>
          {input.scopes.length ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {input.scopes.map((id) => (
                <li key={id} className="border border-ivory/20 px-3 py-1.5 text-sm text-ivory">
                  {t(`estimator.scope.${id}`)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-steel">{t('summary.noScope')}</p>
          )}
          {input.extras.length ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {input.extras.map((id) => (
                <li key={id} className="border border-ivory/10 px-3 py-1.5 text-sm text-steel">
                  {t(`estimator.extras.${id}`)}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>

      {/* Numbers */}
      {estimate && estimate.ok ? (
        <>
          <section aria-labelledby="sum-rates">
            <h4 id="sum-rates" className="font-mono text-[0.7rem] uppercase tracking-technical text-gold">
              {t('summary.ratesTitle')}
            </h4>
            <ul className="mt-3 divide-y divide-ivory/10 border-y border-ivory/10 text-sm">
              {estimate.lines.map((line) => (
                <li key={line.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <span className="text-ivory">
                    {line.kind === 'base' ? t('summary.base', { category: categoryLabel }) : t(`estimator.scope.${line.id}`)}
                    <span className="mt-0.5 block text-xs text-steel">
                      {formatNumber(line.quantity, lang)} m² × {t('summary.perM2', { rate: money(line.rate) })}{' '}
                      {line.multiplier !== 1 ? t('summary.multiplier', { value: formatNumber(line.multiplier, lang, { maximumFractionDigits: 3 }) }) : ''}
                    </span>
                  </span>
                  <span className="font-mono text-ivory sm:text-end" dir="ltr">
                    {money(line.amount)}
                  </span>
                </li>
              ))}
              <li className="flex items-baseline justify-between gap-6 py-3 font-semibold text-ivory">
                <span>{t('summary.subtotal')}</span>
                <span className="font-mono" dir="ltr">{money(estimate.subtotal)}</span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="sum-extras">
            <h4 id="sum-extras" className="font-mono text-[0.7rem] uppercase tracking-technical text-gold">
              {t('summary.extrasTitle')}
            </h4>
            {estimate.extraLines.length ? (
              <ul className="mt-3 divide-y divide-ivory/10 border-y border-ivory/10 text-sm">
                {estimate.extraLines.map((line) => (
                  <li key={line.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <span className="text-ivory">
                      {t(`estimator.extras.${line.id}`)}
                      {line.type === 'percent' ? <span className="mt-0.5 block text-xs text-steel">{t('summary.percentOf', { value: formatPercent(line.rate, lang) })}</span> : null}
                    </span>
                    <span className="font-mono text-ivory" dir="ltr">{money(line.amount)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-steel">{t('summary.noExtras')}</p>
            )}
            <p className="mt-3 flex items-baseline justify-between gap-6 text-sm text-steel">
              <span>{t('summary.contingency', { rate: formatPercent(estimate.assumptions.contingencyRate, lang) })}</span>
              <span className="font-mono" dir="ltr">{money(estimate.contingency)}</span>
            </p>
          </section>

          <section aria-labelledby="sum-total" className="border border-gold/50 bg-gold/5 p-6">
            <h4 id="sum-total" className="font-mono text-[0.7rem] uppercase tracking-technical text-gold">
              {t('summary.total')}
            </h4>
            <p className="mt-2 font-display text-4xl text-ivory sm:text-5xl" dir="ltr">
              {money(estimate.total)}
            </p>
            <p className="mt-5 text-sm text-ivory">
              {t('summary.range')} :{' '}
              <span className="font-mono" dir="ltr">
                {money(estimate.range.low)} – {money(estimate.range.high)}
              </span>
            </p>
            <p className="mt-1 text-xs text-steel">
              {t('summary.rangeNote', {
                lower: formatPercent(estimate.assumptions.lowerPct, lang),
                upper: formatPercent(estimate.assumptions.upperPct, lang),
              })}
            </p>
          </section>
        </>
      ) : null}

      {/* Exclusions + disclaimer (always shown) */}
      <section aria-labelledby="sum-excl">
        <h4 id="sum-excl" className="font-mono text-[0.7rem] uppercase tracking-technical text-gold">
          {t('summary.exclusionsTitle')}
        </h4>
        <ul className="mt-3 list-disc space-y-1 ps-5 text-sm text-steel">
          {t('summary.exclusions').map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <p className="border-s-2 border-gold/60 ps-4 text-sm leading-relaxed text-steel">{t('summary.disclaimer')}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-2.5">
      <dt className="text-steel">{label}</dt>
      <dd className="text-end text-ivory">{value}</dd>
    </div>
  );
}
