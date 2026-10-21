'use client';

import { useState } from 'react';
import { Box, Layers, SlidersHorizontal, Zap } from 'lucide-react';
import MaterialSelector from './MaterialSelector';
import { LIGHTING_IDS } from './materials';
import { MODEL_IDS } from './models';
import { CAMERA_PRESET_IDS } from './CameraController';
import { useI18n } from '../AppProvider';

function Group({ label, children }) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2.5 font-mono text-[0.66rem] uppercase tracking-technical text-gold">{label}</legend>
      {children}
    </fieldset>
  );
}

function Pill({ pressed, onClick, children, icon: Icon }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 border px-3 text-[0.8rem] transition-colors duration-300 ${
        pressed ? 'border-gold bg-gold/10 text-ivory' : 'border-ivory/10 text-steel hover:border-ivory/30 hover:text-ivory'
      }`}
    >
      {Icon ? <Icon size={15} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

// Side panel (desktop) / collapsible panel (mobile) with every showroom control.
export default function ViewerControls({
  state,
  actions,
  showModelPicker = true,
  qualityAuto,
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <aside className="border-t border-ivory/10 bg-graphite lg:border-s lg:border-t-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="viewer-panel"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-[52px] w-full items-center justify-between px-5 text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-ivory lg:hidden"
      >
        <span className="inline-flex items-center gap-2.5">
          <SlidersHorizontal size={16} aria-hidden="true" />
          {t('viewer.labels.controls')}
        </span>
        <span aria-hidden="true" className="text-gold">{open ? '−' : '+'}</span>
      </button>

      <div id="viewer-panel" className={`${open ? 'block' : 'hidden'} space-y-7 p-5 lg:block lg:max-h-[640px] lg:overflow-y-auto`}>
        {showModelPicker ? (
          <Group label={t('viewer.labels.model')}>
            <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-1">
              {MODEL_IDS.map((id) => (
                <Pill key={id} pressed={state.model === id} onClick={() => actions.setModel(id)} icon={Box}>
                  {t(`viewer.models.${id}`)}
                </Pill>
              ))}
            </div>
          </Group>
        ) : null}

        <Group label={t('viewer.labels.material')}>
          <MaterialSelector
            value={state.material}
            onChange={actions.setMaterial}
            label={t('viewer.labels.material')}
            getName={(id) => t(`viewer.materials.${id}`)}
          />
        </Group>

        <Group label={t('viewer.labels.lighting')}>
          <div className="grid grid-cols-3 gap-1.5">
            {LIGHTING_IDS.map((id) => (
              <Pill key={id} pressed={state.lighting === id} onClick={() => actions.setLighting(id)}>
                {t(`viewer.lighting.${id}`)}
              </Pill>
            ))}
          </div>
        </Group>

        <Group label={t('viewer.labels.camera')}>
          <div className="grid grid-cols-2 gap-1.5">
            {CAMERA_PRESET_IDS.map((id) => (
              <Pill key={id} pressed={state.preset === id} onClick={() => actions.setPreset(id)}>
                {t(`viewer.cameras.${id}`)}
              </Pill>
            ))}
          </div>
        </Group>

        <Group label={t('viewer.labels.inspection')}>
          <div className="grid grid-cols-1 gap-1.5">
            <Pill pressed={state.exploded} onClick={actions.toggleExploded} icon={Layers}>
              {state.exploded ? t('viewer.controls.assemble') : t('viewer.controls.explode')}
            </Pill>
            <Pill pressed={state.wireframe} onClick={actions.toggleWireframe} icon={Box}>
              {state.wireframe ? t('viewer.controls.solid') : t('viewer.controls.wireframe')}
            </Pill>
            <Pill pressed={state.quality === 'low'} onClick={actions.toggleQuality} icon={Zap}>
              {t('viewer.controls.quality')}
              {qualityAuto && state.quality === 'low' ? ' ✓' : ''}
            </Pill>
          </div>
        </Group>
      </div>
    </aside>
  );
}
