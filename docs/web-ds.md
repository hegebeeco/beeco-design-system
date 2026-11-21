# Web DS v2 – a beeco.hu építőkészlete (atomic)

*2026-11-21, v2. A beeco.hu oldalai Webflow-natív elemekből épülnek: változó → osztály → komponens → sablon.
Ez a lap a szabálykönyv: mit szabad, miből épül egy oldal, és hogyan mérjük. A v2 a csapat arculati review-ját
viszi be ([Javaslat 39](javaslatok/39-web-ds-v2-arculati-review.md), **jóváhagyásra vár**; a tesztoldalon él).*

A [weboldal.md](weboldal.md) (tokenek → Webflow-változók, publikálási szabály) folytatása.
**Élesbe csak Kristóf publikál**, mi csak a tesztre (`beeco-weboldal.webflow.io`).

| Mit keresel | Hol |
|---|---|
| Szabályok, atomok, organizmusok, sablonok | ez a lap |
| Gépi mérés egy publikált oldalon | `weboldal/web-ds/teszt/ds-lint.cjs` |
| Organizmus-könyvtár új oldal generálásához | `weboldal/web-ds/organisms.py` (`python3 weboldal/web-ds/organisms.py --demo`) |
| Minden `ds-` osztály családonként | [weboldal/web-ds/KATALOGUS.md](../weboldal/web-ds/KATALOGUS.md), `katalogus.json`, `ds-blokkok.css` (generált) |
| A v2 átállás lépései (68 stílusváltozás) | `weboldal/web-ds/migration/atoms_v2_plan.json` |
| Generátorok (a közös osztályok CSS-ének forrása) | `weboldal/rolunk/gen_ds.py` (közös blokkok, Rólunk), `weboldal/b2b/gen_b2b.py` (B2B) |

## 1. Öt alapszabály

1. **Vagy kattintható, vagy díszítő.** Ami kattintható, 4 px sarkot és kemény árnyékot kap. Ami díszítő (fotó, címke, sáv), szögletes és árnyék nélküli.
2. **Egy oldal, egy cél, egy fő gomb.** Lakossági oldalon a letöltés, B2B-oldalon az ajánlatkérés. Minden más másodlagos gomb vagy szöveglink.
3. **Meglévőből építs.** Változó → osztály → komponens → sablon. Új elem, változat vagy szabály csak Kristóf jóváhagyásával, javaslatlapon.
4. **Kevesebb doboz, kevesebb szín.** Kártya csak önálló tárgynak jár. Oldalanként legfeljebb három nyugodt háttér.
5. **Mérve adjuk át.** `ds-lint` 0 eltérés, a `beeco-weboldal-audit` kapu zöld, asztalon és mobilon megnézve.

## 2. Szabályok (a zárójelben a lint azonosítója)

| Téma | Szabály |
|---|---|
| Sarok (R1) | Kattintható elem és kártya: 4 px (`bc-r-s`), minden sarkon. Díszítő elem: 0 px. Kör csak ott, ahol a forma kör (profilkép, lépésszám, kerek ikongomb). Lecsapott vagy aszimmetrikus sarok nincs. |
| Árnyék (R2) | Csak kattintható elemen, kemény, elmosás nélkül, fekete. Két fajta: **nagy** `4px 4px 0 0` (gomb, kattintható kártya) és **kicsi** `2px 2px 0 0` (kis vezérlő). Rámutatásra 1 px-t emelkedik (5, illetve 3 px), lenyomva lesüllyed (1 px). Telefonon a kártyaárnyék elmarad. |
| Keret | 2 px (`bc-bw-base`), `bc-line`. Nem kattintható kártya: keret van, árnyék nincs. |
| Gomb (R3) | Két gomb: elsődleges (`ds-gomb`, méz) és másodlagos (`ds-gomb ds-masod`, fehér). A harmadik szint a szöveglink (`ds-szoveglink`). Szekciónként legfeljebb egy elsődleges. |
| Elválasztó (R4) | Két eltérő hátterű szekció között mindig `DS · Domb`, a **következő** szekció színével. |
| GYIK (R5) | Mindig a GYIK-sablon (`ds-gyik`, natív `details`), FAQPage JSON-LD-vel. |
| App-CTA (R6) | Lakossági oldal alján: appkép + QR-kód + két áruház-gomb (`DOWNLOAD_BLOCK`). |
| Kép (R7) | Nem jelenhet meg a saját méreténél nagyobban, nem torzulhat, van `alt`-ja (díszkép: `alt=""`). WebP; arány 4:3, 16:9 vagy 9:16. Saját fotó, nem AI-kép. |
| Kiemelés (R8) | `ds-kiemel` (méz háttér) csak 30 karakternél hosszabb címben, címenként egyszer. Szövegszínnel nem emelünk ki. |
| Szövegszín (R9) | Tinta, halvány tinta, fehér (sötéten). Barna vagy színes betű nincs: ami kiemelt adat (ár, forrás, év), az vaj hátterű **címke**. |
| Logó (R10) | Keret és háttér nélkül, szürkeárnyalatosan (`ds-logo`, `ds-logo-kep`). |
| Piktogram (R11) | Sárga foltos változat; fekete-fehér csak az EWWR-oldalon. Ikon mellett mindig felirat. |
| Háttér | Fehér, krém, halványzöld váltakozik. Vaj csak a nyitóban, sötét oldalanként legfeljebb egyszer. |
| Szekciócímke | `ds-szalag`: fekete alap, fehér betű, egyenes, ikon és körvonal nélkül. Szekciónként egy. |
| Szövegillesztés | Címkén, chipen, gombon legalább 16 karakter férjen egy sorba a legszűkebb nézetben (320 px). Ha nem fér: egy lépcsővel kisebb betű → két sor → rövidebb szöveg, ebben a sorrendben. |
| Mozgás | Visszajelzés ≤ 300 ms, `ease-out`. Automatikusan mozgó nyitó nincs. Csökkentett mozgásnál a végállapot látszik. |
| Betű | Lalezar csak cím, szám, gomb, címke; Open Sans minden más. Méretek a Tipográfia-változókból. |
| Hozzáférhetőség | Érintési felület ≥ 44 px, kontraszt ≥ 4,5:1, látható fókusz (`bc-focus`, 3 px), billentyűzettel bejárható. |

Kivétel: az áruház-jelvény kész képként érkező gomb, a képbe rajzolt sarka marad (a lint ismeri).

## 3. Atomok

| Atom | Osztály | Megjegyzés |
|---|---|---|
| Címek | `ds-cim1` (H1), `ds-cim2` (H2), `ds-cim3` (H3) | oldalanként egy H1 |
| Bevezető, szöveg | `ds-lead`, `ds-szoveg`, `ds-forras` | forrássor minden szám mellett |
| Szekciócímke | `ds-szalag` | sötét háttéren `ds-szalag-vilagos` |
| Kiemelés | `ds-kiemel` | lásd R8 |
| Gomb | `ds-gomb`, `ds-gomb ds-masod` | nagy árnyék |
| Szöveglink | `ds-szoveglink`, `ds-tartalom-link` | 44 px magas találati felület |
| Chip | `ds-chip` (+ `ds-chip-vilagos`, `ds-chip-sarga`) | 4 px sarok, 14 px félkövér; tény vagy szűrő, nem dísz |
| Címke | `ds-ut-ar`, `ds-cikk-forras`, `ds-ido-ho` | vaj háttér, tinta betű, szövegszélességű |
| Fotókeret | `ds-foto`, `ds-foto-kep`, `ds-foto-felirat` | 2 px keret, szögletes, árnyék nélkül |
| Piktogram | `ds-kartya-piko`, `ds-foto-piko` | sárga foltos SVG |
| Logó | `ds-logo`, `ds-logo-kep` | lásd R10 |
| Elválasztó | `DS · Domb` komponens | variáns = a következő szekció színe |
| Mező | `ds-mezo`, `ds-cimke`, `ds-bemenet` | natív Webflow-űrlapban |

## 4. Molekulák

| Molekula | Miből áll | Osztály |
|---|---|---|
| Szekciófej | címke + H2 + bevezető | `ds-szekcio-fej` |
| Gombsor | 1 elsődleges + legfeljebb 1 másodlagos | `ds-gombsor` |
| Chipsor | 2–5 chip | `ds-chipsor` |
| Kártya | piktogram + H3 + szöveg (nem kattintható: árnyék nélkül) | `ds-kartya` |
| Kattintható kártya | kártya + címke + „tovább” nyíl, az egész egy link | `ds-ut`, `ds-cikk`, `ds-tovabb-kartya` |
| Lépés | szám + cím + szöveg | `ds-lepes` |
| GYIK-elem | natív `details` + `summary` | `ds-kerdes` |
| Fotósor | fotókeretek + `DS · Fotósor vezérlő` | `ds-fotosor-*` (Javaslat 32, 34) |
| Űrlapmező | címke + bemenet + hibaüzenet | `ds-mezo` |

## 5. Organizmusok

Minden organizmus egy szekció (`ds-szekcio` + háttérosztály, benne `ds-burok`). Új oldalhoz az `organisms.py` függvénye adja a kész HTML-t.

| Organizmus | Függvény | Tartalma | Mikor |
|---|---|---|---|
| Nyitó | `hero()` | címke, H1, bevezető, gombsor, chipek, hero-képsor | minden oldal első szekciója, vaj háttéren |
| Tartalomsor | `feature_row()` | 16:9 kép piktogrammal, címke, H2, szöveg, egy gomb, legfeljebb 4 chip | hub-oldal típusblokkjai (Javaslat 38) |
| Kártyarács | `card_grid()` | szekciófej + 2–4 oszlop kártya | ajánlatok, előnyök, témák |
| Lépések | `steps()` | szekciófej + 3–4 lépés | „Így működik” |
| CMS-lista | `cms_list()` | szekciófej + natív Collection List helye + „mind” link | blog, kuponok, események |
| App-CTA | `DS · App letöltés` komponens (`app_cta()` a generátorban) | címke, H2, szöveg, `DOWNLOAD_BLOCK` (két áruház-gomb + QR), appkép | lakossági oldal alja |
| GYIK | `DS · GYIK` komponens (`faq()` a generátorban) | címke, H2, bevezető, kérdések, `DS · GYIK tovább` | minden oldal vége |
| Ajánlatkérés | `DS · Ajánlatkérés` komponens | natív űrlap | B2B-oldal alja (az app-CTA helyett) |
| Bizonyítéksáv | `DS · Számok`, logósor | számok forrással, partnerlogók | a fő gomb közelében |

A `page(sections)` kiszámolja, melyik szekció elé milyen színű domb kell. A `check_page(sections, template)` jelzi, ha a sablon kötelező eleme hiányzik vagy rossz a sorrend.

## 6. Oldalsablonok

A kötelező organizmusok sorrendje; közéjük más szekció is kerülhet.

| Sablon | Sorrend | Példa |
|---|---|---|
| `hub` | nyitó → tartalomsorok → app-CTA → GYIK | `/beecopedia` |
| `landing` | nyitó → lépések → (CMS-lista) → app-CTA → GYIK | `/app/kuponok`, `/app/zold-esemenynaptar` |
| `guide` | nyitó → kártyarács → app-CTA → GYIK | hulladék-kisokos |
| `service` | nyitó → bizonyítéksáv → kártyarács → lépések → GYIK → Ajánlatkérés | `/szolgaltatas/*` |
| kampány | nyitó → miért → hogyan → bizonyíték → app-CTA → GYIK | CsicsergŐsz (saját színkollekcióval) |
| főoldal | nyitó (egy üzenet, 3D app-mockup) → mit tud az app → bizonyíték → céges út → app-CTA → sajtósáv → GYIK | átépítés alatt |

Minden sablonban: egy H1; SEO-cím ≤ 60, leírás ≤ 155 karakter; JSON-LD (FAQPage, BreadcrumbList, szolgáltatásnál Service); morzsa a nyitóban.

## 7. Egy oldal útja

1. **Sablon választása** (6. fejezet), a szöveg a `beeco-szovegezo` szerint.
2. **Generátor.** A szekciók az `organisms.py` függvényeiből állnak össze; a kimenet `ki/<oldal>.json` (`{nev, html, css}` akciók). `check_page()` zöld.
3. **Beszúrás.** `data_whtml_builder` a lábléc elé, sorrendben (hívásonként legfeljebb 5 akció). Komponenspéldányok (Domb, letöltés, GYIK tovább) utána.
4. **Változó-kötés.** `data_style_tool`, `property_value: "var(--_beeco-ds---bc-…)"`. Nyers szín nem marad.
5. **Fejkód és mérés** a `meresi-terv.json` szerint.
6. **Teszt-publikálás:** `publish_site`, `publishToWebflowSubdomain: true`, **üres** `customDomains`.
7. **Ellenőrzés a publikált teszt-URL-en:** `ds-lint` (0), `beeco-weboldal-audit` kapu, képernyőkép asztalon és mobilon.
8. **Élesítés:** csak Kristóf igenjével.

Meglévő oldal újrahúzása ugyanez: a lint megmutatja, mely elemek térnek el, ezeket cseréljük a megfelelő organizmusra.

## 8. Tesztek

A futtatáshoz a repó `playwright` függősége kell (`npm ci`).

```sh
node weboldal/web-ds/teszt/ds-lint.cjs <URL> [...] [--json ki.json] [--strict]   # Web DS-szabályok (R1–R11)
node weboldal/web-ds/teszt/szovegdiff.cjs /en weboldal/rolunk/ki/e.json            # szöveg egyezik-e a generátorral
node weboldal/web-ds/teszt/oldalkep.cjs /en /szolgaltatas/cegeknek                 # képernyőkép, kilógás, törött kép, JS-hiba
node weboldal/web-ds/teszt/gombteszt.cjs /en                                       # horgony és link, Chromium + WebKit
python3 weboldal/web-ds/katalogus.py --check                                       # a katalógus naprakész-e
python3 weboldal/web-ds/organisms.py --demo                                        # az organizmus-könyvtár önpróbája
node .claude/skills/beeco-weboldal-audit/scripts/audit.mjs <URL> --fast            # a weboldal-kapu
```

A lint a fejlécet és a láblécet külön számolja („keret”), a tartalom eltérései adják az oldal számát.

## 9. Webflow-komponensek

| Komponens | Azonosító | Variánsok és propok |
|---|---|---|
| `DS · Szekciófej` | `96a96302-3999-4e1f-a655-23fc1d4aa55f` | Címke + H2 + bevezető. Propok: Címke, Cím, Bevezető (szöveg), Címke látszik, Bevezető látszik (kapcsoló). Javaslat 40. |
| `DS · Gomb` | `ef6762a3-cbeb-9948-b80c-263095d2a4d0` | Változat: Elsődleges (alap, méz) és Másodlagos (fehér). Propok: Felirat, Link, Mérési címke (`data-app-cta`). Javaslat 40. |
| `DS · App letöltés` | `0951b307-2dd7-06cb-f1d9-b7da79410404` | Teljes app-CTA szekció (`#app`): címke, cím, szöveg, `DOWNLOAD_BLOCK`, appkép. Propok: Címke, Cím, Szöveg (az alapérték a jóváhagyott szöveg). Változat: Halványzöld (alap), Fehér, Krém. „Domb” hely: ide kerül a következő szekció színének megfelelő `DS · Domb`. Javaslat 40. |
| `DS · GYIK` | `066156dc-911c-d3b8-e189-fad56e1e5c55` | Teljes GYIK-szekció (`#gyik`): címke, cím, bevezető, `DS · GYIK tovább`. Propok: Címke, Cím, Bevezető (szöveg), Címke látszik, Bevezető látszik (kapcsoló). Változat: Fehér (alap), Krém, Halványzöld. „Kérdések” hely: ide kerülnek az oldal kérdései (`details.ds-kerdes`); a hely maga a lista (`ds-kerdesek`), nincs külön burok. „Domb” hely: elválasztó a szekció végén, ha más színű szekció következik. A FAQPage JSON-LD az oldal beállításaiban marad. Javaslat 40. |
| `DS · Domb` (elválasztó) | `ad993b5e-bdbd-a8e3-169e-0fbe16aaf0a7` | Variáns = a következő szekció színe: Krém (alap), Fehér, Halványzöld, Vaj, Zöld, Sötét. Az azonosítók az `organisms.py`-ban. |
| `DS · GYIK tovább` | `3c90afc8-1d53-ebc7-228a-020a939b8640` | A GYIK-szekció záró linkje. |
| `DS · Fotósor vezérlő` | `e3bff70b-4460-0ea0-f7e9-8598064ff13a` | Előző, következő, számláló, sáv; a `.ds-fotosor` végére. |
| `NAVBAR_OT_AJTO` (fejléc, „Öt ajtó”) | `8eb38c4b-2278-3b97-c382-2cb50492d4ca` | **Alap** és **Egyszerű** (`2de06495…`, vissza-link + egy gomb). Propok („Egyszerű sáv” csoport): Vissza link, Gomb szöveg, Gomb link, Egyedi vissza szöveg (be/ki), Vissza szöveg, Alap vissza szöveg (be/ki). „Nyelv” csoport: **EN gomb** (be/ki). ≥ 768 px-en a sávban (`menu-gomb.nyelv-sav`), alatta a lenyíló menü alján „English” (`menu-gomb.nyelv-lista`). Minden alapérték a magyar oldalak mostani szövege. |
| `LABLEC_ZARO` (lábléc, „Záró jelenet”) | `31f70823-de1d-bba6-2378-48e1cdcfdf78` | **Alap** és **Egyszerű** (`4ef4336d…`, csak az alsó sáv). „Nyelv” csoport: **Magyar alsó sáv** (be, alapérték) és **Angol alsó sáv** (ki). Az angol sáv („Alsó sáv (EN)”, ugyanazok az osztályok) az /en szekcióira mutat (Why now, Offers, Impact, Contact) és a magyar főoldalra; angol aria-label a közösségi ikonokon. Csak az /en-en van bekapcsolva. |
| `DS · Nyitó` | `9b682fa3-0643-33e3-1edf-18ffc1adbfae` | A nyitó szekció váza. Propok: Címke, Címke látszik, Bevezető, Bevezető látszik, Morzsa látszik (alapból ki), Chipek látszanak, Horgony (a szekció azonosítója). Helyek: Morzsa (`DS · Morzsamenü`), Cím (az oldal saját H1-e, kiemeléssel), Gombok (`DS · Gomb`), Chipek, Kép (fotósor vagy kép), Domb. Változat: Vaj (alap), Fehér, Krém. Első használat: `/beecopedia`. Javaslat 40. |
| `DS · Fotósor` | `655da44b-36dc-9130-48cb-d80d6f1c9953` | Görgethető fotósor a vezérlővel. Prop: Leírás (a képsor neve a képernyőolvasónak). „Képek” hely: maga a sor (`ds-fotosor-sor`), ide kerülnek a fotókeretek (`ds-fotosor-elem`). A `beecoFotosor` szkript kezeli. Első használat: `/cegeknek`. A nyitóban lévő képsor egyelőre kézzel épített elem a Nyitó „Kép” helyén. Javaslat 32, 40. |
| `DS · Lépések` | `abcb65a8-4709-5d8e-1787-b39649dadeb9` | „Így működik” lépéssor (a `ds-lepesek` doboz, a szekciófej külön komponens). Propok: lépésenként cím és szöveg (1–4.), „4. lépés látszik” kapcsoló. Első használat: `/app/kuponok`. Javaslat 40. |
| `DS · Kártya` | `8821a69d-e2dc-6a62-2281-5f39eca5ae1d` | Álló (nem kattintható) kártya. Propok: Cím, Szöveg, Piktogram (kép), Piktogram leírása (alt; üres = díszkép), Piktogram látszik. Kattintható kártyához a `ds-ut` / `ds-cikk` minta való. Első használat: `/szolgaltatas/madarraj`. Javaslat 40. |
| `DS · Kártyarács` | `8d61b136-2043-8021-9275-ea119f69898e` | Rács a „Kártyák” hellyel (ide `DS · Kártya` példányok kerülnek). Változat: Három oszlop (alap), Két oszlop, Négy oszlop; a töréspontok a `ds-harom` / `ds-ketto` / `ds-negy` osztályokét követik. Javaslat 40. |
| `DS · Velük dolgoztunk` (logósor) | `d90a6abf-dd67-c4e6-c073-775f80c2694a` | Bizalmi logósáv a fejléc alatt. Változat a közönség szerint: Vegyes (alap, 8 logó), Nagyvállalatok (4), Önkormányzatok (14), Kuponpartnerek (10). Prop: Cím. A nem látszó logócsoportok rejtve vannak (`ds-lcs-*` burkolók), a képeik nem töltődnek le. A korábbi három külön komponenst váltja ki (Javaslat 40). |
| `DS · Szakmai partnerek` | `cdfb35c0-e352-6c29-76b4-fc2abedce5a9` | Partnerlogó-szekció, a Rólunk- és a B2B-oldalakon. |
| `DS · Csatlakozz a rajhoz` | `ac7611cf-d666-f84b-d349-16271a460e0b` | Önkéntes-toborzó zárószekció. |
| `Tag manager` | `d4c0e15b-b38a-a06a-05f3-a8e1bfbb7f14` | GA4 (`gtag`). Minden oldalra kell. |
| `DOWNLOAD_BLOCK` | `53f370d6…` | Letöltés-blokk, Link 1 és Link 2 prop (alapérték: kanonikus áruházlink). |
| `DS · Ajánlatkérés` | `18b953bc-5dbc-c820-52fc-b872c83459cb` | B2B-ajánlatkérő szekció natív űrlappal (`#ajanlatkeres`). Minden B2B- és eseményoldal alján. A legördülők opcióit és a helyőrzőket csak a Designerben lehet beállítani (az API nem tudja). A beküldésnél a Webflow rögzíti az oldal címét. |
| `DS · Céges ajánlatok` | `4a8cf67e-8a4c-11c0-c7b0-d9ee058d623c` | A hét B2B-ajánlat és az egyedi csomag kártyái. Ár vagy link csak itt változik. |
| `DS · Számok` | `18603966-8b77-9ab5-1895-5cddc4e14f4b` | Számsáv forrással (sötét szekció): 6 érték + felirat, forrássor, link. 14 prop; az alapértékek az üzleti terv v3.4 számai. A Rólunk v3, a Sajtó és a Hatásunk oldalon ugyanez a példány: a számokat itt kell szerkeszteni (Javaslat 33). |
| `DS · Választó` | `e34730c2-0a8f-aeed-bbec-5e89a13e7d7d` | Hat csempés „Miért jöttél?” választó (`ds-valaszto`, `ds-valaszto-elem`). 18 prop (cím, alcím, link csempénként), a piktogramok fixek; a `rolunk_valaszto_klikk` esemény a komponensben van (Javaslat 33). |
| `DS · Utak` | `cb9fa756-68f8-f437-f703-a87c224a7b00` | A sales-rendszer öt útja (HR, ESG, marketing, zöld bolt és KKV, önkormányzat). Minden sales-aloldal alján; „Mutat” kapcsolók rejtik a saját kártyát. |
| `AppLépés` (minta, `fs-u-*` osztályok) | – (egyelőre osztályminta, nem komponens) | Váltakozó bal/jobb sor az app útjához: szövegkártya + számozott állomás + nagy app-képernyő. Sor: `fs-u-lepes` + `fs-u-bal` vagy `fs-u-jobb` (+ `fs-u-solo`, ha nincs képernyő); fázis-címke: `fs-u-fazis`; kitöltő vonal: `fs-u-ut`. Mobilon (≤ 767 px) egymás alatt, az út balra kerül. Animáció: IX3 görgetés (sor oldalról, út kitelik), csökkentett mozgásnál a végállapot. Nektár-jelzés egyelőre nincs (Kristóf, 2026-10-30). Komponenssé csomagolás: a bal/jobb irányhoz variáns kell, ezért a Designer-ellenőrzés után. |

Új oldalon a szekciófej, a gomb, az app-CTA és a GYIK komponensből jön; a meglévő oldalak kézzel épített változatai az újrahúzáskor cserélődnek (első példa: `/beecopedia`). Chip, kártya és szekció továbbra is osztály.

**Komponens helyének (slot) feltöltése az API-val:** `data_component_builder` → `insert_in_slot` (komponens vagy elem). Meglévő elemet úgy lehet helyre mozgatni, hogy előbb egy ideiglenes elem kerül a helyre, a meglévők `move_element`-tel elé kerülnek, majd az ideiglenes törlődik. A helybe tett `DS · Domb` egy osztály nélküli burokba kerül; a lint ezt ismeri.

## 10. Buktatók (élesben derültek ki)

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
- A CMS-elemek képei nem site-assetek: csere feltöltéssel és a CMS-mező frissítésével megy.
- Publikálni percenként egyszer lehet (429).
- A közös osztály módosítása **minden** oldalon érvényes, a következő éles publikálással élesben is. Módosítás előtt mentés (`~/CLAUDE/webflow-mentes/`).

## 11. A v2 átállás állapota (2026-11-21, tesztoldal)

**Teljes oldalas DS-check:** 72 oldal (52 statikus + a 10 CMS-gyűjtemény 2–2 mintája), `ds-lint`.

| Mutató | Érték |
|---|---|
| Eltérés a 72 mért oldalon | **1359** (a harmadik kör előtt 1778) |
| 0 eltérés | 11 oldal; legfeljebb 5 eltérés: 34 oldal |
| CMS-oldalak (393 oldal, 10 sablon) | becslés: kb. 8200 → 2600 (gyűjteményenként 2 minta alapján) |
| Teljesen `ds-` oldal | 30 a 72-ből |

| Oldalcsoport | Oldal | Eltérés | A legnagyobb tételek |
|---|---|---|---|
| Kampányok | 6 | 545 | Madárkisokos 335, Vízadás 111, CsicsergŐsz 45, EWWR 36 |
| App | 8 | 236 | GYIK 106, lábnyom-metodika 58, térkép 53 |
| Főoldal | 1 | 155 | `fs-` osztályok |
| Szolgáltatás | 17 | 156 | Partner 39, a többi 6–14 (piktogram foltszíne) |
| Rólunk | 9 | 39 | Rólunk 13, Csatlakozz 12 |
| Nyereményjáték, beebolt, /en | 4 | 67 | régi GYIK, webshop-elemek |
| Beecopédia | 7 | 20 | szezonális étkezés 9 |
| CMS-minták | 20 | 141 | termék 22, ökoirányító 9, recept 8, blogcikk 7 oldalanként |

A 12 elsőként mért oldalon: 1252 → 276.

Mi történt:
1. **Első kör:** 68 stílusváltozás a közös `ds-` osztályokon, a `DOWNLOAD_BLOCK` gombjai és QR-kódja (`migration/atoms_v2_plan.json`).
2. **Második kör:** a régi közös osztályok (`card` és változatai, `button_main`, `sub-heading`, `text_chip`, `blog_img_blokk`).
3. **Harmadik kör:** a CMS-sablonok régi osztályai (chipek, szövegdobozok, képek, `main-button`); egy osztály egy egész gyűjteményt javít. A 2–3. kör listája: `migration/legacy_v2_changes.json`.
4. A régi `card` osztály linkként és sima dobozként is él, ezért alapállapotban nincs árnyéka, csak rámutatásra.
5. Mentés a régi értékekről: `~/CLAUDE/webflow-mentes/2026-11-21-web-ds/`.

Újramérés: `node weboldal/web-ds/teszt/ds-lint.cjs <URL-ek> --json ki.json`; az URL-lista a `sitemap.xml`-ből jön (statikus oldalak + gyűjteményenként két minta).

Következő körök:
1. **Komponensek rendbetétele** ([Javaslat 40](javaslatok/40-webflow-komponensek-rendbetetele.md), jóváhagyva 2026-11-21): kész a `DS · Szekciófej`, `DS · Gomb`, `DS · App letöltés`, `DS · GYIK` (a `/beecopedia` oldalon élesben kipróbálva) és a csoportnevek egységesítése („Web DS”). Hátravan: a négy komponens kiterjesztése a többi `ds-` oldalra, a `DS · Logósor` összevonás, a térköz-komponensek kivezetése, a Nyitó, a Kártyarács, a Lépések, a Fotósor és a Cikk-kártya. A 14 használaton kívüli komponens törölve (négy megtartva: `NAVBAR_REGI_BACKUP`, `NAVBAR_MEGA`, `ROLUNK_ERTEKEK`, `CSAPAT_FOTOSLIDER`).
2. **Főoldal:** az átépítés a 6. fejezet főoldal-sablonjára, `fs-` → `ds-`.
3. **App GYIK és nyereményjáték:** a régi `home-faq-*` cseréje a GYIK-sablonra.
4. **Piktogramok:** a Javaslat 35 (fehér folt a B2B-oldalakon) és a „sárga foltos mindenhol” szabály ütközik, Kristóf dönt.
5. **Kampányoldalak** (`cs-`, `ov-`): a döntés után.
6. **Partner „Egy nap” animáció, letöltés-oldal:** a beágyazott CSS igazítása.
7. **Hiányzó dombok** a régi `dia_*` szekciók között (80 hely); **galéria nagyítása**.

## 12. Irány: profibb, érthetőbb, több letöltés, jobb SEO

- **Érthetőség:** oldalanként egy üzenet és egy fő gomb. A nyitó öt másodperc alatt megmondja, mi ez és mit tegyél. Állókép (3D app-mockup), automatikus mozgás nélkül.
- **Letöltés:** minden lakossági oldal ugyanarra az app-CTA-ra fut ki; a fejléc gombja is letöltés. Mérjük az utat: `app_store_click` oldalanként, QR-olvasás asztalon. A bizonyíték (számok forrással, díjak, sajtó) a fő gomb közelében áll.
- **B2B:** a fő gomb az ajánlatkérés, az app csak bizonyíték. Ár helyett az ajánlat menete („2 munkanapon belül”).
- **SEO:** témafürtök (hub → aloldal → CMS-elem) belső linkekkel; minden oldalon egy H1, cím ≤ 60, leírás ≤ 155 karakter, JSON-LD; a CMS-sablonok adják a hosszú farok forgalmát (hulladék-kisokos, szezonális ételek, események).
- **Sebesség:** WebP, a kép sosem nagyobb a megjelenésnél, harmadik fél szkriptje késleltetve; LCP 2,5 mp alatt mobilon.
- **Profi összkép:** a lint 0 minden kitett oldalon. Új oldal csak sablonból, új elem csak javaslatlapról.
- **Ütem:** hetente egy oldal újrahúzása a forgalmi sorrendben; minden kör előtte–utána lint- és audit-számmal zárul.

## 13. Döntésre vár

- **Piktogram foltszíne a B2B-oldalakon:** fehér (Javaslat 35) vagy sárga (az általános szabály)? A lint most a sárgát várja.
- **Javaslat 39** öt pontja: a v2 szabályok jóváhagyása, szövegszín-kiemelés (javaslat: nem), a címke dőlése, státusz-chip színei, a CsicsergŐsz kampányoldal kivétele.
- **A 2026-11-02-i kártyaforma** (aszimmetrikus sarok, árnyék minden kártyán) helyére a v2 lép; a `fs-` főoldal ezt még a régi formában viseli.
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
- ~~Hat változó csak a Webflow-ban él~~ **Megoldva (2026-10-30):** mind a 13 csak-Webflow változó a DS-ben van; hat szerep lett belőlük, a többi alias ([weboldal.md 1.](weboldal.md)). A `bc-accent-ink` ugyanazon a néven maradt.
- **A GYIK** most nyitott kártyák (`ds-ketto` + `ds-kartya`). A harmonika (`bc-acc`) akkor jön, ha a Webflow-ba átvisszük.

<details>
<summary>Oldalak és Webflow-azonosítók (a 2026-10–11-i építésből)</summary>

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

</details>
