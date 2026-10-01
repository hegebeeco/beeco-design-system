/** Csúszka – tiszta számolás (lépés, határ, billentyű, mutató-pozíció). */
export type SliderSpec = { min: number; max: number; step: number; bigStep: number };

/** Lépés tizedesjegyei (0,1-es lépésnél 1) – a lebegőpontos „0,30000000004” ellen */
const decimalsOf = (n: number) => (String(n).split('.')[1] ?? '').length;

export function snap(v: number, s: SliderSpec) {
  const k = Math.round((v - s.min) / s.step);
  const x = s.min + k * s.step;
  const d = Math.max(decimalsOf(s.step), decimalsOf(s.min));
  return Math.min(s.max, Math.max(s.min, Number(x.toFixed(d))));
}

/** A billentyű új értéke, vagy null, ha nem csúszka-billentyű. Nyilak: lépés · PageUp/Down: nagy lépés · Home/End: határ */
export function keyValue(key: string, v: number, s: SliderSpec): number | null {
  switch (key) {
    case 'ArrowRight': case 'ArrowUp': return snap(v + s.step, s);
    case 'ArrowLeft': case 'ArrowDown': return snap(v - s.step, s);
    case 'PageUp': return snap(v + s.bigStep, s);
    case 'PageDown': return snap(v - s.bigStep, s);
    case 'Home': return s.min;
    case 'End': return s.max;
    default: return null;
  }
}

/** Mutató x-koordinátájából érték (a sáv téglalapjához mérve) */
export function valueAt(clientX: number, rect: { left: number; width: number }, s: SliderSpec) {
  const k = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
  return snap(s.min + Math.min(1, Math.max(0, k)) * (s.max - s.min), s);
}

export const pctOf = (v: number, s: SliderSpec) => (s.max > s.min ? ((v - s.min) / (s.max - s.min)) * 100 : 0);

/** Alapértelmezett nagy lépés: a tartomány tizede, a lépéshez igazítva (legalább egy lépés) */
export const defaultBig = (min: number, max: number, step: number) => Math.max(step, Math.round((max - min) / 10 / step) * step);
