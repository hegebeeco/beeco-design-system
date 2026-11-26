# Pontozási szabályok (a `node scripts/audit.mjs --rubric` kimenete, v3)

Minden terület 100 ponttal indul; a leletek levonása a jelentésben is látszik. Terület-pont = max(0, 100 − Σ levonás). Összpont = Σ (terület-pont × súly). Sáv: A ≥ 90 · B ≥ 75 · C ≥ 60 · D < 60. HTTP 4xx/5xx oldalon az összpont legfeljebb 40.
Súlyosság: P0 az oldal nem teljesíti a célját · P1 konverziót/jogot/mérést ront · P2 rendszer- vagy vizuális eltérés · P3 csiszolás.
A „CLS” csak a Vizuál és UX-ben pontoz (a Teljesítményben mérőszámként szerepel), hogy ne vonjuk le kétszer.

## Súlyok (v3)
| Terület | v2 | **v3** |
|---|---|---|
| Design system és natív építés | 20 % | **15 %** |
| Linkek és gombok | 15 % | **10 %** |
| Érthetőség és tartalom | 20 % | **15 %** |
| Vizuál és UX (render, akadálymentesség, QA-mátrix) | 15 % | **10 %** |
| Teljesítmény | 10 % | **10 %** |
| SEO | 10 % | **10 %** |
| Jog és bizalom | 10 % | **10 %** |
| **Mérés és marketing-analitika** (új) | – | **10 %** |
| **UX és felhasználói út** (új) | – | **10 %** |
| Összesen | 100 % | **100 %** |

Figyelem: az új súlyok és dimenziók miatt a v2 és v3 összpontja **nem összevethető**; régi `--compare` fájllal a jelentés az új dimenzióknál „új dimenzió”-t ír. A `audit.json` `weights` mezője az aktuális súlyokat tartalmazza, a `version` mező: 3.0.0.

## Élesítési kapu (`--gate`, alapból be)
Egy oldal PASS, ha **összpont ≥ 85**, **nincs P0**, és **nincs P1** – kivéve a `reference/kivetelek.json`-ban engedélyezett, le nem járt bejegyzések (`{path | "*", key, ok_reason, until}`; a `key` előtagra is illik, pl. `measure.cta-silent`). Kilépési kód: 0 mind PASS · 3 bármelyik FAIL. A P0 és a küszöb nem kivételezhető.

| Dimenzió | Szabály | Levonás |
|---|---|---|
| Design system és natív építés (15 %) | A DS-osztályt hordozó elemek aránya (ds-/fs-/bc-/menu-/lablec-/cs-/cs2-) a DS + régi osztályú elemekhez képest | −(1−arány)×55; P2 ha arány < 60 %, különben P3 |
| Design system és natív építés (15 %) | .w-embed blokk | −2 / db, max −12 (1 db: P3, több: P2) |
| Design system és natív építés (15 %) | <style> a body-ban | −3 / db, max −9 (P2) |
| Design system és natív építés (15 %) | Elem inline style= attribútummal (Webflow-interakció nélkül) | −0,5 / db, max −10 (≤ 5 db: nincs lelet; ≤ 20: P3; felette P2) |
| Design system és natív építés (15 %) | Oldalfej egyedi <style> / idegen <link rel=stylesheet> | −4 / db, max −12 (P2) |
| Linkek és gombok (10 %) | Belső link 4xx/5xx/nem elérhető | −12 / link, max −40 (P1) |
| Linkek és gombok (10 %) | Nem létező #horgony | −8 / db, max −24 (P1) |
| Linkek és gombok (10 %) | Üres vagy „#” href | −3 / db, max −9 (P2) |
| Linkek és gombok (10 %) | Belső link átirányítás-lánca ≥ 2 lépés / 1 lépés | −2 / db max −6 (P2) · −0,5 / db max −3 (P3) |
| Linkek és gombok (10 %) | Külső link 4xx/5xx (HEAD, 10 mp; közösségi oldalak kihagyva) | −5 / link, max −15 (P2); időtúllépés: −1, max −3 (P3) |
| Linkek és gombok (10 %) | mailto: elsődleges CTA-ként | −8 (P2) |
| Linkek és gombok (10 %) | Nincs elsődleges CTA a hajtás fölött | mobil −15 (P1), asztali −8 (P2) |
| Linkek és gombok (10 %) | Általános gombfelirat („Kattints ide”, „Tovább”, „Részletek”, „Button”…) | −3 / felirat, max −12 (P2) |
| Linkek és gombok (10 %) | Azonos CTA-felirat, eltérő cél | −4 / felirat, max −12 (P2) |
| Érthetőség és tartalom (15 %) | H1: nincs / több mint egy | −25 (P1) / −10 (P1); > 70 karakteres H1: −3 (P3) |
| Érthetőség és tartalom (15 %) | Címsor-hierarchia ugrás (pl. h2→h4) | −5 / ugrás, max −15 (P2) |
| Érthetőség és tartalom (15 %) | Mondathossz: átlag > 20 szó / > 25 szavas mondatok aránya > 15 % | −5 / túllépett szó, max −20 · −0,6 / %-pont, max −15 (P2) |
| Érthetőség és tartalom (15 %) | Helyőrző szöveg (Lorem, Heading, Button, kidolgozás alatt…) | −12 / szöveg, max −36 (P1) |
| Érthetőség és tartalom (15 %) | Angol Webflow-alapüzenet magyar oldalon (Thank you!/Oops!, Submit, Please wait…) | −4 / üzenet, max −12 (P2) |
| Érthetőség és tartalom (15 %) | Gondolatjel „—” (a házstílus tiltja) | −(2 + db), max −12 (P2) |
| Érthetőség és tartalom (15 %) | Tiltólista-elírás (reference/tiltolista.json) | P1 −8 · P2 −4 · P3 −1,5 / találat, dimenziónként max −30 |
| Érthetőség és tartalom (15 %) | Ismétlődő szó („a a”, „számára számára”) | −1,5 / db, max −6 (P3) |
| Érthetőség és tartalom (15 %) | Szó szerint ismétlődő bekezdés ugyanazon az oldalon | −3 / db, max −9 (P2) |
| Érthetőség és tartalom (15 %) | Szám forrás nélkül (kézi ellenőrzéshez) | −1 / db, max −8 (P3) |
| Érthetőség és tartalom (15 %) | Forrás nélküli felsőfok / egyediség-állítás | −2 / db, max −10 (P3) |
| Vizuál és UX (10 %) | Kontraszthiba (WCAG AA) | −(4 + db), max −18 (P1) |
| Vizuál és UX (10 %) | Vízszintes kilógás 320/390/asztali nézeten | −15 (P1) |
| Vizuál és UX (10 %) | Név nélküli vezérlő / billentyűzettel nem elérhető kattintható elem | −3 / db, max −10 / típus (P1) |
| Vizuál és UX (10 %) | Érintési felület < 44 px (mobil) | −(2 + 0,3×db), max −10 (P2) |
| Vizuál és UX (10 %) | 11 px alatti szöveg / csökkentett mozgásnál futó végtelen animáció / konzolhiba | P3 −(0,5×db, max −4) · P2 −3 · P2 −3 |
| Vizuál és UX (10 %) | Felugró réteg takarja a hajtást betöltéskor (landing_review) | −10 (P1) |
| Vizuál és UX (10 %) | Görgetés után is rejtve maradt animált elem | −8 (P1) |
| Vizuál és UX (10 %) | Törött kép | −6 / db, max −18 (P1) |
| Vizuál és UX (10 %) | CLS > 0,1 / > 0,25 | −10 (P2) / −20 (P1) |
| Vizuál és UX (10 %) | Kép > 300 kB | −3 / db, max −15 (P2) |
| Vizuál és UX (10 %) | Nem WebP/AVIF/SVG kép (> 8 kB) | −1 / db, max −8 (P3) |
| Vizuál és UX (10 %) | Kép alt attribútum nélkül (látható) | −2 / db, max −10 (P2) |
| Vizuál és UX (10 %) | **Kötelező alt (2026-11-04):** linkben egyedül álló kép üres alttal (`visual.img-link-no-name`) | −2 / db, max −10 (**P1**, a kaput megállítja) |
| Vizuál és UX (10 %) | Semmitmondó alt: „Company logo”, „kép”, fájlnév (`visual.img-generic-alt`) | −2 / db, max −8 (P2) |
| Vizuál és UX (10 %) | Nagy (≥ 280×160) fotó díszképnek jelölve, nem linkben (`visual.img-big-decorative`) | −1 / db, max −3 (P3, kézi átnézésre) |
| Vizuál és UX (10 %) | Fókuszkeret nem látszik (Tab-bal 8 elem, ≥ 50 % keret nélkül) | −8 (P2) |
| Teljesítmény (10 %) | LCP (mobil, 4× CPU-lassítás): > 2,5 s / > 4 s | −10 (P2) / −25 (P1) |
| Teljesítmény (10 %) | Hosszú feladatok összege (TBT-közelítés): > 200 ms / > 600 ms | −8 / −18 (P2) |
| Teljesítmény (10 %) | Letöltött adat: > 1,5 MB / > 3 MB | −8 (P2) / −15 (P2) |
| Teljesítmény (10 %) | Kérések száma: > 60 / > 100 | −4 / −8 (P3) |
| Teljesítmény (10 %) | Harmadik fél gazdagépek: > 6 db | −2 / db a 6. felett, max −10 (P3) |
| Teljesítmény (10 %) | Renderelést blokkoló szinkron script a <head>-ben | −2 / db, max −8 (P3) |
| SEO (10 %) | Az oldal HTTP 4xx/5xx | −100 (P0); a végpontszám legfeljebb 40 |
| SEO (10 %) | noindex (meta vagy X-Robots-Tag) | −60 (P0) |
| SEO (10 %) | Title hiányzik / hossza nem 30–65 | −20 (P1) / −4 (P3) |
| SEO (10 %) | Meta description hiányzik / hossza nem 70–160 | −15 (P1) / −4 (P3) |
| SEO (10 %) | Canonical hiányzik / más URL-re mutat | −10 (P1) / −5 (P2) |
| SEO (10 %) | og:image / og:title / og:description hiányzik | −8 (P1) / −3 / −3 (P2) |
| SEO (10 %) | html lang hiányzik / nem hu (az /en kivételével) | −8 (P1) / −3 (P3) |
| SEO (10 %) | JSON-LD nincs / hibás; Breadcrumb aloldalon | −5 (P2) / −10 (P1); −4 (P3) |
| SEO (10 %) | hreflang hiányzik az /en oldalon | −6 (P2) |
| Jog és bizalom (10 %) | Nincs impresszum / adatkezelési link (láblécben) | −15 (P1) / −20 (P1); nem a láblécben: −4 (P3) |
| Jog és bizalom (10 %) | Személyes adatot kérő űrlap adatkezelési link/hozzájárulás nélkül | −12 / űrlap, max −24 (P1) |
| Jog és bizalom (10 %) | Süti betöltéskor, hozzájárulás előtt (nyomkövető: _ga, _clck, _fbp…) | −12 (P1); ha nincs is hozzájárulási sáv: −16 |
| Jog és bizalom (10 %) | Nincs hozzájárulás-kezelő, de mérőkód fut | −15 (P1) |
| Jog és bizalom (10 %) | Ft-ár „ÁFA” jelzés nélkül | −6 / ár, max −24 (B2B-oldalon P1, egyébként P2) |
| Jog és bizalom (10 %) | B2B-oldalon nincs partnerlogó-sáv / vélemény | −8 / −5 (P2) |
| Jog és bizalom (10 %) | `--consent`: nincs sütisáv (ha a régi süti-leletek nem vontak le már) | −12 (P1) |
| Jog és bizalom (10 %) | `--consent`: hozzájárulás előtt fut követés (tiltott süti vagy kérés) | −12, max −24 (P1) |
| Jog és bizalom (10 %) | `--consent`: „Elutasítom” után is tiltott süti / kérés (_ga*, _gcl*, _fbp, _clck/_clsk, MUID; GA/GTM collect, connect.facebook, clarity.ms/collect) | −10 / tétel, max −30 (P1) |
| Jog és bizalom (10 %) | `--consent`: nincs „Elutasítom” gomb az első rétegen | −6 (P2) |
| Teljesítmény (10 %) | `--field`: valós LCP > 2,5 s / > 4 s (Clarity) | −8 (P2) / −18 (P1) |
| Teljesítmény (10 %) | `--field`: valós INP > 200 ms / > 500 ms (Clarity) | −8 (P2) / −20 (P1) |
| Vizuál és UX (10 %) | `--field`: valós CLS > 0,1 / > 0,25 (Clarity) | −8 (P2) / −15 (P1) |
| Vizuál és UX (10 %) | `--field`: dühös kattintás (rage click) > 0 / halott kattintás > 0 | −(2 + 0,5×db), max −8 (P2) · −1 (P3) |
| SEO (10 %) | `--search`: ≥ 500 megjelenés, CTR < 1 % (írd át a title/description-t) | −6 (P2) |
| SEO (10 %) | `--search`: átlagos pozíció 5–15 és > 100 megjelenés (közel az első oldalhoz) | −3 (P2) |
| SEO (10 %) | `--search`: munkamenet > 20 %-kal csökkent az előző időszakhoz képest (GA4, előző ≥ 20) | −10 (P1) |
| SEO (10 %) | `--search`: 0 GSC-megjelenés 28 napon át, indexelhető oldalon | −8 (P2) |
| SEO (10 %) | `--webflow`: noindex a Webflow-ban, és az oldal a sitemapben van | −60 (P0; ha a live noindex-et már levontuk: 0) |
| Linkek és gombok (10 %) | `--webflow`: link piszkozat (draft) vagy „-regi/-draft” végű oldalra | −12 / cél, max −36 (P1) |
| Design system és natív építés (15 %) | `--webflow`: oldalszintű CSS/JS a fejkódban | −(1 + hossz/2000), max −4 (P3) |
| SEO (10 %) | `--webflow`: draft jelölésű oldal élőben is elérhető | −8 (P2) |
| Mérés és marketing-analitika (10 %) | Nincs GA4-címke / betöltött, de nem inicializált GA4 | −40 (P1) / −25 (P1) |
| Mérés és marketing-analitika (10 %) | Nincs Clarity / Clarity betöltve, de nem küld | −15 (P2) / 0 (P3, tájékoztató) |
| Mérés és marketing-analitika (10 %) | Search Console: nincs google-site-verification meta (a DNS-es igazolás nem látható: kézzel ellenőrizd) | −2 (P3) |
| Mérés és marketing-analitika (10 %) | Nincs Consent Mode alapértelmezés a GA4 előtt / a config UTÁN fut | −15 (P1) / −10 (P1) |
| Mérés és marketing-analitika (10 %) | CTA-kattintás nem küld eseményt 500 ms-en belül (szimulálva, navigáció letiltva): kulcs-CTA (hero fő CTA, áruházi/letöltés/ajánlat, kapcsolat mailto/tel) / egyéb / közösségi link | −12 / CTA, max −36 (P1) · −4, max −24 (P2) · −1, max −4 (P3) |
| Mérés és marketing-analitika (10 %) | Görgetésmélység-esemény nincs (hosszú oldalon) | −3 (P3) |
| Mérés és marketing-analitika (10 %) | Űrlap-beküldés nem mért (nincs küldés-mérési horog): B2B-oldalon / máshol | −15 / űrlap (P1) · −8 (P2), max −30 |
| Mérés és marketing-analitika (10 %) | Belső link utm_ paraméterrel | −4 / link, max −16 (P2) |
| Mérés és marketing-analitika (10 %) | Áruházi link forgalom-forrás jelölés nélkül (ct= / referrer=) | −2 / link, max −4 (P3) |
| Mérés és marketing-analitika (10 %) | Esemény-név nem snake_case / > 40 karakter | −2 / név, max −8 (P3) |
| UX és felhasználói út (10 %) | Első benyomás (390 és 1440): nincs H1 a hajtás fölött / nincs értékajánlat-mondat (≥ 8 szó) / nincs CTA / nincs kép | −8 (P1) / −5 mobilon, −3 asztalin (P2/P3) / −6 (P2) / −3 (P3) |
| UX és felhasználói út (10 %) | CTA-hierarchia a hero-ban: nincs elsődleges / több egyforma kiemelt / több mint 2 CTA | −5 / −6 / −5 (P2) |
| UX és felhasználói út (10 %) | CTA-felirat nem igés vagy > 4 szó | −1,5 / felirat, max −6 (P3) |
| UX és felhasználói út (10 %) | Űrlap: nincs siker-üzenet (.w-form-done) / nincs hibaüzenet / nem magyar üzenet | −10 (P1) / −4 (P2) / −4 (P2) |
| UX és felhasználói út (10 %) | Űrlap: címke nélküli mező / csak placeholder / csak aria-label | −8 (P1) / −5 (P2) / −2 (P3) |
| UX és felhasználói út (10 %) | Űrlap: nincs kötelező mező / > 8 látható mező / rossz mezőtípus / hiányzó autocomplete / gyanús maxlength | −4 / −5 / −3 (P2) · −2 / −1 (P3), űrlapokra összesen max −30 |
| UX és felhasználói út (10 %) | Bizalom az űrlap közelében: nincs logó/vélemény/garancia/adatkezelési jegyzet / csak a jegyzet | −5 (P2) / −2 (P3) |
| UX és felhasználói út (10 %) | Nincs „Ugrás a tartalomra” link / menüben nincs aktív állapot / aloldalon nincs morzsamenü | −4 (P2) / −2 (P3) / −3 (P3) |
| UX és felhasználói út (10 %) | Láblécben nincs kapcsolat-link / terméklapon nincs GYIK-hivatkozás | −5 (P2) / −3 (P3) |
| UX és felhasználói út (10 %) | Angol felületi szöveg magyar oldalon | −3 / szöveg, max −9 (P2) |
| UX és felhasználói út (10 %) | Túl sok szekció (> 14) / hosszú oldal (> 2200 szó) / ismétlődő címsor / sokféle gombstílus | −2 (P3) · −2 (P3) · −1,5 (P3) · −2 (P3) |
| UX és felhasználói út (10 %) | Magázó/hivatalos fordulat (Ön, kérjük, amennyiben…) nem-jogi oldalon | −3 / kifejezés, max −9 (P2) |
| UX és felhasználói út (10 %) | Főnévi stílus B2B oldalon (≥ 8 -ás/-és szó / 100 szó) | −2 (P3) |
| UX és felhasználói út (10 %) | Mobil törzsszöveg < 16 px / asztali sorhossz > 90 karakter / nincs hüvelykujjal elérhető CTA mobilon | −5 vagy −2 (P2/P3) · −2 (P3) · −3 (P3) |
| UX és felhasználói út (10 %) | QA: Enter a hero-CTA-n nem aktivál / felugró réteg és mobil menü Esc-re nem záródik / mobil menü nem nyit / 200 %-os nagyításnál a menü nem használható | −5 (P2) / −5, −2 / −6 (P2) / −10 (P1) |
| UX és felhasználói út (10 %) | Szándékosan egyszerűsített fejléc (landing): asztalon sincs menü, a felső főoldal-link nagyítva is látható (`ux.zoom-nav-landing`, 2026-11-04) | −1 (P3, nem P1) |
| Vizuál és UX (10 %) | QA nézetméret-mátrix (320/390/768/1024/1440/1920): vízszintes kilógás (ha a ui_audit nem jelezte) / kivágott szöveg / takaró rögzített elemek / érintési cél < 24 px | −15 (P1) / −3 nézetenként, max −9 (P2) / −4 (P2) / −3 / db, max −9 (P1) |
| Vizuál és UX (10 %) | QA axe-core (WCAG 2.x A/AA): critical+serious / moderate / minor (a ui_audit leleteivel deduplikálva) | −5 / szabály, max −20 (P1) · −2, max −8 (P2) · −0,5, max −3 (P3) |
| Vizuál és UX (10 %) | QA billentyűzet (Tab ×40): csapda / a fókusz > 25 %-nál nem látszik | −10 (P1) / −6 (P2) |
| Vizuál és UX (10 %) | QA módok: sötét sémában új láthatatlan szöveg / új gyenge kontraszt | −(4 + db), max −12 (P1) / −(2 + db), max −8 (P2) |
| Vizuál és UX (10 %) | QA módok: csökkentett mozgásnál a látható szöveg < 90 % / JS nélkül < 60 % (P1) vagy < 85 % (P2) / 200 %-nál kilógás | −12 (P1) · −14 / −6 · −10 (P1) |
| Vizuál és UX (10 %) | QA böngészők (webkit, firefox, ha telepítve): kilógás / JS-hiba / nincs H1 (nem telepített böngészőnél: „nem mérve”) | −10, max −20 (P1) / −3 (P2) / −4 (P2), max −12 |
| Vizuál és UX (10 %) | Konzol: JS-hiba / első fél JS-, CSS-, betűtípus-erőforrás 4xx-5xx / egyéb hibás válasz | −3 (P2) / −6 / db, max −12 (P1) / −2, max −6 (P2) |
| Teljesítmény (10 %) | QA lassú 4G (1,6 Mbit/s, 150 ms RTT, 4× CPU, 390 px): a hero (H1) > 4 s / > 8 s; LCP > 4 s / > 8 s | −6 (P2) / −12 (P1, Vizuál) · −6 (P2) / −12 (P1) |
| Teljesítmény (10 %) | Az LCP-elem `<img loading="lazy">` (a mért LCP-csomópont attribútuma; mobil 4× CPU és asztali nézet) | −12 (P1) `perf.lcp-lazy` |
| Vizuál és UX (10 %) | Túlméretes kép: természetes szélesség > 2 × (megjelenített CSS-szélesség × dpr) és > 50 kB | −2 / kép, max −8 (P2) `visual.oversized-image|<fájl>` |
| Vizuál és UX (10 %) | Tartalmi raszterkép width/height és CSS aspect-ratio nélkül, a magasság a képből adódik (CLS-kockázat) | −0,5 / kép, max −4 (P3) `visual.img-no-dimensions` |
| Teljesítmény (10 %) | Képek összsúlya a legnagyobb nézeten > 1 MB | −6 (P2) `perf.image-weight` |
| Vizuál és UX (10 %) | Nagy (> 100 kB) JPEG/PNG kép (WebP/AVIF helyett) | −1 / kép, max −4 (P3) `visual.legacy-format|<fájl>` |
| Teljesítmény (10 %) | Terepi adat (CrUX, mobil, p75; URL-szint, ennek hiányában origin-szint; `CRUX_API_KEY`): LCP > 2,5 s / > 4 s · INP > 200 / > 500 ms · CLS > 0,1 / > 0,25 | javítandó −6 (P2) · rossz −15 (P1) metrikánként; origin-szintű adatnál egy lépéssel enyhébb (P3 / P2), összesen max −25 `perf.field-lcp|inp|cls` |
| Teljesítmény (10 %) | Harmadik fél gazda: > 150 kB vagy > 150 ms főszál-idő (mobil, 4× CPU, hozzájárulás előtt) | −3 / gazda, max −9 (P2) `perf.third-party|<gazda>` |
| Teljesítmény (10 %) | Stripe-szkript betöltődik a /beebolt, /product, /checkout útvonalakon kívül | −4 (P2) `perf.stripe-outside-shop` |
| Teljesítmény (10 %) | Weboldal-lábnyom > 0,5 g CO2e / megtekintés (Sustainable Web Design v4, első látogatás) | −1 (P3) `perf.carbon` |
| UX és felhasználói út (10 %) | Clarity (`CLARITY_API_TOKEN` vagy `--clarity-file`, ≥ 30 munkamenet): dühös kattintás > 2 % · halott kattintás > 10 % · gyors visszalépés > 15 % · görgetési mélység < 30 % (hosszú oldalon) | −4 / mutató, összesen max −12 (P2) `ux.clarity-rage|dead|quickback|scroll` |
| Önálló szakasz (nem pontozott) | Site-szint: a nem létező oldal nem 404-et ad / nincs benne főoldal-link, kapcsolat vagy keresés (sitemap mód vagy teljes futás) | nem pontoz: külön szakasz; P2 |
| Önálló szakasz (nem pontozott) | CTA-következetesség oldalak között (azonos felirat, eltérő cél) | nem pontoz: külön szakasz; P3 (2 cél) / P2 (≥ 3) |
| Önálló szakasz (nem pontozott) | Élesítési kapu (`--gate`) | PASS, ha összpont ≥ 85, nincs P0, nincs nem engedélyezett P1 (reference/kivetelek.json); kilépési kód 3, ha bármely oldal FAIL |
| Önálló szakasz (nem pontozott) | Oldalak közti ellentmondás (`--consistency`; reference/tenyek.json) | nem pontoz: külön szakasz; P2 (oldalak közt), P1 (jóváhagyott tény ellen) |
| Önálló szakasz (nem pontozott) | Belső linkgráf (`--sitemap`/`--graph`): árva oldal / csak menüből elérhető / hibás vagy átirányított belső link | nem pontoz: külön szakasz; P2 / P3 / P1 |
| Önálló szakasz (nem pontozott) | Megváltozott szakasz (`--compare`: 400 px-es sáv > 2 % eltérés) | nem pontoz; P3, tájékoztató |

A tiltólista (elírások, általános feliratok, helyőrzők) a `tiltolista.json`-ban szerkeszthető; a jóváhagyott tények az ellentmondás-keresőhöz a `tenyek.json`-ban.

## v2: mi pontoz és mi nem
- **Pontozó, kapcsolóhoz kötött leletek** (a táblázat „`--consent` / `--field` / `--search` / `--webflow`” sorai): csak akkor jelennek meg és vonnak le, ha a kapcsolót megadtad; kapcsoló nélkül a pontszám pontosan megegyezik a v1-gyel. A `--consent` „nincs sütisáv” és „hozzájárulás előtt” leletei nem vonnak le másodszor, ha a régi süti-lelet már levont.
- **Nem pontozó szakaszok** (a jelentés külön fejezetei és az `audit.json` mezői): „Ellentmondások oldalak között” (`consistency`), „Belső linkek és árva oldalak” (`graph`), „Megváltozott szakaszok” (`compare[].visual`), a trend. Ezek P-szintet kapnak, de a terület-pontba nem számítanak.
- **Prioritás** (csak `--field`-del): hatás × (0,25 + 0,75 × az oldal munkamenetei / a legtöbb munkamenet). A Top 10 ezzel rendez.
- A `--history` sorban a P0–P3 darabszám az oldalankénti leletekből jön (a nem pontozó szakaszok külön mezőben: `contradictions`, `graph`).

## v3: mi pontoz és mi nem
- **Új dimenziók**: a `measure` (mérés) és az `ux` (felhasználói út) saját leletei; a **QA-kör leletei a megfelelő meglévő dimenzióba** pontoznak (kilógás, kivágott szöveg, axe, billentyűzet, módok, böngészők, konzol → Vizuál és UX; lassú 4G → Teljesítmény; Enter/Esc/menü → UX).
- **Dedup**: ha a `ui_audit` (`--no-reuse` nélkül) már jelezte a kontrasztot, a névtelen vezérlőt, az alt hiányát, a kilógást vagy a kis érintési felületet, az axe-core és a mátrix ugyanazt nem vonja le másodszor (kulcs-alapú `have()`); az axe `bypass` szabályát az UX „ugrólink” lelete fedi.
- **Nem pontozó szakaszok** (v3): „Mérési térkép” (`measureMap`), „CTA-következetesség oldalak között” (`ctaConsistency`), „Site-szintű ellenőrzések” (404) és a kapu (`gate`). A kapu nem pontszám, hanem döntés.
- **Kapcsolótól függő**: `--fast` mellett a mátrix, a böngészők és a módok nem futnak (a hozzájuk tartozó leletek nincsenek, a jelentés „nem mérve”-t ír), ezért a `--fast` pontszám nem hasonlítható a teljes futáséhoz; élesítési döntéshez **teljes** futás kell.
- **Csoport-plafonok**: a CTA-leletek (`ctaP1` 36, `ctaP2` 24, közösségi 4), az űrlap-leletek (30), az axe (P1 20, P2 8, P3 3) és a böngésző-leletek külön plafonnal vannak, hogy egy hibaforrás ne nullázza a dimenziót.

## v3.1: kép-mélyellenőrzés, terepi adat, harmadik fél, Clarity-viselkedés, lábnyom
- **Csak leletek jönnek hozzá**; a kapu logikája (≥ 85 pont, 0 P0, 0 nem engedélyezett P1) változatlan. Új P1 kettő van: `perf.lcp-lazy` és (rossz terepi értéknél) `perf.field-lcp|inp|cls`.
- **Plafonok** (hogy egy terület ne omoljon össze): túlméretes kép −8 összesen, régi formátum −4, nehéz harmadik fél −9, terepi adat (CrUX) −25, Clarity-viselkedés −12; `perf.lcp-lazy` egyszer −12 (több nézeten is csak egy lelet).
- **`perf.lcp-lazy`**: a mért LCP-csomópont (`PerformanceObserver` `element`) `<img>`, és a `loading` attribútuma `lazy` (mobil 4× CPU mérésnél és az asztali nézetnél, a görgetés előtti LCP-vel). Osztálynév nem számít, háttérkép/szöveg LCP nem lelet. A `fetchpriority` a bizonyítékban látszik, de a lazy ettől még lelet.
- **`visual.oversized-image`**: természetes szélesség > 2 × (megjelenített CSS-szélesség × dpr) és letöltött bájt > 50 kB. A mérés dpr = 1, ezért a küszöb a „retina-kész” (2×) méret fölötti képet jelzi. Becsült felesleg = bájt × (1 − (2 × megjelenített szélesség × dpr / természetes szélesség)²). Az SVG és a 20 px-nél keskenyebb kép kimarad.
- **`visual.img-no-dimensions`**: látható, nem a menüben/láblécben lévő raszterkép ≥ 48 px, nincs egyszerre `width` és `height` attribútuma, a számított `aspect-ratio` `auto`, nem abszolút pozíciójú, és a megjelenített arány a természetes arányhoz illik (± 4 %): tehát a magassága a betöltött képből adódik (tipikus CLS-forrás). Rögzített dobozban `object-fit` mellett nem lelet. A Webflow alapból nem ír `width/height` attribútumot, ezért ez a lelet gyakori.
- **`perf.image-weight`**: a legnagyobb nézeten az egyedi képkérések összes átvitt bájtja (a teljes oldal legörgetve) > 1 MB.
- **`visual.legacy-format`**: JPEG/PNG > 100 kB. A régi `visual.not-webp` (> 8 kB, összegző) mellett fut, ezért a levonása kicsi.
- **Terepi adat (CrUX)**: `CRUX_API_KEY` környezeti változóból; `POST chromeuxreport.googleapis.com/v1/records:queryRecord`, `formFactor: PHONE`, előbb `url`, 404 esetén `origin`; p75 LCP/INP/CLS (+FCP, TTFB a jelentésben). Küszöbök: LCP 2,5 / 4 s, INP 200 / 500 ms, CLS 0,1 / 0,25: javítandó = P2, rossz = P1. Az origin-szintű adat (nincs URL-szintű rekord) az egész webhelyre vonatkozik, ezért **egy lépéssel enyhébb**: rossz = P2, javítandó = P3, a cím „origin-szintű adat”-ot ír, így egy webhely-szintű érték nem buktatja minden oldal kapuját; az URL-szintű adat marad P1 / P2. Kulcs nélkül vagy adat nélkül tájékoztató sor, levonás nélkül. Gyorsítótár: `data/cache` (24 óra, gitignore-olt).
- **Harmadik fél költsége**: gazdánként letöltött kB, kérésszám (a teljesítmény-mérés hálózati naplójából) és főszál-idő (külön 4× lassított mobil betöltés CDP CPU-profilerrel, mintavétel 0,5 ms, szkript önidő gazdánként; `--no-trace` kihagyja). Lelet: > 150 kB vagy > 150 ms. A főszál-idő a lassított CPU-n mért érték; az iframe-ek (pl. reCAPTCHA) külön folyamatban futnak, azok ideje nincs benne. A mérés hozzájárulás előtti állapotot ír le. `perf.stripe-outside-shop`: Stripe-gazda a `/beebolt`, `/product`, `/checkout` útvonalakon kívül.
- **Clarity-viselkedés**: ≥ 30 munkamenet esetén dühös kattintás > 2 %, halott kattintás > 10 %, gyors visszalépés > 15 % a munkamenetekből, átlagos görgetési mélység < 30 % (csak hosszú oldalon: az oldal magassága ≥ 3 képernyő). A `--clarity-file` egyszerű alakja: `{ "<url vagy útvonal>": { "sessions", "rageClicks", "deadClicks", "quickBacks", "scrollDepth" } }`, ahol a három kattintás-mutató az ilyen munkamenetek **száma** (vagy `…Pct` néven a %-os aránya), a `scrollDepth` az átlagos mélység %-ban. Az API-alak (`project-live-insights`, `dimension1=URL`, `numOfDays=3`) is jó. A régi `--field` (Clarity MCP, abszolút szám) változatlan, ettől független.
- **Weboldal-lábnyom** (`perf.carbon`, P3, −1): Sustainable Web Design v4 (https://sustainablewebdesign.org/estimating-digital-emissions/; a CO2.js is ezt használja). Letöltött bájt a legnagyobb nézeten, első látogatás, gyorsítótár nélkül, zöld tárhely-korrekció nélkül × 148,2 g CO2e/GB. Együtthatók (kWh/GB, üzemi + beépített): adatközpont 0,055 + 0,012; hálózat 0,059 + 0,013; eszköz 0,080 + 0,081; összesen 0,300 kWh/GB × 494 g/kWh (Ember világátlag) = 148,2 g/GB; 1 GB = 10⁹ bájt. Sávok (https://sustainablewebdesign.org/digital-carbon-ratings/, HTTP Archive 2023 percentilisek): A+ ≤ 0,040 · A ≤ 0,079 · B ≤ 0,145 · C ≤ 0,209 · D ≤ 0,278 · E ≤ 0,359 · F ≥ 0,360 g. A medián weboldal ≈ 2,4 MB ≈ 0,36 g. Lelet, ha > 0,5 g (≈ 3,4 MB, a medián ≈ 1,4-szerese). A szám becslés, nem hitelesített mérés; a képernyőképes környezetben a sender.net blokkolva van, ezért az adat kissé alulbecsülhet.


## Navigáció (kötelező, 2026-11-04 – Kristóf: „a tesztekbe kötelezően”)

Minden mérőfutás része (`lib-nav.mjs`): ha nincs 24 óránál frissebb eredmény, a mérő lefuttatja a teljes webhelyre a bejárást
(`nav-crawl.py`), az elemzést (`nav-analyze.py`) és a valódi kattintástesztet (`nav-journeys.mjs`). Ha nem fut le
(nincs hálózat, python3 vagy Playwright, vagy `--no-nav`), a kapu **FAIL** (`nav.missing`, P1). Friss futás: `--nav-fresh`;
kész eredmény: `--nav <nav-adat.json>`. A látogatói utak listája: `reference/nav-utak.json` (új kulcsoldal = új sor).

**Kattintásteszt** (asztal 1440×900 valós hálózaton; telefon 390×844, hamburgermenü, lassú 4G 1,6 Mbit/s, 150 ms + 4× CPU):
minden út lépésenként végigkattintva (menünél a csoport lenyitása, fülön rejtett linknél a fül is), a sütisávon „Elutasítom”.

| Szabály | Határ | Súlyosság (kulcs) |
|---|---|---|
| A kattintás nem a céloldalra visz, vagy a link nem található | – | P1 `nav.journey-fail\|<cél>` (a kaput megállítja) |
| A céloldal megjelenése (LCP) a kattintás után | asztal ≤ 2,5 s · telefon ≤ 4 s | > cél: P3 · asztal > 4 s / telefon > 6 s: P2 `nav.journey-slow\|d\|m\|<cél>` |
| Mozdulatok telefonon a célig | ≤ 4 | P3 `nav.journey-taps\|<cél>` |
| Telefonon a /letoltes linkje egyenesen az áruházba visz | szándékos (site-kód 2/5) | nem lelet |

**Gomb- és link-szabályok** (oldalanként; a menüt és a láblécet nem számolja; közös plafon a „Linkek” területen −12):

| Szabály | Határ | Súlyosság (kulcs), levonás | Forrás / indok |
|---|---|---|---|
| Gomb az első (hero) szekcióban | ≤ 2 (1 elsődleges + 1 másodlagos) | 3: P3 −1 · ≥ 4: P2 −4 `nav.hero-buttons` | NN/g: egy elsődleges cselekvés nézetenként; Hick-törvény |
| Nincs gomb az első szekcióban (fő oldalon, nem jogi) | ≥ 1 | P3 −1 `nav.hero-no-button` | a látogató ne keresse a következő lépést |
| Gomb egy szekcióban | ≤ 2–3 (kártyarácsnál elfogadható) | > 4: P3 −1 `nav.section-buttons` | versengő gombok elbizonytalanítanak |
| Tartalmi link (nem listaoldalon) | ≤ 60 | > 60: P3 −2 · > 100: P2 −4 `nav.too-many-links` | információtúlterhelés; listaoldal = a belső célok ≥ 60%-a CMS-elem |
| Kimenő link a tartalomban | < 40% és < 6 db | P3 −2 `nav.external-heavy` | a fő út maradjon a beeco-n; forrás/sajtó külön blokkban |
| Ugyanoda mutató link a tartalomban | ≤ 3 | ≥ 4: P3 −1 `nav.duplicate-links\|<cél>` (oldalanként max 2) | kártya + cím + gomb elég; a többi zaj |
| Kattintásmélység a főoldaltól | ≤ 3 | > 3: P2 −3 `nav.deep` | 3 kattintásos ökölszabály (gyakorlati cél) |
| Árva oldal (semmi nem linkel rá) | 0 | fő oldal: P2 −4 · CMS: P3 −2 `nav.orphan` | keresőből sem erős, látogató nem találja |
| Csak menüből és láblécből elérhető fő oldal | 0 | P3 −1 `nav.menu-only` | a látogatók többsége a tartalomban kattint |

**Webhelyszintű** (a kapu összesítőjében; a P1 minden oldal kapuját megállítja):
hibás belső cél P1 `nav.site-broken-links` · átirányító belső cél P2 `nav.site-redirect-links` · árva oldalak P2 `nav.site-orphans` ·
menücsoport > 7 P2 `nav.menu-groups` · menücsoportban > 9 elem P3 `nav.menu-items` · lábléc > 50 link P3 `nav.footer-links`.
A meglévő oldalszintű linkszabályok (hibás/átirányított link, azonos felirat más célra, általános gombfelirat) változatlanok a „Linkek” területen.
