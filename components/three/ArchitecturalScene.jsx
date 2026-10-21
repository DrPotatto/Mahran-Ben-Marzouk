'use client';

import { useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import SceneEnvironment, { Ground } from './SceneEnvironment';
import ArchitecturalModel from './ArchitecturalModel';
import CameraController from './CameraController';
import { MODEL_FRAMING } from './models';

// Everything that lives inside the showroom <Canvas>.
// `active` gates the controls: while false the page can scroll freely over the viewer
// (important on touch devices) and the mouse wheel is not captured.
export default function ArchitecturalScene({
  model,
  material,
  lighting,
  wireframe,
  exploded,
  quality,
  preset,
  resetToken,
  active,
  apiRef,
}) {
  const framing = MODEL_FRAMING[model];
  const gl = useThree((s) => s.gl);
  const controls = useThree((s) => s.controls);

  // OrbitControls forces `touch-action: none` on the canvas; restore vertical panning while inactive.
  useEffect(() => {
    gl.domElement.style.touchAction = active ? 'none' : 'pan-y';
  }, [gl, active, controls]);

  // Keyboard panning (arrow keys) on the focusable viewer container.
  useEffect(() => {
    if (!controls) return undefined;
    const host = gl.domElement.closest('[data-viewer-canvas]');
    if (!host || typeof controls.listenToKeyEvents !== 'function') return undefined;
    controls.listenToKeyEvents(host);
    return () => {
      if (typeof controls.stopListenToKeyEvents === 'function') controls.stopListenToKeyEvents();
    };
  }, [controls, gl]);

  return (
    <>
      <SceneEnvironment lighting={lighting} quality={quality} shadowExtent={framing.size * 0.75} />
      <Ground radius={72} />
      <ArchitecturalModel model={model} material={material} lighting={lighting} wireframe={wireframe} exploded={exploded} />
      <OrbitControls
        makeDefault
        enabled={active}
        enableDamping
        dampingFactor={0.09}
        minDistance={6}
        maxDistance={95}
        maxPolarAngle={Math.PI * 0.495}
        screenSpacePanning={false}
        keyPanSpeed={14}
      />
      <CameraController framing={framing} preset={preset} resetToken={resetToken} apiRef={apiRef} />
    </>
  );
}
