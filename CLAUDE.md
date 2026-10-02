# beeco design system – a teljes beeco-márka közös alapja (régi neve: beeco-jatek-kit)

> **2026-10-01 óta** ez a repó a **teljes beeco-márka** design systeme (GitHub: `hegebeeco/beeco-design-system`, a régi
> `beeco-jatek-kit` név átirányít). Közös atomok (`tokens/core.json`) → **termékbőr** (app, admin, partner, web: `termek/`,
> generált `dist/`) és **játékbőr** (webjátékok: `web/`). Felépítés: `docs/rendszer.md`. Termékmunkához a `beeco-ds` skill,
> játékhoz a `beeco-arculat`. A `dist/` generált: `node tools/tokens-build.js`; minden változás után `npm test`.
> Fogyasztók: `~/IdeaProjects/beeco-admin(-design-uplift)`, `~/IdeaProjects/beeco-partner` (git-függőség, címkével), Flutter app (Bence, `dist/dart`).
> **Komponensek:** `docs/komponensek.md` – meglévőből dolgozz, atomic szintek, **kötelező öntesztek** (tesztlap + `check-komponensek`), szélső esetek, új elem csak Kristóf jóváhagyásával (javaslatlap: `docs/javaslatok/`).
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
builderrel nem. Az élő oldal minőségét `node tools/web-ellenor.js <URL>` méri.
