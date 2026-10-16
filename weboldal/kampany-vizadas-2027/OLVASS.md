# Önkéntes vízadás – szezonzáró oldal (2026 → 2027 május)

A 2026-os szezon 2026. október 13-án zárult, a kampány 2027 májusában indul újra. Ez az oldal a köszönetet, az eredményeket (a 2026. októberi záró közlemény végleges számaival), az év vízadóját, a 2027-es tervezést, a sajtóblokkot és a „szólj, ha indulunk” feliratkozást (#levelke, a lábléc hírlevél-blokkja) viszi.

## Szerep (2026-10-15 óta)
Ez a `/kampanyok/onkentes-vizadas` végleges, egész évben élő oldala: **emlékoldal** (a 2026-os siker), **2027-es kapu** (májusi újraindulás, feliratkozás) és **upsell** önkormányzatoknak és cégeknek. Ide érkeznek a QR-kódos anyagok és az „önkéntes vízadás” keresések.

Sorrend (Kristóf rendezése, 2026-10-16): qr-sáv › hero (1 000 000+) › a nyár képekben › eredmények + Berlin-összevetés › az év vízadója › 2027-terv › Csatlakozz (lakos / település / cég) › partnerek › **DS · Ajánlatkérés** (komponens-példány) › országos összefogás › miért fontos › GYIK › záró.

Arculat: Ági Vízadás-arculata. Tokenek: `tokens.json` (= a Webflow „Vizadas” változógyűjtemény), leírás: Brand Book › Kampány-altéma: Önkéntes Vízadás (`docs-site/brand/kampany-altema-vizadas.json`).

QR: ha az URL-ben `utm_medium=qr|print|offline|plakat|matrica|szorolap` vagy az `utm_source`-ban qr/plakat/matrica/szorolap van, az ov.js megmutatja a sávot (`ov_qr_erkezes`). Ajánlott QR-URL: `/kampanyok/onkentes-vizadas?utm_source=plakat&utm_medium=qr&utm_campaign=onkentes-vizadas`.
Mérés: `ov_cta_kattintas` (`data-ov-cta` = hely), `ov_qr_erkezes`, `ov_eredmenyek_megjelenes`, `ov_ontozes`, `ov_bolt_kattintas`, `ov_gyik_nyitas`. Minőségkapu: `landing_review.mjs … --config review-szabalyok.json`.

## Felépítés (Designer-barát, mint a CsicsergŐsz és az új főoldal)
- Natív Webflow-elemek `ov-` előtagú osztályokkal, a `.ov-oldal` burkolón belül. Minden szöveg, kép, logó, címer és GYIK-elem a Designerben szerkeszthető.
- CSS: az oldal tetején lévő HTML Embed-ekben (`embed/ov-N.min.css`), forrás: `ov.css`.
  - A `/*!embed-break*/` jelölő rögzíti a darabhatárt, így egy módosítás csak a saját embedjét változtatja.
  - Natívra költöztetve (2026-10-16, Ági arculata szerint világoskék hero): a hero színei a Webflow-osztályokon élnek, a „Vizadas” gyűjtemény szerep-változóira kötve (`ov-felulet-hero`, `ov-szoveg-kiemelt` …; a régi `OV_BLUE_*` ezekre mutat). Ezeket a Designerben kell szerkeszteni, az embed már nem írja felül őket:
    - `ov-hero`: háttér és szöveg;
    - `ov-allapot`, `ov-allapot-pont`, `ov-pecset-ev`, `ov-lead-kiemelt`;
    - combo: `ov-kiemel ov-kiemel-feher`, `ov-hero-szam ov-szam-kek`, `ov-gomb ov-gomb-masod ov-gomb-sotet` (hover is);
    - `ov-forras-link`.
  - A városkép a hero alján fehér talajjal fut ki a következő (fehér) szekcióba: `kep/ov-varos-feher-talaj.svg`.
- JS: `ov.js` a lábléc kódjában, jsDelivr-ről, commit-SHA-ra rögzítve. Nélküle is teljes az oldal.
- Képek: `kep/` (arculati SVG-k a Vízadás-arculatból), a Webflow-médiatárban ugyanezen a néven; `feltoltott.json` = név → médiatár-fájlnév.

## Interakció
- „Öntözd meg ezt a fiatal fát!”: piros (100 l) → sárga (50 l) → zöld jelölő, kannás méhecske, cseppek, töltöttségi sáv. Mérés: `ov_ontozes`.
- Felpörgő számok az eredményeknél; okos boltgombok (Android/iOS) UTM-mel; mérési napló csak a teszt-domainen.

## Építés
`node build.mjs` → `embed/*.min.css`, `ov.js`; `python3 ov-jeloles.py [szekció…]` → `ov_szekciok.json` (whtml-hez).
