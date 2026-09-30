# A beeco design system felépítése

*Kristóf döntései, 2026-10-01: egy közös design system a teljes beeco-márkához; közös atomok, két bőr;
egy forrás, generált kimenetek; sötét mód tokenszinten; sorrend: DS-repó → admin → partner (→ app: Bence).*

## 1. Egy mondatban

Minden beeco-felület – játék, mobilapp, admin, partner-felület, web – **ugyanazokból az atomokból** épül (színek, betűk,
térköz, időzítés), de két **bőrben** jelenik meg: a játékok játékosabbak, a termékek visszafogottabbak és sűrűbbek.

```
                    tokens/core.json  ← KÖZÖS ATOMOK (egy forrás)
                   /                \
   tokens/theme-jatek.json      tokens/theme-termek.json
   JÁTÉKBŐR – Méhsejt-diorama   TERMÉKBŐR – neo-brutalista (az app vonala)
   olíva tinta, puha árnyék,    fekete tinta, kemény átlós árnyék,
   kapszula-gomb, 3 px keret    8 px sarok, 2 px keret, sűrűbb elrendezés
          |                            |
   web/css/tokens.css + ds-*.css   dist/ (generált) + termek/css/bc-*.css
   → a webjátékok (kit-sync)       → admin (SCSS) · partner (Tailwind) · web (CSS) · app (Dart)
```

## 2. Mi közös és mi nem

| | Közös atom (core) | Játékbőr | Termékbőr |
|---|---|---|---|
| Színpaletta | méz, olíva, levél, krém, rózsa, … (38 primitív) | olíva tinta és vonal | **fekete** tinta és vonal |
| Betű | Lalezar (cím, szám, gomb) + Open Sans (szöveg) | ← | ← |
| Betűskála | 12 · 14 · 16 · 20 · 26 · 34 · 46 px | ← | ← |
| Térköz | 4 px rács: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 | ← | ← |
| Időzítés | 120 ms nyomás · 200 ms alap · `ease-out` görbe | ← | ← |
| Érintés | min. 44 px | ← | ← (sűrű admin-gomb asztalon 36 px, érintésnél 44) |
| Adatskálák | sorrendi, kétirányú, színtévesztő-barát, kategória | ← | ← |
| Sarok | – | 12 · 18 · 24 · 32 · kapszula | 2 · 4 · **8** · 12 · kapszula |
| Keret | – | 3 px | 1 px (hajszál) · 2 px (alap) |
| Árnyék | – | puha, függőleges (kemény átlós: SOHA) | kemény, átlós, elmosás nélkül: 2 · 4 · 6 px |
| Sötét mód | – | éjszakai jelenetek (`ds-dark`) | minden szerepnek van sötét párja |

## 3. A repó térképe (`hegebeeco/beeco-design-system`, helyben: `~/CLAUDE/beeco-jatek-kit`)

| Mappa / fájl | Mi | Ki szerkeszti |
|---|---|---|
| `tokens/core.json` | közös atomok | kézzel, CHANGELOG-bejegyzéssel |
| `tokens/theme-termek.json` | termékbőr: szín-szerepek (világos + sötét), sarok, keret, árnyék, **kötelező kontraszt-párok** | kézzel |
| `tokens/theme-jatek.json` | a játékbőr tükre (a forrás a `web/css/tokens.css`) | kézzel, a teszt összeveti |
| `dist/` | **generált** kimenetek: `css/beeco-tokens.css`, `css/beeco-fonts.css`, `scss/_beeco.scss`, `tailwind/preset.cjs`, `dart/beeco_tokens.dart`, `tokens.json` | `node tools/tokens-build.js` – kézzel SOHA |
| `termek/css/bc-*.css` | termékbőr elemei (gomb, űrlap, kártya, ablak, táblázat, jelzés, váz) | kézzel, csak tokenekkel |
| `termek/bemutato.html` | élő bemutató (világos/sötét) | |
| `web/` | játékbőr + játékeszközök (lásd `docs/arculat.md`) | |
| `tools/ds-lint.js` | ellenőrző a fogyasztó projektekhez (racsni) | |
| `tests/check-tokens.js` | a DS saját őre | |

## 4. Hogyan jut el a projektekhez

**Webjátékok:** változatlanul a `kit-sync` másol (`docs/offline-es-ci.md`, `KIT-FILES.json`).

**React-appok (admin, partner, web):** verziózott **git-függőség** – nincs npm-regisztráció, nincs költség:
```bash
npm install github:hegebeeco/beeco-design-system#v1.14.0
```
- CSS: `import '@beeco/design-system/termek.css'` (tokenek + betűk + minden elem)
- SCSS (admin): `@use '@beeco/design-system/dist/scss/beeco' as bc;` → `bc.$bc-ink`, `bc.sp(4)`, `bc.r(m)`
- Tailwind (partner): `presets: [require('@beeco/design-system/tailwind')]` – a Tailwind saját palettája **kikapcsol**,
  csak beeco-szín létezik (`bg-accent`, `text-ink`, `border-line`, `shadow-m`, `rounded-m`, `font-display`).
- Frissítés: új verziónál a `#v1.x.y` címke átírása és `npm install`.

**Flutter app (Bence):** a `dist/dart/beeco_tokens.dart` bemásolva (`BeecoPalette`, `BeecoRoles.light/dark`, `BeecoTokens`).
Átállási útmutató: `docs/app-atallas.md`.

## 5. Ellenőrzések – mi őrzi a rendszert

| Hol | Parancs | Mit fog meg |
|---|---|---|
| DS-repó | `npm test` (CI minden pushnál) | elavult `dist/`; kontraszt minden kötelező páron világosban és sötétben; eltérés a játékok `tokens.css`-étől; nyers szín / nem létező token / `ease-in` / nyers betűméret / túl lassú átmenet / méz háttér rossz szövegszínnel a `bc-` elemekben; plusz a játékbőr teljes tesztkészlete |
| Játék-projekt | `node tests/check-arculat.js` | a Méhsejt-diorama szabályai (racsni) |
| Termék-projekt | `npx beeco-ds-lint` | nyers szín, Tailwind alap-paletta, idegen betű, nyers betűméret, 12 px alatti szöveg, nyers sarok és árnyék, `ease-in`, eltüntetett fókusz – **racsni**: a mostani adósság fel van írva, új fájl tisztán indul, egyik szám sem nőhet |
| Bármely felület, kész előtt | `minosegkapu` skill | kontraszt, 44 px, billentyűzet, kilógás, mozgás, képernyőképek (mobil + széles, világos + sötét) |

## 6. Új anyag menete (minden projektben)

1. **Skill betöltése:** termék → `beeco-ds`; játék → `beeco-arculat` (+ `beeco-jatek`). A `minosegkapu` az elején és a végén.
2. **Előbb a meglévő:** van-e rá `bc-` / `ds-` elem? Ha van, azt használd; ha a projektben van rá komponens (pl. `BeecoButton`), az a `bc-` elemre épüljön.
3. **Csak tokenek:** szín, méret, sarok, árnyék, időzítés `var(--bc-…)` / Tailwind-osztály / `bc.$…` – nyers érték tilos.
4. **Minden állapot:** töltés, üres, hiba, siker, tiltott – a `bc-` elemekben megvan, ne hagyd ki.
5. **Ellenőrzés:** `npx beeco-ds-lint` zöld (vagy javult → `--update`), `minosegkapu` jelentés.
6. **Új elem kell?** Állj meg: javaslatlap (`docs/javaslatok/`) → Kristóf jóváhagyja → a DS-be kerül tesztlappal. Szabályok, öntesztek, szélső esetek: **`docs/komponensek.md`**.

## 7. Változtatás a DS-ben

- **Név soha nem változik és nem törlődik** (token, szerep, osztály) – csak új jön. Ha egy érték változik (pl. más zöld), az minden terméket érint: Kristóf döntése kell.
- Menet: `tokens/*.json` → `node tools/tokens-build.js` → `npm test` → `CHANGELOG.md` + `VERSION` + `package.json` → commit + push → git-címke (`git tag v1.x.y && git push --tags`) → a projektekben verzió-emelés.
- Új szín csak indokolva (CHANGELOG): előbb nézd meg, fedi-e egy meglévő primitív.
