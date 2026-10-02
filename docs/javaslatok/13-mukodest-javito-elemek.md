# Javaslat 13 – Működést javító elemek (lista-állapot, térkép-panel, színpad, időzítés, állapotjelvény, visszavonás, piszkozat, mérő)

*Állapot: **jóváhagyva** · Claude (ADMIN) · 2026-10-02 · Kristóf: „javítsd a hibákat és a plusz DS elemeket is csináld meg és pushold a github-ra” (az admin design-uplift után adott javaslatlista 1–8. pontja).*

## 1. Igény
Az admin teljes DS-átállása közben ugyanazok a hibák ismétlődtek oldalanként – ezek nem egy-egy oldal hibái, hanem hiányzó közös elemeké:
- listák: „üres lista” a hálózati hiba helyett, üres lapra esés szűrés után, félrevezető „nincs találat” szöveg;
- térképek: 4 saját megoldás ugyanarra (nagyító, buborék, forrásjelölés, sötét mód), billentyűzettel nem bejárható;
- a saját teljes képernyős sorsolás: fókuszvesztés, kijárható fókusz, nincs képernyőolvasó-bejelentés;
- dátum + idő párok kézzel (múltbeli időpont, lejárat a kezdés előtt);
- állapot-jelvények oldalanként más színnel, csak színnel;
- visszafordítható műveletek megerősítő ablakkal;
- hosszú űrlap elvész lefagyáskor, lejárt belépéskor;
- a mérő álkontraszt-leletet ad megállt átmenetnél és color(srgb …) színnél.

## 2. Mire épül (meglévő anyagok)
ListPage, DataState, FilterBar · `.bc-map` Leaflet-öltözet, MapLegend, HeatScale · Radix Dialog, useReturnFocus · DatePicker, SegmentedControl · `bc-badge` hangnemek · notify (action) · EditPage, useUnsavedChanges · oldal-meres.js.

## 3. Elemek és API
| # | Elem | Szint | API |
|---|---|---|---|
| 1 | `useListState` + `listStatus` + `clampPage` | hook (sablon) | `useListState({ params, setParams }, { filters: ['tipus'] })` → search, filter, page, pageSize, setPagination, clear, hasFilters… · `listStatus({ isPending, isError, hasData, count, filtered })` |
| 2 | `MapPanel` | organizmus (média) | `<MapPanel label legend note toolbar status empty list view onViewChange height>{leaflet div}</MapPanel>` – „Térkép \| Lista” váltó, a lista linkes |
| 3 | `StageDialog` | organizmus (réteg) | `<StageDialog open onOpenChange title closable announce fullscreen>` |
| 4 | `ScheduleField` + `scheduleIssues` | molekula (űrlap) | `<ScheduleField label withEnd endLabel value={{ date, time, endDate, endTime }} onChange>` |
| 5 | `StatusBadge` | atom (adat) | `<StatusBadge tone="success\|warning\|danger\|info\|muted\|accent">Aktív</StatusBadge>` |
| 6 | `notify.undo` | segéd (réteg) | `notify.undo('Megoldottnak jelölve.', () => vissza())` – 10 mp, „Visszavonás” |
| 7 | `useDraft` + `DraftNotice` + `EditPage draft` | hook / molekula | `<EditPage draft={{ key: 'esemeny:126', values, onRestore }}>` – mentéskor törlődik |
| 8 | mérő: `fagyaszt` (alap) + color(srgb) | eszköz | `bcMeres({ w, touch, fagyaszt: true })` |
| + | DataTable: szűkülő adatnál az utolsó létező lapra lép | javítás | – |

## 4. Állapotok
Lista: töltés · hiba (adat nélkül) · üres · nincs találat · kész. Térkép-panel: töltés · hiba (Újrapróbálás) · üres · térkép · lista. Színpad: nyitott · folyamatban (nem zárható) · kész. Időzítés: azonnal · időzítve · múltbeli (hiba) · vég a kezdés előtt (hiba). Piszkozat: nincs · felajánlva · visszaállítva · elvetve · mentés után törölve.

## 5. Szélső esetek (tesztlap: `kieg3-mukodes`)
szűrés a 3. lapon → 0. lap; 0 találat szűrővel vs. üres lista; a színpad ✕-e folyamat közben tiltott, a fókusz nem esik ki, Tab nem visz ki, Esc után vissza a nyitóra; mind a 6 jelvény-hangnem piktogrammal; múltbeli kezdés, korábbi vég; térkép-panel töltés / hiba / üres / lista; Visszavonás visszaállít; piszkozat újratöltés után, mentés után nincs; DataTable 60 → 5 sor a 3. lapon.

## 6. Hozzáférhetőség
A lista-nézet a térkép elemeit linkként adja (billentyűzet, képernyőolvasó, telefon). A színpad élő régióban mondja az állapotot. A jelvény nem csak színnel beszél. A piszkozat-ajánlat `role=status`.

## 7. Döntés
- Dátum: 2026-10-02 · Kristóf a chatben: mind a 8 elem mehet.
