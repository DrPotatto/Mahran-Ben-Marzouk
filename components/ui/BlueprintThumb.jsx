// Lightweight SVG elevation drawings used as project-card thumbnails.
// They avoid mounting a WebGL canvas per card (only one heavy 3D scene is live at a time).

const s = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
  vectorEffect: 'non-scaling-stroke',
};

function Villa() {
  return (
    <g {...s}>
      <path d="M14 140H306" />
      <rect x="40" y="100" width="150" height="40" />
      <rect x="88" y="52" width="190" height="48" />
      <rect x="96" y="62" width="130" height="22" strokeDasharray="3 3" />
      <rect x="52" y="112" width="104" height="26" strokeDasharray="3 3" />
      <path d="M88 52h190M40 100h238" />
      <path d="M232 62v22M246 62v22M260 62v22" />
      <circle cx="298" cy="124" r="10" />
    </g>
  );
}

function Residential() {
  return (
    <g {...s}>
      <path d="M14 140H306" />
      <rect x="80" y="26" width="160" height="114" />
      {[48, 70, 92, 114].map((y) => (
        <path key={y} d={`M80 ${y}H240`} />
      ))}
      {[104, 136, 168, 200].map((x) =>
        [34, 56, 78, 100, 122].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="20" height="12" strokeDasharray="2 2" />)
      )}
      <rect x="68" y="20" width="184" height="6" />
    </g>
  );
}

function Frame() {
  const xs = [60, 130, 200, 270];
  const ys = [140, 100, 60, 20];
  return (
    <g {...s}>
      <path d="M14 144H306" />
      {xs.map((x) => (
        <path key={x} d={`M${x} 144V20M${x + 8} 144V20`} />
      ))}
      {ys.map((y) => (
        <path key={y} d={`M52 ${y}H286M52 ${y + 6}H286`} />
      ))}
      <path d="M50 144h30M120 144h30M190 144h30M260 144h30" strokeWidth="2.5" />
    </g>
  );
}

function Commercial() {
  return (
    <g {...s}>
      <path d="M14 140H306" />
      <rect x="50" y="44" width="220" height="96" />
      <path d="M40 90h240" />
      <rect x="58" y="98" width="204" height="42" strokeDasharray="3 3" />
      {Array.from({ length: 14 }).map((_, i) => (
        <path key={i} d={`M${64 + i * 14.5} 44V90`} />
      ))}
      <path d="M40 90l8-10h224l8 10" />
      <rect x="130" y="30" width="60" height="14" />
    </g>
  );
}

const MODELS = { villa: Villa, residential: Residential, frame: Frame, commercial: Commercial };

export default function BlueprintThumb({ model = 'villa', className = '' }) {
  const Drawing = MODELS[model] || Villa;
  return (
    <svg viewBox="0 0 320 160" aria-hidden="true" focusable="false" className={className}>
      <Drawing />
    </svg>
  );
}
