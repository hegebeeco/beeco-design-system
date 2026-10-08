# beeco – DESIGN.md

*Platformsemleges, szemantikus leírás (Stitch / Impeccable / Flutter / bármely eszköz számára). A mérvadó értékek:
`tokens/*.json` → generált `dist/`. Felépítés: `docs/rendszer.md`.*

## Márka
beeco: magyar fenntarthatósági app és játékvilág. Hangnem: tegeződő, rövid, bátorító – **tanítunk, nem szidunk**.
Jelkép: a méhecske és a méhsejt. Fő szín: **méz** `#FECF39`, az egyetlen hangsúlyszín.

## Közös atomok (minden felület)
- **Paletta:** méz `#FECF39` · nyomott méz `#D8A500` · vaj `#FEEEBB` · krém `#FFF8E7` · olíva `#2F371E` · levél `#6E8947` ·
  zsálya `#D3DDBB` · rózsa `#F5B4C7` · parázs `#EA580C` · víz `#0083E4` · fókuszkék `#2656D9` (+ 28 további, `tokens/core.json`).
- **Betű:** Lalezar (cím, szám, gomb – egy vastagság) + Open Sans (szöveg, hivatalosan 400/600/700; az app 500/800-as értéke eltérés, az átállásnál rendeződik). Skála: 12 · 14 · 16 · 20 · 26 · 34 · 46 px. 12 px alatt nincs szöveg.
- **Térköz:** 4 px rács. **Érintés:** min. 44 px. **Mozgás:** 120 ms nyomás, 200 ms megjelenés, ease-out; UI-visszajelzés ≤ 300 ms; fiók 400 ms; belépő/dekoratív mozgás ≤ 900 ms, csökkentett mozgásnál ki; ease-in tilos.

## Két bőr
| | **Termékbőr** – app, admin, partner, web | **Játékbőr** – webjátékok (Méhsejt-diorama) |
|---|---|---|
| Hangulat | neo-brutalista, határozott, sűrű | meleg, játékos, puha |
| Tinta és vonal | **fekete** `#000000` | olíva `#2F371E` (fekete tilos) |
| Háttér / felület | krém / fehér | krém / papír `#FFFDF6` |
| Keret | 1–2 px | 3 px |
| Sarok | 2 · 4 · **8** · 12 px + kapszula | 12 · 18 · **24** · 32 px, kapszula-gomb |
| Árnyék | kattintható és kiemelt elemen kemény, átlós, elmosás nélkül (2 · 4 · 6 px); nem kattintható információs dobozon puha | puha, függőleges; kemény átlós SOHA |
| Gomb | méz téglalap, 8 px sarok, 2 px árnyék → lenyomva a helyére csúszik | méz kapszula, 4 px „vastagság” → lenyomva lesüllyed |
| Sötét mód | minden szerepnek van párja (éjszakai olíva alap) | éjszakai jelenetek |
| Szabálykönyv | `docs/termek-arculat.md`, skill: `beeco-ds` | `docs/arculat.md`, skill: `beeco-arculat` |
| Bemutató | `termek/bemutato.html` | `web/arculat.html` |

## Szerepek (termékbőr, világos)
`bg` krém · `surface` fehér · `surface-2` `#F0F3EC` · `surface-accent` vaj · `ink` fekete · `ink-soft` `#505050` ·
`line` fekete · `accent` méz, rajta `on-accent` fekete · `success` levél · `danger` `#DB3A34` (szöveg: `#B3261E`) ·
`warning` parázs (szöveg: `#824217`) · `info` víz (szöveg: `#003E74`) · `focus` `#2656D9` (a gyűrű kifelé fut: `outline-offset ≥ 2px`).
Sötétben (1.54.0 óta): `danger` pipacs `#EF6A60`, `ink-muted` ezüst `#C6C6C6`. A teljes táblázat: `docs/termek-arculat.md` 2.

## Nem alkudható
Csak tokenek; a gombszabály (egy méz fő gomb, piktogram, igazítás, árnyék): `docs/termek-arculat.md` 6/A; minden állapot (töltés, üres, hiba, siker, tiltott) megtervezve;
kontraszt AA; billentyűzettel minden elérhető; mérges méhecske soha.
