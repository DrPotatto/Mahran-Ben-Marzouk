// ---------------------------------------------------------------------------
// 7DCONSTRUCTION — MARKET-CALIBRATED ESTIMATOR (TUNISIA 2025/2026)
// ---------------------------------------------------------------------------
// All prices in TND. Sources: BMP.tn, ICONIK Architecture, OIT (Ordre des
// Ingénieurs Tunisiens), and local market surveys.
//
// STRATEGY:
//   1. Base rates are set at the COMPETITIVE LOWER END of the "standard
//      quality" market segment to attract clients immediately.
//   2. Detailed material & labour lines build TRUST by showing every cost.
//   3. Transparent overhead (8%) and profit (18%) margins guarantee a healthy
//      net profit for Mahran while remaining defensible to the client.
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
  // 1. PROJECT TYPE — Base structure rate (competitive entry point)
  // -----------------------------------------------------------------------
  // Market reference: Structural shell alone is 450-650 TND/m². We set the
  // "new construction" base at 620 TND/m² — attractive, yet profitable.
  categories: {
    new:        { baseRate: 620,  label: 'Construction neuve' },   // ~450-650 market
    shell:      { baseRate: 480,  label: 'Gros œuvre seul' },      // lean shell work
    renovation: { baseRate: 400,  label: 'Rénovation' },           // no foundations
    finishing:  { baseRate: 350,  label: 'Finitions seules' },     // only finishing
    extension:  { baseRate: 580,  label: 'Extension' },            // partial structure
    other:      { baseRate: 550,  label: 'Autre projet' },
  },

  // -----------------------------------------------------------------------
  // 2. DETAILED LOTS — Every material and labour rate is market-sourced
  // -----------------------------------------------------------------------
  scopes: {
    // ----- GROS ŒUVRE (Structure) -----
    structural: {
      label: 'Structure & béton armé',
      items: [
        {
          id: 'excavation',
          label: 'Terrassement et fouilles',
          unit: 'm³',
          qtyFactor: 0.35,
          material: 20,   // sand/gravel bedding (market: 30-45 TND/m³ for aggregate)
          labour: 40,     // excavation & compaction
          note: 'Fouilles en rigoles et massifs, évacuation des terres.',
        },
        {
          id: 'foundations',
          label: 'Fondations (semelles + longrines)',
          unit: 'm³',
          qtyFactor: 0.08,
          material: 300,  // ready-mix concrete + steel (cement ~30 TND/sac, steel ~4200 TND/t)
          labour: 130,    // formwork + pouring
          note: 'Béton armé dosé à 350 kg/m³, acier HA FeE500.',
        },
        {
          id: 'columns_beams',
          label: 'Poteaux et poutres',
          unit: 'm³',
          qtyFactor: 0.06,
          material: 340,
          labour: 160,
          note: 'Coffrage, ferraillage et coulage selon plans de structure.',
        },
        {
          id: 'slabs',
          label: 'Dalles pleines / corps creux',
          unit: 'm²',
          qtyFactor: 1.0,
          material: 110,  // concrete + steel + hourdis (market: 15-40 TND/m² for ceramic, but structural slab is higher)
          labour: 60,
          note: 'Dalle hourdis ou pleine, épaisseur 20–25 cm.',
        },
      ],
    },

    // ----- MAÇONNERIE (Masonry) -----
    masonry: {
      label: 'Maçonnerie & cloisons',
      items: [
        {
          id: 'walls_ext',
          label: 'Murs extérieurs (parpaing 20)',
          unit: 'm²',
          qtyFactor: 0.65,
          material: 32,   // parpaing (1.2-1.8 TND/unit) + mortar
          labour: 28,     // mason + helper
          note: 'Parpaing creux 20×20×40, hourdis et raidisseurs.',
        },
        {
          id: 'walls_int',
          label: 'Cloisons intérieures (brique 10)',
          unit: 'm²',
          qtyFactor: 0.55,
          material: 22,   // brique creuse (1.5-2.2 TND/unit)
          labour: 22,
          note: 'Brique creuse 30×15×15 ou parpaing de 10.',
        },
        {
          id: 'lintels',
          label: 'Linteaux et chaînages',
          unit: 'ml',
          qtyFactor: 0.12,
          material: 50,
          labour: 35,
          note: 'Béton armé coulé en place au-dessus des ouvertures.',
        },
      ],
    },

    // ----- TOITURE & ÉTANCHÉITÉ (Roofing) -----
    roofing: {
      label: 'Toiture & étanchéité',
      items: [
        {
          id: 'roof_slab',
          label: 'Dalle de toiture',
          unit: 'm²',
          qtyFactor: 1.0,
          material: 105,
          labour: 55,
          note: 'Dalle béton avec pente, si toiture-terrasse.',
        },
        {
          id: 'waterproofing',
          label: 'Étanchéité multicouche',
          unit: 'm²',
          qtyFactor: 1.0,
          material: 38,   // membrane bitumineuse (market: 22-90 TND/m²)
          labour: 25,
          note: 'Membrane bitumineuse bicouche + relevés.',
        },
        {
          id: 'insulation',
          label: 'Isolation thermique toiture',
          unit: 'm²',
          qtyFactor: 1.0,
          material: 32,
          labour: 15,
          note: 'Polystyrène extrudé 6 cm + protection lourde.',
        },
      ],
    },

    // ----- ÉLECTRICITÉ (Electrical) -----
    electrical: {
      label: 'Électricité',
      items: [
        {
          id: 'elec_rough',
          label: 'Installation encastrée (gaines, câbles, boîtes)',
          unit: 'm²',
          qtyFactor: 1.0,
          material: 38,
          labour: 28,
          note: 'Câbles 1,5/2,5 mm², gaines ICTA, boîtes d’encastrement.',
        },
        {
          id: 'elec_board',
          label: 'Tableau électrique & protections',
          unit: 'forfait',
          qtyFactor: 1,
          material: 700,   // Schneider or equivalent (market: 6,000-8,000 TND for full electrical)
          labour: 280,
          note: 'Tableau 2 rangées, disjoncteurs différentiels, norme NT.',
        },
        {
          id: 'elec_fixtures',
          label: 'Appareillage (prises, interrupteurs, points lumineux)',
          unit: 'm²',
          qtyFactor: 1.0,
          material: 22,
          labour: 12,
          note: 'En moyenne 1 point par 6 m², gamme standard.',
        },
      ],
    },

    // ----- PLOMBERIE (Plumbing) -----
    plumbing: {
      label: 'Plomberie & sanitaires',
      items: [
        {
          id: 'plumb_rough',
          label: 'Réseaux d’eau (alimentation + évacuation)',
          unit: 'm²',
          qtyFactor: 1.0,
          material: 32,   // PEX-AL-PEX + PVC
          labour: 25,
          note: 'Tuyaux multicouche, évacuations PVC, nourrices.',
        },
        {
          id: 'plumb_fixtures',
          label: 'Sanitaires & robinetterie',
          unit: 'forfait',
          qtyFactor: 1,
          material: 2000,  // 2 SDB + cuisine, mid-range
          labour: 500,
          note: 'Receveurs, WC, lavabos, mitigeurs (hors meubles).',
        },
        {
          id: 'plumb_heater',
          label: 'Chauffe-eau & raccordements',
          unit: 'u',
          qtyFactor: 1,
          material: 800,
          labour: 180,
          note: 'Chauffe-eau électrique 100 L, pose et raccordement.',
        },
      ],
    },

    // ----- FINITIONS INTÉRIEURES (Interior Finishing) -----
    interiorFinishing: {
      label: 'Finitions intérieures',
      items: [
        {
          id: 'tiling_floor',
          label: 'Carrelage sol (fourniture + pose)',
          unit: 'm²',
          qtyFactor: 0.9,
          material: 55,   // grès cérame 60x60 (market: 35-90 TND/m²)
          labour: 40,     // pose + colle + joints
          note: 'Grès cérame 60×60, pose droite, plinthes comprises.',
        },
        {
          id: 'tiling_wall',
          label: 'Faïence murale (SDB + cuisine)',
          unit: 'm²',
          qtyFactor: 0.25,
          material: 30,
          labour: 35,
          note: 'Faïence locale 25×40, pose à la colle.',
        },
        {
          id: 'painting_int',
          label: 'Peinture intérieure (enduit + 2 couches)',
          unit: 'm²',
          qtyFactor: 2.5,
          material: 10,
          labour: 16,
          note: 'Enduit de lissage, sous-couche, acrylique mate.',
        },
        {
          id: 'ceilings',
          label: 'Faux plafonds & corniches',
          unit: 'm²',
          qtyFactor: 0.4,
          material: 32,
          labour: 28,
          note: 'Plaque BA13 sur ossature, bandes et enduit.',
        },
        {
          id: 'doors_int',
          label: 'Portes intérieures',
          unit: 'u',
          qtyFactor: 0.04,
          material: 420,
          labour: 140,
          note: 'Porte isoplane, huisserie bois, quincaillerie.',
        },
      ],
    },

    // ----- FINITIONS EXTÉRIEURES (Exterior Finishing) -----
    exteriorFinishing: {
      label: 'Finitions extérieures',
      items: [
        {
          id: 'facade_render',
          label: 'Enduit extérieur (monocouche ou bicouche)',
          unit: 'm²',
          qtyFactor: 0.8,
          material: 15,
          labour: 20,
          note: 'Enduit ciment/chaux, finition grattée ou talochée.',
        },
        {
          id: 'facade_paint',
          label: 'Peinture façade (acrylique extérieur)',
          unit: 'm²',
          qtyFactor: 0.8,
          material: 12,
          labour: 15,
          note: 'Peinture résistante aux intempéries, 2 couches.',
        },
        {
          id: 'windows_alu',
          label: 'Menuiserie aluminium (fenêtres + baies)',
          unit: 'm²',
          qtyFactor: 0.22,
          material: 320,   // profile + glass (market: 350-550 TND per standard window ~1.44 m² => ~240-380 TND/m²)
          labour: 90,      // fabrication + pose
          note: 'Profilé Alusystem, vitrage 4/6/4, hors RPT.',
        },
        {
          id: 'entry_door',
          label: 'Porte d’entrée',
          unit: 'u',
          qtyFactor: 1,
          material: 1400,
          labour: 250,
          note: 'Porte blindée ou bois massif, serrure 3 points.',
        },
      ],
    },
  },

  // -----------------------------------------------------------------------
  // 3. FLOOR MULTIPLIER (Extra cost per additional storey)
  // -----------------------------------------------------------------------
  floors: { perExtraFloor: 0.04 },

  // -----------------------------------------------------------------------
  // 4. SITE OVERHEAD (8% — transport, equipment, supervision, insurance)
  // -----------------------------------------------------------------------
  siteOverhead: 0.08,

  // -----------------------------------------------------------------------
  // 5. COMPANY PROFIT (18% — healthy, transparent, defensible net margin)
  // -----------------------------------------------------------------------
  profitMargin: 0.18,

  // -----------------------------------------------------------------------
  // 6. CONTINGENCY (8% — steel/cement price volatility protection)
  // -----------------------------------------------------------------------
  contingency: 0.08,

  // -----------------------------------------------------------------------
  // 7. INDICATIVE RANGE
  // -----------------------------------------------------------------------
  range: { lowerPct: 0.10, upperPct: 0.15, roundTo: 100 },

  // -----------------------------------------------------------------------
  // 8. OPTIONAL EXTRAS (Ticked by client)
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
      value: 0.08,   // Market: 5-10% of total construction cost
      label: 'Honoraires architecte (5 à 12 %)',
    },
  },

  // -----------------------------------------------------------------------
  // 9. ENGINEERING FEES (OIT regulated minimum: 3% of works + fixed fee)
  // -----------------------------------------------------------------------
  // Source: Ordre des Ingénieurs Tunisiens (OIT) — minimum tariff.
  engineering: {
    studyPercent: 0.03,       // 3% of total works cost
    fixedFeeMin: 400,         // Fixed fee range (400-1500 TND depending on project)
    fixedFeeMax: 1500,
    supervisionPerDay: 400,   // TND per day for site supervision
    note: 'Honoraires d’ingénierie (études + suivi) selon barème OIT.',
  },

  // -----------------------------------------------------------------------
  // 10. LEGAL / ADMIN COSTS (Shown for transparency, paid by client)
  // -----------------------------------------------------------------------
  legalCosts: [
    { label: 'Permis de construire', min: 3000, max: 10000, unit: 'TND' },
    { label: 'Raccordements eau / électricité', min: 3300, max: 17000, unit: 'TND' },
    { label: 'TVA (19 %) sur les travaux', note: 'Appliquée au total HT' },
  ],
};
