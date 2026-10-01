import { formatLatLng, HU_OUTLINE, inHungary, MINI, project, type LatLng } from './geo';

/**
 * Tartalék mini-térkép (06b/13): ha a projekt nem ad térképet (renderMap), ez mutatja, nagyjából hol a pont.
 * Statikus SVG, hálózati kérés nélkül: Magyarország vázlatos körvonala + tű. Díszítő-tájékoztató, nem kattintható.
 */
export function MiniMap({ point }: { point: LatLng | null }) {
  const outline = HU_OUTLINE.map(([lng, lat]) => { const p = project({ lat, lng }); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(' ');
  const pin = point ? project(point) : null;
  const inside = !!pin && pin.x >= 0 && pin.x <= MINI.w && pin.y >= 0 && pin.y <= MINI.h;
  const name = point
    ? `Vázlatos előnézet: ${formatLatLng(point)}${inHungary(point) ? '' : inside ? ' – Magyarországon kívül' : ' – a vázlaton kívül esik'}`
    : 'Vázlatos előnézet: még nincs kiválasztott pont';
  return (
    <figure className="bc-loc-mini">
      <svg viewBox={`0 0 ${MINI.w} ${MINI.h}`} role="img" aria-label={name} preserveAspectRatio="xMidYMid meet">
        <polygon className="bc-loc-mini-land" points={outline} />
        {pin && inside && (
          <g className="bc-loc-mini-pin" transform={`translate(${pin.x.toFixed(1)} ${pin.y.toFixed(1)})`}>
            <path d="M0 0 C -2 -4 -6 -7 -6 -11 A 6 6 0 1 1 6 -11 C 6 -7 2 -4 0 0 Z" />
            <circle cy="-11" r="2.2" />
          </g>
        )}
      </svg>
      <figcaption className="bc-loc-mini-cap">
        {!point ? 'Még nincs pont – keress címet, vagy írd be a koordinátákat.' : !inside ? 'A pont a vázlaton kívül esik.' : 'Vázlatos előnézet – a pontos helyet a koordináták adják.'}
      </figcaption>
    </figure>
  );
}
