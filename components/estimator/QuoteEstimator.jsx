'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';
import Field, { inputClass } from '../forms/Field';
import ContactForm from '../forms/ContactForm';
import QuoteSummary from './QuoteSummary';
import { ESTIMATOR_CONFIG } from './estimatorConfig';
import { EMPTY_ESTIMATOR_INPUT, resolveEstimate } from './estimatorUtils';
import { parseLocaleNumber, validateDimensions } from '../../lib/validation';
import { formatDate, formatNumber } from '../../lib/formatters';
import { useI18n } from '../AppProvider';

const STEPS = ['category', 'dimensions', 'scope', 'estimate', 'contact'];

// Five-step wizard. All state lives here (above the language switch), so changing the
// language never resets the visitor's inputs. Every selected option reaches the calculation.
export default function QuoteEstimator() {
  const { t, lang } = useI18n();
  const [step, setStep] = useState(0);
  const [input, setInput] = useState(EMPTY_ESTIMATOR_INPUT);
  const [errors, setErrors] = useState({});
  const [estimate, setEstimate] = useState(undefined); // undefined = not computed, null = disabled, object = result
  const headingRef = useRef(null);
  const firstRender = useRef(true);

  const cfg = ESTIMATOR_CONFIG;
  const limits = cfg.limits;

  // Move focus to the step heading after the step changes (not on first mount).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const update = (patch) => {
    setInput((prev) => ({ ...prev, ...patch }));
    setEstimate(undefined); // inputs changed: any previous result is stale
  };
  const setField = (name) => (e) => update({ [name]: e.target.value });
  const toggleIn = (key, id) => update({ [key]: input[key].includes(id) ? input[key].filter((x) => x !== id) : [...input[key], id] });

  const errorText = (field) => {
    const e = errors[field];
    return e ? t(`validation.${e.code}`, e.params) : undefined;
  };

  const goNext = () => {
    if (step === 0) {
      if (!input.category) {
        setErrors({ category: { code: 'categoryRequired' } });
        return;
      }
      setErrors({});
      setStep(1);
      return;
    }
    if (step === 1) {
      const found = validateDimensions(input, limits);
      setErrors(found);
      if (Object.keys(found).length === 0) setStep(2);
      return;
    }
    if (step === 2) {
      // Calculate. `resolveEstimate` returns null when numeric estimates are disabled.
      const result = resolveEstimate(input, cfg);
      if (result && !result.ok) {
        setErrors(result.errors);
        setStep(result.errors.category ? 0 : 1);
        return;
      }
      setErrors({});
      setEstimate(result);
      setStep(3);
      return;
    }
    if (step === 3) setStep(4);
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const reset = () => {
    setInput(EMPTY_ESTIMATOR_INPUT);
    setErrors({});
    setEstimate(undefined);
    setStep(0);
  };

  // Project data attached to the inquiry message.
  const project = useMemo(
    () => ({
      categoryLabel: input.category ? t(`estimator.categories.${input.category}`) : '',
      area: formatNumber(parseLocaleNumber(input.area) || 0, lang),
      floors: input.floors,
      location: input.location,
      startDate: input.startDate ? formatDate(input.startDate, lang) : '',
      scopeLabels: input.scopes.map((id) => t(`estimator.scope.${id}`)),
      extraLabels: input.extras.map((id) => t(`estimator.extras.${id}`)),
      description: input.description,
    }),
    [input, lang, t]
  );

  const summaryReady = step >= 3 && estimate !== undefined;
  const stepLabel = (i) => t(`estimator.steps.${STEPS[i]}`);

  return (
    <div className="border border-ivory/10 bg-graphite">
      {/* Progress */}
      <nav aria-label={t('estimator.stepsLabel')} className="border-b border-ivory/10">
        <ol className="grid grid-cols-5">
          {STEPS.map((id, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li
                key={id}
                aria-current={current ? 'step' : undefined}
                className={`relative flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-2 text-center ${current ? 'text-gold' : done ? 'text-ivory' : 'text-steel/70'}`}
              >
                <span className={`flex h-6 w-6 items-center justify-center border font-mono text-[0.68rem] ${current ? 'border-gold' : done ? 'border-ivory/60' : 'border-ivory/20'}`}>
                  {done ? <Check size={13} aria-hidden="true" /> : i + 1}
                </span>
                <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.14em] sm:block">{stepLabel(i)}</span>
                <span className="sr-only sm:hidden">{`${t('estimator.stepWord')} ${i + 1}: ${stepLabel(i)}`}</span>
                {current ? <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gold" /> : null}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="p-6 sm:p-10">
        <h3 ref={headingRef} tabIndex={-1} className="font-display text-3xl leading-tight text-ivory outline-none sm:text-4xl">
          {step === 0 && t('estimator.categoryTitle')}
          {step === 1 && t('estimator.dimensionsTitle')}
          {step === 2 && t('estimator.scopeTitle')}
          {step === 3 && t('summary.title')}
          {step === 4 && t('contact.form.title')}
        </h3>

        {Object.keys(errors).length > 0 && step !== 0 ? (
          <p role="alert" className="mt-5 border border-amber/50 bg-amber/10 px-4 py-3 text-sm text-amber">
            {t('estimator.errorsSummary')}
          </p>
        ) : null}

        <div className="mt-8">
          {/* Step 1 — category */}
          {step === 0 ? (
            <fieldset>
              <legend className="sr-only">{t('estimator.categoryTitle')}</legend>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.keys(cfg.categories).map((id) => {
                  const selected = input.category === id;
                  return (
                    <label
                      key={id}
                      className={`relative flex min-h-[72px] cursor-pointer items-center gap-4 border p-5 transition-colors duration-300 ${
                        selected ? 'border-gold bg-gold/10' : 'border-ivory/15 hover:border-ivory/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={id}
                        checked={selected}
                        onChange={() => {
                          update({ category: id });
                          setErrors({});
                        }}
                        className="peer sr-only"
                      />
                      <span aria-hidden="true" className={`flex h-5 w-5 shrink-0 items-center justify-center border ${selected ? 'border-gold bg-gold text-ink' : 'border-ivory/30'}`}>
                        {selected ? <Check size={13} /> : null}
                      </span>
                      <span className="font-display text-xl text-ivory peer-focus-visible:underline">{t(`estimator.categories.${id}`)}</span>
                    </label>
                  );
                })}
              </div>
              {errorText('category') ? (
                <p role="alert" className="mt-4 text-sm text-amber">
                  {errorText('category')}
                </p>
              ) : null}
            </fieldset>
          ) : null}

          {/* Step 2 — dimensions */}
          {step === 1 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <Field id="est-area" label={t('estimator.fields.area')} hint={t('estimator.fields.areaHint', { min: formatNumber(limits.areaMin, lang), max: formatNumber(limits.areaMax, lang) })} error={errorText('area')}>
                {(a) => <input {...a} type="text" inputMode="decimal" autoComplete="off" dir="ltr" value={input.area} onChange={setField('area')} className={`${inputClass} text-start`} />}
              </Field>
              <Field id="est-floors" label={t('estimator.fields.floors')} hint={t('estimator.fields.floorsHint', { min: limits.floorsMin, max: limits.floorsMax })} error={errorText('floors')}>
                {(a) => <input {...a} type="text" inputMode="numeric" autoComplete="off" dir="ltr" value={input.floors} onChange={setField('floors')} className={`${inputClass} text-start`} />}
              </Field>
              <Field id="est-location" label={t('estimator.fields.location')} error={errorText('location')}>
                {(a) => <input {...a} type="text" autoComplete="address-level2" maxLength={120} value={input.location} onChange={setField('location')} placeholder={t('estimator.fields.locationPlaceholder')} className={inputClass} />}
              </Field>
              <Field id="est-start" label={t('estimator.fields.startDate')} error={errorText('startDate')}>
                {(a) => <input {...a} type="date" dir="ltr" value={input.startDate} onChange={setField('startDate')} className={`${inputClass} text-start`} />}
              </Field>
              <div className="sm:col-span-2">
                <Field id="est-desc" label={t('estimator.fields.description')} error={errorText('description')}>
                  {(a) => <textarea {...a} rows={4} maxLength={1000} value={input.description} onChange={setField('description')} placeholder={t('estimator.fields.descriptionPlaceholder')} className={`${inputClass} resize-y`} />}
                </Field>
              </div>
            </div>
          ) : null}

          {/* Step 3 — scope & extras */}
          {step === 2 ? (
            <div className="space-y-10">
              <fieldset>
                <legend className="text-sm text-steel">{t('estimator.scopeHint')}</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.keys(cfg.scopes).map((id) => (
                    <CheckTile key={id} checked={input.scopes.includes(id)} onChange={() => toggleIn('scopes', id)} label={t(`estimator.scope.${id}`)} />
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="font-mono text-[0.7rem] uppercase tracking-technical text-gold">{t('estimator.extrasTitle')}</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.keys(cfg.extras).map((id) => (
                    <CheckTile key={id} checked={input.extras.includes(id)} onChange={() => toggleIn('extras', id)} label={t(`estimator.extras.${id}`)} />
                  ))}
                </div>
              </fieldset>
            </div>
          ) : null}

          {/* Step 4 — estimate */}
          {step === 3 && summaryReady ? <QuoteSummary input={input} estimate={estimate} /> : null}

          {/* Step 5 — contact */}
          {step === 4 ? <ContactForm project={project} estimate={estimate && estimate.ok ? estimate : null} initialMessage="" idPrefix="est-cf" /> : null}
        </div>

        {/* Navigation */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ivory/10 pt-6">
          <div className="flex gap-3">
            {step > 0 ? (
              <Button variant="secondary" onClick={goBack}>
                <ArrowLeft size={16} aria-hidden="true" className="rtl:-scale-x-100" />
                {t('estimator.back')}
              </Button>
            ) : null}
            {step > 0 ? (
              <Button variant="ghost" onClick={reset}>
                <RotateCcw size={15} aria-hidden="true" />
                {t('estimator.reset')}
              </Button>
            ) : null}
          </div>
          {step < 4 ? (
            <Button onClick={goNext}>
              {step === 2 ? t('estimator.calculate') : step === 3 ? t('estimator.toContact') : t('estimator.next')}
              <ArrowRight size={16} aria-hidden="true" className="rtl:-scale-x-100" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CheckTile({ checked, onChange, label }) {
  return (
    <label className={`flex min-h-[56px] cursor-pointer items-center gap-3 border px-4 transition-colors duration-300 ${checked ? 'border-gold bg-gold/10' : 'border-ivory/15 hover:border-ivory/40'}`}>
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span aria-hidden="true" className={`flex h-5 w-5 shrink-0 items-center justify-center border ${checked ? 'border-gold bg-gold text-ink' : 'border-ivory/30'}`}>
        {checked ? <Check size={13} /> : null}
      </span>
      <span className="text-sm text-ivory peer-focus-visible:underline">{label}</span>
    </label>
  );
}
