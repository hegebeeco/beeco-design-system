import hangnem from '../../../tokens/hangnem.json';
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
    hazigazda: {
        kep: string;
        erzelem: string;
        mikor: string;
    };
    kalauz: {
        kep: string;
        erzelem: string;
        mikor: string;
    };
    futar: {
        kep: string;
        erzelem: string;
        mikor: string;
    };
    szurkolo: {
        kep: string;
        erzelem: string;
        mikor: string;
    };
    bajnok: {
        kep: string;
        erzelem: string;
        mikor: string;
    };
    piheno: {
        kep: string;
        erzelem: string;
        mikor: string;
    };
    gondolkodo: {
        kep: string;
        erzelem: string;
        mikor: string;
    };
    hirvivo: {
        kep: string;
        erzelem: string;
        mikor: string;
    };
    halas: {
        kep: string;
        erzelem: string;
        mikor: string;
    };
    kacsinto: {
        kep: string;
        erzelem: string;
        mikor: string;
    };
    szomoru: {
        kep: string;
        erzelem: string;
        mikor: string;
    };
    tevekeny: {
        kep: string;
        erzelem: string;
        mikor: string;
    };
};
export declare const pillanatok: Pillanat[];
