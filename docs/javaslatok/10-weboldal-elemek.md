# Javaslat 10 – marketing-elemek a weboldalhoz (bc-sec, bc-wrap, tipográfia, rács)

*Állapot: **javaslat** · készítette: Claude · dátum: 2026-10-02*

## 1. Igény

- **Hol kell:** beeco.hu (Webflow). Minden nyilvános oldal: főoldal, kampányoldal, letöltés, beecopedia.
- **Mit old meg:** a termékbőr ma app- és admin-felületre készült (űrlap, tábla, ablak, modál). Egy
  marketingoldalhoz hiányzik a **szekció-ritmus**, a **tartalomszélesség** és a **címsor-skála**.
  Enélkül minden oldal újra feltalálja ezeket, és pontosan ettől csúszott szét eddig a beeco.hu.
- **Mit használnak ma helyette:** oldalanként kézzel beállított értékek, és a `h26-` előtagú,
  csak a főoldal-drafton létező osztályok. A site-on 1614 definiált stílus van, ebből 1450 nem
  fordul elő a megnézett oldalakon.

## 2. Mire épül

- **DS-elemek:** `bc-card`, `bc-panel`, `bc-btn`, `bc-chip`, `bc-tag`, `bc-divider`, `bc-row`,
  `bc-stack`, `bc-muted` – ezek **már megvannak** a Webflow-ban, változóra kötve.
- **Token:** nincs szükség új tokenre. Minden érték a meglévő `bc-sp-*`, `bc-fs-*`, `bc-r-*`
  skálákból jön.
- **Szint:** molekula (szekció, fejléc) és atom (tipográfia).
- **Nem vált ki React-komponenst:** a Webflow nem React, ez CSS-osztály-réteg.

## 3. A javasolt elemek

| Osztály | Mi | Érték |
|---|---|---|
| `bc-wrap` | tartalomszélesség | `max-width: 1080px`, oldalanként `bc-sp-4` margó, középre |
| `bc-sec` | szekció-ritmus | `padding-block: bc-sp-7` (48), 992 px fölött `bc-sp-8` (64) |
| `bc-sec.is-tight` | sűrűbb szekció | `padding-block: bc-sp-6` (32) |
| `bc-sec.is-accent` | kiemelt sáv | háttér `bc-surface-accent` |
| `bc-sec.is-ink` | sötét sáv | háttér `bc-ink`, szöveg `bc-bg` |
| `bc-eyebrow` | szekció-címke | `bc-fs-xs`, 700, nagybetűs, betűköz 1,4 px, szín `bc-ink-soft` |
| `bc-display` | oldalcím (h1) | Lalezar, `bc-fs-3xl` (46), sormagasság 1,15; mobilon `bc-fs-2xl` |
| `bc-title` | szekciócím (h2) | Lalezar, `bc-fs-2xl` (34), 1,15 |
| `bc-subtitle` | kártyacím (h3) | Lalezar, `bc-fs-l` (20), 1,15 |
| `bc-lead` | bevezető | `bc-fs-l` (20), 1,5, szín `bc-ink-soft`, max 62 karakter sorhossz |
| `bc-body` | folyó szöveg | `bc-fs-m` (16), 1,5 |
| `bc-grid-2` / `bc-grid-3` | kártyarács | 2 és 3 oszlop, köz `bc-sp-5`; 768 px alatt 1 oszlop |

**Miért `bc-` előtaggal és nem `web-`:** ugyanabból a token-készletből épülnek, és a csapat ugyanazt
a nevet keresi a Designerben, mint a `bc-*.css`-ben. Ha külön előtagot kapnának, két névrendszert
kellene fejben tartani.

## 4. Állapotok

A felsoroltak statikus elrendezés-elemek, nincs saját állapotuk. A bennük lévő gomb, kártya és mező
állapotait a már meglévő DS-elemek adják.

## 5. Szélső esetek

- Nagyon hosszú cím 320 px-en (nem lóghat ki, el kell törnie).
- `bc-lead` 62 karakternél hosszabb sor (a `max-width` tartsa).
- `bc-grid-3` két elemmel (ne nyúljon szét az első kettő).
- `bc-sec.is-ink` belsejében `bc-card`: a kártya szövege maradjon sötét a világos lapon.
  *(Ez a hiba a CsicsergŐsz protóban élesben előjött: a barna sávon a krém kártyák szövege is krém lett.)*
- Egymás utáni két `bc-sec` azonos háttérrel: ne duplázódjon a térköz.

## 6. API

Csak CSS-osztályok, Webflow-ban. React-oldali megfelelő nem kell: a `termek/css/` nem kap belőlük,
amíg nincs második fogyasztó. Ha az admin vagy a partner-felület is kér marketing-oldalt, akkor
kerülnek át `termek/css/bc-sec.css` néven.

## 7. Mérés

A `tools/web-ellenor.js` már ellenőrzi mindet: a tipográfiát (idegen betűcsalád, 12 px alatti
szöveg), a szerkezetet (egy h1, nincs címsor-ugrás), a kilógást 320 px-en, és azt, hogy a használt
szín a DS palettájából való-e.

## 8. Döntés

- [ ] Jóváhagyva · dátum: … · Kristóf
- [ ] Módosítással: …
- [ ] Elvetve, mert: …
