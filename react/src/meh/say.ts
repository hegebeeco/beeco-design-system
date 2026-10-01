import hangnem from './hangnem.gen';

export type Pillanat = keyof typeof hangnem.pillanatok;
export type Szerep = keyof typeof hangnem.szerepek;
export type Mondat = { poen: string; sima: string; meh: Szerep };

/**
 * say(pillanat) – a szövegkészlet egy változata (tokens/hangnem.json).
 * Mindig szóvicc + sima jelentés jön: a felület MINDKETTŐT kiírja (4A „fűszer”).
 * valtozat: fix sorszám (teszteléshez), különben a nap alapján forog – ugyanazon a napon ugyanaz, hogy ne villogjon.
 */
export function say(pillanat: Pillanat, valtozat?: number): Mondat {
  const p = hangnem.pillanatok[pillanat];
  const vs: ReadonlyArray<{ poen: string; sima: string }> = p.valtozatok;
  const n = vs.length;
  const i = valtozat ?? Math.floor(Date.now() / 86_400_000) % n;
  const v = vs[((i % n) + n) % n];
  return { poen: v.poen, sima: v.sima, meh: p.meh as Szerep };
}

/** A szerep leírása (mikor és milyen érzelemmel jön) – dokumentációhoz, tesztlaphoz */
export const szerepek = hangnem.szerepek;
export const pillanatok = Object.keys(hangnem.pillanatok) as Pillanat[];
