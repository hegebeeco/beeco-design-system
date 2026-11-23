# beeco.hu új főoldal (2026-11)

Kristóf döntése (2026-11-23): a jóváhagyott prototípus (Javaslat 42, 4/b) váltja a mostani főoldalt.
Cím: „Éljünk ökosabban, együtt, olcsóbban!”; navbar: C · lebegő sáv (előbb csak ezen az oldalon); a beebolt-szekció marad.

## Felépítés (ugyanaz a minta, mint a `fooldal-szuperhos` esetén)
- **Webflow-oldal:** `Főoldal 2026-11 (teszt)`, `/fooldal-uj`, page `6b042dd5984a222f9ffd949d` (a főoldal másolata).
  Az átállás: a Designerben *Page settings → Set as Home page* (Kristóf kattint), utána a régi főoldal piszkozat.
- **Jelölés:** natív Webflow-elemek, `fo-` osztályokkal, a `.fo` burkolóban. Forrás: `szekciok.json` (az `epit.py` állítja elő
  a `prototipus.html`-ből). A GYIK a meglévő natív DS-szekció (`#gyik`), nem innen jön.
- **CSS:** `embed/fo-N.html` → az oldal tetején lévő HTML Embedek (`data_element_settings_tool`, kulcs `code`).
  Kézi kiegészítés: `fo-extra.css` (navbar C, `body:has(.fo)`-hoz kötve, így a többi oldalt nem érinti).
- **JS:** `fo.js` a jsDelivr-ről, commit-SHA-ra rögzítve, az oldal láblécében. Mérés: `beeco_*` dataLayer-események
  (funkcio_valasztas, allomas_kattintas, most_fut_kattintas, logo_kattintas, beebolt_kattintas, csapat_csatlakozas,
  ut_valasztas, foto_nezo); az áruház-, horgony- és belső linkeket a site-szintű szkript méri.
- **Képek:** `eszkozok.json` (prototípus-fájlnév → Webflow-médiatár fájl). Új feltöltések a „02 Oldalak / Főoldal” mappában:
  `fo-tel-*` (2026-11-18-i appképernyők), `fo-meh-hos.webp`, `fo-bolt-*.svg`.

## Építés és ellenőrzés
```
python3 epit.py                 # fo.css, embed/, szekciok.json, teszt.html (helyi próbaoldal, nem commitoljuk)
```
A `teszt.html` a valódi Webflow-kimenet közelítése (a navbar és a GYIK helyén egyszerű helyettesítő).
