// ---------------------------------------------------------------------------
// ESTIMATOR CONFIGURATION  —  OWNER ACTION REQUIRED BEFORE COMMERCIAL USE
// ---------------------------------------------------------------------------
// Every number below is a DEMONSTRATION VALUE. They are NOT 7DCONSTRUCTION
// prices and must be replaced by rates approved by the owner.
//
// Modes (NEXT_PUBLIC_ESTIMATOR_MODE or the fallback below):
//   'demo'     numeric estimate shown with a visible "demonstration rates" notice
//   'verified' numeric estimate shown without the demo notice (use only after
//              you have replaced every rate below with approved values)
//   'disabled' no numbers are displayed; only the scope summary and the contact step
//
// Formula (see estimatorUtils.js):
//   floorMultiplier = 1 + (floors - 1) * perExtraFloor
//   base line       = area x categories[cat].baseRate x floorMultiplier
//   scope line      = area x scopes[id].rate x categories[cat].scopeMultiplier x floorMultiplier
//   subtotal        = base + scope lines
//   extras          = percent-of-subtotal or fixed amounts (only those the user ticks)
//   contingency     = contingency x (subtotal + extras)
//   total           = subtotal + extras + contingency
//   range           = total x (1 - lowerPct) ... total x (1 + upperPct), rounded to `roundTo`
// ---------------------------------------------------------------------------

export const ESTIMATOR_MODES = ['demo', 'verified', 'disabled'];

function resolveMode(value) {
  const v = String(value ?? '').trim().toLowerCase();
  return ESTIMATOR_MODES.includes(v) ? v : 'demo';
}

export const ESTIMATOR_CONFIG = {
  currency: 'TND',
  mode: resolveMode(process.env.NEXT_PUBLIC_ESTIMATOR_MODE),

  limits: { areaMin: 10, areaMax: 20000, floorsMin: 1, floorsMax: 20 },

  // Demonstration base rates, TND per m² of floor area.
  categories: {
    new: { baseRate: 700, scopeMultiplier: 1.0 },
    shell: { baseRate: 480, scopeMultiplier: 0.9 },
    renovation: { baseRate: 520, scopeMultiplier: 0.85 },
    finishing: { baseRate: 380, scopeMultiplier: 0.8 },
    extension: { baseRate: 680, scopeMultiplier: 1.05 },
    other: { baseRate: 600, scopeMultiplier: 1.0 },
  },

  // Optional trades, demonstration TND per m². Nothing is assumed to be included.
  scopes: {
    structural: { rate: 280 },
    masonry: { rate: 110 },
    roofing: { rate: 70 },
    electrical: { rate: 90 },
    plumbing: { rate: 80 },
    interiorFinishing: { rate: 260 },
    exteriorFinishing: { rate: 140 },
  },

  floors: { perExtraFloor: 0.03 },

  // Optional additional costs (user ticks them). type: 'percent' of subtotal | 'fixed' TND.
  extras: {
    siteSetup: { type: 'percent', value: 0.02 },
    studies: { type: 'fixed', value: 2500 },
    wasteRemoval: { type: 'percent', value: 0.015 },
  },

  contingency: 0.1,
  range: { lowerPct: 0.12, upperPct: 0.18, roundTo: 100 },
};
