// Procedural architectural models, expressed as part lists (see modelBuilder.js).
// All dimensions are in metres; ground level is y = 0. Every part carries an `explode`
// offset so the exploded view separates the structure into readable layers.
// These are ILLUSTRATIVE concepts, not engineering models.

import { createPartList } from './modelBuilder.js';

/* ------------------------------------------------------------------ */
/* 1. Contemporary luxury villa                                        */
/* ------------------------------------------------------------------ */
function buildVilla() {
  const { parts, box, cyl } = createPartList();

  // Foundations / plinth
  box('v-found', 'foundation', 'foundation', [0, 0.25, 0], [17, 0.5, 11], { explode: [0, -3.2, 0] });

  // Ground floor volume (primary material), with a glazed living bay on the front
  box('v-gf-back', 'wall', 'primary', [-1.5, 1.95, -2.2], [12, 2.9, 6.4], { explode: [0, 0.6, -2.2] });
  box('v-gf-side', 'wall', 'primary', [-6.75, 1.95, 2.3], [1.5, 2.9, 2.6], { explode: [-2, 0.6, 1] });
  box('v-gf-glass', 'window', 'glass', [-0.5, 1.95, 3.9], [9.4, 2.7, 0.12], { explode: [0, 0.8, 4.2] });
  box('v-gf-mullion-a', 'window', 'trim', [-5.2, 1.95, 3.93], [0.1, 2.8, 0.14], { explode: [0, 0.8, 4.2] });
  box('v-gf-mullion-b', 'window', 'trim', [-0.5, 1.95, 3.93], [0.1, 2.8, 0.14], { explode: [0, 0.8, 4.2] });
  box('v-gf-mullion-c', 'window', 'trim', [4.2, 1.95, 3.93], [0.1, 2.8, 0.14], { explode: [0, 0.8, 4.2] });
  box('v-gf-end', 'wall', 'primary', [6.75, 1.95, 1.0], [1.5, 2.9, 5.6], { explode: [2, 0.6, 1] });

  // Ground-floor slab / first-floor slab
  box('v-slab-1', 'slab', 'concrete', [0, 3.5, 0.3], [16, 0.3, 9.4], { explode: [0, 2.2, 0] });

  // Upper volume: cantilevered over the terrace
  box('v-up-core', 'wall', 'primary', [2.0, 5.0, -0.8], [11, 2.7, 6.4], { explode: [0, 4.2, -2] });
  box('v-up-glass', 'window', 'glass', [2.6, 5.0, 2.45], [8.6, 2.4, 0.12], { explode: [0, 4.6, 3.8] });
  box('v-up-mullion-a', 'window', 'trim', [-1.7, 5.0, 2.5], [0.1, 2.5, 0.14], { explode: [0, 4.6, 3.8] });
  box('v-up-mullion-b', 'window', 'trim', [2.6, 5.0, 2.5], [0.1, 2.5, 0.14], { explode: [0, 4.6, 3.8] });
  box('v-up-mullion-c', 'window', 'trim', [6.9, 5.0, 2.5], [0.1, 2.5, 0.14], { explode: [0, 4.6, 3.8] });
  box('v-up-wood', 'wall', 'wood', [-4.3, 5.0, 0.9], [2.0, 2.7, 0.18], { explode: [-2.6, 4.2, 3.2] });

  // Terrace under the cantilever: slender steel columns
  box('v-col-a', 'column', 'steel', [-6.2, 1.9, 4.2], [0.22, 3.4, 0.22], { explode: [-2.2, 0.8, 3.5] });
  box('v-col-b', 'column', 'steel', [7.4, 1.9, 4.2], [0.22, 3.4, 0.22], { explode: [2.2, 0.8, 3.5] });

  // Roof slab with overhang and thin parapet
  box('v-roof', 'roof', 'concrete', [1.0, 6.5, -0.5], [13.4, 0.3, 7.4], { explode: [0, 6.6, 0] });
  box('v-parapet', 'roof', 'trim', [1.0, 6.78, 3.1], [13.4, 0.26, 0.12], { explode: [0, 6.8, 1.4] });
  box('v-solar', 'roof', 'trim', [3.0, 6.75, -1.0], [4.2, 0.1, 2.4], { rotation: [-0.12, 0, 0], explode: [0, 7.4, -0.6] });

  // Pool deck + pool
  box('v-deck', 'foundation', 'wood', [2.0, 0.04, 8.6], [13.6, 0.14, 4.4], { explode: [0, -1.8, 4.4] });
  box('v-pool', 'foundation', 'water', [1.5, 0.12, 8.7], [8.4, 0.12, 2.5], { explode: [0, -1.5, 4.8] });

  // Garden elements (cylinders = simple tree trunks) and canopies
  cyl('v-trunk-a', 'landscape', 'wood', [-11, 1.2, 4], [0.28, 2.4], { explode: [-4, -0.5, 1] });
  cyl('v-trunk-b', 'landscape', 'wood', [11.5, 1.0, 1.5], [0.24, 2.0], { explode: [4, -0.5, 1] });
  cyl('v-canopy-a', 'landscape', 'rebar', [-11, 3.3, 4], [2.6, 1.8], { explode: [-4, -0.2, 1] });
  cyl('v-canopy-b', 'landscape', 'rebar', [11.5, 2.9, 1.5], [2.2, 1.6], { explode: [4, -0.2, 1] });

  return parts;
}

/* ------------------------------------------------------------------ */
/* 2. Modern multi-storey residential building (G+4)                   */
/* ------------------------------------------------------------------ */
function buildResidential() {
  const { parts, box } = createPartList();
  const floors = 5;
  const h = 3.1; // storey height
  const W = 16;
  const D = 10;

  box('r-found', 'foundation', 'foundation', [0, 0.4, 0], [W + 2.5, 0.8, D + 2.5], { explode: [0, -4.5, 0] });

  // Central core (stairs / lift) running the full height
  box('r-core', 'wall', 'concrete', [0, 0.8 + (floors * h) / 2, -1.2], [3.2, floors * h, 3.6], {
    explode: [0, 1.0, -3.2],
  });

  for (let f = 0; f < floors; f += 1) {
    const baseY = 0.8 + f * h;
    const lift = f * 2.6; // exploded stack spacing

    // Slab
    box(`r-slab-${f}`, 'slab', 'concrete', [0, baseY + 0.15, 0], [W, 0.3, D], { explode: [0, lift, 0] });

    // Corner columns + intermediate columns
    [-W / 2 + 0.3, -W / 4, 0, W / 4, W / 2 - 0.3].forEach((x, i) => {
      [-D / 2 + 0.3, D / 2 - 0.3].forEach((z, j) => {
        box(`r-col-${f}-${i}-${j}`, 'column', 'concrete', [x, baseY + 0.3 + (h - 0.3) / 2, z], [0.46, h - 0.3, 0.46], {
          explode: [0, lift + 0.5, 0],
        });
      });
    });

    // Front glazing with mullions
    box(`r-glass-${f}`, 'window', 'glass', [0, baseY + 1.7, D / 2 - 0.2], [W - 1.2, h - 0.95, 0.1], {
      explode: [0, lift + 0.6, 2.2],
    });
    for (let m = -3; m <= 3; m += 1) {
      box(`r-mull-${f}-${m}`, 'window', 'trim', [m * 2.2, baseY + 1.7, D / 2 - 0.16], [0.06, h - 0.9, 0.1], {
        explode: [0, lift + 0.6, 2.2],
      });
    }

    // Back wall
    box(`r-back-${f}`, 'wall', 'primary', [0, baseY + 1.7, -D / 2 + 0.2], [W - 1.0, h - 0.5, 0.3], {
      explode: [0, lift + 0.4, -2.4],
    });

    // Side walls
    [-1, 1].forEach((s) => {
      box(`r-side-${f}-${s}`, 'wall', 'primary', [s * (W / 2 - 0.2), baseY + 1.7, 0], [0.3, h - 0.5, D - 1.0], {
        explode: [s * 2.4, lift + 0.4, 0],
      });
    });

    // Balcony (from first floor up): projecting slab + glass balustrade
    if (f >= 1) {
      box(`r-balc-${f}`, 'balcony', 'concrete', [0, baseY + 0.12, D / 2 + 1.2], [W - 3, 0.24, 2.4], {
        explode: [0, lift + 0.2, 4.2],
      });
      box(`r-rail-${f}`, 'balcony', 'glass', [0, baseY + 0.78, D / 2 + 2.3], [W - 3, 1.0, 0.06], {
        explode: [0, lift + 0.2, 4.2],
      });
    }
  }

  // Roof slab + parapet + rooftop plant
  const roofY = 0.8 + floors * h;
  const topLift = floors * 2.6;
  box('r-roof', 'roof', 'concrete', [0, roofY + 0.15, 0], [W + 0.6, 0.3, D + 0.6], { explode: [0, topLift, 0] });
  box('r-parapet-f', 'roof', 'primary', [0, roofY + 0.7, D / 2 + 0.15], [W + 0.6, 0.8, 0.2], { explode: [0, topLift + 0.5, 1.4] });
  box('r-parapet-b', 'roof', 'primary', [0, roofY + 0.7, -D / 2 - 0.15], [W + 0.6, 0.8, 0.2], { explode: [0, topLift + 0.5, -1.4] });
  box('r-plant', 'roof', 'steel', [3.5, roofY + 0.95, -1.5], [3.2, 1.3, 2.2], { explode: [0, topLift + 1.6, -1] });

  return parts;
}

/* ------------------------------------------------------------------ */
/* 3. Structural reinforced-concrete frame (3 storeys, 4 x 3 bays)     */
/* ------------------------------------------------------------------ */
function buildFrame() {
  const { parts, box } = createPartList();
  const bayX = 4.2;
  const bayZ = 4.4;
  const nx = 4; // columns along x
  const nz = 3; // columns along z
  const storeys = 3;
  const h = 3.2;
  const x0 = -((nx - 1) * bayX) / 2;
  const z0 = -((nz - 1) * bayZ) / 2;
  const W = (nx - 1) * bayX;
  const D = (nz - 1) * bayZ;

  // Footings and ground beams
  for (let i = 0; i < nx; i += 1) {
    for (let j = 0; j < nz; j += 1) {
      const x = x0 + i * bayX;
      const z = z0 + j * bayZ;
      box(`f-footing-${i}-${j}`, 'foundation', 'foundation', [x, 0.3, z], [1.6, 0.6, 1.6], { explode: [0, -3.4, 0] });
      // Starter bars (reinforcement-inspired detail)
      [-0.14, 0.14].forEach((dx) =>
        [-0.14, 0.14].forEach((dz) =>
          box(`f-starter-${i}-${j}-${dx}-${dz}`, 'rebar', 'rebar', [x + dx, 0.95, z + dz], [0.03, 0.7, 0.03], {
            explode: [0, -1.6, 0],
          })
        )
      );
    }
  }

  for (let s = 0; s < storeys; s += 1) {
    const baseY = 0.6 + s * h;
    const lift = s * 2.8;

    // Columns
    for (let i = 0; i < nx; i += 1) {
      for (let j = 0; j < nz; j += 1) {
        box(`f-col-${s}-${i}-${j}`, 'column', 'concrete', [x0 + i * bayX, baseY + (h - 0.45) / 2, z0 + j * bayZ], [0.5, h - 0.45, 0.5], {
          explode: [0, lift + 0.4, 0],
        });
      }
    }

    // Beams along x and z at the top of the storey
    const beamY = baseY + h - 0.45 + 0.225;
    for (let j = 0; j < nz; j += 1) {
      box(`f-beamx-${s}-${j}`, 'beam', 'primary', [0, beamY, z0 + j * bayZ], [W, 0.45, 0.32], { explode: [0, lift + 1.2, 0] });
    }
    for (let i = 0; i < nx; i += 1) {
      box(`f-beamz-${s}-${i}`, 'beam', 'primary', [x0 + i * bayX, beamY, 0], [0.32, 0.45, D], { explode: [0, lift + 1.2, 0] });
    }

    // Floor slab
    box(`f-slab-${s}`, 'slab', 'ghost', [0, baseY + h - 0.1, 0], [W + 1.2, 0.2, D + 1.2], { explode: [0, lift + 2.0, 0] });
  }

  return parts;
}

/* ------------------------------------------------------------------ */
/* 4. Commercial building concept                                      */
/* ------------------------------------------------------------------ */
function buildCommercial() {
  const { parts, box } = createPartList();
  const W = 20;
  const D = 11;

  box('c-found', 'foundation', 'foundation', [0, 0.3, 0], [W + 2.5, 0.6, D + 2.5], { explode: [0, -3.4, 0] });

  // Ground floor: fully glazed storefront with slender steel columns
  box('c-gf-glass', 'window', 'glass', [0, 2.2, D / 2 - 0.15], [W - 1, 3.4, 0.12], { explode: [0, 0.6, 4] });
  for (let i = -4; i <= 4; i += 1) {
    box(`c-gf-mull-${i}`, 'window', 'trim', [i * 2.3, 2.2, D / 2 - 0.1], [0.07, 3.5, 0.14], { explode: [0, 0.6, 4] });
    box(`c-gf-col-${i}`, 'column', 'steel', [i * 2.3, 2.2, D / 2 - 1.2], [0.24, 3.4, 0.24], { explode: [0, 0.8, 1.6] });
  }
  box('c-gf-back', 'wall', 'primary', [0, 2.2, -D / 2 + 0.25], [W, 3.4, 0.4], { explode: [0, 0.6, -3] });
  box('c-gf-side-l', 'wall', 'primary', [-W / 2 + 0.2, 2.2, 0], [0.4, 3.4, D - 0.5], { explode: [-3, 0.6, 0] });
  box('c-gf-side-r', 'wall', 'primary', [W / 2 - 0.2, 2.2, 0], [0.4, 3.4, D - 0.5], { explode: [3, 0.6, 0] });

  // Mezzanine slab
  box('c-slab-1', 'slab', 'concrete', [0, 4.1, 0], [W, 0.35, D], { explode: [0, 2.4, 0] });

  // Canopy (auvent)
  box('c-canopy', 'roof', 'trim', [0, 4.3, D / 2 + 1.5], [W - 2, 0.18, 3.4], { explode: [0, 3.0, 3.6] });

  // Upper floor: solid volume with vertical sun-shading fins
  box('c-up-core', 'wall', 'primary', [0, 6.1, -0.6], [W - 0.6, 3.6, D - 1.6], { explode: [0, 4.4, -1.2] });
  box('c-up-glass', 'window', 'glass', [0, 6.1, D / 2 - 1.3], [W - 2, 3.0, 0.1], { explode: [0, 4.8, 3.2] });
  for (let i = 0; i < 17; i += 1) {
    box(`c-fin-${i}`, 'wall', 'wood', [-W / 2 + 1.3 + i * 1.1, 6.1, D / 2 - 0.55], [0.12, 3.5, 0.55], { explode: [0, 4.8, 4.4] });
  }

  // Roof slab and signage band
  box('c-roof', 'roof', 'concrete', [0, 8.1, 0], [W + 0.4, 0.35, D + 0.4], { explode: [0, 6.8, 0] });
  box('c-band', 'roof', 'steel', [0, 8.55, D / 2 + 0.1], [W - 6, 0.55, 0.2], { explode: [0, 7.2, 1.6] });

  return parts;
}

/* ------------------------------------------------------------------ */

export const MODEL_IDS = ['villa', 'residential', 'frame', 'commercial'];

const builders = {
  villa: buildVilla,
  residential: buildResidential,
  frame: buildFrame,
  commercial: buildCommercial,
};

// Camera framing per model: { target, distance } so presets work for any model size.
export const MODEL_FRAMING = {
  villa: { target: [0, 3.2, 3], distance: 30, size: 34 },
  residential: { target: [0, 8.2, 0], distance: 40, size: 42 },
  frame: { target: [0, 5.2, 0], distance: 28, size: 30 },
  commercial: { target: [0, 4.3, 1], distance: 34, size: 36 },
};

const cache = new Map();

/** Memoised part list for a model id (arrays are never mutated after creation). */
export function getModelParts(id) {
  if (!builders[id]) throw new Error(`Unknown model: ${id}`);
  if (!cache.has(id)) cache.set(id, builders[id]());
  return cache.get(id);
}
