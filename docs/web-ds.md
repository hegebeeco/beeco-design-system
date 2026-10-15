# Web DS – natív Webflow-blokkok és -komponensek

*2026-10-15. A beeco.hu új oldalai (Rólunk, Csapatunk, Hatásunk, /en, Cégeknek és településeknek) Webflow-natív
elemekből épülnek: osztály, változó, komponens és variáns, nem beágyazott CSS. Kristóf kérése: „amit csak tudunk, natív
Webflow-elemekből készítünk”, hogy a csapat a Designerben újra tudja használni és módosítani.*

Ez a [weboldal.md](weboldal.md) (tokenek → Webflow-változók, `bc-` osztályok, korlátok, publikálási szabály)
folytatása. Ami ott szabály, itt is az: **élesbe csak Kristóf publikál**, mi csak a tesztre
(`beeco-weboldal.webflow.io`).

| Mit keresel | Hol |
|---|---|
| Minden `ds-` osztály családonként, töréspontokkal, oldalanként | [weboldal/web-ds/KATALOGUS.md](../weboldal/web-ds/KATALOGUS.md) (generált) |
| Ugyanez gépi formában (osztály → CSS, oldalak; változók Webflow-azonosítóval) | `weboldal/web-ds/katalogus.json` |
| Önálló referencia-CSS előnézethez vagy más projekthez | `weboldal/web-ds/ds-blokkok.css` |
| Generátorok | `weboldal/rolunk/gen_ds.py` (közös blokkok, Rólunk, Hatás, Csapat, /en), `weboldal/b2b/gen_b2b.py` (B2B) |
| B2B számforrás | `weboldal/b2b/szamok.json` |
| Tesztek | `weboldal/web-ds/teszt/` |

## 1. Elvek

1. **Natív, újrahasználható.** Osztály, változó, komponens, variáns és prop. Beágyazott CSS csak arra, amit a Webflow-stílus
   nem tud (`@keyframes`, összetett árnyék, pszeudoelem), a [weboldal.md 3/d](weboldal.md) szerint.
2. **Meglévőt módosíts.** Előbb a meglévő komponens, változó vagy osztály (variáns, prop, combo). Új elem csak akkor, ha nincs.
3. **Színek csak változóból.** A 13 `bc-` változó a „beeco DS” kollekcióban él (`--_beeco-ds---bc-…`). A whtml-építő
   a `var()`-t nyersen hagyja, ezért beszúrás után változó-kötés kell (2. lépés).
4. **Töréspontok:** 991, 767 és 479 px (a Webflow sajátjai).
5. **Olvasható, magyar nevek.** `ds-szekcio`, `ds-kartya`, `ds-csomag-kiemelt`. A combo a szülő nevét viszi tovább
   (`menu-gomb.nyelv-sav`).
6. **Hozzáférhetőség:** érintési felület ≥ 44 px (szöveglink is), kontraszt ≥ 4,5:1, a fókusz látszik, `alt` minden képen.
7. **Szöveg:** tegezés, rövid igés gomb, nincs gondolatjel, minden szám mellett forrás. A B2B-oldalakon nincs általános
   zöld állítás és nincs kompenzációs állítás (2024/825/EU).

## 2. Egy oldal útja

1. **Generátor.** A szöveget és a szerkezetet a generátor írja (`python3 weboldal/b2b/gen_b2b.py`). A kimenet a
   `ki/<oldal>.json`: sorrendben beszúrandó `{nev, html, css}` akciók. Minden osztály CSS-e az első használatához megy,
   mert a whtml csak a beszúrt HTML osztályait építi.
2. **Beszúrás.** `data_whtml_builder` a lábléc-példány elé, sorrendben. Szöveget mindig a JSON-ból, gépi úton másolunk.
3. **Változó-kötés.** A `ki/*-valtozokotes.json` (osztály, töréspont, tulajdonság, változó-azonosító) alapján
   `data_style_tool`, `variable_as_value`.
4. **Fejkód** (oldalanként): a horgonykezelő (`weboldal/kozos/horgony.js`) és, ha kell, a mérés: GA4 `gtag`-gel, egyetlen
   ablakszintű figyelővel, elemenként 600 ms-os szűréssel.
5. **Teszt-publikálás:** `publish_site`, `publishToWebflowSubdomain: true`, üres `customDomains`. Az oldal ehhez
   `draft: false`. **Élesítés előtt Kristóf visszaállítja `draft: true`-ra, ami nem megy élesbe.**
6. **Ellenőrzés a publikált teszt-URL-en** (3. pont), majd a minőségkapu (`ui_audit`, `landing_review`).

## 3. Tesztek

A futtatáshoz a repó `playwright` függősége kell (`npm ci`), vagy a `PLAYWRIGHT_UT` környezeti változó.

```sh
node weboldal/web-ds/teszt/szovegdiff.cjs /en weboldal/rolunk/ki/e.json   # szöveg betűre egyezik-e a generátorral
node weboldal/web-ds/teszt/oldalkep.cjs /en /szolgaltatas/cegeknek-draft    # képernyőkép, kilógás, törött kép, JS-hiba
node weboldal/web-ds/teszt/gombteszt.cjs /en                                # horgony és link, Chromium + WebKit, asztal + mobil
python3 weboldal/web-ds/katalogus.py --check                                 # a katalógus naprakész-e
```

## 4. Webflow-komponensek

| Komponens | Azonosító | Variánsok és propok |
|---|---|---|
| `NAVBAR_OT_AJTO` (fejléc, „Öt ajtó”) | `8eb38c4b-2278-3b97-c382-2cb50492d4ca` | **Alap** és **Egyszerű** (`2de06495…`, vissza-link + egy gomb). Propok („Egyszerű sáv” csoport): Vissza link, Gomb szöveg, Gomb link, Egyedi vissza szöveg (be/ki), Vissza szöveg, Alap vissza szöveg (be/ki). „Nyelv” csoport: **EN gomb** (be/ki). ≥ 768 px-en a sávban (`menu-gomb.nyelv-sav`), alatta a lenyíló menü alján „English” (`menu-gomb.nyelv-lista`). Minden alapérték a magyar oldalak mostani szövege. |
| `LABLEC_ZARO` (lábléc, „Záró jelenet”) | `31f70823-de1d-bba6-2378-48e1cdcfdf78` | **Alap** és **Egyszerű** (`4ef4336d…`, csak az alsó sáv). Szövegei magyarok, propok még nincsenek. |
| `DS · Szakmai partnerek` | `cdfb35c0-e352-6c29-76b4-fc2abedce5a9` | Partnerlogó-szekció, a Rólunk- és a B2B-oldalakon. |
| `DS · Csatlakozz a rajhoz` | `ac7611cf-d666-f84b-d349-16271a460e0b` | Önkéntes-toborzó zárószekció. |
| `Tag manager` | `d4c0e15b-b38a-a06a-05f3-a8e1bfbb7f14` | GA4 (`gtag`). Minden oldalra kell. |
| `DOWNLOAD_BLOCK` | `53f370d6…` | Letöltés-blokk, Link 1 és Link 2 prop (alapérték: kanonikus áruházlink). |

## 5. Oldalak (teszt-URL, mind draft-jelöltek)

| Oldal | Útvonal | Webflow-azonosító |
|---|---|---|
| Főoldal Szuperhős | `/fooldal-szuperhos-draft` | `6acd904f7d7e4ee067608742` |
| Rólunk | `/rolunk-uj-draft` | `6ad0ccce07f0edf900c2ab1e` |
| Hatásunk | `/hatasunk-draft` | `6ad0ce6ea932768559e8ca0b` |
| Csapatunk | `/csapatunk-uj-draft` | `6ad0cf80413b208bfe0b0075` |
| English (Web Summit) | `/en` | `6ad0dd071320500f8c2003ed` |
| Cégeknek és településeknek | `/szolgaltatas/cegeknek-draft` | `6ad0f0145b8b8edbcc1a2f43` |
| CsicsergŐsz, natív másolat | `/kampanyok/csicsergosz-nativ-draft` | `6ad09c29e9ef90da22dce85e` |
| Önkéntes Vízadás 2027 | `/kampanyok/onkentes-vizadas-2027-draft` | `6acdf9170a36762817c460e6` |

## 6. Buktatók (élesben derültek ki)

- A whtml **globális osztályt** hoz létre, combót nem. Combo: `data_style_tool` + `parent_style_names`.
- A whtml a médiatárban nem lévő képet (például a CMS-képeket) **eldobja**. Előbb feltöltés (`create_asset` + S3), utána `set_image_asset`.
- Blokk-div szövegét nem lehet `set_text`-tel átírni. Ilyenkor az elemet újra beszúrjuk, a régit töröljük.
- Az oldal másolása (`duplicateOf`) **nem viszi** a fejkódot, azt újra fel kell tenni.
- A `bulk_update_pages` a `draft`-ot nem állította. Ehhez oldalanként `update_page_settings` kell.
- Komponens-propot közös elemre kötni minden példányt érint. Ha a mobil más szöveget mutat (például `‹ főoldal`), a prop
  helyett egy kapcsolható második elem a biztonságos megoldás.
- A Designerben Kristóf is dolgozik. Ha váratlan értéket látsz, kérdezz, ne állítsd vissza.

## 7. Döntésre vár

- **`ds-` és `bc-` átfedés.** A [weboldal.md 2.](weboldal.md) szerint a Webflow DS-osztályai `bc-` nevűek, és új osztály csak
  DS-elemhez jöhet. A `ds-` sorozat a natív oldalépítéshez készült, és részben átfed velük:

  | `ds-` | `bc-` megfelelő |
  |---|---|
  | `ds-gomb`, `ds-masod` | `bc-btn`, `is-secondary` |
  | `ds-kartya` | `bc-card` |
  | `ds-chip` | `bc-chip` |
  | `ds-szekcio` + `ds-hatter-*` | `bc-sec` + `is-accent` / `is-quiet` / `is-ink` |
  | `ds-burok` | `bc-wrap` |
  | `ds-ketto`, `ds-harom` | `bc-grid-2`, `bc-grid-3` |
  | `ds-cim1`–`ds-cim3`, `ds-lead`, `ds-szoveg`, `ds-szalag` | `bc-display`, `bc-title`, `bc-subtitle`, `bc-lead`, `bc-body`, `bc-eyebrow` |
  | `ds-idezet`, `ds-logosor`, `ds-forras`, `ds-foto`, `ds-szoveglink` | `bc-quote`, `bc-logos`, `bc-source`, `bc-figure`, `bc-link` |
  | `ds-mezo`, `ds-cimke`, `ds-bemenet` | `bc-field`, `bc-label`, `bc-input` |
  | `ds-szamsav`, `ds-lepesek`, `ds-ido` | `bc-stats`, `bc-steps`, `bc-tl` (a DS-ben megvan, a Webflow-ba még nem vittük át) |

  **Javaslat:** az összetett blokkok (`ds-csomag`, `ds-jelentes`, `ds-eset`, `ds-dij`, `ds-raj`, `ds-ember`, `ds-ut`,
  `ds-tovabb`, `ds-grafikon`) maradjanak `ds-` néven a Web DS-ben. Az alapelemek egy takarító körben váltsanak a `bc-`
  megfelelőre, oldalanként képernyőkép-összevetéssel. Addig új oldal az alapelemekhez is a `ds-` sorozatot használja,
  hogy egy oldalon belül ne keveredjen a kettő.
- **Névütközés a játék-kittel:** a kit (`web/`, játékok) is `ds-` előtagot használ; két név egyezik: `ds-chip` és `ds-lead`.
  Futásidőben nem ütköznek (a beeco.hu nem tölti be a kit CSS-ét), de egy közös előtag-döntés (például `web-`)
  a `bc-` takarítással együtt érdemes.
- **Hat változó csak a Webflow-ban él:** `bc-accent-ink`, `bc-raj-bg`, `bc-on-olive`, `bc-vaj`, `bc-domb`, `bc-paper`
  (értékük a katalógusban). A `tokens/` forrásba fel kell venni őket, különben a `webflow-build` nem tud róluk.
- **A GYIK** most nyitott kártyák (`ds-ketto` + `ds-kartya`). A harmonika (`bc-acc`) akkor jön, ha a Webflow-ba átvisszük.
