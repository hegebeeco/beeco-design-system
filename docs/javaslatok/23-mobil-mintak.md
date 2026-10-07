# Javaslat 23 – Mobil minták: alsó navigáció, alsó lap, lebegő gomb, kuponjegy

*Állapot: **jóváhagyva** (Kristóf, 2026-10-07)*  
*Eredeti állapot: **javaslat** · készítette: Claude (a brand book MOBIL APP oldalához) · dátum: 2026-10-07*
*(Jóváhagyás után: **jóváhagyva** – lent a Döntés részben.)*

## 1. Igény
- **Hol kell:** a beeco mobil app (Flutter) – térkép, kezdőlap, kuponok, profil; a brand book MOBIL APP oldala (`brandbook/feluletek/app.json`).
- **Mit old meg:** a négy legjellegzetesebb mobil mintának ma nincs DS-leírása, csak az app saját widgetjei. Új app-képernyőnél (és a Flutter-átállásnál, `docs/app-atallas.md`) nincs mihez igazodni.
- **Mi van ma helyette:** az app saját widgetjei (alsó sáv, alsó lapok, sárga térképvezérlő, kuponjegy); a brand book képernyői (`brandbook/kepernyok/app-*.tsx`) ezeket csak a képernyő saját CSS-ével (`kp-` / `kpm-`) rajzolják újra – **nem DS-elemek**.

## 2. Mire épül (meglévő anyagok)
- DS-elemek: `bc-btn`, `bc-icon-btn` (44 px), `bc-badge`, `bc-card`, `bc-map-pin` / `markerHtml`, `Drawer` (oldalpanel, 600 px alatt teljes képernyős), `Modal`, `Tabs`, `SegmentedControl`, `--bc-tap`, `--bc-shadow-*`, `--bc-r-l`, `--bc-ease-drawer`.
- Szint: alsó navigáció – organizmus; alsó lap – organizmus (réteg); lebegő gomb – atom (a `bc-btn` változata); kuponjegy – molekula.

## 3. Változatok
| | A – csak leírás (szabály a brand bookban) | B – CSS-elem (`bc-tabbar`, `bc-sheet`, `bc-fab`, `bc-ticket`) | C – CSS-elem + Flutter-widget-specifikáció |
|---|---|---|---|
| Előny | nincs új kód | a webes felületek (PWA, partner telefonos nézet) is használhatják | az app és a web ugyanazt építi |
| Hátrány | nem ellenőrizhető gépileg | új elem karbantartása, tesztlapok kellenek | a legtöbb munka, Bence döntése is kell |

**Javaslat:** A most (a brand book DO / DON'T-jai elég iránymutatást adnak), és C a Flutter-átállással együtt – mert a minták ma csak az appban élnek.

## 4. Állapotok
- alsó navigáció: alap · aktív (`aria-current="page"`, méz kitöltés + félkövér felirat) · fókusz · értesítés-jelvény;
- alsó lap: csukott (csúcs) · félig nyitva · teljesen nyitva · töltés · hiba;
- lebegő gomb: alap · lenyomva (az árnyék helyére csúszik) · tiltott · folyamatban;
- kuponjegy: érvényes · hamarosan lejár · lejárt · beváltva · kiemelt.

## 5. Szélső esetek
- 320 px szélesség: az alsó navigáció 5 fülnél is elfér (felirat 12 px, nem tördel);
- hosszú partnernév a kuponjegyen (1 sor, levágás);
- az alsó lap nem takarhatja a kijelölt jelölőt (a térkép odébb görget);
- a lebegő gomb nem takarhatja az alsó navigációt és az alsó lap fő gombját.

## 6. API (vázlat, ha B/C)
```html
<nav class="bc-tabbar" aria-label="Fő menü"><a href="…" aria-current="page">…</a></nav>
<section class="bc-sheet" aria-labelledby="…"><span class="bc-sheet-handle"></span>…</section>
<button class="bc-btn bc-fab" aria-label="Saját helyem">…</button>
<article class="bc-ticket">…</article>
```

## 7. Hozzáférhetőség
- érintési felület ≥ 44 px (Flutter/Material: 48 dp), elemek között ≥ 8 px;
- az alsó lap fókuszt kap nyitáskor, Esc / Vissza zárja, a fogantyú mellett van látható bezárás-gomb is;
- az aktív fül nem csak színnel jelölt (kitöltés + félkövér + `aria-current`);
- a lebegő gombnak mindig van `aria-label`-je;
- a jelölő színe mellett betű vagy piktogram is mondja a fajtát (színtévesztőnek is).

## 8. Döntés (Kristóf tölti ki)
- Dátum: …
- Választott változat: …
- Megjegyzés / módosítás: …

## Döntés
- Kristóf, 2026-10-07: **jóváhagyva**, a mobilos kérdésekre adott javaslatokkal együtt (kijelölt chip mézben, egy méz fő gomb képernyőnként, a ranglista színei, a jelölők színezése, 44 px-es mobil sűrűség). A komponensek a hamarosan érkező Figma DS alapján frissülnek.
