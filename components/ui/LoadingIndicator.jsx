// Accessible loading state used while heavy 3D modules download or initialise.
export default function LoadingIndicator({ label, className = '' }) {
  return (
    <div role="status" aria-live="polite" className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <span className="relative block h-10 w-10" aria-hidden="true">
        <span className="absolute inset-0 rounded-full border border-ivory/15" />
        <span className="absolute inset-0 animate-spin rounded-full border-t border-gold" />
      </span>
      <span className="font-mono text-[0.7rem] uppercase tracking-technical text-steel">{label}</span>
    </div>
  );
}
