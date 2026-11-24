# beeco.hu új főoldal (2026-11)

Kristóf döntése (2026-11-23): a jóváhagyott prototípus (Javaslat 42, 4/b) váltja a mostani főoldalt.
Cím: „Éljünk ökosabban, együtt, olcsóbban!”; navbar: C · lebegő sáv (előbb csak ezen az oldalon); a beebolt-szekció marad.
Kristóf második köre (2026-11-23): összegző letöltés-szekció a Jutalom után („Légy te a ma ökohőse!”, `#osszegzes`), funkciócímke a lépések telefonjain, árnyékos domb, a menü lenyílója külön dobozban.

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

## Webflow-csapdák (2026-11-23)
- A whtml-beszúrás csak CSS-csonkkal tartja meg az osztályt (`szekciok.json` `css` mezője, `{--fo:1}`).
- A képekről elvész az `id`, a `loading` és a `fetchpriority`; a díszképek a médiatár alt szövegét kapják.
  Ezért: az LCP-kép (`#kepek img.fo-be`) attribútumait `set_attributes`-szal kell beállítani, a díszképek altját üresre.
- A site `body`-ja középre igazító flex oszlop: a `.fo` burkolónak `width:100%` kell (`fo-extra.css`).
- A generált stílusosztályok (`fo-x1`…) már rajta vannak a Webflow-elemeken: a számozást a `stilusok.json` rögzíti, új inline stílus a következő szabad számot kapja. A fájlt ne töröld, különben az új szekció átszámozza a meglévőket.
- Új szekció vagy elem a Webflow-ban: a `szekciok.json` megfelelő `html` + `css` (csonkok) részét kell beszúrni (`data_whtml_builder`), a díszképek altját utána üresre állítani.

## Átállás (Kristóf kattint a Designerben, utána Claude ellenőriz)
1. A `/fooldal-uj` oldal fejléckódjából törölni a `noindex` sort (a megjegyzéssel együtt). **Enélkül a főoldal kiesik a Google-ből.**
2. Page settings → *Set as Home page* az új oldalon.
3. A régi főoldal: új slug (pl. `fooldal-regi`) és piszkozat, hogy ne legyen duplikált tartalom és FAQ JSON-LD.
4. 301: `/fooldal-uj` → `/` (Site settings → Publishing).
5. Éles publikálás (Kristóf).
6. Claude: `meresi-terv-fooldal.json` a `meresi-terv.json` fooldal-sora helyére, `meres-ellenor.mjs` és audit a beeco.hu-n, GA4/Clarity ellenőrzés.
Nyitott site-szintű döntés: a letöltésmérés (5/5-ös szkript) csak a `/letoltes` címet ismeri, a főoldal `/app/letoltes`-re mutat (a régi is).

## Natív Webflow-stílusok (Javaslat 43, 10. elem, 2026-11-23)
- Az egyszerű, egyosztályos szabályok (79 osztály, 530 deklaráció) **natív Webflow-stílusok**: a Designerben hangolhatók.
  A beágyazott CSS (2 embed, a 3. üres) a mozgást, a töréspontokat (`@container`), az összetett kijelölőket és a szkriptből létrejövő elemeket tartja.
- Menete: `python3 epit.py` → `fo-teljes.css`; `python3 nativ.py <osztály-statisztika.json>` → `nativ.json` (mi natív); újra `python3 epit.py` → az embedek már nélküle.
  A `nativ.json` változásakor a Webflow-stílusokat is frissíteni kell (`data_style_tool update_style`), különben eltérés lesz.
- **Ha a Designerben módosítasz egy `fo-` osztályt**, az a forrásban (prototipus.html) nem változik: a következő `epit.py`-futás nem írja felül (a natív deklarációk kimaradnak az embedből), de a prototípus és az oldal eltérhet.

## Teljesítmény (mérve 2026-11-24, Playwright, telefon: lassított 4G + 4× CPU, medián; a Google-címkék mindkét oldalon kiszűrve)
| Változat | FCP | LCP | Letöltés |
|---|---|---|---|
| Mai főoldal (beeco.hu) | 1,7–2,0 s | 1,9–2,0 s | 1513 KB |
| Új főoldal, előtöltés nélkül | 1,8 s | 4,5 s | 1282 KB |
| Új főoldal, CSP + hero-előtöltés (**ez van fent**) | 1,7 s | 2,9 s | 1282 KB |
| Új főoldal, CSP nélkül + előtöltés | 2,7 s | 2,7 s | 1578 KB |
Az LCP-elem a hero telefonképe (`fo-tel-kupon.webp`, 56 KB); a régi hero SVG volt. A fejkód `meta CSP` sora kikapcsolja az előtöltő olvasót,
ezért kell a kézi `<link rel="preload">`. Asztalon nincs különbség (0,3–0,4 s). Továbbjutás: kisebb/AVIF hero-kép (becslés: −0,3–0,5 s).
A tesztcímen a CookieYes nem fut, ezért ott a `gtag.js` (180 KB) hozzájárulás nélkül is betöltődik: nyers mérésnél ezt ki kell szűrni.
