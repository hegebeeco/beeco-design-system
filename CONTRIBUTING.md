# Közreműködés – első PR-ed a beeco design systemhez

Ez a rövid útmutató az új önkéntes fejlesztőnek és tervezőnek szól. A szabályok teljes szövege a [dokumentációs oldalon](https://beeco-design-system.netlify.app/elso-nap.html) és a `docs/` mappában van; itt csak a sorrend áll.

## 1. Indulás (5 perc)

```sh
git clone https://github.com/hegebeeco/beeco-design-system.git
cd beeco-design-system
npm ci
```

Szükséges: Node 20 vagy újabb. Egy komponens gyors ellenőrzése, a teljes teszt előtt:

```sh
npm run check:egy -- <tesztlap | Komponens>     # például: npm run check:egy -- datum
```

## 2. Mielőtt bármit építesz

1. **Először a meglévőt keresd:** DS React-komponens, aztán `bc-` CSS-elem, aztán a projekt saját komponense.
2. **Új elem, új változat vagy új szabály csak jóváhagyással kerül be.** Javaslatlapot írj a `docs/javaslatok/_sablon.md` alapján. Ami nem kell javaslat: hibajavítás, a meglévő elem tokenhez igazítása, teszt és dokumentáció bővítése.
3. **Csak tokent vagy szerepet használj** (`var(--bc-ink)`, nem `#000`; `var(--bc-sp-4)`, nem `16px`). A [Szótár](https://beeco-design-system.netlify.app/szotar.html) megmondja, mi a bőr, a szerep és a token.

## 3. Komponens-recept (jóváhagyott elemhez)

| Lépés | Hol |
|---|---|
| 1. A komponens | `react/src/<mappa>/<Nev>.tsx`, kiexportálva a `react/src/index.ts`-ben |
| 2. A stílus | `termek/css/bc-*.css`, csak tokenekkel |
| 3. A tesztlap minden állapottal és szélső esettel | `react/tesztlapok/<nev>.tsx` (a `Grid` és `Case` keretével), bejegyezve a `termek/tesztlapok/lista.json`-ban |
| 4. A dokumentációs adat | `brandbook/elemek/komponensek.json`: mikor, mikor ne, így és ne így, anatómia, állapotok, billentyűk |
| 5. Generált fájlok | `npm run build` (a `dist/` és az `api/api.json` generált, kézzel nem szerkesztjük) |
| 6. Teljes ellenőrzés | `npm test` zöld (a komponens-önteszt a leghosszabb: kb. 9 perc, a CI három részre osztja) |
| 7. Változásnapló | `CHANGELOG.md`, a `## Készül` szakaszba |

A verziót és a címkét a `tools/kiadas.js` kezeli; ezt a karbantartó futtatja.

## 4. Pull request

- Rövid, magyar cím; a PR leírása mondja el, mit és miért.
- A PR-sablon jelölőnégyzeteit töltsd ki. Képernyőkép kell, ha a kinézet változik.
- A CI két részből áll (alap ellenőrzés és a komponens-önteszt három részben). Mindnek zöldnek kell lennie.

## 5. Kihez fordulj

A kapcsolattartó (e-mail vagy csatorna) még nincs megadva. Addig nyiss egy issue-t a repóban.
