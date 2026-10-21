// Route-level loading state (shown while the page's client bundle streams in).
export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-screen items-center justify-center bg-ink">
      <span className="relative block h-12 w-12" aria-hidden="true">
        <span className="absolute inset-0 rounded-full border border-ivory/15" />
        <span className="absolute inset-0 animate-spin rounded-full border-t border-gold" />
      </span>
      <span className="sr-only">7DCONSTRUCTION — Chargement…</span>
    </div>
  );
}
