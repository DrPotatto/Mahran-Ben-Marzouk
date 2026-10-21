// Pure validation helpers (no framework imports so they can be unit-tested in Node).
// Validators return `null` when valid, otherwise `{ code, params? }`.
// `code` maps to a translation under `validation.<code>` in the locale files.

const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩';
const EASTERN_ARABIC_INDIC = '۰۱۲۳۴۵۶۷۸۹';

/** Replace Arabic-Indic / Persian digits with ASCII digits. */
export function normalizeDigits(value) {
  return String(value ?? '').replace(/[٠-٩۰-۹]/g, (ch) => {
    const a = ARABIC_INDIC.indexOf(ch);
    if (a >= 0) return String(a);
    return String(EASTERN_ARABIC_INDIC.indexOf(ch));
  });
}

/**
 * Parse a user-typed number. Accepts "120", "120.5", "120,5", Arabic digits and
 * spaces used as thousand separators. Returns NaN for anything else.
 */
export function parseLocaleNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  if (value === null || value === undefined) return NaN;
  const cleaned = normalizeDigits(value)
    .trim()
    .replace(/[\s  ]/g, '')
    .replace('٫', '.')
    .replace(',', '.');
  if (cleaned === '' || !/^-?\d+(\.\d+)?$/.test(cleaned)) return NaN;
  return Number(cleaned);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Validate the estimator "dimensions" step. */
export function validateDimensions(input, limits, today = new Date()) {
  const errors = {};

  const area = parseLocaleNumber(input.area);
  if (Number.isNaN(area)) errors.area = { code: 'areaInvalid' };
  else if (area <= 0) errors.area = { code: 'areaPositive' };
  else if (area < limits.areaMin || area > limits.areaMax) {
    errors.area = { code: 'areaRange', params: { min: limits.areaMin, max: limits.areaMax } };
  }

  const floors = parseLocaleNumber(input.floors);
  if (Number.isNaN(floors) || !Number.isInteger(floors)) errors.floors = { code: 'floorsInvalid' };
  else if (floors < limits.floorsMin || floors > limits.floorsMax) {
    errors.floors = {
      code: 'floorsRange',
      params: { min: limits.floorsMin, max: limits.floorsMax },
    };
  }

  if (!String(input.location ?? '').trim()) errors.location = { code: 'locationRequired' };

  if (input.startDate) {
    // <input type="date"> yields YYYY-MM-DD.
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(input.startDate));
    const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
    if (!d || Number.isNaN(d.getTime()) || d.getMonth() !== Number(m[2]) - 1) {
      errors.startDate = { code: 'dateInvalid' };
    } else if (d < startOfDay(today)) {
      errors.startDate = { code: 'datePast' };
    } else if (d > new Date(today.getFullYear() + 6, today.getMonth(), today.getDate())) {
      errors.startDate = { code: 'dateFar' };
    }
  }

  return errors;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email) {
  return EMAIL_RE.test(String(email ?? '').trim());
}

/** Digits count of a phone number once separators are removed (8-15 accepted). */
export function isValidPhone(phone) {
  const digits = normalizeDigits(phone).replace(/[\s().\-+]/g, '');
  return /^\d{8,15}$/.test(digits);
}

export const CONTACT_METHODS = ['whatsapp', 'phone', 'email'];

/** Validate the contact form. */
export function validateContact(input) {
  const errors = {};
  const name = String(input.name ?? '').trim();
  if (!name) errors.name = { code: 'required' };
  else if (name.length < 2) errors.name = { code: 'nameShort' };
  else if (name.length > 120) errors.name = { code: 'nameLong' };

  if (!String(input.phone ?? '').trim()) errors.phone = { code: 'required' };
  else if (!isValidPhone(input.phone)) errors.phone = { code: 'phoneInvalid' };

  const email = String(input.email ?? '').trim();
  if (email && !isValidEmail(email)) errors.email = { code: 'emailInvalid' };

  if (!CONTACT_METHODS.includes(input.preferred)) errors.preferred = { code: 'preferredInvalid' };
  else if (input.preferred === 'email' && !email) errors.email = { code: 'emailRequiredForMethod' };

  const message = String(input.message ?? '');
  if (message.length > 2000) errors.message = { code: 'messageLong', params: { max: 2000 } };

  return errors;
}
