# Önkéntes vízadás – szezonzáró oldal (2026 → 2027 május)

A 2026-os szezon 2026. október 13-án zárult, a kampány 2027 májusában indul újra. Ez az oldal a köszönetet, az eredményeket (a 2026. októberi záró közlemény végleges számaival), az év vízadóját, a 2027-es tervezést, a sajtóblokkot és a „szólj, ha indulunk” feliratkozást (#levelke, a lábléc hírlevél-blokkja) viszi.

## Felépítés (Designer-barát, mint a CsicsergŐsz és az új főoldal)
- Natív Webflow-elemek `ov-` előtagú osztályokkal, a `.ov-oldal` burkolón belül. Minden szöveg, kép, logó, címer és GYIK-elem a Designerben szerkeszthető.
- CSS: az oldal tetején lévő HTML Embed-ekben (`embed/ov-N.min.css`), forrás: `ov.css`.
- JS: `ov.js` a lábléc kódjában, jsDelivr-ről, commit-SHA-ra rögzítve. Nélküle is teljes az oldal.
- Képek: `kep/` (arculati SVG-k a Vízadás-arculatból), a Webflow-médiatárban ugyanezen a néven; `feltoltott.json` = név → médiatár-fájlnév.

## Interakció
- „Öntözd meg ezt a fiatal fát!”: piros (100 l) → sárga (50 l) → zöld jelölő, kannás méhecske, cseppek, töltöttségi sáv. Mérés: `ov_ontozes`.
- Felpörgő számok az eredményeknél; okos boltgombok (Android/iOS) UTM-mel; mérési napló csak a teszt-domainen.

## Építés
`node build.mjs` → `embed/*.min.css`, `ov.js`; `python3 ov-jeloles.py [szekció…]` → `ov_szekciok.json` (whtml-hez).
