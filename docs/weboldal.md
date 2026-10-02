# Weboldal (Webflow) – a DS webes rétege

*Kristóf döntése, 2026-10-01: a web a **termékbőrhöz** tartozik (`tokens/theme-termek.json`), az app, az admin és a
partner-felület mellé. Fekete tinta és keret, kemény átlós árnyék, kis sarkok, a méz az egyetlen hangsúlyszín.
A játékbőr (Méhsejt-diorama, puha árnyék, olíva tinta) a weboldalon **nem** érvényes – az a webjátékoké.*

A beeco.hu Webflow-ban készül. Ez a réteg azért külön, mert a Webflow három dologban más, mint a többi fogyasztó:

| | admin · partner · app | **weboldal (Webflow)** |
|---|---|---|
| Hogyan kapja a DS-t | `npm install github:hegebeeco/beeco-design-system#v1.x.y` | sehogy: a tokeneket **Webflow-változóként** visszük fel |
| Hol dől el a kinézet | a kódban, build-del | a Designerben, kézzel vagy MCP-vel |
| Mi őrzi a minőséget | `npx beeco-ds-lint` a repóban | `node tools/web-ellenor.js` a **publikált** oldalon |

Ezért itt a bemenetet (változók) generáljuk, a kimenetet (élő oldal) pedig mérjük.

## 1. Tokenek → Webflow-változók

A `node tools/webflow-build.js` állítja elő a teljes listát:

- `dist/weboldal/webflow-valtozok.json` – a Webflow „beeco DS” változó-kollekció tartalma (56 változó),
  mindegyiknél a világos érték és a „Sötét” mód értéke.
- `dist/weboldal/paletta.json` – mit szabad az élő oldalon látni (38 szín, sarkok, keretek, betűk).
  Ebből mér a `tools/web-ellenor.js`.

Mindkettő **generált**, kézzel soha nem szerkesztjük. Ha egy token változik, újra kell futtatni, és a Webflow-ban
frissíteni a változókat – a `tests/check-weboldal.js` jelzi, ha elcsúsztak.

Névszabály: minden Webflow-változó `bc-` előtagú, csak ASCII és kötőjel. **Ékezetes változónév tilos**
(a Webflow a CSS-névbe is átviszi, és `--sárga` törékeny). A kollekció neve: `beeco DS`.

| Csoport | Változók | Megjegyzés |
|---|---|---|
| Szín-szerepek | `bc-bg`, `bc-surface`, `bc-surface-2`, `bc-surface-accent`, `bc-ink`, `bc-ink-soft`, `bc-ink-muted`, `bc-line`, `bc-line-soft`, `bc-accent`, `bc-accent-press`, `bc-on-accent`, `bc-shadow`, `bc-focus`, `bc-success*`, `bc-danger*`, `bc-warning*`, `bc-info*`, `bc-highlight`, `bc-scrim` | mindegyiknek van sötét párja |
| Sarok | `bc-radius-xs/s/m/l/pill` | 2 · 4 · **8** · 12 · 999 |
| Keret | `bc-border-hair/base` | 1 · 2 px |
| Árnyék | `bc-shadow-s/m/l-x` és `-y` | a Webflow-ban nincs árnyék-típusú változó, ezért eltolásként visszük; az osztály rakja össze: `<x> <y> 0 0 var(--bc-shadow)` |
| Térköz | `bc-space-1…8` | 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 |
| Betűméret | `bc-text-xs…3xl` | 12 · 14 · 16 · 20 · 26 · 34 · 46 |

## 2. Osztálynevek a Webflow-ban

A Webflow-nak nincs komponens-CSS-e, ezért a `termek/css/bc-*.css` elemeit **osztálynévben** tükrözzük:
ugyanaz a név, ugyanaz a szerep. Így aki a DS-t ismeri, a Designerben is eligazodik.

| DS-elem | Webflow-osztály | Mire |
|---|---|---|
| `bc-btn` + `is-primary` / `is-ghost` | `bc-btn`, `bc-btn is-primary` | minden gomb és gomb-kinézetű link |
| `bc-card` | `bc-card` | kártya (kemény árnyék csak kattinthatón) |
| `bc-panel` | `bc-panel` | lapos felület, árnyék nélkül |
| `bc-chip` | `bc-chip` | címke, szűrő |
| `bc-field` | `bc-field` | űrlapmező burka (címke + segítő + hiba) |
| – | `bc-sec` | szekció-burok (a szekciók közti ritmus) |
| – | `bc-sec-head` | szekciófejléc: felső index + cím + lead |

**Szabály:** új `bc-` osztály a Webflow-ban csak akkor, ha a DS-ben is van hozzá elem. Ha nincs, előbb
javaslatlap (`docs/javaslatok/_sablon.md`), nem „ideiglenes” osztály a Designerben.

A nem DS-eredetű, oldalspecifikus osztályok külön előtagot kapnak (pl. `h26-` a 2026-os főoldalon), hogy
takarításkor egy pillantásra látszódjon, mi a DS és mi az egyedi.

## 3. Amit a Webflow API nem tud (tanult korlátok)

Ezek nem hibák, hanem a tervezést befolyásoló tények. Mindegyik élesben derült ki:

- **Üres `div` eltűnik.** A dekor-elemeket (elválasztó, perem) nem elemként, hanem `::before` pszeudoelemként
  tesszük be az oldal fej-kódjába, `nth-child` szerint. Új szekció beszúrásakor ezt frissíteni kell.
- **A `whtml` builder korlátai:** csak egyszerű osztályszelektor, média-lekérdezés csak
  `screen and (max-width: 991px|767px|479px)`, és `font-family`-t nem állít. A betűt oldal-CSS-ben kell megadni.
- **Kép csak asset-URL-lel** (`https://s3.amazonaws.com/webflow-prod-assets/<site>/<assetId>_<fájl>`), a CDN-URL-t nem ismeri fel.
- **A Designer osztálypanelje nem fogad `var()`-t**, ezért ami nem változó-kötésként megy be, az beégetett érték lesz.
  Emiatt kell a változó-réteg: enélkül semmi nem állítható át egy helyen.
- **Publikálás:** staging (`publishToWebflowSubdomain`, üres `customDomains`) → ellenőrzés cache-törő query-vel
  (a CDN 1–2 percig régi HTML-t ad) → csak utána éles.
- **Elem-szintű műveletek** tartósan 429-re futhatnak; a megoldás a Designerben futó MCP app csatlakoztatása.

## 4. Mit viszünk ki, mit nem

A weboldal **nem** kap meg mindent a DS-ből:

| Marad a DS-ben | Nem megy ki a webre |
|---|---|
| szín-szerepek, sarok, keret, árnyék, térköz, betűskála | React-komponensek (a Webflow nem React) |
| gomb, kártya, panel, chip, mező osztályminták | űrlap-állapotgépek, `useFieldContext` |
| mozgás-időzítés és görbe | tesztlapok, `bc-tesztlap.css` |
| hangnem, méhecske-szereplők | admin-sűrűség (36 px gomb) – a weben mindig 44 px |

## 5. Gépi ellenőrzés

Két szint, mindkettő futtatható kézzel és CI-ből is.

**A DS oldalán** – `node tests/check-weboldal.js`
Azt nézi, hogy a generált réteg friss-e, a névszabály tartja-e magát, és minden termékbőr-szerephez
tartozik-e Webflow-változó. Része az `npm test`-nek.

**Az élő oldalon** – `node tools/web-ellenor.js <alap-URL>`

```bash
node tools/web-ellenor.js https://beeco-weboldal.webflow.io            # sitemapből, 25 oldal
node tools/web-ellenor.js https://www.beeco.hu --oldalak /,/letoltes   # célzottan
node tools/web-ellenor.js https://beeco-weboldal.webflow.io --gyors --json jelentes.json
```

Minden oldalt megnyit 4 nézetben (320 · 390 · 768 · 1280), és mér:

| Kategória | Mit |
|---|---|
| Működés | HTTP-hiba, konzolhiba, be nem töltődő oldal, 404-es belső link |
| Méretezés | vízszintes kilógás (a közös `tools/komp/oldal-meres.js`-ből) |
| Hozzáférhetőség | 44 px érintés, látható fókusz, elérhető név linken és gombon, kép alt, axe-core WCAG 2.2 AA, billentyűzettel elérhetetlen kattintható elem |
| Színezés | szöveg-kontraszt a tényleges háttérhez |
| Arculat | DS-en kívüli szín, nem DS sarok, elmosott árnyék (a termékbőrben tilos) |
| Tipográfia | idegen betűcsalád, 12 px alatti szöveg |
| Szerkezet | hiányzó vagy többszörös `h1`, címsor-ugrás |
| SEO | oldalcím, meta leírás, canonical, og:image, hibás JSON-LD |
| Biztonság | `target="_blank"` `rel="noopener"` nélkül |
| Animáció | 400 ms feletti átmenet, `ease-in` görbe, végtelen animáció csökkentett mozgásnál |
| Szöveg | semmitmondó linkszöveg, ugyanaz a linkszöveg több célra |

P0 vagy P1 lelet → 1-es kilépési kód, tehát CI-ben megbuktatja a futást.

## 6. Menetrend egy weboldal-munkához

1. `minosegkapu` skill betöltése (szabályok).
2. Ha token kell: `tokens/*.json` → `node tools/tokens-build.js` → `node tools/webflow-build.js` → Webflow-ban frissíteni.
3. Építés a Designerben vagy MCP-vel, **meglévő `bc-` osztályból**.
4. `node tools/web-ellenor.js <staging>` → javítás → újra.
5. `minosegkapu` kapu, képernyőképekkel.
6. Élesítés kézzel (Kristóf).
