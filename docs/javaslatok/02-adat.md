# Javaslat 02 – Adat és grafikon

*Állapot: **jóváhagyva (2026-10-01)** · készítette: Claude · dátum: 2026-10-01*
Vizuális javaslatlap (makettekkel, minden szám mintaadat): `javaslatok/02-adat.html` – GitHub Pages: https://hegebeeco.github.io/beeco-design-system/javaslatok/02-adat.html

## Igény
Az admin listái és analitikája ma sokféle, kézzel írt megoldásra épülnek:
- **Táblázatok:** két saját TanStack-táblázat, `components/Table/Table.tsx` (8 oldal) és `FilterTable.tsx` (PoiList, SpecialDays), és még 20 fájl nyers `<table>`-je.
- **Lapozók:** 4 különböző (Table, FilterTable, Partners, analitika `PageControls`).
- **Szűrők:** a Partners natív „…: mindegy” választói és a `PoiFilters.tsx` `react-select`-jei.
- **Grafikonok:** kézzel írt grafikonok (`DailyChart` 6, `PeriodChart` 2, `BarList` 9, `ActivityChart`, `IssueTrendChart`, `FirstReadTrend`, `PartnerContentTrend`).
- **Súgó és állapotjelzés:** az `InfoWidget` (6) súgószövege és a `PanelState` (7) töltés-/hibajelzése.
- **Hőtérkép:** nyers színátmenet (`AnalyticsHeatMap`, leaflet.heat).

Cél: egy öntesztelt DS-csomag, amely megfelel a `docs/komponensek.md` 3/B részének (grafikon kötelező részei), és megtartja a mostani jó megoldásokat: lenyitható adattábla, „a rejtett / hiányzó időszak nem nulla”, 1–4 érintett rejtve.

## Elemek és változatok
| # | Elem | Szint | Változatok | Javaslat |
|---|---|---|---|---|
| 1 | Adattáblázat (DataTable): rendezés, rögzített fejléc, kijelölés + tömeges sáv, lenyitható sor, oszlophúzás, lapozás, sűrűség, üres/töltés/hiba | organizmus | **1a telefonon:** A: vízszintes görgetés, rögzített első oszlop · B: soronként kártya | **A** (B opcióként: `mobile="cards"`, partner-listákhoz) |
| | | | **1b tömeges sáv:** A: a táblázat fölött, odatapad · B: lebegő sáv a képernyő alján | **A** |
| 2 | Szűrősáv (FilterBar): kereső, szűrők, aktív-szűrő címkék, „Szűrők törlése”, találatszám | organizmus | A: mindig soros, tördel · B: széles képernyőn soros, keskenyen „Szűrők (N)” gomb + panel | **B** |
| 3 | Statisztika-csempe (StatTile): érték + egység, változás, időszak, súgó ⓘ, elemszám, forrás, rejtett érték, opcionális sparkline | molekula | A: a változás színe a jelentéstől függ (`good="up"/"down"/"none"`) · B: fel = zöld, le = piros (mostani `bc-stat-delta`) | **A** |
| 4 | Grafikonkártya (ChartCard): cím, alcím (egység, időszak), tengelyek, jelmagyarázat, súgó, „Hogyan olvasd?”, adattábla, forrás, üres/töltés/hiba | organizmus | **4a jelmagyarázat:** A: közvetlen címke a vonal végén + felül · B: a grafikon alatt | **A** |
| | | | **4b „Hogyan olvasd?”:** A: lenyitható a grafikon alatt · B: oldalpanel | **A** |
| 4c | Grafikontípusok (saját SVG) | atom/molekula | oszlop · vízszintes sáv · vonal/trend · csoportosított oszlop · halmozott oszlop · sparkline · hőtérkép-jelmagyarázat | **fánk/torta nincs**: nehezen összevethető, és az admin sem használja; helyette sáv |
| 5 | Pagination, EmptyState, Skeleton rows, DataState (töltés/hiba/újrapróbálás), SortHeader/SelectCell/ColumnResizer/ExpandToggle, DataNote | atom–molekula | – (a meglévő `bc-` elemekre) | – |

Minden adatjel (oszlop, vonal, pont) `line` színű kontúrt kap. Ettől lesz meg a 3:1-es kontraszt fehéren és sötét módban is. A sorozatok alakja is eltér (■ / ●), így nemcsak a szín különbözteti meg őket. Állapotok és szélső esetek elemenként: a javaslatlapon és `docs/komponensek.md` 3.4.

## Nyitott kérdések
- **Adatszínek sötét módban:** a `--bc-data-*` színek sötét módban nem váltanak. Önmagukban nem érik el a 3:1-es kontrasztot:
  - méz fehéren: 1,5:1;
  - levél és víz a sötét kártyán: 2,8:1.

  Javaslat: kontúr minden adatjelen (tokencsere nélkül). A másik út sötét módú adatszín-készlet, erről külön javaslat kellene.
- **Súgó a szűrőkön:** a 3/A a súgót (ⓘ), a tartományt és a számlálót minden beviteli mezőnél kötelezővé teszi. Javaslat: a FilterBar választóinál legyen opcionális.

## Technika
- Táblázatlogika: `@tanstack/react-table` (már az admin függősége, MIT).
- Viselkedés: Radix, a szűrőpanelhez Dialog/Popover.
- Grafikonok: saját SVG, `--bc-data-cat-*` / `--bc-data-seq-*` és a színtévesztő-barát párjuk (`data-cb`).
- Forrás: `react/src/`, kimenet: `dist/react/`.

## Döntés (Kristóf)
- Dátum: 2026-10-01
- Választott változatok: **minden pontban Claude javaslata** („A javaslatokat elfogadom … a te javaslatod elfogadom mindenhol”).
- Megjegyzés: a javaslatlapon felvetett nyitott kérdések a javaslat szerint döntve; ami backendet/appot érint (Excel-előnézet végpont, két nyitvatartási sáv, képsorrend az appban), az addig a javasolt átmeneti változatban épül.
