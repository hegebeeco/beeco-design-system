# Tokenek: infografika vs. beeco design system

Döntés-előkészítő a CLAUDE.md **D1** (tipográfia) és **D2** (sárga és paletta) pontjához. A színeket és a
betűket ez a táblázat **nem írja át**. Csak azt mutatja, mennyire tér el az infografika a repó tokenjeitől.

* **Infografika:** `src/brand/tokens.css` (a 2025-ös nyomtatott „Ökos tisztaság” anyagból mintavételezve).
* **Repó:** `tokens/core.json` (közös primitívek), `tokens/theme-termek.json` (app, admin, partner, web) és
  `tokens/theme-jatek.json` (webjátékok). Állapot: `origin/main`, 1.57.0.
* **ΔE** (CIE76, a Lab-térben mért színtávolság): 2 alatt alig látható, 2–5 között kicsi, 10 fölött egyértelműen
  más szín.

## Színek

| Infografika token | Érték | Mire való a poszteren | Legközelebbi DS-szín | ΔE | DS-szerep (termékbőr) | Megjegyzés |
|---|---|---|---|---|---|---|
| `--g` | `#5F8844` | poszter háttere | `leaf` `#6E8947` | 5,9 | `success` | Sötétebb, telítettebb zöld. A DS-ben a `leaf` siker-szín, háttérnek nincs zöld szerep. |
| `--g-light` | `#81A46A` | háttérfoltok (35% átlátszó) | `leaf` `#6E8947` | 11,6 | – | Nincs párja. Közel van a `data.seq` 5. fokához (`#8BA863`). |
| `--g-dark` | `#3A4C2A` | diagram doboza, árnyékok | `forest` `#3D4E27` | 3,0 | `success-ink` | Gyakorlatilag egyezik. |
| `--g-deep` | `#2C3A1F` | a diagram árnyéka | `olive` `#2F371E` | 3,2 | játékbőr `ink`, sötét `surface-2` | Gyakorlatilag egyezik. |
| `--y` | `#FBCA2F` | kiemelés, logó doboza, a sárga oszlop | `honey` `#FECF39` | 2,4 | `accent` | **D2:** szemmel alig látható eltérés, de két külön hex. |
| `--y-soft` | `#FCEA98` | tengelyfelirat, rangcímke, kártyák | `honey-soft` `#FEE79C` | 3,8 | `accent-soft` | Közeli. A `honey-soft` 1.55.0-ban jött (a Figma HL/Yellow). |
| `--w` | `#FFFFFF` | címdoboz, buborék | `white` | 0 | `surface` | Egyezik. |
| `--k` | `#14180F` | keret, tinta, árnyék | `coal` `#1E1E1E` / `black` | 7,2 | `ink`, `line`, `shadow` = `black` | A termékbőr tintája tiszta fekete, az infografikáé zöldes-fekete. |

### Szeletpaletta (`--pal-a…f`, a fánk, a mozaik, az ikonrács és a pontskála színei)

| Kód | Érték | Legközelebbi DS-szín | ΔE | Megjegyzés |
|---|---|---|---|---|
| a – sárga | `#FBCA2F` | `honey` | 2,4 | Ugyanaz, mint a `--y`. |
| b – fehér | `#FFFFFF` | `white` | 0 | |
| c – krém | `#FCEA98` | `honey-soft` | 3,8 | Ugyanaz, mint a `--y-soft`. |
| d – világoszöld | `#C9DBB4` | `sage` `#D3DDBB` | 4,2 | A `data.seq` 2–3. foka között. |
| e – zöld | `#81A46A` | `leaf` `#6E8947` | 11,6 | Ugyanaz, mint a `--g-light`. |
| f – szürkés | `#B9BCA8` | `night-line` `#B6C4A3` | 8,2 | Nincs világos párja (a `silver` semleges szürke). |

**A DS saját adatpalettája** (`core.json` → `data`, részletek a `docs/adatskala.md`-ben):
* kategoriális: `honey`, `leaf`, `water`, `blossom`, `ember`, `olive-soft`, `sky`, `rust`;
* egyirányú: `seq` `#EEF3DE` … `#8BA863`.

Az infografika a kategoriális paletta helyett méz–krém–zöld árnyalatokat használ: a nyomtatott anyag egyszínű,
„zöld poszter” hangulatát. A DS szabálya („a szín soha nem egyedül beszél”) teljesül, mert minden szelet mellett
ott a szám és a felirat.

### Tokenen kívüli színek (tájékoztatásul, nincsenek átírva)

* A `--y-soft` átlátszó változatai: `rgba(252,234,152,.28)` a `src/styles/poster.css`-ben (rácsvonal), `.45` és `.35` a
  `src/styles/charts.css`-ben (összehasonlítás elválasztója, ikonrács „a többi”), `.6` a `src/types/icongrid.js`-ben (jelmagyarázat).
* `index.html` és `src/types/donut.js`: a `#14180F` a repülési útvonal és a fánkszeletek kerete (= `--k`).
* `src/styles/ui.css`: a szerkesztőpanel saját színei (`--ui-*`). Ezek nem a poszter részei.

## Tipográfia (D1)

| | Infografika | DS (`core.json` → `font`) |
|---|---|---|
| Cím, nagy szám | **Bricolage Grotesque** 600/800 | **Lalezar** (display) |
| Szöveg | **Nunito** 600–900 | **Open Sans** 400–700 (800 nincs) |
| Honnan tölt | Google Fonts (hálózat kell) | saját fájlok: `web/assets/fonts/` (offline is megy) |
| Betűköz | cím: −0,015em | display: +0,01em |

Ha a DS-betűkre álltok át, akkor:
* a Nunito 900-as vastagságait (címke, buborék) az Open Sans 700-ja váltja;
* a Lalezar keskenyebb és magasabb, ezért a címek tördelése és a nagy számok szélessége változik;
* minden alapkép újra készül (`npm run test:update`).

## Árnyék (D3, tájékoztatásul)

| | Infografika | Termékbőr | Játékbőr |
|---|---|---|---|
| Típus | kemény, átlós, elmosás nélkül, külön rétegként (export miatt) | kemény, átlós, elmosás nélkül | puha, csak függőleges; kemény átlós **soha** |
| Eltolás | 6–16 px (a poszter 1080 px széles) | 2 / 4 / 6 px | – |
| Szín | `--g-dark`, `--g-deep`, `--k` | `black` | olíva, átlátszó |

Az infografika a termékbőr szabályát követi, csak nagyobb léptékben (poszter, nem képernyő).

## Javaslat a döntéshez

* **D2:** a `--y` → `honey` és a `--y-soft` → `honey-soft` csere szemre szinte láthatatlan (ΔE 2,4 és 3,8). Ezzel az
  infografika ugyanazt a sárgát használná, mint az app és a web. A zöldeknél (`--g`, `--g-light`, a szeletek d–f
  színe) nincs pontos DS-pár: itt vagy a nyomtatott anyag zöldje marad poszter-szerepként, vagy új DS-primitív
  kell (az javaslatköteles, `docs/javaslatok/`).
* **D1:** a döntés üzleti (nyomtatott anyaggal egyező vagy apphoz illő arculat). Technikailag mindkettő megy.
  A DS-betű offline is működik, és nem kell hozzá a Google Fonts.
