# Perszóna-súlyok kalibrálása

A `research/personas/personas.json` `weight` mezője mondja meg, hogy egy perszóna mekkora arányban képviseli a valós forgalmat. A jelentés (`report.mjs`) ezzel súlyozza a Hatékonysági indexet.

## Állapot (2026-10-16): ideiglenes súlyok
- **Clarity (MCP).** 2026-10-14 és 10-16 között összesen 2 munkamenet volt (`/szolgaltatas/partner-oldal`, `/letoltes`), a `/kampanyok/csicsergosz` oldalon egy sem.
  - A Clarity tehát vagy nincs kint az oldalakon, vagy csak néhány oldalon fut. Kalibrálásra így nem használható.
  - **Teendő Kristófnak:** ellenőrizni, kint van-e a Clarity-kód a Webflow site szintű fejlécében.
- **GA4** (G-6KVDRD0YQF): az MCP-n nem érhető el. Ha lesz export vagy hozzáférés, ez a fő forrás.
- **Addig a súlyok becsültek:**
  - lakossági mobil-túlsúly;
  - a kampányoldal célcsoportjai a brandbook és a kampány alapján;
  - a B2B kis súllyal.
  - A jelentés ezt jelzi.

## Kalibrálás menete (ha van adat)
1. **Eszközarány** (mobil / asztal) oldalanként, 28 napra. Ehhez igazítsd a perszónák `device.type` szerinti súlyösszegét.
2. **Forrás** (social / search / direct / email / qr). A QR-forgalmat az `utm_medium=qr` jelöli. Ehhez igazítsd az `arrival.channel` szerinti összegeket.
3. **Új vagy visszatérő látogató.** Ez a kezdő és a haladó perszónák aránya.
4. **Elakadás-validálás.** Ugyanarra az oldalra a Clarity dead click / rage click / quickback listája és a szintetikus futások holtpontjai között legyen átfedés. Ha a valós elakadást egyik perszóna sem találja meg, hiányzik egy perszóna vagy egy feladat.
5. **A súlyok összege legyen 1.** Írd be a dátumot és a forrást a `personas.json` `_about` mezőjébe.

Hasznos Clarity-lekérdezések (`mcp__Microsoft_Clarity__query-analytics-dashboard`, legfeljebb 3 nap):
- „Sessions by device type for pages containing <útvonal> in the last 3 days”
- „Sessions by channel and source for pages containing <útvonal> in the last 3 days”
- „Dead clicks, rage clicks and quickbacks by element for <útvonal> in the last 3 days”

Személyes adatot (munkamenet-azonosító, IP, város) ne ments a repóba, csak arányokat.
