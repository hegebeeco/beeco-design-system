# Javaslat 40 – Webflow-komponensek rendbetétele: összevonás és új komponensek

*Állapot: **jóváhagyva** (Kristóf, 2026-11-21: mindhárom pontra igen) · a DS-check alapján készítette: Claude.*
*Mérés: `ds-lint` 72 oldalon a tesztoldalon (52 statikus oldal + a 10 CMS-gyűjtemény 2–2 mintája), a Webflow komponensleltára (53 komponens) és az oldalak szerkezeti átvizsgálása.*

## 1. Hol tartunk

| Mutató | Érték | Forrás |
|---|---|---|
| Eltérés a 72 mért oldalon | 1778 → **1359** a harmadik kör után | `ds-lint` |
| Statikus oldalak (52) | 1218 eltérés; 11 oldal 0-n, 34 oldal legfeljebb 5 | `ds-lint` |
| CMS-oldalak (393, 10 sablon) | becslés: kb. 8200 → **2600** (gyűjteményenként 2 minta alapján) | `ds-lint`, becslés |
| A Web DS (`ds-`) aránya | az osztályos elemek 46%-a `ds-`, 45%-a régi, 9%-a kampány és főoldal | szerkezeti átvizsgálás |
| Teljesen `ds-` oldal | 30 a 72-ből; 39 oldal még szinte teljesen régi osztályokból áll | szerkezeti átvizsgálás |
| Osztályok a mért oldalakon | 335 `ds-` (ebből 157 csak egy oldalon él) és 742 régi | szerkezeti átvizsgálás |

A legtöbb hátralévő eltérés: kampányoldalak 545 (Madárkisokos 335, Vízadás 111), app-oldalak 236 (GYIK 106, lábnyom-metodika 58, térkép 53), főoldal 155, szolgáltatásoldalak 156.

## 2. Összevonható komponensek

| Ma | Javaslat | Érintett |
|---|---|---|
| `DS · Velük dolgoztunk` + három külön komponens (Nagyvállalatok, Önkormányzatok, Kuponpartnerek) + `DS · Szakmai partnerek` + két használaton kívüli logósáv | egy `DS · Logósor`, variánsokkal (közönség szerint) | 19 példány |
| `Spacer16`, `spacer12`, `Spacer8` | megszűnnek; a térköz a szekció és a rács beállítása | 30 példány |
| `social blokk`, `Social_small blokk`, `DS · Kövesd a rajt` | egy `DS · Közösségi sor`, két mérettel | 2 példány |
| `breadcumb_blokk` (kézzel épített morzsa, 18 oldalon) | a meglévő `DS · Morzsamenü` | 18 oldal |
| `download_block` kézzel (13 oldalon) | a meglévő `DOWNLOAD_BLOCK`, illetve az új `DS · App letöltés` | 13 oldal |
| `home-faq-*` (app GYIK, nyereményjáték) | a GYIK-sablon (`ds-kerdes`) | 2 oldal, kb. 100 elem |
| Komponenscsoportok neve: „Web DS”, „DS”, „beeco DS”, csoport nélkül | egy csoportnév: „Web DS” | 17 komponens |

Osztályszinten (komponens nélkül) ugyanaz a szerep több néven él:

| Szerep | Régi osztályok | Web DS |
|---|---|---|
| Szekcióháttér | `dia_kek`, `dia_zold`, `dia_feher`, `dia_sarga` (29 oldal) | `ds-szekcio` + `ds-hatter-*` + `DS · Domb` |
| Cím | `main_heading`, `h1`, `headline1`, `headline2`, `sub-heading` (608 elem) | `ds-cim1`–`ds-cim3`, `ds-szalag` |
| Gomb | `button_main` (36 oldal), `main-button`, `tab_button`, kampánygombok | `ds-gomb`, `ds-gomb ds-masod` |
| Kártya | `card` és 10 változata (587 elem), `card_negyzet`, `card_blog`, `noveny_kartya` | `ds-kartya` (álló), `ds-cikk` / `ds-ut` (kattintható) |
| Chip | `chip`, `chip_honap`, `chip_tudnivalok`, `category_chip`, `text_chip` | `ds-chip` |
| Szövegdoboz | `gyumi_text_blokk`, `recept_text_blokk`, `text_blokk_withbackground`, `sziget_blokk` | `ds-kartya`, `ds-sziget` |

Ezek formája a három körben már egységes lett; a nevek összevonása oldalanként, az újrahúzásnál történik.

## 3. Új komponensek (ma kézzel épített, ismétlődő minták)

| Új komponens | Mit vált ki | Ma kézzel | Propok, variánsok |
|---|---|---|---|
| `DS · Nyitó` | nyitó szekció: címke, H1, bevezető, gombsor, chipek, hero-képsor | 32 oldal | szövegek, két gomb, képsor-hely; variáns: képpel / kép nélkül |
| `DS · Szekciófej` | címke + H2 + bevezető | 34 oldal | három szöveg; variáns: világos / sötét háttér |
| `DS · GYIK` | teljes GYIK-szekció a kérdésekkel és a „tovább” linkkel | 28 oldal | cím, bevezető, kérdés-hely |
| `DS · App letöltés` | teljes app-CTA szekció: fej, áruház-gombok, QR, appkép | a letöltés-blokk 71 oldalon van, a szekciót oldalanként kézzel építjük köré | cím, szöveg; variáns: háttérszín |
| `DS · Gomb` | elsődleges és másodlagos gomb | 41 oldal | felirat, link, mérési címke; variáns: elsődleges / másodlagos |
| `DS · Kártyarács` | 2–4 oszlopos kártyasor piktogrammal | 30 oldal | oszlopszám-variáns, kártya-hely |
| `DS · Lépések` | „Így működik” lépéssor | 17 oldal | 3 vagy 4 lépés |
| `DS · Fotósor` | a teljes képsor a vezérlővel | 17 oldal | kép-hely, felirat be/ki |
| `DS · Cikk-kártya` | CMS-listák kártyája (blog, ökos tartalom, recept) | a CMS-listák, 900+ elem a mért oldalakon | kép, cím, címke a CMS-ből |

## 4. Takarítás

- **18 használaton kívüli komponens** (0 példány): öt régi fejléc, három régi lábléc, két logósáv, `TESTIMONIAL_FRESKO`, `TÉRKÉP CSEMPE`, `KUPON CSEMPE`, `ESEMÉNYNAPTAR_BLOKK`, `OKOS_TIPP_CARD`, `ROLUNK_ERTEKEK`, `CSAPAT_FOTOSLIDER`, `DS · Kövesd a rajt`. Törlés csak jóváhagyással.
- **Hat egy példányos régi komponens** (Csapat, Együttműködések, Versenyek, MÉDIA_BLOKK, ROLUNK_VIZIO, kapcsolat sziget): a régi Rólunk-oldalakhoz tartoznak, azok cseréjével megszűnhetnek.
- **157 egyoldalas `ds-` osztály:** átnézés, melyik valódi egyedi elem, és melyik váltható közös osztályra.

## 5. Javasolt sorrend

1. `DS · Szekciófej`, `DS · Gomb`, `DS · App letöltés`, `DS · GYIK`: a legtöbb oldalon ismétlődnek, új oldalnál azonnal megtérülnek.
2. `DS · Logósor` összevonás és a csoportnevek egységesítése.
3. `DS · Nyitó` és `DS · Cikk-kártya` a főoldal és a CMS-sablonok újrahúzásával együtt.
4. Takarítás (4. pont) a végén, amikor már semmi nem hivatkozik a régi elemekre.

Kockázat: a meglévő oldalakon a kézzel épített szekció komponensre cserélése oldalanként történik, képernyőkép-összevetéssel; a tartalom nem változik.

## 6. Megvalósítás állapota (2026-11-21)

| Lépés | Állapot |
|---|---|
| `DS · Szekciófej`, `DS · Gomb`, `DS · App letöltés`, `DS · GYIK` | kész, a `/beecopedia` oldalon kipróbálva a tesztoldalon (asztal + mobil, `ds-lint` 0); azonosítók és propok: web-ds.md 9. fejezet |
| Csoportnevek: minden DS-komponens a „Web DS” csoportban | kész (9 komponens átsorolva) |
| A négy komponens kiterjesztése a többi `ds-` oldalra | hátravan (oldalanként, képernyőkép-összevetéssel) |
| `DS · Logósor` összevonás, térköz-komponensek kivezetése, morzsa és letöltés-blokk csere | hátravan |
| `DS · Nyitó`, `DS · Kártyarács`, `DS · Lépések`, `DS · Fotósor`, `DS · Cikk-kártya` | hátravan |
| 18 használaton kívüli komponens törlése | a végén; a friss lista megerősítése után (a `NAVBAR_REGI_BACKUP` leírása szerint biztonsági másolat) |

## 7. Döntés (Kristóf tölti ki)
1. Jóváhagyod a 3. pont új komponenseit? (Akár csak az 5. pont első lépését.)
2. Mehet a 2. pont összevonása?
3. Törölhető a 18 használaton kívüli komponens, vagy előbb archív mappába kerüljenek?

- Dátum: 2026-11-21 · Jóváhagyva: 1. igen, 2. igen, 3. igen (Kristóf). A törlés a végén történik, a friss lista megerősítése után, mert nem vonható vissza.
