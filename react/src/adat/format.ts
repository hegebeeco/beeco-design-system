import { formatHu } from '../inputs/number';
import { norm } from '../pickers/normalize';

/** Magyar számformátum (1 234,5) – null/NaN → „–”. A tizedesek száma legfeljebb `decimals`, a felesleges 0 elmarad. */
export function fmt(n: number | null | undefined, decimals = 0) {
  if (n === null || n === undefined || Number.isNaN(n)) return '–';
  return formatHu(n, decimals).replace('-', '−').replace(/ /g, '\u00a0'); // nem törhető ezres tagolás
}

/** Előjeles szám (+12, −3,5) – a változás-kijelzéshez */
export const fmtSigned = (n: number, decimals = 0) => (n > 0 ? '+' : '') + fmt(n, decimals);

/** Ékezet- és kisbetű-független szöveg-egyezés („kave” → „Kávézó”) – szűrőkhöz, keresőhöz. Csak szóköz = nincs szűrés. */
export function matchText(haystack: string, query: string) {
  const q = norm(query.trim());
  return !q || norm(haystack).includes(q);
}

/**
 * „Szép” tengelybeosztás: 1 / 2 / 5 × 10^k lépés, a 0 mindig benne (oszlopnál a tengely 0-tól indul).
 * Minden érték 0 vagy nincs adat → 0–1 skála (nem osztunk nullával).
 */
export function niceTicks(min: number, max: number, count = 5) {
  let lo = Math.min(0, min), hi = Math.max(0, max);
  if (hi === lo) hi = lo + 1;
  const raw = (hi - lo) / Math.max(1, count);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
  lo = Math.floor(lo / step) * step;
  hi = Math.ceil(hi / step) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.abs(v) < step / 1e6 ? 0 : +v.toFixed(10));
  const decimals = step >= 1 ? 0 : Math.min(4, Math.ceil(-Math.log10(step)));
  return { lo, hi, step, ticks, decimals };
}

/** Lineáris leképezés [d0, d1] → [r0, r1] */
export const linear = (d0: number, d1: number, r0: number, r1: number) => (v: number) => r0 + ((v - d0) / (d1 - d0 || 1)) * (r1 - r0);

/** Minden hányadik tengelyfeliratot írjuk ki, hogy ne érjenek össze (30 / 90 / 365 nap) */
export const labelEvery = (count: number, width: number, minPx: number) => Math.max(1, Math.ceil((count * minPx) / Math.max(1, width)));

/** Hosszú címke rövidítése „…”-val (a teljes szöveg <title>-ben és az adattáblában marad) */
export const clip = (s: string, max: number) => (s.length > max ? s.slice(0, Math.max(1, max - 1)).trimEnd() + '…' : s);

/** Lapozó számai: 1 … 4 5 6 … 13 – a „…” helyén null */
export function pageList(page: number, total: number, siblings = 1): Array<number | null> {
  if (total <= 5 + siblings * 2) return Array.from({ length: total }, (_, i) => i);
  const from = Math.max(1, page - siblings), to = Math.min(total - 2, page + siblings);
  const out: Array<number | null> = [0];
  if (from > 1) out.push(null);
  for (let i = from; i <= to; i++) out.push(i);
  if (to < total - 2) out.push(null);
  out.push(total - 1);
  return out;
}
