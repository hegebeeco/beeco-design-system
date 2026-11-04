#!/usr/bin/env node
// beeco-weboldal-audit · audit.mjs – ismételhető, pontozott, többszempontú weboldal-átvizsgálás.
//
//   node audit.mjs <url...> --out <mappa> [--viewports 390x844,1440x900] [--compare <régi mappa vagy audit.json>]
//        [--no-reuse] [--skip-external] [--rubric]
//   v2: [--sitemap <origin> [--limit N] [--concurrency 2]] [--history [fájl.jsonl]] [--trend [trend.html]] [--consistency|--no-consistency]
//        [--field clarity.json] [--search kereses.json] [--webflow webflow.json] [--consent [--consent-pages N]] [--graph] [--cache] [--full] [--facts tenyek.json]
//   v3: [--fast] (nézetméret-mátrix, böngészők, módok kihagyása) · [--gate|--no-gate] (élesítési kapu, kilépési kód 3 ha FAIL) · kilépés: 0 rendben, 1 használati hiba, 2 P0 (--no-gate), 3 kapu FAIL
//   v3.1: kép-mélyellenőrzés (lib-images), CrUX terepi adat + Clarity-viselkedés (lib-realdata; CRUX_API_KEY / CLARITY_API_TOKEN / --clarity-file), harmadik fél költsége CPU-profilerrel (lib-thirdparty; --no-trace kihagyja), weboldal-lábnyom
//       Új dimenziók: Mérés és marketing-analitika (measure), UX és felhasználói út (ux); QA-kör: lib-qa.mjs (mátrix, böngészők, módok, axe, billentyűzet, 404)
//
// Csak olvas: nem küld űrlapot, nem kattint küldő gombra. A sender.net kéréseit blokkolja a képernyőképes
// környezetben (hogy a felugró ablak ne takarjon), a teljesítmény-/süti-mérés viszont blokkolás nélkül fut.
// Kimenet: <out>/audit.json, <out>/report.md, <out>/<oldal>/*.png (hajtás + teljes oldal, mobil + asztali).
// Újrahasznosítja: minosegkapu/scripts/ui_audit.mjs (kontraszt, 44 px, kilógás, billentyűzet) és
// minosegkapu/scripts/landing_review.mjs (felugró réteg, rejtve maradt animáció, törött kép).
// Pontozás: minden dimenzió 100-ról indul, a leleteknél megadott levonással csökken (0-ig). Szabályok: `--rubric`.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import os from 'node:os';
import { statSync } from 'node:fs';
import { extractClaims, findContradictions, consistencyMd } from './lib-consistency.mjs';
import { fetchSitemap, buildGraph, graphMd, pathKey, defaultHistoryPath, readHistory, buildHistoryEntry, appendHistory, trendLines } from './lib-site.mjs';
import { writeTrend } from './trend.mjs';
import { consentTest, consentFindings, consentMd } from './consent.mjs';
import { diffImages, visualMd } from './visual-diff.mjs';
import { loadMap, lookup, fieldFindings, fieldMd, maxSessions, sessionWeight, searchFindings, searchTotals, searchMd, loadWebflow, webflowFindings, webflowMd } from './lib-inputs.mjs';
import { measureTracking, measureFindings, measureMd, eventMap, eventMapMd } from './lib-measure.mjs';
import { uxExtract, uxFindings, uxMd, ctaConsistency, ctaConsistencyMd } from './lib-ux.mjs';
import { qaMatrix, qaBrowsers, qaModes, qaKeyboardAxe, qa404, engines, qaFindings, qaMatrixFindings, qaBrowserFindings, qaModeFindings, qa404Findings, qaMd } from './lib-qa.mjs';
import { loadExceptions, evaluateGate, gateMd, gateConsole } from './lib-gate.mjs';
import { analyzeImages, imageFindings, imagesMd } from './lib-images.mjs';
import { hostSummary, cpuByHost, mergeCpu, thirdPartyFindings, thirdPartyMd, carbonOf, carbonFindings, carbonSiteMd } from './lib-thirdparty.mjs';
import { cruxForPage, cruxFindings, cruxMd, loadClarity, clarityFor, clarityFindings, clarityMd } from './lib-realdata.mjs';
import { ensureNav, navPageFindings, navSiteFindings, navMd } from './lib-nav.mjs';

const execFileP = promisify(execFile);
const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = resolve(HERE, '..');
const require = createRequire(import.meta.url);
const VERSION = '3.0.0';

// ---------------------------------------------------------------- súlyok, sávok
// v3: a súlyok összege 100 (a v2-ben: DS 20 · Linkek 15 · Érthetőség 20 · Vizuál 15 · Teljesítmény 10 · SEO 10 · Jog 10; a két új dimenzió miatt újraosztva)
const DIMS = [
  ['ds', 'Design system és natív építés', 15],
  ['links', 'Linkek és gombok', 10],
  ['content', 'Érthetőség és tartalom', 15],
  ['visual', 'Vizuál és UX', 10],
  ['perf', 'Teljesítmény', 10],
  ['seo', 'SEO', 10],
  ['legal', 'Jog és bizalom', 10],
  ['measure', 'Mérés és marketing-analitika', 10],
  ['ux', 'UX és felhasználói út', 10],
];
const WEIGHT = Object.fromEntries(DIMS.map(([k, , w]) => [k, w]));
const DIMNAME = Object.fromEntries(DIMS.map(([k, n]) => [k, n]));
const band = s => (s >= 90 ? 'A' : s >= 75 ? 'B' : s >= 60 ? 'C' : 'D');
const SEVORD = { P0: 0, P1: 1, P2: 2, P3: 3 };

const RUBRIC = [
  ['ds', 'A DS-osztályt hordozó elemek aránya (ds-/fs-/bc-/menu-/lablec-/cs-/cs2-) a DS + régi osztályú elemekhez képest', '−(1−arány)×55; P2 ha arány < 60 %, különben P3'],
  ['ds', '.w-embed blokk', '−2 / db, max −12 (1 db: P3, több: P2)'],
  ['ds', '<style> a body-ban', '−3 / db, max −9 (P2)'],
  ['ds', 'Elem inline style= attribútummal (Webflow-interakció nélkül)', '−0,5 / db, max −10 (≤ 5 db: nincs lelet; ≤ 20: P3; felette P2)'],
  ['ds', 'Oldalfej egyedi <style> / idegen <link rel=stylesheet>', '−4 / db, max −12 (P2)'],
  ['links', 'Belső link 4xx/5xx/nem elérhető', '−12 / link, max −40 (P1)'],
  ['links', 'Nem létező #horgony', '−8 / db, max −24 (P1)'],
  ['links', 'Üres vagy „#” href', '−3 / db, max −9 (P2)'],
  ['links', 'Belső link átirányítás-lánca ≥ 2 lépés / 1 lépés', '−2 / db max −6 (P2) · −0,5 / db max −3 (P3)'],
  ['links', 'Külső link 4xx/5xx (HEAD, 10 mp; közösségi oldalak kihagyva)', '−5 / link, max −15 (P2); időtúllépés: −1, max −3 (P3)'],
  ['links', 'mailto: elsődleges CTA-ként', '−8 (P2)'],
  ['links', 'Nincs elsődleges CTA a hajtás fölött', 'mobil −15 (P1), asztali −8 (P2)'],
  ['links', 'Általános gombfelirat („Kattints ide”, „Tovább”, „Részletek”, „Button”…)', '−3 / felirat, max −12 (P2)'],
  ['links', 'Azonos CTA-felirat, eltérő cél', '−4 / felirat, max −12 (P2)'],
  ['content', 'H1: nincs / több mint egy', '−25 (P1) / −10 (P1); > 70 karakteres H1: −3 (P3)'],
  ['content', 'Címsor-hierarchia ugrás (pl. h2→h4)', '−5 / ugrás, max −15 (P2)'],
  ['content', 'Mondathossz: átlag > 20 szó / > 25 szavas mondatok aránya > 15 %', '−5 / túllépett szó, max −20 · −0,6 / %-pont, max −15 (P2)'],
  ['content', 'Helyőrző szöveg (Lorem, Heading, Button, kidolgozás alatt…)', '−12 / szöveg, max −36 (P1)'],
  ['content', 'Angol Webflow-alapüzenet magyar oldalon (Thank you!/Oops!, Submit, Please wait…)', '−4 / üzenet, max −12 (P2)'],
  ['content', 'Gondolatjel „—” (a házstílus tiltja)', '−(2 + db), max −12 (P2)'],
  ['content', 'Tiltólista-elírás (reference/tiltolista.json)', 'P1 −8 · P2 −4 · P3 −1,5 / találat, dimenziónként max −30'],
  ['content', 'Ismétlődő szó („a a”, „számára számára”)', '−1,5 / db, max −6 (P3)'],
  ['content', 'Szó szerint ismétlődő bekezdés ugyanazon az oldalon', '−3 / db, max −9 (P2)'],
  ['content', 'Szám forrás nélkül (kézi ellenőrzéshez)', '−1 / db, max −8 (P3)'],
  ['content', 'Forrás nélküli felsőfok / egyediség-állítás', '−2 / db, max −10 (P3)'],
  ['visual', 'Kontraszthiba (WCAG AA)', '−(4 + db), max −18 (P1)'],
  ['visual', 'Vízszintes kilógás 320/390/asztali nézeten', '−15 (P1)'],
  ['visual', 'Név nélküli vezérlő / billentyűzettel nem elérhető kattintható elem', '−3 / db, max −10 / típus (P1)'],
  ['visual', 'Érintési felület < 44 px (mobil)', '−(2 + 0,3×db), max −10 (P2)'],
  ['visual', '11 px alatti szöveg / csökkentett mozgásnál futó végtelen animáció / konzolhiba', 'P3 −(0,5×db, max −4) · P2 −3 · P2 −3'],
  ['visual', 'Felugró réteg takarja a hajtást betöltéskor (landing_review)', '−10 (P1)'],
  ['visual', 'Görgetés után is rejtve maradt animált elem', '−8 (P1)'],
  ['visual', 'Törött kép', '−6 / db, max −18 (P1)'],
  ['visual', 'CLS > 0,1 / > 0,25', '−10 (P2) / −20 (P1)'],
  ['visual', 'Kép > 300 kB', '−3 / db, max −15 (P2)'],
  ['visual', 'Nem WebP/AVIF/SVG kép (> 8 kB)', '−1 / db, max −8 (P3)'],
  ['visual', 'Kép alt attribútum nélkül (látható)', '−2 / db, max −10 (P2)'],
  ['visual', 'Fókuszkeret nem látszik (Tab-bal 8 elem, ≥ 50 % keret nélkül)', '−8 (P2)'],
  ['perf', 'LCP (mobil, 4× CPU-lassítás): > 2,5 s / > 4 s', '−10 (P2) / −25 (P1)'],
  ['perf', 'Hosszú feladatok összege (TBT-közelítés): > 200 ms / > 600 ms', '−8 / −18 (P2)'],
  ['perf', 'Letöltött adat: > 1,5 MB / > 3 MB', '−8 (P2) / −15 (P2)'],
  ['perf', 'Kérések száma: > 60 / > 100', '−4 / −8 (P3)'],
  ['perf', 'Harmadik fél gazdagépek: > 6 db', '−2 / db a 6. felett, max −10 (P3)'],
  ['perf', 'Renderelést blokkoló szinkron script a <head>-ben', '−2 / db, max −8 (P3)'],
  ['seo', 'Az oldal HTTP 4xx/5xx', '−100 (P0); a végpontszám legfeljebb 40'],
  ['seo', 'noindex (meta vagy X-Robots-Tag)', '−60 (P0)'],
  ['seo', 'Title hiányzik / hossza nem 30–65', '−20 (P1) / −4 (P3)'],
  ['seo', 'Meta description hiányzik / hossza nem 70–160', '−15 (P1) / −4 (P3)'],
  ['seo', 'Canonical hiányzik / más URL-re mutat', '−10 (P1) / −5 (P2)'],
  ['seo', 'og:image / og:title / og:description hiányzik', '−8 (P1) / −3 / −3 (P2)'],
  ['seo', 'html lang hiányzik / nem hu (az /en kivételével)', '−8 (P1) / −3 (P3)'],
  ['seo', 'JSON-LD nincs / hibás; Breadcrumb aloldalon', '−5 (P2) / −10 (P1); −4 (P3)'],
  ['seo', 'hreflang hiányzik az /en oldalon', '−6 (P2)'],
  ['legal', 'Nincs impresszum / adatkezelési link (láblécben)', '−15 (P1) / −20 (P1); nem a láblécben: −4 (P3)'],
  ['legal', 'Személyes adatot kérő űrlap adatkezelési link/hozzájárulás nélkül', '−12 / űrlap, max −24 (P1)'],
  ['legal', 'Süti betöltéskor, hozzájárulás előtt (nyomkövető: _ga, _clck, _fbp…)', '−12 (P1); ha nincs is hozzájárulási sáv: −16'],
  ['legal', 'Nincs hozzájárulás-kezelő, de mérőkód fut', '−15 (P1)'],
  ['legal', 'Ft-ár „ÁFA” jelzés nélkül', '−6 / ár, max −24 (B2B-oldalon P1, egyébként P2)'],
  ['legal', 'B2B-oldalon nincs partnerlogó-sáv / vélemény', '−8 / −5 (P2)'],
  // ---- v2: kiegészítő bemenetek és tesztek (csak a megfelelő kapcsolóval pontoznak)
  ['legal', '`--consent`: nincs sütisáv (ha a régi süti-leletek nem vontak le már)', '−12 (P1)'],
  ['legal', '`--consent`: hozzájárulás előtt fut követés (tiltott süti vagy kérés)', '−12, max −24 (P1)'],
  ['legal', '`--consent`: „Elutasítom” után is tiltott süti / kérés (_ga*, _gcl*, _fbp, _clck/_clsk, MUID; GA/GTM collect, connect.facebook, clarity.ms/collect)', '−10 / tétel, max −30 (P1)'],
  ['legal', '`--consent`: nincs „Elutasítom” gomb az első rétegen', '−6 (P2)'],
  ['perf', '`--field`: valós LCP > 2,5 s / > 4 s (Clarity)', '−8 (P2) / −18 (P1)'],
  ['perf', '`--field`: valós INP > 200 ms / > 500 ms (Clarity)', '−8 (P2) / −20 (P1)'],
  ['visual', '`--field`: valós CLS > 0,1 / > 0,25 (Clarity)', '−8 (P2) / −15 (P1)'],
  ['visual', '`--field`: dühös kattintás (rage click) > 0 / halott kattintás > 0', '−(2 + 0,5×db), max −8 (P2) · −1 (P3)'],
  ['seo', '`--search`: ≥ 500 megjelenés, CTR < 1 % (írd át a title/description-t)', '−6 (P2)'],
  ['seo', '`--search`: átlagos pozíció 5–15 és > 100 megjelenés (közel az első oldalhoz)', '−3 (P2)'],
  ['seo', '`--search`: munkamenet > 20 %-kal csökkent az előző időszakhoz képest (GA4, előző ≥ 20)', '−10 (P1)'],
  ['seo', '`--search`: 0 GSC-megjelenés 28 napon át, indexelhető oldalon', '−8 (P2)'],
  ['seo', '`--webflow`: noindex a Webflow-ban, és az oldal a sitemapben van', '−60 (P0; ha a live noindex-et már levontuk: 0)'],
  ['links', '`--webflow`: link piszkozat (draft) vagy „-regi/-draft” végű oldalra', '−12 / cél, max −36 (P1)'],
  ['ds', '`--webflow`: oldalszintű CSS/JS a fejkódban', '−(1 + hossz/2000), max −4 (P3)'],
  ['seo', '`--webflow`: draft jelölésű oldal élőben is elérhető', '−8 (P2)'],
  // ---- v3: mérés (measure)
  ['measure', 'Nincs GA4-címke / betöltött, de nem inicializált GA4', '−40 (P1) / −25 (P1)'],
  ['measure', 'Nincs Clarity / Clarity betöltve, de nem küld', '−15 (P2) / 0 (P3, tájékoztató)'],
  ['measure', 'Search Console: nincs google-site-verification meta (a DNS-es igazolás nem látható: kézzel ellenőrizd)', '−2 (P3)'],
  ['measure', 'Nincs Consent Mode alapértelmezés a GA4 előtt / a config UTÁN fut', '−15 (P1) / −10 (P1)'],
  ['measure', 'CTA-kattintás nem küld eseményt 500 ms-en belül (szimulálva, navigáció letiltva): kulcs-CTA (hero fő CTA, áruházi/letöltés/ajánlat, kapcsolat mailto/tel) / egyéb / közösségi link', '−12 / CTA, max −36 (P1) · −4, max −24 (P2) · −1, max −4 (P3)'],
  ['measure', 'Görgetésmélység-esemény nincs (hosszú oldalon)', '−3 (P3)'],
  ['measure', 'Űrlap-beküldés nem mért (nincs küldés-mérési horog): B2B-oldalon / máshol', '−15 / űrlap (P1) · −8 (P2), max −30'],
  ['measure', 'Belső link utm_ paraméterrel', '−4 / link, max −16 (P2)'],
  ['measure', 'Áruházi link forgalom-forrás jelölés nélkül (ct= / referrer=)', '−2 / link, max −4 (P3)'],
  ['measure', 'Esemény-név nem snake_case / > 40 karakter', '−2 / név, max −8 (P3)'],
  // ---- v3: UX és felhasználói út (ux)
  ['ux', 'Első benyomás (390 és 1440): nincs H1 a hajtás fölött / nincs értékajánlat-mondat (≥ 8 szó) / nincs CTA / nincs kép', '−8 (P1) / −5 mobilon, −3 asztalin (P2/P3) / −6 (P2) / −3 (P3)'],
  ['ux', 'CTA-hierarchia a hero-ban: nincs elsődleges / több egyforma kiemelt / több mint 2 CTA', '−5 / −6 / −5 (P2)'],
  ['ux', 'CTA-felirat nem igés vagy > 4 szó', '−1,5 / felirat, max −6 (P3)'],
  ['ux', 'Űrlap: nincs siker-üzenet (.w-form-done) / nincs hibaüzenet / nem magyar üzenet', '−10 (P1) / −4 (P2) / −4 (P2)'],
  ['ux', 'Űrlap: címke nélküli mező / csak placeholder / csak aria-label', '−8 (P1) / −5 (P2) / −2 (P3)'],
  ['ux', 'Űrlap: nincs kötelező mező / > 8 látható mező / rossz mezőtípus / hiányzó autocomplete / gyanús maxlength', '−4 / −5 / −3 (P2) · −2 / −1 (P3), űrlapokra összesen max −30'],
  ['ux', 'Bizalom az űrlap közelében: nincs logó/vélemény/garancia/adatkezelési jegyzet / csak a jegyzet', '−5 (P2) / −2 (P3)'],
  ['ux', 'Nincs „Ugrás a tartalomra” link / menüben nincs aktív állapot / aloldalon nincs morzsamenü', '−4 (P2) / −2 (P3) / −3 (P3)'],
  ['ux', 'Láblécben nincs kapcsolat-link / terméklapon nincs GYIK-hivatkozás', '−5 (P2) / −3 (P3)'],
  ['ux', 'Angol felületi szöveg magyar oldalon', '−3 / szöveg, max −9 (P2)'],
  ['ux', 'Túl sok szekció (> 14) / hosszú oldal (> 2200 szó) / ismétlődő címsor / sokféle gombstílus', '−2 (P3) · −2 (P3) · −1,5 (P3) · −2 (P3)'],
  ['ux', 'Magázó/hivatalos fordulat (Ön, kérjük, amennyiben…) nem-jogi oldalon', '−3 / kifejezés, max −9 (P2)'],
  ['ux', 'Főnévi stílus B2B oldalon (≥ 8 -ás/-és szó / 100 szó)', '−2 (P3)'],
  ['ux', 'Mobil törzsszöveg < 16 px / asztali sorhossz > 90 karakter / nincs hüvelykujjal elérhető CTA mobilon', '−5 vagy −2 (P2/P3) · −2 (P3) · −3 (P3)'],
  ['ux', 'QA: Enter a hero-CTA-n nem aktivál / felugró réteg és mobil menü Esc-re nem záródik / mobil menü nem nyit / 200 %-os nagyításnál a menü nem használható', '−5 (P2) / −5, −2 / −6 (P2) / −10 (P1)'],
  // ---- v3: QA-kör (a megfelelő dimenzióba pontoz)
  ['visual', 'QA nézetméret-mátrix (320/390/768/1024/1440/1920): vízszintes kilógás (ha a ui_audit nem jelezte) / kivágott szöveg / takaró rögzített elemek / érintési cél < 24 px', '−15 (P1) / −3 nézetenként, max −9 (P2) / −4 (P2) / −3 / db, max −9 (P1)'],
  ['visual', 'QA axe-core (WCAG 2.x A/AA): critical+serious / moderate / minor (a ui_audit leleteivel deduplikálva)', '−5 / szabály, max −20 (P1) · −2, max −8 (P2) · −0,5, max −3 (P3)'],
  ['visual', 'QA billentyűzet (Tab ×40): csapda / a fókusz > 25 %-nál nem látszik', '−10 (P1) / −6 (P2)'],
  ['visual', 'QA módok: sötét sémában új láthatatlan szöveg / új gyenge kontraszt', '−(4 + db), max −12 (P1) / −(2 + db), max −8 (P2)'],
  ['visual', 'QA módok: csökkentett mozgásnál a látható szöveg < 90 % / JS nélkül < 60 % (P1) vagy < 85 % (P2) / 200 %-nál kilógás', '−12 (P1) · −14 / −6 · −10 (P1)'],
  ['visual', 'QA böngészők (webkit, firefox, ha telepítve): kilógás / JS-hiba / nincs H1 (nem telepített böngészőnél: „nem mérve”)', '−10, max −20 (P1) / −3 (P2) / −4 (P2), max −12'],
  ['visual', 'Konzol: JS-hiba / első fél JS-, CSS-, betűtípus-erőforrás 4xx-5xx / egyéb hibás válasz', '−3 (P2) / −6 / db, max −12 (P1) / −2, max −6 (P2)'],
  ['perf', 'QA lassú 4G (1,6 Mbit/s, 150 ms RTT, 4× CPU, 390 px): a hero (H1) > 4 s / > 8 s; LCP > 4 s / > 8 s', '−6 (P2) / −12 (P1, Vizuál) · −6 (P2) / −12 (P1)'],
  // ---- v3.1: kép-mélyellenőrzés, terepi adat (CrUX), harmadik fél, Clarity-viselkedés, lábnyom
  ['perf', 'Az LCP-elem `<img loading="lazy">` (a mért LCP-csomópont attribútuma; mobil 4× CPU és asztali nézet)', '−12 (P1) `perf.lcp-lazy`'],
  ['visual', 'Túlméretes kép: természetes szélesség > 2 × (megjelenített CSS-szélesség × dpr) és > 50 kB', '−2 / kép, max −8 (P2) `visual.oversized-image|<fájl>`'],
  ['visual', 'Tartalmi raszterkép width/height és CSS aspect-ratio nélkül, a magasság a képből adódik (CLS-kockázat)', '−0,5 / kép, max −4 (P3) `visual.img-no-dimensions`'],
  ['perf', 'Képek összsúlya a legnagyobb nézeten > 1 MB', '−6 (P2) `perf.image-weight`'],
  ['visual', 'Nagy (> 100 kB) JPEG/PNG kép (WebP/AVIF helyett)', '−1 / kép, max −4 (P3) `visual.legacy-format|<fájl>`'],
  ['perf', 'Terepi adat (CrUX, mobil, p75; URL-szint, ennek hiányában origin-szint; `CRUX_API_KEY`): LCP > 2,5 s / > 4 s · INP > 200 / > 500 ms · CLS > 0,1 / > 0,25', 'javítandó −6 (P2) · rossz −15 (P1) metrikánként (origin-szintű adatnál egy lépéssel enyhébb: P3 / P2), összesen max −25 `perf.field-lcp|inp|cls`'],
  ['perf', 'Harmadik fél gazda: > 150 kB vagy > 150 ms főszál-idő (mobil, 4× CPU, hozzájárulás előtt)', '−3 / gazda, max −9 (P2) `perf.third-party|<gazda>`'],
  ['perf', 'Stripe-szkript betöltődik a /beebolt, /product, /checkout útvonalakon kívül', '−4 (P2) `perf.stripe-outside-shop`'],
  ['perf', 'Weboldal-lábnyom > 0,5 g CO2e / megtekintés (Sustainable Web Design v4, első látogatás)', '−1 (P3) `perf.carbon`'],
  ['ux', 'Clarity (`CLARITY_API_TOKEN` vagy `--clarity-file`, ≥ 30 munkamenet): dühös kattintás > 2 % · halott kattintás > 10 % · gyors visszalépés > 15 % · görgetési mélység < 30 % (hosszú oldalon)', '−4 / mutató, összesen max −12 (P2) `ux.clarity-rage|dead|quickback|scroll`'],
  ['x', 'Site-szint: a nem létező oldal nem 404-et ad / nincs benne főoldal-link, kapcsolat vagy keresés (sitemap mód vagy teljes futás)', 'nem pontoz: külön szakasz; P2'],
  ['x', 'CTA-következetesség oldalak között (azonos felirat, eltérő cél)', 'nem pontoz: külön szakasz; P3 (2 cél) / P2 (≥ 3)'],
  ['x', 'Élesítési kapu (`--gate`)', 'PASS, ha összpont ≥ 85, nincs P0, nincs nem engedélyezett P1 (reference/kivetelek.json); kilépési kód 3, ha bármely oldal FAIL'],
  ['x', 'Oldalak közti ellentmondás (`--consistency`; reference/tenyek.json)', 'nem pontoz: külön szakasz; P2 (oldalak közt), P1 (jóváhagyott tény ellen)'],
  ['x', 'Belső linkgráf (`--sitemap`/`--graph`): árva oldal / csak menüből elérhető / hibás vagy átirányított belső link', 'nem pontoz: külön szakasz; P2 / P3 / P1'],
  ['x', 'Megváltozott szakasz (`--compare`: 400 px-es sáv > 2 % eltérés)', 'nem pontoz; P3, tájékoztató'],
];
const EXTRA_DIM = { x: 'Önálló szakasz (nem pontozott)' };

// ---------------------------------------------------------------- argumentumok
const argv = process.argv.slice(2);
const opt = { out: null, viewports: '390x844,1440x900', compare: null, reuse: true, external: true, rubric: false, wait: 1200,
  consistency: null, sitemap: null, limit: 0, concurrency: 2, history: undefined, trend: undefined, field: null, search: null, webflow: null, consent: false, consentPages: 0, cache: false, graph: false, facts: null, full: false, fast: false, gate: null, clarityFile: null, trace: true };
const targets = [];
const optVal = i => (i + 1 < argv.length && !argv[i + 1].startsWith('--') && !/^https?:\/\//.test(argv[i + 1]) ? argv[i + 1] : null);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--out') opt.out = argv[++i];
  else if (a === '--sitemap') opt.sitemap = argv[++i];
  else if (a === '--limit') opt.limit = +argv[++i];
  else if (a === '--concurrency') opt.concurrency = Math.max(1, +argv[++i] || 1);
  else if (a === '--history') { const v = optVal(i); if (v) { opt.history = v; i++; } else opt.history = true; }
  else if (a === '--trend') { const v = optVal(i); if (v) { opt.trend = v; i++; } else opt.trend = true; }
  else if (a === '--field') opt.field = argv[++i];
  else if (a === '--search') opt.search = argv[++i];
  else if (a === '--webflow') opt.webflow = argv[++i];
  else if (a === '--facts') opt.facts = argv[++i];
  else if (a === '--clarity-file') opt.clarityFile = argv[++i];
  else if (a === '--nav') opt.navFile = argv[++i];
  else if (a === '--no-nav') opt.nav = false;
  else if (a === '--nav-fresh') opt.navFresh = true;
  else if (a === '--no-trace') opt.trace = false;
  else if (a === '--consent') opt.consent = true;
  else if (a === '--consent-pages') opt.consentPages = +argv[++i];
  else if (a === '--consistency') opt.consistency = true;
  else if (a === '--no-consistency') opt.consistency = false;
  else if (a === '--graph') opt.graph = true;
  else if (a === '--cache') opt.cache = true;
  else if (a === '--full') opt.full = true;
  else if (a === '--fast') opt.fast = true;
  else if (a === '--gate') opt.gate = true;
  else if (a === '--no-gate') opt.gate = false;
  else if (a === '--viewports') opt.viewports = argv[++i];
  else if (a === '--compare') opt.compare = argv[++i];
  else if (a === '--no-reuse') opt.reuse = false;
  else if (a === '--skip-external') opt.external = false;
  else if (a === '--rubric') opt.rubric = true;
  else if (a === '--wait') opt.wait = +argv[++i];
  else targets.push(a);
}
if (opt.rubric) {
  console.log('| Dimenzió | Szabály | Levonás |\n|---|---|---|');
  for (const [d, r, p] of RUBRIC) console.log(`| ${DIMNAME[d] || EXTRA_DIM[d]}${WEIGHT[d] ? ` (${WEIGHT[d]} %)` : ''} | ${r} | ${p} |`);
  process.exit(0);
}
if ((!targets.length && !opt.sitemap) || !opt.out) {
  console.error('Használat: node audit.mjs <url...> --out <mappa> [--viewports 390x844,1440x900] [--compare régi mappa|audit.json] [--no-reuse] [--skip-external]\n  v2: [--sitemap <origin> --limit N --concurrency 2] [--history [fájl]] [--trend [fájl]] [--field f.json] [--search f.json] [--webflow f.json] [--consent] [--cache] [--no-consistency] [--rubric]\n  v3: [--fast] [--gate|--no-gate]\n  v3.1: [--clarity-file f.json] [--no-trace]  (env: CRUX_API_KEY, CLARITY_API_TOKEN)');
  process.exit(1);
}
if (opt.sitemap && !opt.full) opt.reuse = false; // teljes oldal módban a minosegkapu-szkriptek (~1 perc/oldal) alapból kimaradnak; --full bekapcsolja
const OUT = resolve(opt.out);
mkdirSync(OUT, { recursive: true });
const VPS = opt.viewports.split(',').map(v => v.trim().split('x').map(Number));
const MOBILE_VP = VPS.find(v => v[0] < 768) || VPS[0];
const DESKTOP_VP = VPS.find(v => v[0] >= 768) || VPS[VPS.length - 1];

// ---------------------------------------------------------------- Playwright
let pwDir = null;
function loadPlaywright() {
  const tries = [process.env.PLAYWRIGHT_PATH, 'playwright', join(SKILL_DIR, '../../../node_modules/playwright'),
    join(os.homedir(), 'CLAUDE/beeco-ds-fooldal/node_modules/playwright'), join(os.homedir(), 'CLAUDE/beeco-jatek-kit/node_modules/playwright')].filter(Boolean);
  for (const t of tries) {
    try {
      const m = require(t);
      try { pwDir = dirname(require.resolve(t + '/package.json')); } catch { pwDir = existsSync(t) ? t : null; }
      return m;
    } catch {}
  }
  console.error('Nem találom a Playwrightot. Add meg: NODE_PATH=/Users/<te>/CLAUDE/beeco-ds-fooldal/node_modules node audit.mjs … vagy PLAYWRIGHT_PATH=/út/node_modules/playwright');
  process.exit(1);
}
const PW = loadPlaywright(); const { chromium } = PW;
let ENGS_P = null; const getEngines = () => (ENGS_P ||= engines(PW));

const LIST = JSON.parse(readFileSync(join(SKILL_DIR, 'reference/tiltolista.json'), 'utf8'));
const UA_CURL = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 beeco-audit';
const FIRST_PARTY = /(^|\.)beeco\.hu$|website-files\.com$|(^|\.)webflow\.(com|io)$|webflow-files-prod\.global\.ssl\.fastly\.net$|d3e54v103j8qbb\.cloudfront\.net$/;
const TRACKER = /googletagmanager|google-analytics|googleadservices|doubleclick|clarity\.ms|facebook\.(net|com)|hotjar|snap\.licdn|linkedin\.com\/px|tiktok|sender\.net|analytics/i;
const TRACKING_COOKIE = /^(_ga|_gid|_gat|_gcl|_fbp|_fbc|_clck|_clsk|CLID|MUID|ANONCHK|SM|_hj|ajs_|_uetsid|_uetvid|_tt_|_pin_|_dc_gtm)/i;
const SOCIAL_SKIP = /(^|\.)(instagram|facebook|linkedin|tiktok|twitter|x|threads|pinterest)\.com$|(^|\.)(t\.co|wa\.me|fb\.me|m\.me|lnkd\.in|bit\.ly)$/i;
const IS_B2B = u => /cegek|b2b|partner|szolgaltatas|vallalat|ceg-/i.test(new URL(u).pathname);

const slugOf = u => {
  const x = new URL(u);
  const p = x.pathname.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'fooldal';
  return (/^(www\.)?beeco\.hu$/.test(x.hostname) ? '' : x.hostname.replace(/[^a-z0-9]+/gi, '-') + '-') + p;
};
const normUrl = u => { try { const x = new URL(u); return x.origin.replace('://www.', '://') + x.pathname.replace(/\/$/, ''); } catch { return u; } };
const clip = (s, n = 200) => { s = String(s ?? '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const ev = x => clip(Array.isArray(x) ? x.map(y => (typeof y === 'string' ? y : JSON.stringify(y))).join('; ') : x, 320);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---------------------------------------------------------------- v2: bemenetek, sitemap
const loadInput = (flag, f, loader) => { if (!f) return null; try { return loader(resolve(f)); } catch (e) { console.error(`A ${flag} fájl nem olvasható (${f}): ${e.message}`); process.exit(1); } };
const FIELD = loadInput('--field', opt.field, loadMap);
const SEARCH = loadInput('--search', opt.search, loadMap);
const WF = loadInput('--webflow', opt.webflow, loadWebflow);
// v3.1: valós adatok. A kulcs/token csak környezeti változóból jön, és sehova nem kerül kiírásra vagy mentésre.
const CACHE_DIR = join(SKILL_DIR, 'data/cache');
const CRUX_KEY = process.env.CRUX_API_KEY || '';
const CRUX_ORIGINS = new Map();
const CLARITY = await loadClarity({ file: opt.clarityFile ? resolve(opt.clarityFile) : null, token: process.env.CLARITY_API_TOKEN || '', cacheDir: CACHE_DIR });
if (opt.clarityFile && CLARITY.note) { console.error(`A --clarity-file nem olvasható: ${CLARITY.note}`); process.exit(1); }
// kötelező navigációs ellenőrzés (bejárás + gomb/link-szabályok + kattintásteszt); --no-nav esetén a kapu FAIL (nav.missing)
const NAV = opt.nav === false ? { error: 'kikapcsolva (--no-nav)' } : ensureNav(opt.sitemap ? new URL(opt.sitemap).origin : new URL(targets[0]).origin, { skillDir: SKILL_DIR, file: opt.navFile ? resolve(opt.navFile) : null, maxAgeH: opt.navFresh ? 0 : 24 });
if (NAV.error) console.error('A navigációs ellenőrzés nem futott le: ' + NAV.error);
let SITEMAP = null;
if (opt.sitemap) {
  SITEMAP = await fetchSitemap(opt.sitemap, opt.limit);
  if (!SITEMAP.urls.length) { console.error(`A sitemap üres vagy nem olvasható: ${opt.sitemap}/sitemap.xml`); process.exit(1); }
  console.log(`Sitemap: ${SITEMAP.total} URL, bejárom: ${SITEMAP.urls.length} (párhuzamosság: ${opt.concurrency}${opt.reuse ? '' : ', minosegkapu-szkriptek nélkül; --full bekapcsolja'})`);
  for (const u of SITEMAP.urls) if (!targets.includes(u)) targets.push(u);
}
const smCache = new Map(); // origin -> Set(pathKey) | null
async function inSitemap(url) {
  if (SITEMAP) return (SITEMAP.set ||= new Set(SITEMAP.all.map(pathKey))).has(pathKey(url));
  const o = new URL(url).origin; if (!smCache.has(o)) { const r = await fetchSitemap(o, 0); smCache.set(o, r.all.length ? new Set(r.all.map(pathKey)) : null); }
  const set = smCache.get(o); return set ? set.has(pathKey(url)) : null;
}

// ---------------------------------------------------------------- az oldalon futó mérés
function extract(cfg) {
  const DS = new RegExp(cfg.ds), NEU = new RegExp(cfg.neutral), KNOWN = new RegExp(cfg.known, 'i');
  const SKIPTAG = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'BR', 'TEMPLATE', 'LINK', 'META', 'HEAD', 'OPTION']);
  const THIRD = '[class*="cky-"],[class*="sender-"],.w-webflow-badge,[id*="cookie"]';
  const ZONE = 'nav,footer,[class*="menu-"],[class*="lablec"],[class*="cky"],.w-nav,.w-dropdown-list';
  const vis = el => { const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.01; };
  const tx = el => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const clip = (s, n) => { s = String(s ?? '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  const desc = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.classList.length ? '.' + [...el.classList].slice(0, 2).join('.') : '');
  const X = {};
  X.vh = innerHeight; X.vw = document.documentElement.clientWidth;
  X.overflow = Math.max(0, document.scrollingElement.scrollWidth - document.documentElement.clientWidth);

  // ---- 1. DS
  const all = [...document.body.querySelectorAll('*')].filter(e => !SKIPTAG.has(e.tagName) && !e.closest('svg') && !e.closest(THIRD) && vis(e));
  let nDs = 0, nLegacy = 0, nNeutral = 0, nMixed = 0; const legacy = {};
  for (const e of all) {
    const t = [...e.classList]; if (!t.length) { nNeutral++; continue; }
    const ds = t.filter(x => DS.test(x)); const leg = t.filter(x => !DS.test(x) && !NEU.test(x));
    const lay = t.find(x => /^w-layout-/.test(x)); if (lay && !ds.length) leg.push(lay);
    if (ds.length) { nDs++; if (leg.length) nMixed++; } else if (leg.length) nLegacy++; else nNeutral++;
    for (const l of leg) { legacy[l] = legacy[l] || { n: 0, known: KNOWN.test(l) }; legacy[l].n++; }
  }
  X.ds = {
    nDs, nLegacy, nNeutral, nMixed, total: all.length,
    topLegacy: Object.entries(legacy).sort((a, b) => b[1].n - a[1].n).slice(0, 15).map(([c, v]) => ({ cls: c, n: v.n, sablon: v.known })),
  };
  X.embeds = [...document.querySelectorAll('.w-embed')].map(e => ({ el: desc(e.parentElement || e), preview: clip(e.innerHTML, 90) }));
  X.bodyStyles = [...document.body.querySelectorAll('style')].filter(s => !s.closest('svg') && !/cky|sender/i.test(s.textContent.slice(0, 200))).map(s => ({ id: s.id, preview: clip(s.textContent, 70) }));
  const IX = new Set(['opacity', 'transform', 'will-change', 'transition', 'transform-style', 'filter', 'translate', 'display', 'visibility']);
  X.inlineStyle = [...document.body.querySelectorAll('[style]')].filter(e => !e.closest('svg') && !e.closest(THIRD) && !/^(SCRIPT|STYLE)$/.test(e.tagName)).filter(e => {
    const props = (e.getAttribute('style') || '').split(';').map(s => s.split(':')[0].trim().toLowerCase()).filter(Boolean);
    return !(e.hasAttribute('data-w-id') && props.every(p => IX.has(p))) && props.length;
  }).map(e => ({ el: desc(e), style: clip(e.getAttribute('style'), 70) }));
  X.headStyles = [...document.head.querySelectorAll('style')].filter(s => !/w-mod-js|w-mod-ix|cky|cookieyes|sender|wf-force-outline|\[tabindex="-1"\]:focus/i.test(s.textContent.slice(0, 400) + s.id)).map(s => ({ id: s.id, preview: clip(s.textContent, 70) }));
  X.headLinks = [...document.head.querySelectorAll('link[rel=stylesheet]')].map(l => l.href).filter(h => !/website-files\.com|webflow|fonts\.googleapis\.com|cookieyes|cky/i.test(h));
  X.headSyncScripts = [...document.head.querySelectorAll('script[src]')].filter(s => !s.async && !s.defer && s.type !== 'module').map(s => s.src);

  // ---- tartalmi blokkok (nav/lábléc nélkül), szám/ár/felsőfok jelöléssel
  const srcCache = new Map();
  const sectionSourced = s => { if (!srcCache.has(s)) srcCache.set(s, !!s.querySelector('.ds-forras,[class*="forras"]') || (s !== document.body && /forrás/i.test(s.textContent))); return srcCache.get(s); };
  const blocks = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (SKIPTAG.has(el.tagName) || !el.textContent.trim() || el.closest('svg') || el.closest(ZONE) || !vis(el)) continue;
    const cs = getComputedStyle(el); if (cs.display === 'inline') continue;
    if ([...el.children].some(c => c.tagName !== 'BR' && c.textContent.trim() && getComputedStyle(c).display !== 'inline')) continue;
    const txt = tx(el); if (!txt) continue;
    const isHead = /^H[1-6]$/.test(el.tagName) || /(^|-)cim|heading|felcim|cimke/i.test(el.className || '');
    const sec = el.closest('section,[class*="szekcio"]') || document.body;
    const sourced = sectionSourced(sec) || /forrás|szerint|\bKSH\b|Eurostat|\*|mérés|saját adat/i.test(txt) || /forrás/i.test((el.parentElement?.textContent || '').slice(0, 900));
    const b = { tag: el.tagName.toLowerCase(), cls: [...el.classList].slice(0, 2).join('.'), text: txt.slice(0, 700), head: isHead, sourced };
    const pm = txt.match(/\d[\d\s.,]*\s?(Ft|HUF|forint)(?![\p{L}])/iu);
    if (pm) { let n = el, afa = false; for (let i = 0; i < 4 && n; i++) { const t = n.textContent || ''; if (t.length < 800 && /ÁFA|áfa|\bafa\b/i.test(t)) { afa = true; break; } n = n.parentElement; } b.price = { match: pm[0].trim(), afa }; }
    blocks.push(b);
  }
  X.blocks = blocks;
  X.headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,[role=heading]')].filter(h => vis(h) && !h.closest('footer,[class*="lablec"],[class*="cky"],.w-dropdown-list,[class*="menu-"],nav')).map(h => ({ level: +(h.tagName[1] || h.getAttribute('aria-level') || 2), text: clip(tx(h), 90) }));
  X.altTexts = [...document.images].filter(i => i.hasAttribute('alt') && i.alt.trim()).map(i => i.alt.trim());
  const m = n => document.querySelector(`meta[name="${n}"],meta[property="${n}"]`)?.content || '';
  X.metaText = [document.title, m('description'), m('og:title'), m('og:description')].filter(Boolean);
  X.hiddenWebflowMsgs = [...document.querySelectorAll('.w-form-done,.w-form-fail')].map(e => e.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean);
  X.submitDefaults = [...document.querySelectorAll('input[type=submit]')].map(i => ({ value: i.value, wait: i.getAttribute('data-wait') || '' }));

  // ---- 2. linkek, gombok
  const GEN_CLS = /gomb|button|btn|cta|w-button/i;
  const fold = e => { const r = e.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && r.left < innerWidth; };
  X.links = [...document.querySelectorAll('a[href]')].slice(0, 900).map(a => {
    const v = vis(a); const zone = a.closest('footer,[class*="lablec"]') ? 'footer' : a.closest('nav,.w-nav,[class*="menu-"],.w-dropdown-list') ? 'nav' : 'main';
    return { href: a.getAttribute('href'), abs: a.href, text: clip(a.getAttribute('aria-label') || tx(a) || a.querySelector('img[alt]')?.alt || '', 80), vis: v, fold: v && fold(a), zone, cls: [...a.classList].slice(0, 3).join('.'), btn: GEN_CLS.test(a.className || ''), target: a.getAttribute('target') || '' };
  });
  X.deadAnchors = [...document.querySelectorAll('a[href*="#"]')].filter(a => !/\bw-(tab-link|dropdown-toggle)\b/.test(a.className || '')).map(a => {
    let u; try { u = new URL(a.href); } catch { return null; }
    if (u.pathname.replace(/\/$/, '') !== location.pathname.replace(/\/$/, '') || u.host !== location.host) return null;
    const id = decodeURIComponent(u.hash.slice(1)); if (!id || /^(!|w-)/.test(id)) return null;
    return (document.getElementById(id) || document.getElementsByName(id)[0]) ? null : { href: a.getAttribute('href'), text: clip(tx(a), 40) };
  }).filter(Boolean);
  X.emptyHrefs = [...document.querySelectorAll('a')].filter(a => a.hasAttribute('href') && /^(#|)$/.test(a.getAttribute('href').trim()) && vis(a) && !/\bw-(dropdown-toggle|tab-link)\b/.test(a.className || '') && !a.closest(THIRD)).map(a => ({ el: desc(a), text: clip(tx(a), 40) }));
  X.buttons = [...document.querySelectorAll('button,input[type=submit],[role=button]')].filter(vis).map(b => ({ text: clip(b.value || tx(b) || b.getAttribute('aria-label') || '', 60), type: b.type || '', inForm: !!b.closest('form'), cls: [...b.classList].slice(0, 2).join('.') }));
  X.primary = [...document.querySelectorAll('a[href],button,input[type=submit]')].filter(e => vis(e) && !e.closest('[class*="cky"],.w-dropdown-list,[class*="sender"]') && !/w-nav-button|w-dropdown-toggle|menu-/.test(e.className || '')).map(e => {
    const cs = getComputedStyle(e), r = e.getBoundingClientRect(), t = (e.value || tx(e) || e.getAttribute('aria-label') || '').trim();
    const solid = cs.backgroundColor && !/rgba?\(\s*0,\s*0,\s*0,\s*0\)|transparent/.test(cs.backgroundColor);
    const like = GEN_CLS.test(e.className || '') || (solid && parseFloat(cs.borderRadius) > 0 && t.length > 1 && t.length <= 40 && r.height >= 32);
    return { like, text: clip(t, 60), href: e.getAttribute('href') || '', tag: e.tagName.toLowerCase(), fold: fold(e), zone: e.closest('footer,[class*="lablec"]') ? 'footer' : 'main' };
  }).filter(x => x.like);

  // ---- 3. fejlécek
  X.h1 = X.headings.filter(h => h.level === 1);
  // ---- képek
  X.images = [...document.images].filter(i => !i.closest('svg')).map(i => { const r = i.getBoundingClientRect(); return { src: i.currentSrc || i.src, alt: i.hasAttribute('alt') ? i.alt : null, vis: vis(i), w: i.naturalWidth, h: i.naturalHeight, dw: Math.round(r.width), broken: i.complete && i.naturalWidth === 0 && !!(i.currentSrc || i.src),
    lk: (() => { const l = i.closest('a[href],button'); if (!l) return null; const t = (l.innerText || '').trim() || l.getAttribute('aria-label') || l.getAttribute('title') || [...l.querySelectorAll('img[alt]')].map(x => x.alt.trim()).join(''); return { name: t.slice(0, 60), href: (l.getAttribute('href') || '').slice(0, 120) }; })(),
    loading: i.getAttribute('loading') || '', fp: i.getAttribute('fetchpriority') || '', wa: i.hasAttribute('width') && i.hasAttribute('height'), ar: getComputedStyle(i).aspectRatio || 'auto', pos: getComputedStyle(i).position, dh: Math.round(r.height), top: Math.round(r.top), dpr: window.devicePixelRatio || 1,
    zone: i.closest('nav,.w-nav,footer,[class*="cky"],[class*="sender"],[class*="trustindex"],[class*="lablec"]') ? 'chrome' : 'main' }; });
  // ---- 6. SEO
  const jl = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { const j = JSON.parse(s.textContent); const arr = j['@graph'] ? j['@graph'] : Array.isArray(j) ? j : [j]; return arr.map(x => x['@type']).flat().filter(Boolean); } catch { return ['HIBÁS']; } }).flat();
  X.seo = {
    title: document.title, description: m('description'), canonical: document.querySelector('link[rel=canonical]')?.href || '', robots: m('robots'),
    ogImage: m('og:image'), ogTitle: m('og:title'), ogDescription: m('og:description'), lang: document.documentElement.lang || '',
    hreflang: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map(l => l.getAttribute('hreflang')), jsonld: jl,
  };
  // ---- 7. jog és bizalom
  X.forms = [...document.querySelectorAll('form')].map(f => {
    const fields = [...f.querySelectorAll('input,textarea,select')].filter(i => i.type !== 'hidden' && i.type !== 'submit');
    const personal = fields.some(i => /^(email|tel)$/.test(i.type) || /e-?mail|phone|tel|name|nev|név|telefon/i.test((i.name || '') + (i.placeholder || '') + (i.getAttribute('autocomplete') || '') + (i.getAttribute('aria-label') || '')));
    const scope = (f.closest('.w-form') || f).textContent;
    const link = !!(f.closest('.w-form') || f).querySelector('a[href*="adatkezel"],a[href*="adatvedel"],a[href*="adatvédel"],a[href*="privacy"]');
    const consent = /adatkezel|adatvédel|hozzájárul|elfogadom|privacy|consent/i.test(scope) || !!f.querySelector('input[type=checkbox][required]');
    return { el: desc(f), name: f.getAttribute('data-name') || f.getAttribute('name') || '', fields: fields.length, personal, privacyLink: link, consent, vis: vis(f) };
  });
  X.price = blocks.filter(b => b.price).map(b => ({ price: b.price.match, afa: b.price.afa, text: clip(b.text, 110) }));
  X.trust = {
    logos: document.querySelectorAll('.ds-bizalom,.ds-logosor,[class*="bizalom"],[class*="logosor"],[class*="partner-logo"]').length,
    testimonial: document.querySelectorAll('blockquote,[class*="idezet"],[class*="velemeny"],[class*="testimonial"],[class*="referencia"],[id*="velemeny"],.ds-tanacsado .ds-ember-nev').length
      + [...document.querySelectorAll('.ds-kartya p, .ds-szoveg')].filter(e => /^\s*„.{40,}”\s*$/s.test(e.textContent || '')).length,
  };
  X.footerLinks = X.links.filter(l => l.zone === 'footer').map(l => ({ href: l.href, text: l.text }));
  return X;
}

// ---------------------------------------------------------------- csavar: státusz-ellenőrzés curl-lel
const statusCache = new Map();
async function curlStatus(url) {
  const key = url.split('#')[0];
  if (statusCache.has(key)) return statusCache.get(key);
  const run = async head => {
    const args = ['-s', '-L', '-o', '/dev/null', '-m', '10', '--max-redirs', '8', '-A', UA_CURL, '-w', '%{http_code}|%{num_redirects}|%{url_effective}'];
    if (head) args.unshift('-I');
    args.push(key);
    try { const { stdout } = await execFileP('curl', args, { maxBuffer: 1 << 20 }); const [code, n, eff] = stdout.split('|'); return { code: +code, redirects: +n, final: eff }; }
    catch (e) { const [code, n, eff] = String(e.stdout || '0|0|').split('|'); return { code: +code || 0, redirects: +n || 0, final: eff || key, err: true }; }
  };
  let r = await run(true);
  if (r.code === 0 || r.code >= 400) { const g = await run(false); if (g.code && g.code < r.code || r.code === 0) r = g; else if (g.code === r.code) r = g; }
  statusCache.set(key, r);
  return r;
}
// Író–olvasó zár: az időzítés-érzékeny mérések (teljesítmény, lassú 4G) kizárólagosan futnak, a többi fázis (shared) párhuzamosan.
// Így a --concurrency > 1 nem torzítja az LCP-t és a hero-időt (a CPU-lassított mérés közben a másik oldal nem terheli a gépet).
const RW = (() => {
  let readers = 0, writer = false; const q = [];
  const pump = () => { while (q.length) { const w = q[0]; if (w.ex) { if (readers === 0 && !writer) { q.shift(); writer = true; w.res(); } else break; } else if (!writer) { q.shift(); readers++; w.res(); } else break; } };
  return { async run(ex, fn) { await new Promise(res => { q.push({ ex, res }); pump(); }); try { return await fn(); } finally { if (ex) writer = false; else readers--; pump(); } } };
})();
async function pool(items, n, fn) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } }));
  return out;
}

// ---------------------------------------------------------------- hálózat-követés (CDP)
async function trackNet(ctx, page, throttle = 0) {
  const reqs = new Map(); let cdp = null;
  try {
    cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.enable');
    if (throttle) await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle });
    cdp.on('Network.responseReceived', e => { if (!/^data:/.test(e.response.url)) reqs.set(e.requestId, { url: e.response.url, status: e.response.status, mime: e.response.mimeType || '', type: e.type, bytes: 0 }); });
    cdp.on('Network.loadingFinished', e => { const r = reqs.get(e.requestId); if (r) r.bytes = e.encodedDataLength; });
  } catch (e) { /* nem Chromium vagy nincs CDP: a mérés hiányos marad */ }
  return { reqs, cdp, ok: !!cdp };
}
const INIT = () => {
  window.__m = { lcp: 0, lcpEl: '', cls: 0, long: [], lcpInfo: null };
  // a tényleges LCP-csomópont adatai (attribútumok, nem osztálynév): loading, fetchpriority, forrás
  const lcpNode = e => { try { const el = e.element; const o = { tag: el ? el.tagName.toLowerCase() : '', url: String(e.url || '').slice(0, 200), size: Math.round(e.size || 0) }; if (el && o.tag === 'img') { o.loading = el.getAttribute('loading') || ''; o.fp = el.getAttribute('fetchpriority') || ''; o.src = String(el.currentSrc || el.src || '').slice(0, 200); o.nw = el.naturalWidth; o.rw = Math.round(el.getBoundingClientRect().width); } return o; } catch { return null; } };
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) { window.__m.lcp = e.startTime; window.__m.lcpEl = (e.element ? e.element.tagName.toLowerCase() + '.' + String(e.element.className || '').slice(0, 40) : e.url || '').slice(0, 90); window.__m.lcpInfo = lcpNode(e); } }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch {}
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__m.long.push(e.duration); }).observe({ type: 'longtask', buffered: true }); } catch {}
};
async function scrollAll(page, vh) {
  for (let y = 0, i = 0; i < 80; i++) {
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    if (y >= H) break;
    await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(130); y += Math.round(vh * 0.7);
  }
  await page.waitForTimeout(700);
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(500);
}

// ---------------------------------------------------------------- egy oldal mérése
async function measurePage(browser, url) {
  const T0 = Date.now();
  const P = { url, slug: slugOf(url), warnings: [], shots: {} };
  const dir = join(OUT, P.slug); mkdirSync(dir, { recursive: true });
  const cfgX = { ds: '^(ds|fs|bc|menu|lablec|cs|cs2)(-|$)', neutral: '^(w-|w--|cky|sender|wf-)', known: '^(div-block|uui-|button_main|alap-blokk|dia_|headline|text-block|heading|paragraph|container|section|image|link-block|button|columns?|rich-text|hero|footer|nav)(-\\d+)?$|^(uui-|dia_|alap-|button_|footer_|download_|img_)|-\\d+$' };

  // A) teljesítmény + süti + hozzájárulás: blokkolás nélkül, mobil, 4× CPU-lassítás, semmi interakció (kizárólagos zár alatt)
  await RW.run(true, async () => {
    const [w, h] = MOBILE_VP;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 768, hasTouch: w < 768, deviceScaleFactor: 1, locale: 'hu-HU' });
    const page = await ctx.newPage(); await page.addInitScript(INIT);
    const net = await trackNet(ctx, page, 4);
    const t0 = Date.now(); let resp = null;
    try { resp = await page.goto(url, { waitUntil: 'load', timeout: 60000 }); } catch (e) { P.fatal = String(e.message).slice(0, 200); }
    if (!P.fatal) {
      await page.waitForTimeout(3000);
      P.status = resp ? resp.status() : 0; P.finalUrl = page.url(); P.xRobots = resp ? (resp.headers()['x-robots-tag'] || '') : '';
      const nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0] || {}; const p = performance.getEntriesByName('first-contentful-paint')[0]; return { ttfb: Math.round(n.responseStart || 0), fcp: Math.round(p ? p.startTime : 0), load: Math.round(n.loadEventEnd || 0), m: window.__m, cookieJs: document.cookie }; });
      const reqs = [...net.reqs.values()];
      const hosts = {}; for (const r of reqs) { try { const hn = new URL(r.url).hostname; hosts[hn] = (hosts[hn] || 0) + 1; } catch {} }
      const third = Object.entries(hosts).filter(([hn]) => !FIRST_PARTY.test(hn)).sort((a, b) => b[1] - a[1]);
      const long = nav.m.long; const tbt = Math.round(long.reduce((s, d) => s + Math.max(0, d - 50), 0));
      P.perf = { throttle: net.ok ? '4× CPU' : 'nincs lassítás (CDP nem elérhető)', lcpMs: Math.round(nav.m.lcp), lcpEl: nav.m.lcpEl, lcpInfo: nav.m.lcpInfo || null, fcpMs: nav.fcp, ttfbMs: nav.ttfb, loadMs: nav.load, tbtMs: tbt, longTasks: long.length, transferKB: Math.round(reqs.reduce((s, r) => s + r.bytes, 0) / 1024), requests: reqs.length, thirdPartyHosts: third.map(([hn, n]) => `${hn} (${n})`), heaviest: reqs.sort((a, b) => b.bytes - a.bytes).slice(0, 5).map(r => `${r.url.split('/').pop().split('?')[0].slice(0, 50)} ${Math.round(r.bytes / 1024)} kB`) };
      P.perf.thirdParty = hostSummary(reqs, hn => FIRST_PARTY.test(hn));
      P.trackerHosts = Object.keys(hosts).filter(hn => TRACKER.test(hn));
      const cookies = await ctx.cookies();
      P.cookies = [...new Set([...cookies.map(c => c.name), ...nav.cookieJs.split(';').map(s => s.split('=')[0].trim()).filter(Boolean)])];
      P.banner = await page.evaluate(() => !!document.querySelector('.cky-consent-container,.cky-banner,.cky-modal,[class*="cookie-consent"],[class*="cookie-banner"],#CybotCookiebotDialog,.cc-window,#onetrust-banner-sdk,[id*="cookie-law"],[class*="cookieyes"]'));
    }
    await ctx.close();
    // A/2) harmadik fél főszál-ideje: külön betöltés CPU-profilerrel (hogy ne torzítsa az LCP/TBT-mérést); --no-trace kihagyja
    if (!P.fatal && opt.trace && P.perf) { const cpu = await cpuByHost(browser, url, { vp: MOBILE_VP, isFirst: hn => FIRST_PARTY.test(hn) }); mergeCpu(P.perf.thirdParty, cpu); }
  });
  if (P.fatal) return P;

  // B) képernyőképes mérés minden nézetméreten (sender.net blokkolva) + C) mérés/QA: osztott zár alatt (több oldal párhuzamosan futhat)
  await RW.run(false, async () => {
  P.vp = {};
  for (const [w, h] of VPS) {
    const key = `${w}x${h}`; const mobile = w < 768;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1, locale: 'hu-HU' });
    await ctx.route(/sender\.net/i, r => r.abort());
    const page = await ctx.newPage(); await page.addInitScript(INIT);
    const net = await trackNet(ctx, page, 0);
    const cErr = [], cFail = [];
    page.on('console', m => { if (m.type() === 'error' && !/^Failed to load resource|font-size:\s*0;\s*color:\s*transparent|challenges\.cloudflare|Connecting to 'data:,'|Fetch API cannot load data:/i.test(m.text())) cErr.push(m.text().replace(/\s+/g, ' ').slice(0, 140)); });
    page.on('pageerror', e => cErr.push('pageerror: ' + String(e.message).replace(/\s+/g, ' ').slice(0, 120)));
    page.on('response', r => { if (r.status() >= 400 && !/sender\.net|challenges\.cloudflare\.com/i.test(r.url())) cFail.push({ url: r.url().replace(/[?#].*$/, '').slice(0, 110), status: r.status(), type: r.request().resourceType() }); });
    try { await page.goto(url, { waitUntil: 'load', timeout: 60000 }); } catch (e) { P.warnings.push(`${key}: betöltési hiba: ${String(e.message).slice(0, 100)}`); await ctx.close(); continue; }
    await page.waitForTimeout(opt.wait);
    const lcp0 = await page.evaluate(() => (window.__m ? { ms: Math.round(window.__m.lcp), info: window.__m.lcpInfo } : null)).catch(() => null); // az LCP a görgetés előtt (a görgetés lusta képeket tölt, és új LCP-jelöltet adhat)
    await scrollAll(page, h);
    const X = await page.evaluate(extract, cfgX);
    let U = null; try { U = await page.evaluate(uxExtract, {}); } catch (e) { P.warnings.push(`${key}: UX-mérés hiba: ${String(e.message).slice(0, 80)}`); }
    const cls = await page.evaluate(() => window.__m.cls);
    const label = mobile ? 'mobil' : 'asztali';
    try { P.shots[`${label}-hajtas`] = join(dir, `${label}-hajtas.png`); await page.screenshot({ path: P.shots[`${label}-hajtas`] }); } catch (e) { P.warnings.push(`${key}: hajtás-kép: ${String(e.message).slice(0, 80)}`); }
    try { P.shots[`${label}-teljes`] = join(dir, `${label}-teljes.png`); await page.screenshot({ path: P.shots[`${label}-teljes`], fullPage: true }); } catch (e) { P.warnings.push(`${key}: teljes oldali kép: ${String(e.message).slice(0, 80)}`); }
    // fókuszkeret: Tab × 8
    let focus = [];
    try {
      await page.evaluate(() => scrollTo(0, 0));
      for (let i = 0; i < 8; i++) { await page.keyboard.press('Tab'); focus.push(await page.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return null; const cs = getComputedStyle(a); const ow = parseFloat(cs.outlineWidth) || 0; return { el: a.tagName.toLowerCase() + '.' + [...a.classList].slice(0, 1).join('.'), ring: (cs.outlineStyle !== 'none' && ow > 0) || (cs.boxShadow && cs.boxShadow !== 'none') }; })); }
    } catch {}
    P.vp[key] = { mobile, X, U, net: { errors: [...new Set(cErr)].slice(0, 8), failed: cFail.slice(0, 12) }, cls, lcp0, xferKB: Math.round([...net.reqs.values()].reduce((s, r) => s + (r.bytes || 0), 0) / 1024), imgReqs: [...net.reqs.values()].filter(r => /^image\//.test(r.mime) || r.type === 'Image'), focus: focus.filter(Boolean) };
    await ctx.close();
  }
  // C) v3: mérés (CTA-szimuláció, védett környezet) + billentyűzet + axe, majd a QA-kör (--fast nélkül: mátrix, böngészők, módok)
  try {
    P.measure = await measureTracking(browser, url, { qaKeyboard: qaKeyboardAxe });
    P.qa = P.measure.qa || {}; delete P.measure.qa;
  } catch (e) { P.measure = { ok: false, error: String(e.message).slice(0, 200) }; P.qa = {}; }
  const allErr = Object.values(P.vp).flatMap(v => (v.net ? v.net.errors : [])); const allFail = Object.values(P.vp).flatMap(v => (v.net ? v.net.failed : []));
  P.qa.net = { errors: [...new Set(allErr)].length, failed: new Set(allFail.map(f => f.url)).size };
  P.qa.fast = !!opt.fast;
  if (!opt.fast) {
    const dir2 = join(dir, 'qa');
    try { P.qa.matrix = await qaMatrix(browser, url, dir2, P.slug); } catch (e) { P.qa.matrix = { vps: {}, error: String(e.message).slice(0, 100) }; }
    try { P.qa.browsers = await qaBrowsers(await getEngines(), url, dir2); } catch (e) { P.warnings.push('böngésző-teszt hiba: ' + String(e.message).slice(0, 80)); }
  }
  });
  if (!opt.fast) { try { P.qa.modes = await qaModes(browser, url, RW); } catch (e) { P.qa.modes = null; P.warnings.push('mód-teszt hiba: ' + String(e.message).slice(0, 80)); } }
  P.runtimeSec = Math.round((Date.now() - T0) / 1000);
  P.timing = { measureSec: P.measure ? Math.round((P.measure.ms || 0) / 1000) : null, matrixSec: P.qa.matrix ? Math.round((P.qa.matrix.ms || 0) / 1000) : null, modesSec: P.qa.modes ? Math.round((P.qa.modes.ms || 0) / 1000) : null };
  return P;
}

// ---------------------------------------------------------------- újrahasznosított szkriptek
function runUiAudit(url, dir) {
  const f = join(os.homedir(), '.claude/skills/minosegkapu/scripts/ui_audit.mjs');
  if (!existsSync(f)) return { warn: 'ui_audit.mjs nem található (~/.claude/skills/minosegkapu): a kontraszt/44 px/kilógás nem mért' };
  const vps = [...new Set(['320x640', ...VPS.map(v => v.join('x'))])].join(',');
  const r = spawnSync('node', [f, url, '--viewports', vps, '--json'], { env: { ...process.env, PLAYWRIGHT_PATH: pwDir || '' }, encoding: 'utf8', maxBuffer: 1 << 28, timeout: 300000 });
  try { const j = JSON.parse(r.stdout); writeFileSync(join(dir, 'ui_audit.json'), JSON.stringify(j, null, 1)); return { data: j }; }
  catch { return { warn: 'ui_audit.mjs nem adott érvényes JSON-t: ' + clip(r.stderr || r.stdout, 160) }; }
}
function runLandingReview(url, dir, slug) {
  const f = join(os.homedir(), '.claude/skills/minosegkapu/scripts/landing_review.mjs');
  if (!existsSync(f)) return { warn: 'landing_review.mjs nem található: felugró réteg / rejtve maradt animáció nem mért' };
  const out = join(dir, 'landing-review'); mkdirSync(out, { recursive: true });
  const cfg = join(out, 'config.json'); writeFileSync(cfg, JSON.stringify({ nev: slug, primerCta: '.ds-gomb,a[class*="button"],a[class*="gomb"]' }));
  const r = spawnSync('node', [f, url, '--config', cfg, '--out', out, '--viewports', `${MOBILE_VP.join('x')},${DESKTOP_VP.join('x')}`], { env: { ...process.env, PLAYWRIGHT_PATH: pwDir || '' }, encoding: 'utf8', maxBuffer: 1 << 28, timeout: 300000 });
  try { return { data: JSON.parse(readFileSync(join(out, 'review.json'), 'utf8')) }; }
  catch { return { warn: 'landing_review.mjs nem készített review.json-t: ' + clip(r.stderr || r.stdout, 160) }; }
}

// ---------------------------------------------------------------- pontozás
async function scorePage(P) {
  const F = []; const used = {};
  // add(dim, sev, key, cím, bizonyíték, javítás, levonás, [csoport, csoport-plafon])
  const add = (dim, sev, key, title, evidence, fix, pont, grp, cap) => {
    if (grp) { const left = cap - (used[grp] || 0); if (left <= 0) pont = 0; else pont = Math.min(pont, left); used[grp] = (used[grp] || 0) + pont; }
    F.push({ dim, sev, key, title, evidence: ev(evidence), fix, pont: +pont.toFixed(1) });
  };
  const desk = P.vp[`${DESKTOP_VP.join('x')}`] || Object.values(P.vp).find(v => !v.mobile) || Object.values(P.vp)[0];
  const mob = P.vp[`${MOBILE_VP.join('x')}`] || Object.values(P.vp).find(v => v.mobile) || desk;
  const X = desk.X;
  const b2b = IS_B2B(P.url);
  const pageUrl = new URL(P.finalUrl || P.url);

  // ---- 7. SEO – oldalállapot
  if (P.status >= 400) add('seo', 'P0', 'page.status', `Az oldal HTTP ${P.status}-t ad: nem érhető el`, P.url, 'Ellenőrizd, hogy az oldal publikálva van-e (nem draft), és hogy a webcím (slug) pontosan egyezik; ha az oldal szándékosan megszűnt, tegyél 301-es átirányítást (Webflow → Site settings → Publishing → 301 redirects).', 100);
  if (P.xRobots && /noindex/i.test(P.xRobots) || /noindex/i.test(X.seo.robots)) add('seo', 'P0', 'seo.noindex', 'Az oldal noindex: a keresők nem veszik fel', P.xRobots || X.seo.robots, 'Ha az oldal éles, vedd ki a noindex-et (Page settings → SEO → „Exclude this page from search results”) – staging oldalon ez normális.', 60);

  // ---- 1. DS
  const ds = X.ds; const styled = ds.nDs + ds.nLegacy; const share = styled ? ds.nDs / styled : 1;
  const topLegacy = ds.topLegacy.slice(0, 8).map(l => `${l.cls}×${l.n}`).join(', ');
  if (share < 0.999) add('ds', share < 0.6 ? 'P2' : 'P3', 'ds.share', `Az osztályos elemek csak ${Math.round(share * 100)} %-a DS-osztályos (${ds.nDs} DS, ${ds.nLegacy} régi/sablon osztályú)`, `Leggyakoribb nem-DS osztályok: ${topLegacy || '–'}`, 'Cseréld a régi osztályokat DS-megfelelőre (ds-szekcio, ds-cim2/3, ds-szoveg, ds-gomb, ds-kartya…; lásd docs/komponensek.md). Designerben: tedd az elemre a DS-osztályt, a régit vedd le, majd Style Manager → Clean up, hogy a használatlan stílusok törlődjenek.', (1 - share) * 55);
  if (X.embeds.length) add('ds', X.embeds.length > 1 ? 'P2' : 'P3', 'ds.embed', `${X.embeds.length} db .w-embed (beágyazott kód) blokk`, X.embeds.slice(0, 4).map(e => `${e.el}: ${e.preview}`), 'Ahol lehet, cseréld natív Webflow-elemre vagy DS-komponensre. Ami tényleg kód (pl. űrlap-szkript), kerüljön egy közös, dokumentált helyre, ne oldalankénti embedbe.', Math.min(12, 2 * X.embeds.length));
  if (X.bodyStyles.length) add('ds', 'P2', 'ds.bodystyle', `${X.bodyStyles.length} db <style> a body-ban`, X.bodyStyles.map(s => s.id || s.preview), 'Vidd a szabályokat a DS-stílusok közé (osztály a Style Managerben), vagy az oldalszintű Custom Code <head> részébe egyetlen, kommentelt blokkba.', Math.min(9, 3 * X.bodyStyles.length));
  if (X.inlineStyle.length > 5) add('ds', X.inlineStyle.length > 20 ? 'P2' : 'P3', 'ds.inline', `${X.inlineStyle.length} elem inline style= attribútummal`, X.inlineStyle.slice(0, 5).map(s => `${s.el} {${s.style}}`), 'Az inline stílus (embedből vagy szkriptből) cseréld osztályra; a Webflow-interakciók által írt stílus nem számít.', Math.min(10, 0.5 * X.inlineStyle.length));
  const hc = X.headStyles.length + X.headLinks.length;
  if (hc) add('ds', 'P2', 'ds.headcustom', `${hc} egyedi <style>/<link rel=stylesheet> az oldal fejében a Webflow sajátján felül`, [...X.headStyles.map(s => `style#${s.id}: ${s.preview}`), ...X.headLinks].slice(0, 5), 'Egy közös, a design systemhez tartozó (verziózott) CSS-be rendezd; oldalszintű egyedi stíluslap csak indokolt kivételként maradjon.', Math.min(12, 4 * hc));

  // ---- 2. linkek és gombok
  const links = X.links; const L = { internal: 0, external: 0, mailto: 0, tel: 0, anchor: 0, skipped: 0, checked: 0 };
  const mainHost = pageUrl.hostname;
  const isInternal = h => /(^|\.)beeco\.hu$/.test(h) || h === mainHost;
  const toCheck = new Map();
  for (const l of links) {
    const a = l.href || '';
    if (/^mailto:/i.test(a)) { L.mailto++; continue; } if (/^tel:/i.test(a)) { L.tel++; continue; }
    if (/^(javascript:|sms:|whatsapp:|data:)/i.test(a)) continue; if (a.startsWith('#')) { L.anchor++; continue; }
    let u; try { u = new URL(l.abs); } catch { continue; } if (!/^https?:$/.test(u.protocol)) continue;
    const int = isInternal(u.hostname); int ? L.internal++ : L.external++;
    if (!int && (!opt.external || SOCIAL_SKIP.test(u.hostname))) { L.skipped++; continue; }
    const key = u.href.split('#')[0]; if (!toCheck.has(key)) toCheck.set(key, { url: key, internal: int, labels: new Set() });
    toCheck.get(key).labels.add(l.text || '(ikon)');
  }
  const results = await pool([...toCheck.values()], 8, async c => ({ ...c, ...(await curlStatus(c.url)) }));
  L.checked = results.length; P.linkResults = results.map(r => ({ url: r.url, internal: r.internal, code: r.code, redirects: r.redirects, final: r.final, labels: [...r.labels].slice(0, 3) }));
  for (const r of results.filter(r => r.internal && (r.code >= 400 || r.code === 0))) add('links', 'P1', `links.broken|${normUrl(r.url)}`, `Belső link hibás: ${r.url} → ${r.code || 'nem elérhető'}`, `Felirat: ${[...r.labels].slice(0, 3).join(' / ')}`, 'Javítsd a link célját (Designer → elem → Link settings), vagy publikáld a hiányzó oldalt, vagy tegyél 301-es átirányítást.', 12, 'lb', 40);
  const redirChain = results.filter(r => r.internal && r.redirects >= 2 && r.code < 400), redir1 = results.filter(r => r.internal && r.redirects === 1 && r.code < 400);
  if (redirChain.length) add('links', 'P2', 'links.redirect-chain', `${redirChain.length} belső link ≥ 2 lépéses átirányításon megy át`, redirChain.slice(0, 5).map(r => `${r.url} → ${r.final} (${r.redirects} lépés)`), 'Írd át a linket a végső URL-re.', Math.min(6, 2 * redirChain.length));
  if (redir1.length) add('links', 'P3', 'links.redirect', `${redir1.length} belső link átirányítással érhető el`, redir1.slice(0, 6).map(r => `${r.url} → ${r.final}`), 'Írd át a linket a végső URL-re (gyorsabb, tisztább mérés).', Math.min(3, 0.5 * redir1.length));
  for (const r of results.filter(r => !r.internal && r.code >= 400)) add('links', 'P2', `links.ext-broken|${normUrl(r.url)}`, `Külső link hibás: ${r.url} → ${r.code}`, `Felirat: ${[...r.labels].slice(0, 2).join(' / ')}`, 'Cseréld működő forrásra, vagy vedd ki; a számok forrásánál különösen fontos.', 5, 'le', 15);
  const tmo = results.filter(r => !r.internal && r.code === 0);
  if (tmo.length) add('links', 'P3', 'links.ext-timeout', `${tmo.length} külső link nem válaszolt 10 mp-en belül`, tmo.slice(0, 5).map(r => r.url), 'Nyisd meg kézzel: lehet botblokkoló, lehet halott link.', Math.min(3, tmo.length));
  if (X.deadAnchors.length) add('links', 'P1', 'links.dead-anchor', `${X.deadAnchors.length} #horgony-link nem létező elemre mutat`, X.deadAnchors.slice(0, 6).map(a => `${a.href} (${a.text})`), 'Add meg a cél elemnek a pontos ID-t (Designer → Element settings → ID), vagy javítsd a linket.', Math.min(24, 8 * X.deadAnchors.length));
  if (X.emptyHrefs.length) add('links', 'P2', 'links.empty-href', `${X.emptyHrefs.length} link üres vagy „#” céllal`, X.emptyHrefs.slice(0, 5).map(a => `${a.el} „${a.text}”`), 'Adj valós célt, vagy ha nem link, tedd gombbá/szöveggé.', Math.min(9, 3 * X.emptyHrefs.length));
  const prim = X.primary, primMob = mob.X.primary;
  P.primaryCta = { mobile: primMob.filter(p => p.fold).map(p => `${p.text} → ${p.href}`), desktop: prim.filter(p => p.fold).map(p => `${p.text} → ${p.href}`) };
  if (!primMob.some(p => p.fold)) add('links', 'P1', 'links.no-fold-cta-mobile', 'Nincs elsődleges CTA a hajtás fölött mobilon', `Mobil nézet ${MOBILE_VP.join('x')}; a hajtás fölött nincs gomb-szerű elem`, 'Tegyél egy kontrasztos, egyetlen cselekvést kérő gombot a H1 alá/mellé (pl. „Kérj ajánlatot”), hogy görgetés nélkül látszódjon.', 15);
  if (mob !== desk && !prim.some(p => p.fold)) add('links', 'P2', 'links.no-fold-cta-desktop', 'Nincs elsődleges CTA a hajtás fölött asztali nézeten', `Asztali nézet ${DESKTOP_VP.join('x')}`, 'Ugyanaz, mint mobilon: egy kiemelt gomb a hajtás fölé.', 8);
  const mailCta = prim.filter(p => /^mailto:/i.test(p.href));
  if (mailCta.length) add('links', 'P2', 'links.mailto-cta', 'mailto: link szolgál elsődleges CTA-ként', mailCta.slice(0, 3).map(p => `${p.text} → ${p.href.split('?')[0].replace(/^(mailto:).*(@.*)$/i, '$1…$2')}`), 'A levelezőprogram sokaknál nincs beállítva és nem mérhető: vigyél űrlapra vagy időpontfoglalóra (mérhető esemény), a mailto legyen másodlagos.', 8);
  const genSet = new Set(LIST.altalanosCimkek);
  const genLabels = {}; for (const l of links.filter(l => l.vis && l.zone !== 'footer')) { const t = l.text.toLowerCase().replace(/[.!→>›»]+$/g, '').trim(); if (genSet.has(t)) genLabels[l.text] = (genLabels[l.text] || 0) + 1; }
  for (const b of X.buttons) { const t = b.text.toLowerCase().trim(); if (genSet.has(t)) genLabels[b.text] = (genLabels[b.text] || 0) + 1; }
  for (const [t, n] of Object.entries(genLabels)) add('links', 'P2', `links.generic|${t.toLowerCase()}`, `Általános gombfelirat: „${t}” (${n}×)`, 'A felirat nem mondja meg, mi lesz a kattintás után', 'Írd át cselekvő, következményt mondó szövegre (pl. „Kérj árajánlatot”, „Nézd meg a csomagokat”).', 3, 'lg', 12);
  const byLabel = {};
  for (const l of links.filter(l => l.vis && l.zone === 'main' && l.text.length >= 2 && l.text.length <= 40)) { const k = l.text.toLowerCase(); (byLabel[k] = byLabel[k] || { text: l.text, dest: new Set() }).dest.add(normUrl(l.abs) + (l.abs.includes('#') ? '#' + l.abs.split('#')[1] : '')); }
  for (const g of Object.values(byLabel).filter(g => g.dest.size > 1 && !genSet.has(g.text.toLowerCase()))) add('links', 'P2', `links.dup-label|${g.text.toLowerCase()}`, `Ugyanaz a felirat („${g.text}”) ${g.dest.size} különböző helyre vezet`, [...g.dest].slice(0, 4), 'Egy felirat = egy cél. Nevezd át a feliratokat a konkrét célnak megfelelően.', 4, 'ld', 12);

  // ---- 3. érthetőség és tartalom
  const hs = X.headings; const h1 = hs.filter(h => h.level === 1);
  if (h1.length === 0) add('content', 'P1', 'content.no-h1', 'Nincs H1 az oldalon', `Címsorok: ${hs.slice(0, 4).map(h => 'h' + h.level + ' ' + h.text).join(' | ') || '–'}`, 'Tegyél az oldal fő üzenetére egyetlen H1-et (Designer → Element settings → Tag: H1), és a ds-cim1 osztályt.', 25);
  else if (h1.length > 1) add('content', 'P1', 'content.multi-h1', `${h1.length} H1 van (egy kell)`, h1.map(h => h.text), 'Egy oldal = egy H1; a többit állítsd H2-re (a külső kinézet a DS-osztályból jön, nem a tagből).', 10);
  if (h1.length && h1[0].text.length > 70) add('content', 'P3', 'content.long-h1', `Hosszú H1 (${h1[0].text.length} karakter)`, h1[0].text, 'Rövidítsd 60–70 karakter alá, a lényeg legyen az elején.', 3);
  const jumps = []; for (let i = 1; i < hs.length; i++) if (hs[i].level - hs[i - 1].level > 1) jumps.push(`h${hs[i - 1].level}→h${hs[i].level}: „${hs[i].text}”`);
  if (jumps.length) add('content', 'P2', 'content.heading-jump', `${jumps.length} címsor-szintugrás`, jumps.slice(0, 5), 'Ne ugorj szintet (h2 után h3, nem h4); a méretet a DS-osztály adja.', Math.min(15, 5 * jumps.length));
  const texts = X.blocks.filter(b => !b.head);
  const sentences = texts.filter(b => b.text.split(' ').length >= 5).flatMap(b => b.text.split(/(?<=[.!?…])\s+(?=[A-ZÁÉÍÓÖŐÚÜŰ0-9„"])/)).map(s => s.trim()).filter(s => s.split(/\s+/).length >= 3);
  const lens = sentences.map(s => s.split(/\s+/).length); const avg = lens.length ? lens.reduce((a, b) => a + b, 0) / lens.length : 0; const longPct = lens.length ? lens.filter(n => n > 25).length / lens.length * 100 : 0;
  P.reading = { sentences: lens.length, avgWords: +avg.toFixed(1), longPct: +longPct.toFixed(1) };
  if (lens.length >= 8) {
    if (avg > 20) add('content', 'P2', 'content.sentence-avg', `Hosszú mondatok: átlag ${avg.toFixed(1)} szó/mondat (cél ≤ 20)`, sentences.filter(s => s.split(/\s+/).length > 25).slice(0, 2), 'Törj hosszú mondatokat kettőbe; egy mondat = egy gondolat, aktív igével.', Math.min(20, 5 * (avg - 20)));
    if (longPct > 15) add('content', 'P2', 'content.sentence-long', `A mondatok ${longPct.toFixed(0)} %-a 25 szónál hosszabb (cél ≤ 15 %)`, sentences.filter(s => s.split(/\s+/).length > 25).slice(0, 2), 'Rövidítsd a leghosszabbakat, használj felsorolást.', Math.min(15, 0.6 * (longPct - 15)));
  }
  const allText = [...X.blocks.map(b => b.text), ...X.metaText, ...X.altTexts].join('\n');
  // helyőrzők
  const ph = [];
  for (const b of X.blocks) { const t = b.text.toLowerCase().replace(/[.!]+$/, ''); if (LIST.placeholderPontos.includes(t)) ph.push({ t: b.text, sev: 'P1' }); }
  for (const r of LIST.placeholderRegex) { const re = new RegExp(r.minta, 'gi'); for (const b of X.blocks) { const m = b.text.match(re); if (m) ph.push({ t: clip(b.text, 80), sev: r.sulyossag }); } }
  for (const p of ph.slice(0, 6)) add('content', p.sev, `content.placeholder|${p.t.toLowerCase().slice(0, 40)}`, `Helyőrző / félkész szöveg: „${p.t}”`, 'Látható szöveg az oldalon', 'Írd meg a végleges szöveget, vagy vedd le az elemet az oldalról.', 12, 'ph', 36);
  const eng = [...X.hiddenWebflowMsgs.filter(m => LIST.angolWebflowAlapertelmezett.some(e => m.includes(e.replace('...', '')))), ...X.submitDefaults.filter(s => /^submit$/i.test(s.value)).map(s => 'Submit gomb'), ...X.submitDefaults.filter(s => /please wait/i.test(s.wait)).map(() => 'Please wait… (data-wait)')];
  if (X.seo.lang.startsWith('hu') || !X.seo.lang) for (const m of [...new Set(eng)]) add('content', 'P2', `content.english-default|${m.slice(0, 30)}`, `Angol Webflow-alapszöveg magyar oldalon: „${clip(m, 60)}”`, 'Űrlap-visszajelzés / gomb (beküldés után jelenik meg)', 'Írd át magyarra: Form → Success/Error message és a Submit gomb szövege (pl. „Köszönjük, megkaptuk!”, „Hopp, valami elromlott. Próbáld újra.”).', 4, 'en', 12);
  const dash = (allText.match(/—/g) || []).length;
  if (dash) add('content', 'P2', 'content.emdash', `${dash} db gondolatjel (—) a szövegben; a házstílus nem használja`, [...allText.matchAll(/.{0,25}—.{0,25}/g)].slice(0, 3).map(m => m[0].replace(/\n/g, ' ')), 'Cseréld pontra, vesszőre vagy kettőspontra; ha tartomány (pl. 2–3), rövid kötőjel is jó.', Math.min(12, 2 + dash));
  let typoBudget = 0;
  for (const t of LIST.elirasok) {
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${esc(t.rossz)}(?![\\p{L}\\p{N}])`, t.nagybetuErzekeny ? 'gu' : 'giu'); const n = (allText.match(re) || []).length;
    if (n) add('content', t.sulyossag, `content.typo|${t.rossz.toLowerCase()}`, `Elírás: „${t.rossz}” ${n}× (helyesen: „${t.jo}”)`, [...allText.matchAll(re)].slice(0, 2).map(m => allText.slice(Math.max(0, m.index - 25), m.index + t.rossz.length + 25).replace(/\n/g, ' ')), t.megjegyzes || `Javítsd „${t.jo}”-ra (a Designerben, vagy a CMS-ben; keresés: Ctrl/Cmd+F a Designerben).`, { P1: 8, P2: 4, P3: 1.5 }[t.sulyossag] * n, 'typo', 30);
  }
  const dupWords = [...allText.matchAll(/(?<![\p{L}\p{N}])(\p{L}+)\s+\1(?![\p{L}\p{N}])/giu)].filter(m => !/^(ft|km|kg)$/i.test(m[1]));
  if (dupWords.length) add('content', 'P3', 'content.dup-word', `${dupWords.length} ismételt szó egymás után`, dupWords.slice(0, 5).map(m => m[0]), 'Töröld a felesleges ismétlést.', Math.min(6, 1.5 * dupWords.length));
  const seen = {}; for (const b of texts) if (b.text.length >= 50) seen[b.text] = (seen[b.text] || 0) + 1;
  const dups = Object.entries(seen).filter(([, n]) => n > 1);
  if (dups.length) add('content', 'P2', 'content.dup-paragraph', `${dups.length} szó szerint ismétlődő bekezdés az oldalon`, dups.slice(0, 3).map(([t, n]) => `${n}× „${clip(t, 70)}”`), 'Hagyd meg az erősebb helyen, a másikat írd át vagy töröld (a Google is ismétlésnek látja).', Math.min(9, 3 * dups.length));
  const NUMRE = /(\d[\d\s.,]*)\s?(%|kg|tonna|\bt\b|CO2|CO₂|liter|millió|ezer|Mrd|fő\b|felhasználó|partner|cég\b|letöltés|ember|háztartás|km\b|kWh)/iu;
  const nums = X.blocks.filter(b => !b.head && NUMRE.test(b.text) && !b.sourced && !b.price);
  if (nums.length) add('content', 'P3', 'content.unsourced-numbers', `${nums.length} szám forrásjelzés nélkül (kézi ellenőrzésre)`, nums.slice(0, 5).map(b => clip(b.text, 90)), 'Minden számhoz írd ki a forrást („Forrás: …”, ds-forras osztály), vagy vedd ki, ha nem igazolható. Ellenőrizd kézzel, hogy tényleg szám-állítás-e.', Math.min(8, nums.length));
  const fr = LIST.felsofok; const frRe = new RegExp(`(?<![\\p{L}\\p{N}])(${fr.mindig.map(esc).join('|')})(?![\\p{L}\\p{N}])`, 'iu'); const frCtx = new RegExp(fr.elsoKontextus, 'i');
  const sup = [];
  for (const b of X.blocks.filter(b => !b.sourced)) for (const s of b.text.split(/(?<=[.!?])\s+/)) if (frRe.test(s) || (/(?<![\p{L}\p{N}])(első|legelső)(?![\p{L}\p{N}])/iu.test(s) && frCtx.test(s))) sup.push(s);
  if (sup.length) add('content', 'P3', 'content.superlatives', `${sup.length} forrás nélküli felsőfok/egyediség-állítás („első”, „legnagyobb”, „egyetlen”…)`, sup.slice(0, 4).map(s => clip(s, 100)), 'Írj mellé forrást vagy dátumot, vagy fogalmazd szerényebben („az egyik”, „Magyarországon elsőként a…, 2024-től”); ellenőrizd a jogi kockázatot.', Math.min(10, 2 * sup.length));

  // ---- 4. vizuál és UX (ui_audit + saját)
  P.uiAudit = null; P.landing = null;
  if (opt.reuse) {
    const ui = runUiAudit(P.url, join(OUT, P.slug)); if (ui.warn) P.warnings.push(ui.warn); else P.uiAudit = ui.data.map(x => ({ viewport: x.viewport, findings: x.findings, fatal: x.fatal }));
    const lr = runLandingReview(P.url, join(OUT, P.slug), P.slug); if (lr.warn) P.warnings.push(lr.warn); else P.landing = lr.data.leletek;
  }
  if (P.uiAudit) {
    const agg = {};
    for (const v of P.uiAudit) { const wv = +v.viewport.split('x')[0]; for (const [sev, msg, det] of v.findings || []) {
      const n = parseInt(msg) || 1; const cat = /kontraszt/.test(msg) ? 'contrast' : /érintési felület/.test(msg) ? 'small' : /Vízszintes kilógás/.test(msg) ? 'overflow' : /név nélküli/.test(msg) ? 'noname' : /billentyűzettel/.test(msg) ? 'keyboard' : /11 px alatt/.test(msg) ? 'tiny' : /Csökkentett mozgásnál/.test(msg) ? 'infinite' : /konzol-/.test(msg) ? 'errors' : /Quirks/.test(msg) ? 'quirks' : /viewport meta/.test(msg) ? 'vpmeta' : null;
      if (!cat) continue; if (cat === 'small' && wv >= 768) continue;
      const a = (agg[cat] = agg[cat] || { n: 0, vps: [], det: [] }); a.n = Math.max(a.n, cat === 'overflow' ? parseInt(msg.match(/(\d+) px/)?.[1] || 1) : n); a.vps.push(v.viewport); if (det) a.det.push(...det);
    } }
    const dtl = a => [...new Map((a.det || []).map(d => [JSON.stringify(d), d])).values()].slice(0, 6);
    if (agg.contrast) add('visual', 'P1', 'visual.contrast', `${agg.contrast.n} kontraszthiba (WCAG AA 4,5:1 / nagy szövegnél 3:1)`, dtl(agg.contrast).map(d => `${d.el} „${d.text}” ${d.ratio}:1 (kell ${d.need})`), 'Sötétítsd a szöveg- vagy világosítsd a háttérszínt a DS-tokenekkel (bc-szöveg / bc-felület párok); a szürke kistext a leggyakoribb hibás.', Math.min(18, 4 + agg.contrast.n));
    if (agg.overflow) add('visual', 'P1', 'visual.overflow', `Vízszintes kilógás (${agg.overflow.n} px) ezeken: ${[...new Set(agg.overflow.vps)].join(', ')}`, 'Az oldal oldalra görgethető', 'Keresd meg a kilógó elemet (fix szélesség, negatív margó, túl széles kép/embed), és adj neki max-width:100% / flex-wrap-ot.', 15);
    if (agg.noname) add('visual', 'P1', 'visual.noname', `${agg.noname.n} név nélküli gomb/link (képernyőolvasónak üres)`, dtl(agg.noname), 'Adj aria-label-t vagy látható szöveget (Element settings → Custom attributes: aria-label).', Math.min(10, 3 * agg.noname.n));
    if (agg.keyboard) add('visual', 'P1', 'visual.keyboard', `${agg.keyboard.n} kattintható elem billentyűzettel nem érhető el`, dtl(agg.keyboard), 'Használj valódi link/gomb elemet (nem div), vagy adj tabindex-et és billentyű-kezelést.', Math.min(10, 3 * agg.keyboard.n));
    // a sütisáv (CookieYes, harmadik fél) mondatba ágyazott „Cookie tájékoztató” linkje nem a mi elemünk, és szövegközi link (WCAG 2.5.8 kivétel)
    if (agg.small && agg.small.det) { const own = agg.small.det.filter(d => !/(^|[.\s])cky-/.test(d.el || '')); agg.small = own.length ? { ...agg.small, det: own, n: Math.max(0, agg.small.n - (agg.small.det.length - own.length)) } : null; }
    if (agg.small && agg.small.n) add('visual', 'P2', 'visual.small-targets', `${agg.small.n} érintési felület 44 px alatt mobilon`, dtl(agg.small).map(d => `${d.el} ${d.w}×${d.h}`), 'Növeld a gomb/link kattintható területét (padding, min-height: 44px), főleg a láblécben és a menüben.', Math.min(10, 2 + 0.3 * agg.small.n));
    if (agg.tiny) add('visual', 'P3', 'visual.tiny', `${agg.tiny.n} szöveg 11 px alatt`, dtl(agg.tiny).map(d => `${d.el} ${d.px}px`), 'Minimum 12–14 px a törzsszövegben és feliratokban.', Math.min(4, 0.5 * agg.tiny.n));
    if (agg.infinite) add('visual', 'P2', 'visual.infinite-motion', `${agg.infinite.n} végtelen animáció csökkentett mozgásnál is fut`, 'prefers-reduced-motion: reduce mellett is mozog', 'Add hozzá: @media (prefers-reduced-motion: reduce) { animation: none }.', 3);
    if (agg.errors) add('visual', 'P2', 'visual.console', `${agg.errors.n} konzol-/oldalhiba`, dtl(agg.errors), 'Nézd meg a böngésző konzolját; harmadik fél szkriptjének hibája is rontja a mérést.', 3);
    if (agg.quirks) add('visual', 'P1', 'visual.quirks', 'Quirks mód: hiányzik a doctype', '', 'Állítsd be a <!doctype html>-t.', 10);
    if (agg.vpmeta) add('visual', 'P1', 'visual.viewport-meta', 'Hiányzik a viewport meta', '', 'Webflow alapból teszi; ellenőrizd a Custom Code-ot.', 15);
  }
  if (P.landing) for (const l of P.landing) {
    if (/felugró réteg/.test(l.mit)) add('visual', 'P1', 'visual.popup-fold', 'Betöltéskor felugró réteg takarja a hajtást', `${l.mit} – ${l.reszlet}`, 'Késleltesd a popupot (legalább 8–10 mp, vagy görgetés/kilépési szándék után), mobilon különösen: ne takarja a H1-et és a CTA-t.', 10);
    else if (/rejtve maradt/.test(l.mit)) add('visual', 'P1', 'visual.hidden-anim', l.mit.replace(/^\S+: /, ''), l.reszlet, 'Az animációs belépő ne hagyja láthatatlanul az elemet (Designer → Interactions → „initial state” + fallback); JS nélkül is látszódjon.', 8);
    else if (/nem töltő kép/.test(l.mit)) {
      // a landing review a lusta (loading=lazy) képeket betöltés előtt is „nem töltő”-nek látja: HTTP-vel ellenőrizzük, tényleg hibás-e
      const names = String(Array.isArray(l.reszlet) ? l.reszlet.join(',') : l.reszlet || '').split(/,\s*/).map(x => x.trim().replace(/…$/, '')).filter(Boolean);
      const allImgs = Object.values(P.vp || {}).flatMap(v => (v.X && v.X.images) || []);
      const bad = [];
      for (const n of names) {
        const img = allImgs.find(i => i.src && decodeURIComponent(i.src).includes(decodeURIComponent(n).slice(0, 40)));
        if (!img) { bad.push(n); continue; }
        const st = await curlStatus(img.src);
        if (!(st && st.code >= 200 && st.code < 400)) bad.push(n);
      }
      if (bad.length) add('visual', 'P1', 'visual.broken-image', `${bad.length} nem töltő kép`, bad.slice(0, 6).join(', '), 'Cseréld/töltsd fel újra a képet (Assets), vagy töröld az elemet.', 18);
    }
  }
  const clsMax = Math.max(...Object.values(P.vp).map(v => v.cls || 0)); P.cls = +clsMax.toFixed(3);
  if (clsMax > 0.25) add('visual', 'P1', 'visual.cls', `Elrendezés-ugrálás: CLS ${clsMax.toFixed(2)} (cél ≤ 0,1)`, 'Betöltés közben ugráló tartalom', 'Adj a képeknek width/height attribútumot vagy aspect-ratio-t, tartalékolj helyet a késve betöltődő blokkoknak, a webfontnál használj font-display: swap + méretazonos tartalék betűt.', 20);
  else if (clsMax > 0.1) add('visual', 'P2', 'visual.cls', `Elrendezés-ugrálás: CLS ${clsMax.toFixed(2)} (cél ≤ 0,1)`, 'Betöltés közben ugráló tartalom', 'Adj a képeknek width/height attribútumot vagy aspect-ratio-t, tartalékolj helyet a késve betöltődő blokkoknak.', 10);
  const imgReq = new Map(); for (const v of Object.values(P.vp)) for (const r of v.imgReqs) { const o = imgReq.get(r.url); if (!o || r.bytes > o.bytes) imgReq.set(r.url, r); }
  const bigImgs = [...imgReq.values()].filter(r => r.bytes > 300 * 1024).sort((a, b) => b.bytes - a.bytes);
  const fileOf = u => decodeURIComponent(u.split('/').pop().split('?')[0]).slice(0, 50);
  for (const r of bigImgs.slice(0, 5)) add('visual', 'P2', `visual.big-image|${fileOf(r.url)}`, `Nagy kép: ${fileOf(r.url)} (${Math.round(r.bytes / 1024)} kB)`, r.url, 'Tömörítsd (cél < 200 kB), méretezd a megjelenített méretre, és tölts fel WebP-t/AVIF-et (Webflow: Assets → Convert to WebP).', 3, 'bi', 15);
  const legacyFmt = [...imgReq.values()].filter(r => /^image\/(png|jpe?g|gif)/.test(r.mime) && r.bytes > 8 * 1024 && !/webclip|favicon/i.test(r.url));
  if (legacyFmt.length) add('visual', 'P3', 'visual.not-webp', `${legacyFmt.length} kép nem WebP/AVIF formátumú (> 8 kB)`, legacyFmt.slice(0, 5).map(r => `${fileOf(r.url)} ${Math.round(r.bytes / 1024)} kB ${r.mime.replace('image/', '')}`), 'Konvertáld WebP-re (Webflow Assets: „Convert to WebP”, vagy tölts fel WebP-t).', Math.min(8, legacyFmt.length));
  const noAlt = X.images.filter(i => i.vis && i.alt === null && i.w > 1 && !/\.svg(\?|$)/i.test(i.src) && i.dw > 24);
  if (noAlt.length) add('visual', 'P2', 'visual.img-no-alt', `${noAlt.length} látható kép alt attribútum nélkül`, noAlt.slice(0, 5).map(i => fileOf(i.src)), 'Írj alt szöveget a képre (Element settings → Alt text); díszképnél hagyd üresen („Decorative”).', Math.min(10, 2 * noAlt.length));
  // alt kötelező (Kristóf, 2026-11-04): minden kép vagy leírást kap, vagy tudatosan díszkép (alt=""); linkben álló díszkép nem lehet
  const linkOnly = X.images.filter(i => i.alt !== null && !i.alt.trim() && i.lk && !i.lk.name && i.w > 1);
  if (linkOnly.length) add('visual', 'P1', 'visual.img-link-no-name', `${linkOnly.length} kép egyedül áll a linkben, alt nélkül: a képernyőolvasó csak a webcímet mondja`, linkOnly.slice(0, 5).map(i => `${fileOf(i.src)} → ${i.lk.href}`), 'A linkben álló kép alt szövege a link célját mondja (CMS-kártyán kösd az alt-ot a tétel nevéhez: Element settings → Alt text → Get alt text from …).', Math.min(10, 2 * linkOnly.length));
  const GENERIC = /^(company logo|logo|image|img|kép|kep|fotó|foto|photo|picture|képernyőfotó|screenshot|untitled|placeholder|banner|icon|ikon)\s*\d*$/i;
  const genericAlt = X.images.filter(i => i.alt && (GENERIC.test(i.alt.trim()) || /\.(png|jpe?g|webp|gif|svg|avif)$/i.test(i.alt.trim()) || /^(img|dsc|image|screenshot)[-_ ]?\d+/i.test(i.alt.trim())));
  if (genericAlt.length) add('visual', 'P2', 'visual.img-generic-alt', `${genericAlt.length} kép alt szövege semmitmondó (pl. „${genericAlt[0].alt.trim().slice(0, 30)}”)`, genericAlt.slice(0, 5).map(i => `${fileOf(i.src)}: „${i.alt.trim().slice(0, 40)}”`), 'Írd le, mi látszik a képen vagy kinek a logója (pl. „Telex logója”); fájlnév és „Company logo” nem alt szöveg.', Math.min(8, 2 * genericAlt.length));
  const bigDeco = X.images.filter(i => i.vis && i.alt !== null && !i.alt.trim() && !i.lk && i.dw >= 280 && i.dh >= 160 && !/\.svg(\?|$)/i.test(i.src));
  if (bigDeco.length) add('visual', 'P3', 'visual.img-big-decorative', `${bigDeco.length} nagy fotó díszképnek jelölve: ellenőrizd, valóban nem hordoz-e tartalmat`, bigDeco.slice(0, 5).map(i => `${fileOf(i.src)} ${i.dw}×${i.dh}`), 'Ha a kép tartalmat mutat (ember, termék, esemény), írj rá alt szöveget; ha csak hangulat, maradhat díszkép.', Math.min(3, bigDeco.length));
  const noRing = desk.focus.filter(f => !f.ring);
  if (desk.focus.length >= 4 && noRing.length / desk.focus.length >= 0.5) add('visual', 'P2', 'visual.focus-ring', `A billentyűs fókusz nem látszik (${noRing.length}/${desk.focus.length} Tab-lépésnél nincs keret)`, noRing.slice(0, 4).map(f => f.el), 'Állíts be látható :focus-visible keretet a DS-ből (outline: 2px solid + offset), ne töröld az outline-t.', 8);
  P.focus = { steps: desk.focus.length, withoutRing: noRing.length };

  // ---- 5. teljesítmény
  const pf = P.perf;
  if (pf.lcpMs > 4000) add('perf', 'P1', 'perf.lcp', `LCP ${(pf.lcpMs / 1000).toFixed(1)} s (cél ≤ 2,5 s)`, `LCP-elem: ${pf.lcpEl}`, 'A hősképet tömörítsd/WebP, ne legyen lazy, kapjon fetchpriority=high-t; kevesebb blokkoló script a fejben.', 25);
  else if (pf.lcpMs > 2500) add('perf', 'P2', 'perf.lcp', `LCP ${(pf.lcpMs / 1000).toFixed(1)} s (cél ≤ 2,5 s)`, `LCP-elem: ${pf.lcpEl}`, 'A hősképet tömörítsd/WebP, ne legyen lazy; kevesebb blokkoló script.', 10);
  if (pf.tbtMs > 600) add('perf', 'P2', 'perf.tbt', `Hosszú feladatok összesen ${pf.tbtMs} ms (TBT-közelítés, cél ≤ 200)`, `${pf.longTasks} hosszú feladat`, 'Vedd ki vagy késleltesd a nehéz harmadik fél szkripteket (chat, mérők), és az indulásnál futó saját kódot.', 18);
  else if (pf.tbtMs > 200) add('perf', 'P2', 'perf.tbt', `Hosszú feladatok összesen ${pf.tbtMs} ms (TBT-közelítés, cél ≤ 200)`, `${pf.longTasks} hosszú feladat`, 'Késleltesd a harmadik fél szkripteket a hozzájárulás/első interakció utánra.', 8);
  if (pf.transferKB > 3072) add('perf', 'P2', 'perf.transfer', `Letöltött adat ${(pf.transferKB / 1024).toFixed(1)} MB (cél ≤ 1,5 MB)`, pf.heaviest, 'A legnehezebb tételek: tömörítsd a képeket, töltsd későbbre (lazy) a hajtás alattit.', 15);
  else if (pf.transferKB > 1536) add('perf', 'P2', 'perf.transfer', `Letöltött adat ${(pf.transferKB / 1024).toFixed(1)} MB (cél ≤ 1,5 MB)`, pf.heaviest, 'Tömörítsd a legnehezebb képeket; a hajtás alatti képek legyenek lazy-k.', 8);
  if (pf.requests > 100) add('perf', 'P3', 'perf.requests', `${pf.requests} kérés betöltéskor (cél ≤ 60)`, '', 'Vonj össze/hagyj el szkripteket, betűtípus-változatokat, ikonokat.', 8);
  else if (pf.requests > 60) add('perf', 'P3', 'perf.requests', `${pf.requests} kérés betöltéskor (cél ≤ 60)`, '', 'Vizsgáld meg a felesleges szkripteket és betűtípus-változatokat.', 4);
  if (pf.thirdPartyHosts.length > 6) add('perf', 'P3', 'perf.third-party', `${pf.thirdPartyHosts.length} harmadik fél gazdagép (cél ≤ 6)`, pf.thirdPartyHosts.slice(0, 8), 'Minden harmadik fél lassít és adatvédelmi teher is; hagyd el, ami nem hoz üzleti értéket.', Math.min(10, 2 * (pf.thirdPartyHosts.length - 6)));
  if (X.headSyncScripts.length) add('perf', 'P3', 'perf.render-blocking', `${X.headSyncScripts.length} renderelést blokkoló szkript a <head>-ben`, X.headSyncScripts.map(s => s.split('/').slice(2, 4).join('/')), 'Tedd defer/async-ra, vagy a body végére (Webflow: Custom Code → Before </body>).', Math.min(8, 2 * X.headSyncScripts.length));

  // ---- 5/b. v3.1: kép-mélyellenőrzés, harmadik fél, lábnyom, terepi adat (CrUX)
  P.images = analyzeImages(P); imageFindings(P, P.images, add);
  thirdPartyFindings(P, add);
  P.carbon = carbonOf(P); carbonFindings(P, add);
  navPageFindings(NAV, pageUrl.pathname, add);
  cruxFindings(P.crux, add);

  // ---- 6. SEO
  const S = X.seo; const isEn = /^\/en(\/|$)/.test(pageUrl.pathname);
  if (!S.title) add('seo', 'P1', 'seo.title-missing', 'Hiányzik a title', '', 'Page settings → SEO → Title tag.', 20);
  else if (S.title.length < 30 || S.title.length > 65) add('seo', 'P3', 'seo.title-len', `A title ${S.title.length} karakter (30–65 ajánlott)`, S.title, 'Igazítsd 50–60 karakterre: kulcsszó elöl, „| beeco” a végén.', 4);
  if (!S.description) add('seo', 'P1', 'seo.desc-missing', 'Hiányzik a meta description', '', 'Page settings → SEO → Meta description (70–160 karakter, benne a haszon és egy cselekvésre hívás).', 15);
  else if (S.description.length < 70 || S.description.length > 160) add('seo', 'P3', 'seo.desc-len', `A meta description ${S.description.length} karakter (70–160 ajánlott)`, S.description, 'Igazítsd 120–155 karakterre.', 4);
  if (!S.canonical) add('seo', 'P1', 'seo.canonical-missing', 'Nincs canonical link', '', 'Page settings → SEO → Canonical URL (vagy Site settings: automatikus).', 10);
  else if (normUrl(S.canonical) !== normUrl(P.finalUrl || P.url)) add('seo', 'P2', 'seo.canonical-other', 'A canonical másik URL-re mutat', `${S.canonical} ≠ ${P.finalUrl || P.url}`, 'Ha nem szándékos, javítsd; staging/webflow.io oldalon a beeco.hu canonical normális.', 5);
  if (!S.ogImage) add('seo', 'P1', 'seo.og-image', 'Nincs og:image: a megosztott link üres kártyával jelenik meg', '', 'Page settings → Open Graph → képfeltöltés (1200×630 px).', 8);
  if (!S.ogTitle) add('seo', 'P2', 'seo.og-title', 'Nincs og:title', '', 'Page settings → Open Graph → Title.', 3);
  if (!S.ogDescription) add('seo', 'P2', 'seo.og-desc', 'Nincs og:description', '', 'Page settings → Open Graph → Description.', 3);
  if (!S.lang) add('seo', 'P1', 'seo.lang-missing', 'Hiányzik az <html lang>', '', 'Site settings → Localization / Language: Hungarian.', 8);
  else if (!isEn && !S.lang.toLowerCase().startsWith('hu')) add('seo', 'P3', 'seo.lang-wrong', `Az oldal nyelve „${S.lang}”, nem hu`, '', 'Állítsd magyarra, hogy a keresők és a felolvasók jól kezeljék.', 3);
  if (!S.jsonld.length) add('seo', 'P2', 'seo.jsonld-missing', 'Nincs JSON-LD strukturált adat', '', 'Tegyél az oldalra Organization (főoldal), BreadcrumbList (aloldal), esetleg FAQPage/Service sémát; Custom Code → <head>.', 5);
  else if (S.jsonld.includes('HIBÁS')) add('seo', 'P1', 'seo.jsonld-invalid', 'Hibás JSON-LD (nem érvényes JSON)', '', 'Ellenőrizd a Rich Results Test-tel, és javítsd a szintaxist.', 10);
  if (pageUrl.pathname.replace(/\/$/, '').split('/').filter(Boolean).length >= 1 && S.jsonld.length && !S.jsonld.includes('BreadcrumbList')) add('seo', 'P3', 'seo.breadcrumb', 'Aloldalon nincs BreadcrumbList JSON-LD', `Meglévő típusok: ${S.jsonld.join(', ')}`, 'Add hozzá a BreadcrumbList sémát (útvonal: Főoldal › … › ez az oldal).', 4);
  if (isEn && !S.hreflang.length) add('seo', 'P2', 'seo.hreflang', 'Az /en oldalon nincs hreflang', '', 'Add hozzá a hreflang alternate linkeket (hu ↔ en, x-default).', 6);

  // ---- 7. jog és bizalom
  const footerNames = () => [...new Set(X.footerLinks.map(l => l.text).filter(Boolean))].slice(0, 14).join(', ') || '–';
  const imp = X.links.filter(l => /impresszum/i.test(l.href + ' ' + l.text)), priv = X.links.filter(l => /adatkezel|adatvedel|adatvédel|privacy/i.test(l.href + ' ' + l.text));
  if (!imp.length) add('legal', 'P1', 'legal.no-impressum', 'Nincs impresszum-link az oldalon', `Lábléc-linkek (${X.footerLinks.length}): ${footerNames()}`, 'Tegyél impresszum linket a láblécbe (a szolgáltató neve, székhelye, elérhetősége, cégjegyzékszáma kötelező elem).', 15);
  else if (!imp.some(l => l.zone === 'footer')) add('legal', 'P3', 'legal.impressum-not-footer', 'Az impresszum-link nem a láblécben van', imp[0].href, 'Tedd a láblécbe, ahol keresik.', 4);
  if (!priv.length) add('legal', 'P1', 'legal.no-privacy', 'Nincs adatkezelési tájékoztató link az oldalon', `Lábléc-linkek (${X.footerLinks.length}): ${footerNames()}`, 'Tegyél „Adatkezelési tájékoztató” linket a láblécbe és az űrlapok mellé (GDPR).', 20);
  else if (!priv.some(l => l.zone === 'footer')) add('legal', 'P3', 'legal.privacy-not-footer', 'Az adatkezelési link nem a láblécben van', priv[0].href, 'Tedd a láblécbe is.', 4);
  const badForms = X.forms.filter(f => f.personal && !f.privacyLink && !f.consent);
  for (const f of badForms) add('legal', 'P1', `legal.form-consent|${f.el}`, `Személyes adatot kérő űrlap (${f.name || f.el}) adatkezelési hivatkozás/hozzájárulás nélkül`, `${f.fields} mező; ${f.vis ? 'látható' : 'rejtett/felugró'}`, 'Tegyél az űrlap alá: „A küldéssel elfogadod az Adatkezelési tájékoztatót” (link) vagy kötelező jelölőnégyzetet.', 12, 'lf', 24);
  const trk = P.cookies.filter(c => TRACKING_COOKIE.test(c)); P.cookieSummary = { all: P.cookies, tracking: trk, banner: P.banner, trackerHosts: P.trackerHosts };
  if (trk.length) add('legal', 'P1', 'legal.cookies-before-consent', `Nyomkövető süti már a hozzájárulás előtt: ${trk.join(', ')}`, `Süti-nevek betöltés után, interakció nélkül; hozzájárulási sáv: ${P.banner ? 'van' : 'NINCS'}`, 'A mérő/marketing szkriptet a hozzájárulás-kezelő (CookieYes) csak elfogadás után indíthatja: állítsd át a szkripteket „blokkolt, amíg nincs hozzájárulás” módba. Ellenőrizd valódi böngészőben is (a sáv EU-IP-n jelenik meg; headlessben téves riasztás lehet).', P.banner ? 12 : 16);
  else if (!P.banner && P.trackerHosts.some(h => !/sender/.test(h))) add('legal', 'P1', 'legal.no-consent-tool', 'Nincs hozzájárulás-kezelő, de mérőkód fut', P.trackerHosts, 'Kapcsold be a hozzájárulási sávot (CookieYes), és blokkold a mérőket elfogadásig. Megjegyzés: a sáv headless böngészőben földrajzi okból hiányozhat; ellenőrizd kézzel is.', 15);
  if (X.price.some(p => !p.afa)) { const np = X.price.filter(p => !p.afa); for (const p of np.slice(0, 4)) add('legal', b2b ? 'P1' : 'P2', `legal.price-vat|${p.price}`, `Ft-ár ÁFA-jelzés nélkül: ${p.price}`, p.text, 'Minden B2B ár mellé írd ki: „+ ÁFA” (beeco-szabály), a csomagárak és a kalkulátor-eredmények mellé is.', 6, 'lv', 24); }
  if (b2b) {
    if (!X.trust.logos) add('legal', 'P2', 'legal.no-logos', 'B2B oldalon nincs partnerlogó-sáv (ds-bizalom / ds-logosor)', '', 'Tegyél partner-/ügyfélembléma-sávot (csak jóváhagyott logók), a hajtás alá vagy az árak elé.', 8);
    if (!X.trust.testimonial) add('legal', 'P2', 'legal.no-testimonial', 'B2B oldalon nincs ügyfél-vélemény / referencia', '', 'Tegyél 1–2 valódi, névvel (és engedéllyel) vett idézetet vagy esettanulmány-linket; kitalált vélemény nem kerülhet fel.', 5);
  }
  // ---- 8. v2: kiegészítő bemenetek (--consent, --field, --search, --webflow) és állítás-kinyerés az ellentmondás-kereséshez
  const have = k => F.some(f => f.key === k);
  // ---- 8/b. v3: UX és felhasználói út, mérés, QA-kör (a visual/links leletek után, hogy deduplikálni lehessen)
  uxFindings(mob.U, desk.U, add, have, { path: pageUrl.pathname.replace(/\/$/, '') || '/', isEn, b2b });
  measureFindings(P.measure, add, have, { b2b });
  if (P.qa) {
    qaFindings(P.qa, add, have); qaMatrixFindings(P.qa.matrix, add, have); qaBrowserFindings(P.qa.browsers, add); qaModeFindings(P.qa.modes, add, have);
    // konzol és hibás válaszok (a két nézet böngészőjéből)
    const nets = Object.values(P.vp).map(v => v.net).filter(Boolean);
    const errs = [...new Set(nets.flatMap(n => n.errors))]; const fails = [...new Map(nets.flatMap(n => n.failed).map(f => [f.url, f])).values()];
    if (errs.length && !have('visual.console')) add('visual', 'P2', 'visual.console', `${errs.length} konzol-/oldalhiba`, errs.slice(0, 4), 'Nézd meg a böngésző konzolját; harmadik fél szkriptjének hibája is rontja a mérést.', 3);
    const firstParty = fails.filter(f => { try { return FIRST_PARTY.test(new URL(f.url).hostname); } catch { return false; } });
    const crit = firstParty.filter(f => /^(script|stylesheet|font|document|xhr|fetch)$/.test(f.type));
    for (const f of crit.slice(0, 3)) add('visual', 'P1', `visual.failed-resource|${f.url.split('/').slice(-2).join('/')}`, `Első fél erőforrás hibás: ${f.status} ${f.type} – ${f.url.split('/').slice(-2).join('/')}`, f.url, 'Töltsd fel újra / javítsd a linket; a hiányzó szkript vagy stílus az oldal működését töri.', 6, 'fres', 12);
    const rest = fails.filter(f => !crit.includes(f));
    if (rest.length) add('visual', 'P2', 'visual.failed-requests', `${rest.length} hibás válasz (4xx/5xx) betöltéskor`, rest.slice(0, 5).map(f => `${f.status} ${f.type} ${f.url.split('/').slice(2, 5).join('/')}`), 'Javítsd vagy vedd ki a hibás kérést (kép, betűtípus, harmadik fél).', Math.min(6, 2 * rest.length));
  }
  if (P.consent) consentFindings(P.consent, add, have);
  P.field = lookup(FIELD, P.url) || undefined; fieldFindings(P.field, add);
  P.clarity = clarityFor(CLARITY, P.finalUrl || P.url) || undefined;
  const probe = P.measure && P.measure.probe; clarityFindings(P.clarity, add, { long: !!(probe && probe.vh && probe.height / probe.vh >= 3) });
  P.search = lookup(SEARCH, P.url) || undefined;
  if (SEARCH) searchFindings(P.search, { indexable: P.status < 400 && !/noindex/i.test((P.xRobots || '') + ' ' + X.seo.robots), gscComplete: !!SEARCH.meta._gsc_complete, hasGsc: [...SEARCH.byPath.values()].some(v => v.gsc) }, add);
  P.webflow = lookup(WF, P.url) || undefined;
  if (WF) webflowFindings(WF, P.webflow, { inSitemap: P.webflow?.noindex ? await inSitemap(P.url) : null, add, have });
  P.claims = extractClaims([...X.blocks.map(b => b.text), ...X.metaText]);
  P.linkSource = (X.links || []).map(l => ({ abs: l.abs, zone: l.zone }));

  P.metrics = { links: L, trust: X.trust, ux: desk.U ? { h1: desk.U.fold.h1 && desk.U.fold.h1.text, ctas: desk.U.hero.ctas.length, solids: desk.U.hero.solids, words: desk.U.density.words, sections: desk.U.density.sections, nominalPer100: desk.U.read.nominalPer100 } : null, forms: X.forms.length, price: X.price.length, h1: h1.map(h => h.text), reading: P.reading, ds: { share: +share.toFixed(3), embeds: X.embeds.length, inlineStyle: X.inlineStyle.length }, seo: S };
  P.dsDetail = { topLegacy: ds.topLegacy, nDs: ds.nDs, nLegacy: ds.nLegacy, nMixed: ds.nMixed, nNeutral: ds.nNeutral };

  // ---- összegzés
  const scores = {}; for (const [k] of DIMS) scores[k] = Math.max(0, Math.round(100 - F.filter(f => f.dim === k).reduce((s, f) => s + f.pont, 0)));
  let total = DIMS.reduce((s, [k, , w]) => s + scores[k] * w / 100, 0);
  if (P.status >= 400) total = Math.min(total, 40);
  P.scores = scores; P.total = Math.round(total); P.band = band(P.total);
  P.findings = F.map(f => ({ ...f, impact: +(f.pont * WEIGHT[f.dim] / 100).toFixed(2) })).sort((a, b) => SEVORD[a.sev] - SEVORD[b.sev] || b.impact - a.impact);
  return P;
}

// ---------------------------------------------------------------- jelentés
const maskPII = x => String(x || '').replace(/[\w.+-]+@([\w-]+\.[\w.-]+)/g, '…@$1').replace(/\+?\d[\d\s().-]{6,}\d/g, '…');
const cell = s => String(s ?? '').replace(/\|/g, '/').replace(/\n/g, ' ');
function renderReport(pages, compare, meta, extra = {}) {
  const L = [];
  L.push(`# beeco weboldal-audit`, '', `Futtatva: ${meta.when} · nézetek: ${meta.viewports} · eszköz: beeco-weboldal-audit ${VERSION}`, '');
  L.push('## Összkép', '', `| Oldal | Összpont | Sáv | ${DIMS.map(([, n, w]) => `${n} (${w} %)`).join(' | ')} |`, `|---|---|---|${DIMS.map(() => '---').join('|')}|`);
  for (const p of pages) L.push(p.fatal ? `| ${p.url} | 0 | D | nem tölthető be: ${cell(p.fatal)} |` : `| ${p.url} | **${p.total}** | **${p.band}** | ${DIMS.map(([k]) => p.scores[k]).join(' | ')} |`);
  L.push('', 'Sávok: A ≥ 90 · B ≥ 75 · C ≥ 60 · D < 60. Ha az oldal HTTP 4xx/5xx, a végpontszám legfeljebb 40.', '');
  L.push(...gateMd(extra.gate));
  if (compare) {
    const nw = compare.filter(c => c.old && c.addedDetail && c.addedDetail.length).flatMap(c => c.addedDetail.map(f => ({ ...f, url: c.url }))).sort((a, b) => SEVORD[a.sev] - SEVORD[b.sev]);
    L.push('## Új hibák az előző futás óta', '');
    if (!nw.length) L.push('_Nincs új lelet az előző futáshoz képest._', '');
    else { L.push('| Súly | Oldal | Mi a baj |', '|---|---|---|'); for (const f of nw) L.push(`| ${f.sev} | ${f.url} | ${cell(f.title)} |`); L.push(''); }
  }
  if (compare) {
    L.push('## Előtte → utána', '');
    for (const c of compare) {
      L.push(`### ${c.url}`, '');
      if (!c.old) { L.push('_Ez az oldal nem szerepelt a régi mérésben._', ''); continue; }
      L.push('| | Előtte | Utána | Változás |', '|---|---|---|---|', `| **Összpont** | ${c.old.total} (${c.old.band}) | ${c.now.total} (${c.now.band}) | ${fmtD(c.now.total - c.old.total)} |`);
      for (const [k, n] of DIMS) L.push(c.old.scores[k] == null ? `| ${n} | – (új dimenzió) | ${c.now.scores[k]} | – |` : `| ${n} | ${c.old.scores[k]} | ${c.now.scores[k]} | ${fmtD(c.now.scores[k] - c.old.scores[k])} |`);
      L.push('', `Megoldott leletek: ${c.resolved.length ? c.resolved.map(t => cell(t)).join('; ') : '–'}`, '', `Új leletek: ${c.added.length ? c.added.map(t => cell(t)).join('; ') : '–'}`, '');
    }
    L.push(...visualMd(compare));
  }
  if (extra.trend && extra.trend.length) L.push('## Változás az előző futáshoz képest', '', ...extra.trend, '');
  const all = pages.filter(p => p.findings).flatMap(p => p.findings.filter(f => !(p.status >= 400 && f.key !== 'page.status')).map(f => ({ ...f, page: p.slug })));
  const maxS = maxSessions(pages), withField = maxS > 0;
  const sessOf = Object.fromEntries(pages.map(p => [p.slug, p.field?.sessions]));
  const prio = f => +(f.impact * sessionWeight({ field: { sessions: sessOf[f.page] } }, maxS)).toFixed(2);
  const top = [...all].map(f => ({ ...f, prio: prio(f) })).sort(withField ? (a, b) => b.prio - a.prio || b.impact - a.impact : (a, b) => b.impact - a.impact || SEVORD[a.sev] - SEVORD[b.sev]).slice(0, 10);
  L.push(`## A 10 legfontosabb javítás (${withField ? 'prioritás' : 'hatás'} szerint)`, '', `| # | Súly | Oldal | Terület | Mi a baj | Mit javíts | Hatás az összpontra |${withField ? ' Munkamenet | Prioritás |' : ''}`, `|---|---|---|---|---|---|---|${withField ? '---|---|' : ''}`);
  top.forEach((f, i) => L.push(`| ${i + 1} | ${f.sev} | ${f.page} | ${DIMNAME[f.dim]} | ${cell(f.title)} | ${cell(f.fix)} | −${f.impact} |${withField ? ` ${sessOf[f.page] ?? '–'} | ${f.prio} |` : ''}`));
  if (!top.length) L.push(`| | | | | Nincs automatikus lelet | | |${withField ? ' | |' : ''}`);
  L.push('', '_A „hatás” azt mutatja, hány ponttal csökkenti a lelet az oldal összpontszámát (levonás × a terület súlya)._' + (withField ? ' _A „prioritás” = hatás × (0,25 + 0,75 × az oldal valós munkamenetei / a legtöbb munkamenet): a sok látogatót érintő hiba kerül előre._' : ''), '');
  L.push(...fieldMd(pages), ...cruxMd(pages, CRUX_KEY ? '' : 'Nincs terepi adat: nincs kulcs (CRUX_API_KEY környezeti változó). A labor-mérés érvényes, a valós látogatói INP/LCP/CLS nem ellenőrizhető. Nincs levonás.'), ...clarityMd(pages, CLARITY), ...carbonSiteMd(pages), ...searchMd(pages, extra.searchT), ...(extra.consistency !== undefined ? consistencyMd(extra.consistency) : []), ...graphMd(extra.graph));
  L.push(...eventMapMd(extra.eventMap, pages.filter(p => !p.fatal).length), ...(extra.ctaCons ? ctaConsistencyMd(extra.ctaCons) : []));
  L.push(...navMd(extra.nav));
  if (extra.site && extra.site.notFound) { const n = extra.site.notFound; L.push('## Site-szintű ellenőrzések (nem pontoz)', '', `- 404-oldal: ${n.url} → HTTP ${n.status ?? '–'}${n.page ? ` · főoldal-link: ${n.page.home ? 'van' : n.page.homeText ? 'a „' + n.page.homeText.text + '” gomb ide mutat: ' + n.page.homeText.path : 'NINCS'} · kapcsolat: ${n.page.contact ? 'van' : 'NINCS'} · keresés: ${n.page.search ? 'van' : 'nincs'} · menü: ${n.page.nav ? 'van' : 'nincs'}` : ''}${n.error ? ' · hiba: ' + n.error : ''}`); for (const f of extra.site.findings || []) L.push(`  - ${f.sev}: ${f.title}${f.fix ? ' – ' + f.fix : ''}`); L.push(''); }
  for (const p of pages) {
    L.push(`---`, '', `## ${p.url}`, '');
    if (p.fatal) { L.push(`**Nem tölthető be:** ${p.fatal}`, ''); continue; }
    if (p.status >= 400) L.push(`> **Az oldal HTTP ${p.status}-t ad**, ezért a többi terület a hibaoldalt méri, nem a tervezett tartalmat. Először az elérhetőséget javítsd, aztán futtasd újra.`, '');
    L.push(`HTTP ${p.status}${p.finalUrl && normUrl(p.finalUrl) !== normUrl(p.url) ? ` (átirányítva: ${p.finalUrl})` : ''} · **${p.total} / 100, sáv: ${p.band}**${p.runtimeSec != null ? ` · futási idő: ${p.runtimeSec} mp${p.timing ? ` (mérés ${p.timing.measureSec ?? '–'} mp, mátrix ${p.timing.matrixSec ?? '–'} mp, módok ${p.timing.modesSec ?? '–'} mp; a többi: teljesítmény, képek, axe, zárra várakozás)` : ''}` : ''}`, '');
    L.push(`| ${DIMS.map(([, n]) => n).join(' | ')} |`, `|${DIMS.map(() => '---').join('|')}|`, `| ${DIMS.map(([k]) => p.scores[k]).join(' | ')} |`, '');
    const pf = p.perf;
    L.push('**Mérőszámok**', '',
      `- Teljesítmény (mobil, ${pf.throttle}): LCP ${(pf.lcpMs / 1000).toFixed(2)} s · FCP ${(pf.fcpMs / 1000).toFixed(2)} s · TTFB ${pf.ttfbMs} ms · TBT-közelítés ${pf.tbtMs} ms · CLS ${p.cls} · ${pf.transferKB} kB / ${pf.requests} kérés · harmadik fél: ${pf.thirdPartyHosts.length} gazda`,
      `- Design system: ${Math.round(p.metrics.ds.share * 100)} % DS-osztályos elem (${p.dsDetail.nDs} DS / ${p.dsDetail.nLegacy} régi) · ${p.metrics.ds.embeds} embed · ${p.metrics.ds.inlineStyle} inline style` + (p.dsDetail.topLegacy.length ? ` · leggyakoribb régi osztályok: ${p.dsDetail.topLegacy.slice(0, 8).map(l => `${l.cls}×${l.n}`).join(', ')}` : ''),
      `- Linkek: ${p.metrics.links.internal} belső, ${p.metrics.links.external} külső, ${p.metrics.links.anchor} horgony, ${p.metrics.links.mailto} mailto, ${p.metrics.links.tel} tel · ${p.metrics.links.checked} URL ellenőrizve (${p.metrics.links.skipped} kihagyva)`,
      `- CTA a hajtás fölött – mobil: ${maskPII(p.primaryCta.mobile.join(' | ')) || 'NINCS'}; asztali: ${maskPII(p.primaryCta.desktop.join(' | ')) || 'NINCS'}`,
      `- Tartalom: H1: ${p.metrics.h1.map(t => `„${t}”`).join(', ') || 'NINCS'} · ${p.reading.sentences} mondat, átlag ${p.reading.avgWords} szó, ${p.reading.longPct} % > 25 szó`,
      `- Süti betöltéskor (interakció nélkül): ${p.cookieSummary.all.join(', ') || 'nincs'} · hozzájárulási sáv: ${p.cookieSummary.banner ? 'van' : 'nincs'}`);
    if (p.field) L.push(`- Valós felhasználók (Clarity): LCP ${p.field.lcp_ms != null ? (p.field.lcp_ms / 1000).toFixed(2) + ' s' : '–'} · INP ${p.field.inp_ms ?? '–'} ms · CLS ${p.field.cls ?? '–'} · dühös/halott kattintás ${p.field.rage_clicks ?? '–'}/${p.field.dead_clicks ?? '–'} · görgetés ${p.field.scroll_depth_pct ?? '–'} % · ${p.field.sessions ?? '–'} munkamenet`);
    if (p.search) { const g = p.search.gsc || {}, a = p.search.ga4 || {}; L.push(`- Keresés/forgalom: GSC ${g.clicks ?? '–'} kattintás / ${g.impressions ?? '–'} megjelenés${g.position != null ? `, poz. ${(+g.position).toFixed(1)}` : ''} · GA4 ${a.sessions ?? '–'} munkamenet${p.search.prev?.ga4?.sessions != null ? ` (előző: ${p.search.prev.ga4.sessions})` : ''}${p.search.bing ? ` · Bing ${p.search.bing.clicks ?? '–'}/${p.search.bing.impressions ?? '–'}` : ''}`); }
    if (p.carbon) L.push(`- Weboldal-lábnyom: **${p.carbon.g.toFixed(3).replace('.', ',')} g CO2e / megtekintés** (${p.carbon.rating} sáv, ${(p.carbon.kb / 1024).toFixed(2)} MB, ${p.carbon.viewport} nézet, első látogatás; ${p.carbon.model})`);
    if (p.crux && p.crux.level) L.push(`- Terepi adat (CrUX, ${p.crux.level === 'url' ? 'URL' : 'origin'}-szint, mobil, p75): LCP ${p.crux.lcp != null ? (p.crux.lcp / 1000).toFixed(2) + ' s' : '–'} · INP ${p.crux.inp ?? '–'} ms · CLS ${p.crux.cls ?? '–'}`);
    L.push('');
    L.push('', ...imagesMd(p.images), ...thirdPartyMd(p));
    L.push(...consentMd(p.consent), ...webflowMd(p));
    L.push(...measureMd(p), ...uxMd(p), ...qaMd(p, ''));
    if (p.warnings.length) L.push('**Figyelmeztetések az eszköztől:** ' + p.warnings.map(cell).join(' · '), '');
    L.push('**Képernyőképek (a kézi átnézéshez – nézd meg őket!)**', '', ...Object.entries(p.shots).map(([k, f]) => `- ${k}: ${f}`), '');
    L.push('**Leletek**', '');
    if (!p.findings.length) L.push('_Nincs automatikus lelet._', '');
    else { L.push('| Súly | Terület | Mi a baj | Bizonyíték | Mit javíts | Levonás |', '|---|---|---|---|---|---|'); for (const f of p.findings) L.push(`| ${f.sev} | ${DIMNAME[f.dim]} | ${cell(f.title)} | ${cell(f.evidence)} | ${cell(f.fix)} | −${f.pont} |`); L.push(''); }
  }
  L.push('---', '', '## Amit a gép nem lát (kötelező kézi kör)', '', 'Nézd át a képernyőképeket és a kontaktlapot, és menj végig a `reference/kezi-lista.md` listán: 5 mp-es teszt, három perszóna útja (magánszemély app-letöltő, céges HR/ESG döntéshozó, önkormányzati referens), egy elsődleges CTA, ár + ÁFA, bizonyíték, kifogáskezelő GYIK, űrlap-súrlódás; tesztelői lista (smoke, böngészők, eszközök, űrlapok, akadálymentesség, mérés-ellenőrzés GA4 DebugView-ban); oldalak közti ellentmondások; a CTA oda visz-e, amit a felirata ígér.', '',
    'Korlátok: a teljesítmény labor-mérés (headless Chromium, 4× CPU-lassítás, hálózat nem lassított), a TBT közelítés; a CookieYes-sáv földrajzi okból headlessben hiányozhat; a külső linkeknél a közösségi oldalak ki vannak hagyva; a belépett/űrlap-küldés utáni állapotok nincsenek mérve (csak olvas). v3: a mérési kör a küldést megakadályozza, ezért a GA4/Clarity tényleges beérkezését (DebugView, Realtime, Live) élesítés után kézzel ellenőrizd; a CTA-esemény 500 ms-os ablakban mért; a webkit/firefox csak telepítve mérhető (egyébként „nem mérve”); a lassú 4G szám az analitika blokkolása miatt kissé optimista; az igés CTA-felirat és a főnévi stílus közelítés; a szerveroldali GA4-beállítások (konverzió-jelölés, Enhanced measurement) innen nem látszanak.', '');
  return L.join('\n');
}
const fmtD = d => (d > 0 ? `+${d}` : d === 0 ? '±0' : `${d}`);

// ---------------------------------------------------------------- futtatás
// a böngésző egy hosszú (sitemap) futás közben összeomolhat: ilyenkor újraindítjuk, és az oldalt egyszer újramérjük
let browser = await chromium.launch();
async function liveBrowser(force = false) {
  if (force || !browser.isConnected()) {
    // a régit késleltetve zárjuk, hogy a párhuzamos szál éppen futó mérését ne vágjuk el
    const old = browser; browser = await chromium.launch(); console.log('  ↻ a böngésző újraindult');
    setTimeout(() => old.close().catch(() => {}), 120000).unref();
  }
  return browser;
}
const pages = new Array(targets.length);
const consentLimit = opt.consentPages > 0 ? opt.consentPages : opt.sitemap ? 3 : Infinity;
await pool(targets.map((u, i) => [u, i]), opt.concurrency, async ([url, i]) => {
  console.log(`\n■ [${i + 1}/${targets.length}] ${url}`);
  try {
    let P = null; const mfile = join(OUT, slugOf(url), 'measure.json');
    if (opt.cache && existsSync(mfile)) { try { P = JSON.parse(readFileSync(mfile, 'utf8')); P.warnings = [...(P.warnings || []), 'A mérés a --cache kapcsolóval a korábbi futásból jött (nem friss).']; } catch { P = null; } }
    if (!P) {
      P = await measurePage(await liveBrowser(), url);
      // a böngésző összeomláskor még „élőnek” látszhat, ezért az újramérés mindig friss böngészővel megy
      if (P.fatal && /has been closed|Target closed|browser has disconnected/i.test(P.fatal)) P = await measurePage(await liveBrowser(true), url);
      if (!P.fatal) writeFileSync(mfile, JSON.stringify(P));
    }
    if (P.fatal) { P.scores = Object.fromEntries(DIMS.map(([k]) => [k, 0])); P.total = 0; P.band = 'D'; P.findings = []; console.log(`  ✗ nem tölthető be: ${P.fatal}`); }
    else {
      if (opt.consent && i < consentLimit) P.consent = await consentTest(await liveBrowser(), P.finalUrl || url, { isThird: h => !FIRST_PARTY.test(h) });
      P.crux = (await cruxForPage(P.finalUrl || url, { key: CRUX_KEY, cacheDir: CACHE_DIR, originCache: CRUX_ORIGINS })) || undefined;
      await scorePage(P);
      console.log(`  ${P.slug}: ${P.total}/100 (${P.band}) · ${DIMS.map(([k]) => `${k} ${P.scores[k]}`).join(' · ')} · ${P.findings.length} lelet`);
    }
    pages[i] = P;
  } catch (e) { console.error(`  ✗ hiba: ${e.stack || e}`); pages[i] = { url, slug: slugOf(url), fatal: String(e.message).slice(0, 200), scores: Object.fromEntries(DIMS.map(([k]) => [k, 0])), total: 0, band: 'D', findings: [], warnings: [], shots: {} }; }
});

// ---- ellentmondások oldalak között
let consistency = null;
if (opt.consistency !== false && pages.filter(p => !p.fatal).length >= 2) {
  try { consistency = findContradictions(pages.filter(p => !p.fatal && p.claims), JSON.parse(readFileSync(resolve(opt.facts || join(SKILL_DIR, 'reference/tenyek.json')), 'utf8'))); console.log(`\nEllentmondás-keresés: ${consistency.groups.length} oldalak közti, ${consistency.facts.length} jóváhagyott tényektől eltérő`); }
  catch (e) { console.error('Az ellentmondás-keresés hibázott: ' + e.message); }
}
// ---- linkgráf
let graph = null;
if (opt.sitemap || opt.graph) { graph = buildGraph(pages.filter(p => !p.fatal), SITEMAP?.all || null, SITEMAP?.total || null); console.log(`Linkgráf: ${graph.orphans.length} árva, ${graph.navOnly.length} csak menüből elérhető, ${graph.badLinks.length} hibás/átirányított belső link${graph.partial ? ' (részleges gráf)' : ''}`); }

// ---- v3: CTA-következetesség, mérési térkép, 404-oldal (site-szint)
const okPages = pages.filter(p => !p.fatal);
const ctaCons = okPages.length >= 2 ? ctaConsistency(okPages) : null;
const evMap = eventMap(okPages);
const site = { notFound: null, findings: [] };
if (opt.sitemap || (!opt.fast && okPages.length)) {
  try {
    const origins = [...new Set(okPages.map(p => new URL(p.url).origin))].filter(o => /beeco\.hu$/.test(new URL(o).hostname) || opt.sitemap);
    if (origins.length) { site.notFound = await qa404(browser, origins[0], curlStatus); site.findings = qa404Findings(site.notFound); console.log(`404-ellenőrzés: ${site.notFound.url} → HTTP ${site.notFound.status ?? '–'}${site.findings.length ? ' · ' + site.findings.length + ' lelet' : ''}`); }
  } catch (e) { console.error('A 404-ellenőrzés hibázott: ' + e.message); }
}

// ---- előtte → utána (+ képi összevetés)
let compare = null;
if (opt.compare) {
  try {
    const cp = resolve(opt.compare); const isDir = existsSync(cp) && statSync(cp).isDirectory();
    const oldJson = isDir ? join(cp, 'audit.json') : cp, oldDir = isDir ? cp : dirname(cp);
    const old = JSON.parse(readFileSync(oldJson, 'utf8'));
    compare = pages.map(p => {
      const pathOf = u => { try { return new URL(u).pathname.replace(/\/+$/, '') || '/'; } catch { return u; } };
      // először pontos URL, aztán útvonal szerint (így a staging webflow.io és az élő beeco.hu is összemérhető)
      const o = (old.pages || []).find(x => normUrl(x.url) === normUrl(p.url)) || (old.pages || []).find(x => pathOf(x.url) === pathOf(p.url));
      if (!o) return { url: p.url, old: null };
      const ok = new Set((o.findings || []).map(f => f.key)), nk = new Set((p.findings || []).map(f => f.key));
      return { url: p.url, old: { total: o.total, band: o.band, scores: o.scores }, now: { total: p.total, band: p.band, scores: p.scores }, _o: o,
        resolved: (o.findings || []).filter(f => !nk.has(f.key)).map(f => `${f.sev} ${f.title}`), added: (p.findings || []).filter(f => !ok.has(f.key)).map(f => `${f.sev} ${f.title}`),
        addedDetail: (p.findings || []).filter(f => !ok.has(f.key)).map(f => ({ sev: f.sev, key: f.key, title: f.title })) };
    });
    for (let i = 0; i < compare.length; i++) {
      const c = compare[i], p = pages[i]; const o = c._o; delete c._o;
      if (!c.old || p.fatal) continue;
      c.visual = [];
      const labels = [['mobil', MOBILE_VP], ['asztali', DESKTOP_VP]].filter(([, vp], k, arr) => arr.findIndex(([, v]) => v.join('x') === vp.join('x')) === k);
      for (const [label, vp] of labels) {
        const oldImg = [join(oldDir, o.slug || slugOf(p.url), `${label}-teljes.png`), o.shots?.[`${label}-teljes`]].filter(Boolean).find(f => existsSync(f)) || join(oldDir, o.slug || slugOf(p.url), `${label}-teljes.png`);
        const newImg = p.shots?.[`${label}-teljes`];
        const v = !newImg ? { error: 'nincs új teljes oldalas kép' } : resolve(oldImg) === resolve(newImg) ? { error: 'a régi és az új kép ugyanaz a fájl (azonos mappa)' } : await diffImages(browser, oldImg, newImg, join(OUT, p.slug, `diff-${vp.join('x')}.png`));
        compare[i].visual.push({ viewport: `${label} ${vp.join('x')}`, ...v });
        if (v.error) console.log(`  képi összevetés (${p.slug} ${label}): ${v.error}`); else console.log(`  képi összevetés (${p.slug} ${label}): ${v.changed.length}/${v.bandCount} megváltozott sáv, magasság ${v.heightChange >= 0 ? '+' : ''}${v.heightChange} px`);
      }
    }
  } catch (e) { console.error('A --compare nem futott le: ' + e.message); }
}
// ---- élesítési kapu
const gateOn = opt.gate !== false && targets.length >= 1;
site.findings = [...(site.findings || []), ...navSiteFindings(NAV)];
const gate = gateOn ? evaluateGate(pages, loadExceptions(join(SKILL_DIR, 'reference/kivetelek.json')), { site: site.findings }) : null;
if (ENGS_P) { try { const e = await ENGS_P; for (const v of Object.values(e)) if (v.available) await v.browser.close(); } catch {} }
await browser.close();

// ---- forgalmi összegek, előzmények, trend
const searchT = SEARCH ? searchTotals(SEARCH, pages) : null;
const origin = new URL(opt.sitemap || targets[0]).origin;
const histFile = opt.history === undefined ? (opt.trend !== undefined ? defaultHistoryPath(os.homedir()) : null) : opt.history === true ? defaultHistoryPath(os.homedir()) : resolve(opt.history);
const traffic = searchT && (searchT.sessions != null || searchT.clicks != null) ? { clicks: searchT.clicks, impressions: searchT.impressions, sessions: searchT.sessions, bingClicks: searchT.bingClicks, range: searchT.range } : null;
const entry = buildHistoryEntry(pages, { origin, version: VERSION, consistency, graph, traffic }, DIMS);
const prevEntry = histFile ? readHistory(histFile).filter(e => e.origin === origin).pop() : null;
if (opt.history !== undefined && histFile) { appendHistory(histFile, entry); console.log(`Előzmény hozzáfűzve: ${histFile}`); }
const trend = trendLines(prevEntry, entry);
let trendFile = null;
if (opt.trend !== undefined) { trendFile = opt.trend === true ? join(OUT, 'trend.html') : resolve(opt.trend); const r = writeTrend(readHistory(histFile), trendFile, { historyFile: histFile }); console.log(`Trend: ${trendFile} (${r.runs} futás)`); }

const cpages = pages.filter(p => p.carbon && !p.fatal);
const carbonSummary = cpages.length ? { model: 'Sustainable Web Design v4', gPerGB: 148.2, pages: cpages.length, avgG: +(cpages.reduce((s, p) => s + p.carbon.g, 0) / cpages.length).toFixed(3), maxG: Math.max(...cpages.map(p => p.carbon.g)) } : null;
const meta = { when: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC', viewports: opt.viewports };
const slim = pages.map(p => { const { vp, linkSource, ...rest } = p; return { ...rest, vp: Object.fromEntries(Object.entries(vp || {}).map(([k, v]) => [k, { mobile: v.mobile, cls: v.cls, focus: v.focus, overflow: v.X.overflow, imageCount: v.X.images.length, net: v.net }])) }; });
writeFileSync(join(OUT, 'audit.json'), JSON.stringify({ tool: 'beeco-weboldal-audit', version: VERSION, generated: new Date().toISOString(), viewports: opt.viewports, weights: WEIGHT, pages: slim, compare,
  consistency, graph, search: searchT, history: entry, trendFile, gate, measureMap: evMap, ctaConsistency: ctaCons, site, options: { fast: opt.fast, gate: gateOn, concurrency: opt.concurrency }, inputs: { field: opt.field ? FIELD.count : null, search: opt.search ? SEARCH.count : null, webflow: opt.webflow ? { pages: WF.count, siteId: WF.siteId, collectedAt: WF.collectedAt } : null, sitemap: SITEMAP ? { origin: opt.sitemap, total: SITEMAP.total, crawled: SITEMAP.urls.length } : null,
    crux: CRUX_KEY ? { pagesWithData: pages.filter(p => p.crux && p.crux.level).length } : 'nincs kulcs', clarity: CLARITY.source ? { source: CLARITY.source, pages: CLARITY.byPath.size } : CLARITY.note, trace: opt.trace },
  carbon: carbonSummary }, null, 2));
writeFileSync(join(OUT, 'report.md'), renderReport(pages, compare, meta, { consistency: consistency ?? undefined, graph, searchT, trend, gate, eventMap: evMap, ctaCons, site, nav: NAV }));
console.log(`\nKész: ${join(OUT, 'report.md')}\n      ${join(OUT, 'audit.json')}`);
console.log(`Futási idő oldalanként: ${pages.filter(p => p.runtimeSec != null).map(p => `${p.slug} ${p.runtimeSec} mp`).join(' · ') || '–'}`);
const blockedAll = pages.reduce((s, p) => s + Object.values(p.measure?.blocked || {}).reduce((a, n) => a + (+n || 0), 0) + (p.qa?.matrix?.blocked || 0) + (p.qa?.modes?.blocked || 0), 0);
const leakedAll = pages.reduce((s, p) => s + (p.measure?.leaked || 0) + (p.qa?.matrix?.leaked || 0) + (p.qa?.modes?.leaked || 0), 0);
console.log(`Biztonság: a védett (mérő/QA) környezetekben ${blockedAll} kimenő kérés megszakítva (analitika/sender/Webflow-űrlap/írás); kijutott: ${leakedAll}; letiltott beküldés: ${pages.reduce((s, p) => s + (p.measure?.submitBlocked || 0), 0)}`);
if (gate) { gateConsole(gate); process.exit(gate.pass ? 0 : 3); }
process.exit(pages.some(p => (p.findings || []).some(f => f.sev === 'P0')) ? 2 : 0);
