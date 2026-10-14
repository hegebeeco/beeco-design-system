# beeco.hu főoldal – Szuperhős méhecske (fs-)

Webflow-oldal: **Főoldal Szuperhős (draft)** (`/fooldal-szuperhos-draft`, page `6acd904f7d7e4ee067608742`).

## Felépítés (Designer-barát, mint a CsicsergŐsz)
- **Natív Webflow-elemek:** minden szöveg, kép, kártya, logó és GYIK-elem a Designerben szerkeszthető.
  A jelölés forrása: `webflow-jeloles.py` (szekciónként egy gyökérelem, `fs-` osztályokkal).
- **CSS:** az oldal tetején lévő HTML Embed-ekben (`embed/fs-N.min.css`). Forrás: `fs-alap.css` (a prototípusból
  átírva), `fs-ikonok.css` (maszkos piktogramok), `fs-extra.css` (Webflow-kiegészítés). Minden szabály a `.fs-oldal`
  burkolón belül érvényes, így a site többi oldalát nem érinti.
- **JS:** `fs.js` a jsDelivr-ről, commit-SHA-ra rögzítve, az oldal láblécében. Ez adja a méhecskét (hivatalos rig),
  a lábnyom-útvonalat, a funkcióválasztót, a lábnyom-vásznat, a „Kinek szól?” kvízt, az okos boltgombot,
  a ragadós mobilsávot, a sötét/világos kapcsolót és a mérést (`dataLayer`, `beeco_*` események).
  A teszt-domainen (webflow.io) egy „Mérés” gomb mutatja az eseményeket.

## Szerkesztés a Designerben
- A hero funkciói (`fs-funk`) és az app-képek (`fs-app-kep`) **sorrendje összetartozik** (Lábnyom, Térkép, Kuponok,
  Tudás, Programok, Nektár). A felirat szövege a funkción belüli rejtett `fs-funk-cim` / `fs-funk-szoveg` elemben van.
- A „Kinek szól?” három gombjának sorrendje: magánszemély, polgármester, vállalkozás. A kvíz szövegei a `fs.src.js`-ben.

## Építés
`node build.mjs` → `fs.css`, `embed/*.min.css`, `fs.js`. Embed-frissítés: `data_element_settings_tool` `set_settings`, kulcs `code`.

## 2. kör (2026-10-13)
- **CSS:** az új szabályok az `fs-extra-2.css`-ben vannak → `embed/fs-4.min.css` (4. HTML Embed az oldal tetején). Az 1–3. embed változatlan, így egy új kiegészítéshez csak a 4. embedet kell frissíteni.
- **Piktogramok:** `piko/*.svg` (kézzel rajzolt: matrica-család fekete-fehér, sárga család fekete-sárga), a Webflow-médiatárban `fs-piko-*.svg` néven; natív Image elemek (`fs-piko`), a Designerben cserélhetők.
- **Zöld 2050 háttér:** `kep/fs-zold-2050.svg` (médiatár: `fs-zold-2050.svg`), a hero első gyermeke (`fs-hero-taj`). Szélkerék, felhő, fa mozog benne; csökkentett mozgásnál áll.
- **Vélemények:** 7 valódi, 5 csillagos App Store-értékelés (RSS, 2026-10-13). Végtelen sáv: a JS duplikálja (a másolatok `inert` + `aria-hidden`), szüneteltető gomb mellette.
- **Közösség:** 4 fotó a médiatárból (polaroid), 4 nagy szám (felpörög, ha látszik). A 15 önkormányzat és a 12 partner a meglévő tartalomból jön – változáskor a szöveget kell átírni.
- **beebolt:** saját szekció (`#beebolt`). **beecopedia:** egyelőre lekerült az oldalról; visszatenni: `python3 webflow-jeloles.py pedia` → a `pedia` szekció HTML-je a `wf_szekciok.json`-ban.
- `lista.tsv`: a sajtó- és partnerlogók linkjei és képei (generátor-bemenet).

## 6. kör (2026-10-14)
- A Designerben közvetlenül módosítva (eredeti DOWNLOAD_BLOCK a hero-ban és a záróban, értékelés-linkek, 8 közösségi adat, chipek ki, beebolt-jel). **A `webflow-jeloles.py` ettől a körtől nem tükrözi a Designert**: új szekció-generáláskor előbb vissza kell vezetni ezeket.
- CSS: `fs-extra-3.css` → 5. embed. JS: jobb sávon lábnyom-jel (`fs-sin-jel`), kézi véleménysor (`fs-kezi`), a záró leszállási célja a `.footer_download` is.
- Fejléc-kód: `../kozos/horgony.js` (horgonygombok előzmény nélkül).
