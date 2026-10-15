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
| `DS · Ajánlatkérés` | `18b953bc-5dbc-c820-52fc-b872c83459cb` | B2B-ajánlatkérő szekció natív űrlappal (`#ajanlatkeres`). Minden B2B- és eseményoldal alján. A legördülők opcióit és a helyőrzőket csak a Designerben lehet beállítani (az API nem tudja). A beküldésnél a Webflow rögzíti az oldal címét. |
| `DS · Céges ajánlatok` | `4a8cf67e-8a4c-11c0-c7b0-d9ee058d623c` | A hét B2B-ajánlat és az egyedi csomag kártyái. Ár vagy link csak itt változik. |

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
| Önkormányzatoknak | `/szolgaltatas/onkormanyzatoknak-draft` (végleges: `/szolgaltatas/onkormanyzatoknak`) | `6ad0fec68742368ed2447e50` |
| beeco@work | `/szolgaltatas/beeco-at-work-draft` (végleges: `/szolgaltatas/beeco-at-work`) | `6ad0ff9da66ec70398bb646a` |
| Madárraj | `/szolgaltatas/madarraj-draft` (végleges: `/szolgaltatas/madarraj`) | `6ad10049bbf6b6a670d07af4` |
| Locsolóraj | `/szolgaltatas/locsoloraj-draft` (végleges: `/szolgaltatas/locsoloraj`) | `6ad101368f61d11fe50780f6` |
| Zöld programok | `/szolgaltatas/zold-esemeny-szervezes-draft` (végleges: `/szolgaltatas/zold-esemeny-szervezes`) | `6ad1024116b88b9e111d33d1` |
| Partnerprogram | `/szolgaltatas/partner-draft` (végleges: `/szolgaltatas/partner`) | `6ad10346d3b34b78cda5ded0` |
| Zöld marketing | `/szolgaltatas/zold-marketing-draft` (végleges: `/szolgaltatas/zold-marketing`) | `6ad1041116b88b9e111e42bc` |
| Klímafreskó (esemény) | `/szolgaltatas/klimafresko-draft` (végleges: `/szolgaltatas/klimafresko`) | `6ad104c7f554be485482b7ce` |
| 3D zöld játékok (esemény) | `/szolgaltatas/3d-zold-jatekok-draft` (végleges: `/szolgaltatas/3d-zold-jatekok`) | `6ad1012a4d7cdc05c06650e2` |
| Kézműves workshop (esemény) | `/szolgaltatas/kezmuves-workshop-draft` (végleges: `/szolgaltatas/kezmuves-workshop`) | `6ad10253fd54269db0a667b7` |
| Zöld kvíz és ÖkoMuki (esemény) | `/szolgaltatas/zold-kviz-okomuki-draft` (végleges: `/szolgaltatas/zold-kviz-okomuki`) | `6ad10331eff45bdd57013307` |
| Csere-bere (esemény) | `/szolgaltatas/csere-bere-szervezes-draft` (végleges: `/szolgaltatas/csere-bere-szervezes`) | `6ad103e616b88b9e111e2d5e` |
| Előadás, filmklub, kerekasztal (esemény) | `/szolgaltatas/zold-eloadas-filmklub-draft` (végleges: `/szolgaltatas/zold-eloadas-filmklub`) | `6ad104a32d16062d8a5d2d98` |

A B2B-oldalak tartalma a `weboldal/b2b/oldalak.py`-ban van (sales- és eseménysablon, SEO: cím, leírás, Service + FAQPage + BreadcrumbList JSON-LD),
a végleges és a draft címek listája a `weboldal/b2b/ki/oldalterkep.json`-ban. Az oldalak egymásra a **végleges** címmel hivatkoznak, ezek az élesítésig 404-et adnak.

## 6. Buktatók (élesben derültek ki)

- A whtml **globális osztályt** hoz létre, combót nem. Combo: `data_style_tool` + `parent_style_names`.
- A whtml a médiatárban nem lévő képet (például a CMS-képeket) **eldobja**. Előbb feltöltés (`create_asset` + S3), utána `set_image_asset`.
- Blokk-div szövegét nem lehet `set_text`-tel átírni. Ilyenkor az elemet újra beszúrjuk, a régit töröljük.
- Az oldal másolása (`duplicateOf`) **nem viszi** a fejkódot, azt újra fel kell tenni.
- A `bulk_update_pages` a `draft`-ot nem állította. Ehhez oldalanként `update_page_settings` kell.
- Komponens-propot közös elemre kötni minden példányt érint. Ha a mobil más szöveget mutat (például `‹ főoldal`), a prop
  helyett egy kapcsolható második elem a biztonságos megoldás.
- Komponenspéldányt nem lehet egy másik példány (például a lábléc) **elé** beszúrni: az előző szekció **után** kell, két egymást követő példánynál fordított sorrendben.
- A `jsonLdSchema` az `update_page_settings`-ben nem mentődik, a `bulk_update_pages_schema_markup` igen.
- A site globális `a:hover` szabálya más betűre vált: minden link-osztály hover-állapota saját betűt kapjon (a `ds-gomb` így kapta meg).
- A whtml egy hívásban legfeljebb 5 akciót fogad.
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
