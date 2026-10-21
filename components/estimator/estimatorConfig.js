// ---------------------------------------------------------------------------
// 7DCONSTRUCTION — TRANSPARENT, COMPETITIVE & PROFITABLE ESTIMATOR
// Market data: 2025/2026 Tunisia (BMP.tn, OIT, Alusystem, local suppliers).
// Every scope is itemised: material cost + labour cost = unit price.
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

  // Project type: used only for labelling and a small complexity multiplier.
  categories: {
    new:        { label: 'Construction neuve',   factor: 1.00 },
    shell:      { label: 'Gros œuvre seul',       factor: 0.95 },
    renovation: { label: 'Rénovation',            factor: 0.90 },
    finishing:  { label: 'Finitions seules',       factor: 0.85 },
    extension:  { label: 'Extension',              factor: 1.05 },
    other:      { label: 'Autre projet',           factor: 1.00 },
  },

  // -----------------------------------------------------------------------
  // DETAILED SCOPES — every item is material + labour, shown line by line.
  // qtyFactor is the quantity per m² of floor area (or absolute for forfait).
  // -----------------------------------------------------------------------
  scopes: {
    structural: {
      label: 'Travaux de structure',
      items: [
        { id: 'excavation',    label: 'Terrassement et fouilles',              unit: 'm³',  qtyFactor: 0.35, material: 15,  labour: 35,  note: 'Fouilles en rigoles, évacuation des terres.' },
        { id: 'foundations',   label: 'Fondations (semelles + longrines)',      unit: 'm³',  qtyFactor: 0.08, material: 550, labour: 150, note: 'Béton armé 350 kg/m³, acier FeE500.' },
        { id: 'columns_beams', label: 'Poteaux et poutres',                    unit: 'm³',  qtyFactor: 0.06, material: 650, labour: 180, note: 'Coffrage, ferraillage, coulage.' },
        { id: 'slabs',         label: 'Dalles pleines / corps creux',          unit: 'm²',  qtyFactor: 1.00, material: 150, labour: 50,  note: 'Dalle 20–25 cm, hourdis ou pleine.' },
      ],
    },

    masonry: {
      label: 'Maçonnerie',
      items: [
        { id: 'walls_ext', label: 'Murs extérieurs (parpaing 20)', unit: 'm²', qtyFactor: 0.65, material: 25, labour: 25, note: 'Parpaing 20×20×40, hourdis et raidisseurs.' },
        { id: 'walls_int', label: 'Cloisons intérieures (brique 10)', unit: 'm²', qtyFactor: 0.55, material: 18, labour: 20, note: 'Brique creuse 30×15×15 ou parpaing de 10.' },
        { id: 'lintels',   label: 'Linteaux et chaînages', unit: 'ml', qtyFactor: 0.12, material: 40, labour: 30, note: 'Béton armé au-dessus des ouvertures.' },
      ],
    },

    roofing: {
      label: 'Toiture',
      items: [
        { id: 'roof_slab',      label: 'Dalle de toiture',            unit: 'm²', qtyFactor: 1.00, material: 150, labour: 50, note: 'Dalle béton avec pente.' },
        { id: 'waterproofing',  label: 'Étanchéité multicouche',      unit: 'm²', qtyFactor: 1.00, material: 35,  labour: 25, note: 'Membrane bitumineuse + relevés.' },
        { id: 'insulation',     label: 'Isolation thermique toiture', unit: 'm²', qtyFactor: 1.00, material: 25,  labour: 12, note: 'Polystyrène extrudé 6 cm + protection.' },
      ],
    },

    electrical: {
      label: 'Électricité',
      items: [
        { id: 'elec_rough',   label: 'Installation encastrée (gaines, câbles)', unit: 'm²', qtyFactor: 1.00, material: 30,  labour: 25, note: 'Câbles 1,5/2,5 mm², gaines ICTA.' },
        { id: 'elec_board',   label: 'Tableau électrique & protections',         unit: 'forfait', qtyFactor: 1, material: 600, labour: 250, note: 'Tableau 2 rangées, disjoncteurs différentiels.' },
        { id: 'elec_fixtures', label: 'Appareillage (prises, interrupteurs)',    unit: 'm²', qtyFactor: 1.00, material: 15,  labour: 10, note: '1 point par 6 m², gamme standard.' },
      ],
    },

    plumbing: {
      label: 'Plomberie',
      items: [
        { id: 'plumb_rough',   label: 'Réseaux d’eau (alimentation + évacuation)', unit: 'm²', qtyFactor: 1.00, material: 25,  labour: 22, note: 'Multicouche + PVC, nourrices.' },
        { id: 'plumb_fixtures', label: 'Sanitaires & robinetterie',                 unit: 'forfait', qtyFactor: 1, material: 1800, labour: 400, note: '2 SDB + cuisine, gamme moyenne.' },
        { id: 'plumb_heater',   label: 'Chauffe-eau & raccordements',               unit: 'u', qtyFactor: 1, material: 700, labour: 150, note: 'Chauffe-eau 100 L, pose.' },
      ],
    },

    interiorFinishing: {
      label: 'Finitions intérieures',
      items: [
        { id: 'tiling_floor', label: 'Carrelage sol (fourniture + pose)', unit: 'm²', qtyFactor: 0.90, material: 45, labour: 35, note: 'Grès cérame 60×60, plinthes comprises.' },
        { id: 'tiling_wall',  label: 'Faïence murale (SDB + cuisine)',    unit: 'm²', qtyFactor: 0.25, material: 25, labour: 30, note: 'Faïence 25×40, pose à la colle.' },
        { id: 'painting_int', label: 'Peinture intérieure',               unit: 'm²', qtyFactor: 2.50, material: 8,  labour: 14, note: 'Enduit, sous-couche, acrylique mate.' },
        { id: 'ceilings',     label: 'Faux plafonds & corniches',         unit: 'm²', qtyFactor: 0.40, material: 25, labour: 22, note: 'BA13 sur ossature.' },
        { id: 'doors_int',    label: 'Portes intérieures',                unit: 'u',  qtyFactor: 0.04, material: 400, labour: 120, note: 'Porte isoplane, huisserie, quincaillerie.' },
      ],
    },

    exteriorFinishing: {
      label: 'Finitions extérieures',
      items: [
        { id: 'facade_render', label: 'Enduit extérieur',                      unit: 'm²', qtyFactor: 0.80, material: 12,  labour: 18, note: 'Enduit ciment/chaux, finition grattée.' },
        { id: 'facade_paint',  label: 'Peinture façade',                       unit: 'm²', qtyFactor: 0.80, material: 10,  labour: 12, note: 'Acrylique extérieur, 2 couches.' },
        { id: 'windows_alu',   label: 'Menuiserie aluminium (fenêtres + baies)', unit: 'm²', qtyFactor: 0.22, material: 250, labour: 80, note: 'Profilé Alusystem, vitrage 4/6/4.' },
        { id: 'entry_door',    label: 'Porte d’entrée',                         unit: 'u',  qtyFactor: 1,    material: 1200, labour: 200, note: 'Porte blindée ou bois massif.' },
      ],
    },
  },

  floors: { perExtraFloor: 0.04 },

  // Reduced overhead, profit and contingency to stay competitive.
  siteOverhead: 0.06,       // 6 % — transport, equipment, supervision
  profitMargin: 0.12,       // 12 % — healthy net margin, shown explicitly
  contingency: 0.06,        // 6 % — steel/cement volatility

  range: { lowerPct: 0.08, upperPct: 0.12, roundTo: 100 },

  extras: {
    siteSetup:    { type: 'percent', value: 0.02, label: 'Installation de chantier (clôture, baraque, eau/élec)' },
    studies:      { type: 'fixed',   value: 2500, label: 'Plans d’exécution & études techniques' },
    wasteRemoval: { type: 'percent', value: 0.015, label: 'Évacuation des déblais et déchets' },
    architect:    { type: 'percent', value: 0.07, label: 'Honoraires architecte (7 %)' },
  },

  // OIT minimum: 3 % of works + fixed fee (400–1500 TND).
  engineering: {
    studyPercent: 0.03,
    fixedFeeMin: 400,
    fixedFeeMax: 1500,
    note: 'Honoraires d’ingénierie selon barème OIT.',
  },

  legalCosts: [
    { label: 'Permis de construire', min: 3000, max: 10000 },
    { label: 'Raccordements eau / électricité', min: 3300, max: 17000 },
    { label: 'TVA (19 %) sur les travaux' },
  ],
};
