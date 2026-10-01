# Komponensek – szabálykönyv (atomic design, öntesztek, szélső esetek, közös definiálás)

*Kristóf döntései, 2026-10-01: a DS-ben CSS **és** React-komponensek lesznek; az interaktív viselkedést a **Radix UI** adja,
a kinézetet a DS; a grafikonok **saját SVG**-ből készülnek; minden komponensnek **gépi öntesztje** és ellenőrzőlistája van;
új komponens vagy szabály **csak Kristóf jóváhagyásával, javaslatlapon** kerül be. Sorrend: űrlap → adat → réteg → média.*

**Nyelv:** a termék-felületek szövegei **csak magyarul** készülnek; angol változat csak Kristóf kifejezett kérésére (2026-10-01).
A **partner-app kétnyelvű** (Kristóf, 2026-10-01): ezért a DS-komponensek beépített feliratai felülírhatók (`labels`, `menuLabel`, `srLabel`…), az alapérték magyar.

Kapcsolódó: `docs/rendszer.md` (felépítés) · `docs/termek-arculat.md` (termékbőr) · `docs/arculat.md` (játékbőr).

---

## 1. Az első szabály: meglévőből dolgozz

Mielőtt bármit építesz, **ebben a sorrendben** keress:

1. **DS React-komponens** (`@beeco/design-system/react`) – ha van, azt használd, ne írd újra.
2. **DS CSS-elem** (`bc-…`, `termek/css/`) – ha nincs React-változat, a `bc-` osztályokra építs.
3. **A projekt meglévő komponense** (pl. az admin `BeecoInput`-ja) – ha a DS-ben nincs, de a projektben van, azt használd,
   és jelezd: ez a DS-be való (javaslat, lásd 5.).
4. **Tokenekből, meglévő mintára** – csak ha a fentiek egyike sem fedi le, **és** a javaslatot Kristóf jóváhagyta.

**Tilos:** új vizuális mintát (új gombfajta, új kártya, új színhasználat, új ikonstílus) kitalálni jóváhagyás nélkül.
Ha egy feladathoz új elem kellene, **állj meg és javasolj** (5. fejezet) – ne építsd meg „ideiglenesen”.

## 2. Atomic design – a beeco szintjei

| Szint | Mi ez | Példák a DS-ben | Szabály |
|---|---|---|---|
| **Token** | nyers érték és szerep | `--bc-ink`, `sp-4`, `r-m`, `shadow-s` | csak a `tokens/*.json`-ban születik |
| **Atom** | egy feladatú, tovább nem bontható elem | Button, IconButton, Input, Select, Checkbox, Switch, Badge, Spinner, Avatar, Tooltip-horgony | csak tokeneket használ; saját állapotai vannak |
| **Molekula** | néhány atom egy közös céllal | Field (címke + mező + segítség + hiba), SearchBox, Combobox, DatePicker, SegmentedControl, TagPicker, StatTile | atomokból épül, nem nyúl a belsejükbe |
| **Organizmus** | önálló felületrész | DataTable, FilterBar, FormSection, Modal/Drawer űrlappal, ChartCard, ImageUploader, PageHeader | molekulákból és atomokból; üzleti adatot kívülről kap |
| **Sablon** | oldalváz, tartalom nélkül | Lista-oldal, Részletek-oldal, Szerkesztő-oldal, Irányítópult | a projektekben is ugyanaz a váz |
| **Oldal** | valódi képernyő valódi adattal | admin Partnerek, POI, Analitika | a projektben él, a DS-ben nem |

- Egy szint **csak alatta lévő szintből** épülhet (organizmus nem ír saját gombot, hanem a Button atomot használja).
- A DS-be az **atom → sablon** szintek kerülnek; oldal soha.
- Új elemnél a javaslatlap megnevezi a szintjét és azt, hogy mely meglévő elemekből épül.

## 3. Öntesztek – KÖTELEZŐ minden beviteli mezőre és grafikonra (és minden DS-komponensre)

Minden komponenshez tartozik egy **tesztlap** (forrás: `react/tesztlapok/<név>.tsx`, lap: `termek/tesztlapok/<név>.html`) és egy **forgatókönyv** (`termek/tesztlapok/<név>.test.mjs`: valódi gépelés, beillesztés, kattintás, billentyűzet): az összes állapot és a szélső esetek
egy oldalon, valódi viselkedéssel. A `tests/check-komponensek.js` (Playwright, fej nélküli Chromium) minden tesztlapot lefuttat,
**a CI-ben is**. Egy komponens addig nem kerül be (és nem kap verziót), amíg ez zöld.

### 3.1 Működik-e
- Egér, érintés **és billentyűzet** is végigviszi (Tab, Shift+Tab, Enter, Szóköz, Esc, nyilak ott, ahol a minta ezt várja).
- Az érték változik és visszaolvasható (vezérelt és nem vezérelt mód, `react-hook-form`-mal is).
- Űrlapban: beküldéskor az érték megérkezik; hibánál a fókusz az első hibás mezőre ugrik.
- Nincs konzolhiba és figyelmeztetés.

### 3.2 Minden nézetben látszik-e
- **Képernyők:** telefon álló 320×640 és 390×844, telefon fekvő 844×390, tablet álló 768×1024, tablet fekvő 1024×768,
  asztal 1280×800 és 1440×900, érintő-TV 1920×1080.
- **Módok:** világos és sötét; 200%-os nagyítás; csökkentett mozgás; érintős és egeres eszköz.
- Mérés minden nézetben: semmi nem lóg ki (vízszintes görgetés = hiba), semmi nem takar ki mást, a felirat nem vágódik le
  jelzés nélkül, a lenyíló réteg (lista, naptár, tooltip) a képernyőn belül nyílik.

### 3.3 Atomic és UX/UI-szabályok
- Csak tokenek (a `ds-lint` és a `check-tokens` méri).
- Érintési felület ≥ 44 px (sűrű admin-gomb asztalon 36 px, érintésnél 44); kontraszt AA (szöveg 4,5:1, keret/ikon 3:1).
- Látható fókusz; minden mezőnek van **látható címkéje** (a helykitöltő nem címke); ikongombnak `aria-label`.
- Hiba a mező alatt, szövegesen, `aria-invalid` + `aria-describedby`; nem csak színnel jelezve.
- **Minden állapot megvan:** alap · rámutatás · fókusz · lenyomva · tiltott · csak olvasható · töltés · hiba · siker · üres.
- Mozgás ≤ 300 ms, `ease-out`; csökkentett mozgásnál azonnali.
- Szöveg: tegeződő, rövid; a hiba megmondja a következő lépést.

### 3.4 Szélső esetek – a tesztlapon mind szerepeljen, ami az elemre értelmezhető

**Szöveges mező:** üres · csak szóköz · pontosan a max. hossz és eggyel több · nagyon hosszú szó szóköz nélkül ·
ékezet (ő, ű), emoji, jobbról balra írt szöveg · beillesztés sortöréssel · HTML-szerű szöveg (`<b>`) szövegként jelenik meg.

**Szám- és pénzmező:** 0 · negatív · tizedes **vesszővel és ponttal** (magyar: 1 234,5) · nagyon nagy szám (ezres tagolás) ·
min./max. határon és azon túl · betű beírása · üres ≠ 0 · mértékegység (Ft, %, db, km) a mező mellett.

**Dátum és idő:** ma · múlt/jövő, ha tiltott · szökőnap (febr. 29.) · óraátállítás napja · időzóna (a szerver UTC-t kap,
a felület helyi időt mutat) · kezdet > vég · egész napos esemény · magyar formátum (2026. 10. 01.) és hét első napja hétfő.

**Választó (legördülő, keresős, többes):** nincs opció · 1 opció · 1000+ opció (keresés, görgetés, teljesítmény) ·
nagyon hosszú opciónév · a kiválasztott érték már nem létezik a listában · töltés közben · a lista betöltése hibázik ·
többesnél: 0, 1 és sok kijelölt elem, a mező nem nő a végtelenségig.

**Fájl- és képfeltöltés:** túl nagy fájl · rossz típus · több fájl egyszerre · megszakadt feltöltés · lassú hálózat (haladásjelző) ·
nagyon széles/magas kép · átlátszó PNG · ugyanaz a fájl kétszer.

**Táblázat, lista:** 0 sor (üres állapot teendővel) · 1 sor · sok sor (lapozás, rögzített fejléc) · nagyon hosszú cellatartalom ·
hiányzó érték (–) · töltés (csontváz) · hiba (újrapróbálás) · rendezés egyenlő értékeknél · keskeny képernyő.

**Grafikon:** nincs adat · egyetlen pont · minden érték 0 · negatív érték · egy óriási kiugró érték · hiányzó értékek (null) ·
nagyon sok kategória · hosszú címkék · egyenlő értékek · színtévesztő-barát mód (`.ds-cb` / `data-cb`) · **mindig elérhető adattábla**
(képernyőolvasónak és ellenőrzésnek) · magyar számformátum · **egység és forrás** jelölve; szám csak valós adatból vagy forrással (a beeco adatszabálya).

**Minden elemnél:** szerverhiba · időtúllépés · dupla kattintás/beküldés · jogosultság hiánya · sötét mód · nagy betűk.

## 3/A. Beviteli mezők – kötelező részek (Kristóf, 2026-10-01)

Minden adatbeviteli mező (szöveg, szám, dátum, választó, címke, feltöltés) **ugyanazt a keretet** kapja (Field molekula):

| Rész | Mi | Példa |
|---|---|---|
| **Címke** | mindig látható, a helykitöltő nem címke | „Kupon neve” |
| **Súgó gomb (ⓘ)** | a címke mellett; megnyitva elmondja **mit** és **miért** kell megadni, és ha van, egy példát | „Így jelenik meg az appban a kupon kártyáján. Rövid, cselekvésre hívó név jó, pl. »10% kedvezmény kávéra«.” |
| **Érvényes tartomány** | a mező alatt, mindig látható | „3–60 karakter” · „0–100 %” · „2026. 10. 01. után” · „legfeljebb 5 címke” |
| **Aktuális állapot** | élő számláló, a tartomány mellett | „213/255” · „2/5 címke” · „1,2/5 MB” |
| **Hiba** | a mező alatt, szövegesen, a következő lépéssel | „Legalább 3 karakter kell – most 2.” |

- A súgó kötelező (a React-komponensben kötelező `help` prop – nélküle nem fordul).
- **Kivételek (Claude javaslata, **jóváhagyva 2026-10-01**):** a **keresőmező** (SearchBox) címkéje csak képernyőolvasónak szól, súgója nincs – a nagyító és a „Partner keresése” helykitöltő egyértelmű; a **nézetváltó** (SegmentedControl) nem adatbevitel, nincs súgója; a **listaszűrők** (FilterBar, Javaslat 02) súgója nem kötelező. A `check-komponensek` a keresőmezőt eszerint kihagyja. A súgó szövegét a projekt adja; a DS csak a gombot és a buborékot.
- A számláló a határ közelében (90%) figyelmeztető színre vált, a határon hibaszínre – **nem csak színnel**: a szöveg is jelzi.
- **Helytelen érték letiltva / levágva:**
  - szöveg: a max. hossznál a gépelés megáll; hosszabb beillesztés levágva + jelzés („A beillesztett szöveg végét levágtam: 255 karakter a határ.”);
  - szám: betű, második tizedesjel, felesleges előjel **nem írható be**; a tartományon kívüli értéket a mezőből kilépéskor a határra igazítja + jelzés („100-ra állítottam – legfeljebb 100 lehet.”) – *gépelés közben nem vág, mert a „150” begépelése közben a „15” még jó* (Claude javaslata, 2026-10-01; ha gépelés közbeni vágás kell: `clamp="input"`);
  - dátum: a tartományon kívüli nap nem választható (halvány, áthúzott), gépelésnél kilépéskor igazít + jelzés;
  - választó: a tiltott elem nem választható; a max. darabszám után a többi opció tiltott, a számláló jelzi.

## 3/B. Grafikonok – kötelező részek (Kristóf, 2026-10-01)

Egy mezei látogatónak is értenie kell, mit lát. Ezért a ChartCard organizmus nélkülük nem jelenik meg:

| Rész | Mi |
|---|---|
| **Cím** | mit mutat, egyszerű nyelven („Beváltott kuponok hetente”) |
| **Alcím / egység és időszak** | „db, 2026. 07–09.” |
| **Tengelyfeliratok, mezőnevek** | mindkét tengely és minden kategória neve kiírva, rövidítés csak magyarázattal |
| **Jelmagyarázat** | minden szín/minta jelentése; a vonalak végén közvetlen címke is lehet |
| **Súgó (ⓘ)** | honnan jön az adat, hogyan számoljuk (pl. „egy felhasználó naponta egyszer számít”) |
| **„Hogyan olvasd?”** | lenyitható értelmezési segédlet 2–4 mondatban: mit jelent a magas/alacsony érték, mire figyelj, mi NEM következik belőle |
| **Adattábla** | ugyanazok a számok táblázatban (képernyőolvasónak és ellenőrzésnek) |
| **Üres / töltés / hiba** | „Ebben az időszakban nincs adat” + teendő |

Szám csak valós adatból vagy forrással; becsült vagy vitatott érték jelölve.
- **Adatjelek kontúrja** (jóváhagyva 2026-10-01): minden oszlop, vonal és pont `line` színű kontúrt kap – így a méz és a rózsa adatszín is elválik a háttértől (3:1), világosban és sötétben.

## 3/C. Mit tesztel Claude MINDEN munka végén, és mit jelez (Kristóf, 2026-10-01)

Claude **maga futtatja** az ellenőrzést (tesztlapok, `check-komponensek`, `ds-lint`, `minosegkapu`), és a jelentésben **külön
listában megnevezi, ami nem jó** – akkor is, ha nem az ő munkája rontotta el. Minden tételhez: hol, mi a baj, mi a javítás. Kategóriák:

| Kategória | Mit néz |
|---|---|
| **Hozzáférhetőség** | billentyűzet, fókusz, képernyőolvasó (szerep, név, állapot), kontraszt, 44 px, címke, súgó elérhető-e billentyűzettel |
| **Állapotok** | alap, rámutatás, fókusz, lenyomva, tiltott, csak olvasható, töltés, üres, hiba, siker – **hiányzó állapot = hiba** |
| **Animáció** | van-e visszajelzés (nyomás, nyitás, zárás, töltés); ≤ 300 ms, ease-out; csökkentett mozgásnál azonnali; **hiányzó visszajelzés = hiba** |
| **Méretezés** | 8 nézet, 200% nagyítás, hosszú szöveg, nincs kilógás és takarás, tördelés |
| **Színezés** | csak szerep-token, világos és sötét mód, jelentés nem csak színnel, színtévesztő-barát adat |
| **Teljesítmény** | első megjelenés, hosszú feladat (> 50 ms), 1000+ elemes lista görgetése, animáció képkockasebessége, fölösleges újrarajzolás |
| **Adat és szélső esetek** | 3.4 szerint; tartomány, számláló, levágás működik-e |
| **Szöveg** | tegeződő, rövid, a hiba megmondja a következő lépést, súgó megvan |

Súlyosság: **P0** (nem használható) · **P1** (akadály, javítani kell) · **P2** (javítandó) · **P3** (finomítás). „Nem gond, de javítani kell” = P2/P3 – ezek is a listára kerülnek.

### 3.4/b Gombok és sorok (Kristóf, 2026-10-01) – gépi mérés minden tesztlapon
- Gombban a piktogram és a betűk látható közepe ≤ 1,5 px-re (P2); szövegmezőben egyforma felső/alsó belső margó (P2).
- Mezőket is tartalmazó sorban a vezérlők alja ≤ 1,5 px-re (P2).
- Mentés/törlés/új/szerkesztés/info szöveges gomb piktogrammal (P3); csak-piktogramos gombnak neve (P1) és súgó-buboréka (P3). Szabály: `docs/termek-arculat.md` 6/A.

### 3.5 Kész, ha (Definition of Done)
- [ ] a tesztlap minden állapotot és a releváns szélső eseteket mutatja;
- [ ] mezőnél: címke, súgó (ⓘ), tartomány, számláló, tiltás/levágás (3/A); grafikonnál: cím, egység, tengelyek, jelmagyarázat, súgó, „Hogyan olvasd?”, adattábla (3/B);
- [ ] a 3/C jelentés elkészült, a nem jó tételek megnevezve;
- [ ] `npm test` zöld (benne a `check-komponensek`: 8 nézet × világos/sötét, konzolhiba, kilógás, 44 px, kontraszt, billentyűzet);
- [ ] a képeket (legalább telefon + asztal, világos + sötét) ember is megnézte;
- [ ] a bemutatóban (`termek/bemutato.html`) szerepel, használati példával;
- [ ] `CHANGELOG.md` bejegyzés; ha új elem: a jóváhagyott javaslatlap hivatkozása.

### 3.6 A projektekben (admin, partner, web)
Minden **új vagy módosított beviteli mező és grafikon** egy oldalon ugyanezt a próbát kapja: vagy DS-komponens (akkor a DS
tesztje fedezi, a projektben csak a bekötést kell kipróbálni), vagy a projektben is kell hozzá teszt/tesztlap. Kész előtt:
`npm run ds:lint` (nem romlott) + `minosegkapu` mérés az érintett oldalakon, telefonon és asztalon, világosban és sötétben.

## 4. Technika (React-réteg)
- Forrás: `react/src/<Komponens>/` (TSX), kimenet: `dist/react/` (ESM + típusok) – a fogyasztó `import { Button } from '@beeco/design-system/react'`.
- Viselkedés: **Radix UI** primitívek (MIT) – billentyűzet, fókusz, képernyőolvasó; a kinézet `bc-` osztály.
  A projektek közvetlenül nem importálnak Radixot – a DS-komponenst használják.
- A React-komponens mindig a **CSS-elemre** épül (ugyanaz a `bc-` osztály), így a nem-React felületek is ugyanúgy néznek ki.
- Grafikon: saját SVG, a DS adatskáláival; minden grafikon mellé `<table>` (vizuálisan rejtve vagy lenyitható).
- Kivezetendő az adminból, ahogy a DS-változat elkészül: `react-select`, `primereact`, `react-datepicker`, `bootstrap`, `primeflex`.

## 5. Közös definiálás – javaslatlap és jóváhagyás

Új komponens, új változat vagy új szabály **csak így** kerül a DS-be:

1. **Igény:** melyik képernyőn, mire kell; mely meglévő elemek fedik le részben (1. fejezet).
2. **Javaslatlap** (`docs/javaslatok/NN-nev.md` + ha vizuális, `javaslatok/NN-nev.html`, a GitHub Pages-en is látszik):
   szint (atom/molekula/…), 2–3 változat **képpel**, állapotok, szélső esetek, API (props), mit vált ki a projektekben.
   Sablon: `docs/javaslatok/_sablon.md`.
3. **Kristóf választ és jóváhagy** (a javaslatlap „Döntés” része: dátum, választott változat, megjegyzés).
4. **Építés** a jóváhagyott változat szerint, tesztlappal (3.), `npm test` zölden.
5. **Kiadás:** `CHANGELOG.md` (hivatkozik a javaslatra), `VERSION`, címke; a projektekben verzió-emelés.

Ami **nem** kell javaslat: hibajavítás, a meglévő elem tokenhez igazítása, teszt és dokumentáció bővítése.
