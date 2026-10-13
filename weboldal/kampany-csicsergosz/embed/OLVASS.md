# CSS a Webflow Designerhez

A kampányoldal CSS-e nem a fejlécből töltődik, hanem az oldal tetején lévő három **HTML Embed** blokkból, hogy a Webflow Designer is megjelenítse.

| Embed (sorrend) | Forrás | Tömörített |
|---|---|---|
| 1. | `../cs-kampany.css` | `cs-kampany.min.css` |
| 2. | `../cs-levi.css` | `cs-levi.min.css` |
| 3. | `../cs-illusztracio.css` | `cs-illusztracio.min.css` |

CSS-módosítás után a `.min.css` fájlt újra kell generálni (komment- és szóköztelenítés), és a megfelelő embed tartalmát le kell cserélni (Webflow API: elem-beállítás `code` kulcs, vagy a Designerben kézzel).

A rajzok (`../illusztracio/statikus/*.svg`) Webflow-assetként, valódi `<img>` elemként ülnek az oldalon. A `data-cs-illu` (rajz) és `data-cs-poz` (madárpóz) jelölőjű képeket élesben a `cs-illusztracio.js` animálható inline változatra cseréli.

| 4. | `../cs-illusztracio.css` „2026-10-13 javítások” blokkja (a fájl vége) | `cs-illusztracio-2.min.css` |

A 4. embed a 2026-10-13-i javításokat tartalmazza külön, hogy az első három bájtra változatlan maradjon.
| 5. | `../cs-levelke.css` (Levélke hírlevél-blokk, kabala a Csatlakozásnál) | `cs-levelke.min.css` |
| 6. | `../cs-kartya.css` (Matrica kártyacsalád) | `cs-kartya.min.css` |
