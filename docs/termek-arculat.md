# Termékbőr – szabálykönyv (app, admin, partner, web)

*Kristóf döntése (2026-10-01): a termékek az app neo-brutalista vonalát követik, finomítva, **fekete** tintával.
A játékok maradnak a Méhsejt-dioramánál (`docs/arculat.md`). A közös alap: `docs/rendszer.md`.*
Komponens-szabályok és öntesztek: `docs/komponensek.md`. Élő bemutató: `termek/bemutato.html` · tokenek: `tokens/theme-termek.json` · elemek: `termek/css/bc-*.css`.

## 1. Elvek

1. **Egy hangsúly: a méz.** A méz (`accent`) a fő művelet és a kijelölés színe (a gombszabály: 6/A).
2. **Fekete vonal, kemény árnyék a kattinthatón.** Keret 1–2 px fekete; a kattintható és kiemelt elem árnyéka átlós és éles
   (elmosás nélkül) – ez a beeco „kattanása”: lenyomáskor az elem az árnyéka helyére csúszik. A nem kattintható
   információs doboz puha árnyékot kap, így a kemény árnyék azt jelzi: „ez megnyomható” (6/A).
3. **Krém alap, fehér felület.** Az oldal krém (`bg`), a kártya és az űrlap fehér (`surface`) – így a tartalom kiemelkedik.
4. **Lalezar a hangnak, Open Sans a munkának.** Cím, szám, gomb: Lalezar (egy vastagság). Minden más: Open Sans.
5. **Tanítunk, nem szidunk.** A hibaüzenet megmondja, mi a következő lépés. Rossz választ, hibát sosem mérges méhecske kísér.

## 2. Szín-szerepek (a felület CSAK ezeket használja)

| Szerep | Világos | Sötét | Mire |
|---|---|---|---|
| `bg` | krém `#FFF8E7` | éjszaka `#1F2615` | oldal háttere |
| `surface` | fehér | éjszakai kártya `#353F25` | kártya, űrlap, táblázat, ablak |
| `surface-2` | `#F0F3EC` | olíva | csendes felület, tiltott mező, sor-kiemelés |
| `surface-accent` | vaj `#FEEEBB` | `#48542D` | kiemelt kártya, mértékegység-doboz, kijelölt sor |
| `ink` / `ink-soft` / `ink-muted` | fekete / `#505050` / `#676767` | krém / zsálya / ezüst `#C6C6C6` (1.54.0 óta) | szöveg: fő / másodlagos / helykitöltő |
| `line` / `line-soft` | fekete / `#C6C6C6` | `#B6C4A3` / `#596B39` | keret / elválasztó – a `line-soft` csak díszítő (≈ 1,7–1,9 : 1): vezérlő (gomb, mező) határa mindig `line`, kivéve a tiltott állapotot |
| `accent`, `accent-press`, `on-accent` | méz, nyomott méz, **fekete** | ← | fő gomb, kijelölés; szöveg a mézen mindig `on-accent` |
| `shadow` | fekete | fekete | kemény árnyék |
| `focus` | kék `#2656D9` | égkék | billentyűzet-fókusz (a gyűrű kifelé fut, az oldal- vagy felületháttéren) |
| `focus-on-accent` | kék `#2656D9` | fekete | befelé futó fókuszgyűrű méz hátterű elemen (kijelölt fül, szegmens) – 1.54.0 |
| `success` · `-bg` · `-ink` | levél · zsálya · erdő | lime · erdő · lime | sikeres, aktív |
| `danger` · `-bg` · `-ink` | `#DB3A34` · `#FDEEE6` · `#B3261E` | pipacs `#EF6A60` (1.54.0 óta) · bogyó · halvány rózsa | hiba, törlés |
| `warning` · `-bg` · `-ink` | parázs · vaj · rozsda | ← · rozsda · vaj | figyelmeztetés |
| `info` · `-bg` · `-ink` | víz `#0083E4` · jég · tengerkék | égkék · tengerkék · jég | tájékoztatás, víz |
| `highlight` | rózsa | ← | játékos kiemelés (ritkán) |

A kötelező kontraszt-párokat a `tokens/theme-termek.json` → `contrast` sorolja fel; a `npm test` mindkét módban ellenőrzi.

## 3. Forma és mélység

- **Sarok (a hivatalos skála: 2 · 4 · 8 · 12 px + kapszula):** `r-xs` 2 px (apró jelölő, hőtérkép-sáv, szövegkülönbség-jel) · `r-s` 4 px (mező, kis gomb) · `r-m` 8 px (gomb, kártya, táblázat) · `r-l` 12 px (felugró ablak) · `r-pill` (címke, kapcsoló).
- **Keret:** `bw-hair` 1 px (mező, csendes kártya) · `bw-base` 2 px (gomb, kártya, táblázat, ablak).
- **Árnyék – kemény, átlós, elmosás nélkül, a `shadow` szerep színével:** `shadow-s` 2 px (gomb, aktív fül) · `shadow-m` 4 px (kattintható kártya, értesítés) · `shadow-l` 6 px (felugró ablak, rámutatott kattintható kártya).
  Ez a **kattintható és kiemelt** elemeké. A **nem kattintható információs doboz** (kártya, panel, statisztika, táblázat) puha árnyékot kap: `shadow-soft`. A pontos lista: 6/A.
- **Fókuszgyűrű:** `--bc-focus-w` 3 px, `--bc-focus-offset` 2 px – a gyűrű **mindig kifelé fut (`outline-offset ≥ 2px`)**, így az oldal- vagy felületháttéren látszik, nem a mézen.
  Befelé (negatív offset) csak ott, ahol a görgető szülő levágná (fül, szegmens, csempe, térkép); méz hátterű állapotban ilyenkor a színe `focus-on-accent`. A `check-tokens` őrzi.
- **Ikon:** `--bc-icon-s` 16 · `-m` 20 (alap) · `-l` 24 px. **Állapot:** rámutatáskor a gomb háttere 88 %-ban önmaga, 12 %-ban `ink` (`--bc-hover-mix`); tiltott kapcsoló `--bc-disabled-opacity` .55 (a többi tiltott elem színnel jelez).
- **Töréspont (ajánlás új kódhoz):** `sm` 600 · `md` 900 (alkalmazásváz: 900 px alatt fiók) · `lg` 1200 px – SCSS `bc.bp(md)`, Tailwind `bc-md:`, Dart `BeecoTokens.bpMd`. A `termek/css` mai töréspontjai: 420 · 520 · 600 · 640 · 767/768 · 900 · 992 · 1200 px szélesség (+ egy 820 px-es magasság-lekérdezés az oldalsávban; egységesítés: külön feladat).
- **Térköz:** 4 px rács (`sp-1` … `sp-8`). Kártya belső margó `sp-5` (24), űrlapmezők között `sp-4` (16).

## 4. Betűk

| Token | Méret | Betű | Mire |
|---|---|---|---|
| `fs-3xl` | 46 | Lalezar | nyitóoldal főcím (ritkán) |
| `fs-2xl` | 34 | Lalezar | oldalcím, nagy szám |
| `fs-xl` | 26 | Lalezar | szakaszcím, ablakcím |
| `fs-l` | 20 | Lalezar | kártyacím, gomb felirata |
| `fs-m` | 16 | Open Sans | törzsszöveg, mező |
| `fs-s` | 14 | Open Sans | táblázat, címke, másodlagos |
| `fs-xs` | 12 | Open Sans | segítő szöveg, jelvény – **ennél kisebb nincs** |

Vastagság (hivatalos): **400 · 600 · 700** (a webes Open Sans 400–700 között változó; 800 nincs). A Lalezar egy vastagságú: a hierarchiát a méret adja.
Az app mai 500-as és 800-as vastagsága **eltérés**: a Flutter-átállásnál 800 → 700, 500 → 400 vagy 600 (képernyőnként, a hierarchia szerint; `docs/app-atallas.md`).

**Szövegstílusok (1.54.0, `--bc-text-<név>` + `--bc-text-<név>-ls`; Tailwind `text-<név>`; Dart `BeecoText.<név>`):**
`display` (3xl) · `heading-1` (2xl) · `heading-2` (xl) · `heading-3` (l) – Lalezar 400, `lh-tight`, betűköz `ls-display` .01em ·
`heading-4` (m, Open Sans 700) · `body` (m, 400, `lh-normal`) · `body-s` (s, 400) · `label` (s, 700 – mint a `bc-label`) · `caption` (xs, 400 – mint a `bc-help`).

## 5. Mozgás

- Nyomás: 120 ms, `ease-out` (`cubic-bezier(.23,1,.32,1)`); megjelenés 200 ms; fiók (mobil oldalsáv) 400 ms `ease-drawer` (`t-slow`).
- **UI-visszajelzés ≤ 300 ms** (gomb, mező, fül, lenyíló, átmenet), `ease-in` tilos (lassan indul – késésnek érződik), `transition: all` kerülendő.
- **Belépő / dekoratív mozgás ≤ 900 ms**, egyszer (vagy korlátozott ismétléssel): ünneplés és pecsét 400 (`t-slow`), konfetti és csík-ciklus 600 (`t-decor`), mézsejt-töltő ciklus 900 (`t-hero`). Csak animációban, átmenetben soha.
- A `bc-motion.css`-ben nincs nyers időérték, csak `--bc-t-*` token (a `check-tokens` őrzi).
- Rámutatás (hover) csak egérrel: `@media (hover: hover) and (pointer: fine)`.
- Csökkentett mozgásnál minden azonnali (a `bc-base.css` intézi) – végtelen animáció (pörgő) is megáll.
- Gyakori műveletet (listaszűrés, fülváltás) nem animálunk.

## 6. Elemek (`termek/css`)

| Elem | Osztály | Megjegyzés |
|---|---|---|
| Gomb | `bc-btn` + `is-secondary` / `is-ghost` / `is-danger` · `is-sm` / `is-lg` / `is-block` | folyamatban: `aria-busy="true"`; tiltva: `disabled` |
| Ikongomb | `bc-icon-btn` (+ `is-danger`) | 44×44; **kötelező `aria-label`** |
| Mező | `bc-field` › `bc-label` + `bc-input` / `bc-select` / `bc-textarea` + `bc-help` / `bc-error` | hibánál `aria-invalid="true"` + `aria-describedby` |
| Mértékegység | `bc-affix` | `<input>` + `<span>Ft</span>` |
| Jelölő, kapcsoló | `bc-check`, `bc-switch` (`role="switch"`, `aria-checked`) | |
| Űrlap-rács | `bc-form-grid` (+ `is-wide`), `bc-form-actions` | telefonon egy oszlop |
| Kártya | `bc-card` + `is-flat` / `is-accent` / `is-quiet` / `is-interactive`, `bc-card-title` | kattintható kártya **`<a>` vagy `<button>`** |
| Oldalfej | `bc-page-header` | cím + leírás + műveletek |
| Fülek | `bc-tabs` › `bc-tab` (`role="tab"`, `aria-selected`) | |
| Felugró ablak | natív `<dialog class="bc-modal">` › `bc-modal-head/-body/-foot` | `showModal()` → Esc és fókusz magától; React-portálnál `bc-scrim` |
| Címke | `bc-badge` + `is-success/-danger/-warning/-info/-accent/-muted` | |
| Sáv | `bc-alert` + ugyanazok | `role="alert"` csak hibánál |
| Értesítés | `bc-toast` + ugyanazok | a toast-könyvtár tárolóját öltözteti |
| Töltés | `bc-spinner`, `bc-skeleton` | pörgőnek `role="status"` + `aria-label` |
| Üres állapot | `bc-empty` | méhecske + egy mondat + egy teendő |
| Táblázat | `bc-table-wrap` › `bc-table` (+ `is-dense`), `bc-sort`, `.is-num` | rendezés: `aria-sort` a `<th>`-n |
| Statisztika | `bc-stats` › `bc-stat` › `-label` / `-value` / `-delta is-up/is-down` | szám csak forrásból / valós adatból |
| Váz | `bc-shell` › `bc-sidebar` (`bc-brand`, `bc-nav-group`, `bc-nav-link`) + `bc-main` › `bc-topbar` + `bc-content` | 900 px alatt fiók |

## 6/A. Gombok: piktogram és igazítás (Kristóf, 2026-10-01)
*Ez a szakasz a **gombszabály egyetlen forrása** (Javaslat 26, 3.5); a többi dokumentum ide hivatkozik.*
* **Egy fő gomb:** képernyőnként legfeljebb **egy méz (`accent`) fő gomb**; a többi művelet másodlagos, szellem vagy piktogram-gomb.
* **Csak piktogram – kompakt helyeken:** táblázat-sor (`RowActions`), eszközsáv, kártya-fejléc, galéria-csempe. A mentés · törlés · új · info · szerkesztés · megnyitás gomb itt szöveg nélkül áll, **mindig `TooltipIconButton`-nal** (a `label` a képernyőolvasó neve és a súgó-buborék).
* **Szöveg + piktogram:** az oldal fő gombja (pl. „Új partner”), az űrlap Mentése, a törlés megerősítése, az üres állapot teendője. Itt a félrekattintás drága – a szöveg a biztonság.
* **Szöveges gombon is legyen piktogram**, ha kapcsolódik hozzá (Mentés → `IcSave`, Törlés → `IcTrash`, Új … → `IcNew`, Szerkesztés → `IcEdit`, Megnyitás/Részletek → `IcOpen`, Info → `IcInfo`). A DS maga ad piktogramot: EditPage mentés-gomb, ConfirmDialog megerősítő gombja.
* **Igazítás:** a piktogram és a betűk *látható* közepe egy vonalban, a gomb közepén (a Lalezar nagybetűi 0,085 em-mel a sor közepe fölött ülnének – a `.bc-btn` ezt korrigálja; saját `padding-block` mellé add hozzá a `.17em`-et). Szövegmezőben a szöveg függőlegesen középen.
* **Mező-sorok alulra igazítva:** egymás mellett álló mezők, szűrők, kapcsolók alja egy vonalban, eltérő címke-magasság mellett is (`.bc-fb-row`, `.bc-row` → `align-items: flex-end`).
* **Árnyék (Kristóf, 2026-10-01, felülírja a „csak kemény árnyék” szabályt):** kattintható elem (gomb, kattintható kártya `is-link`/`is-interactive`, csempe, aktív fül/lap, bejelölt jelölő) → kemény, átlós árnyék; NEM kattintható doboz (kártya, statisztika, táblázat, mentés-sáv) → `--bc-shadow-soft` (nagy, halvány, elmosott). Árnyék nélkül: mező, szellem/tiltott/lenyomott gomb, `is-flat`.
* **Kattintható kártya:** az egész kártya kattintható (`.bc-card.is-link` + a fő link `.bc-card-link` – kiterjed a kártyára, billentyűvel is). **Csoportok** között elválasztó vonal: `.bc-divided`.
* **Morzsa** mindig a cím fölött; a cím-sáv kitölti a rendelkezésre álló szélességet. **Lapozó:** első/előző/oldalszámok/következő/utolsó + „1–25 / 312 · 1. oldal / 13”.
* **Jelölőnégyzet bejelölve zöld** (erdőzöld, fehér pipa).
* **Jelölőnégyzet:** márkázott atom (`CheckboxInput`, `Checkbox`, táblázat-sor) – fekete keret, bejelölve méz + pipa + árnyék, részleges „–”; natív négyzet nem maradhat.
* **Súgó (ⓘ):** háttér és körvonal nélküli piktogram; egérrel rámutatásra nyílik, kattintásra rögzül, érintésen koppintásra.
* **Szűrők és nézetváltó:** tartalomszélesség (hug) – nem nyúlnak ki a sor végéig.
* Gépi ellenőrzés: `tools/komp/oldal-meres.js` – „Igazítás” (P2), „Árnyék” (P2) és „Piktogram” (P3) leletek.

## 7. Tilos (a `ds-lint` fogja)

- Nyers szín (`#…`, `rgb()`, Tailwind `[#…]`), a Tailwind saját palettája (`bg-gray-100`) – csak szerep.
- Idegen betű (Inria, Roboto, Inter, Arial, Helvetica) és `serif` tartalék.
- Nyers betűméret, sarok, árnyék, időérték – csak token. 12 px alatti szöveg.
- `ease-in`; UI-átmenet 300 ms fölött; a fókusz eltüntetése (`outline: none`) `:focus-visible` pótlás nélkül; befelé futó fókuszgyűrű méz háttéren `focus-on-accent` nélkül.
- Puha árnyék **kattintható** elemen, kemény árnyék **nem kattintható** dobozon (6/A); a `line-soft` mint vezérlő határa.
- A gombszabály megsértése (6/A); mérges méhecske.

## 8. Sötét mód

`<html data-theme="dark">` vagy `<html class="dark">` (Tailwind), rendszer szerint: `data-theme="auto"`. Csak a szerepek
váltanak – ha a felület csak szerepet használ, a sötét mód magától működik. A méz sötétben is méz, rajta a szöveg fekete.

**Téma-váltó (1.23.0, Javaslat 09):** React-appban `ThemeProvider` az app gyökerében (a `<html>` `data-theme` + `.dark` jelzőit írja,
a választást megjegyzi), `ThemeToggle` a kezelőfelületen – kompakt helyen ikongomb, beállítás-oldalon *Világos · Sötét · Rendszer szerint*.
Villanásmentes induláshoz a `themeInitScript()` kimenete a `<head>`-be kerül. Új kódban `dark:` Tailwind-változat **nem kell**:
a szerepek maguktól váltanak.

## 9. Méhecske és logó

**Logó (1.25.0):** a `Logo` React-elem / `.bc-logo` a témával magától vált (`logo.webp` ↔ `logo-sotet.webp`, Javaslat 10).
**Méhsejt-háttér:** `AppShell pattern="honeycomb"` vagy `.bc-honeycomb` – díszítő, a méz színéből, a tartalom alatt.
A logó és a méhecske-képek a `web/assets/brand/` alatt (belső használatra; külső partneranyagban beeco-jóváhagyás kell).
Emoji-méhecske (🐝) helyett a rajzolt képeket használd – az emoji minden rendszeren másképp néz ki.
