import fr from './fr.js';
import ar from './ar.js';
import en from './en.js';

export const DEFAULT_LANG = 'fr';
export const LANGS = ['fr', 'ar', 'en'];
export const RTL_LANGS = ['ar'];

export const dictionaries = { fr, ar, en };

/** Resolve "a.b.c" in a dictionary; returns undefined if missing. */
export function lookup(dict, path) {
  return path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), dict);
}

/** Replace {name} placeholders. */
export function interpolate(template, params) {
  if (typeof template !== 'string' || !params) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => (params[k] !== undefined ? String(params[k]) : `{${k}}`));
}

/** Translate with fallback to French, then to the key itself (visible in dev). */
export function translate(lang, key, params) {
  const value = lookup(dictionaries[lang], key) ?? lookup(dictionaries[DEFAULT_LANG], key);
  if (value === undefined) return key;
  return typeof value === 'string' ? interpolate(value, params) : value;
}
