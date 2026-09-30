---
name: beeco-ds
description: A beeco egységes design systeme (hegebeeco/beeco-design-system). Használd MINDEN beeco-felületen, ami nem webjáték – admin (beeco-admin), partner-felület (beeco-partner), web, Flutter app specifikáció, HTML-proto, artifact beeco-arculattal –, és amikor a design system tokenjeit, elemeit, ellenőrzéseit kell bővíteni. Webjátékhoz a beeco-arculat skill kell (ez eldönti, melyik bőr).
---

# beeco design system – így dolgozz

A DS-repó: `~/CLAUDE/beeco-jatek-kit` (GitHub: `hegebeeco/beeco-design-system`). Felépítés: `docs/rendszer.md`.
**Közös atomok** (`tokens/core.json`) → **két bőr**:
- **Termékbőr** (app, admin, partner, web): neo-brutalista, fekete tinta, kemény átlós árnyék, 8 px sarok.
  Szabálykönyv: `docs/termek-arculat.md` · elemek: `termek/css/bc-*.css` · bemutató: `termek/bemutato.html`.
- **Játékbőr** (webjátékok): Méhsejt-diorama → **a `beeco-arculat` skillt töltsd be**, ne ezt kövesd.

## 1. Mielőtt hozzányúlsz
0. **Meglévőből dolgozz** (`docs/komponensek.md` 1.): DS React-komponens → `bc-` CSS-elem → projekt-komponens → tokenekből. **Új elem, változat vagy szabály csak Kristóf jóváhagyásával, javaslatlapon** (`docs/javaslatok/_sablon.md`) – ha kellene, állj meg és javasolj, ne építsd meg „ideiglenesen”.
1. Melyik bőr? Játék → `beeco-arculat`. Minden más → ez a skill.
2. Olvasd el a `docs/termek-arculat.md` releváns részét (2. szerepek, 6. elemek, 7. tilos).
3. Nézd meg, van-e már rá `bc-` elem vagy projekt-komponens – **előbb a meglévőt használd**.
4. `minosegkapu` skill a munka elején (szabályok) és a végén (kapu).

## 2. Szabályok (nem alkudható)
- **Csak tokenek / szerepek:** CSS `var(--bc-ink)`, SCSS `bc.$bc-ink` / `bc.sp(4)`, Tailwind `text-ink bg-accent shadow-m rounded-m`,
  Dart `BeecoRoles.light.ink`. Nyers szín, nyers px betűméret/sarok/árnyék: tilos. A Tailwind alap-palettája (`gray-100`) nem létezik.
- **Szöveg a mézen mindig `on-accent`** (sötét módban is fekete).
- **Árnyék:** kemény, átlós, elmosás nélkül (`shadow-s/m/l`); puha árnyék a termékbőrben nincs.
- **Betű:** Lalezar csak cím/szám/gomb, Open Sans minden más; 12 px alatt nincs szöveg; vastagság 400/600/700.
- **Mozgás:** ≤ 300 ms, `ease-out`; `ease-in` tilos; hover csak `(hover:hover) and (pointer:fine)`.
- **Hozzáférhetőség:** 44 px érintés, látható fókusz (`:focus-visible`), ikongombon `aria-label`, ablak natív `<dialog>` vagy fókuszcsapda + Esc,
  hibánál `aria-invalid` + `aria-describedby`, kattintható elem `<a>`/`<button>` (nem `div`).
- **Állapotok:** töltés, üres, hiba, siker, tiltott – mind legyen meg.
- **Szöveg:** tegeződő, rövid; a hiba mondja meg a következő lépést; szám csak valós adatból vagy forrással.

## 3. Öntesztek – kötelező minden beviteli mezőre és grafikonra
Tesztlap (`termek/tesztlapok/<komponens>.html`) minden állapottal és a szélső esetekkel (`docs/komponensek.md` 3.4: üres, max. hossz, 0, negatív, tizedesvessző, 1000+ opció, nincs adat, kiugró érték, hiba, töltés…), gépi futtatás: `tests/check-komponensek.js` (8 nézet × világos/sötét: működés, kilógás, 44 px, kontraszt, billentyűzet, konzolhiba). Atomic szint: egy szint csak alatta lévőkből épül.

## 4. Ellenőrzés, mielőtt „kész”
- Termék-projektben: `npx beeco-ds-lint` → „nem romlott” (javult? `npx beeco-ds-lint --update`).
- DS-repóban: `npm test` (dist friss, kontraszt világos+sötét, párosság a játékokkal, `bc-` elemek szabályai).
- `minosegkapu`: mérés mobil + széles, világos + sötét; a képeket nézd meg.

## 5. A DS bővítése
- Token: `tokens/*.json` → `node tools/tokens-build.js` → `npm test`. Név **soha** nem változik és nem törlődik.
- Új elem: ha ≥ 2 projektnek kell → `termek/css/` (+ bemutató + ha kell, teszt-szabály); különben a projektben, tokenekből.
- Kiadás: `CHANGELOG.md` + `VERSION` + `package.json` → commit + push → `git tag v1.x.y && git push --tags` → a projektekben a `#v…` emelése.
- Értékváltozás (pl. más zöld) minden terméket érint → Kristóf döntése kell.

## 6. Beépítés egy projektbe
```bash
npm install github:hegebeeco/beeco-design-system#v1.14.0
npx beeco-ds-lint --init        # racsni: a mostani állapot felírva
```
CSS: `import '@beeco/design-system/termek.css'` · SCSS: `@use '@beeco/design-system/dist/scss/beeco' as bc;` ·
Tailwind: `presets: [require('@beeco/design-system/tailwind')]` · Flutter: `docs/app-atallas.md`.
