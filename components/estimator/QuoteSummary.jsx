{/* Detailed breakdown */}
<section aria-labelledby="sum-detail">
  <h4 id="sum-detail" className="font-mono text-[0.7rem] uppercase tracking-technical text-gold">
    Détail ligne par ligne
  </h4>

  <div className="mt-4 overflow-x-auto">
    <table className="w-full text-left text-xs">
      <thead className="border-b border-ivory/20 text-steel">
        <tr>
          <th className="py-2 pe-4">Désignation</th>
          <th className="py-2 pe-4 text-end">Qté</th>
          <th className="py-2 pe-4 text-end">Matériau</th>
          <th className="py-2 pe-4 text-end">Main d’œuvre</th>
          <th className="py-2 text-end">Total</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-ivory/10">
        {estimate.lines.map((l) => (
          <tr key={l.id}>
            <td className="py-2 pe-4">
              <span className="text-ivory">{l.label}</span>
              {l.note && (
                <span className="block text-[0.65rem] text-steel">{l.note}</span>
              )}
            </td>
            <td className="py-2 pe-4 text-end font-mono text-ivory">
              {l.quantity} {l.unit}
            </td>
            <td className="py-2 pe-4 text-end font-mono text-steel">
              {money(l.material)}
            </td>
            <td className="py-2 pe-4 text-end font-mono text-steel">
              {money(l.labour)}
            </td>
            <td className="py-2 text-end font-mono text-ivory">
              {money(l.amount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

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
