'use client';

import { AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDate, formatNumber, formatPercent } from '../../lib/formatters';
import { parseLocaleNumber } from '../../lib/validation';
import { useI18n } from '../AppProvider';

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
      </div>

      {/* DETAILED LINE-ITEM TABLE */}
      {estimate && estimate.ok ? (
        <>
          <section aria-labelledby="sum-detail">
            <h4 id="sum-detail" className="font-mono text-[0.7rem] uppercase tracking-technical text-gold">
              Détail ligne par ligne
            </h4>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-ivory/20 text-steel">
                  <tr>
                    <th className="py-2 pe-3">Désignation</th>
                    <th className="py-2 pe-3 text-end">Qté</th>
                    <th className="py-2 pe-3 text-end">Unité</th>
                    <th className="py-2 pe-3 text-end">Matériau</th>
                    <th className="py-2 pe-3 text-end">Main d’œuvre</th>
                    <th className="py-2 text-end">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory/10">
                  {estimate.lines.map((l) => (
                    <tr key={l.id}>
                      <td className="py-2 pe-3">
                        <span className="text-ivory">{l.label}</span>
                        {l.note && <span className="block text-[0.6rem] text-steel">{l.note}</span>}
                      </td>
                      <td className="py-2 pe-3 text-end font-mono text-ivory">{formatNumber(l.quantity, lang)}</td>
                      <td className="py-2 pe-3 text-end text-steel">{l.unit}</td>
                      <td className="py-2 pe-3 text-end font-mono text-steel">{money(l.material)}</td>
                      <td className="py-2 pe-3 text-end font-mono text-steel">{money(l.labour)}</td>
                      <td className="py-2 text-end font-mono text-ivory">{money(l.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* TRANSPARENT TOTALS */}
          <section aria-labelledby="sum-totals">
            <h4 id="sum-totals" className="font-mono text-[0.7rem] uppercase tracking-technical text-gold">
              Récapitulatif
            </h4>
            <dl className="mt-3 space-y-2 border-t border-ivory/20 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-steel">Sous-total matériaux + main d’œuvre</dt>
                <dd className="font-mono text-ivory">{money(estimate.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-steel">
                  Frais de chantier ({(estimate.assumptions.siteOverheadRate * 100).toFixed(0)} %)
                </dt>
                <dd className="font-mono text-ivory">{money(estimate.siteOverhead)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-steel">
                  Gestion & bénéfice entreprise ({(estimate.assumptions.profitRate * 100).toFixed(0)} %)
                </dt>
                <dd className="font-mono text-ivory">{money(estimate.profit)}</dd>
              </div>
              {estimate.extraLines.map((e) => (
                <div key={e.id} className="flex justify-between">
                  <dt className="text-steel">{e.label}</dt>
                  <dd className="font-mono text-ivory">{money(e.amount)}</dd>
                </div>
              ))}
              <div className="flex justify-between">
                <dt className="text-steel">
                  Honoraires d’ingénierie ({(estimate.assumptions.engStudyPercent * 100).toFixed(0)} % + forfait OIT)
                </dt>
                <dd className="font-mono text-ivory">{money(estimate.engStudyFee)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-steel">
                  Imprévus ({(estimate.assumptions.contingencyRate * 100).toFixed(0)} %)
                </dt>
                <dd className="font-mono text-ivory">{money(estimate.contingency)}</dd>
              </div>
              <div className="flex justify-between border-t border-gold/50 pt-3 text-base font-semibold">
                <dt className="text-ivory">Total HT</dt>
                <dd className="font-mono text-gold">{money(estimate.total)}</dd>
              </div>
            </dl>
          </section>

          {/* Range + exclusions + disclaimer */}
          <section aria-labelledby="sum-total-range" className="border border-gold/50 bg-gold/5 p-6">
            <h4 id="sum-total-range" className="font-mono text-[0.7rem] uppercase tracking-technical text-gold">
              {t('summary.range')}
            </h4>
            <p className="mt-2 font-display text-3xl text-ivory sm:text-4xl" dir="ltr">
              {money(estimate.range.low)} – {money(estimate.range.high)}
            </p>
            <p className="mt-1 text-xs text-steel">
              {t('summary.rangeNote', {
                lower: formatPercent(estimate.assumptions.lowerPct, lang),
                upper: formatPercent(estimate.assumptions.upperPct, lang),
              })}
            </p>
          </section>

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
        </>
      ) : null}
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
