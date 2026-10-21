'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Maximize2, Minimize2, RotateCcw, Layers } from 'lucide-react';
import ArchitecturalScene from './ArchitecturalScene';
import ViewerControls from './ViewerControls';
import WebGLFallback from './WebGLFallback';
import ErrorBoundary from '../ui/ErrorBoundary';
import LoadingIndicator from '../ui/LoadingIndicator';
import { useDeviceCaps } from '../../lib/hooks';
import { useI18n } from '../AppProvider';

// Interactive showroom viewer.
//
// Interaction model (so the viewer never traps page scrolling):
//  - inactive: touch scrolls the page, the wheel scrolls the page.
//  - click / tap / Enter activates it: orbit (drag), pan (right-drag / two fingers / arrows), zoom (wheel, pinch, + / −).
//  - Escape, or pressing outside the viewer, deactivates it again.
export default function ThreeViewer({ initialModel = 'villa', fixedModel = false, compact = false }) {
  const { t } = useI18n();
  const caps = useDeviceCaps();

  const [model, setModel] = useState(initialModel);
  const [material, setMaterial] = useState('concrete');
  const [lighting, setLighting] = useState('studio');
  const [preset, setPreset] = useState('angle');
  const [resetToken, setResetToken] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [qualityOverride, setQualityOverride] = useState(null); // null = automatic
  const [active, setActive] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const rootRef = useRef(null);
  const apiRef = useRef(null);

  const quality = qualityOverride ?? caps?.quality ?? 'high';
  const fullscreenSupported = typeof document !== 'undefined' && Boolean(document.fullscreenEnabled);

  // Keep model in sync when a parent swaps `initialModel` (project detail).
  useEffect(() => {
    setModel(initialModel);
  }, [initialModel]);

  // Deactivate when pressing outside the viewer.
  useEffect(() => {
    if (!active) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setActive(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [active]);

  // Track fullscreen changes (including the browser's own Esc handling).
  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (rootRef.current?.requestFullscreen) await rootRef.current.requestFullscreen();
    } catch {
      /* fullscreen refused by the browser: nothing to do */
    }
  }, []);

  const onKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Escape') {
      setActive(false);
      return;
    }
    if (!active) {
      if (['Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '+', '-', '='].includes(e.key)) {
        e.preventDefault();
        setActive(true);
      }
      return;
    }
    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      apiRef.current?.zoom(0.85);
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      apiRef.current?.zoom(1 / 0.85);
    }
  };

  const state = { model, material, lighting, preset, exploded, wireframe, quality };
  const actions = useMemo(
    () => ({
      setModel: (id) => {
        setModel(id);
        setExploded(false);
        setPreset('angle');
      },
      setMaterial,
      setLighting,
      setPreset,
      toggleExploded: () => setExploded((v) => !v),
      toggleWireframe: () => setWireframe((v) => !v),
      toggleQuality: () => setQualityOverride((q) => ((q ?? caps?.quality ?? 'high') === 'low' ? 'high' : 'low')),
    }),
    [caps]
  );

  const retry = () => {
    setContextLost(false);
    setAttempt((n) => n + 1);
  };

  // Still probing the device (SSR / first paint)
  if (!caps) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center border border-ivory/10 bg-ink">
        <LoadingIndicator label={t('viewer.loading')} />
      </div>
    );
  }

  // No WebGL: show the labelled drawing instead of the 3D scene (the rest of the page is unaffected).
  if (!caps.webgl) {
    return (
      <div className="border border-ivory/10 bg-ink">
        <WebGLFallback model={model} />
      </div>
    );
  }

  const fallback = ({ reset }) => (
    <WebGLFallback
      model={model}
      title={t('viewer.errorTitle')}
      text={t('viewer.errorText')}
      onRetry={() => {
        reset();
        retry();
      }}
      className="min-h-[420px]"
    />
  );

  return (
    <div ref={rootRef} className="viewer-shell border border-ivory/10 bg-ink">
      <div className="viewer-grid grid lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* ---------------- 3D canvas ---------------- */}
        <div className="relative">
          <div
            data-viewer-canvas
            tabIndex={0}
            role="group"
            aria-label={t('viewer.region')}
            aria-describedby="viewer-hint"
            onKeyDown={onKeyDown}
            onClick={() => setActive(true)}
            className={`viewer-canvas relative bg-ink outline-offset-[-3px] ${
              compact ? 'aspect-[4/3] lg:aspect-[16/10]' : 'aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[640px]'
            } ${active ? 'is-active' : ''}`}
          >
            {contextLost ? (
              fallback({ reset: () => {} })
            ) : (
              <ErrorBoundary key={attempt} fallback={fallback}>
                <Suspense
                  fallback={
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LoadingIndicator label={t('viewer.loading')} />
                    </div>
                  }
                >
                  <Canvas
                    key={`${quality}-${attempt}`}
                    frameloop="demand"
                    shadows
                    dpr={quality === 'low' ? [1, 1.25] : [1, 1.75]}
                    camera={{ fov: 35, near: 0.5, far: 400, position: [30, 20, 30] }}
                    gl={{ antialias: quality === 'high', powerPreference: 'high-performance', alpha: false }}
                    resize={{ debounce: 120 }}
                    onCreated={({ gl }) => {
                      gl.domElement.addEventListener('webglcontextlost', (event) => {
                        event.preventDefault();
                        setContextLost(true);
                      });
                    }}
                  >
                    <ArchitecturalScene
                      model={model}
                      material={material}
                      lighting={lighting}
                      wireframe={wireframe}
                      exploded={exploded}
                      quality={quality}
                      preset={preset}
                      resetToken={resetToken}
                      active={active}
                      apiRef={apiRef}
                    />
                  </Canvas>
                </Suspense>
              </ErrorBoundary>
            )}

            {/* Overlay: camera label + model name */}
            <div className="pointer-events-none absolute start-4 top-4 font-mono text-[0.66rem] uppercase tracking-technical text-ivory/80">
              <span className="text-gold">◉</span> {t(`viewer.models.${model}`)}
            </div>

            {/* Overlay: quick actions (always reachable, also on mobile) */}
            <div className="absolute end-3 top-3 flex gap-1.5">
              <IconButton
                label={exploded ? t('viewer.controls.assemble') : t('viewer.controls.explode')}
                pressed={exploded}
                onClick={(e) => {
                  e.stopPropagation();
                  actions.toggleExploded();
                }}
              >
                <Layers size={17} aria-hidden="true" />
              </IconButton>
              <IconButton
                label={t('viewer.controls.reset')}
                onClick={(e) => {
                  e.stopPropagation();
                  setPreset('angle');
                  setResetToken((n) => n + 1);
                }}
              >
                <RotateCcw size={17} aria-hidden="true" />
              </IconButton>
              {fullscreenSupported ? (
                <IconButton
                  label={fullscreen ? t('viewer.controls.exitFullscreen') : t('viewer.controls.fullscreen')}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                >
                  {fullscreen ? <Minimize2 size={17} aria-hidden="true" /> : <Maximize2 size={17} aria-hidden="true" />}
                </IconButton>
              ) : null}
            </div>

            {/* Overlay: interaction hint */}
            <p
              id="viewer-hint"
              className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-4 pb-3 pt-10 text-center font-mono text-[0.64rem] uppercase tracking-[0.14em] text-steel"
            >
              {active ? `${t('viewer.hints.desktop')} · ${t('viewer.hints.deactivate')}` : t('viewer.hints.activate')}
            </p>
          </div>

          <div className="border-t border-ivory/10 px-5 py-3 text-xs leading-relaxed text-steel" aria-live="polite">
            {exploded ? <p className="text-gold">{t('viewer.partsExploded')}</p> : null}
            <p>{t('viewer.illustrative')}</p>
            <p>{t('viewer.conceptNote')}</p>
          </div>
        </div>

        {/* ---------------- Controls ---------------- */}
        <ViewerControls state={state} actions={actions} showModelPicker={!fixedModel} qualityAuto={caps.quality === 'low'} />
      </div>
    </div>
  );
}

function IconButton({ label, onClick, children, pressed }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center border bg-ink/80 backdrop-blur transition-colors duration-300 ${
        pressed ? 'border-gold text-gold' : 'border-ivory/20 text-ivory hover:border-gold hover:text-gold'
      }`}
    >
      {children}
    </button>
  );
}
