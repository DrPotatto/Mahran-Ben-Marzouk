'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';

// Smooth camera presets for the showroom. Works with OrbitControls registered via `makeDefault`.
// The transition uses an exponential approach (1 - e^(-k·dt)) so its duration does not depend on
// the frame rate, and it is cancelled the moment the user grabs the controls.

export const CAMERA_PRESETS = {
  angle: [0.78, 0.42, 1],
  front: [0, 0.16, 1],
  side: [1, 0.16, 0.02],
  top: [0.001, 1, 0.02],
};

export const CAMERA_PRESET_IDS = Object.keys(CAMERA_PRESETS);

export function presetPose(preset, framing) {
  const dir = new Vector3(...(CAMERA_PRESETS[preset] || CAMERA_PRESETS.angle)).normalize();
  const target = new Vector3(...framing.target);
  return { position: target.clone().add(dir.multiplyScalar(framing.distance)), target };
}

export default function CameraController({ framing, preset, resetToken, apiRef }) {
  const controls = useThree((s) => s.controls);
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);

  const goal = useRef({ position: new Vector3(), target: new Vector3(), moving: false });
  const snapped = useRef(false);

  // Retarget when the preset, the model framing or the reset button changes.
  useEffect(() => {
    const { position, target } = presetPose(preset, framing);
    goal.current.position.copy(position);
    goal.current.target.copy(target);

    if (!snapped.current) {
      // First pose: jump there (no animation), as soon as the controls exist.
      camera.position.copy(position);
      camera.lookAt(target);
      if (controls) {
        controls.target.copy(target);
        controls.update();
        snapped.current = true;
      }
      goal.current.moving = false;
    } else {
      goal.current.moving = true;
    }
    invalidate();
  }, [preset, framing, resetToken, camera, controls, invalidate]);

  // Dragging / zooming cancels an ongoing transition.
  useEffect(() => {
    if (!controls) return undefined;
    const cancel = () => {
      goal.current.moving = false;
    };
    controls.addEventListener('start', cancel);
    return () => controls.removeEventListener('start', cancel);
  }, [controls]);

  // Imperative API used by keyboard shortcuts (+ / −).
  useEffect(() => {
    if (!apiRef) return undefined;
    apiRef.current = {
      zoom: (factor) => {
        if (!controls) return;
        const offset = camera.position.clone().sub(controls.target);
        const length = MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance);
        camera.position.copy(controls.target).add(offset.setLength(length));
        controls.update();
        invalidate();
      },
    };
    return () => {
      apiRef.current = null;
    };
  }, [apiRef, controls, camera, invalidate]);

  useFrame((state, delta) => {
    const g = goal.current;
    if (!g.moving || !controls) return;
    const k = 1 - Math.exp(-4.2 * delta);
    camera.position.lerp(g.position, k);
    controls.target.lerp(g.target, k);
    controls.update();
    if (camera.position.distanceToSquared(g.position) < 0.0004 && controls.target.distanceToSquared(g.target) < 0.0004) {
      camera.position.copy(g.position);
      controls.target.copy(g.target);
      controls.update();
      g.moving = false;
    }
    state.invalidate();
  });

  return null;
}
