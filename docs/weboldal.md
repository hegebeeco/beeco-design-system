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

A Webflow-nak nincs komponens-CSS-e, ezért a `termek/css/bc-*.css` elemeit **osztálynévben** tükrözzük:
ugyanaz a név, ugyanaz a szerep.

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
6. Teszt-publikálás, és a jelentés átadása.
7. **Élesítés: csak Kristóf kifejezett engedélyével.** Alapértelmezésben nem történik meg.

## 9. Kampánytémák (pl. CsicsergŐsz)

Egy kampány saját arculatot kaphat (ősz, madarak: krém, barack, kakaó, méz), ami **nem** a termékbőr része. Ilyenkor:

| Réteg | Hogyan |
|---|---|
| Tokenek | **külön Webflow-gyűjtemény** a kampány nevével (`Csicsergosz`), `cs-` előtagú változókkal; paletta → szerep-tokenek (felület, szöveg, kiemelés, keret) → osztályok. A kampány egy helyen átszínezhető. |
| Osztályok | a meglévő site-osztályokra **kombó** (`DIA_KEK_OV` + `CS`, `BUTTON_MAIN` + `CS`), új elemhez kampány-előtag (`cs_`), ahogy a főoldal a `h26-`-öt |
| Mozgás, díszítés | oldal fejkód + lábléc, `data-cs-*` jelölőkkel (nem osztállyal), így a Designerben bárki ráteheti |
| Mérés | `gtag('event')`, ablakszintű figyelő (lásd 3. fejezet) |
| Ellenőrzés | `node tools/web-ellenor.js <staging> --oldalak /kampanyok/...` **és** a minőségkapu `landing_review.mjs` a kampány saját szabályfájljával (paletta, kabala, app-képernyő, események). A `web-ellenor` a termékbőr palettáját méri, ezért a kampányszíneket „DS-en kívüli”-nek jelzi: ez a kampányoldalon várt lelet. |

Minta és beilleszthető kód: **`weboldal/kampany-csicsergosz/`** (README, `tokens.json`, `head.html`, `footer.html`).

## 10. Élő oldalmodulok (pl. Csatlakozz: Kaptár-kapu)

Ha egy oldalrész adatból él (feladatlista, ranglista, számláló), a kód **modulként** a `weboldal/<téma>/` mappába kerül,
és az oldal a jsDelivr verziósávjára hivatkozik (`@1.46/…`). A Webflow-ban csak a gyökérelem van `data-<előtag>="<blokk>"`
jelölővel és egy betöltés-szöveggel; a modul helyet foglal, amíg betölt. Amíg nincs élő végpont, jelölt mintaadat
(`"minta": true`) fut látható címkével, és az oldal saját `review-szabalyok.json`-ja P1-et ad rá: **mintaadattal nem élesítünk.**
Az adatforrás és a mezők leírása a modul `*-szerzodes.md` fájljában van, a backend fejlesztőjének.

Minta: **`weboldal/csatlakozz/`** (Kaptár-kapu: nyitott feladatok szűrővel, raj-választó, szintek, ranglista, helyi csapatok).
