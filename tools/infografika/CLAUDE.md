# Útmutató Claude Code-nak – beeco infografika-generátor

A tulajdonos Kristóf (ügyvezető, mechatronikus, nem fejlesztő). Magyarul kommunikálj,
magyarázd el röviden, mit és miért csinálsz, és döntés előtt kérdezz.

Hely: a beeco design system repó `tools/infografika/` mappája (2026-10-25 óta). Önálló kis eszköz:
saját `package.json`, saját tesztek; a repó gyökér-`CLAUDE.md`-je és `npm test`-je is érvényes rá.
A figurák (méhek, madarak) a DS saját képei, nem másolatok: a `src/figures.js` hivatkozik rájuk
(`../../web/assets/brand/…`, `../../brandbook/…`, `../../weboldal/…`), és a build ágyazza be őket.
Ha a DS-ben átnevezik vagy törlik valamelyiket, a build hibát dob, és a repó `npm test`-jében a
`tests/check-infografika.js` is piros lesz (létezés, git, tiltott kép, szöveg az SVG-ben).

## Kötelező szabályok

1. **Adat csak forrással.** Minden szám mellé forrás a `src` mezőben. Ha egy értéket
   grafikáról becsültél vagy magad számoltál, azt a forrássorban jelöld. A méh buborékában
   lévő állítás is adat: számold vissza (volt már hiba: 230× helyett 216×).
2. **Szín csak a `src/brand/tokens.css`-ben** (a szeletpaletta is: `--pal-a…f`, a JS onnan olvassa).
   A stílusfájlokban CSS-változót használj.
3. **Export-kompatibilitás (html2canvas 1.4.1).** Tilos a posztereken: `box-shadow`,
   transzformált `::before/::after`, `filter`, szöveg SVG-ben. A neo-brutalista árnyék
   külön réteg: `.nb` konténer + `.sh` réteg + `.face` tartalom (lásd poszter.css).
   Ennek a megszegése fekete téglalapokat okozott az exportban.
4. **Új diagramtípus lépései:** `src/types/<nev>.js` (render függvény, figyelmeztetéseket ad
   vissza tömbben) → bejegyzés a `render.js` típustérképébe → `<option>` az `index.html`-ben
   → `TYPE_HINTS` a `config.js`-ben → minta a `presets.js`-ben → a minta neve a
   `tests/visual.spec.mjs` listájába.
   **Új figura:** egy sor a `src/figures.js`-be (azonosító, felirat, útvonal a DS-ben, természetes
   szélesség/magasság). SVG csak szöveg nélkül (3. pont).
5. **Minden változtatás után `npm test`.** Szándékos vizuális változásnál `npm run test:update`,
   és a változott alapképeket mutasd meg Kristófnak, mielőtt commitolsz.
6. Felületi szöveg magyarul, mondatkezdő nagybetűvel, „ ” idézőjellel; számformátum hu-HU.

## Nyitott döntések (Kristóf dönt – ne dönts helyette)

Az összevetés táblázata: [`docs/tokenek.md`](docs/tokenek.md) (tokens.css vs. a repó tokenjei, eltérésekkel).

- **D1 Tipográfia.** Az app design systeme Lalezar + Open Sans. Az infografika a 2025-ös
  nyomtatott „Ökos tisztaság” anyagot követi: Bricolage Grotesque + Nunito. Melyik legyen?
- **D2 Sárga és paletta.** Az infografika sárgája #FBCA2F (nyomtatott anyagból mintavételezve).
  Az app, a DS-repó és a Figma palettája sem egyezik egymással (DS-labor, C-7 ütközés).
  Javaslat: a tokens.css változóit a DS szerepeire (BeecoRoles) kötni, ha a C-7 eldőlt.
- **D3 Árnyék.** Kemény eltolás, elmosás nélkül – ez egyezik a DS-repó szabályával.
- **D4 Illusztrációk – kész (2026-10-25).** „Figura” + „Méh hangulata” választó: 11 méh-hangulat
  (`web/assets/brand/bee-*.webp` és `moods/`; a mérges méh tilos – `tokens/hangnem.json`), 9 madár (a Csicsergősz vörösbegy 5 póza és a brandbook
  4 madárkája). A 12 szerep-méh (`roles/`) szándékosan nincs benne (szerep, nem hangulat).
  Nyitott: a kis méh-képek (pl. `think` 175 px) felnagyítva kissé lágyak; a vörösbegy SVG-k körül
  sok az üres hely, ezért a madár kisebbnek hat. Nagyobb felbontású forrás kellene a DS-ben.

## Ismert hibák

- Az emojik platformonként eltérően néznek ki (Apple vs. Android); hosszabb távon saját ikonok.

Javítva 2026-10-25 (az „elrendezés – …” tesztek őrzik, minden mintán és formátumban):
- 9:16-on (és kis mértékben 4:5-ön és 1:1-en) a buborék rálógott a diagramra és az árnyékára – nem csak az
  összehasonlításnál. A buborék lejjebb került (`margin-bottom` 4:5: 96 → 72, 1:1: 76 → 60, 9:16: 150 → 64 px).
  A magas figurák (liba) sem érnek fel a diagramig (`FIGURE_BOX`).
- 9:16 pontskála „Sertéshús”: a mostani kóddal nem jön elő (webfonttal és tartalék betűvel,
  három ablakméretben mérve); a teszt figyeli, ha visszatér.
- A szeletpaletta a tokens.css-be költözött (`--pal-a…f`), értékei változatlanok.
