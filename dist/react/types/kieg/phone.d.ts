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
export declare const MOBIL: string[];
export declare const MAX_DIGITS = 9;
export declare function phoneInfo(digits: string): PhoneInfo;
/** Számjegyek csoportosítása gépelés közben is („3012” → „30 12”) */
export declare function formatNational(digits: string): string;
export type ParsedPhone = {
    digits: string;
    foreign: boolean;
    letters: boolean;
    cropped: boolean;
};
/**
 * Beírt vagy beillesztett szövegből a +36 utáni számjegyek.
 * Felismeri: „+36 30 …”, „0036…”, „06 30 …”, „36301234567”, „(30) 123-4567”.
 * foreign: más ország hívószáma (+44 …) – ezt nem fogadjuk el; letters: volt benne betű; cropped: túl hosszú volt.
 */
export declare function parsePhone(text: string): ParsedPhone;
/**
 * Gépelés közben: csak a számjegyek maradnak (a +36 előtag rögzített, a „+” nem kell);
 * a megszokásból beírt „06” / „0036” előtagot elhagyja. letters: betűt próbált beírni.
 */
export declare function typedDigits(raw: string): {
    digits: string;
    letters: boolean;
};
/** E.164 a szerver felé („+36301234567”); üres számnál üres szöveg */
export declare const toE164: (digits: string) => string;
/** Kijelzés táblázatban, kártyán: „+36 30 123 4567” – ismeretlen formánál az eredeti szöveg */
export declare function formatHuPhone(value: string | null | undefined): string;
/** Ellenőrző mondat (a hiba megmondja a következő lépést); undefined = rendben */
export declare function phoneProblem(i: PhoneInfo, want?: 'barmely' | PhoneKind): string | undefined;
