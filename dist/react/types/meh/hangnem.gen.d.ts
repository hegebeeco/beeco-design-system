declare const _default: {
    readonly szerepek: {
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
    readonly pillanatok: {
        readonly udvozles: {
            readonly meh: "hazigazda";
            readonly valtozatok: readonly [{
                readonly poen: "Üdv a kaptárban!";
                readonly sima: "Jó, hogy itt vagy.";
            }, {
                readonly poen: "Zümm-zümm, szia!";
                readonly sima: "Kezdhetjük?";
            }];
        };
        readonly mentve: {
            readonly meh: "szurkolo";
            readonly valtozatok: readonly [{
                readonly poen: "Bekaptároztuk!";
                readonly sima: "Mentve.";
            }, {
                readonly poen: "Zümm, megvan!";
                readonly sima: "Elmentettük.";
            }, {
                readonly poen: "Mézbe mártva.";
                readonly sima: "A módosítás elmentve.";
            }];
        };
        readonly merfoldko: {
            readonly meh: "bajnok";
            readonly valtozatok: readonly [{
                readonly poen: "Ez igazi méhtett!";
                readonly sima: "Elértél egy mérföldkövet.";
            }, {
                readonly poen: "Népes a raj!";
                readonly sima: "Szép szám – gratulálunk.";
            }];
        };
        readonly ures: {
            readonly meh: "piheno";
            readonly valtozatok: readonly [{
                readonly poen: "Itt még nem zümmög semmi.";
                readonly sima: "Még nincs elem ebben a listában.";
            }, {
                readonly poen: "Csend a kaptárban.";
                readonly sima: "Még üres ez a lista.";
            }];
        };
        readonly "nincs-talalat": {
            readonly meh: "gondolkodo";
            readonly valtozatok: readonly [{
                readonly poen: "Zümm… erre nincs találat.";
                readonly sima: "Próbáld rövidebben, vagy ékezet nélkül.";
            }, {
                readonly poen: "Ezt a virágot nem találjuk.";
                readonly sima: "Nincs a keresésnek megfelelő elem.";
            }];
        };
        readonly toltes: {
            readonly meh: "futar";
            readonly valtozatok: readonly [{
                readonly poen: "Gyűjtjük a nektárt…";
                readonly sima: "Töltjük az adatokat.";
            }, {
                readonly poen: "Szorgos méhek dolgoznak rajta…";
                readonly sima: "Mindjárt kész.";
            }];
        };
        readonly "toltes-hosszu": {
            readonly meh: "futar";
            readonly valtozatok: readonly [{
                readonly poen: "Nagy a kaptár…";
                readonly sima: "Még dolgozunk rajta – ez tovább tart a szokásosnál.";
            }];
        };
        readonly visszavonhato: {
            readonly meh: "kacsinto";
            readonly valtozatok: readonly [{
                readonly poen: "Kirepült.";
                readonly sima: "Törölve – ha meggondoltad, visszavonhatod.";
            }];
        };
        readonly szerverhiba: {
            readonly meh: "szomoru";
            readonly valtozatok: readonly [{
                readonly poen: "Hoppá, elrepült a kapcsolat.";
                readonly sima: "Ez a mi hibánk. Próbáld újra egy perc múlva.";
            }];
        };
        readonly "munkamenet-lejart": {
            readonly meh: "piheno";
            readonly valtozatok: readonly [{
                readonly poen: "Elszundítottál?";
                readonly sima: "Lépj be újra – ott folytatod, ahol abbahagytad.";
            }];
        };
        readonly offline: {
            readonly meh: "gondolkodo";
            readonly valtozatok: readonly [{
                readonly poen: "Nincs térerő a kaptárban.";
                readonly sima: "Amint visszajön a kapcsolat, mentjük.";
            }];
        };
        readonly "nem-talalhato": {
            readonly meh: "kacsinto";
            readonly valtozatok: readonly [{
                readonly poen: "Ez az oldal kirepült.";
                readonly sima: "Nincs ilyen oldal – irány a kezdőlap.";
            }];
        };
        readonly "nincs-jogosultsag": {
            readonly meh: "gondolkodo";
            readonly valtozatok: readonly [{
                readonly poen: "Ez a kaptár zárva.";
                readonly sima: "Ehhez az oldalhoz nincs jogosultságod – kérd egy adminisztrátortól.";
            }];
        };
        readonly koszonjuk: {
            readonly meh: "halas";
            readonly valtozatok: readonly [{
                readonly poen: "Köszi, szorgos méhecske!";
                readonly sima: "Megkaptuk.";
            }];
        };
        readonly "uzenet-elkuldve": {
            readonly meh: "hirvivo";
            readonly valtozatok: readonly [{
                readonly poen: "Szárnyra kapott az üzenet!";
                readonly sima: "Elküldtük.";
            }];
        };
    };
};
export default _default;
