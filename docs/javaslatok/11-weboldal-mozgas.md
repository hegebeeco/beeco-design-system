# Javaslat 11 – mozgás és személyiség a nyilvános weboldalon

*Állapot: **javaslat** · készítette: Claude · dátum: 2026-10-02*

## 1. Igény

Kristóf kérése: „Animációk méhecskékkel, legyen humoros és játékos az oldal", plusz hátterek és
fényképek. A weboldal ma statikus: a draft egyetlen mozgása a beúszás és egy **végtelenül lebegő**
méhecske a hero-ban.

## 2. A feszültség, amit nevesíteni kell

A beeco.hu 2026-10-01 óta a **termékbőrt** kapja, mert az a visszafogott, sűrű vonal. A „legyen
játékos mindenhol" ezzel szembe megy. Egy letöltésre hívó oldalnál ez nem ízlés kérdése: a
folyamatosan mozgó felület **kevésbé tűnik megbízhatónak**, pont az ellenkezőjét éri el, mint amit
akarunk. A `bc-motion.css` ezt már ki is mondja: *„végtelen mozgás nincs"*.

**A javaslat ezért nem az, hogy kevesebb személyiség legyen, hanem hogy máshol legyen:**

| Hol | Mit |
|---|---|
| **Szöveg** | Itt lakik a humor. Olcsó, jól működik, nem kerül akadálymentességbe, és nem lassít |
| **Mozgás** | Néhány *megszolgált* pillanat: megérkezés, siker, mérföldkő. Nem háttérzaj |
| **Háttér** | A méhsejt-minta mint textúra (`bc-honeycomb`), nem animáció |
| **Fénykép** | A termékbőr kerete és kemény árnyéka a képen is; szöveg sosem a képen ül |

## 3. Konkrét elemek

Új, web-only (`termek/css/bc-web.css`):

- `bc-web-erkezes` – a hero méhecskéje **egyszer** berepül (560 ms, `ease-bounce`), aztán megáll.
  **Ez váltja ki a mostani végtelen lebegést**, ami a DS saját szabályát sérti.
- `bc-web-zum` – a gomb melletti méhecske **kétszer** rezdül rámutatásra, egérrel. A már meglévő,
  de eddig gazdátlan `bc-buzz` keyframe kap szerepet. A döntés pillanatában, nem végig.
- `bc-sticker` (+ `is-in`) – ferde címke, ami odacsapódik a DS `bc-stamp` keyframe-jével.
  Oldalanként 1-2 darab, különben elvész a hatás.
- `bc-web-in` (+ `is-in`) – szekció-beúszás: 8 px, 340 ms, soronként 60 ms késéssel.
  A mostani 16 px / 450 ms lassúnak érződik.
- `bc-figure.is-framed` / `.is-tilt` – fénykép kerettel, kemény árnyékkal, enyhén döntve.

Változatlanul átvéve a DS-ből: `bc-anim-cheer`, `bc-anim-tick`, `bc-anim-stamp`, `bc-anim-shake`,
`bc-stagger`, `bc-lift`, `bc-hexload`, `bc-honeycomb` (évszakos díszítéssel).

## 4. Hogyan jut el a Webflow-ba

A Webflow-stílus nem tud `@keyframes`-t, pszeudoelemet és maszkot, ezért ezek az oldal fej-kódjába
kerülnek. **Nem kézzel másolva:** a `tools/webflow-build.js` a DS saját CSS-éből generálja a
`dist/weboldal/beeco-web.min.css`-t, és átírja a változóneveket a Webflow alakjára. A Webflow mezője
kb. 10 000 karakter, a kimenet 7 900 – a `tests/check-weboldal.js` őrzi, hogy elférjen.

## 5. Szélső esetek

- Csökkentett mozgás: az érkezés és a pecsét elmarad, a beúszás áttűnésre csupaszodik.
- Érintőképernyő: a zümmögés nem indul (nincs rámutatás), és nem is kell.
- Lassú gép: a beúszás `transform` és `opacity`, más nem animál.
- Egy képernyőn két mozgó elem: kerülendő, a beúszás késleltetése ezért sorrendi, nem egyszerre.
- A méhsejt-háttér sötét módban is jó: a maszk színét a méz szerep adja.

## 6. Mérés

A `tools/web-ellenor.js` már nézi: 400 ms feletti átmenet, `ease-in` görbe, és **végtelen animáció
csökkentett mozgásnál**. A `beeco-web.min.css` méretét és frissességét a `check-weboldal.js` őrzi.

## 7. Döntés

- [ ] Jóváhagyva · dátum: … · Kristóf
- [ ] Módosítással: …
- [ ] Elvetve, mert: …
