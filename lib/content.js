// Helpers for content that may be a plain string or a { fr, ar, en } object.

/** Pick the text for `lang`, falling back to French, then to any available language. */
export function pickText(value, lang) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.fr || value.en || value.ar || '';
}

/** Title / location / description of a project (locale-driven for conceptual ones). */
export function projectText(project, field, lang, t) {
  if (project.i18nKey) return t(`projects.items.${project.i18nKey}.${field}`);
  return pickText(project[field], lang);
}
