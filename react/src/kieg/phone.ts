/**
 * Magyar telefonszám – tiszta logika (a PhoneField és a táblázatok kijelzése is ezt használja).
 * A belső érték a +36 utáni „nemzeti szám” (NSN) számjegyei; kifelé E.164: „+36301234567”.
 *   mobil: 20, 30, 31, 50, 70 + 7 jegy = 9 jegy → „30 123 4567”
 *   Budapest: 1 + 7 jegy = 8 jegy → „1 234 5678”
 *   vidéki vezetékes (és 80/90/91): 2 jegyű körzet + 6 jegy = 8 jegy → „52 123 456”
 *   21-es (helyfüggetlen) szám: 9 jegy → „21 123 4567”
 */
export type PhoneKind = 'mobil' | 'vezetekes' | 'ismeretlen';
export type PhoneInfo = {
  /** A +36 utáni számjegyek */
  digits: string;
  kind: PhoneKind;
  /** Hány jegy kell ennél a körzetnél (a körzet ismerete előtt 9) */
  need: number;
  /** Körzetszám / mobil-előhívó, ha már kiderült */
  area?: string;
  complete: boolean;
  valid: boolean;
};

export const MOBIL = ['20', '30', '31', '50', '70'];
// Földrajzi körzetszámok + zöld szám (80) és emelt díjas (90, 91)
const VIDEK = '22 23 24 25 26 27 28 29 32 33 34 35 36 37 42 44 45 46 47 48 49 52 53 54 55 56 57 59 62 63 66 68 69 72 73 74 75 76 77 78 79 82 83 84 85 87 88 89 92 93 94 95 96 99 80 90 91'.split(' ');
export const MAX_DIGITS = 9;

export function phoneInfo(digits: string): PhoneInfo {
  const d = digits.slice(0, MAX_DIGITS);
  let kind: PhoneKind = 'ismeretlen', need = MAX_DIGITS, area: string | undefined;
  if (d.startsWith('1')) { kind = 'vezetekes'; need = 8; area = '1'; }
  else if (d.length >= 2) {
    area = d.slice(0, 2);
    if (MOBIL.includes(area)) kind = 'mobil';
    else if (area === '21') kind = 'vezetekes';
    else if (VIDEK.includes(area)) { kind = 'vezetekes'; need = 8; }
  }
  const complete = d.length === need;
  return { digits: d, kind, need, area, complete, valid: complete && kind !== 'ismeretlen' };
}

/** Számjegyek csoportosítása gépelés közben is („3012” → „30 12”) */
export function formatNational(digits: string) {
  const i = phoneInfo(digits);
  const d = i.digits;
  const groups = d.startsWith('1') ? [1, 3, 4] : i.need === 8 ? [2, 3, 3] : [2, 3, 4];
  const out: string[] = [];
  let at = 0;
  for (const g of groups) { if (at >= d.length) break; out.push(d.slice(at, at + g)); at += g; }
  return out.join(' ');
}

export type ParsedPhone = { digits: string; foreign: boolean; letters: boolean; cropped: boolean };

/**
 * Beírt vagy beillesztett szövegből a +36 utáni számjegyek.
 * Felismeri: „+36 30 …”, „0036…”, „06 30 …”, „36301234567”, „(30) 123-4567”.
 * foreign: más ország hívószáma (+44 …) – ezt nem fogadjuk el; letters: volt benne betű; cropped: túl hosszú volt.
 */
export function parsePhone(text: string): ParsedPhone {
  const t = text.trim();
  const letters = /\p{L}/u.test(t);
  let d = t.replace(/\D/g, '');
  const plus = t.startsWith('+');
  if (plus || d.startsWith('00')) {
    const cc = plus ? d : d.slice(2);
    if (!cc.startsWith('36')) return { digits: '', foreign: cc.length > 0, letters, cropped: false };
    d = cc.slice(2);
  } else if (d.startsWith('06')) d = d.slice(2);
  else if (d.startsWith('36') && d.length >= 10) d = d.slice(2);
  const need = phoneInfo(d).need;
  return { digits: d.slice(0, need), foreign: false, letters, cropped: d.length > need };
}

/**
 * Gépelés közben: csak a számjegyek maradnak (a +36 előtag rögzített, a „+” nem kell);
 * a megszokásból beírt „06” / „0036” előtagot elhagyja. letters: betűt próbált beírni.
 */
export function typedDigits(raw: string) {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('0036')) d = d.slice(4);
  else if (d.startsWith('06')) d = d.slice(2);
  return { digits: d, letters: /\p{L}/u.test(raw) };
}

/** E.164 a szerver felé („+36301234567”); üres számnál üres szöveg */
export const toE164 = (digits: string) => (digits ? `+36${digits}` : '');

/** Kijelzés táblázatban, kártyán: „+36 30 123 4567” – ismeretlen formánál az eredeti szöveg */
export function formatHuPhone(value: string | null | undefined) {
  if (!value) return '';
  const p = parsePhone(value);
  return p.foreign || !p.digits ? value : `+36 ${formatNational(p.digits)}`;
}

/** Ellenőrző mondat (a hiba megmondja a következő lépést); undefined = rendben */
export function phoneProblem(i: PhoneInfo, want: 'barmely' | PhoneKind = 'barmely'): string | undefined {
  if (!i.digits) return undefined;
  if (i.digits.length >= 2 && i.kind === 'ismeretlen') return `Ismeretlen előhívó: ${i.area}. Mobil: 20, 30, 31, 50, 70 · Budapest: 1 · vidék: pl. 52.`;
  if (want === 'mobil' && i.kind === 'vezetekes') return 'Ide mobilszám kell: 20, 30, 31, 50 vagy 70 kezdetű.';
  if (want === 'vezetekes' && i.kind === 'mobil') return 'Ide vezetékes szám kell, pl. 1 234 5678 vagy 52 123 456.';
  if (!i.complete) {
    const left = i.need - i.digits.length;
    const pelda = i.need === 8 ? (i.area === '1' ? '1 234 5678' : '52 123 456') : '30 123 4567';
    return `Még ${left} számjegy hiányzik – így néz ki: ${pelda}.`;
  }
  return undefined;
}
