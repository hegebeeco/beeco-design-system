# Javaslat 18 – Admin UI-kiegészítések: szöveges StatTile, FilePicker, LocationPicker mezőnevek, üres eszközsáv

*Állapot: **jóváhagyva** · készítette: Claude (ADMINAPP) · dátum: 2026-10-05*

## 1. Igény
- Hol kell: beeco admin (a partner-app is használhatja).
- Mit old meg: négy apró hiány, amit az admin eddig kézzel hidalt át (UX-átvilágítás és a „CEO-funkciók és UX/UI javaslatok” dokumentum, UI-4 és UI-7).
- Ma helyette:
  - szöveges mutató: kézzel összerakott `bc-stat` blokk inline `font-size`-szal (partner-adatlap „Frissesség”);
  - fájlválasztó: az admin `ExcelImport`-ja saját drop-zónát rak össze, mert a DS `FileImport` kiválasztáskor rögtön importál és eredménylistát vár;
  - koordináta-mezők neve: az admin a DOM-ból állítja be a `name`-et, hogy a hibaösszesítő a mezőre ugorjon;
  - üres eszközsáv: kártyanézetes táblán (`mobile="cards"`) sűrűség-kapcsoló nélkül széles nézetben ~60 px üres sáv (admin KE-31) – a `main.scss`-ben áthidalva.

## 2. Mire épül
- `StatTile`, `FileImport` (drop-zóna, fájlkártya, `checkFiles`), `LocationPicker`, `DataTable` + `SortSelect`. Új elem csak a `FilePicker` (molekula).

## 3. Változatok
- Szöveges StatTile: **A** `text` prop a meglévő StatTile-on (választott) · B külön `StatText` elem. Az A egy helyen tartja a csempe-jelölést (címke, súgó, időszak, forrás).
- Fájlválasztó: **A** új `FilePicker` (választott) · B `FileImport` `autoImport={false}` kapcsolóval. Az A egyszerűbb API, a FileImport nem bonyolódik.

## 4. Állapotok
- FilePicker: üres (drop-zóna) · ráhúzás · kiválasztva (fájlkártya: név, méret) · nagy fájl (figyelmeztetés) · rossz típus / túl nagy / üres fájl (hiba + teendő) · feltöltés közben (`busy`: „Feltöltés…”, Másik fájl tiltva) · tiltott.
- StatTile `text`: a szöveg tördelhető, nincs „—” és nincs delta.

## 5. Szélső esetek (tesztlapon)
- `media-import`: „Fájlválasztó feltöltés nélkül” – CSV → hiba; .xlsx → fájlkártya; Másik fájl → vissza; 1,3 MB → figyelmeztetés; feltöltés közben.
- `adat-mutato`: „Szöveges érték” – hosszú állapot-szó, nem lóg ki.
- `kieg2-hely`: a koordináta-mezők `name` szerint elérhetők.
- `adat-tabla`: kártyanézet sűrűség-kapcsoló nélkül – széles nézetben a sáv 0 px, keskenyen a Rendezés látszik.

## 6. API
```tsx
<StatTile label="Frissesség" help="…" value={null} text="Frissítésre vár" />
<FilePicker label="Kitöltött sablon" help="…" value={fajl} onChange={setFajl} accept={[XLSX_MIME]} acceptAttr=".xlsx"
  maxSizeMB={20} warnSizeMB={1} formatText=".xlsx" typeHint="…" busy={kuld} required />
<LocationPicker … latName="latitude" lngName="longitude" />
```
CSS: `.bc-kpi .bc-stat-value.is-text`; `.bc-dt.is-cards > .bc-dt-bar:has(> .bc-dt-tools > .bc-dt-sortsel:only-child)` széles nézetben rejtett.

## 7. Hozzáférhetőség
- FilePicker: natív `input[type=file]` a drop-zónában (billentyűzettel, képernyőolvasóval), hiba `aria-describedby`-jal, állapot `role="status"`.
- A rejtett eszközsáv nem rejt el fókuszálható elemet (a Rendezés-választó széles nézetben amúgy is rejtett).

## 8. Döntés
- Dátum: 2026-10-05 – Kristóf: „A UX és UI fejlesztések mehetnek” (a „CEO-funkciók és UX/UI javaslatok” dokumentum UI-4 és UI-7 pontja).
- Választott változat: mindkét helyen az A.
