// Verifies that fr.js, en.js and ar.js expose exactly the same keys (and array lengths),
// that placeholders match, and that no value is empty.  Run: npm test
import fr from '../locales/fr.js';
import en from '../locales/en.js';
import ar from '../locales/ar.js';

const problems = [];

function walk(node, path = '') {
  const out = new Map();
  if (Array.isArray(node)) {
    out.set(path, `array:${node.length}`);
    node.forEach((v, i) => {
      for (const [k, val] of walk(v, `${path}[${i}]`)) out.set(k, val);
    });
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      for (const [kk, val] of walk(v, path ? `${path}.${k}` : k)) out.set(kk, val);
    }
  } else {
    out.set(path, node);
  }
  return out;
}

const placeholders = (s) => (typeof s === 'string' ? [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',') : '');
const maps = { fr: walk(fr), en: walk(en), ar: walk(ar) };

for (const lang of ['en', 'ar']) {
  for (const key of maps.fr.keys()) {
    if (!maps[lang].has(key)) problems.push(`[${lang}] missing key: ${key}`);
    else {
      const a = maps.fr.get(key);
      const b = maps[lang].get(key);
      if (typeof a === 'string' && typeof b === 'string' && placeholders(a) !== placeholders(b)) {
        problems.push(`[${lang}] placeholder mismatch at ${key}: fr{${placeholders(a)}} vs ${lang}{${placeholders(b)}}`);
      }
      if (typeof a === 'string' && a.startsWith('array:') && a !== b) problems.push(`[${lang}] array length mismatch at ${key}`);
    }
  }
  for (const key of maps[lang].keys()) if (!maps.fr.has(key)) problems.push(`[${lang}] extra key not in fr: ${key}`);
}
for (const [lang, m] of Object.entries(maps)) {
  for (const [key, val] of m) {
    if (typeof val === 'string' && !val.startsWith('array:') && val.trim() === '') problems.push(`[${lang}] empty value: ${key}`);
  }
}

if (problems.length) {
  console.error(`Locale check FAILED (${problems.length}):`);
  problems.forEach((p) => console.error('  - ' + p));
  process.exit(1);
}
console.log(`Locale check passed: ${maps.fr.size} entries identical across fr / en / ar.`);
