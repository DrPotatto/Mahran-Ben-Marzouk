'use client';

import { Environment, Lightformer } from '@react-three/drei';
import { LIGHTING_PRESETS } from './materials';

// Background, fog, lights and a PROCEDURAL environment map (Lightformers) so reflections
// work without downloading any HDR file. Shared by the hero scene and the showroom.

export function Ground({ radius = 70 }) {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[radius, 72]} />
        <meshStandardMaterial color="#1a1f25" roughness={0.95} metalness={0} />
      </mesh>
      {/* Faint construction grid: reads as an architect's site plan */}
      <gridHelper args={[radius * 1.6, 64, '#3a434e', '#232a32']} position={[0, 0.005, 0]} />
    </group>
  );
}

export default function SceneEnvironment({ lighting, quality = 'high', shadowExtent = 24 }) {
  const p = LIGHTING_PRESETS[lighting] || LIGHTING_PRESETS.studio;
  const shadowSize = quality === 'low' ? 1024 : 2048;
  const look = (self) => self.lookAt(0, 0, 0);

  return (
    <>
      <color attach="background" args={[p.background]} />
      <fog attach="fog" args={[p.background, 75, 180]} />

      <ambientLight intensity={p.ambient} />
      <hemisphereLight args={[p.hemi[0], p.hemi[1], p.hemi[2]]} />

      {/* Key light: the only shadow caster (performance-aware: one shadow map) */}
      <directionalLight
        color={p.sun.color}
        intensity={p.sun.intensity}
        position={p.sun.position}
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.05}
      >
        <orthographicCamera attach="shadow-camera" args={[-shadowExtent, shadowExtent, shadowExtent, -shadowExtent, 1, 140]} />
      </directionalLight>

      {/* Garden / architectural lamps, only for the night preset */}
      {p.lamps ? (
        <>
          <pointLight color="#ffc77a" intensity={90} distance={34} decay={2} position={[-9, 1.6, 10]} />
          <pointLight color="#ffc77a" intensity={90} distance={34} decay={2} position={[9, 1.6, 10]} />
          <pointLight color="#ffd9a0" intensity={70} distance={26} decay={2} position={[0, 3.2, 5]} />
        </>
      ) : null}

      {/* frames={1}: rendered once; the key forces a re-render when the preset changes */}
      <Environment key={`${lighting}-${quality}`} resolution={quality === 'low' ? 128 : 256} frames={1} environmentIntensity={p.env.intensity}>
        <Lightformer form="rect" intensity={p.env.key} color={p.env.keyColor} position={[8, 10, 6]} scale={[22, 10, 1]} onUpdate={look} />
        <Lightformer form="rect" intensity={p.env.fill} color={p.env.fillColor} position={[-10, 6, -4]} scale={[18, 8, 1]} onUpdate={look} />
        <Lightformer form="rect" intensity={p.env.fill * 0.7} color={p.env.fillColor} position={[0, 5, -14]} scale={[24, 6, 1]} onUpdate={look} />
        <Lightformer form="ring" intensity={p.env.top} color="#ffffff" position={[0, 13, 0]} rotation-x={Math.PI / 2} scale={12} />
      </Environment>
    </>
  );
}
