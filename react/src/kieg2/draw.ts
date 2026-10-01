/** Egy résztvevő. A nevet a projekt adja, már a megjelenítendő (pl. részben takart) alakban: „Kiss A.”, „a***@gmail.com”. */
export type DrawParticipant = { id: string; name: string; detail?: string };

/** Egy sorsolás jegyzőkönyvi sora */
export type DrawRecord = {
  winner: DrawParticipant;
  at: Date;
  /** Hányadik húzás (1 = első, 2+ = újrasorsolás) */
  attempt: number;
  /** Újrasorsolás oka (az elsőnél nincs) */
  reason?: string;
  /** A DS saját véletlenjével húzott (nem a projekt sorsolója) – csak tesztre */
  test: boolean;
  /** Hány résztvevő közül húzott */
  poolSize: number;
};

/**
 * A felfedés ütemezése (ms): lassuló „méhsejt-töltés”, lépésenként ≤ 600 ms, összesen ≤ 2,5 s a pecséttel együtt
 * (Javaslat 05: ünnepi pillanat ≤ 600 ms és egyszer). Csökkentett mozgásnál nincs lépés: azonnal a nyertes.
 */
export const REVEAL_STEPS: ReadonlyArray<number> = [110, 150, 210, 290, 400, 540];
/** A nyertes-pecsét hossza (bc-anim-stamp) */
export const STAMP_MS = 400;
export const REVEAL_TOTAL_MS = REVEAL_STEPS.reduce((a, b) => a + b, 0) + STAMP_MS;

/**
 * TESZT-sorsolás: egyenletes véletlen index a böngésző kriptográfiai véletlenjével (crypto.getRandomValues),
 * elutasításos mintavétellel, hogy egyik résztvevő se legyen esélyesebb (modulo-torzítás nélkül).
 * Éles sorsoláshoz a projekt saját, naplózott (szerveroldali) sorsolója kell – a DS ezt csak tartaléknak adja.
 */
export function cryptoIndex(n: number): number {
  if (!Number.isInteger(n) || n < 1) throw new Error('Üres résztvevő-lista');
  if (n === 1) return 0;
  const limit = Math.floor(0x1_0000_0000 / n) * n;
  const buf = new Uint32Array(1);
  for (;;) { crypto.getRandomValues(buf); if (buf[0] < limit) return buf[0] % n; }
}

/** A futó szalagon látszó nevek (csak látvány, NEM a sorsolás): determinisztikus lépésköz, hogy ne ismétlődjön egymás után */
export function tickerNames(pool: ReadonlyArray<DrawParticipant>, count: number): string[] {
  if (!pool.length) return [];
  const stride = pool.length > 7 ? 7 : 1;
  return Array.from({ length: count }, (_, i) => pool[(i * stride) % pool.length].name);
}

/** Idő magyarul a jegyzőkönyvbe: „14:05:09” */
export const drawTime = (d: Date) => d.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
