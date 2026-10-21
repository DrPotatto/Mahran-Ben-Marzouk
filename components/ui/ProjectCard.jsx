'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import BlueprintThumb from './BlueprintThumb';

// Presentational project card. Shows the first real photo when available (next/image,
// local files only), otherwise a blueprint drawing — never a remote placeholder.
export default function ProjectCard({
  title,
  location,
  statusLabel,
  categoryLabels,
  imageSrc,
  imageAlt,
  model,
  conceptual,
  conceptLabel,
  ctaLabel,
  onOpen,
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(imageSrc) && !imageFailed;

  return (
    <article className="group relative flex h-full flex-col border border-ivory/10 bg-graphite transition-colors duration-500 ease-cinematic hover:border-gold/60">
      <div className="relative aspect-[16/9] overflow-hidden bg-ink">
        {showImage ? (
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-[1.03]"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="blueprint-grid flex h-full items-center justify-center text-steel transition-colors duration-500 group-hover:text-gold">
            <BlueprintThumb model={model || 'villa'} className="h-full w-full p-5" />
          </div>
        )}
        {conceptual ? (
          <span className="absolute start-3 top-3 border border-amber/60 bg-ink/85 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-amber">
            {conceptLabel}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-gold">
          {categoryLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <h3 className="mt-3 font-display text-2xl leading-tight text-ivory">{title}</h3>
        <p className="mt-2 text-sm text-steel">
          {location} · {statusLabel}
        </p>
        <button
          type="button"
          onClick={onOpen}
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 self-start font-sans text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors group-hover:text-gold after:absolute after:inset-0 after:content-['']"
        >
          {ctaLabel}
          <ArrowRight size={16} aria-hidden="true" className="rtl:-scale-x-100" />
        </button>
      </div>
    </article>
  );
}
