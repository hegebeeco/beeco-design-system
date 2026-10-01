/** Grafikon-jelek: sorozat-színosztály, pont-alakok (■ ● ▲ ◆), jelmagyarázat-minta, sáv-mintázat. Szín csak --bc-data-* tokenből (bc-adat.css). */

/** Sorozat színosztálya: s1 … s8 (a színtévesztő-barát módban más sorrend – bc-adat.css) */
export const sc = (i: number) => `bc-s${(i % 8) + 1}`;

export type Shape = 'circle' | 'square' | 'triangle' | 'diamond';
const SHAPES: Shape[] = ['circle', 'square', 'triangle', 'diamond'];
export const shapeOf = (i: number) => SHAPES[i % SHAPES.length];

/** Pont-jel: a sorozat alakja is más, nem csak a színe; kontúr a line színnel */
export function Marker({ x, y, i, r = 5 }: { x: number; y: number; i: number; r?: number }) {
  const cls = `bc-mark ${sc(i)}`;
  switch (shapeOf(i)) {
    case 'square': return <rect className={cls} x={x - r} y={y - r} width={r * 2} height={r * 2} />;
    case 'triangle': return <path className={cls} d={`M${x} ${y - r * 1.2}L${x + r * 1.1} ${y + r * 0.8}H${x - r * 1.1}Z`} />;
    case 'diamond': return <path className={cls} d={`M${x} ${y - r * 1.3}L${x + r * 1.1} ${y}L${x} ${y + r * 1.3}L${x - r * 1.1} ${y}Z`} />;
    default: return <circle className={cls} cx={x} cy={y} r={r} />;
  }
}

/** Jelmagyarázat-minta (16×16): oszlop = négyzet, vonal = vonal + pont-alak, sáv = csíkos (rejtett / hiányzó) */
export function Swatch({ i, kind }: { i: number; kind: 'bar' | 'line' | 'gap' }) {
  return (
    <svg className="bc-swatch" viewBox="0 0 24 16" width="24" height="16" aria-hidden="true">
      {kind === 'gap' && <rect className="bc-gap-swatch" x="1" y="1" width="22" height="14" rx="2" />}
      {kind === 'bar' && <rect className={`bc-mark ${sc(i)}`} x="5" y="1.5" width="14" height="13" />}
      {kind === 'line' && (<><path className="bc-line-under" d="M1 8H23" /><path className={`bc-line ${sc(i)}`} d="M1 8H23" /><Marker x={12} y={8} i={i} r={4} /></>)}
    </svg>
  );
}

/** Csíkos minta a hiányzó / rejtett sávhoz (nem nulla!) – id egyedi grafikononként */
export function GapPattern({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect className="bc-gap-bg" width="8" height="8" />
        <path className="bc-gap-line" d="M0 0V8" />
      </pattern>
    </defs>
  );
}
