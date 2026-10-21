// Sanity checks for the procedural model data (no GPU needed).
// Run: node scripts/test-models.mjs   (requires `three`, i.e. after `npm install`)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MODEL_IDS, MODEL_FRAMING, getModelParts } from '../components/three/models.js';

const materialsSource = fs.readFileSync(fileURLToPath(new URL('../components/three/materials.js', import.meta.url)), 'utf8');
const VALID_MATERIALS = ['primary', 'concrete', 'trim', 'steel', 'wood', 'foundation', 'water', 'rebar', 'ghost', 'glass'];
const REQUIRED_GROUPS = {
  villa: ['foundation', 'wall', 'window', 'column', 'slab', 'roof'],
  residential: ['foundation', 'column', 'slab', 'wall', 'window', 'balcony', 'roof'],
  frame: ['foundation', 'column', 'beam', 'slab', 'rebar'],
  commercial: ['foundation', 'column', 'slab', 'wall', 'window', 'roof'],
};

let checks = 0;
const ok = (name) => {
  checks += 1;
  console.log(`  ok  ${name}`);
};

const finite3 = (a) => Array.isArray(a) && a.length === 3 && a.every((n) => Number.isFinite(n));

for (const id of MODEL_IDS) {
  const parts = getModelParts(id);
  assert.ok(parts.length > 10, `${id}: too few parts`);

  const ids = new Set();
  for (const p of parts) {
    assert.ok(!ids.has(p.id), `${id}: duplicate part id ${p.id}`);
    ids.add(p.id);
    assert.ok(['box', 'cyl'].includes(p.shape), `${id}/${p.id}: bad shape`);
    assert.ok(VALID_MATERIALS.includes(p.mat), `${id}/${p.id}: unknown material "${p.mat}"`);
    assert.ok(finite3(p.position) && finite3(p.scale) && finite3(p.explode), `${id}/${p.id}: non-finite vector`);
    assert.ok(p.scale.every((s) => s > 0), `${id}/${p.id}: non-positive scale`);
    // Nothing may sink below the ground plane (small tolerance).
    assert.ok(p.position[1] - p.scale[1] / 2 >= -0.05, `${id}/${p.id}: part below ground (${p.position[1] - p.scale[1] / 2})`);
  }

  const groups = new Set(parts.map((p) => p.group));
  for (const g of REQUIRED_GROUPS[id]) assert.ok(groups.has(g), `${id}: missing structural group "${g}"`);

  // The exploded view must actually move parts.
  assert.ok(parts.some((p) => p.explode.some((v) => v !== 0)), `${id}: no exploded offsets`);

  const f = MODEL_FRAMING[id];
  assert.ok(f && finite3(f.target) && f.distance > 0 && f.size > 0, `${id}: bad framing`);
  ok(`${id}: ${parts.length} parts, unique ids, valid materials, groups ${[...groups].join('/')}`);
}

for (const key of VALID_MATERIALS) assert.ok(new RegExp(`\\b${key}\\b\\s*[:(]`).test(materialsSource), `materials.js lacks "${key}"`);
ok('every material key used by the models exists in materials.js');

assert.equal(getModelParts('villa'), getModelParts('villa'), 'part lists are memoised');
assert.throws(() => getModelParts('nope'));
ok('part lists memoised; unknown model rejected');

console.log(`\n${checks} model checks passed`);
