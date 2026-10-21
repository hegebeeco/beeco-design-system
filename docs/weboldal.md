# Weboldal (Webflow) – a DS webes rétege

*Kristóf döntése, 2026-10-01: a web a **termékbőrhöz** tartozik (`tokens/theme-termek.json`), az app, az admin és a
partner-felület mellé. Fekete tinta és keret, kemény átlós árnyék, kis sarkok, a méz az egyetlen hangsúlyszín.
A játékbőr (Méhsejt-diorama, puha árnyék, olíva tinta) a weboldalon **nem** érvényes – az a webjátékoké.*

> ## ⛔ Publikálási szabály (Kristóf, 2026-10-02)
>
> **Élesbe (`www.beeco.hu`) semmi nem megy ki Kristóf kifejezett engedélye nélkül.** Nem elég, hogy
> egy feladat „kész": az élesítés mindig külön kérés, külön mondatban.
>
> **Ami szabad engedély nélkül:** a Designerben dolgozni (elem, osztály, változó, oldal), és
> publikálni a **tesztre** (`beeco-weboldal.webflow.io`), mert azt a csapat úgyis átnézi.
> A teszt-publikálás a `publish_site` hívás `publishToWebflowSubdomain: true` és
> **üres `customDomains`** párosával megy. Ha a `customDomains` nem üres, az már éles.
>
> **Ellenőrzés mindig saját böngészővel**, a publikált teszt URL-en, ne a Designer vásznán:
> a Designerben Kristóf dolgozik, és a Designer MCP el is alszik, ha a fül háttérbe kerül.
>
> **Új oldal alapból `draft`**, amíg nincs róla döntés. A site csomagja nem engedi API-ból a
> sitemapből kivenni (403), tehát egy nem draft oldal publikáláskor bekerül a sitemapbe.

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

**Már a Webflow-ban (mind változóra kötve):**

| Csoport | Osztályok |
|---|---|
| Gomb | `bc-btn` + `is-secondary` · `is-ghost` · `is-sm` · `is-lg` · `is-block` |
| Felület | `bc-card` + `is-interactive` · `is-flat` · `is-accent` · `is-quiet`; `bc-panel` |
| Címke | `bc-chip`, `bc-tag` |
| Űrlap | `bc-field`, `bc-label`, `bc-input`, `bc-help` |
| Elrendezés | `bc-row`, `bc-stack`, `bc-wrap` + `is-narrow`, `bc-grid-2`, `bc-grid-3` |
| Szekció | `bc-sec` + `is-tight` · `is-accent` · `is-quiet` · `is-ink` |
| Tipográfia | `bc-display`, `bc-title`, `bc-subtitle`, `bc-lead`, `bc-body`, `bc-eyebrow`, `bc-muted` |
| Bizalom | `bc-quote` (+ `-text`, `-by`, `-name`, `-role`), `bc-logos` (+ `-title`), `bc-source` |
| Média | `bc-figure` (+ `-media`, `-cap`) |
| Egyéb | `bc-link`, `bc-divider` |

**A DS-ben megvan, de a Webflow-ba még nem vittük át** (akkor hozzuk, amikor egy oldalnak kell):
`bc-acc` (harmonika, a GYIK-hez), `bc-stat`/`bc-stats` (számblokk), `bc-crumbs`/`bc-crumb`
(kenyérmorzsa), `bc-steps`, `bc-tl` (idővonal), `bc-avatar`, `bc-badge`, `bc-table`,
`bc-progress`, `bc-skip` (ugrás a tartalomra), `bc-tabs`/`bc-tab`, `bc-alert`, `bc-empty`.

**Szabály:** új `bc-` osztály a Webflow-ban csak akkor, ha a DS-ben is van hozzá elem. Ha nincs, előbb
javaslatlap (`docs/javaslatok/_sablon.md`), nem „ideiglenes” osztály a Designerben.

A nem DS-eredetű, oldalspecifikus osztályok külön előtagot kapnak, hogy takarításkor egy pillantásra látszódjon, mi a DS
és mi az egyedi: `fs-` (Szuperhős főoldal), `ov-` (Önkéntes vízadás), `cs_`/`cs-` (CsicsergŐsz), `rl-` (Rólunk),
`h26-` (a korábbi 2026-os főoldal-vázlat). Az aktuális oldalakat a 14. fejezet sorolja fel.

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
- **Kép alt-ja API-n nem írható** (`set_attributes alt` → belső hiba). Hibás alt-nál a képet `whtml`-lel újraépítjük
  `alt`-tal, a régit töröljük. A `whtml` a képeken a `data-*` attribútumot eldobja → utána `set_attributes`.
- **`box-shadow`-ba ne `var()` menjen `property_value`-val:** a Webflow az egész értéket egyetlen színváltozónak veszi,
  és érvénytelen árnyék lesz belőle. Az árnyékot az oldal fejkódja rakja össze tokenekből.
- **Időzítés nem lehet `ms`-es változó** (a méret-változó `120ms`-re hibát dob) → **szám-változó**, a CSS-ben
  `calc(var(--x) * 1ms)`. Cubic-bezier sem lehet változó: a görbék a fejkódban élnek.
- **A publikálás aszinkron:** ha egy draft oldalt staging miatt kinyitunk, a draftot csak akkor kapcsoljuk vissza, amikor
  az oldal a stagingen már 200-zal és az új tartalommal él (curl-lel figyelve). Ha előbb, a staging 404-et ad.
- **Site-szintű kattintásfigyelők:** a Trustindex loader minden oldalon belüli `#horgony`-kattintást megállít
  (`stopImmediatePropagation` a dokumentumon) és 150 ms múlva újrakattint. Elemre kötött mérés ezért nem fut, az
  ablakszintű kétszer. Mérést egyetlen ablakszintű, capture fázisú figyelővel, elemenkénti 600 ms-os szűréssel írunk.
- **GA4 közvetlenül, GTM nélkül:** a „Tag manager” komponens `gtag` (G-6KVDRD0YQF). Egyedi esemény csak
  `gtag('event', …)`-tel jut a GA4-be; a `dataLayer.push({event})` önmagában nem.
- **A teszt-publikálás az egész site-ot újrapublikálja**, és ami közben `draft`, az **lekerül** a stagingről (404).
  Ezért minden staging-körben az összes stagingen tartott draftot egyszerre nyitjuk ki, publikálunk, megvárjuk a 200-at
  mindegyikre, és mind visszakerül draftba (2026-10-13-án így esett le a főoldal-vázlat).
- **Éles publikálás csak az egyedi domainekre:** `customDomains` a két domain-azonosítóval, `publishToWebflowSubdomain:
  false`, így a staging és rajta a draftok érintetlenek. Az éles publikálás is **az egész site**: minden addig ki nem tett,
  nem draft változás kimegy vele. Oldalankénti publikálás (`pageId`) a csomagban nincs.
- **HTML Embed legfeljebb 15 000 karakter.** Ha egy oldal CSS-e nő, az új rész **új embedbe** megy a meglévők után; a
  meglévőkhöz nem nyúlunk, így azok bájtra egyeznek a repóval (ezt a stagingen ellenőrizzük).
- **Az embedek a `<body>`-ban vannak**, tehát a fejkódnál később érvényesülnek. Ha teszteléskor CSS-t injektálunk,
  a törzs végére kell tenni, különben az embedek `!important` szabályai felülírják.
- **`whtml`:** egy hívásban legfeljebb 5 beszúrás; az osztályok csak akkor maradnak meg, ha a `css` mezőben van rájuk
  szabály (osztálycsonk: `.fs-x{--fs:1}`); a `target`, `rel`, `data-*` attribútum leeshet, ezért utána
  `set_attributes`, illetve linknél `set_settings` → `static_link.open_in_new_tab`.
- **`update_style`:** a kombó szülőjét pontos néven kell megadni (a `card` osztály a Webflow-ban `CARD`). Ha ugyanabban
  a hívásban egy tulajdonságot törlünk (`remove_properties`) és újra beállítunk, az új érték elveszhet: külön hívásban.
  A stíluseszköz tudja a `::before`/`::after` pszeudoelemet és a `hover`/`active` állapotot.
- **`set_visibility` és `set_attributes` szekción** néha `MPS Conflict` hibát ad; ilyenkor az elem eltávolítása működik.
- **Új oldal másolással** (`create_page` + `duplicateOf`) megtartja a NAVBAR, Tag manager és lábléc komponenst, de az
  oldal egyedi kódját nem másolja.

## 3/b. Hogyan kötjük a stílust a változóra (ez a lényeg)

A Webflow Designer osztálypanelje nem fogad `var()`-t, **az API viszont igen**, és valódi
változó-kötéssé alakítja:

```
data_style_tool > create_style / update_style
  properties: [{ property_name: "background-color",
                 property_value: "var(--_beeco-ds---bc-accent)" }]
```

A visszakapott stílusban az érték már `{"id": "variable-…"}`, nem szöveg. Ettől lesz a token
egy helyen átállítható. A változók CSS-neve a kollekció nevét is tartalmazza:
`--_beeco-ds---bc-accent` (a „beeco DS” kollekcióban a `bc-accent`).

**A `whtml` builder ezt NEM tudja:** a CSS-ében a `var()` nyersen marad, és figyelmeztetést ad
(`unknown_variable`). Ezért a menet: szerkezet `whtml`-lel, utána a tokenes tulajdonságok
`data_style_tool`-lal. Ugyanez igaz a `font-family`-re.

Kombinált osztály (`.bc-btn.is-secondary`): `create_style` + `parent_style_names: ["bc-btn"]`
(tömb, nem egyetlen név).

**Amit a Webflow-stílus nem tud átvenni a DS CSS-ből:** saját CSS-tulajdonság (`--_bg`),
`color-mix()`, `:has()`. Ezeket laposítani kell: a változatok közvetlenül állítják a
háttér- és szövegszínt.

## 3/c. Élő hivatkozás a Webflow-ban

`/ds-bemutato` (DS bemutató, belső) – gombok, kártya, panel, címkék, mind a `bc-` osztályokkal
és változó-kötésekkel. **Draft**, mert a site csomagja nem engedi API-ból a sitemapből kivenni,
és nem akarjuk, hogy nyilvános, indexelt oldal legyen. Ha nézni akarod: draft=false → staging
publikálás → nézd meg → draft=true vissza.

Az első mérése: 0 arculati, 0 tipográfiai, 0 hozzáférhetőségi és 0 szerkezeti lelet. A két P1 a
site egészén futó `window.Stripe is not a function` konzolhiba, nem ezé az oldalé.

## 3/d. Mozgás és személyiség – amit a Webflow-stílus nem tud

A Webflow-stílus nem ismeri a `@keyframes`-t, a pszeudoelemet és a maszkot. Ezért a mozgás, a
méhsejt-háttér és a méhecske-animációk **az oldal fej-kódjába** kerülnek, egy generált blokként:

```bash
node tools/webflow-build.js        # -> dist/weboldal/beeco-web.min.css
```

A `beeco-web.min.css` tartalma megy a Webflow egyedi kód mezőjébe. Nem kézzel írjuk: a DS saját
`bc-motion.css` és `bc-marka.css` fájljaiból generálódik, és a generátor írja át a változóneveket a
Webflow alakjára. A mező korlátja kb. 10 000 karakter, ezért a kimenet tömörített, és az évszakos
díszítés (önmagában ~11 kB adat-URI) kimarad belőle; ha kell, külön kérésre kerül be.
A `tests/check-weboldal.js` őrzi, hogy friss legyen és elférjen.

**A mozgás elve (Javaslat 11):** a méhecske nem tapéta, hanem szereplő. Akkor mozdul, amikor
történik valami: megérkezel, kész lett, elértél egy mérföldkövet. **Végtelen mozgás nincs** – ezt a
`bc-motion.css` már kimondja, és a weboldalra is áll. Egy képernyőn legfeljebb egy mozgó dolog kéri
a figyelmet. A humor a **szövegben** van, nem a mozgásban.

| Osztály | Mikor |
|---|---|
| `bc-web-erkezes` | a hero méhecskéje egyszer berepül, 560 ms, aztán megáll |
| `bc-web-zum` | a gomb melletti méhecske kétszer rezdül rámutatásra, csak egérrel |
| `bc-sticker` + `is-in` | ferde címke, ami odacsapódik (`bc-stamp`). Oldalanként 1-2 db |
| `bc-web-in` + `is-in` | szekció-beúszás görgetésre, 8 px, 340 ms, soronként 60 ms késéssel |
| `bc-honeycomb` | méhsejt-háttér a tartalom mögött, erőssége `--_op` |
| `bc-figure.is-framed` / `.is-tilt` | fénykép kerettel és kemény árnyékkal, enyhén döntve |
| `bc-anim-cheer` / `-tick` / `-stamp` / `-shake` / `bc-stagger` / `bc-lift` | a DS meglévő készlete, változatlanul |

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

## 7. Osztályleltár – mi a DS, mi egyedi, mi halott

A Webflow-ban az osztályok sosem tűnnek el maguktól: a törölt szekciók stílusai ott maradnak, és
minden sablon, amiből valaha dolgoztunk, otthagyja a sajátjait. Ez az eszköz két forrást vet össze:
a Webflow-ban **definiált** stílusokat és az élő oldalakon ténylegesen **használt** osztályokat.

```bash
# 1. a stíluslista kimentése (Webflow MCP: data_style_tool > get_styles, query "all")
# 2. összevetés az élő oldallal
node tools/web-osztalyleltar.js stilusok.json https://beeco-weboldal.webflow.io --max 25 --json leltar.json
```

Csoportok, amiket megkülönböztet: `DS (bc-)`, `oldal-specifikus (h26-)`, `játékbőr maradék (ds-)`,
`sablon-maradék` (BRIX és Webflow alapnevek), `ékezetes vagy nagybetűs`, `egyedi`.

**A kimenet nem törlési lista.** A sitemapből csak mintát nézünk, a vázlat oldalak pedig nem is
szerepelnek benne, tehát egy osztály hiányozhat a mintából úgy is, hogy valahol használatban van.
A takarítás menete: a `sablon-maradék` csoport a legbiztosabb kezdés, utána az `ékezetes vagy
nagybetűs`, és minden kör után újra kell futtatni a `web-ellenor`-t.

## 8. Éjszakai őrjárat

A `.github/workflows/weboldal.yml` minden éjjel lefuttatja a `web-ellenor`-t a stagingre, és
mellékletként felteszi a jelentést. Azért éjszaka és nem push-ra, mert a weboldal nem ebből a
repóból épül: a repó CI-je nem tud róla, mikor publikálnak a Designerből.

## 5/b. Kötelező tesztek minden oldalhoz (Kristóf, 2026-10-02)

**Minden oldalfejlesztéshez tartozik e2e és egységteszt.** Nem opció, és nem a végén derül ki:
az oldal addig nincs kész, amíg a két teszt nem fut le zölden. A cél, hogy a hibát a gép találja
meg, ne a látogató.

### Egységteszt (unit) – `tests/check-weboldal.js`

Azt őrzi, ami kód nélkül is eldönthető, és másodpercek alatt lefut:

| Mit | Miért |
|---|---|
| a generált Webflow-változók frissek és teljesek | hogy a Webflow és a DS ne csússzon szét |
| a névalak (`bc-*`, csak ASCII) és a `beeco-tokens.css`-sel való egyezés | ékezetes CSS-név törékeny |
| a beilleszthető CSS mérete | a Webflow mezője ~10 000 karakter |
| a generált CSS **zárójel-egyensúlya** | egy csonka blokk némán elronthat mindent |
| minden szerepnek van sötét párja, a hexek érvényesek | sötét módban ne essen szét |

Futtatás: `node tests/check-weboldal.js`, és az `npm test` része.

### Végponttól végpontig (e2e) – `tools/web-ellenor.js`

Valódi böngészőben, a **publikált** oldalon, négy nézetben (320 · 390 · 768 · 1280):

| Terület | Mit nézünk |
|---|---|
| **Működés** | HTTP-hiba, konzolhiba, be nem töltődő oldal, 404-es belső link |
| **Teljesítmény** | hosszú feladat betöltéskor, nem csendesedő hálózat, folyamatosan töltő beágyazás |
| **Láthatóság** | a szöveg kontrasztja a tényleges háttérhez, 12 px alatti szöveg, idegen betűcsalád |
| **Takarás és kilógás** | vízszintes kilógás 320 px-en, egymásra csúszó elemek, elvesző szöveg |
| **Eltartás és méret** | 44 px érintési felület, nem DS térköz és sarok |
| **Billentyűzet** | látható fókusz az első 20 elemen, billentyűvel elérhetetlen kattintható elem |
| **Szerkezet** | pontosan egy `h1`, nincs címsor-ugrás, kép alt nélkül |
| **Szöveghelyesség** | semmitmondó linkszöveg, ugyanaz a linkszöveg több célra, elérhető név nélküli gomb |
| **SEO** | oldalcím, meta leírás, canonical, og:image, hibás JSON-LD |
| **Mozgás** | 400 ms feletti átmenet, `ease-in` görbe, végtelen animáció csökkentett mozgásnál |
| **Biztonság** | `target="_blank"` `rel="noopener"` nélkül |
| **WCAG 2.2 AA** | axe-core teljes szabálykészlete |

Futtatás: `node tools/web-ellenor.js <URL>`, vagy `npm run web <URL>`.
P0 vagy P1 lelet → 1-es kilépési kód, tehát CI-ben megbuktatja a futást.

### Mikor melyik

| Pillanat | Mit futtatunk |
|---|---|
| Minden szerkesztés után, helyben | `node tests/check-weboldal.js` |
| Mielőtt „kész"-t mondunk | teszt-publikálás, majd `npm run web <teszt URL>` **és** a `minosegkapu` kapu |
| Minden éjjel | `.github/workflows/weboldal.yml` a teljes site-ra |
| Élesítés előtt | mindkettő zölden, és a jelentés átadva |

**Amit a gép nem tud eldönteni**, és ezért marad emberi feladat: a szöveg tartalmi igazsága
(szám csak valós adatból vagy forrással), a hangnem, és hogy a kép tényleg azt mutatja-e, amiről
a szöveg beszél. Ezeket a `minosegkapu` jelentésében kell kimondani, nem elhallgatni.

## 6. Menetrend egy weboldal-munkához

1. `minosegkapu` skill betöltése (szabályok).
2. Ha token kell: `tokens/*.json` → `node tools/tokens-build.js` → `node tools/webflow-build.js` → Webflow-ban frissíteni.
3. Építés a Designerben vagy MCP-vel, **meglévő `bc-` osztályból**.
4. `node tools/web-ellenor.js <staging>` → javítás → újra.
5. `minosegkapu` kapu, képernyőképekkel.
6. Teszt-publikálás (a 11. fejezet staging-köre: minden draft együtt), és a jelentés átadása.
7. **Élesítés: csak Kristóf kifejezett engedélyével.** Alapértelmezésben nem történik meg. Utána az éles oldalon újra
   mérünk (`ui_audit`, horgonyok, fülek), mert az élesítés az egész site-ot viszi.

## 9. Kampánytémák (pl. CsicsergŐsz)

Egy kampány saját arculatot kaphat (ősz, madarak: krém, barack, kakaó, méz), ami **nem** a termékbőr része. Ilyenkor:

| Réteg | Hogyan |
|---|---|
| Tokenek | **külön Webflow-gyűjtemény** a kampány nevével (`Csicsergosz`), `cs-` előtagú változókkal; paletta → szerep-tokenek (felület, szöveg, kiemelés, keret) → osztályok. A kampány egy helyen átszínezhető. |
| Osztályok | a meglévő site-osztályokra **kombó** (`DIA_KEK_OV` + `CS`, `BUTTON_MAIN` + `CS`), új elemhez kampány-előtag (`cs_`), ahogy a főoldal a `h26-`-öt |
| Mozgás, díszítés | oldal fejkód + lábléc, `data-cs-*` jelölőkkel (nem osztállyal), így a Designerben bárki ráteheti |
| Kártyák | kampányonként saját kártyacsalád a termékbőr logikájával (árnyék = kattintható; nem kattintható árnyék nélkül; kiválasztott külön jelölve). CsicsergŐsz: **Matrica** (levágott sarok, fehér körvonal, −1° a kattinthatón), `weboldal/kampany-csicsergosz/cs-kartya.css`; ugyanez a Webflow-osztályokon (`card` + `cs_link` / `cs_egyenlo`, `::before` és hover/lenyomott állapot), így a Designer eszköztárából húzott új kártya is ilyen. |
| Mérés | `gtag('event')`, ablakszintű figyelő (lásd 3. fejezet) |
| Kártyák | kampányonként saját kártyacsalád, de a termékbőr logikájával (árnyék = kattintható, a nem kattintható árnyék nélküli, a kiválasztott külön jelölt). CsicsergŐsz: **Matrica** (12. fejezet) |
| Hírlevél, közösség | egy blokk, egy ígérettel (milyen gyakran, mit kapsz), egy mezővel és látható címkével; a közösségi linkek másodlagosak. CsicsergŐsz: „Levélke” képeslap, kéthetente, a meglévő Webflow-űrlap átköltöztetve |
| Ellenőrzés | `node tools/web-ellenor.js <staging> --oldalak /kampanyok/...` **és** a minőségkapu `landing_review.mjs` a kampány saját szabályfájljával (paletta, kabala, app-képernyő, események). A `web-ellenor` a termékbőr palettáját méri, ezért a kampányszíneket „DS-en kívüli”-nek jelzi: ez a kampányoldalon várt lelet. |

Minta és beilleszthető kód: **`weboldal/kampany-csicsergosz/`** (README, `tokens.json`, `head.html`, `footer.html`).
Az élő változat kódja a `csicsergosz-levi` ágon van (14. fejezet); ott a CSS már embedekben, a rajzok a Designerben is
látható `<img data-cs-illu>` képek.

## 10. Élő oldalmodulok (pl. Csatlakozz: Kaptár-kapu)

Ha egy oldalrész adatból él (feladatlista, ranglista, számláló), a kód **modulként** a `weboldal/<téma>/` mappába kerül,
és az oldal a jsDelivr verziósávjára hivatkozik (`@1.46/…`). A Webflow-ban csak a gyökérelem van `data-<előtag>="<blokk>"`
jelölővel és egy betöltés-szöveggel; a modul helyet foglal, amíg betölt. Amíg nincs élő végpont, jelölt mintaadat
(`"minta": true`) fut látható címkével, és az oldal saját `review-szabalyok.json`-ja P1-et ad rá: **mintaadattal nem élesítünk.**
Az adatforrás és a mezők leírása a modul `*-szerzodes.md` fájljában van, a backend fejlesztőjének.

Minta: **`weboldal/csatlakozz/`** (Kaptár-kapu: nyitott feladatok szűrővel, raj-választó, szintek, ranglista, helyi csapatok).

## 11. Oldalépítés: a bevált, Designer-barát felépítés (2026-10-13)

A Szuperhős főoldal, a vízadás szezonzáró és a CsicsergŐsz ugyanígy épült. A cél, hogy a Designerben minden látható
és szerkeszthető maradjon, a kód pedig a repóban éljen, verzióval.

| Réteg | Hol él | Szabály |
|---|---|---|
| Szerkezet | natív Webflow-elemek, oldal-előtagú osztállyal (`fs-`, `ov-`, `cs_`, `rl-`) | egy burkoló az oldal tetején (`.fs-oldal`, `.ov-oldal`); a NAVBAR, a Tag manager és a lábléc a meglévő komponens marad |
| Szöveg és kép | a Designerben, natív elemként | a rajzok `<img data-…-illu>` képek, hogy a Designer is mutassa őket; élesben a JS cseréli animálható SVG-re |
| CSS | HTML Embedek a burkoló elején (embedenként ≤ 15 000 karakter) | forrás a repóban (`*.css`), tömörítve `embed/*.min.css`; új CSS új embedbe |
| JS | jsDelivr, **commit-SHA-ra rögzítve** az oldal láblécében | `https://cdn.jsdelivr.net/gh/hegebeeco/beeco-design-system@<sha>/weboldal/<oldal>/<fájl>.js` |
| Generátor | `weboldal/<oldal>/*-jeloles.py` | a szekciók HTML-je egy JSON-ba, onnan `whtml`-lel kerül a Webflow-ba (≤ 5 szekció hívásonként, osztálycsonkokkal) |

**A burkoló szélessége.** A site `body.main_body` eleme flex oszlop, középre igazítva, ezért a burkoló kapja:
`align-self:stretch; width:100%; min-width:0; max-width:100%`. Enélkül egy széles elem (például végtelen sáv)
kiszélesíti az egész oldalt mobilon.

**Staging-kör (minden változás után):**

1. A repóban commit és push; a JS-t jsDelivr-ről ellenőrizzük az új SHA-n (200 és benne a változás).
2. A Webflow-ban: embed-tartalom (`set_settings` → `code`), lábléc SHA (`set_page_freeform_code`).
3. **Minden** stagingen tartott draft oldalt `draft:false`-ra teszünk (3. fejezet).
4. `publish_site`: `publishToWebflowSubdomain:true`, üres `customDomains`.
5. curl cache-törő queryvel, amíg 200 és benne az új tartalom; az embedek bájtra egyeznek a repó `embed/*.min.css` fájljaival.
6. Minden draft vissza `draft:true`-ra.
7. Mérés a staging URL-en: `ui_audit.mjs` (asztal és mobil), kampány- és landingoldalnál `landing_review.mjs`, és a
   saját funkcionális próba (horgonyok, fülek, animációk végállapota).

**Éles kör** (csak engedéllyel): ugyanez, de `customDomains` a két éles domain, `publishToWebflowSubdomain:false`,
utána a mérés az éles URL-en.

**Helyi próba élesítés előtt.** Az élő oldal HTML-jét betöltjük, és a jsDelivr-hívásokat Playwrighttal a helyi fájlokra
irányítjuk (`page.route`). Így a kódot a valódi jelölésen próbáljuk ki, mielőtt bármi kikerül.

## 12. Közös vizuális nyelv a weboldalon

A főoldal és a kampányoldalak ugyanazt a nyelvet beszélik. A kampány a színeket és a kártyák formáját cserélheti, a
szerkezetet nem.

| Elem | Leírás |
|---|---|
| **Szalagcím** (kicker) | rövid címke a cím fölött: tinta háttér, világos Lalezar, enyhén elforgatva, matrica-vágással (`clip-path: polygon(0 7%,100% 0,99% 93%,1% 100%)`) |
| **Elválasztó** | két fajta, váltakozva: **A lágy domb** (két réteg SVG-domb, a következő szekció színével) és **D matrica-szél** (ferde, kézzel vágott él fehér peremmel), a D szalagján **mini idézet** valódi véleményből (név is) |
| **Gomb** | méz alap, fekete 2 px keret, 8 px sarok, 4 px kemény árnyék; hover felemelkedik, lenyomva lesüllyed; a felirat legfeljebb 3 szó |
| **Kártya, termékbőr** | `bc-card`: 2 px tinta keret, 12 px sarok, kemény árnyék csak kattinthatón |
| **Kártya, Szuperhős főoldal** | 16 / 4 / 16 / 4 px sarok, 4 px kemény árnyék kattinthatón, matrica-szalagok |
| **Kártya, CsicsergŐsz (Matrica)** | levágott sarok (kártya 16 px, kép 10 px), fehér matrica-körvonal halvány kakaó éllel; kattintható −1°, kakaó árnyék (hover 7 px, lenyomva 1 px); nem kattintható egyenes, árnyék nélkül; kiválasztott méz körvonal. Forrás: `weboldal/kampany-csicsergosz/cs-kartya.css`, és ugyanez a Webflow `CARD + CS_LINK` / `CARD + CS_EGYENLO` osztályain (`::before`, hover, active) |
| **Boltgombok** | platform szerint (iOS-en csak App Store, Androidon csak Google Play, asztalon mindkettő és QR-kód); minden letöltés-link UTM-mel (`utm_source=beeco.hu&utm_medium=<oldal>&utm_campaign=<hely>`, App Store-nál `ct=`) |
| **Számok** | nyugalmi állapotban a végérték látszik; görgetésre egyszer felpörög; csak valós, forrásolt szám |
| **Kabala** | szereplő, nem tapéta: akkor mozdul, amikor történik valami. A főoldalon a Szuperhős méhecske (Kristóf: „ne legyen túl méhecskés”), a CsicsergŐsz-oldalon a kismadár és Gabee; a madár neve nem jelenik meg |
| **Piktogramok** | a kézzel rajzolt beeco-piktogramok (matrica, sárga család), egy szekcióban egy stílus |
| **Háttér** | a „zöld 2050” táj körvonal nélkül, halványan (opacity ~0,5), a tartalom mögött |

## 13. Viselkedés-minták és ismert buktatók

| Helyzet | Megoldás |
|---|---|
| Oldalon belüli horgony („Nézd meg…”) visszaugrik | a Webflow sima görgetése és a Trustindex újrakattintása összeakad. Ablakszintű, capture fázisú kattintásfigyelő: `preventDefault` + `stopImmediatePropagation`, saját görgetés (a rögzített menü magasságával), `history.replaceState`, és 1,3, illetve 2,1 mp-nél visszaállítás, ha felhasználói mozdulat nélkül elvitték az oldalt (`weboldal/kampany-csicsergosz/cs-levi.js`) |
| Fül kattintásra görget | a fülkezelő `stopImmediatePropagation`-t hív, hogy a Webflow horgonygörgetése ne fusson le |
| Elrendezés-ugrás (CLS) betöltéskor | minden képnek, amelynek magassága `auto`, `aspect-ratio` a rajz arányával (vízadás: 0,19 → 0) |
| Fehér szöveg narancson | a `#EA6C18` fehérrel 3,15:1, AA alatt. Helyette `#A8470C` (5,9:1) |
| Apró szöveg | 11 px alá nem megyünk (bélyegfelirat, címke sem) |
| Görgetésre animált szereplő | a pozíciót a képernyőhöz viszonyítva számoljuk (például a csempesor közepe a képernyő 72, illetve 50%-ánál vált), hogy a teljes animáció lefusson, mielőtt a látogató továbbgörget; csökkentett mozgásnál a végállapot látszik |
| Mérés | GA4 `gtag('event')`, oldal-előtagú eseménynevek (`ov_…`, `campaign_…`); a teszt-domainen kis napló-panel mutatja, mi ment ki |
| A minőségkapu site-szintű leletei | `window.Stripe is not a function`, NAVBAR és lábléc 44 px alatti linkjei, a GreenGeeks-pecsét alt nélkül és név nélküli linkje. Ezek minden oldalon ott vannak; külön feladat a javításuk |

## 14. Oldalak állapota (2026-10-13)

| Oldal | Webflow | Kód (ág, mappa) | Állapot |
|---|---|---|---|
| CsicsergŐsz | `/kampanyok/csicsergosz` | `csicsergosz-levi`, `weboldal/kampany-csicsergosz/` (6 CSS-embed, lábléc-JS rögzített SHA-n) | **élő** |
| Főoldal, Szuperhős | `/fooldal-szuperhos-draft` | `fooldal-szuperhos`, `weboldal/fooldal-szuperhos/` | draft, stagingen; angol változat később (WebSummit) |
| Önkéntes vízadás, szezonzáró | `/kampanyok/onkentes-vizadas-2027-draft` | `vizadas-kivezetes`, `weboldal/kampany-vizadas-2027/` | draft, stagingen; a régi oldal kiváltása döntésre vár |
| Csatlakozz hub | `/csatlakozz-2026-draft` | `weboldal/csatlakozz/` | draft |
| Rólunk | terv, három változat | | döntésre vár |

Az ágak a `main`-be olvasztásra várnak; addig a fenti ágakon élő mappák a hitelesek.
