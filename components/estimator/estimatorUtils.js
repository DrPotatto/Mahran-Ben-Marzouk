// Transparent estimate engine — pure functions, no React imports.
// Computes a detailed devis with material + labour lines, overhead, profit,
// contingency, and OIT-regulated engineering fees.

import { ESTIMATOR_CONFIG } from './estimatorConfig.js';
import { parseLocaleNumber, validateDimensions } from '../../lib/validation.js';

const roundMoney = (n) => Math.round(n);
const roundTo = (n, step) => (step > 0 ? Math.round(n / step) * step : Math.round(n));

export function getFloorMultiplier(floors, config = ESTIMATOR_CONFIG) {
  return 1 + (floors - 1) * config.floors.perExtraFloor;
}

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

  // ----- 1. BASE STRUCTURE LINE -----
  const baseAmount = roundMoney(area * category.baseRate * floorMultiplier);
  const lines = [
    {
      id: 'base',
      kind: 'base',
      label: `Structure de base — ${category.label}`,
      quantity: area,
      unit: 'm²',
      unitPrice: category.baseRate,
      multiplier: floorMultiplier,
      material: category.baseRate * 0.55,
      labour: category.baseRate * 0.45,
      amount: baseAmount,
    },
  ];

  // ----- 2. DETAILED SCOPE LINES -----
  for (const scopeId of scopes) {
    const scope = config.scopes[scopeId];
    if (!scope) continue;
    for (const item of scope.items) {
      const quantity =
        item.unit === 'forfait' || item.unit === 'u'
          ? item.qtyFactor
          : roundTo(area * item.qtyFactor, 1);

      const unitPrice = item.material + item.labour;
      const amount = roundMoney(quantity * unitPrice * floorMultiplier);

      lines.push({
        id: `${scopeId}__${item.id}`,
        kind: 'scope',
        scopeId,
        label: item.label,
        note: item.note,
        quantity,
        unit: item.unit,
        unitPrice,
        material: item.material,
        labour: item.labour,
        multiplier: floorMultiplier,
        amount,
      });
    }
  }

  // ----- 3. SUBTOTAL (materials + labour) -----
  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);

  // ----- 4. SITE OVERHEAD -----
  const siteOverhead = roundMoney(subtotal * config.siteOverhead);

  // ----- 5. PROFIT MARGIN -----
  const profit = roundMoney((subtotal + siteOverhead) * config.profitMargin);

  // ----- 6. EXTRAS (optional) -----
  const extraLines = extras
    .map((id) => {
      const def = config.extras[id];
      if (!def) return null;
      const amount =
        def.type === 'percent'
          ? roundMoney(subtotal * def.value)
          : roundMoney(def.value);
      return {
        id,
        kind: 'extra',
        label: def.label,
        type: def.type,
        rate: def.value,
        amount,
      };
    })
    .filter(Boolean);

  const extrasTotal = extraLines.reduce((sum, l) => sum + l.amount, 0);

  // ----- 7. ENGINEERING FEES (OIT-regulated) -----
  // 3% of the pre-fee total, plus a fixed fee (we use the midpoint of the range).
  const preFeeTotal = subtotal + siteOverhead + profit + extrasTotal;
  const engStudyFee = roundMoney(
    preFeeTotal * config.engineering.studyPercent +
      (config.engineering.fixedFeeMin + config.engineering.fixedFeeMax) / 2
  );

  // ----- 8. CONTINGENCY -----
  const preContingency = preFeeTotal + engStudyFee;
  const contingency = roundMoney(preContingency * config.contingency);

  // ----- 9. FINAL TOTAL -----
  const total = preContingency + contingency;

  // ----- 10. INDICATIVE RANGE -----
  const range = {
    low: roundTo(total * (1 - config.range.lowerPct), config.range.roundTo),
    high: roundTo(total * (1 + config.range.upperPct), config.range.roundTo),
  };

  // ----- 11. MATERIAL / LABOUR TOTALS (for transparency) -----
  const totalMaterial = lines.reduce(
    (sum, l) => sum + (l.material || 0) * (l.quantity || 1) * (l.multiplier || 1),
    0
  );
  const totalLabour = lines.reduce(
    (sum, l) => sum + (l.labour || 0) * (l.quantity || 1) * (l.multiplier || 1),
    0
  );

  return {
    ok: true,
    lines,
    extraLines,
    subtotal,
    siteOverhead,
    profit,
    extrasTotal,
    engStudyFee,
    contingency,
    total,
    range,
    totalMaterial: roundMoney(totalMaterial),
    totalLabour: roundMoney(totalLabour),
    assumptions: {
      area,
      floors,
      category: input.category,
      categoryLabel: category.label,
      floorMultiplier,
      siteOverheadRate: config.siteOverhead,
      profitRate: config.profitMargin,
      contingencyRate: config.contingency,
      engStudyPercent: config.engineering.studyPercent,
      lowerPct: config.range.lowerPct,
      upperPct: config.range.upperPct,
      currency: config.currency,
      mode: config.mode,
    },
  };
}

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
