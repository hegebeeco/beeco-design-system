# Javaslat 04 – Média és speciális elemek

*Állapot: **javaslat** · készítette: Claude · dátum: 2026-10-01*
Vizuális javaslatlap (makettekkel): `javaslatok/04-media.html` – GitHub Pages: https://hegebeeco.github.io/beeco-design-system/javaslatok/04-media.html

## Igény
Az admin (`beeco-admin`) média- és speciális elemei ma:
- **Feltöltés:** `EntityImageUploadDropzone` (16 használó), `ImageUploadDropzone` (1), `ImageUploader` (0 – halott kód). `accept="image/*"`, de a felirat „JPG, PNG, GIF”;
  a típus- és mérethibát (5 MB) értesítésben jelzi, nem a mezőnél; darabszám-határ és számláló nincs.
- **Galéria:** `EntityImageGallery` (20), `PartnerImageGallery` (2), `ImageLightbox` (1) – képleírás = fájlnév, sorrend/borító nincs, a nagyítóban nincs fókuszcsapda.
- **Képvágó:** `ImageCropperModal` (`react-easy-crop` 5.x, max. 8×).
- **Videó:** `VideoUploadModal` (MP4, 25 MB, megszakítható) – jó alap.
- **Excel-import:** `ExcelUploadPage` + `ResultModal` – csak a hibás sorszámokat mutatja, okot nem.
- **Térkép:** Leaflet – `PoiMap`, `HiveMap` (markercluster alapszínekkel), `PartnerContentMap`, `AnalyticsHeatMap` (szivárvány-skála nyers színekkel), `MapsCoordinateHelper`; `src/styles/_leaflet.scss`.
- **Naptár:** `AdminCalendar.tsx` (536 sor), 3 tartalomfajta nyers hex színnel, sötét módban nem vált.
- **Nyitvatartás:** `OpeningHours` (68 sor) – napi egy sáv, lakat/pipa ikongomb nyers színnel, `aria-pressed` nélkül, nincs ellenőrzés.
- **Avatar:** a fejléc mindenkinek ugyanazt a beégetett képet mutatja. **Címke:** `BeecoTag` + 6 fájl saját badge-osztálya.

## Elemek és változatok
| # | Elem | Szint | Változatok | Javaslat |
|---|---|---|---|---|
| 1 | Képfeltöltő (ejtőzóna) | organizmus | A: a galéria-rácsba épül („+ Kép” csempe) · B: külön nagy ejtőzóna a galéria fölött | **A** |
| 2 | Galéria + nagyító | organizmus | A: borító + sorrend (húzás és menü), szerkeszthető alt · B: egyszerű rács, csak törlés | **A**, ha az app használja a sorrendet (kérdés Bencének); a nagyító változat nélkül |
| 3 | Képvágó | organizmus | A: `react-easy-crop` marad DS-burokban · B: saját vágó | **A** |
| 4 | Videófeltöltés | organizmus | – (lépések: fájl → feltöltés → feldolgozás → kész) | – |
| 5 | Fájlimport (Excel) | organizmus | A: 3 lépés, próbaimporttal (sor + oszlop + ok + teendő) · B: egy lépés, jobb eredménylista | **A**, ha a backend kap „dry-run”-t; addig **B** |
| 6 | Térkép: jelölő, csoport, jelmagyarázat, vezérlők | organizmus | A: tű alakú jelölő betűvel/ikonnal + számozott csoport · B: kis pötty | **A** (+ kérdés: távolról pötty, közelről tű?); hőtérkép `data-seq` skálával |
| 7 | Havi naptár | organizmus | telefonon A: pöttyös hónap + a nap listája · B: napló-lista | **A**; színek szerepekből (esemény = info, speciális nap = warning, oktatás = success) + jelmagyarázat |
| 8 | Nyitvatartás-szerkesztő | organizmus | A: soronként nap + kapcsoló + idősáv + „másolás a hétköznapokra” · B: sablon + kivételek | **A**; két sáv / éjfél utáni zárás csak adatmodell-változással |
| 9 | Avatar, címke/állapotjelvény | atom | – | – (monogram tartalékkal; `bc-badge`, `bc-tag`) |

Minden feltöltő (1, 3, 4, 5) a `docs/komponensek.md` 3/A szerint: címke + súgó (ⓘ), engedett típus + méret + darab mindig látható,
élő számláló (pl. „4/10 kép”, csempén „2,1/5 MB”), a hibás fájl el sem indul, az ok és a teendő a mező alatt marad.
Állapotok és szélső esetek elemenként: a javaslatlapon és `docs/komponensek.md` 3.4.

## Technika
DS React-komponensek a 01-es (Field, SegmentedControl, dátum/idő) és a 03-as csomagra (Modal, Drawer, DropdownMenu, Popover) építve.
Külső csomag marad: `react-easy-crop` (MIT) a DS `ImageCropper` mögött; Leaflet + `leaflet.markercluster` + `leaflet.heat` (a DS csak
öltözteti: `bc-map` CSS, `mapMarker()` divIcon-gyár, `MapLegend`, a hőtérkép színei a tokenekből). Új függőség nincs.

## Nyitott kérdések (üzleti / backend)
- 2: az app a képek sorrendjét (első = borító) használja? (Bence)
- 5: kap-e a backend próbaimportot (dry-run)? – fejlesztési idő.
- 8: kell-e két sáv (ebédszünet) és éjfél utáni zárás? – backend + app módosul.

## Döntés (Kristóf tölti ki)
- Dátum: …
- Választott változatok: …
- Megjegyzés / módosítás: …
