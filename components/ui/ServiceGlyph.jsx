// Small technical line-drawings — one distinct motif per service (decorative, aria-hidden).
// Drawn with currentColor hairlines so they follow the card's hover colour.

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
  strokeLinecap: 'square',
  vectorEffect: 'non-scaling-stroke',
};

function Blocks() {
  return (
    <g {...common}>
      <path d="M8 88H152" />
      <rect x="22" y="74" width="116" height="14" />
      <rect x="34" y="50" width="40" height="24" />
      <rect x="74" y="50" width="40" height="24" />
      <rect x="54" y="26" width="40" height="24" />
      <rect x="94" y="26" width="30" height="24" />
      <path d="M22 96H138M22 93V99M138 93V99" strokeDasharray="2 3" />
    </g>
  );
}

function Rebar() {
  const xs = [30, 50, 70, 90, 110, 130];
  const ys = [22, 42, 62, 82];
  return (
    <g {...common}>
      <rect x="18" y="12" width="124" height="82" strokeDasharray="3 3" />
      {xs.map((x) => (
        <path key={`v${x}`} d={`M${x} 12V94`} />
      ))}
      {ys.map((y) => (
        <path key={`h${y}`} d={`M18 ${y}H142`} />
      ))}
      {xs.flatMap((x) => ys.map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2" />))}
    </g>
  );
}

function Bricks() {
  const rows = [0, 1, 2, 3, 4];
  return (
    <g {...common}>
      {rows.map((r) => {
        const offset = r % 2 ? -18 : 0;
        return [0, 1, 2, 3, 4].map((c) => {
          const x = 20 + c * 36 + offset;
          const w = 36;
          const left = Math.max(x, 20);
          const right = Math.min(x + w, 140);
          if (right - left < 4) return null;
          return <rect key={`${r}-${c}`} x={left} y={18 + r * 14} width={right - left} height="14" />;
        });
      })}
      <path d="M12 92H148" />
    </g>
  );
}

function House() {
  return (
    <g {...common}>
      <path d="M20 90V52L80 18l60 34v38z" />
      <path d="M20 52h120" />
      <rect x="66" y="62" width="22" height="28" />
      <rect x="100" y="60" width="26" height="18" />
      <rect x="32" y="60" width="22" height="18" />
      <path d="M8 98H152M20 94V102M140 94V102" strokeDasharray="2 3" />
    </g>
  );
}

function Storefront() {
  return (
    <g {...common}>
      <rect x="22" y="22" width="116" height="68" />
      <path d="M14 40h132l-8-18H22z" />
      {[40, 58, 76, 94, 112].map((x) => (
        <path key={x} d={`M${x} 22V40`} />
      ))}
      <rect x="34" y="52" width="58" height="38" />
      <path d="M63 52v38" />
      <rect x="104" y="52" width="22" height="38" />
      <path d="M8 92H152" />
    </g>
  );
}

function Renovate() {
  return (
    <g {...common}>
      <path d="M20 90V40h46v50" strokeDasharray="3 3" />
      <path d="M66 90V28h58v62z" />
      {[40, 54, 68, 82].map((y) => (
        <path key={y} d={`M66 ${y}H124`} />
      ))}
      <path d="M124 52h22M138 44l8 8-8 8" />
      <path d="M8 92H152" />
    </g>
  );
}

function Trowel() {
  return (
    <g {...common}>
      <path d="M26 20h108v70H26z" />
      {[34, 48, 62, 76].map((y) => (
        <path key={y} d={`M26 ${y}H134`} strokeDasharray="1 4" />
      ))}
      <path d="M52 76l34-30 10 10-34 30z" />
      <path d="M96 56l24-24" />
      <path d="M118 30l10 10" strokeWidth="2.5" />
    </g>
  );
}

function Crane() {
  return (
    <g {...common}>
      <path d="M44 94V14M56 94V14" />
      {[24, 38, 52, 66, 80].map((y) => (
        <path key={y} d={`M44 ${y}L56 ${y - 14}M56 ${y}L44 ${y - 14}`} />
      ))}
      <path d="M20 14H140M44 14L20 26M56 14V6" />
      <path d="M118 14V44" strokeDasharray="2 2" />
      <rect x="110" y="44" width="16" height="10" />
      <rect x="84" y="62" width="48" height="32" />
      <path d="M84 78h48M108 62v32" />
      <path d="M8 96H152" />
    </g>
  );
}

const MOTIFS = {
  blocks: Blocks,
  rebar: Rebar,
  bricks: Bricks,
  house: House,
  storefront: Storefront,
  renovate: Renovate,
  trowel: Trowel,
  crane: Crane,
};

export default function ServiceGlyph({ accent, className = '' }) {
  const Motif = MOTIFS[accent] || Blocks;
  return (
    <svg viewBox="0 0 160 104" aria-hidden="true" focusable="false" className={className}>
      <Motif />
    </svg>
  );
}
