# Javaslat 01 – Űrlap-csomag

*Állapot: **jóváhagyva (2026-10-01)** · készítette: Claude · dátum: 2026-10-01*
Vizuális javaslatlap (makettekkel): `javaslatok/01-urlap.html` – GitHub Pages: https://hegebeeco.github.io/beeco-design-system/javaslatok/01-urlap.html

## Igény
Az admin (és a partner) űrlapjai ma három különböző könyvtárra és sok egyedi megoldásra épülnek (`react-select` 19 fájl – ebből
20 helyen többes, új elemet is létrehozó címkézés –, `primereact/calendar`, `react-datepicker`, nyers `datetime-local`, BeecoInput/Select/TextArea,
CountedTextField). Cél: egy DS-csomag, ami ezeket kiváltja, egyformán működik adminban és partnerben, és öntesztelt.

## Elemek és változatok
| # | Elem | Szint | Változatok | Javaslat |
|---|---|---|---|---|
| 1 | Keresős legördülő (Combobox), egyes/többes, új elem létrehozással | molekula | A: címkék a mezőben, „+N” túlcsordulás · B: összesítő a mezőben, címkék alatta | **A** |
| 2 | Dátum-/időválasztó + időszak | molekula | A: mező + lenyíló naptár (gépelhető, hétfő, magyar) · B: böngésző saját választója | **A** |
| 3 | Szegmentált kapcsoló | molekula | A: fekete keretes gombsor, méz kijelölés · B: halvány sín (mostani admin) | **A** |
| 4 | Címkeválasztó | molekula | A: felhő ≤ 20 címkéig, fölötte az 1A · B: mindig legördülő | **A** |
| 5 | Számmező mértékegységgel | molekula | A: gépelős, magyar formátum · B: +/− gombokkal | **mindkettő** (A alap, B `stepper`) |
| 6 | Button, IconButton, TextInput, Textarea (számláló), Select, Checkbox, RadioGroup, Switch, Field, SearchBox, FormSection, FormActions | atom–organizmus | – (a meglévő `bc-` elemek React-változata) | – |

Állapotok és szélső esetek elemenként: a javaslatlapon és `docs/komponensek.md` 3.4.

## Technika
Radix UI (Popover, ToggleGroup, RadioGroup, Checkbox, Switch) + DS `bc-` CSS; `react-hook-form`-mal működik; forrás `react/src/`, kimenet `dist/react/`.
Kiváltja az adminból: `react-select`, `primereact` (+ a szivárgó saga-blue téma), `react-datepicker`.

## Döntés (Kristóf tölti ki)
- Dátum: 2026-10-01
- Választott változatok: **1A, 2A, 3A, 4A, 5A** (számmező: csak gépelős, +/− gombos változat nincs)
- Megjegyzés / módosítás: minden mezőnél súgó gomb (mit és miért), érvényes tartomány és aktuális állapot (pl. 213/255), helytelen érték letiltva/levágva – `docs/komponensek.md` 3/A. Claude javaslata: számnál a határra igazítás kilépéskor, nem gépelés közben (indoklás ott).
