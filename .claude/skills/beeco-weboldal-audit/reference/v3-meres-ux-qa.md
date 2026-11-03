# v3: mérés, UX és QA – mit mér pontosan a gép

Ez a fájl a `SKILL.md` részletes háttere. A pontszámok szabályai: `pontozas.md` / `--rubric`. Kézi lista: `kezi-lista.md`.

## Biztonsági modell (csak olvas)
A mérési és QA-kör egy **védett Playwright-környezetben** fut (`lib-measure.mjs › openGuarded`):
- **Kimenő kérések megszakítása route-szinten**: GA/GTM collect, Clarity collect, Meta, LinkedIn, Bing, sender.net, Webflow-űrlap végpontok, valamint **minden nem-GET kérés** (sendBeacon, fetch POST). A számlálók a jelentésben: `blocked` (analitika / sender / Webflow-űrlap / egyéb írás), `leaked` (ha mégis válasz érkezett volna: ennek 0-nak kell lennie).
- **Navigáció letiltva** betöltés után (route-abort + a nem-horgony linkek kattintásának `preventDefault`-ja + `window.open` kiváltva).
- **Nem kattint beküldő gombra**, a `submit` eseményt letiltja; az űrlapokat csak DOM-mal vizsgálja (klónon `checkValidity`, attribútumok).
- A „mit küldene el” a burkolóból látszik: `dataLayer.push`/`gtag()` hívások (init-szkript), a megszakított GA4-kérés `en=` neve (érték nélkül), `clarity()` hívások.
- A `--consent` teszt kivétel: a sütisáv gombját kattintja, élő környezetben (régi viselkedés).
- A régi mérési környezetek (teljesítmény, képernyőkép) nem blokkolnak: ezek a böngészőből jövő valódi látogatást utánozzák.

## Mérés (`measure`, 10 %)
Címkék: GA4 (gtag config / GTM / collect-kérés), Clarity, Search Console (meta; a DNS-es igazolás nem látható), Consent Mode alapértelmezés a `config` előtt, sütisáv. Eseménylefedettség: minden elsődleges CTA (ds-gomb, button_main, menü-CTA, áruházi gombok, mailto/tel, kimenő linkek, horgony-CTA-k, `data-*-cta`) valódi egérkattintással (ha takarja valami: szintetikus), 500 ms-on belül jön-e esemény; görgetés az aljáig (scroll_depth / GA4 scroll). Űrlap: van-e küldés-mérési horog (a kódban a `submit`-figyelő a mérőhívással, `data-*-cta`, Webflow-megfigyelő). UTM-higiénia: belső linken utm_ tilos (P2), áruházi linkeken forgalom-forrás jelölés kell. Esemény-nevek: snake_case, ≤ 40 karakter. Kimenet: „Mérési lefedettség” tábla oldalanként, „Mérési térkép” (esemény-nevek) site-szinten.

## UX és felhasználói út (`ux`, 10 %)
Nielsen-heurisztikák (rendszerállapot: siker/hiba-üzenet magyarul; valós világ: nincs angol felület; felhasználói kontroll: morzsamenü, Esc; következetesség: azonos felirat = azonos cél; hibamegelőzés: címke, kötelező, típus, autocomplete, ≤ 8 mező; felismerés: menü aktív állapot; rugalmasság: ugrólink; minimalizmus: ≤ 14 szekció; súgó: GYIK, lábléc-kapcsolat), első benyomás 390 és 1440 px-en (H1, ≥ 8 szavas értékajánlat, CTA, kép), CTA-hierarchia a hero-ban (1 elsődleges, ≤ 2 CTA, igés felirat ≤ 4 szó), olvashatóság (főnévi stílus, magázó fordulat → P2, mert a házstílus tegez), mobil (≥ 16 px törzs, hüvelykujj-zóna), sorhossz (≤ 90 karakter), bizalom az űrlap közelében (logó/vélemény/garancia/adatkezelési jegyzet egy nézeten belül).
Közelítések (nézd meg kézzel): az igés CTA-felirat és a főnévi stílus szabályalapú; a hüvelykujj-zóna a CTA y-pozíciójából következik.

## QA (a megfelelő dimenzióba pontoz; mátrix a jelentésben)
- **Nézetméret-mátrix**: 320×640, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080: vízszintes kilógás, kivágott szöveg (overflow:hidden + scrollWidth/Height), egymást takaró rögzített elemek, érintési cél (< 24 px P1, < 44 px P2). Képek: `<out>/<oldal>/qa/qa-<WxH>.png`, kontaktlap: `<out>/kontakt-<oldal>.png` (Playwright canvas).
- **Böngészők**: chromium mindig; webkit/firefox csak ha telepítve (`npx playwright install webkit firefox` – rendszerszintű telepítés, csak ha kell). Különben a jelentésben „nem mérve”.
- **Módok**: sötét séma (csak a világoshoz képest ÚJ láthatatlan/gyenge szöveg számít), csökkentett mozgás (látható szöveg < 90 % → P1), 200 % nagyítás (720 px CSS-viewport, 2×: kilógás, használható menü), JS nélkül (< 60 % → P1), lassú 4G (CDP: 1,6 Mbit/s, 150 ms RTT, 4× CPU, 390 px: hero és LCP; az analitika blokkolva, ezért kissé optimista).
- **axe-core**: a helyi `node_modules/axe-core` (különben cdnjs 4.9.1), WCAG 2.0–2.2 A/AA szabályok; critical/serious → P1, moderate → P2, minor → P3; a `ui_audit` és a saját leletekkel deduplikálva.
- **Billentyűzet**: Tab × 40: fókusz látszik-e (outline/box-shadow/stílusváltozás), csapda, első fókusz ugrólink-e; Enter a hero-CTA-n; felugró réteg és mobil menü Esc-re.
- **Űrlapok** (DOM): üres klón `checkValidity`, e-mail „abc” elutasítás, címkék, siker/hiba-üzenet magyarul.
- **404**: sitemap módban (és teljes futásnál) `GET /nem-letezo-oldal-<véletlen>`: státusz 404, főoldal-link, kapcsolat/keresés.
- **Konzol és hálózat**: JS-hiba, 4xx/5xx válaszok (első fél JS/CSS/betűtípus → P1).
- **Regresszió**: `--compare` esetén a jelentés tetején „Új hibák az előző futás óta”.

## Élesítési kapu (`--gate`, alapból be)
PASS, ha összpont ≥ 85, nincs P0, és nincs P1 (kivéve a `kivetelek.json` le nem járt bejegyzései). Kilépési kód: 0 PASS, 3 FAIL (a `--no-gate` a régi kódokat adja: 2 = P0). A FAIL lista kerül a Kristófnak szóló kérésbe.

## Futásidő
Teljes futás oldalonként kb. 3–6 perc (a mérés ~1 perc, a QA-kör a többi); `--fast` (mátrix, böngészők, módok nélkül) kb. 1,5–2,5 perc. A site gyors/lassú betöltése erősen számít. Sitemap módban ≈ oldalszám × idő / párhuzamosság (alap: 2).
