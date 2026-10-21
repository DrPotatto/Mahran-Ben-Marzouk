// ---------------------------------------------------------------------------
// 7DCONSTRUCTION — TRANSPARENT & PROFITABLE ESTIMATOR CONFIGURATION
// ---------------------------------------------------------------------------
// All prices are in TND, based on 2025/2026 Tunisian market data.
// Sources: BMP.tn (material prices), GMS Company (waterproofing), ICONIK
// Architecture (renovation), Alusystem (aluminium), and local trade rates.
//
// PHILOSOPHY:
//   • Every line item is split into MATERIAL + LABOUR (so the client sees
//     exactly where the money goes).
//   • A site-overhead coefficient covers transport, equipment, supervision
//     and insurance.
//   • A company-profit coefficient guarantees Mahran a healthy net margin.
//   • A contingency line protects against price variations (steel, cement).
//
// MODES:
//   demo      → prices shown with a "demonstration rates" banner.
//   verified  → use this after Mahran has personally validated every rate.
//   disabled  → no numbers at all; only the scope summary and contact form.
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

  // -----------------------------------------------------------------------
  // 1. PROJECT TYPE — base structure rate per m² of floor area
  // -----------------------------------------------------------------------
  // These base rates cover foundations, columns, beams and slabs (the
  // "skeleton"). They are the starting point; detailed lots are added below.
  categories: {
    new:        { baseRate: 780,  label: 'Construction neuve' },
    shell:      { baseRate: 520,  label: 'Gros œuvre seul' },
    renovation: { baseRate: 450,  label: 'Rénovation' },
    finishing:  { baseRate: 380,  label: 'Finitions seules' },
    extension:  { baseRate: 720,  label: 'Extension' },
    other:      { baseRate: 650,  label: 'Autre projet' },
  },

  // -----------------------------------------------------------------------
  // 2. DETAILED LOTS — each lot is a toggleable "scope" the client can pick
  // -----------------------------------------------------------------------
  // Each lot contains sub-items. Every sub-item has:
  //   unit      : 'm²', 'm³', 'u', 'ml', 'forfait'
  //   qtyFactor : multiplier of the project area (for m²), or absolute qty
  //   material  : material cost per unit (TND)
  //   labour    : labour cost per unit (TND)
  //   note      : human-readable explanation shown in the quote
  //
  // The client sees material + labour = unit price, then quantity × unit price.
  // -----------------------------------------------------------------------
  scopes: {
    // ----- GROS ŒUVRE -----
    structural: {
      label: 'Structure & béton armé',
      items: [
        {
          id: 'excavation',
          label: 'Terrassement et fouilles',
          unit: 'm³',
          qtyFactor: 0.35,          // ~0.35 m³ per m² of floor area
          material: 18,              // sand/gravel bedding
          labour: 35,                // excavation + compaction
          note: 'Fouilles en rigoles et massifs, évacuation des terres.',
        },
        {
          id: 'foundations',
          label: 'Fondations (semelles + longrines)',
          unit: 'm³',
          qtyFactor: 0.08,          // ~0.08 m³ of concrete per m²
          material: 280,             // ready-mix concrete + steel
          labour: 120,              // formwork + pouring
          note: 'Béton armé dosé à 350 kg/m³, acier HA FeE500.',
        },
        {
          id: 'columns_beams',
          label: 'Poteaux et poutres',
          unit: 'm³',
          qtyFactor: 0.06,
          material: 320,
          labour: 150,
          note: 'Coffrage, ferraillage et coulage selon plans de structure.',
        },
        {
          id: 'slabs',
          label: 'Dalles pleines / corps creux',
          unit: 'm²',
          qtyFactor: 1.0,
          material: 95,
          labour: 55,
          note: 'Dalle hourdis ou pleine, épaisseur 20–25 cm.',
        },
      ],
    },

    // ----- MAÇONNERIE -----
    masonry: {
      label: 'Maçonnerie & cloisons',
      items: [
        {
          id: 'walls_ext',
          label: 'Murs extérieurs (parpaing 20)',
          unit: 'm²',
          qtyFactor: 0.65,          // ~0.65 m² of wall per m² of floor
          material: 28,              // parpaing + mortar
          labour: 22,                // mason + helper
          note: 'Parpaing creux 20×20×40, hourdis et raidisseurs.',
        },
        {
          id: 'walls_int',
          label: 'Cloisons intérieures (brique 10)',
          unit: 'm²',
          qtyFactor: 0.55,
          material: 18,
          labour: 18,
          note: 'Brique creuse 30×15×15 ou parpaing de 10.',
        },
        {
          id: 'lintels',
          label: 'Linteaux et chaînages',
          unit: 'ml',
          qtyFactor: 0.12,          // linear metres per m²
          material: 45,
          labour: 30,
          note: 'Béton armé coulé en place au-dessus des ouvertures.',
        },
      ],
    },

    // ----- TOITURE & ÉTANCHÉITÉ -----
    roofing: {
      label: 'Toiture & étanchéité',
      items: [
        {
          id: 'roof_slab',
          label: 'Dalle de toiture',
          unit: 'm²',
          qtyFactor: 1.0,
          material: 90,
          labour: 50,
          note: 'Dalle béton avec pente, si toiture-terrasse.',
        },
        {
          id: 'waterproofing',
          label: 'Étanchéité multicouche',
          unit: 'm²',
          qtyFactor: 1.0,
          material: 32,
          labour: 22,
          note: 'Membrane bitumineuse bicouche + relevés (40–60 TND/m² marché).',
        },
        {
          id: 'insulation',
          label: 'Isolation thermique toiture',
          unit: 'm²',
          qtyFactor: 1.0,
          material: 28,
          labour: 12,
          note: 'Polystyrène extrudé 6 cm + protection lourde.',
        },
      ],
    },

    // ----- ÉLECTRICITÉ -----
    electrical: {
      label: 'Électricité',
      items: [
        {
          id: 'elec_rough',
          label: 'Installation encastrée (gaines, câbles, boîtes)',
          unit: 'm²',
          qtyFactor: 1.0,
          material: 35,
          labour: 25,
          note: 'Câbles 1,5/2,5 mm², gaines ICTA, boîtes d’encastrement.',
        },
        {
          id: 'elec_board',
          label: 'Tableau électrique & protections',
          unit: 'forfait',
          qtyFactor: 1,              // one board per project
          material: 650,             // Schneider or equivalent
          labour: 250,
          note: 'Tableau 2 rangées, disjoncteurs différentiels, norme NT.',
        },
        {
          id: 'elec_fixtures',
          label: 'Appareillage (prises, interrupteurs, points lumineux)',
          unit: 'm²',
          qtyFactor: 1.0,
          material: 18,
          labour: 10,
          note: 'En moyenne 1 point par 6 m², gamme standard.',
        },
      ],
    },

    // ----- PLOMBERIE -----
    plumbing: {
      label: 'Plomberie & sanitaires',
      items: [
        {
          id: 'plumb_rough',
          label: 'Réseaux d’eau (alimentation + évacuation)',
          unit: 'm²',
          qtyFactor: 1.0,
          material: 28,              // PEX-AL-PEX + PVC
          labour: 22,
          note: 'Tuyaux multicouche, évacuations PVC, nourrices.',
        },
        {
          id: 'plumb_fixtures',
          label: 'Sanitaires & robinetterie',
          unit: 'forfait',
          qtyFactor: 1,
          material: 1800,            // 2 SDB + cuisine, gamme moyenne
          labour: 450,
          note: 'Receveurs, WC, lavabos, mitigeurs (hors meubles).',
        },
        {
          id: 'plumb_heater',
          label: 'Chauffe-eau & raccordements',
          unit: 'u',
          qtyFactor: 1,
          material: 750,
          labour: 150,
          note: 'Chauffe-eau électrique 100 L, pose et raccordement.',
        },
      ],
    },

    // ----- FINITIONS INTÉRIEURES -----
    interiorFinishing: {
      label: 'Finitions intérieures',
      items: [
        {
          id: 'tiling_floor',
          label: 'Carrelage sol (fourniture + pose)',
          unit: 'm²',
          qtyFactor: 0.9,
          material: 45,              // grès cérame moyen gamme
          labour: 35,                // pose + colle + joints
          note: 'Grès cérame 60×60, pose droite, plinthes comprises.',
        },
        {
          id: 'tiling_wall',
          label: 'Faïence murale (SDB + cuisine)',
          unit: 'm²',
          qtyFactor: 0.25,
          material: 25,
          labour: 30,
          note: 'Faïence locale 25×40, pose à la colle.',
        },
        {
          id: 'painting_int',
          label: 'Peinture intérieure (enduit + 2 couches)',
          unit: 'm²',
          qtyFactor: 2.5,            // wall + ceiling surface per m² floor
          material: 8,
          labour: 14,
          note: 'Enduit de lissage, sous-couche, acrylique mate.',
        },
        {
          id: 'ceilings',
          label: 'Faux plafonds & corniches',
          unit: 'm²',
          qtyFactor: 0.4,
          material: 28,
          labour: 25,
          note: 'Plaque BA13 sur ossature, bandes et enduit.',
        },
        {
          id: 'doors_int',
          label: 'Portes intérieures',
          unit: 'u',
          qtyFactor: 0.04,           // ~4 doors per 100 m²
          material: 380,
          labour: 120,
          note: 'Porte isoplane, huisserie bois, quincaillerie.',
        },
      ],
    },

    // ----- FINITIONS EXTÉRIEURES -----
    exteriorFinishing: {
      label: 'Finitions extérieures',
      items: [
        {
          id: 'facade_render',
          label: 'Enduit extérieur (monocouche ou bicouche)',
          unit: 'm²',
          qtyFactor: 0.8,
          material: 12,
          labour: 18,
          note: 'Enduit ciment/chaux, finition grattée ou talochée.',
        },
        {
          id: 'facade_paint',
          label: 'Peinture façade (acrylique extérieur)',
          unit: 'm²',
          qtyFactor: 0.8,
          material: 9,
          labour: 12,
          note: 'Peinture résistante aux intempéries, 2 couches.',
        },
        {
          id: 'windows_alu',
          label: 'Menuiserie aluminium (fenêtres + baies)',
          unit: 'm²',
          qtyFactor: 0.22,           // window area per m² of floor
          material: 280,             // profile + glass + hardware
          labour: 80,                // fabrication + pose
          note: 'Profilé Alusystem, vitrage 4/6/4, hors RPT.',
        },
        {
          id: 'entry_door',
          label: 'Porte d’entrée',
          unit: 'u',
          qtyFactor: 1,
          material: 1200,
          labour: 200,
          note: 'Porte blindée ou bois massif, serrure 3 points.',
        },
      ],
    },
  },

  // -----------------------------------------------------------------------
  // 3. FLOOR MULTIPLIER — extra cost per additional storey
  // -----------------------------------------------------------------------
  floors: { perExtraFloor: 0.04 },   // +4 % per extra floor (scaffolding, lifting)

  // -----------------------------------------------------------------------
  // 4. SITE OVERHEAD — covers transport, equipment, supervision, insurance
  // -----------------------------------------------------------------------
  // 8 % is realistic for a small-to-medium Tunisian contractor.
  siteOverhead: 0.08,

  // -----------------------------------------------------------------------
  // 5. COMPANY PROFIT — Mahran’s net margin (after overhead and contingency)
  // -----------------------------------------------------------------------
  // 20 % is a healthy but competitive margin for a specialised BTP company.
  // It is shown explicitly to the client as "frais de gestion et bénéfice".
  profitMargin: 0.20,

  // -----------------------------------------------------------------------
  // 6. CONTINGENCY — protection against material price variations
  // -----------------------------------------------------------------------
  // 8 % is prudent given steel/cement volatility in Tunisia.
  contingency: 0.08,

  // -----------------------------------------------------------------------
  // 7. INDICATIVE RANGE — shown around the final total
  // -----------------------------------------------------------------------
  range: { lowerPct: 0.10, upperPct: 0.15, roundTo: 100 },

  // -----------------------------------------------------------------------
  // 8. FIXED EXTRAS (optional, ticked by the client)
  // -----------------------------------------------------------------------
  extras: {
    siteSetup: {
      type: 'percent',
      value: 0.02,
      label: 'Installation de chantier (clôture, baraque, eau/élec)',
    },
    studies: {
      type: 'fixed',
      value: 3500,
      label: 'Plans d’exécution & études techniques',
    },
    wasteRemoval: {
      type: 'percent',
      value: 0.015,
      label: 'Évacuation des déblais et déchets',
    },
    architect: {
      type: 'percent',
      value: 0.08,
      label: 'Honoraires architecte (si applicable — 5 à 12 %)',
    },
  },

  // -----------------------------------------------------------------------
  // 9. LEGAL / ADMIN COSTS (always shown, never included in the total)
  // -----------------------------------------------------------------------
  // These are paid by the client directly; the estimator just lists them.
  legalCosts: [
    { label: 'Permis de construire', min: 3000, max: 10000, unit: 'TND' },
    { label: 'Raccordements eau / électricité', min: 3300, max: 17000, unit: 'TND' },
    { label: 'TVA (19 %) sur les travaux', note: 'Appliquée au total HT' },
  ],
};
