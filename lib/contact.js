// Contact integration layer: WhatsApp link, mailto link, readable inquiry message,
// and optional persistent storage. Nothing here ever claims delivery that did not happen.

import { SITE } from '../data/site.js';
import { insertInquiry, getSupabaseConfig } from './supabase.js';
import { normalizeDigits } from './validation.js';

/** Resolved contact channels. Environment variables win over data/site.js. */
export function getContactConfig(
  env = {
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE,
  }
) {
  const whatsapp = normalizeWhatsAppNumber(env.whatsapp || SITE.contact.whatsappNumber);
  const email = String(env.email || SITE.contact.email || '').trim();
  const phoneDisplay = String(env.phone || SITE.contact.phoneDisplay || '').trim();
  return {
    whatsapp, // '' when not configured / invalid
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? email : '',
    phoneDisplay,
    hasDirectChannel: Boolean(whatsapp || email || phoneDisplay),
    hasStorage: getSupabaseConfig() !== null,
  };
}

/**
 * Normalise to international digits. 8-digit numbers are treated as Tunisian
 * (prefix 216). Returns '' when the result is not 9-15 digits.
 */
export function normalizeWhatsAppNumber(raw) {
  let digits = normalizeDigits(raw).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 8) digits = `216${digits}`;
  return digits.length >= 9 && digits.length <= 15 ? digits : '';
}

export function buildWhatsAppLink(number, message = '') {
  const n = normalizeWhatsAppNumber(number);
  if (!n) return null;
  return `https://wa.me/${n}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

export function buildMailtoLink(email, subject = '', body = '') {
  const e = String(email ?? '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return null;
  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${e}${params.length ? `?${params.join('&')}` : ''}`;
}

export function buildTelLink(phone) {
  const digits = normalizeDigits(phone).replace(/[^\d+]/g, '');
  return digits.replace(/\D/g, '').length >= 8 ? `tel:${digits}` : null;
}

/**
 * Readable plain-text inquiry. `labels` comes from the `inquiry` locale block,
 * `formatMoney` from lib/formatters (bound to the active language).
 *
 * project: { categoryLabel, area, floors, location, startDate, scopeLabels[], extraLabels[], description }
 * estimate: result of resolveEstimate() or null
 */
export function buildInquiryMessage({ contact, project, estimate, labels, formatMoney, methodLabel }) {
  const lines = [labels.title, ''];
  lines.push(`${labels.name}: ${contact.name}`);
  lines.push(`${labels.phone}: ${contact.phone}`);
  if (contact.email) lines.push(`${labels.email}: ${contact.email}`);
  if (methodLabel) lines.push(`${labels.preferred}: ${methodLabel}`);

  if (project) {
    lines.push('');
    if (project.categoryLabel) lines.push(`${labels.category}: ${project.categoryLabel}`);
    if (project.area) lines.push(`${labels.area}: ${project.area} m²`);
    if (project.floors) lines.push(`${labels.floors}: ${project.floors}`);
    if (project.location) lines.push(`${labels.location}: ${project.location}`);
    if (project.startDate) lines.push(`${labels.startDate}: ${project.startDate}`);
    if (project.scopeLabels?.length) lines.push(`${labels.scope}: ${project.scopeLabels.join(', ')}`);
    if (project.extraLabels?.length) lines.push(`${labels.extras}: ${project.extraLabels.join(', ')}`);
    if (project.description) lines.push(`${labels.description}: ${project.description}`);
  }

  if (estimate && estimate.ok) {
    lines.push('');
    lines.push(
      `${labels.range}: ${formatMoney(estimate.range.low)} – ${formatMoney(estimate.range.high)}`
    );
    lines.push(`${labels.estimate}: ${formatMoney(estimate.total)}`);
    if (estimate.assumptions.mode !== 'verified') lines.push(`(${labels.demoNotice})`);
  }

  if (contact.message && String(contact.message).trim()) {
    lines.push('');
    lines.push(`${labels.message}: ${String(contact.message).trim()}`);
  }
  return lines.join('\n');
}

/**
 * Try to persist an inquiry. Possible statuses:
 *  - 'saved'        server confirmed the insert
 *  - 'unconfigured' no storage configured (the UI then offers direct channels)
 *  - 'failed'       storage configured but the request failed (or spam trap hit)
 */
export async function submitInquiry({ contact, message, estimate, lang, honeypot }, options) {
  if (honeypot) return { status: 'failed', error: 'rejected' };
  const config = options?.config ?? getSupabaseConfig();
  if (!config) return { status: 'unconfigured' };

  const row = {
    name: String(contact.name).trim(),
    phone: String(contact.phone).trim(),
    email: contact.email ? String(contact.email).trim() : null,
    preferred_contact: contact.preferred,
    message,
    estimate:
      estimate && estimate.ok
        ? {
            total: estimate.total,
            low: estimate.range.low,
            high: estimate.range.high,
            currency: estimate.assumptions.currency,
            mode: estimate.assumptions.mode,
          }
        : null,
    lang,
  };
  const result = await insertInquiry(row, { ...options, config });
  return result.ok ? { status: 'saved' } : { status: 'failed', error: result.error };
}
