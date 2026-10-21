// Transparent estimate engine. Pure functions, no framework imports.
// Every selected option produces its own line item, so nothing is silently ignored.

import { ESTIMATOR_CONFIG } from './estimatorConfig.js';
import { parseLocaleNumber, validateDimensions } from '../../lib/validation.js';

const roundMoney = (n) => Math.round(n);
const roundTo = (n, step) => (step > 0 ? Math.round(n / step) * step : Math.round(n));

export function getFloorMultiplier(floors, config = ESTIMATOR_CONFIG) {
  return 1 + (floors - 1) * config.floors.perExtraFloor;
}

/**
 * @param input  { category, area, floors, location, startDate, scopes: string[], extras: string[] }
 * @param config estimator configuration (defaults to ESTIMATOR_CONFIG)
 * @returns { ok:false, errors } | { ok:true, lines, subtotal, extrasTotal, contingency, total, range, assumptions }
 */
export function calculateEstimate(input, config = ESTIMATOR_CONFIG, today = new Date()) {
  const errors = validateDimensions(input, config.limits, today);

  const category = config.categories[input.category];
  if (!category) errors.category = { code: 'categoryRequired' };

  const scopes = Array.isArray(input.scopes) ? input.scopes : [];
  const extras = Array.isArray(input.extras) ? input.extras : [];
  for (const id of scopes) if (!config.scopes[id]) errors.scopes = { code: 'scopeUnknown' };
  for (const id of extras) if (!config.extras[id]) errors.extras = { code: 'extraUnknown' };

  if (Object.keys(errors).length) return { ok: false, errors };

  const area = parseLocaleNumber(input.area);
  const floors = parseLocaleNumber(input.floors);
  const floorMultiplier = getFloorMultiplier(floors, config);

  const lines = [];
  lines.push({
    id: 'base',
    kind: 'base',
    quantity: area,
    rate: category.baseRate,
    multiplier: floorMultiplier,
    amount: roundMoney(area * category.baseRate * floorMultiplier),
  });

  for (const id of scopes) {
    const rate = config.scopes[id].rate;
    lines.push({
      id,
      kind: 'scope',
      quantity: area,
      rate,
      multiplier: category.scopeMultiplier * floorMultiplier,
      amount: roundMoney(area * rate * category.scopeMultiplier * floorMultiplier),
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);

  const extraLines = extras.map((id) => {
    const def = config.extras[id];
    return {
      id,
      kind: 'extra',
      type: def.type,
      rate: def.value,
      amount: def.type === 'percent' ? roundMoney(subtotal * def.value) : roundMoney(def.value),
    };
  });
  const extrasTotal = extraLines.reduce((sum, l) => sum + l.amount, 0);

  const contingency = roundMoney((subtotal + extrasTotal) * config.contingency);
  const total = subtotal + extrasTotal + contingency;

  const range = {
    low: roundTo(total * (1 - config.range.lowerPct), config.range.roundTo),
    high: roundTo(total * (1 + config.range.upperPct), config.range.roundTo),
  };

  return {
    ok: true,
    lines,
    extraLines,
    subtotal,
    extrasTotal,
    contingency,
    total,
    range,
    assumptions: {
      area,
      floors,
      category: input.category,
      baseRate: category.baseRate,
      scopeMultiplier: category.scopeMultiplier,
      floorMultiplier,
      contingencyRate: config.contingency,
      lowerPct: config.range.lowerPct,
      upperPct: config.range.upperPct,
      currency: config.currency,
      mode: config.mode,
    },
  };
}

/**
 * UI-facing wrapper: returns `null` when numeric estimates are disabled so that
 * no number can leak into the summary or the inquiry message.
 */
export function resolveEstimate(input, config = ESTIMATOR_CONFIG, today = new Date()) {
  if (config.mode === 'disabled') return null;
  return calculateEstimate(input, config, today);
}

export const EMPTY_ESTIMATOR_INPUT = {
  category: '',
  area: '',
  floors: '1',
  location: '',
  startDate: '',
  description: '',
  scopes: [],
  extras: [],
};
