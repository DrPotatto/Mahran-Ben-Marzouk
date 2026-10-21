// Verifies that every relative ("./x", "../x") and alias ("@/x") import in the project points to an
// existing file. Run: node scripts/check-imports.mjs   (also part of `npm test`)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['node_modules', '.next', '.git']);
const EXT = ['', '.js', '.jsx', '.mjs', '.json', '.css', '/index.js', '/index.jsx'];
const problems = [];
let fileCount = 0;
let importCount = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(jsx?|mjs)$/.test(entry.name)) check(full);
  }
}

function resolves(base) {
  return EXT.some((e) => {
    const candidate = base + e;
    return fs.existsSync(candidate) && fs.statSync(candidate).isFile();
  });
}

function check(file) {
  fileCount += 1;
  const src = fs.readFileSync(file, 'utf8');
  const re = /(?:import\s+(?:[^'"()]*?\s+from\s+)?|import\(\s*|export\s+[^'"]*?\s+from\s+|require\(\s*)['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(src))) {
    const spec = m[1];
    let target = null;
    if (spec.startsWith('.')) target = path.resolve(path.dirname(file), spec);
    else if (spec.startsWith('@/')) target = path.resolve(root, spec.slice(2));
    if (!target) continue;
    importCount += 1;
    if (!resolves(target)) problems.push(`${path.relative(root, file)}: cannot resolve "${spec}"`);
  }
}

walk(root);

if (problems.length) {
  console.error(`Import check FAILED (${problems.length}):`);
  problems.forEach((p) => console.error('  - ' + p));
  process.exit(1);
}
console.log(`Import check passed: ${importCount} local imports in ${fileCount} files all resolve.`);
