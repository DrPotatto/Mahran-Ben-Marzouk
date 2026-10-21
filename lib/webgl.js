// Browser capability checks for the 3D features. Only call these in the browser.

/** True when a WebGL context can actually be created. */
export function detectWebGL() {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return false;
    const lose = gl.getExtension && gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext(); // release the probe context immediately
    return true;
  } catch {
    return false;
  }
}

/** 'low' for weak / constrained devices, otherwise 'high'. Users can still force low quality. */
export function detectQuality() {
  if (typeof window === 'undefined') return 'high';
  const nav = window.navigator;
  const smallScreen = window.matchMedia('(max-width: 767px)').matches;
  const fewCores = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
  const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
  return smallScreen || fewCores || lowMemory ? 'low' : 'high';
}

/** Respect data-saver mode: skip the heavy 3D scene entirely. */
export function prefersSavedData() {
  if (typeof navigator === 'undefined') return false;
  return Boolean(navigator.connection && navigator.connection.saveData);
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Touch-first devices: the viewer must not trap page scrolling. */
export function isCoarsePointer() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}
