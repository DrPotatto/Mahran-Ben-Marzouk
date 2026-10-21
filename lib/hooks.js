'use client';

import { useEffect, useState } from 'react';
import { detectQuality, detectWebGL, isCoarsePointer, prefersReducedMotion, prefersSavedData } from './webgl';

/** True while `ref`'s element intersects the viewport (+ rootMargin). `once` keeps it true after the first hit. */
export function useInView(ref, { rootMargin = '0px', once = false } = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, once]);
  return inView;
}

/**
 * One-time device capability probe (client only).
 * Returns null while unknown (SSR / first paint), then
 * { webgl, quality, reducedMotion, saveData, coarse }.
 */
export function useDeviceCaps() {
  const [caps, setCaps] = useState(null);
  useEffect(() => {
    setCaps({
      webgl: detectWebGL(),
      quality: detectQuality(),
      reducedMotion: prefersReducedMotion(),
      saveData: prefersSavedData(),
      coarse: isCoarsePointer(),
    });
  }, []);
  return caps;
}

/** Live `prefers-reduced-motion` value. */
export function useReducedMotionPref() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}
