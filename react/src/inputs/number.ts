/** Magyar számformátum: ezres tagolás szóközzel (keskeny szóköz nélkül, hogy gépelhető legyen), tizedes vessző. */
export function formatHu(n: number | null, decimals: number) {
  if (n === null || Number.isNaN(n)) return '';
  const fixed = decimals > 0 ? n.toFixed(decimals).replace(/0+$/, '').replace(/\.$/, '') : String(Math.round(n));
  const [int, frac] = fixed.split('.');
  const neg = int.startsWith('-');
  const digits = neg ? int.slice(1) : int;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (neg ? '-' : '') + grouped + (frac ? ',' + frac : '');
}

/** Beírt szövegből szám: vesszőt és pontot is tizedesjelnek vesz, a szóközt eldobja. Üres → null. */
export function parseHu(text: string): number | null {
  const t = text.replace(/\s/g, '').replace(',', '.');
  if (t === '' || t === '-' || t === '.' || t === '-.') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/**
 * Gépelés közbeni szűrő: csak számjegy, EGY tizedesjel (ha decimals > 0) és elöl mínusz (ha min < 0).
 * A tiltott karaktert el sem fogadja – a mező „letiltja” a helytelen bevitelt.
 */
export function sanitize(text: string, decimals: number, allowNegative: boolean) {
  let out = '';
  let sep = false;
  for (const ch of text) {
    if (/\d/.test(ch)) out += ch;
    else if (ch === ' ') out += ch;
    else if ((ch === ',' || ch === '.') && decimals > 0 && !sep) { out += ','; sep = true; }
    else if (ch === '-' && allowNegative && out.trim() === '') out += ch;
  }
  if (decimals > 0 && sep) {
    const [a, b = ''] = out.split(',');
    out = a + ',' + b.slice(0, decimals);
  }
  return out;
}

/** Tartomány szövegesen: „0–100 %”, „legalább 1 db”, „legfeljebb 5 000 Ft” */
export function numberRange(min?: number, max?: number, unit?: string, decimals = 0) {
  const u = unit ? ` ${unit}` : '';
  const f = (n: number) => formatHu(n, decimals);
  if (min !== undefined && max !== undefined) return `${f(min)}–${f(max)}${u}`;
  if (max !== undefined) return `legfeljebb ${f(max)}${u}`;
  if (min !== undefined) return `legalább ${f(min)}${u}`;
  return undefined;
}
