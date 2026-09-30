# beeco design system (régi neve: beeco-jatek-kit)

A **teljes beeco-márka közös design systeme** (1.12.0-tól): közös atomok (`tokens/`) és két bőr –
**termékbőr** az appnak, az adminnak, a partner-felületnek és a webnek (`termek/`, `dist/`), **játékbőr** (Méhsejt-diorama) a webjátékoknak (`web/`).
Egy forrás, generált kimenetek (CSS, SCSS, Tailwind, Dart), gépi ellenőrzésekkel. Felépítés: **`docs/rendszer.md`** · összefoglaló: `DESIGN.md`.

| Rész | Hol |
|---|---|
| **Közös atomok + bőrök** (egy forrás) | `tokens/core.json`, `tokens/theme-termek.json`, `tokens/theme-jatek.json` |
| **Generált kimenetek** – CSS-változók, betűk, SCSS, Tailwind preset, Dart, JSON | `dist/` (`node tools/tokens-build.js`) |
| **Termékbőr elemei** (`bc-` gomb, űrlap, kártya, ablak, táblázat, jelzés, váz) + élő bemutató | `termek/css/`, `termek/bemutato.html` |
| **Szabálykönyvek** – rendszer, termékbőr, app-átállás (Bence) | `docs/rendszer.md`, `docs/termek-arculat.md`, `docs/app-atallas.md` |
| **Ellenőrzések** – DS-őr (CI) és projekt-lint racsnival | `tests/check-tokens.js`, `tools/ds-lint.js` (`npx beeco-ds-lint`) |
| **Claude-skill** a termékekhez | `.claude/skills/beeco-ds` (játékhoz: `beeco-arculat`) |

Termék-projektbe: `npm install github:hegebeeco/beeco-design-system#v1.14.1`, majd `npx beeco-ds-lint --init`.

---

## Játékbőr és játék-kit

A beeco webjátékainak **közös alapja** – hogy minden új játék ugyanabban a stílusban, ugyanazokkal az eszközökkel,
ugyanazzal a minőséggel induljon, és a fejlesztések (új matrica, új piktogram, jobb eszköz) minden játékhoz eljussanak.

## Mi van benne
| Rész | Hol |
|---|---|
| **Design system** – tokenek, `ds-` elemek, játék-minták, mozgás-készlet, piktogramok, betűk | `web/css/`, `web/js/ds.js`, `web/js/pics.js`, `web/assets/fonts/` |
| **Élő kalauz** – minden elem, szín, ikon, matrica egy oldalon | `web/arculat.html` |
| **Méhecskék és márkaképek** (beeco – belső használatra) | `web/assets/brand/` |
| **370+ B szintű matrica** kódból + **3D modell-készlet** | `web/js/art/` (`art.js`, `model-kit.js`, `art-*.js`) |
| **QR-kód, offline mód** (service worker) | `web/js/qr.js`, `web/js/offline.js`, `web/sw.js`, `tools/sw-lista.js` |
| **Eszközök** – ablak nélküli böngészős ellenőrzés, smoke-teszt, matrica-render/ív/prompt/import, 3D-ellenőrzés | `tools/` |
| **Szabálykönyvek** – arculat, rajzolási mérce (B szint), promptolás, offline + CI, **játéktervezési elvek** | `docs/` |
| **Claude-skillek** – `beeco-arculat`, `beeco-jatek` | `.claude/skills/` |
| **Kalauz** – kereshető áttekintés mindenről + al-oldalak | `web/kit.html` (→ arculat, modellek, vilag, mechanikak, hatterek, keret) |
| **Design system 1.2** – változásjelző, profil-ábra, tanító, gyűrű, csúszka, lap, képernyő-váz, adatskálák | `web/js/ds-ext.js`, `web/css/ds-ext.css`, `docs/adatskala.md` |
| **2D hátterek + áramlás** – város, konyha, kert, méhsejt; mozgó pöttyök | `web/js/hatter2d/`, `web/js/aramlas.js`, `docs/hatterek-2d.md` |
| **3D világ-készlet** – 42 kódból épített tárgy + `beecoVilag()` (ég, felhők, szigetek, rét) | `web/js/3d/`, `web/js/vilag/`, `docs/3d-vilag.md` |
| **Játék-mechanikák** – döntéskártya, rácsos lerakás, vonalhúzás, kombinálás | `web/js/mech/`, `docs/mechanikak.md` |
| **Közös keret** – kör vége, beállítások, kifelé menő csatorna + mérés, kioszk, hang, szereplők | `web/js/keret/`, `hang.js`, `szereplok.js`, `docs/keret.md` |
| **Közös profil** – album, napi küldetés, jelvények minden játékon át (+ a központ) | `web/js/profil.js`, `docs/kozos-profil.md` |
| **Tartalom és források** – táblázatos szerkesztés, forrásjegyzék, „szám csak forrással” ellenőrzés | `tools/tartalom.js`, `tools/forras.js`, `docs/tartalom-szerkesztes.md`, `docs/forrasok.md` |
| **Új játék sablon** – futó mintajáték, tesztek, CI, offline, CLAUDE.md | `sablon/` |

## Megnézni
A kalauz élőben: **https://beeco-szelektalj.netlify.app/kit.html** (a játékgyűjtemény oldalán, nincs a keresőkben). Helyben: bármilyen statikus szerverrel a `web/` mappából.
Verzió: `VERSION`, változások: `CHANGELOG.md`, egy projekt állapota: `node tools/kit-sync.js <projekt> --check`.

## Használat
**Új játék:**
```bash
node ~/CLAUDE/beeco-jatek-kit/tools/uj-jatek.js ~/CLAUDE/beeco-polgarmester "Polgármester egy napra" "Gyors városi döntések, amelyeknek nincs mindig tiszta nyertese."
```
**Meglévő játék frissítése a kitből** (a projekt mappájából): `node ~/CLAUDE/beeco-jatek-kit/tools/kit-sync.js .`
(csak megnézni: `--check`) · **egy játékban végzett közös fejlesztés visszaküldése a kitbe:** `--vissza`, majd a kitben commit + push.

**Miért másolás, és nem git submodule?** Minden játék önállóan élesíthető marad (Netlify, offline mód, CI), nem kell privát
almodul-hozzáférést beállítani, és a Claude Code minden projektben ugyanazon az útvonalon találja a fájlokat. A `kit-sync --check`
mutatja meg, ha egy projekt lemaradt.

## A kit fejlesztése
Lásd `CLAUDE.md`. Röviden: minden változás után `node tests/check-arculat.js && node tests/check-art.js`, és ha a sablon
változott, egy próba-projekt: `node tools/uj-jatek.js /tmp/proba "Próba"` + `node /tmp/proba/tools/smoke.js`.
