// beeco design system 1.18.0 – GENERÁLT FÁJL, ne szerkeszd kézzel. Forrás: tokens/*.json, eszköz: tools/tokens-build.js
// A méhes pillanatok szövegei – forrás: tokens/hangnem.json
export default {
  "szerepek": {
    "hazigazda": {
      "kep": "bee-happy",
      "erzelem": "barátságos",
      "mikor": "belépés, első használat, üdvözlő kártya"
    },
    "kalauz": {
      "kep": "moods/help",
      "erzelem": "segítőkész",
      "mikor": "súgó, „Hogyan olvasd?”, bevezető túra"
    },
    "futar": {
      "kep": "bee-super",
      "erzelem": "lendületes",
      "mikor": "1 mp-nél hosszabb töltés, feltöltés, import, export"
    },
    "szurkolo": {
      "kep": "bee-cheer",
      "erzelem": "lelkes",
      "mikor": "sikeres mentés, első kupon, első partner"
    },
    "bajnok": {
      "kep": "moods/rank",
      "erzelem": "büszke",
      "mikor": "mérföldkő, sorsolás nyertese – ritkán"
    },
    "piheno": {
      "kep": "moods/rest",
      "erzelem": "nyugodt",
      "mikor": "üres lista, nincs teendő, lejárt munkamenet"
    },
    "gondolkodo": {
      "kep": "moods/think",
      "erzelem": "kíváncsi, nem szid",
      "mikor": "nincs találat, hibás adat, sikertelen művelet, nincs hálózat"
    },
    "hirvivo": {
      "kep": "bee-phone",
      "erzelem": "figyelmes",
      "mikor": "értesítések, üzenet-előnézet, e-mail-küldés"
    },
    "halas": {
      "kep": "moods/love",
      "erzelem": "meleg",
      "mikor": "jóváhagyás, visszajelzés, partner aktiválása"
    },
    "kacsinto": {
      "kep": "roles/kacsint",
      "erzelem": "játékos",
      "mikor": "visszavonás, 404, apró meglepetés"
    },
    "szomoru": {
      "kep": "bee-sad",
      "erzelem": "bocsánatkérő",
      "mikor": "CSAK a mi hibánk (szerverhiba, leállás) – soha a felhasználóé"
    },
    "tevekeny": {
      "kep": "moods/action",
      "erzelem": "tettre kész",
      "mikor": "valódi teendő a világban (pl. „nézd meg az appban”)"
    }
  },
  "pillanatok": {
    "udvozles": {
      "meh": "hazigazda",
      "valtozatok": [
        {
          "poen": "Üdv a kaptárban!",
          "sima": "Jó, hogy itt vagy."
        },
        {
          "poen": "Zümm-zümm, szia!",
          "sima": "Kezdhetjük?"
        }
      ]
    },
    "mentve": {
      "meh": "szurkolo",
      "valtozatok": [
        {
          "poen": "Bekaptároztuk!",
          "sima": "Mentve."
        },
        {
          "poen": "Zümm, megvan!",
          "sima": "Elmentettük."
        },
        {
          "poen": "Mézbe mártva.",
          "sima": "A módosítás elmentve."
        }
      ]
    },
    "merfoldko": {
      "meh": "bajnok",
      "valtozatok": [
        {
          "poen": "Ez igazi méhtett!",
          "sima": "Elértél egy mérföldkövet."
        },
        {
          "poen": "Népes a raj!",
          "sima": "Szép szám – gratulálunk."
        }
      ]
    },
    "ures": {
      "meh": "piheno",
      "valtozatok": [
        {
          "poen": "Itt még nem zümmög semmi.",
          "sima": "Még nincs elem ebben a listában."
        },
        {
          "poen": "Csend a kaptárban.",
          "sima": "Még üres ez a lista."
        }
      ]
    },
    "nincs-talalat": {
      "meh": "gondolkodo",
      "valtozatok": [
        {
          "poen": "Zümm… erre nincs találat.",
          "sima": "Próbáld rövidebben, vagy ékezet nélkül."
        },
        {
          "poen": "Ezt a virágot nem találjuk.",
          "sima": "Nincs a keresésnek megfelelő elem."
        }
      ]
    },
    "toltes": {
      "meh": "futar",
      "valtozatok": [
        {
          "poen": "Gyűjtjük a nektárt…",
          "sima": "Töltjük az adatokat."
        },
        {
          "poen": "Szorgos méhek dolgoznak rajta…",
          "sima": "Mindjárt kész."
        }
      ]
    },
    "toltes-hosszu": {
      "meh": "futar",
      "valtozatok": [
        {
          "poen": "Nagy a kaptár…",
          "sima": "Még dolgozunk rajta – ez tovább tart a szokásosnál."
        }
      ]
    },
    "visszavonhato": {
      "meh": "kacsinto",
      "valtozatok": [
        {
          "poen": "Kirepült.",
          "sima": "Törölve – ha meggondoltad, visszavonhatod."
        }
      ]
    },
    "szerverhiba": {
      "meh": "szomoru",
      "valtozatok": [
        {
          "poen": "Hoppá, elrepült a kapcsolat.",
          "sima": "Ez a mi hibánk. Próbáld újra egy perc múlva."
        }
      ]
    },
    "munkamenet-lejart": {
      "meh": "piheno",
      "valtozatok": [
        {
          "poen": "Elszundítottál?",
          "sima": "Lépj be újra – ott folytatod, ahol abbahagytad."
        }
      ]
    },
    "offline": {
      "meh": "gondolkodo",
      "valtozatok": [
        {
          "poen": "Nincs térerő a kaptárban.",
          "sima": "Amint visszajön a kapcsolat, mentjük."
        }
      ]
    },
    "nem-talalhato": {
      "meh": "kacsinto",
      "valtozatok": [
        {
          "poen": "Ez az oldal kirepült.",
          "sima": "Nincs ilyen oldal – irány a kezdőlap."
        }
      ]
    },
    "nincs-jogosultsag": {
      "meh": "gondolkodo",
      "valtozatok": [
        {
          "poen": "Ez a kaptár zárva.",
          "sima": "Ehhez az oldalhoz nincs jogosultságod – kérd egy adminisztrátortól."
        }
      ]
    },
    "koszonjuk": {
      "meh": "halas",
      "valtozatok": [
        {
          "poen": "Köszi, szorgos méhecske!",
          "sima": "Megkaptuk."
        }
      ]
    },
    "uzenet-elkuldve": {
      "meh": "hirvivo",
      "valtozatok": [
        {
          "poen": "Szárnyra kapott az üzenet!",
          "sima": "Elküldtük."
        }
      ]
    }
  }
} as const;
