# Javaslat 15 – Listák hatékonysága (táblázat, tömeges sáv, lista-eszközsáv, menü)

*Állapot: **jóváhagyva (irány)** · készítette: Claude (ADMIN) · dátum: 2026-10-02*
*Forrás: az admin UX-átvilágítása (2026-10-02, 3 független ügynök, minden szakasz, asztal + telefon) – ClickUp `869fb6yq0`.*

## 1. Igény
- **Hol kell:** admin – Partnerek, POI-k, Rajok, Kuponok, Értesítések, Hibajelentések, Összehasonlítás; a partner-app listái ugyanezeket az elemeket használják.
- **Mit old meg:** 1280 px-es laptopon a sorműveletek (Szerkesztés, Törlés, ⋯) ma csak vízszintes görgetéssel érhetők el; telefonon egy-egy listakártya 700–1000 px magas (a kuponoldal ~10 000 px); a szűrők, a nézetváltó, a találatszám és a sűrűség-kapcsoló külön-külön sort foglal (1280×800-on a táblázat ~490 px-nél kezdődik); telefonon a tömeges sáv görgetés után eltűnik; 800 px magas ablakban a bal menü alja a fiók-sáv alá csúszik.
- **Ma helyette:** semmi – a felhasználó görget.

## 2. Mire épül
- DS-elemek: `DataTable` (rögzített első oszlop, `mobile="cards"`, `bulkActions`, `renderExpanded`, `SortSelect`), `ListPage`, `FilterBar`, `AppShell`, `DropdownMenu`.
- Projekt-komponenst nem vált ki; minden új lehetőség **opcionális**, a mai viselkedés alapértelmezésként marad.
- Szint: organizmus / sablon.

## 3. Változatok és javaslat

### 3.1 Kilógó sorműveletek (1280 px)
| | A – oszlopprioritás + rögzített műveletoszlop | B – csak rögzített műveletoszlop | C – csak oszlopprioritás |
|---|---|---|---|
| Mit | `meta.priority: 1 \| 2 \| 3` – szűk helyen a 3-as, majd a 2-es oszlop a lenyitható sorba kerül; a `_actions` oszlop jobbra rögzítve (árnyékkal) | a műveletek mindig látszanak, a többi görget | nincs görgetés, de nagyon széles táblánál a műveletek még kilóghatnak |
| Előny | nincs görgetés, a fontos adat elöl, a művelet mindig elérhető | egyszerű | egyszerű |
| Hátrány | több kód | az adatok továbbra is görgetnek | nem garantált |

**Javaslat: A.** A projekt dönti el oszloponként, mi a fontos; a DS a szélesség alapján dönt.

### 3.2 Telefonos kártya
| | A – kártya-szerepek | B – csak az első N oszlop |
|---|---|---|
| Mit | `meta.card: 'title' \| 'badge' \| 'main' \| 'detail'` – fejléc (cím + jelvény), 2–3 fő adat, a többi „Részletek” lenyitóban | az első 3 oszlop, a többi rejtve |
| Előny | értelmes kártya, a projekt dönt | nulla beállítás |
| Hátrány | oszloponként be kell jelölni | gyakran rossz adat marad kint |

**Javaslat: A** (`meta.card` nélkül a mai viselkedés marad).

### 3.3 Többi
- **Rendezés-választó:** ha nincs rendezhető oszlop, a `SortSelect` nem jelenik meg (HIBA – ma egyetlen „Nincs rendezés” opció).
- **Tömeges sáv telefonon:** 600 px alatt alsó, rögzített, egysoros sáv: „N kijelölve · Műveletek ▾ · ✕” (a gombok `DropdownMenu`-be kerülnek); asztalon marad a mai.
- **Lista-eszközsáv:** a `ListPage` nézetváltója, a találatszám és a sűrűség-kapcsoló egy sorban; `FilterBar` `filters[].secondary: true` → „További szűrők (N)” lenyitó; a szűrők és a táblázat közti üres sáv megszűnik.
- **AppShell:** 820 px alatti ablakmagasságnál tömörebb menütétel-köz (44 px érintési felület marad); az aktív menüpont betöltéskor láthatóvá görgetődik.
- **Apró HIBA-k:** Lalezar „…” (U+2026) egy pontként rajzolódik → a gombfeliratokban tartalék betű a jelre; tiltott `SelectField` a kapott `placeholder`-t mutassa („Előbb a kategóriát válaszd ki”), ne „Nincs választható elem”-et; `VideoUpload` hibaszövege ne legyen önellentmondó; ablak (Modal/ConfirmDialog) mindig a telefonos fiók fölött.

## 4. Állapotok
alap · rámutatás · fókusz · tiltott · töltés · hiba · üres · kijelölve (tömeges sáv) · lenyitva (részletek) · szűk / széles (prioritás)

## 5. Szélső esetek (tesztlapra)
- 0 sor, 1 sor, 1000 sor; minden oszlop `priority: 3`; nincs `_actions` oszlop; nagyon hosszú cím a kártyafejlécben; 200 kijelölt sor telefonon;
- egyetlen rendezhető oszlop sincs; csak `secondary` szűrők; 20 szűrő;
- 600 / 820 / 1280 / 1920 px széles és 640 / 800 / 1080 px magas ablak; világos és sötét.

## 6. API (új, opcionális)
```tsx
// oszlop
{ accessorKey: 'phone', header: 'Telefonszám', meta: { label: 'Telefonszám', priority: 3, card: 'detail' } }
{ id: 'name', meta: { priority: 1, card: 'title' } }
{ id: '_actions', meta: { pinEnd: true } }          // jobbra rögzített műveletoszlop
// DataTable: nincs új kötelező prop; a SortSelect magától rejtve, ha nincs rendezhető oszlop
// FilterBar
filters={[{ id: 'kat', label: 'Kategória', options, secondary: true }]}
```

## 7. Hozzáférhetőség
A prioritás miatt elrejtett oszlop tartalma a lenyitott sorban elérhető (billentyűzettel, képernyőolvasóval, „Részletek” gomb `aria-expanded`). A rögzített műveletoszlop a DOM-sorrendben a sor végén marad. Az alsó tömeges sáv `role="region"` névvel, a műveletek menüje billentyűzettel kezelhető; nem takarja el a lap alját (a lista alá ugyanannyi helyet hagy). 44 px és fókuszgyűrű mindenhol.

## 8. Döntés
- Dátum: 2026-10-02
- Kristóf: „a UX/UI javaslatokat elfogadom, javítsd őket” – az irány jóváhagyva, a fenti **A** változatokkal. Ha a megvalósított képernyőképek alapján mást szeretne, a kiadás előtt jelzi.
- Kiadás: előbb a HIBA-k (javító verzió), aztán a bővítés (mellékverzió) – a PARTNERAPP-munkamenettel egyeztetve.
