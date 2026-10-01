# Javaslat 08 – Becsukható oldalsáv, felhasználó a sáv alján, fejléc nélküli váz

*Állapot: **jóváhagyva** · Kristóf kérése, 2026-10-01 · megvalósítás: Claude*

## 1. Igény
- Hol kell: admin (AdminShell), később a partner-felület.
- Mit old meg: a bal menü becsukható (több hely a táblázatoknak), a felhasználó (név, kijelentkezés) a menü alján van, és nincs felső sáv – a tartalom az oldal tetejéig ér.
- Ma helyette: AppShell vékony fejléccel, a profil-menü a fejléc jobb oldalán.

## 2. Mire épül
- DS: `AppShell` (03 – 9A), `DropdownMenu` (03 – 5A), `Avatar` (04), `IconButton`.
- Új: `ShellAccount` (molekula, `sablon` csomag – mert a médiából és a rétegekből is épít).

## 3. Változatok és döntés
| | Választott | Elvetett |
|---|---|---|
| Becsukás | Ikon-sáv (84 px), csoportok helyén vékony elválasztó, felirat rejtve (a link neve marad), rámutatáskor `title` | Teljesen eltűnő sáv – a navigáció két kattintásra kerülne |
| Felhasználó | A sáv alján: avatar + név + szerep, menü (kijelentkezés); becsukva csak az avatar | Fejléc jobb sarka – fejléc nélkül nincs hely |
| Fejléc | `topbar` nélkül asztalon nincs fejléc; 900 px alatt marad egy vékony sáv (☰ + kis márka) | – |

## 4. Állapotok
Nyitott · becsukott (megjegyezve az eszközön: `bc-shell:<collapseKey>`) · keskeny (fiók ☰-rel, benne a felhasználó) · felhasználói menü nyitva · név töltődik („Betöltés…”). Csökkentett mozgásnál nincs szélesség-animáció.

## 5. Szélső esetek (tesztlap: `reteg-vaz`)
Nagyon hosszú név (levágva, a teljes név a gomb nevében és a menü fejlécében) · becsukott állapot újratöltés után · telefonon a felhasználó a fiókban · billentyűzet: a becsukó gomb `aria-expanded`, a menü Esc-re zár és visszaadja a fókuszt.

## 6. API
```tsx
<AppShell brand={…} brandCompact={…} nav={…} collapsible collapseKey="admin"
  account={<ShellAccount name="Kata" detail="admin" items={[{ label: 'Kijelentkezés', onSelect: signOut }]} />} />
```
A márka szövegét `<span className="bc-brand-text">` jelöli – becsukva rejtve.
