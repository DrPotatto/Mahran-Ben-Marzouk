'use client';

// Accessible labelled field: label, hint and error are all programmatically associated.
export default function Field({ id, label, hint, error, optionalLabel, children }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ivory">
        {label}
        {optionalLabel ? <span className="ms-2 font-normal text-steel">{optionalLabel}</span> : null}
      </label>
      {children({ id, 'aria-describedby': [hintId, errorId].filter(Boolean).join(' ') || undefined, 'aria-invalid': error ? 'true' : undefined })}
      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-steel">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-amber">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClass =
  'block min-h-[48px] w-full border border-ivory/20 bg-ink px-4 py-3 text-base text-ivory placeholder:text-steel/60 transition-colors focus:border-gold focus:outline-none aria-[invalid=true]:border-amber';
