'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Mail, MessageCircle, Send } from 'lucide-react';
import Button from '../ui/Button';
import Field, { inputClass } from './Field';
import { validateContact } from '../../lib/validation';
import { buildInquiryMessage, buildMailtoLink, buildWhatsAppLink, getContactConfig } from '../../lib/contact';
import { formatCurrency } from '../../lib/formatters';
import { useI18n } from '../AppProvider';

export default function ContactForm({ project = null, estimate = null, initialMessage = '', idPrefix = 'cf' }) {
  const { t, lang } = useI18n();
  const contactCfg = useMemo(() => getContactConfig(), []);

  const [values, setValues] = useState({
    name: '',
    phone: '',
    email: '',
    preferred: contactCfg.whatsapp ? 'whatsapp' : 'phone',
    message: initialMessage,
    website: '', 
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); 
  const [copied, setCopied] = useState(null); 

  const lastTopic = useRef(initialMessage);
  useEffect(() => {
    setValues((v) => (v.message === '' || v.message === lastTopic.current ? { ...v, message: initialMessage } : v));
    lastTopic.current = initialMessage;
  }, [initialMessage]);

  const setField = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));
  const formatMoney = (n) => formatCurrency(n, lang);

  const messageText = useMemo(
    () =>
      buildInquiryMessage({
        contact: values,
        project,
        estimate,
        labels: {
          title: t('inquiry.title'),
          name: t('inquiry.name'),
          phone: t('inquiry.phone'),
          email: t('inquiry.email'),
          preferred: t('inquiry.preferred'),
          category: t('inquiry.category'),
          area: t('inquiry.area'),
          floors: t('inquiry.floors'),
          location: t('inquiry.location'),
          startDate: t('inquiry.startDate'),
          scope: t('inquiry.scope'),
          extras: t('inquiry.extras'),
          description: t('inquiry.description'),
          estimate: t('inquiry.estimate'),
          range: t('inquiry.range'),
          demoNotice: t('inquiry.demoNotice'),
          message: t('inquiry.message'),
        },
        formatMoney,
        methodLabel: t(`contact.methods.${values.preferred}`),
      }),
    [values, project, estimate, lang, t]
  );

  const validate = () => {
    const found = validateContact(values);
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const errorText = (field) => {
    const e = errors[field];
    return e ? t(`validation.${e.code}`, e.params) : undefined;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // 🔥 BYPASS EVERYTHING and open WhatsApp directly!
    if (contactCfg.whatsapp) {
      window.location.href = buildWhatsAppLink(contactCfg.whatsapp, messageText);
    } else {
      // Fallback to email if no whatsapp
      window.location.href = buildMailtoLink(contactCfg.email, t('inquiry.subject'), messageText);
    }
  };

  const openChannel = (kind) => {
    if (!validate()) return;
    if (kind === 'whatsapp') {
      const link = buildWhatsAppLink(contactCfg.whatsapp, messageText);
      if (link) window.location.href = link;
    } else if (kind === 'email') {
      const link = buildMailtoLink(contactCfg.email, t('inquiry.subject'), messageText);
      if (link) window.location.href = link;
    }
  };

  const copyMessage = async () => {
    if (!validate()) return;
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied('ok');
    } catch {
      setCopied('fail');
    }
  };

  const methods = ['whatsapp', 'phone', 'email'];

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-6" aria-label={t('contact.form.title')}>
      {Object.keys(errors).length > 0 ? (
        <p role="alert" className="border border-amber/50 bg-amber/10 px-4 py-3 text-sm text-amber">
          {t('contact.status.fixErrors')}
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={`${idPrefix}-name`} label={t('contact.form.name')} error={errorText('name')}>
          {(a) => <input {...a} type="text" autoComplete="name" maxLength={120} value={values.name} onChange={setField('name')} className={inputClass} required />}
        </Field>
        <Field id={`${idPrefix}-phone`} label={t('contact.form.phone')} error={errorText('phone')}>
          {(a) => <input {...a} type="tel" inputMode="tel" autoComplete="tel" maxLength={40} dir="ltr" value={values.phone} onChange={setField('phone')} className={`${inputClass} text-start`} required />}
        </Field>
      </div>

      <Field id={`${idPrefix}-email`} label={t('contact.form.email')} optionalLabel={t('contact.form.optional')} error={errorText('email')}>
        {(a) => <input {...a} type="email" inputMode="email" autoComplete="email" maxLength={254} dir="ltr" value={values.email} onChange={setField('email')} className={`${inputClass} text-start`} />}
      </Field>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ivory">{t('contact.form.preferred')}</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {methods.map((m) => (
            <label
              key={m}
              className={`flex min-h-[48px] cursor-pointer items-center gap-3 border px-4 text-sm transition-colors ${
                values.preferred === m ? 'border-gold bg-gold/10 text-ivory' : 'border-ivory/15 text-steel hover:border-ivory/40'
              }`}
            >
              <input type="radio" name={`${idPrefix}-preferred`} value={m} checked={values.preferred === m} onChange={setField('preferred')} className="accent-[#d7ae68]" />
              {t(`contact.methods.${m}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <Field id={`${idPrefix}-message`} label={t('contact.form.message')} optionalLabel={t('contact.form.optional')} error={errorText('message')}>
        {(a) => (
          <textarea
            {...a}
            rows={5}
            maxLength={2000}
            value={values.message}
            onChange={setField('message')}
            placeholder={t('contact.form.messagePlaceholder')}
            className={`${inputClass} resize-y`}
          />
        )}
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button type="submit" size="lg">
          <Send size={16} aria-hidden="true" className="rtl:-scale-x-100" />
          {t('contact.form.submit')}
        </Button>
        {contactCfg.whatsapp ? (
          <Button type="button" variant="secondary" size="lg" onClick={() => openChannel('whatsapp')}>
            <MessageCircle size={16} aria-hidden="true" />
            {t('contact.actions.whatsapp')}
          </Button>
        ) : null}
        {contactCfg.email ? (
          <Button type="button" variant="secondary" size="lg" onClick={() => openChannel('email')}>
            <Mail size={16} aria-hidden="true" />
            {t('contact.actions.email')}
          </Button>
        ) : null}
        <Button type="button" variant="ghost" size="lg" onClick={copyMessage}>
          <Copy size={16} aria-hidden="true" />
          {t('contact.actions.copy')}
        </Button>
      </div>

      <div aria-live="polite" className="outline-none">
        {copied === 'ok' ? <p className="mt-3 text-sm text-gold">{t('contact.actions.copied')}</p> : null}
        {copied === 'fail' ? <p className="mt-3 text-sm text-amber">{t('contact.actions.copyFailed')}</p> : null}
      </div>

      <details className="border border-ivory/10 bg-ink/60">
        <summary className="min-h-[44px] cursor-pointer list-none px-4 py-3 text-sm text-steel hover:text-ivory">{t('contact.actions.preview')}</summary>
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words px-4 pb-4 font-mono text-xs leading-relaxed text-steel" dir="auto">
          {messageText}
        </pre>
      </details>

      <p className="text-xs text-steel">{t('contact.form.privacy')}</p>
    </form>
  );
}