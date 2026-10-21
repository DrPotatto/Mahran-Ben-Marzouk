// ---------------------------------------------------------------------------
// PROJECT DATA — the only file you need to edit to publish real projects.
// ---------------------------------------------------------------------------
// The five entries below are CONCEPTUAL DEMONSTRATIONS built from procedural 3D models.
// They are flagged `conceptual: true` and are displayed with an "illustrative concept" badge.
// Delete them (or leave them) once you add genuine projects.
//
// To add a real project, append an object like this (no component changes needed):
//
//   {
//     id: 'maison-tebourba-01',              // unique, URL-safe
//     conceptual: false,
//     categories: ['gros-oeuvre', 'beton-arme'],   // see CATEGORY_IDS
//     title: { fr: '...', ar: '...', en: '...' },  // or a plain string
//     location: 'Tebourba',                        // string or { fr, ar, en }
//     description: { fr: '...', ar: '...', en: '...' },
//     status: 'completed',                         // 'completed' | 'ongoing' | 'concept'
//     stages: [                                    // optional, in order
//       { key: 'foundations', status: 'done' },    // key: foundations|structure|masonry|envelope|finishing
//       { key: 'structure',   status: 'done' },    // status: done|inProgress|planned
//     ],
//     images: [                                    // files placed in public/images/projects/
//       { src: '/images/projects/maison-tebourba-01/1.jpg', alt: { fr: '...', ar: '...', en: '...' } },
//     ],
//     beforeAfter: {                               // optional, only with GENUINE photos
//       before: '/images/projects/maison-tebourba-01/avant.jpg',
//       after: '/images/projects/maison-tebourba-01/apres.jpg',
//     },
//     model: null,                                 // optional 3D: 'villa'|'residential'|'frame'|'commercial'
//   }
//
// Text fields accept a string or an object per language; a missing language falls back to French.
// Conceptual entries use `i18nKey` and their texts live in locales/*.js (projects.items.<i18nKey>).
// ---------------------------------------------------------------------------

export const CATEGORY_IDS = [
  'gros-oeuvre',
  'beton-arme',
  'maconnerie',
  'architecture-residentielle',
  'renovation',
  'finitions',
  'projets-commerciaux',
];

const ILLUSTRATIVE_STAGES = ['foundations', 'structure', 'masonry', 'envelope', 'finishing'].map((key) => ({
  key,
  status: 'illustrative',
}));

export const PROJECTS = [
  {
    id: 'concept-villa',
    i18nKey: 'concept-villa',
    conceptual: true,
    categories: ['architecture-residentielle', 'finitions'],
    status: 'concept',
    stages: ILLUSTRATIVE_STAGES,
    images: [],
    model: 'villa',
  },
  {
    id: 'concept-residential',
    i18nKey: 'concept-residential',
    conceptual: true,
    categories: ['gros-oeuvre', 'beton-arme', 'architecture-residentielle'],
    status: 'concept',
    stages: ILLUSTRATIVE_STAGES,
    images: [],
    model: 'residential',
  },
  {
    id: 'concept-frame',
    i18nKey: 'concept-frame',
    conceptual: true,
    categories: ['gros-oeuvre', 'beton-arme', 'maconnerie'],
    status: 'concept',
    stages: ILLUSTRATIVE_STAGES.slice(0, 3),
    images: [],
    model: 'frame',
  },
  {
    id: 'concept-commercial',
    i18nKey: 'concept-commercial',
    conceptual: true,
    categories: ['projets-commerciaux', 'finitions'],
    status: 'concept',
    stages: ILLUSTRATIVE_STAGES,
    images: [],
    model: 'commercial',
  },
  {
    id: 'concept-renovation',
    i18nKey: 'concept-renovation',
    conceptual: true,
    categories: ['renovation', 'maconnerie', 'finitions'],
    status: 'concept',
    stages: [ILLUSTRATIVE_STAGES[1], ILLUSTRATIVE_STAGES[2], ILLUSTRATIVE_STAGES[3], ILLUSTRATIVE_STAGES[4]],
    images: [],
    model: 'residential',
  },
];
