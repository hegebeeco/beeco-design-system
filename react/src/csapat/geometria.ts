// Radar-geometria (a Kaptár src/lib/kerek.js-ből általánosítva): tengelyszög, pont, sokszög, címke-igazítás, címke-tördelés.

/** Az i-edik tengely szöge (radián): felülről indul, az óramutató járásával. */
export function tengelySzog(i: number, n: number): number {
  return -Math.PI / 2 + (2 * Math.PI * i) / n;
}

const ket = (x: number) => Math.round(x * 100) / 100;

export type RadarOpciok = { cx?: number; cy?: number; r?: number; max?: number };

/** Az i-edik tengelyen az `ertek` (0–max, a határra igazítva) pontja. Üres érték → a középpont. */
export function radarPont(i: number, n: number, ertek: number | null | undefined, { cx = 0, cy = 0, r = 100, max = 10 }: RadarOpciok = {}) {
  const arany = ertek === null || ertek === undefined || Number.isNaN(Number(ertek)) ? 0 : Math.max(0, Math.min(1, Number(ertek) / max));
  const szog = tengelySzog(i, n);
  return { x: ket(cx + Math.cos(szog) * r * arany), y: ket(cy + Math.sin(szog) * r * arany) };
}

/** SVG `points` szöveg egy értéksorból; a hiányzó (null) érték kimarad (nem nulla – nem húzzuk a középpontba). */
export function radarPoligon(ertekek: ReadonlyArray<number | null | undefined>, opciok?: RadarOpciok): string {
  return ertekek
    .map((e, i) => (e === null || e === undefined ? null : radarPont(i, ertekek.length, e, opciok)))
    .filter((p): p is { x: number; y: number } => p !== null)
    .map((p) => `${p.x},${p.y}`)
    .join(' ');
}

/** A tengelycímke vízszintes igazítása a szög szerint. */
export function cimkeIgazitas(i: number, n: number): 'start' | 'middle' | 'end' {
  const c = Math.cos(tengelySzog(i, n));
  if (Math.abs(c) < 0.2) return 'middle';
  return c > 0 ? 'start' : 'end';
}

/**
 * Címke tördelése legfeljebb `max` karakteres sorokra, legfeljebb `sorok` sorban; a szóköz nélküli hosszú szót kötőjellel vágja,
 * a túl hosszú címke utolsó sora „…”-ra végződik (a teljes név az aria-labelben és a listában megvan).
 */
export function cimkeTordeles(szoveg: string, max: number, sorok = 3): string[] {
  const m = Math.max(4, Math.floor(max));
  const ki: string[] = [];
  let cur = '';
  for (let w of String(szoveg).trim().split(/\s+/).filter(Boolean)) {
    while (w.length > m) {
      if (cur) { ki.push(cur); cur = ''; }
      ki.push(`${w.slice(0, m - 1)}-`);
      w = w.slice(m - 1);
    }
    if (!cur) cur = w;
    else if (cur.length + 1 + w.length <= m) cur += ` ${w}`;
    else { ki.push(cur); cur = w; }
  }
  if (cur) ki.push(cur);
  if (ki.length > sorok) {
    const v = ki.slice(0, sorok);
    v[sorok - 1] = `${v[sorok - 1].replace(/-$/, '').slice(0, m - 1)}…`;
    return v;
  }
  return ki;
}
