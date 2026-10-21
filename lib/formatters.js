// Locale-aware formatting. Latin digits are used in every language, which is the
// usual convention in Tunisia (also for Arabic).

export const LOCALE_TAGS = {
  fr: 'fr-TN',
  ar: 'ar-TN',
  en: 'en-TN',
};

function tag(lang) {
  return LOCALE_TAGS[lang] || LOCALE_TAGS.fr;
}

export function formatNumber(value, lang = 'fr', options = {}) {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(tag(lang), { numberingSystem: 'latn', ...options }).format(value);
}

/** Tunisian dinar, shown with the ISO code (e.g. "12 500 TND"), no decimals for estimates. */
export function formatCurrency(value, lang = 'fr', currency = 'TND') {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(tag(lang), {
    style: 'currency',
    currency,
    currencyDisplay: 'code',
    maximumFractionDigits: 0,
    numberingSystem: 'latn',
  }).format(value);
}

export function formatPercent(value, lang = 'fr') {
  return formatNumber(value, lang, { style: 'percent', maximumFractionDigits: 1 });
}

/** Format a YYYY-MM-DD string; returns the raw value if it cannot be parsed. */
export function formatDate(value, lang = 'fr') {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? ''));
  if (!m) return String(value ?? '');
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return new Intl.DateTimeFormat(tag(lang), {
    dateStyle: 'long',
    calendar: 'gregory',
    numberingSystem: 'latn',
  }).format(d);
}

/** Format degrees/minutes for the decorative coordinate marker. */
export function formatCoordinate(value, positiveHemisphere, negativeHemisphere) {
  const hemi = value >= 0 ? positiveHemisphere : negativeHemisphere;
  const abs = Math.abs(value);
  const deg = Math.floor(abs);
  const min = Math.round((abs - deg) * 60);
  return `${deg}°${String(min).padStart(2, '0')}′${hemi}`;
}
