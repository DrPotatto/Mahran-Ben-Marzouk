'use client';

import { useState } from 'react';

// Before/after comparison. Only rendered when genuine before AND after photos exist.
// The native range input makes it keyboard and screen-reader accessible.
export default function BeforeAfter({ before, after, labels }) {
  const [pos, setPos] = useState(50);
  const [failed, setFailed] = useState(false);
  if (!before || !after || failed) return null;

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border border-ivory/10 bg-graphite select-none" dir="ltr">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={labels.after} loading="lazy" onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt={labels.before} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      </div>
      <span className="absolute left-3 top-3 bg-ink/80 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-technical text-ivory">{labels.before}</span>
      <span className="absolute right-3 top-3 bg-ink/80 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-technical text-ivory">{labels.after}</span>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-px bg-gold" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold bg-ink" />
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={labels.slider}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
