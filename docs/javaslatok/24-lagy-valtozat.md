# Javaslat 24 – lágy (belső) változat a termékbőrhöz

*Állapot: **javaslat** · készítette: Claude (Kristóf kérésére) · dátum: 2026-10-07*

## 1. Igény
- Kristóf, 2026-10-07: „Erre is kell megoldás a DS-be, most éles sarkok és a kemény árnyék van.”
- A termékbőr neo-brutalista: fekete tinta, kemény, átlós árnyék elmosás nélkül, 8 px sarok. A Kaptár (a beeco HR- és önkéntesfelülete) puha, nagy sarkú elemekkel, elmosott árnyékkal és zöld alapművelettel futott a javaslat írásakor (2026-10-07), DS-kapcsolat nélkül; azóta (1.46–1.53) a Kaptár áttért a termékbőrre, a mai állapotot a `brandbook/feluletek/kaptar.json` rögzíti.
- Cél: a DS-ben legyen hivatalos, lágyabb változat, amire a Kaptár (és később más belső felület, illetve a fotós, partneri anyagok) átállhat, anélkül hogy a termékbőr szabályai fellazulnának.

## 2. Mire épül
- Közös atomok: `tokens/core.json` (színek, betűk, térköz, mozgás) – ezek nem változnak.
- A termékbőr szerepei: `tokens/theme-termek.json`. A lágy változat **ugyanazokat a szerepneveket** kapja, más értékekkel.
- A Kaptár mai értékei: `brandbook/feluletek/kaptar.json` (felmérés: `beeco-hr/src/index.css` `@theme`).

## 3. Javaslat
- Új téma: `data-bc-variant="lagy"` (CSS) / `BeecoTheme.soft` (Flutter) / Tailwind `bc-soft` preset.
- Ami változik:
  - **sarok:** `--bc-r-m` 16 px, `--bc-r-l` 24 px;
  - **árnyék:** puha, elmosott: `--bc-shadow-m: 0 6px 20px rgb(0 0 0 / .08)`;
  - **keret:** 1 px, a tinta 20 %-a; fekete 2 px keret nincs.
- Ami marad: Lalezar és Open Sans, a méz mint hangsúly, a szöveg a mézen `on-accent`, 44 px-es érintés, mozgás ≤ 300 ms ease-out, AA-kontraszt, a méhecske-szabályok.
- **Alapművelet:** a méz marad a fő gomb színe (egy rendszer, egy hangsúly). A Kaptár zöldje `--bc-success`-szerepben jelenhet meg, alapgombként nem. Erről Kristóf dönt.
- A lágy változat a meglévő `bc-` elemekre téma szinten hat. Új elem nem kell.
- Tesztek: a `tests/check-*.js` mindkét változatra lefut (kontraszt világos és sötét módban, 44 px).

## 4. Nyitott kérdések (Kristóf)
1. Alapművelet a lágy változatban: méz (javaslat) vagy zöld?
2. Hol használjuk még a lágy változatot: csak a Kaptárban, vagy partneri és nyomtatott anyagban is?
3. A sötét mód a Kaptár mostani sötét témájából induljon, vagy a termékbőr sötét szerepeiből?

## Döntés
*(Kristóf tölti ki.)*
