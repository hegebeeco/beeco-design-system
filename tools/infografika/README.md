# beeco infografika-generátor

Adatból egységes, márkahű infografikákat gyárt (PNG, 1080 px széles: 4:5, 1:1, 9:16).
Hét típus: rangsor, fánk, mozaik, összehasonlítás, nagy szám + egyenérték, ikonrács, pontskála.
Figura: a design system saját méhei (11 hangulat) és madarai (9), a felületen választható.

Hely: `tools/infografika/` a beeco design system repóban. Minden parancs ebből a mappából fut.

## Használat (nem fejlesztőknek)

1. Nyisd meg a `dist/beeco-infografika.html` fájlt böngészőben (vagy a publikált linket).
2. Tölts be egy mintát, írd át a szöveget és az adatokat.
3. „Mentés PNG-be”.

Új infografikához használd a briefet (lent). Forrás nélkül nem mentünk!

## Parancsok (fejlesztéshez)

| Parancs | Mit csinál |
|---|---|
| `npm install` és `npx playwright install chromium` | egyszeri előkészítés |
| `npm run dev` | helyi szerver a repó gyökeréből: http://localhost:4321/tools/infografika/ |
| `npm run build` | elkészíti az önálló `dist/beeco-infografika.html`-t |
| `npm test` | build + vizuális teszt: minden minta × minden formátum |
| `npm run test:update` | új alapképek, ha szándékosan változott a kinézet |

## Szerkezet

```
index.html            felület (a szkripteket sorban tölti be)
src/brand/tokens.css  ← a színek EGYETLEN helye
src/styles/           felület, poszter, diagramok
src/types/*.js        egy fájl = egy diagramtípus
src/presets.js        mintaadatok forrással
src/config.js         típusleírások, szeletkódok, formátumok
src/core/             állapot, segédfüggvények, renderelés, export
assets/               logó
src/figures.js        a figurák listája (a képek a DS-ben vannak, a build ágyazza be)
docs/tokenek.md       tokens.css vs. a DS tokenjei (D1, D2 döntéshez)
scripts/build.mjs     egyetlen HTML-be csomagol
tests/                vizuális regressziós tesztek
```

## Infografika-brief

```
Üzenet (1 mondat, amit a néző megjegyez):
Típus: rangsor / fánk / mozaik / összehasonlítás / nagy szám / ikonrács / pontskála
Adatok: megnevezés | érték | mértékegység  (soronként)
Forrás: szerző, év, cím + link vagy oldalszám/ábraszám
Kiemelés: mit akarunk kiemelni
Csavar / tanulság (a méh buboréka):
Formátum: 4:5 feed / 1:1 / 9:16 story
Ellenőrzés: nézd meg a forrást, és jelezd, ha valami nem stimmel
```
