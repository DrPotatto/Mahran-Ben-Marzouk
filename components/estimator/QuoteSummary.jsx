{/* Detailed breakdown */}
<section aria-labelledby="sum-detail">
  <h4 id="sum-detail" className="font-mono text-[0.7rem] uppercase tracking-technical text-gold">
    Détail ligne par ligne
  </h4>

  {/* ... (your existing table for lines) ... */}

  {/* Transparent totals */}
  <dl className="mt-6 space-y-2 border-t border-ivory/20 pt-4 text-sm">
    <div className="flex justify-between">
      <dt className="text-steel">Sous-total matériaux + main d’œuvre</dt>
      <dd className="font-mono text-ivory">{money(estimate.subtotal)}</dd>
    </div>
    <div className="flex justify-between">
      <dt className="text-steel">
        Frais de chantier ({(estimate.assumptions.siteOverheadRate * 100).toFixed(0)} %)
      </dt>
      <dd className="font-mono text-ivory">{money(estimate.siteOverhead)}</dd>
    </div>
    <div className="flex justify-between">
      <dt className="text-steel">
        Gestion & bénéfice entreprise ({(estimate.assumptions.profitRate * 100).toFixed(0)} %)
      </dt>
      <dd className="font-mono text-ivory">{money(estimate.profit)}</dd>
    </div>
    {estimate.extraLines.map((e) => (
      <div key={e.id} className="flex justify-between">
        <dt className="text-steel">{e.label}</dt>
        <dd className="font-mono text-ivory">{money(e.amount)}</dd>
      </div>
    ))}
    {/* NEW: Engineering fees */}
    <div className="flex justify-between">
      <dt className="text-steel">
        Honoraires d’ingénierie ({(estimate.assumptions.engStudyPercent * 100).toFixed(0)} % + forfait OIT)
      </dt>
      <dd className="font-mono text-ivory">{money(estimate.engStudyFee)}</dd>
    </div>
    <div className="flex justify-between">
      <dt className="text-steel">
        Imprévus ({(estimate.assumptions.contingencyRate * 100).toFixed(0)} %)
      </dt>
      <dd className="font-mono text-ivory">{money(estimate.contingency)}</dd>
    </div>
    <div className="flex justify-between border-t border-gold/50 pt-3 text-base font-semibold">
      <dt className="text-ivory">Total HT</dt>
      <dd className="font-mono text-gold">{money(estimate.total)}</dd>
    </div>
  </dl>
</section>
