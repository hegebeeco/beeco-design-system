# Kampánytéma: CsicsergŐsz (Webflow)

Az őszi madárkampány (`/kampanyok/csicsergosz`) arculata, mozgáskészlete és mérése, **újrahasználható** formában.
Forrás: Ági arculati kézikönyve (`Csics_brand_board_03`), a beeco Webflow-osztályai és a CsicsergŐsz app képanyaga.
Ez **kampánytéma**, nem a termékbőr része: a saját palettája (krém, barack, kakaó, méz) csak a kampányoldalakon él.
A weboldal-réteg többi szabálya (`docs/weboldal.md`) érvényes rá, a 9. fejezet írja le, hogyan illeszkedik.

## Mi van a mappában

| Fájl | Mi | Hova kerül |
|---|---|---|
| `tokens.json` | a Webflow „Csicsergosz” változógyűjtemény tartalma (10 szín, 12 szerep, 2 betű, 14 méret, 8 szám) | Webflow → Változók (már fent van, site-szinten) |
| `cs-oldal.css` | oldalszintű kiegészítések: szekciók, ferde él, kampánygomb, 44 px-es site-elemek | oldal fejkód (a `head.html` része) |
| `cs-mozgas.css` + `cs-mozgas.js` | a mozgáskészlet (`data-cs-anim`, `data-cs-gyerekek`, `data-cs-szamlal`) | fejkód + lábléckód |
| `cs-meres.js` | Levi 7 mérési eseménye, GA4-be `gtag`-gel | lábléckód (a `footer.html` része) |
| `head.html`, `footer.html` | pontosan az, ami a kampányoldalon van (beilleszthető) | Page settings → Custom code |
| `review-szabalyok.json` | a kampányoldal ellenőrzésének szabályai (paletta, kabala, app-képernyő, események, mintaadat) | a `landing_review.mjs`-nek (minőségkapu skill) |
| `cs-raj.js` + `cs-raj.css` | **Raj modul**: közösségi számláló, közös cél, kerületi verseny, fotófal | jsDelivr-ről (fej: CSS, lábléc: JS) |
| `raj-minta.json` | mintaadat a Raj modulhoz (`"minta": true`) | addig, amíg nincs élő végpont |
| `raj-adat-szerzodes.md` | az élő végpont leírása Bencének | |

## Használat egy másik oldalon

1. **Tokenek és osztályok:** a „Csicsergosz” változók és a `CS*`/`cs_*` osztályok a Webflow-ban **site-szintűek**, tehát
   bármelyik oldalon a Designerből ráadhatók. Új oldalnál a meglévő `DIA_*` szekcióra tedd a `CS` kombót.
2. **Mozgás és oldal-CSS:** a `head.html` a fejkódba, a `footer.html` második `<script>` blokkja a lábléckódba.
   Vagy hivatkozással (a repó nyilvános):
   ```html
   <!-- fejkód -->
   <script>document.documentElement.classList.add("cs-js");setTimeout(function(){if(!window.csMozgasKesz)document.documentElement.classList.remove("cs-js")},2500)</script>
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hegebeeco/beeco-design-system@v1.44.0/weboldal/kampany-csicsergosz/cs-mozgas.css">
   <!-- lábléckód -->
   <script src="https://cdn.jsdelivr.net/gh/hegebeeco/beeco-design-system@v1.44.0/weboldal/kampany-csicsergosz/cs-mozgas.js" defer></script>
   ```
3. **Jelölés a Designerben** (Element settings → Custom attributes):

| Jelölő | Hatás |
|---|---|
| `data-cs-anim="fel"` | áttűnés + 16 px felcsúszás, amikor a képernyőre ér |
| `data-cs-anim="pop"` | kis ugrással beugrik (kabala, buborék) |
| `data-cs-anim="level"` | „lehulló levél” belépés (díszítő) |
| `data-cs-anim="sav"` | balról kitöltődő sáv (grafikon) |
| `data-cs-anim="rajzol"` | szaggatott útvonal kirajzolódik (`cs_lepes_lista`) |
| `data-cs-gyerekek="fel"` | a konténer gyerekei lépcsőzetesen (max. 6) |
| `data-cs-szamlal="17"` | a szám 0-ról felpörög |
| `data-cs-ferde="barack\|kakao\|feher\|krem"` (+`-j`) | ferde szekcióél a **lenti** szekción; a felette lévő szekció színe |

Szabályok: egyszer játszik le, csak `transform`/`opacity`/`clip-path`, ease-out, folyamatosan legfeljebb egy elem mozog
(Gabee). Csökkentett mozgásnál csak áttűnés. JS nélkül vagy hibánál 2,5 mp után minden látszik.

## Építőelemek (Webflow-osztályok)

| Elem | Osztály |
|---|---|
| Telefon-kompozíció | `cs_mockup` (+`kicsi`) > `cs_mockup_telefon` + `cs_mockup_kabala` + `cs_dekor` |
| Díszítő | `cs_dekor` + `jf` · `bf` · `jl` · `bl` · `ag` (tartalom mögött, kattintás átmegy) |
| Számozott lépések | `cs_lepesek` > `cs_lepesek_bal` (`cs_lepes_lista` > `cs_lepes` > `cs_lepes_szam`) + `cs_lepesek_jobb` (`cs_folyamat_kep`) |
| Kampánygomb | `BUTTON_MAIN` + `CS`, `BUTTON_TERC` + `CS` |
| Kártya | `CARD` + `CS_LINK` (kattintható, árnyékkal) · `CARD` + `CS_EGYENLO` (árnyék nélkül) |
| Fotó + matrica | `cs_kartya_foto` (a matrica a képbe égetve: fénykép + beeco-matrica) |

## Arculati szabályok (ellenőrizve a `review-szabalyok.json`-nal)

- Tiszta fekete nincs: keret, árnyék, cím kakaó. Méz az egyetlen interaktív kiemelő, narancs csak jelzés.
- Árnyék = kattintható. Statikus kártya, tényblokk, grafikon, buborék árnyék nélkül.
- Kabala: a madarász méhecske. A madárka (Csicser) csak indokolt helyen.
- App-képernyő oldalanként legfeljebb 3.
- Fotón csak hazai madárfaj (MME szakmai partner); ha a fotón idegen faj van, beeco-matrica takarja.

## Mérés

A site-on **nincs GTM**: a „Tag manager” komponens közvetlen GA4 (`gtag`, G-6KVDRD0YQF). A `gtag` a sima
`dataLayer.push({event})` objektumot nem továbbítja, ezért a `cs-meres.js` `gtag('event')`-tel küld. Kattintást egyetlen
ablakszintű, capture fázisú figyelő mér, mert a site-szintű Trustindex a horgonykattintást megállítja és 150 ms múlva
újrakattint; ugyanarra az elemre 600 ms-on belül jövő második kattintás nem számít.
Ellenőrizve 2026-10-05: a GA4-be (`g/collect`) megérkezik a `campaign_landing_view`, `campaign_activity_select`,
`campaign_faq_expand`, `campaign_primary_cta_click`, egyenként egyszer.

## Raj modul (közösség)

Négy blokk egy JSON-forrásból: `data-cs-raj="szamlalo|cel|verseny|fotofal"` gyökérelemek a Webflow-ban, bennük egy rövid
betöltés-szöveg (JS nélkül ez látszik). A forrás a számláló gyökér `data-cs-raj-forras` attribútuma: most a `raj-minta.json`,
élesítéskor Bence végpontja (`raj-adat-szerzodes.md`). Mintaadatnál minden blokk „Mintaadat” címkét kap, és a
`review-szabalyok.json` P1-et jelez, amíg az oldalon van: **mintaadattal az oldal nem élesíthető.**

| Blokk | Interakció | Mérés |
|---|---|---|
| Számláló | a számok felpörögnek, amikor a képernyőre érnek | |
| Közös cél | haladásjelző (`role=progressbar`), kitöltődik | |
| Kerületi verseny | sematikus méhsejt-térkép (23 kerület), kattintás/Enter, választólista, Budapest/Városok fül (nyilakkal) | `campaign_district_select`, `campaign_leaderboard_tab` |
| Fotófal | legfeljebb 8 kép, fókuszpont szerinti kivágás | |

## v1.50: egy helyen az oldal kódja

A Webflow-oldal fejkódja csak a `cs-kampany.css` és `cs-raj.css`, a lábkódja a `cs-meres.js`, `cs-mozgas.js`, `cs-raj.js`
és `cs-kampany.js` fájlokra hivatkozik (most a `csicsergosz-v3` ág: `@csicsergosz-v3`; a main-be olvasztás és kiadás után verziósáv). Javítás menete: a fájl módosítása helyben, Playwright-teszt
a jsDelivr-címek helyi fájlra irányításával, majd push az ágra és jsDelivr-purge. A Webflow-ban csak szerkezeti változáshoz kell nyúlni.

| Fájl | Mit csinál |
|---|---|
| `cs-kampany.css` | az oldal teljes stílusa (tokenek, tipográfia, gombok, szekciók, madarak, ragadós sáv) |
| `cs-kampany.js` | fülek, süvöltő, hero-madarak, szállingózó madarak, záró jelenet, interaktív háttér, ragadós letöltősáv |
| `cs-raj.js` / `.css` | országos számok, számláló, közös cél, verseny minitérképpel, fotófal |
| `cs-terkep.json` | Budapest kerületei (OSM, ODbL) és Magyarország körvonala (Natural Earth), egyszerűsített SVG-útvonalak |
