# Takarítás a Webflow-ban (Javaslat 43, 2026-11-23)

Kristóf döntése: Claude listát ad, Kristóf kattint.

## Komponensek
Nem használt komponens csak a négy védett: `NAVBAR_MEGA`, `NAVBAR_REGI_BACKUP`, `ROLUNK_ERTEKEK`, `CSAPAT_FOTOSLIDER`. **Egyiket se töröld.**
Minden más komponensnek van példánya (2026-11-23-i lekérdezés).

## Osztályok: Style Manager → „Clean up”
A gomb a sehol nem használt osztályokat törli. Előtte már védve vannak:
- A **csak szkriptből használt osztályok**: `menu` + `menu-rejt` (a menü elbújása), `ds-logo-tobb` (logósor), `ds-nezo*` (képnézegető). Ezeket a **„DS stílustár (ne töröld)”** piszkozatoldal rejtett elemei tartják meg. Az oldalt ne töröld és ne publikáld.
- A főoldal 79 natív `fo-` osztálya mind elemen van, a Clean up nem törli.

Amit a Clean up várhatóan visz (rendben van):
- `ds-funkcio` + `cs-fent` régi kombó (átnevezés maradéka);
- a korábbi kísérletek `-1`, `-1-2` másolatai, ha maradt ilyen.

Ha a Clean up után valami eltűnik a tesztcímen, a mentés: `weboldal/web-ds/mentes-2026-11-23-j43-komponensek.json` és `weboldal/kozos/navigacio/mentes-2026-11-23-lebego-sav.json`.
