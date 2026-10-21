// Pure-data helpers for the procedural architectural models.
//
// A model is a list of "part specs". Each part references a SHARED unit geometry
// (a 1x1x1 box or a unit cylinder) that is scaled per part, so every model reuses
// two GPU buffers regardless of how many parts it has. Materials are shared by key.
//
// Part spec:
//   id        unique string
//   group     semantic group (foundation, column, beam, slab, wall, window, balcony, roof, rebar…)
//   mat       material key: primary | concrete | trim | glass | steel | wood | foundation | water | rebar | ghost
//   shape     'box' | 'cyl'
//   position  [x, y, z] centre in metres (ground level is y = 0)
//   scale     [sx, sy, sz] size in metres (for cylinders: [diameter, height, diameter])
//   rotation  optional [rx, ry, rz]
//   explode   [dx, dy, dz] offset applied in the exploded view
//   cast / receive  shadow flags

import * as THREE from 'three';

let boxGeometry = null;
let cylinderGeometry = null;

/** Shared unit box (1 x 1 x 1). Created lazily, disposed with disposeSharedGeometries(). */
export function getBoxGeometry() {
  if (!boxGeometry) boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  return boxGeometry;
}

/** Shared unit cylinder (diameter 1, height 1). */
export function getCylinderGeometry() {
  if (!cylinderGeometry) cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 14);
  return cylinderGeometry;
}

/**
 * Free the shared GPU buffers when a 3D scene unmounts. The geometry objects are kept:
 * three.js simply re-uploads the buffers if another scene (or a remount) renders them again.
 */
export function disposeSharedGeometries() {
  if (boxGeometry) boxGeometry.dispose();
  if (cylinderGeometry) cylinderGeometry.dispose();
}

/** Small collector that keeps model builders readable. */
export function createPartList() {
  const parts = [];

  const base = (shape, id, group, mat, position, scale, opts = {}) => {
    parts.push({
      id,
      group,
      mat,
      shape,
      position,
      scale,
      rotation: opts.rotation || null,
      explode: opts.explode || [0, 0, 0],
      cast: opts.cast ?? (mat !== 'glass' && mat !== 'water' && mat !== 'ghost'),
      receive: opts.receive ?? (mat !== 'glass' && mat !== 'ghost'),
    });
  };

  return {
    parts,
    box: (id, group, mat, position, size, opts) => base('box', id, group, mat, position, size, opts),
    // cylinder given as [diameter, height]
    cyl: (id, group, mat, position, [diameter, height], opts) =>
      base('cyl', id, group, mat, position, [diameter, height, diameter], opts),
  };
}
