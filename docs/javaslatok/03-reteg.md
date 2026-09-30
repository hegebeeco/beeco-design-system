# Javaslat 03 – Rétegek és navigáció

*Állapot: **javaslat** · készítette: Claude · dátum: 2026-10-01*
Vizuális javaslatlap (makettekkel): `javaslatok/03-reteg.html` – GitHub Pages: https://hegebeeco.github.io/beeco-design-system/javaslatok/03-reteg.html

## Igény
Az admin (`beeco-admin`) rétegei és navigációja ma egyedi megoldásokból áll:
- ~19 fájl rajzol saját ablakot (saját `*-overlay`/`*-backdrop`), ebből csak 3 tartja bent a fókuszt (`ConfirmationModal`, `AdminCalendar`, `PoiBulkImagesModal`), portál sehol;
  `ConfirmationModal` 13 fájlban, `TagCreateModal` 7-ben, és egy `window.confirm` (AddInAppMessage).
- A fejléc címe (`Header.tsx`) 18 ágú `if/else` a `pathname`-re – az 56 útvonalból kb. 21-et fed le, a többin üres.
- A profil-menü (`Dropdown`, 12 sor) nem kezel billentyűzetet; a súgók 114 `title=` attribútum (érintésen nem látszik).
- Értesítés: `react-toastify`, 243 hívás (139 hiba, 75 siker, 26 info, 3 figyelmeztetés), alapbeállítással.
- Nincs telefonos elrendezés (`ProtectedLayout` + `Navbar` nem vált).

Cél: egy DS-csomag, ami ezeket kiváltja, adminban és partnerben egyformán, öntesztelten.

## Elemek és változatok
| # | Elem | Szint | Változatok | Javaslat |
|---|---|---|---|---|
| 1 | Felugró ablak + megerősítés (Modal, AlertDialog) | organizmus | A: középre nyíló megerősítő ablak (a következménnyel, fókusz a Mégse-n) · B: helyben megerősítés a sorban | **A** – megerősítés csak visszafordíthatatlan műveletnél; visszafordíthatónál „Visszavonás” az értesítésben |
| 2 | Veszélyes tömeges művelet | organizmus | A: a darabszámot be kell gépelni (egy elemnél a nevet) · B: „Értem” jelölőnégyzet | **A** – 10+ elem végleges törlésénél vagy másokat érintő törlésnél |
| 3 | Oldalpanel (Drawer) | organizmus | A: panel a listából (részletek, rövid szerkesztés, saját URL), hosszú űrlap marad oldal · B: minden külön oldal (mint ma) | **A** |
| 4 | Súgó (ⓘ, Popover) és gomb-felirat (Tooltip) | atom/molekula | A: koppintásra nyíló buborék · B: rámutatásra nyíló felirat | **A**; Tooltip csak ikongomb feliratára |
| 5 | Legördülő menü (DropdownMenu) | molekula | A: fő művelet látszik, a többi „⋯” menüben · B: minden ikon a sorban | **A** 3+ műveletnél; ≤ 2 → ikongombok |
| 6 | Fülek (Tabs, NavTabs) | molekula | A: telefonon görgethető sor · B: telefonon legördülő | **A**; a Naptár másodlagos sorából a „Új esemény” gomb lesz az oldalfejben |
| 7 | Oldalfej + morzsamenü (PageHeader, Breadcrumbs) | organizmus | A: cím és morzsa a tartalom tetején, vékony fejléc · B: cím a fejlécben | **A** – cím/morzsa az útvonal-leírásból (`handle`), `document.title` is |
| 8 | Értesítés (Toast) | molekula | A: asztalon jobb fent, telefonon lent középen · B: mindig lent középen | **A** – DS-burok (`notify.*`), `react-toastify` marad; hiba nem tűnik el magától; mezőhiba a mező alá |
| 9 | Oldalsáv telefonon/tableten | sablon | A: 900 px alatt behúzható fiók · B: alsó fülsor (4 + Több) | **A** (+ kérdés: 900–1200 px között ikonsáv?) |
| 10 | Lenyitható (Accordion), Popover-alap, Scrim + portál, ugrólink, z-index skála | atom–molekula | – | – (a z-index skála új token: `--bc-z-*`, jóváhagyás kell) |

Állapotok és szélső esetek elemenként: a javaslatlapon és `docs/komponensek.md` 3.4.

## Technika
Radix UI (Dialog, AlertDialog, Popover, Tooltip, DropdownMenu, Tabs, Accordion) + DS `bc-` CSS (`bc-modal`, `bc-scrim`, `bc-pop`,
`bc-tabs`, `bc-page-header`, `bc-toast`, `bc-shell`). Mozgás: ablak 200 ms felúszás, fiók/panel 400 ms `ease-drawer`, csökkentett
mozgásnál azonnali. Kiváltja az adminból: a saját ablakokat, `Dropdown`/`MenuItems`, `Accordion`/`ExpandableBox`/`ExpandableMenuItem`,
a `Header.tsx` cím-logikáját; a `react-toastify` DS-burok mögé kerül.

## Nyitott kérdések
- 9: kell-e tablet fekvőn összecsukható ikonsáv?
- 8: maradjon a `react-toastify`, vagy később Sonner (MIT)? Javaslat: marad, a burok miatt később is cserélhető.

## Döntés (Kristóf tölti ki)
- Dátum: …
- Választott változatok: …
- Megjegyzés / módosítás: …
