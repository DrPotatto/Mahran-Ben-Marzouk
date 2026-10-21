'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { MathUtils, Vector3 } from 'three';
import SceneEnvironment, { Ground } from './SceneEnvironment';
import ArchitecturalModel from './ArchitecturalModel';

const KEYS = [
  { pos: [25, 8.5, 31], target: [0.5, 3.4, 3] },
  { pos: [-3, 5.2, 33], target: [1.5, 3.8, 2] },
  { pos: [-31, 10, 15], target: [0, 3.6, 2] },
  { pos: [3, 36, 19], target: [0, 1.5, 2] },
];
const INTRO_FROM = { pos: [58, 34, 70], target: [0, 2.5, 2] };
const INTRO_SECONDS = 3.4;

const tmpA = new Vector3();
const tmpB = new Vector3();

function samplePose(progress, out) {
  const n = KEYS.length - 1;
  const x = MathUtils.clamp(progress, 0, 1) * n;
  const i = Math.min(Math.floor(x), n - 1);
  const f = MathUtils.smoothstep(x - i, 0, 1);
  out.pos.set(...KEYS[i].pos).lerp(tmpA.set(...KEYS[i + 1].pos), f);
  out.target.set(...KEYS[i].target).lerp(tmpB.set(...KEYS[i + 1].target), f);
}

function HeroCamera({ scrollRef, reducedMotion }) {
  const pose = useRef({ pos: new Vector3(), target: new Vector3() });
  const look = useRef(new Vector3(...INTRO_FROM.target));
  const smooth = useRef(0);
  const elapsed = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1); // avoid jumps after tab switches
    elapsed.current += dt;
    smooth.current = MathUtils.damp(smooth.current, reducedMotion ? 0 : scrollRef.current, 3.2, dt);

    samplePose(smooth.current, pose.current);

    const introT = reducedMotion ? 1 : MathUtils.clamp(elapsed.current / INTRO_SECONDS, 0, 1);
    const ease = 1 - Math.pow(1 - introT, 3);

    const { camera } = state;
    camera.position.set(...INTRO_FROM.pos).lerp(pose.current.pos, ease);
    look.current.set(...INTRO_FROM.target).lerp(pose.current.target, ease);

    if (!reducedMotion) {
      const t = state.clock.elapsedTime;
      camera.position.x += Math.sin(t * 0.18) * 0.9;
      camera.position.y += Math.sin(t * 0.13) * 0.25;
    }
    camera.lookAt(look.current);
  });
  return null;
}

// Stable module-level anchors. Passing a fresh array to <Html> on every render
// is harmless, but these constants make the intent explicit and keep the
// reconciler calm as the hero re-renders (scroll, language switch, etc.).
const TAG_ANCHORS = {
  structure: [-6.2, 3.4, 4.2],
  materials: [6.9, 2.0, -0.5],
  architecture: [7.6, 6.2, 0.5],
  finishing: [-4.3, 5.8, 1.0],
};

const DIM_WIDTH = { from: [-8.5, 0.06, 6.4], to: [8.5, 0.06, 6.4] };
const DIM_HEIGHT = { from: [-9.9, 0, 5.5], to: [-9.9, 6.65, 5.5] };

// Screen-space technical label anchored to a 3D point.
function Tag({ position, text, align = 'start' }) {
  return (
    <Html position={position} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
      <div className={`hero-tag hero-tag--${align}`}>
        <span className="hero-tag__dot" />
        <span className="hero-tag__line" />
        <span className="hero-tag__text">{text}</span>
      </div>
    </Html>
  );
}

function DimensionLine({ from, to, label, color = '#d7ae68' }) {
  const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2];
  return (
    <group>
      <Line points={[from, to]} color={color} lineWidth={1} transparent opacity={0.85} />
      <Html position={mid} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <span className="hero-dim">{label}</span>
      </Html>
    </group>
  );
}

export default function HeroScene({ quality, paused, reducedMotion, scrollRef, labels, dimensions, onFail }) {
  return (
    <Canvas
      frameloop={paused ? 'never' : reducedMotion ? 'demand' : 'always'}
      shadows
      dpr={quality === 'low' ? [1, 1.25] : [1, 1.6]}
      camera={{ fov: 30, near: 0.5, far: 400, position: INTRO_FROM.pos }}
      gl={{ antialias: quality === 'high', powerPreference: 'high-performance', alpha: false }}
      resize={{ debounce: 150 }}
      aria-hidden="true"
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          if (onFail) onFail();
        });
      }}
    >
      <SceneEnvironment lighting="golden" quality={quality} shadowExtent={26} />
      <Ground radius={80} />
      <ArchitecturalModel model="villa" material="concrete" lighting="golden" />
      <HeroCamera scrollRef={scrollRef} reducedMotion={reducedMotion} />

      {/* Technical annotations: kept to four, anchored on the building itself */}
      <Tag position={TAG_ANCHORS.structure} text={labels.structure} align="start" />
      <Tag position={TAG_ANCHORS.materials} text={labels.materials} align="end" />
      <Tag position={TAG_ANCHORS.architecture} text={labels.architecture} align="end" />
      <Tag position={TAG_ANCHORS.finishing} text={labels.finishing} align="start" />

      {/* Measurement lines (conceptual model dimensions) */}
      <DimensionLine from={DIM_WIDTH.from} to={DIM_WIDTH.to} label={dimensions.width} />
      <DimensionLine from={DIM_HEIGHT.from} to={DIM_HEIGHT.to} label={dimensions.height} />
    </Canvas>
  );
}
