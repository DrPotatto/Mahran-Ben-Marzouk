'use client';

import { PRESET_IDS, PRESET_SWATCH } from './materials';

// Material laboratory: seven PBR presets, applied immediately to the primary surfaces.
export default function MaterialSelector({ value, onChange, label, getName }) {
  return (
    <div role="group" aria-label={label} className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
      {PRESET_IDS.map((id) => {
        const selected = value === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(id)}
            className={`flex min-h-[44px] items-center gap-3 border px-3 text-start text-[0.82rem] transition-colors duration-300 ${
              selected ? 'border-gold bg-gold/10 text-ivory' : 'border-ivory/10 text-steel hover:border-ivory/30 hover:text-ivory'
            }`}
          >
            <span
              aria-hidden="true"
              className="h-5 w-5 shrink-0 rounded-full border border-ivory/30"
              style={{ background: PRESET_SWATCH[id] }}
            />
            <span className="leading-tight">{getName(id)}</span>
          </button>
        );
      })}
    </div>
  );
}
