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
