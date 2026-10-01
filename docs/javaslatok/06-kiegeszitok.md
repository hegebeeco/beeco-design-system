# Javaslat 06 – A maradék komponensek (admin-igények alapján)

*Állapot: **jóváhagyva (2026-10-01)** – Kristóf: „Mehetnek a maradék DS komponensek is, melyekre szerinted még szükség lehet.” → Claude javaslata szerint épül; ha egy elemnél valódi választás adódik, Claude javasol és a CHANGELOG-ban jelzi.*

Forrás: a beeco-admin felmérése (2026-10-01). Minden elem a `docs/komponensek.md` szabályai szerint (3/A mező-részek, 3/B grafikon, 3/C önteszt, 05 méhecske/szóvicc/mozgás).

## 06a – kiegészítők (csak a 01 és 05 csomagra épülnek)
| # | Elem | Szint | Mire kell (admin) | Lényeg |
|---|---|---|---|---|
| 1 | PhoneField | molekula | partnerek (17 hely) | +36 előtag, magyar formátum (+36 30 123 4567), betű tiltva, mobil/vezetékes hossz-ellenőrzés, súgó |
| 2 | CopyButton | atom | azonosító, link, kuponkód | másol + „Másolva” pipa (05) + képernyőolvasó-bejelentés; hiba esetén kijelölhető szöveg |
| 3 | DownloadButton | molekula | Excel-export, listák | állapotok: kész → készül (haladás) → letöltve (pipa) → hiba (újra); fájlnév és méret |
| 4 | Slider + RangeSlider | atom | szűrők (távolság, %) | billentyűzet (nyilak, PageUp/Down, Home/End), érték-kijelzés, tartomány, súgó; érintésen 44 px |
| 5 | UnsavedChangesGuard | molekula | minden szerkesztő oldal | „Nem mentett változásaid vannak” – oldalelhagyás/bezárás előtt kérdez (kíméletesen, szóvicc nélkül) |
| 6 | OfflineBanner | molekula | az egész admin | „Nincs térerő a kaptárban” (05) + mi történik a mentéssel; visszatéréskor eltűnik |
| 7 | ErrorPage, NotFoundPage, ForbiddenPage, SessionExpired | sablon | az egész admin | BeeMoment (05): kacsintó 404, gondolkodó jogosultság, szomorú csak szerverhiba, pihenő munkamenet |
| 8 | Timeline / ActivityLog | organizmus | partner-aktivitás, ki mit módosított | időrend, ki/mit/mikor, mezőszintű különbség (előtte → utána), napok szerint csoportosítva, „Még…” |
| 9 | PreviewCard: partner, kupon, értesítés | organizmus | szerkesztés közben „így látszik az appban” | élő előnézet telefonkeretben, az app vonalában (termékbőr), hosszú szöveg levágás jelzése |
| 10 | AudienceBuilder | organizmus | értesítések célcsoportja | „ha … és/vagy …” szabálysorok (mező, feltétel, érték), élő létszám-becslés (a hívó adja), üres/hibás szabály jelzése |
| 11 | CompareMerge | organizmus | POI-duplikátumok | két (vagy több) rekord egymás mellett, mezőnként választás (rádió), eltérések kiemelve, eredmény-előnézet, megerősítés |
| 12 | ReviewQueue | organizmus | POI minőségi sor | egy elem nagyban, jóváhagy / elutasít (indok kötelező) / kihagy, billentyűparancsok (J/E/K), haladás „12/40”, visszavonás |

## 06b – a 02–04 csomagra épülők (azok elkészülte után)
| # | Elem | Lényeg |
|---|---|---|
| 13 | LocationPicker | térképre tűzés (04 jelölő) + címkereső (Combobox) + koordináta-mezők (NumberField, tartomány), egymást frissítik |
| 14 | PrizeDrawReveal | sorsolás: résztvevők száma, „pörgetés” (csökkentett mozgásnál azonnal), nyertes + Bajnok-méh + hatszög-konfetti (05), újrasorsolás indokkal |
| 15 | VideoPlayer / embed-előnézet | feliratsáv, poszter, hibás/nem támogatott link jelzése |
| 16 | Oldalsablonok: ListPage, DetailPage, EditPage, Dashboard | sablon | PageHeader + FilterBar + DataTable / FormSection + FormActions + UnsavedChangesGuard / StatTile + ChartCard rács |
