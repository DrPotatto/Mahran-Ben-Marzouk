// Dependency-free tests for the pure logic modules. Run: npm test  (or: node scripts/test-logic.mjs)
import assert from 'node:assert/strict';
import { parseLocaleNumber, validateDimensions, validateContact, isValidPhone } from '../lib/validation.js';
import { formatCurrency, formatNumber, formatDate } from '../lib/formatters.js';
import {
  buildWhatsAppLink,
  buildMailtoLink,
  normalizeWhatsAppNumber,
  getContactConfig,
  buildInquiryMessage,
  submitInquiry,
} from '../lib/contact.js';
import { getSupabaseConfig, insertInquiry } from '../lib/supabase.js';
import { ESTIMATOR_CONFIG } from '../components/estimator/estimatorConfig.js';
import { calculateEstimate, resolveEstimate } from '../components/estimator/estimatorUtils.js';

let passed = 0;
function test(name, fn) {
  try {
    const r = fn();
    if (r && typeof r.then === 'function') {
      return r.then(
        () => { passed++; console.log(`  ok  ${name}`); },
        (e) => { console.error(`  FAIL ${name}\n       ${e.message}`); process.exitCode = 1; }
      );
    }
    passed++;
    console.log(`  ok  ${name}`);
  } catch (e) {
    console.error(`  FAIL ${name}\n       ${e.message}`);
    process.exitCode = 1;
  }
}

const limits = ESTIMATOR_CONFIG.limits;
const today = new Date(2026, 9, 17); // 17 Oct 2026

console.log('validation');
test('parses comma decimals and arabic digits', () => {
  assert.equal(parseLocaleNumber('120,5'), 120.5);
  assert.equal(parseLocaleNumber('١٢٠'), 120);
  assert.equal(parseLocaleNumber(' 1 200 '), 1200);
  assert.ok(Number.isNaN(parseLocaleNumber('abc')));
  assert.ok(Number.isNaN(parseLocaleNumber('')));
  assert.ok(Number.isNaN(parseLocaleNumber('12e3')));
});
test('rejects negative, zero, NaN and out-of-range areas', () => {
  const base = { floors: '1', location: 'Tebourba' };
  assert.equal(validateDimensions({ ...base, area: '-5' }, limits, today).area.code, 'areaPositive');
  assert.equal(validateDimensions({ ...base, area: '0' }, limits, today).area.code, 'areaPositive');
  assert.equal(validateDimensions({ ...base, area: 'x' }, limits, today).area.code, 'areaInvalid');
  assert.equal(validateDimensions({ ...base, area: '5' }, limits, today).area.code, 'areaRange');
  assert.equal(validateDimensions({ ...base, area: '999999' }, limits, today).area.code, 'areaRange');
  assert.equal(validateDimensions({ ...base, area: '120' }, limits, today).area, undefined);
});
test('floors must be an integer in range', () => {
  const base = { area: '120', location: 'Tebourba' };
  assert.equal(validateDimensions({ ...base, floors: '1.5' }, limits, today).floors.code, 'floorsInvalid');
  assert.equal(validateDimensions({ ...base, floors: '0' }, limits, today).floors.code, 'floorsRange');
  assert.equal(validateDimensions({ ...base, floors: '-2' }, limits, today).floors.code, 'floorsRange');
  assert.equal(validateDimensions({ ...base, floors: '3' }, limits, today).floors, undefined);
});
test('location required, start date checks', () => {
  const base = { area: '120', floors: '2' };
  assert.equal(validateDimensions({ ...base, location: ' ' }, limits, today).location.code, 'locationRequired');
  assert.equal(validateDimensions({ ...base, location: 'x', startDate: '2026-01-01' }, limits, today).startDate.code, 'datePast');
  assert.equal(validateDimensions({ ...base, location: 'x', startDate: '2026-02-31' }, limits, today).startDate.code, 'dateInvalid');
  assert.equal(validateDimensions({ ...base, location: 'x', startDate: '2040-01-01' }, limits, today).startDate.code, 'dateFar');
  assert.equal(validateDimensions({ ...base, location: 'x', startDate: '2026-12-01' }, limits, today).startDate, undefined);
});
test('contact validation', () => {
  const ok = { name: 'Sami', phone: '+216 20 123 456', email: '', preferred: 'whatsapp', message: '' };
  assert.deepEqual(validateContact(ok), {});
  assert.equal(validateContact({ ...ok, name: '' }).name.code, 'required');
  assert.equal(validateContact({ ...ok, phone: '12' }).phone.code, 'phoneInvalid');
  assert.equal(validateContact({ ...ok, email: 'bad@' }).email.code, 'emailInvalid');
  assert.equal(validateContact({ ...ok, preferred: 'email', email: '' }).email.code, 'emailRequiredForMethod');
  assert.equal(validateContact({ ...ok, preferred: 'fax' }).preferred.code, 'preferredInvalid');
  assert.ok(isValidPhone('٢٠ ١٢٣ ٤٥٦'));
});

console.log('estimator');
const input = { category: 'new', area: '100', floors: '1', location: 'Tebourba', startDate: '', scopes: [], extras: [] };
test('base-only estimate = area x baseRate', () => {
  const r = calculateEstimate(input, ESTIMATOR_CONFIG, today);
  assert.equal(r.ok, true);
  assert.equal(r.lines.length, 1);
  assert.equal(r.subtotal, 100 * ESTIMATOR_CONFIG.categories.new.baseRate);
  assert.equal(r.contingency, Math.round(r.subtotal * ESTIMATOR_CONFIG.contingency));
  assert.equal(r.total, r.subtotal + r.contingency);
});
test('every selected scope and extra yields a line (nothing silently ignored)', () => {
  const all = Object.keys(ESTIMATOR_CONFIG.scopes);
  const extras = Object.keys(ESTIMATOR_CONFIG.extras);
  const r = calculateEstimate({ ...input, scopes: all, extras }, ESTIMATOR_CONFIG, today);
  assert.equal(r.lines.length, 1 + all.length);
  assert.equal(r.extraLines.length, extras.length);
  for (const id of all) assert.ok(r.lines.some((l) => l.id === id), `missing scope ${id}`);
  const expectedSubtotal = 100 * (700 + all.reduce((s, id) => s + ESTIMATOR_CONFIG.scopes[id].rate, 0));
  assert.equal(r.subtotal, expectedSubtotal);
  assert.ok(r.extrasTotal > 0);
});
test('unselecting a scope lowers the total', () => {
  const a = calculateEstimate({ ...input, scopes: ['roofing'] }, ESTIMATOR_CONFIG, today);
  const b = calculateEstimate({ ...input, scopes: [] }, ESTIMATOR_CONFIG, today);
  assert.ok(a.total > b.total);
});
test('floors increase the estimate; range brackets the total', () => {
  const one = calculateEstimate(input, ESTIMATOR_CONFIG, today);
  const three = calculateEstimate({ ...input, floors: '3' }, ESTIMATOR_CONFIG, today);
  assert.ok(three.total > one.total);
  assert.ok(one.range.low < one.total && one.range.high > one.total);
});
test('invalid input returns errors, never numbers', () => {
  const r = calculateEstimate({ ...input, area: '-20' }, ESTIMATOR_CONFIG, today);
  assert.equal(r.ok, false);
  assert.ok(r.errors.area);
  assert.equal(calculateEstimate({ ...input, category: '' }, ESTIMATOR_CONFIG, today).errors.category.code, 'categoryRequired');
  assert.equal(calculateEstimate({ ...input, scopes: ['nope'] }, ESTIMATOR_CONFIG, today).ok, false);
});
test('disabled mode yields no estimate at all', () => {
  assert.equal(resolveEstimate(input, { ...ESTIMATOR_CONFIG, mode: 'disabled' }, today), null);
  assert.equal(resolveEstimate(input, { ...ESTIMATOR_CONFIG, mode: 'demo' }, today).ok, true);
});

console.log('formatting');
test('currency is TND with Latin digits in every language', () => {
  for (const lang of ['fr', 'ar', 'en']) {
    const s = formatCurrency(12500, lang);
    assert.match(s, /TND/);
    assert.match(s.replace(/[\s  ,.]/g, ''), /12500/);
  }
  assert.equal(formatNumber(NaN), '—');
  assert.match(formatDate('2026-12-01', 'fr'), /2026/);
});

console.log('contact');
test('whatsapp normalisation and link', () => {
  assert.equal(normalizeWhatsAppNumber('20 123 456'), '21620123456');
  assert.equal(normalizeWhatsAppNumber('+216 20 123 456'), '21620123456');
  assert.equal(normalizeWhatsAppNumber('00216 20123456'), '21620123456');
  assert.equal(normalizeWhatsAppNumber('123'), '');
  assert.equal(normalizeWhatsAppNumber(''), '');
  assert.equal(buildWhatsAppLink('', 'hi'), null);
  assert.equal(buildWhatsAppLink('21620123456', 'a b'), 'https://wa.me/21620123456?text=a%20b');
});
test('mailto link only for valid addresses', () => {
  assert.equal(buildMailtoLink('', 's'), null);
  assert.equal(buildMailtoLink('nope', 's'), null);
  assert.equal(buildMailtoLink('a@b.tn', 'Sujet', 'x y'), 'mailto:a@b.tn?subject=Sujet&body=x%20y');
});
test('no direct channel is reported when nothing is configured', () => {
  const c = getContactConfig({ whatsapp: '', email: '', phone: '' });
  assert.equal(c.hasDirectChannel, false);
  assert.equal(c.whatsapp, '');
  const c2 = getContactConfig({ whatsapp: '20123456', email: 'a@b.tn', phone: '' });
  assert.equal(c2.whatsapp, '21620123456');
  assert.equal(c2.hasDirectChannel, true);
});
test('inquiry message contains selections and the estimate; omits it when null', () => {
  const est = calculateEstimate({ ...input, scopes: ['roofing'] }, ESTIMATOR_CONFIG, today);
  const labels = {
    title: 'T', name: 'N', phone: 'P', email: 'E', preferred: 'Pref', category: 'Cat', area: 'Area', floors: 'Fl',
    location: 'Loc', startDate: 'Start', scope: 'Scope', extras: 'Extras', description: 'Desc',
    estimate: 'Est', range: 'Range', demoNotice: 'demo rates', message: 'Msg',
  };
  const base = {
    contact: { name: 'Sami', phone: '20123456', email: '', message: 'Bonjour' },
    project: { categoryLabel: 'Neuf', area: '100', floors: '1', location: 'Tebourba', scopeLabels: ['Toiture'] },
    labels,
    formatMoney: (n) => `${n} TND`,
    methodLabel: 'WhatsApp',
  };
  const withEst = buildInquiryMessage({ ...base, estimate: est });
  assert.match(withEst, /Toiture/);
  assert.match(withEst, /Range: \d+ TND – \d+ TND/);
  assert.match(withEst, /demo rates/);
  const withoutEst = buildInquiryMessage({ ...base, estimate: null });
  assert.doesNotMatch(withoutEst, /TND/);
});

console.log('storage');
const FAKE_ANON = `x.${Buffer.from(JSON.stringify({ role: 'anon' })).toString('base64url')}.y`;
const FAKE_SERVICE = `x.${Buffer.from(JSON.stringify({ role: 'service_role' })).toString('base64url')}.y`;
await test('supabase config: refuses service_role, non-https and missing values', () => {
  assert.equal(getSupabaseConfig({ url: '', anonKey: '' }), null);
  assert.equal(getSupabaseConfig({ url: 'http://x.supabase.co', anonKey: FAKE_ANON }), null);
  const origError = console.error; console.error = () => {};
  assert.equal(getSupabaseConfig({ url: 'https://x.supabase.co', anonKey: FAKE_SERVICE }), null);
  console.error = origError;
  assert.deepEqual(getSupabaseConfig({ url: 'https://x.supabase.co/', anonKey: FAKE_ANON }), { url: 'https://x.supabase.co', anonKey: FAKE_ANON });
});
await test('submitInquiry reports unconfigured / saved / failed honestly', async () => {
  const payload = { contact: { name: 'S', phone: '20123456', email: '', preferred: 'phone' }, message: 'm', estimate: null, lang: 'fr' };
  assert.equal((await submitInquiry(payload, { config: null })).status, 'unconfigured');
  const config = { url: 'https://x.supabase.co', anonKey: FAKE_ANON };
  const okFetch = async (url, init) => {
    assert.equal(url, 'https://x.supabase.co/rest/v1/inquiries');
    assert.equal(JSON.parse(init.body).preferred_contact, 'phone');
    return { ok: true, status: 201 };
  };
  assert.equal((await submitInquiry(payload, { config, fetchImpl: okFetch })).status, 'saved');
  const badFetch = async () => ({ ok: false, status: 401 });
  const failed = await submitInquiry(payload, { config, fetchImpl: badFetch });
  assert.equal(failed.status, 'failed');
  const throwFetch = async () => { throw new Error('offline'); };
  assert.equal((await submitInquiry(payload, { config, fetchImpl: throwFetch })).status, 'failed');
  assert.equal((await submitInquiry({ ...payload, honeypot: 'bot' }, { config, fetchImpl: okFetch })).status, 'failed');
  assert.equal((await insertInquiry({}, { config: null })).ok, false);
});

console.log(`\n${passed} checks passed${process.exitCode ? ' — WITH FAILURES' : ''}`);
