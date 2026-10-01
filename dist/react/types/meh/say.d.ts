import hangnem from './hangnem.gen';
export type Pillanat = keyof typeof hangnem.pillanatok;
export type Szerep = keyof typeof hangnem.szerepek;
export type Mondat = {
    poen: string;
    sima: string;
    meh: Szerep;
};
/**
 * say(pillanat) – a szövegkészlet egy változata (tokens/hangnem.json).
 * Mindig szóvicc + sima jelentés jön: a felület MINDKETTŐT kiírja (4A „fűszer”).
 * valtozat: fix sorszám (teszteléshez), különben a nap alapján forog – ugyanazon a napon ugyanaz, hogy ne villogjon.
 */
export declare function say(pillanat: Pillanat, valtozat?: number): Mondat;
/** A szerep leírása (mikor és milyen érzelemmel jön) – dokumentációhoz, tesztlaphoz */
export declare const szerepek: {
    readonly hazigazda: {
        readonly kep: "bee-happy";
        readonly erzelem: "barátságos";
        readonly mikor: "belépés, első használat, üdvözlő kártya";
    };
    readonly kalauz: {
        readonly kep: "moods/help";
        readonly erzelem: "segítőkész";
        readonly mikor: "súgó, „Hogyan olvasd?”, bevezető túra";
    };
    readonly futar: {
        readonly kep: "bee-super";
        readonly erzelem: "lendületes";
        readonly mikor: "1 mp-nél hosszabb töltés, feltöltés, import, export";
    };
    readonly szurkolo: {
        readonly kep: "bee-cheer";
        readonly erzelem: "lelkes";
        readonly mikor: "sikeres mentés, első kupon, első partner";
    };
    readonly bajnok: {
        readonly kep: "moods/rank";
        readonly erzelem: "büszke";
        readonly mikor: "mérföldkő, sorsolás nyertese – ritkán";
    };
    readonly piheno: {
        readonly kep: "moods/rest";
        readonly erzelem: "nyugodt";
        readonly mikor: "üres lista, nincs teendő, lejárt munkamenet";
    };
    readonly gondolkodo: {
        readonly kep: "moods/think";
        readonly erzelem: "kíváncsi, nem szid";
        readonly mikor: "nincs találat, hibás adat, sikertelen művelet, nincs hálózat";
    };
    readonly hirvivo: {
        readonly kep: "bee-phone";
        readonly erzelem: "figyelmes";
        readonly mikor: "értesítések, üzenet-előnézet, e-mail-küldés";
    };
    readonly halas: {
        readonly kep: "moods/love";
        readonly erzelem: "meleg";
        readonly mikor: "jóváhagyás, visszajelzés, partner aktiválása";
    };
    readonly kacsinto: {
        readonly kep: "roles/kacsint";
        readonly erzelem: "játékos";
        readonly mikor: "visszavonás, 404, apró meglepetés";
    };
    readonly szomoru: {
        readonly kep: "bee-sad";
        readonly erzelem: "bocsánatkérő";
        readonly mikor: "CSAK a mi hibánk (szerverhiba, leállás) – soha a felhasználóé";
    };
    readonly tevekeny: {
        readonly kep: "moods/action";
        readonly erzelem: "tettre kész";
        readonly mikor: "valódi teendő a világban (pl. „nézd meg az appban”)";
    };
};
export declare const pillanatok: Pillanat[];
