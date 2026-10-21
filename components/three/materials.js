// Physically based material presets, lighting presets, and a hook that builds ONE shared
// material per role (never one per mesh) and disposes it when it is replaced or unmounted.

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

/** User-selectable "primary surface" materials (walls, slabs, roofs). */
export const MATERIAL_PRESETS = {
  concrete: { color: '#9b9c98', roughness: 0.9, metalness: 0 },
  limestone: { color: '#d9d0ba', roughness: 0.84, metalness: 0 },
  darkStone: { color: '#3b3f45', roughness: 0.6, metalness: 0.08 },
  steel: { color: '#aeb6bf', roughness: 0.28, metalness: 1 },
  glass: { color: '#a6cbd9', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.38 },
  wood: { color: '#8d5b34', roughness: 0.55, metalness: 0 },
  plaster: { color: '#efece4', roughness: 0.95, metalness: 0 },
};

export const PRESET_IDS = Object.keys(MATERIAL_PRESETS);

/** Swatch colours shown in the selector (kept equal to the preset colours). */
export const PRESET_SWATCH = Object.fromEntries(PRESET_IDS.map((id) => [id, MATERIAL_PRESETS[id].color]));

/**
 * Lighting presets. `windowGlow` drives the warm emissive glow of glass (interior lights).
 * `env` configures the procedural environment (no HDR files are downloaded).
 */
export const LIGHTING_PRESETS = {
  studio: {
    background: '#151a21',
    ambient: 0.28,
    hemi: ['#dfe8f2', '#242a31', 0.5],
    sun: { color: '#ffffff', intensity: 2.6, position: [20, 28, 18] },
    env: { intensity: 0.9, key: 3.2, keyColor: '#ffffff', fill: 1.2, fillColor: '#a9bfd8', top: 1.0 },
    windowGlow: 0,
    lamps: false,
  },
  golden: {
    background: '#14110f',
    ambient: 0.2,
    hemi: ['#ffd9a8', '#17130f', 0.45],
    sun: { color: '#ffb25e', intensity: 3.4, position: [30, 10, 14] },
    env: { intensity: 0.75, key: 3.0, keyColor: '#ffbf80', fill: 0.9, fillColor: '#6f8ab0', top: 0.6 },
    windowGlow: 0.35,
    lamps: false,
  },
  night: {
    background: '#07090c',
    ambient: 0.1,
    hemi: ['#3a4a6a', '#07090c', 0.32],
    sun: { color: '#8aa0d0', intensity: 0.55, position: [-16, 24, -12] },
    env: { intensity: 0.35, key: 1.0, keyColor: '#7f95c4', fill: 0.5, fillColor: '#3a4a6a', top: 0.3 },
    windowGlow: 1.1,
    lamps: true,
  },
};

export const LIGHTING_IDS = Object.keys(LIGHTING_PRESETS);

const WIRE_GOLD = '#d7ae68';
const WIRE_STEEL = '#8d97a3';

function standard(params, wireframe) {
  const material = new THREE.MeshStandardMaterial({ envMapIntensity: 1, ...params });
  if (wireframe) {
    material.wireframe = true;
    material.color = new THREE.Color(WIRE_GOLD);
    material.metalness = 0;
    material.roughness = 1;
    material.transparent = false;
    material.opacity = 1;
  }
  return material;
}

/**
 * Build the complete shared material set.
 * @param primary   key of MATERIAL_PRESETS applied to the "primary" role
 * @param lighting  key of LIGHTING_PRESETS (controls window glow)
 * @param wireframe boolean inspection mode
 */
export function createMaterialSet({ primary, lighting, wireframe }) {
  const preset = MATERIAL_PRESETS[primary] || MATERIAL_PRESETS.concrete;
  const light = LIGHTING_PRESETS[lighting] || LIGHTING_PRESETS.studio;

  const glassParams = {
    color: MATERIAL_PRESETS.glass.color,
    roughness: 0.04,
    metalness: 0.15,
    transparent: true,
    opacity: 0.34,
    envMapIntensity: 1.8,
    emissive: new THREE.Color('#ffc77a'),
    emissiveIntensity: light.windowGlow,
    depthWrite: false,
  };

  const set = {
    primary: standard(
      {
        color: preset.color,
        roughness: preset.roughness,
        metalness: preset.metalness,
        transparent: Boolean(preset.transparent),
        opacity: preset.opacity ?? 1,
        depthWrite: !preset.transparent,
      },
      wireframe
    ),
    concrete: standard({ color: '#8e8f8b', roughness: 0.92, metalness: 0 }, wireframe),
    trim: standard({ color: '#1c2026', roughness: 0.45, metalness: 0.7 }, wireframe),
    steel: standard({ color: '#8f98a2', roughness: 0.32, metalness: 1 }, wireframe),
    wood: standard({ color: '#8a5a35', roughness: 0.58, metalness: 0 }, wireframe),
    foundation: standard({ color: '#6c6d6a', roughness: 0.96, metalness: 0 }, wireframe),
    water: standard(
      { color: '#4a8fa8', roughness: 0.08, metalness: 0.2, transparent: true, opacity: 0.85, envMapIntensity: 1.4 },
      wireframe
    ),
    rebar: standard({ color: '#b7794a', roughness: 0.5, metalness: 0.6 }, wireframe),
    ghost: standard(
      { color: '#9b9c98', roughness: 0.9, metalness: 0, transparent: true, opacity: 0.22, depthWrite: false },
      wireframe
    ),
  };

  // Glass uses MeshPhysicalMaterial for a cleaner reflective response.
  const glass = new THREE.MeshPhysicalMaterial(glassParams);
  if (wireframe) {
    glass.wireframe = true;
    glass.color = new THREE.Color(WIRE_STEEL);
    glass.transparent = false;
    glass.opacity = 1;
    glass.emissiveIntensity = 0;
    glass.depthWrite = true;
  }
  set.glass = glass;
  return set;
}

export function disposeMaterialSet(set) {
  Object.values(set).forEach((material) => material.dispose());
}

/** Hook: memoised material set, disposed on change/unmount to avoid GPU leaks. */
export function useMaterialSet({ primary, lighting, wireframe }) {
  const set = useMemo(() => createMaterialSet({ primary, lighting, wireframe }), [primary, lighting, wireframe]);
  useEffect(() => () => disposeMaterialSet(set), [set]);
  return set;
}
