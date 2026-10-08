# Javaslat 26 – Szabály-feloldások: ellentmondások és hiányzó tokenek a design systemben

*Állapot: **javaslat** · készítette: Claude (Kristóf kérésére) · dátum: 2026-10-08*
*(Jóváhagyás után: **jóváhagyva** – lent a Döntés részben.)*

## 1. Igény
- Hol kell (projekt, képernyő): a két új dokumentációs oldal (Design System, F4 és F6) tartalmának összeállítása közben a repó dokumentumai, tokenjei és CSS-e több helyen ellentmondtak egymásnak, és több token hiányzik.
- Mit old meg a felhasználónak (egy mondat): egy helyen látszik, mi mivel ütközik, milyen lehetőségek vannak, és mit hogyan érint a döntés; addig a Design System oldal az ellentmondást **„Ismert eltérés”** vagy **Hiányzik** jelöléssel mutatja, nem takarja el.
- Mit használnak ma helyette (fájl, könyvtár): a lent megnevezett dokumentumok; a `docs/termek-arculat.md` 6/A szakasza és a `tokens/*.json` a ténylegesen érvényes.

**Fontos:** ez a lap nem dönt. Minden pontnál a lehetőségek és egy ajánlás van; a döntés Kristófé. A számok a repó tokenjeiből és CSS-éből valók; ahol Claude számolt, ott a képlet és az eredmény látszik (WCAG 2.x: csatorna / 255 → lineáris (`c ≤ 0,03928` esetén `c / 12,92`, különben `((c + 0,055) / 1,055)^2,4`); `L = 0,2126·R + 0,7152·G + 0,0722·B`; kontraszt `(L1 + 0,05) / (L2 + 0,05)`, `L1` a világosabb).

## 2. Mire épül (meglévő anyagok)
- DS-elemek: `tokens/core.json`, `tokens/theme-termek.json`, `tokens/theme-jatek.json`, `termek/css/bc-*.css`, `docs/termek-arculat.md`, `docs/rendszer.md`, `DESIGN.md`, `docs/komponensek.md`.
- Szint: szabály / token (nem komponens).

## 3. Az ellentmondások és a hiányok

### 3.1 Puha árnyék: tilos vagy megengedett?
- **Hol:** `docs/termek-arculat.md` 3. („Puha, elmosott árnyék a termékbőrben nincs”) és 7. („Tilos: puha, elmosott árnyék”); `DESIGN.md` („kemény, átlós, elmosás nélkül”); `docs/rendszer.md` 2. (a termékbőr árnyéka csak kemény). Ezzel szemben `docs/termek-arculat.md` 6/A („felülírja a »csak kemény árnyék« szabályt”: nem kattintható doboz → `--bc-shadow-soft`) és a `tokens/theme-termek.json` → `shadowSoft` (`0 8px 28px`, a `shadow` szín 9%-a).
- **Ellentmondás:** a 3. és 7. szakasz tiltja, amit a 6/A és a token előír; a kód a 6/A szerint működik.
- **Opciók:**

| | A | B | C |
|---|---|---|---|
| Mit jelent | a 6/A az érvényes: a puha árnyék a nem kattintható dobozoké; a 3., 7., `DESIGN.md`, `rendszer.md` szövege javul | vissza a „csak kemény” szabályhoz: a `shadowSoft` kivezetése (a név nem törölhető: elavultnak jelölés) | mint A, és felsoroljuk, mely elemek kapnak puha árnyékot |
| Előny | a kód és a doksi egyezik, nincs kódmunka | egyszerű szabály | nincs értelmezési vita |
| Hátrány | a „kemény = kattintható” jel csak szokás | minden doboz kemény: a kattinthatóság jele elmosódik; kódmunka a fogyasztókban | karbantartandó lista |

- **Ajánlás:** C. Mert a kód már így él, és a kemény/puha különbség hordozza a „kattintható?” jelzést.
- **A döntés hatása:** A/C: csak dokumentum és `ds-lint`-szabály (a tiltás szövegét hozzá kell igazítani). B: minden fogyasztó (admin, partner, web) kártyái, táblázatai, statisztikái változnak, FŐ verzió kell a token törlése miatt.

### 3.2 Sarok `xs` 2 px és a „4 · 8 · 12”
- **Hol:** `DESIGN.md` („4 · **8** · 12 px”), `docs/termek-arculat.md` 3. (`r-s`, `r-m`, `r-l`, `r-pill`; `xs` nincs). A `tokens/theme-termek.json` (`xs` 2), `docs/rendszer.md` 2. (2 · 4 · 8 · 12 · kapszula), `docs/weboldal.md`, `docs/arculat.md` 327. sor (2 · 4 · 8 · 12) viszont tartalmazza. Az `r-xs` használatban van (`bc-kieg.css`, `bc-media-terkep.css`, 6 előfordulás).
- **Ellentmondás:** a szabálykönyv szerint három sarokméret van, a token és a CSS négyet (öt a kapszulával) használ.
- **Opciók:** (A) az `xs` hivatalos: leírjuk, mire való (a CSS-ben: kis jelölők, hőtérkép-sáv, szövegkülönbség-jelölés); (B) az `xs` kivezetése `r-s`-re (a név marad, az érték változik: ez FŐ-szintű érték-döntés); (C) a szabály marad „4 · 8 · 12”, az `xs` „csak belső használat”.
- **Ajánlás:** A, mert a használata megvan, és a törlés nem szabad.
- **A döntés hatása:** A/C csak dokumentum; B a 6 előfordulás megjelenését változtatja.

### 3.3 Betűvastagság: 400 · 600 · 700 és az app
- **Hol:** `docs/termek-arculat.md` 4. és `tokens/core.json` (`fontWeight` 400/600/700, a `_fontWeight` megjegyzés: „800 nincs, az app w800-as szövegei a bold (700) szerepre állnak át”); `docs/app-atallas.md` 21. sor (w800 → w700). A felmérési feljegyzés szerint az app 500-as és 800-as vastagságot is használ; az **500** átállására a dokumentumokban nincs szabály.
- **Opciók:** (A) marad 400/600/700; az app 500 → 400 vagy 600, 800 → 700 (az átállás útmutatója bővül); (B) új `fw-medium` (500) token – a webes Open Sans változó betű 400–700 között, tehát a betű tudja; (C) az app saját vastagságait megtartja (eltérés a profilban).
- **Ajánlás:** A; az 500 helyét (400 vagy 600) a Flutter-átállásnál kell megnézni, mert a szöveg-hierarchia változik.
- **A döntés hatása:** csak az appot érinti; B új token (MELLÉK verzió) és a Dart-kimenet bővül.

### 3.4 Mozgás: „UI ≤ 300 ms”, de `slow` = 400 ms és 400–900 ms-os animációk
- **Hol:** `docs/termek-arculat.md` 5. („UI-mozgás ≤ 300 ms”; fiók 400 ms `ease-drawer`), `DESIGN.md`, `docs/AI.md` 6. szabály; `tokens/core.json` (`duration.slow` = 400); `termek/css/bc-motion.css` (a fejléc: „ünnepi pillanat ≤ 600 ms és egyszer, végtelen mozgás nincs, a töltő 10 mp után megáll”); `tests/docs-check.js` és `check-tokens`: „400 ms-os átmenet csak fióknál”.
- **Mért tények (a fájlból megszámolva):** a `bc-motion.css`-ben **10** literális időérték van (400, 400, 240, 30, 900, 150, 300, 600, 600, 180 ms), plusz az ismétlésszámok (11, 17, 3). (A korábbi felmérés ~13-at írt; a fájlban tízet találtunk.) A 300 ms-nál hosszabbak: ünneplés és pipa 400, pecsét `slow` = 400, mézsejt-töltő 900 ms × 11, haladásjelző 600 ms × 17, konfetti 600 ms.
- **Ellentmondás:** a szabály „≤ 300 ms”, a készlet ennél hosszabb ünnepi és töltő animációkat tartalmaz; a fejléc-szabály (≤ 600) és a `slow` (400) egyik dokumentumban sincs a szabálykönyvben.
- **Opciók:** (A) a szabály pontosítása három sorra: UI-átmenet ≤ 300; fiók 400; ünnepi ≤ 600 és egyszer; töltő: ciklus + 10 mp-es leállás; (B) tokenek a literálokra (`t-celebrate`, `t-stagger`, `t-attention`…) és a szabály A szerint; (C) az animációk lerövidítése ≤ 300 ms-ra.
- **Ajánlás:** A + B: a szabály pontos, és a nyers számok tokenné válnak (a `check-tokens` utána a literálokat is tilthatja).
- **A döntés hatása:** A: dokumentum. B: új tokenek (MELLÉK), a CSS-ben a literálok cseréje, a kinézet nem változik. C: a jutalom-animációk karaktere változik.

### 3.5 A gombszabály 6 helyen él
- **Hol:** `DESIGN.md` (Nem alkudható); `docs/termek-arculat.md` 1. (1. elv), 6/A és 7.; `docs/AI.md` (Szabályok 1. és 9.); a régi `brandbook/tartalom/alapok.json` és `elemek.json`; `brandbook/elemek/komponensek.json` (`gomb`, `lista-oldal`, `sorsolas`…).
- **Ellentmondás:** nincs érdemi ellentmondás, de a szöveg több helyen más szavakkal áll („egy méz fő gomb”, „egy fő gomb”, „legfeljebb egy méz gomb”), és a 6/A bővebb (piktogram, tooltip), mint a többi.
- **Opciók:** (A) egyetlen kanonikus hely – a Gomb komponensoldal –, a többi hivatkozik rá; (B) a `docs/termek-arculat.md` 6/A marad a forrás, az oldal azt idézi; (C) marad, ahogy van.
- **Ajánlás:** A (a komponensoldal már generált adatból áll: `komponensek.json` → `gomb`), a `DESIGN.md` és az `AI.md` egysoros összefoglalót tart.
- **A döntés hatása:** csak dokumentum; a „nincs ismétlődés” szabály teljesül.

### 3.6 A játékbőr forrása: `web/css/tokens.css` vagy `core.json`
- **Hol:** `docs/rendszer.md` 1. és 3. (a játékbőr „tükre” a `theme-jatek.json`, a forrás a kézzel írt `web/css/tokens.css`); `tokens/theme-jatek.json` `_readme`; a `check-tokens` veti össze a kettőt és a `core.json`-t.
- **Ellentmondás:** a termékbőr és a közös atomok generáltak (`core.json` → `dist/`), a játékbőr egy kézzel írt CSS, amelynek a JSON csak a másolata – két forrás, kézi szinkron.
- **Opciók:** (A) marad: a `tokens.css` a forrás, a JSON tükör, a `check-tokens` őr; (B) a `core.json` a forrás, a `tokens.css` generált (a `kit-sync` ugyanazt a fájlt viszi a játékokba, így nem törik); (C) részleges: a színek és időzítések a `core.json`-ból generált blokk, a játékbőr-specifikus rész kézzel.
- **Ajánlás:** C, B felé haladva. A `kit-sync`-en keresztül a játékok a fájl tartalmát másolják, a kimenet formája változatlan maradhat.
- **A döntés hatása:** a játékok nem törnek, ha a generált kimenet egyezik a mostanival (`tokens-build --check`); a játékbőr-szabályok szerkesztése átkerül a JSON-ba.

### 3.7 Új tokenek (ma nincsenek)
| Token | Ma hol él | Javasolt forma (értékek a mostaniak) | Megjegyzés |
|---|---|---|---|
| Szövegstílus (heading, body, label…) | `termek/css/bc-base.css`: `h1` = `fs-2xl`, `h2` = `fs-xl`, `h3` = `fs-l`, Lalezar 400, `lh-tight` 1,15, betűköz `.01em`; törzs `fs-m`, `lh-normal` 1,5; `h4`–`h6` Open Sans 700 | összetett stílus-tokenek a mostani értékekből (betű + méret + vastagság + sormagasság + betűköz) | a `lh-snug` (1,3) gazdátlan; a 14 és 12 px-es soroknak nincs rögzített vastagsága |
| Betűköz | csak a címsorokon `.01em` (literál) | `ls-display` | |
| Állapot: hover, disabled, selected | `bc-controls.css` 29. sor: `color-mix(in srgb, var(--_bg) 88%, var(--bc-ink))`; a tiltott és kijelölt állapot komponensenként más | `--bc-hover-mix` (88%), közös tiltott- és kijelölt-szerep | a hover 88% most literál |
| Töréspont | csak `@media`-ban: 420, 520, 600, 640, 767/768, 900, 992, 1200 px (**nem** a korábban említett 900/700/500) | dokumentált lista; tokenként csak SCSS/Dart/JS számára (CSS-változó `@media`-ban nem használható) | a 900 (alkalmazásváz fiók) az egyetlen dokumentált |
| Fókuszgyűrű | `bc-base.css` 29. sor: `outline: 3px solid var(--bc-focus); outline-offset: 2px` | `--bc-focus-w` (3 px), `--bc-focus-offset` (2 px) | lásd a 3.8 fókusz-pontját |
| Ikonméret | `react/src/inputs/ikonok.tsx`: 20 px; más helyeken 18 és 24 px | `--bc-icon-s/m/l` a ténylegesen használt méretekből | a vonalvastagság (2,2 / 2 / 2–2,2) is rögzítendő |
| Tónusskála | a mézből három primitív (`honey`, `honey-deep`, `butter`) | a döntés: kell-e egységes fokozatskála, vagy marad a névvel adott néhány fok | |
| Mozgás-idők | lásd 3.4 | `t-celebrate`, `t-stagger`… | |

- **Ajánlás:** sorrendben: fókuszgyűrű, hover/disabled/selected, szövegstílus (ezek a leggyakoribb kézi duplikációk); töréspont csak dokumentálva; a tónusskála és az ikonméret külön döntés.
- **A döntés hatása:** minden új token MELLÉK verzió, nincs törő változás; a komponens-CSS cseréje a kinézetet nem változtatja.

### 3.8 Mért kontrasztproblémák és javítási opciók
A kötelező lista (`tokens/theme-termek.json` → `contrast`) 18 párja mindkét módban rendben van (a legszűkebb: `on-accent` / `danger` 4,67 : 1, `ink-soft` / `surface` sötétben 7,85 : 1). Az alábbi párok **nincsenek a listán**, és a számolt értékük a küszöb alatt van (a Design System **Szín** oldala ugyanezeket „Ismert eltérésként” mutatja).

| Pár | Számolt | Küszöb | Hol számít |
|---|---|---|---|
| sötét `danger` (`red` `#DB3A34`) / `surface` (`night-surface` `#353F25`) | 2,47 : 1 | 3 : 1 (ikon, keret) | hibaikon, hibakeret kártyán |
| sötét `focus` (`sky` `#B1DEFF`) / `accent` (`honey` `#FECF39`) | 1,04 : 1 | 3 : 1 | fókuszgyűrű, ahol méz felületre esik |
| sötét `ink-muted` (`night-line` `#B6C4A3`) / `surface-accent` (`olive-strong` `#48542D`) | 4,42 : 1 | 4,5 : 1 | helykitöltő szöveg kiemelt kártyán |
| világos `line-soft` (`silver` `#C6C6C6`) / `surface` (`white`) | 1,71 : 1 | 3 : 1, ha vezérlő határa | elválasztó vonal |
| sötét `line-soft` (`olive-soft` `#596B39`) / `surface` | 1,90 : 1 | ugyanaz | elválasztó vonal |

**Opciók, a meglévő primitívekkel (kontraszt a megadott háttéren, a fenti képlettel):**

1. **Sötét `danger` a `surface`-en.** Jelölt primitívek a `night-surface`-en (és a `night` háttéren): `ember` 3,12 (4,38) – de a `warning` szerep is ez, a kettő összetéveszthető; `blossom` 6,48 (9,09); `blossom-bg` 9,12 (12,79). A `danger` jelenlegi `on-accent` párja (fekete a `red`-en) 4,67 : 1; `blossom`-ra cserélve fekete a `blossom`-on 12,24 : 1, `ember`-en 5,90 : 1. (A) sötétben a `danger` = `blossom` (a `highlight` szerep is `blossom`: ütközés a „játékos kiemeléssel”); (B) új primitív a `red` és a `blossom` között (új szín csak indokolva, CHANGELOG); (C) a hibaikon sötétben `danger-ink` (`blossom-bg`) színű marad, a `danger` csak kitöltésnek. **Ajánlás:** C (nincs új szín), és a `danger-ink` / `surface` pár kerüljön a kötelező listára.
2. **Sötét `focus` a mézen.** A `sky` a `night` háttéren 10,96, a `night-surface`-en 7,81, a mézen 1,04. A jelenlegi `outline-offset: 2px` miatt a gyűrű a legtöbb esetben a gombon *kívül*, az oldalháttéren fut; a kérdés csak ott áll fenn, ahol a gyűrű méz felületre kerül (méz konténer, belső elem). Jelölt színek a mézen: `navy` 7,31, `black` 14,20, `olive` 8,42 – de ezek a sötét háttéren 1,44 / 1,35 / 1,25. (A) kétszínű gyűrű (belső sötét + külső világos vonal), így mindkét háttéren látszik; (B) csak méz felületen sötét fókusz (`on-accent`) külön szabállyal; (C) marad, a mérés dönt. **Ajánlás:** előbb **mérés** a renderelt oldalon (hol esik a gyűrű mézre); ha van ilyen hely, A. A párt (`focus` / `accent`) a listára kell tenni.
3. **Sötét `ink-muted` a `surface-accent`-en.** Jelöltek az `olive-strong`-on: `sage` 5,74; `sage-bg` 6,64; `cream` 7,68 (a `surface`-en `sage` 7,85, a `night`-on 11,02). (A) sötétben `ink-muted` = `sage` – de akkor az `ink-soft` (`sage`) és az `ink-muted` egyforma (a hierarchia eltűnik); (B) a `surface-accent` sötétben világosabb fekete-olíva árnyalat (új primitív); (C) a helykitöltő szöveg kiemelt kártyán `ink-soft`. **Ajánlás:** C.
4. **`line-soft`.** Világosban `slate` 5,66 : 1 (túl erős elválasztónak), `silver` 1,71; a 3 : 1 körüli szürke nincs a primitívek között (új primitív lenne). Sötétben `leaf` 2,82, `night-line` 6,04. (A) a `line-soft` marad dekoratív elválasztó, a szabály kimondja: vezérlő határát nem jelölheti (arra a `line` való); (B) új, 3 : 1 körüli szürke. **Ajánlás:** A + a szabály dokumentálása.
- **A döntés hatása:** a szerepek értékének változtatása minden terméket érint (Kristóf-döntés, `docs/rendszer.md` 7.); a lista bővítése csak a `check-tokens` szigorodása, amit előbb a mostani értékekkel kell lefuttatni.

### 3.9 Elavult vagy egymásnak ellentmondó dokumentumrészek
| Hol | Mi a baj | Javaslat |
|---|---|---|
| `docs/rendszer.md` 4. | a telepítési példa `#v1.15.0`; a mai verzió 1.53.0 | `#vX.Y.Z` jelölés + hivatkozás a `docs/AI.md`-re (a Design System **Telepítés** oldala a `VERSION` fájlból generálja) |
| `brandbook/feluletek/admin.json` | „most `#v1.43.1`, a DS `1.49.3`” | a mai verzióra vagy „ellenőrizni kell” |
| `brandbook/feluletek/kaptar.json` | „nincs kapcsolat a DS-sel”, de a CHANGELOG 1.51.0 és 1.52.0 a Kaptár egyenként importált DS-CSS-ét említi (`bc-utvonal.css`, `bc-csapat.css`) | a Kaptár mai állapotának felmérése |
| `brandbook/feluletek/app.json` | a mobilminták (Javaslat 23) „jóváhagyásra várnak”; a `23-mobil-mintak.md` fejléce: jóváhagyva, 2026-10-07 | a profil frissítése |
| `brandbook/tartalom/elemek.json` | „Élő tesztlapok (41)”; a `termek/tesztlapok/lista.json` ma 45 tesztlapot sorol, a `komponensek.json` 54 elemet, az `AI.md` 149 React-komponenst (három külön szám) | a számok adatból (a Design System kezdőlapja már így generálja) |
| `docs/arculat.md` (Piktogramok) | „60 saját ikon”; a `web/js/pics.js` kulcsainak számolása többet ad, és a CHANGELOG 1.49.0 két újat említ (`pont`, `cel`) | a pontos szám ellenőrzése |
| `docs/weboldal.md` 338. sor | jsDelivr verziósáv `@1.46/…` – lehet, hogy szándékos rögzítés | ellenőrizni |
| `CHANGELOG.md` fejléc | „A beeco-jatek-kit változásai”; a repó és a csomag neve `beeco-design-system` | a név egységesítése |

- **A döntés hatása:** csak dokumentum.

### 3.10 Javaslatlap-számozás: kétszer 10, 11, 12
- **Hol:** `docs/javaslatok/`: `10-logo-sotet-es-mehsejt.md` és `10-weboldal-elemek.md`; `11-evszakos-mehsejt.md` és `11-weboldal-mozgas.md`; `12-allapot-skala.md` és `12-marketing-elemek.md`.
- **Következmény:** a hivatkozások kétértelműek: „Javaslat 10” a `termek-arculat.md` 9.-ben a logót jelenti, a CHANGELOG-ban (402. sor) a weboldal-elemeket; „Javaslat 12” a `check-tokens.js`-ben és a `core.json`-ban az állapot-skála, a CHANGELOG-ban (367. sor) a marketing-elemek; „Javaslat 11” a CHANGELOG-ban (357. sor) és a `weboldal.md`-ben (170. sor) a weboldal-mozgás, a saját lapján az évszakos díszítés.
- **Opciók:** (A) toldalék: a későbbi lapok `10b`, `11b`, `12b` (a fájlnév és a hivatkozások frissítésével); (B) új, szabad számok (27, 28, 29…) a weboldal-lapoknak; (C) marad, hivatkozáskor mindig a fájlnév.
- **Ajánlás:** A: a számok megmaradnak, a hivatkozások egyértelműek; a `docs/javaslatok/_sablon.md`-be bekerül: „a szám egyedi”. (Ez a lap a 26-os.)
- **A döntés hatása:** 6 fájlnév és kb. 10 hivatkozás (CHANGELOG, `termek-arculat.md`, `weboldal.md`, `check-tokens.js`, `core.json`, `14-vonal-allapot-kapcsolo.md`).

### 3.11 További kétértelmű szavak (amiket a szótár nyílt kérdésként kezel)
- **„atom”:** `docs/rendszer.md` / `DESIGN.md`: „közös atomok” = a `core.json` nyers értékei; `docs/komponensek.md` 2.: „atom” = komponensszint (Button, Input…). Javaslat: a `core.json`-ra „alapérték” vagy „primitív”.
- **„felület”:** terméktípus (admin, partner…) és vizuális sík (`surface`). Javaslat 25 szerint: terméktípus = felület, vizuális sík = sík.
- **„téma”:** a `tokens/theme-*.json` fájlnevekben a bőr; a felületen a világos/sötét; a „kampány-altéma” a harmadik. Javaslat: a fájlnevek maradnak, a szótár rögzíti a három jelentést.
- **Szerepnevek:** termékbőr `success` / `danger`, játékbőr `good` / `bad`.
- **Előtagok:** `bc-`, `ds-`, `bb-`, `h26-`, `cs-` dokumentált; a `jm-` jelentése a repóban nincs leírva.

## 4. Állapotok, szélső esetek, API
Nem komponens: nincs.

## 5. Hozzáférhetőség
A 3.8 pont hozzáférhetőségi (WCAG 1.4.3, 1.4.11, 2.4.7/2.4.11) hiányokat ír le; a javításuk a döntés után a `contrast` lista bővítésével gépileg is őrizhető.

## 6. Döntés (Kristóf tölti ki)
| Pont | Választott opció | Megjegyzés |
|---|---|---|
| 3.1 puha árnyék | | |
| 3.2 sarok `xs` | | |
| 3.3 betűvastagság | | |
| 3.4 mozgás-idők | | |
| 3.5 gombszabály egy helyen | | |
| 3.6 játékbőr forrása | | |
| 3.7 új tokenek (sorrend) | | |
| 3.8 kontrasztok (1–4) | | |
| 3.9 elavult részek | | |
| 3.10 számozás | | |
| 3.11 szavak | | |
- Dátum: …
