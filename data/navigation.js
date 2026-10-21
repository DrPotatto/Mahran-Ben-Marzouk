// Navigation entries. `id` is the section anchor; `labelKey` resolves in the locale files.
// `also` lists extra section ids that should highlight the same nav link.

export const NAV_ITEMS = [
  { id: 'about', labelKey: 'nav.about' },
  { id: 'showroom', labelKey: 'nav.showroom' },
  { id: 'services', labelKey: 'nav.services' },
  { id: 'projects', labelKey: 'nav.projects' },
  { id: 'process', labelKey: 'nav.process', also: ['quality'] },
  { id: 'contact', labelKey: 'nav.contact', also: ['estimator'] },
];

/** Every section id observed for the active-link highlight (in page order). */
export const SECTION_IDS = ['hero', 'about', 'showroom', 'services', 'projects', 'process', 'quality', 'estimator', 'contact'];
