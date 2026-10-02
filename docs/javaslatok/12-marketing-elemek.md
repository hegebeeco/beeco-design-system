# Javaslat 12 – marketingoldal-elemek (hero, elválasztó, áruház, értékelés, ár, lépéslista)

*Állapot: **jóváhagyva** · Kristóf, 2026-10-02 · megvalósítva: `termek/css/bc-web.css`*

## 1. Igény

A beeco.hu főoldalát a valódi tartalomból, a DS-sel újraépítettük. A kész oldalon **27 sor saját
CSS maradt** a fej-kódban, és ez a lista pontosan megmondja, mi hiányzik: ami minden oldalon
újraíródik, az DS-elem.

| Amit kézzel kellett megírni | Mire |
|---|---|
| `.bc-sec + .bc-sec { border-top }` | szekciók elválasztása |
| `.hero-racs` | kétoszlopos oldalfejléc |
| `.lepcso` | számozott lépéslista |
| `.ar` | termék ára |
| áruház-gombok | App Store és Google Play |
| csillagos értékelés | „4,5 áruházi értékelés” |

Ezen felül **három osztályt feleslegesen** írtam meg (`sav-surface`, `sav-accent`, `sav-quiet`),
mert a `bc-sec.is-accent` és `.is-quiet` már létezett. Ez is tanulság: a hiánylistát mérni kell,
nem érezni.

## 2. Mire épül

Minden új elem a meglévő tokenekből és a meglévő `bc-` elemekből áll. **Nincs új token.**
A `bc-howto` a `bc-steps` mellé kerül, nem helyette: a `bc-steps` kompakt folyamatjelző
(hol tartok egy űrlapban), a `bc-howto` marketing-lépéslista (mit csinálj).

## 3. Az elemek

| Osztály | Mi | Változatok |
|---|---|---|
| `bc-sec.is-ruled` | vonal a szekció fölé | a szülőn `bc-ruled`: minden szekció közé |
| `bc-hero` | kétoszlopos oldalfejléc | `is-even` (fele-fele), `is-mirrored` (a kép balra) |
| `bc-stores` + `bc-store` | áruház-gombpár | `is-accent` (mézes elsődleges) |
| `bc-rating` | csillagos értékelés | `bc-rating-stars`, `-text`, `-sub` |
| `bc-price` | ár | `is-lg`, `bc-price-old` (áthúzott), `bc-price-note` |
| `bc-howto` | számozott lépéslista | `is-row` (vízszintes széles képernyőn) |

## 4. Hozzáférhetőségi döntések

- **`bc-hero.is-mirrored`** csak a megjelenést fordítja (`order`), a DOM-sorrendet nem.
  A képernyőolvasó és a billentyűzet így is a szöveget kapja előbb.
- **`bc-rating`**: a csillagsor díszítés, `aria-hidden`. Az értéket a `bc-rating-text` mondja ki
  olvasható alakban („4,5 az 5-ből”), mert a csillagok száma önmagában nem információ.
- **`bc-howto`** `<ol>`-ra kerül, a számot a CSS adja. A képernyőolvasó a lista saját sorszámát
  mondja, tehát a szám nem hangzik el kétszer.
- **`bc-store`** 56 px magas, tehát érintésre is bőven elég.

## 5. Szélső esetek

- Hosszú cím a hero-ban 320 px-en: nem lóghat ki, el kell törnie.
- `bc-stores` keskeny képernyőn: a két gomb egymás alá kerül, mindkettő teljes szélességű marad.
- `bc-howto` kétjegyű sorszámmal (10-nél több lépés): a kör mérete fix, a szám nem lóghat ki.
- `bc-price` hosszú összeggel („1 290 000 Ft”): nem törik el a szóköznél.
- `bc-rating` fél csillaggal: a fél csillagot a szöveg adja, nem rajzolunk fél alakzatot.
- Két egymást követő `is-ruled` szekció: ne duplázódjon a vonal.

## 6. Amit szándékosan NEM építettünk meg

**Hirdetménysáv** és **villogó akciós szalag**: a termékbőr visszafogott vonalával mennek szembe,
és egy ilyen elem puszta létezése csábítás a használatára.

**Tartalomkarusszel**: a `bc-slider` név foglalt (űrlap-csúszka), és a karusszel a leggyakrabban
félreértett elem. Előbb nézzük meg, kell-e tényleg, vagy elég egy vízszintesen görgethető sáv.

## 7. Mérés

A `tools/web-ellenor.js` mindegyiket nézi: 44 px érintés, kontraszt, kilógás 320 px-en, látható
fókusz, DS-en kívüli szín és sarok. A `tests/check-tokens.js` őrzi, hogy csak tokent használnak.
