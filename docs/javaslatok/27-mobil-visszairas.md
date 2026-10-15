# Javaslat 27 – Mobil visszaírás: közös ikonkészlet, halvány méz, bronz rangszín, mobil puha árnyék, sötét állapot-skála

*Állapot: **jóváhagyva, 1.55.0-ban kiadva** · készítette: Claude (a mobil app design system csomagjának, a `beeco_ds`-nek az igénye alapján) · dátum: 2026-10-15*
*Döntés: Kristóf, 2026-10-15 (a Képernyő-tábla „Design system” nézetében hozott C-3, C-6, C-27 döntések és a „mehet a kiadás” jóváhagyás). Csak bővítés: nincs átnevezés, nincs törlés, nincs értékváltozás.*

## 1. Igény
- Hol kell (projekt, képernyő): a mobil app (Flutter) a `beeco_ds` csomagon át ugyanezt a design systemet használja. A csomag építése közben négy dolog derült ki, ami a közös DS-ből hiányzik, és az app ma saját, helyi értékkel pótolja.
- Mit old meg a felhasználónak (egy mondat): a web és a mobil ugyanazt a színt, ikont és árnyékot használja egy forrásból, így nem kell az app oldalán másolt értékeket karbantartani.
- Mit használnak ma helyette (fájl, könyvtár): az app saját `#FEE79C` sárgáját, a kétszer beégetett `#EFC2A6` bronz színt, saját ikon- és árnyék-értékeket, valamint a sötét téma felemelt állapot-színeit a csomag-saját kódban.

A tételek mind **additívak**: a `api-check` zöld marad, a meglévő tokenek, szerepek és exportok változatlanok.

## 2. Mire épül (meglévő anyagok – docs/komponensek.md 1. fejezet)
- DS-elemek: `tokens/core.json` (primitívek, adatskálák), `tokens/theme-termek.json` (szerepek, `shadowSoft`), a `react/src/inputs/ikonok.tsx` első tíz `Ic*` piktogramja, az `allapot` adatskála (Javaslat 12).
- Projekt-komponensek, amiket kivált: az app helyi sárga, bronz és árnyék konstansai; a Flutter-csomag saját ikon-SVG-i.
- Szint: token / szabály, plusz atom (piktogram).

## 3. Változatok (Kristóf döntései)
| Téma | Döntés | Mit jelent a DS-ben |
|---|---|---|
| **C-27 ikonnyelv** | **B** – saját, a webbel közös SVG-készlet | 42 ikon egy stílusban (24-es rács, 2,2 px, `currentColor`): az első tíz már megvolt (`IcSave`, `IcTrash`, `IcNew`, `IcInfo`, `IcEdit`, `IcOpen`, `IcX`, `IcOk`, `IcLeft`, `IcRight`), **32 új** `Ic*` komponens és mind a 42 SVG-fájlként a `termek/ikonok/` mappában. Márkalogó (Google, Apple stb.) nincs benne: ott a szolgáltató hivatalos megoldása marad. |
| **C-6 sárgák** | **B** – négy sárga szint | a DS három sárgája (`honey`, `honey-deep`, `butter`) mellé a negyedik: új primitív `honey-soft` `#FEE79C` (a Figma „HL/Yellow”), és ebből az új szerep `accent-soft` (világos `honey-soft`; sötét: új primitív `honey-night` `#5C4A12`). |
| **C-3 puha árnyék** | **A** – a nem kattintható doboz mobil puha árnyéka | új token `shadowSoftMobile`: eltolás 2 / 2, elmosás 10, 40 % a `shadow` szerepből (CSS: `--bc-shadow-soft-mobile`, SCSS `soft-mobile`, Tailwind `shadow-soft-mobile`, Dart `BeecoTokens.shadowSoftMobile*`). A weben a `shadowSoft` marad. |
| **C-30 adatszínek** (az 1c-hullám megjegyzései) | **A** | új primitív `rank-bronze` `#EFC2A6` (ranglista 3. hely); a sötét felületre az **állapot-skála emelt végű párja**: `allapot-dark` (lime · levélzöld · méz · parázs · pipacs) és `allapot-cb-dark` (égkék · … · parázs, színtévesztő-barát). A világos skálák változatlanok. |

**Javaslat:** így, mert a döntéseket Kristóf meghozta, és mindegyik kizárólag új nevet ad hozzá. Nincs nyers érték a fogyasztók kódjában, és az app a kiadás után a `dist/dart/beeco_tokens.dart` szinkronjával átveheti a saját kézi másolatait.

## 4. Állapotok
- Ikon: díszítő, saját állapota nincs; az állapotot a befogadó gomb viszi (`TooltipIconButton`, `aria-label`).
- `accent-soft`: háttér-árnyalat (kijelölt elem, jutalom-blokk, kiemelt chip), nem kattintható jelzés önmagában; szöveg rajta `ink`.
- `shadowSoftMobile`: nem kattintható doboz; a kattinthatónak a kemény, átlós árnyék marad.
- Sötét állapot-skála: ugyanaz a jelentés, mint a világosé (jó → rossz), csak a két vég emelt.

## 5. Szélső esetek (a tesztlapra / tokenőrre kerülnek – docs/komponensek.md 3.4)
- Az `accent-soft` szöveg-kontrasztja mindkét módban ≥ 4,5 : 1: `ink` 17,1 : 1 / 8,1 : 1, `ink-soft` 6,6 : 1 / 6,1 : 1, `ink-muted` 4,6 : 1 / 5,0 : 1 (a `tests/check-tokens.js` kontraszt-párjai).
- A sötét állapot-skála mind az 5 foka ≥ 3 : 1 a sötét `surface`-en (ikon, jelölő – WCAG 1.4.11), a fekete jel rajtuk ≥ 4,5 : 1 (új ellenőrzés a `check-tokens.js`-ben).
- Minden SVG és az `Ic*` párja karakterre azonos rajz; a fejléc közös (új `tests/check-ikonok.js`).
- A `back`, `forward`, `chevron-left`, `chevron-right` ikon jobbról balra író nyelven tükrözendő (`data-mirror-rtl` jelölés az SVG-ben).
- A szín soha nem beszél egyedül: az adatszín mellé mindig szám, jel vagy ikon kerül (`docs/adatskala.md`).

## 6. API (React props / CSS-osztályok / tokenek)
```tsx
import { IcSearch, IcBell, IcMap } from '@beeco/design-system/react';   // 32 új, props nélkül, 20×20, currentColor
```
```
SVG-fájl:  @beeco/design-system/ikonok/search.svg  (termek/ikonok/, jegyzék: ikonok.json)
CSS:       --bc-honey-soft  --bc-honey-night  --bc-rank-bronze  --bc-accent-soft  --bc-shadow-soft-mobile
           --bc-data-allapot-dark-1…5  --bc-data-allapot-cb-dark-1…5
SCSS:      bc.$bc-accent-soft · bc.shadow(soft-mobile)
Tailwind:  bg-accent-soft · shadow-soft-mobile · bg-c-rank-bronze
Dart:      BeecoPalette.honeySoft / honeyNight / rankBronze · BeecoRoles.accentSoft (nem kötelező, alapérték honeySoft)
           BeecoTokens.shadowSoftMobile (Offset) · shadowSoftMobileBlur · shadowSoftMobileAlpha
```

## 7. Hozzáférhetőség
Billentyűzet: az ikonok nem fókuszálhatók. Képernyőolvasó: díszítők (`aria-hidden`), a név a gombon van. Kontraszt: lásd az 5. pontot. 44 px: az ikon mérete a befogadó gombé.

## 8. Döntés (Kristóf tölti ki)
- Dátum: 2026-10-15
- Választott változat: C-27 **B**, C-6 **B**, C-3 **A**, az 1c-hullám adatszín-javaslatai (C-30 **A** keretében: bronz rangszín, a sötét állapot-skála emelt végei) – és a kiadás jóváhagyása („mehet a kiadás”).
- Megjegyzés / módosítás: Kristóf a mobil app oldalán: „amit kell, azt legeneráljuk és megcsináljuk, viszont amit tényleg valósan kell használni, mint a Google- vagy Apple-logó, ott maradni kell a standard megoldásoknál” – ezért nincs márkalogó az ikonkészletben. Az ikonok közül ahol a DS-ben nem volt, ott a DS stílusában készültek, és innen kerülnek vissza a közös készletbe.

**Megjegyzés a Flutter-csomagról:** a `beeco_ds` (privát Flutter-csomag) ezeket a tokeneket a `dist/dart/beeco_tokens.dart` szinkronjával veszi át; a csomag-saját kézi másolatai (`accentSoft` sötét értéke, bronz, sötét állapot-skála, puha árnyék) az új verzió szinkronja után a DS-re cserélhetők. Ez az app/csomag dolga, a DS-ben nem kell hozzá változtatás.
