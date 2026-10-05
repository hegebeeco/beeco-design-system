# Javaslat 19 – Admin UI-tisztítás: lapos összegző csempék, Tag, tábla alapsűrűség és keret nélküli változat, szakaszcím

*Állapot: **jóváhagyva** · készítette: Claude (ADMINAPP) · dátum: 2026-10-05*

## 1. Igény
- Hol kell: beeco admin (a partner-app is használhatja) – a „CEO-funkciók és UX/UI javaslatok” UI-3 (kártya a kártyában helyett tagolás), UI-5 (színek csak jelentéssel), UI-1 (tömör táblák) pontjai; az admin UI-tisztítás közben talált hiányok.
- Ma helyette: a DetailPage összegzése kártya, benne a StatTile-ok is kártyák; tulajdonság-jelvényre nyers `bc-badge is-muted` (ami a „lezárult” állapotot is jelenti); minden táblán vezérelt sűrűség-állapot; kártyán kívüli szakaszcímre `.bc-card-title`; kártyába ágyazott tábla saját kerettel és árnyékkal.

## 2. Mire épül
`.bc-stat` / StatTile, `.bc-badge`, DataTable (`useCtl`), `.bc-card-title`. Új elem csak a `Tag` (atom).

## 3. Változatok
- Lapos csempék: **A** CSS a `.bc-sablon-summary-block`-on belül (választott – a fogyasztóknak semmit nem kell átírniuk) · B külön prop.
- Tulajdonság-jelvény: **A** `Tag` komponens + `.bc-badge.is-tag` (választott) · B a `StatusBadge` `tone="tag"`-gel (összemosná az állapotot és a tulajdonságot).

## 4–5. Állapotok, szélső esetek (tesztlapon)
- `sablon-reszletek`: az összegző csempék laposak (nincs keret, árnyék), mellettük Tag.
- `adat-mutato`: Tag és StatusBadge egymás mellett; `.bc-section-title`.
- `adat-tabla`: kártyába ágyazott tábla `bare` + `defaultDensity="dense"`, a sűrűség-kapcsoló továbbra is vált.

## 6. API
```tsx
<Tag>Vendéglátás</Tag>
<DataTable … bare defaultDensity="dense" />
<h3 className="bc-section-title">Kuponok</h3>
```
CSS: `.bc-sablon-summary-block .bc-stats > .bc-stat` lapos, elválasztó vonallal; `.bc-badge.is-tag`; `.bc-section-title`; `.bc-dt.is-bare .bc-dt-wrap`.

## 7. Hozzáférhetőség
A Tag szöveges (nem csak szín); kontraszt: `--bc-ink` a `--bc-surface-2`-n (világos + sötét, a tokenek kontraszt-tesztje fedi).

## 8. Döntés
- Dátum: 2026-10-05 – Kristóf: „A UX és UI fejlesztések mehetnek” (UI-1, UI-3, UI-5; a UI-tisztítás DS-javaslatai).
- Választott változat: mindenhol az A.
