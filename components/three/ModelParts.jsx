'use client';

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';
import { getBoxGeometry, getCylinderGeometry } from './modelBuilder';

// Renders a list of part specs (see modelBuilder.js) and animates the exploded view.
//
// Explosion animation: a single progress value `progress` (0 = assembled, 1 = exploded) is
// damped towards its target using the frame delta, so the speed is frame-rate independent.
// The scene uses on-demand rendering, so we call `invalidate()` only while the value is moving.

export default function ModelParts({ parts, materials, exploded }) {
  const boxGeometry = useMemo(() => getBoxGeometry(), []);
  const cylinderGeometry = useMemo(() => getCylinderGeometry(), []);
  const groups = useRef([]);
  const progress = useRef(0);

  // Apply the current progress to every part's group position.
  const apply = (value) => {
    const k = MathUtils.smootherstep(value, 0, 1);
    for (let i = 0; i < parts.length; i += 1) {
      const g = groups.current[i];
      if (!g) continue;
      const p = parts[i];
      g.position.set(
        p.position[0] + p.explode[0] * k,
        p.position[1] + p.explode[1] * k,
        p.position[2] + p.explode[2] * k
      );
    }
  };

  // When the model changes, start from the assembled pose.
  useLayoutEffect(() => {
    progress.current = 0;
    apply(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parts]);

  // The scene renders on demand: wake it up whenever the explode target flips.
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate();
  }, [exploded, invalidate]);

  useFrame((state, delta) => {
    const target = exploded ? 1 : 0;
    if (progress.current === target) return;
    progress.current = MathUtils.damp(progress.current, target, 3.4, delta);
    if (Math.abs(progress.current - target) < 0.001) progress.current = target;
    apply(progress.current);
    state.invalidate();
  });

  return (
    // dispose={null}: geometries and materials are shared and disposed by their owners.
    <group dispose={null}>
      {parts.map((p, i) => (
        <group
          key={p.id}
          ref={(el) => {
            groups.current[i] = el;
          }}
          position={p.position}
        >
          <mesh
            geometry={p.shape === 'cyl' ? cylinderGeometry : boxGeometry}
            material={materials[p.mat]}
            scale={p.scale}
            rotation={p.rotation || undefined}
            castShadow={p.cast}
            receiveShadow={p.receive}
          />
        </group>
      ))}
    </group>
  );
}
