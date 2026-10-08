# beeco design system – a teljes beeco-márka közös alapja (régi neve: beeco-jatek-kit)

> **2026-10-01 óta** ez a repó a **teljes beeco-márka** design systeme (GitHub: `hegebeeco/beeco-design-system`, a régi
> `beeco-jatek-kit` név átirányít). Közös atomok (`tokens/core.json`) → **termékbőr** (app, admin, partner, web: `termek/`,
> generált `dist/`) és **játékbőr** (webjátékok: `web/`). Felépítés: `docs/rendszer.md`. Termékmunkához a `beeco-ds` skill,
> játékhoz a `beeco-arculat`. A `dist/` generált: `node tools/tokens-build.js`; minden változás után `npm test`.
> Fogyasztók: `~/IdeaProjects/beeco-admin(-design-uplift)`, `~/IdeaProjects/beeco-partner` (git-függőség, címkével), Flutter app (Bence, `dist/dart`).
> **Komponensek:** `docs/komponensek.md` – meglévőből dolgozz, atomic szintek, **kötelező öntesztek** (tesztlap + `check-komponensek`), szélső esetek, új elem csak Kristóf jóváhagyásával (javaslatlap: `docs/javaslatok/`).
> **Ügynököknek (1.54.0):** először a `docs/AI.md` (generált index), a `dist/`-et ne nyisd meg; munka közben `npm run check:egy -- <lap>`, a végén egyszer `npm run build && npm test`; feature-ágon nincs verzióemelés. Munkamód, kiadás, API-őr: `docs/ai-munkamod.md`.
> **A helyi mappa neve marad `~/CLAUDE/beeco-jatek-kit`** (a játékok `kit-sync` útvonalai erre mutatnak).


Ez a tároló a **közös** rész: design system, matricák, 3D készlet, eszközök, szabálykönyvek, skillek és az új játék sablonja.
A játékok külön tárolókban élnek (első: `~/CLAUDE/beeco-szelektalj`, élő: https://beeco-szelektalj.netlify.app), és a
`tools/kit-sync.js` másolja beléjük a közös fájlokat (lista: `KIT-FILES.json`). Magyar nyelv, tegezés, Kristóf a gazda
(ügyvezető, nem programozó – magyarázz). Ugyanazok a szabályok, mint a játékokban: `sablon/CLAUDE.md`.

## Szabályok a kit fejlesztéséhez
* **Visszafelé kompatibilitás:** a közös fájlok minden játékban futnak. Tokent, `ds-` osztályt, piktogramot, matrica-nevet,
  globális függvényt (DS, pic, artIcon, ART, MODEL, dsResultHTML, dsFeedback, DS.motion…) **ne nevezz át és ne törölj** –
  csak bővíts. Ha mégis kell, előbb nézd meg minden ismert projektben (`grep`), és frissítsd őket is.
* **Minőség:** B szintű rajz (`docs/rajzolas.md`), csak tokenek; `node tests/check-arculat.js && node tests/check-art.js` zöld.
* **Új közös fájl:** vedd fel a `KIT-FILES.json`-ba („sync”: a kit a gazdája · „sablon”: csak új projektbe kerül).
* **A sablon** (`sablon/`) mindig futó játék legyen: változás után `node tools/uj-jatek.js /tmp/proba "Próba"` és
  `node /tmp/proba/tools/smoke.js`.
* **Terjesztés:** commit + push után a projektekben `node ~/CLAUDE/beeco-jatek-kit/tools/kit-sync.js .` (ezt szólj Kristófnak / a projekt Claude-jának).
* A skillek (`.claude/skills/`) a felhasználói szinten is telepítve vannak (`~/.claude/skills/beeco-arculat`, `beeco-jatek`, `beeco-ds` →
  szimbolikus link ide), így minden Claude Code projekt látja őket.
* A beeco méhecskék (`web/assets/brand/`) belső használatúak; külső partner anyagban a beeco jóváhagyása kell. **A tároló publikus** (Kristóf döntése, 2026-10-01) – titok, jelszó, kulcs soha ne kerüljön bele.

## Brand Book és Design System (két oldal, Javaslat 25; a 22. javaslat régi építőjét felváltotta)
* Motor: `tools/docs/` (+ `tools/docs-brand.js`, `tools/docs-ds.js`). Tartalom: `docs-site/brand/`, `docs-site/ds/` (oldalanként JSON). Építés: `npm run docs:build` → `_site/brand`, `_site/ds` (nem commitoljuk; a Brand Bookot a gyökér `netlify.toml`, a DS-t a `netlify.docs-ds.toml` építi). Teszt: `npm run docs:test` (a `npm test` része).
* Az új motor a repóból ezt olvassa: `brandbook/elemek/` (komponens-adatok), `brandbook/feluletek/*.json` (a hat felület profilja), `brandbook/illusztraciok/`, `brandbook/sablonok/`, `brandbook/kepernyok/` (a `.js`/`.html` a `tools/brandbook-kepernyok.js` kimenete), `brandbook/css/{minta,kepernyo,jatekminta}.css`, `brandbook/js/minta.js`. A régi `tools/brandbook-build.js`, a `brandbook/tartalom/` és a `bb.css` kikerült (a git-előzményben megvan; a régi fejezet → új oldal megfeleltetés: `docs-site/leltar.json`).
* A felületek mért értékei helyben: `node tools/brandbook-felmeres.js --forras ~/CLAUDE` (csak olvas, eltérést jelez; írás: `--ir`; a kézi szövegekhez nem nyúl).
* Jelszókapu (csak a Brand Book): `netlify/edge-functions/brand/kapu-brand.js`, a logikát a `netlify/edge-functions/kapu.js` adja (azt a kapu-brand importálja, ne töröld); a jelszó és a titok CSAK a Netlify környezeti változóiban (`BRANDBOOK_JELSZO`, `BRANDBOOK_TITOK`).
* Tartalomszabály: tény csak forrással (`hivatalos`/`szabaly` blokk), Claude-javaslat `javaslat` blokkban („Jóváhagyásra vár”), ismeretlen → `hianyzik`.
  A repó nyilvános: magánszemély elérhetősége, belső szerződéses adat nem kerülhet bele. Teszt: `npm run docs:test` (`tests/docs-check.js`).

## Ismert játék-projektek
* `~/CLAUDE/beeco-szelektalj` – Szelektálj!, Hűtő-mester, Greenwashing-vadász, Mi van mögötte?, 2075, Ökos-rejtély, párbaj, Fenntartható otthon.

## Weboldal (beeco.hu, Webflow)

A web a **termékbőrt** kapja (`tokens/theme-termek.json`), nem a játékbőrt. Részletek: `docs/weboldal.md`.

**⛔ Élesbe semmi nem megy ki Kristóf kifejezett engedélye nélkül.** Szabad: a Designerben dolgozni
és a **tesztre** publikálni (`publish_site` + `publishToWebflowSubdomain: true` + **üres** `customDomains`).
Nem üres `customDomains` = éles, az engedélyköteles. Új oldal alapból `draft`.

Ellenőrzés mindig saját böngészővel a publikált teszt URL-en, ne a Designer vásznán (ott Kristóf dolgozik).

A tokenek Webflow-változóként élnek: `node tools/webflow-build.js` → `dist/weboldal/webflow-valtozok.json`.
A kötés csak `data_style_tool`-lal megy (`property_value: "var(--_beeco-ds---bc-accent)"`), a `whtml`
builderrel nem. **Minden oldalfejlesztéshez kötelező e2e és egységteszt** (docs/weboldal.md 5/b): egység
`node tests/check-weboldal.js`, e2e `node tools/web-ellenor.js <URL>` – működés, teljesítmény,
láthatóság, takarás, eltartás, billentyűzet, szerkezet, szöveghelyesség, SEO, mozgás, WCAG 2.2 AA.
