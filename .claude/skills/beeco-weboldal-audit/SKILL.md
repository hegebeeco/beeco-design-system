---
name: beeco-weboldal-audit
description: Ismételhető, pontozott (0–100, A–D sáv), kilencszempontú szakmai átvizsgálás egy beeco.hu (Webflow) oldalra, oldalcsoportra vagy az egész webhelyre – design system és natív építés, linkek és gombok, érthetőség és tartalom, vizuál és UX, teljesítmény, SEO, jog és bizalom, mérés és marketing-analitika (van-e elég mérés), UX és felhasználói út – plusz tesztelői (QA) kör és élesítési kapu (PASS/FAIL). Gépi mérés + a modell kötelező kézi köre; oldalak közti ellentmondás-keresés, sütihozzájárulás-teszt, árva oldalak, valós felhasználói (Clarity), keresési és forgalmi (Search Console, GA4, Bing), valamint Webflow-oldali adatok, havi trend és képi összevetés. Jelentés magyarul (Top 10 javítás, előtte–utána). Használd minden beeco.hu oldal átnézésénél, élesítés előtt, új vagy átdolgozott oldal után és a havi növekedési ellenőrzésnél; akkor is, ha „nézd át az oldalt”, „mennyire jó ez az oldal?”, „audit”, „kész van?”, „mi hibádzik a weboldalon?” hangzik el.
---

# beeco weboldal-audit (v3.0)

Egy parancs, amely egy, több vagy az összes beeco.hu oldalt kilenc szempont szerint megmér, 0–100 pontot és A–D sávot ad, élesítési kaput (PASS/FAIL) értékel, és a leleteket súlyosság szerint (P0–P3), bizonyítékkal és „Mit javíts” javaslattal listázza. A gép a mérhetőt viszi; a **kézi kör** (képek, szöveg, CTA-k) a te dolgod, nélküle nincs „kész”.

Viszony a többi skillhez: a `minosegkapu` az általános UI-kaput adja (a szkript hívja: `ui_audit.mjs`, `landing_review.mjs`); a `beeco-persona-test` a felhasználói hatékonyságot méri; ez az audit az oldal **állapotát és hibáit**. Sorrend: audit → javítás → persona-teszt, ha nagyobb változás volt.

## Mikor használd
- Bármely beeco.hu oldal átnézése; **élesítés előtt** (a jelentés a kérés melléklete); **havi növekedési ellenőrzés** (lent).
- Nem ide való: játék (→ `beeco-arculat`/`beeco-jatek`), Flutter-app, admin/partner felület.

## Futtatás
```bash
export NODE_PATH=$HOME/CLAUDE/beeco-ds-fooldal/node_modules   # Playwright
node ~/.claude/skills/beeco-weboldal-audit/scripts/audit.mjs \
  https://www.beeco.hu/szolgaltatas/cegeknek https://www.beeco.hu/ \
  --out <scratchpad>/audit-YYYY-MM-DD [--compare <régi mappa vagy audit.json>]
```
- Alap kapcsolók: `--viewports 390x844,1440x900` · `--compare` előtte→utána + képi összevetés · `--no-reuse` (gyorsabb, `minosegkapu`-szkriptek nélkül) · `--skip-external` · `--cache` (az `--out` mappa korábbi `measure.json`-jait használja, nem mér újra) · `--rubric` (pontozási szabályok).
- Kilépési kód: 0 rendben (kapu PASS), **3 ha bármely oldal a kapun FAIL**, 1 használati hiba; 2 (P0 lelet) csak `--no-gate` esetén. Időigény: **teljes futás ~3–6 perc/oldal** (lassabb, de minden kitett oldalra kötelező), `--fast` ~1,5–2,5 perc.
- Kimenet: `<out>/report.md`, `<out>/audit.json` (gépi; a v1 mezők változatlanok, újak: `consistency`, `graph`, `search`, `history`, `inputs`, `compare[].visual`), oldalanként `<out>/<oldal>/` (`mobil|asztali-hajtas|teljes.png`, `measure.json`, `diff-<nézet>.png`).
- Csak olvas: nem küld űrlapot; a mérési/QA környezet minden kimenő analitikai/űrlap-kérést megszakít és a navigációt letiltja (számláló a jelentésben); az egyetlen küldő jellegű kattintás a `--consent` tesztben a sütisáv gombja. Az URL lehet élő vagy staging (`*.webflow.io`); draft oldalt nem tudsz mérni.

## Új kapcsolók (v2)
| Kapcsoló | Mit csinál |
|---|---|
| `--consistency` / `--no-consistency` | Oldalak közti ellentmondás-kereső: számok és évszámok kulcsszó szerint (letöltés, partner, vízadó, liter, fa, díjak…), normalizálva (25.000+ = 25 000 = 25e); eltérés oldalak közt (P2) és a `reference/tenyek.json` jóváhagyott tényeitől (P1). ≥ 2 URL-nél alapból be. Nem pontoz. |
| `--sitemap <origin>` `--limit N` `--concurrency 2` | A `sitemap.xml` URL-jeit járja be (felső szintű oldalak előre, a bejelentkezési/pénztár oldalak a végén). Alapból `--no-reuse`; `--full` visszakapcsolja. Linkgráf: árva oldal (P2), csak menüből elérhető (P3), hibás/átirányított belső link (P1), 10 legtöbbet linkelt oldal. `--limit` mellett a gráf részleges (a jelentés jelzi). |
| `--history [fájl]` · `--trend [html]` | Egy összegző sort fűz a `.jsonl`-hoz (dátum, origin, oldalszám, átlagpont, területek átlaga, P0–P3, ellentmondások, gráf, forgalom, 10 legrosszabb oldal); a `--trend` önálló `trend.html`-t ír (SVG-grafikonok, világos/sötét). Fájl nélkül: `~/.claude/skills/beeco-weboldal-audit/data/history.jsonl` (gitignore-olt), a trend `<out>/trend.html`. |
| `--field <json>` | Valós felhasználói adat (Clarity) a labor mellett; leletek: INP > 200/500 ms, LCP > 2,5/4 s, CLS, dühös/halott kattintás; **Prioritás** oszlop a munkamenetek szerint. |
| `--search <json>` | Search Console + GA4 + Bing, aktuális és előző időszak: CTR < 1 % sok megjelenésnél, 5–15. pozíció, munkamenet > 20 %-os esés (P1), 0 megjelenés. Alak és lekérdezések: `reference/bigquery.md`. |
| `--webflow <json>` | Webflow MCP-vel gyűjtött oldal-adatok (draft, noindex, linkek -regi/draft oldalra, embed, fejkód, komponensek). Gyűjtés: `scripts/webflow-collect.md`. |
| `--consent [--consent-pages N]` | Sütihozzájárulás-teszt friss környezetekkel (előtte / „Elutasítom” + 5 mp / „Elfogadom” + 5 mp). Sitemap módban alapból az első 3 oldalra fut. |
| `--compare <mappa\|json>` | Pontszám előtte→utána, megoldott/új leletek, és oldalanként × nézetenként a teljes oldalas kép 400 px-es sávos összevetése (> 2 % eltérés = „Megváltozott szakasz”, P3). |

Korlátok: a süti-teszt headlessben, nem EU-IP-ről eltérhet egy valódi látogatótól (a sáv földrajzilag célzott lehet): „nincs sütisáv” lelet esetén nézd meg kézzel. Az ellentmondás-kereső mondatszinten, heurisztikával dolgozik: minden találatot nézz meg. A képi összevetés animációra, csúszkára is érzékeny.

## v3: mérés, UX, QA, kapu (részletek: `reference/v3-meres-ux-qa.md`)
| Kapcsoló | Mit csinál |
|---|---|
| `--fast` | Kihagyja a nézetméret-mátrixot, a böngészőket és a módokat (sötét, csökkentett mozgás, 200 %, JS nélkül, lassú 4G). Alapból **teljes futás** (lassabb, de teljes). A mérés, UX, axe, billentyűzet és űrlap-ellenőrzés `--fast`-ban is fut. |
| `--gate` / `--no-gate` | Élesítési kapu (alapból **be**, ha van URL): PASS, ha összpont ≥ 85, nincs P0, nincs P1 (kivéve a `reference/kivetelek.json` le nem járt bejegyzései: `{path\|"*", key, ok_reason, until}`); oldalanként és összesítve PASS/FAIL, exit 3 ha FAIL. |
| `--concurrency N` | Párhuzamos oldalak (alap: 2). |

- **Mérés és marketing-analitika (10 %)**: GA4, Clarity, Search Console-meta, Consent Mode (a `config` előtt), sütisáv; **CTA-szimuláció** (kattintás, navigáció és küldés nélkül): az elsődleges CTA-k 500 ms-on belül küldenek-e eseményt, lefedettség % (P1: kulcs-CTA, P2: egyéb); görgetésmélység; űrlap küldés-mérési horog (a küldés nélkül); belső utm_ (P2); esemény-nevek snake_case; **„Mérési lefedettség” tábla** oldalanként és **mérési térkép** site-szinten.
- **UX és felhasználói út (10 %)**: Nielsen-heurisztikák, 5 mp-es teszt 390 és 1440 px-en (H1, értékajánlat, CTA, kép), CTA-hierarchia (1 elsődleges), olvashatóság, tegező hang („Ön”, „kérjük” → P2), mobil (≥ 16 px, hüvelykujj-zóna), bizalom az űrlap közelében, űrlap-hibamegelőzés.
- **QA-kör** (a leletek a megfelelő dimenzióba mennek, a jelentésben pass/fail mátrix): nézetméret-mátrix 320–1920 px + **kontaktlap** (`kontakt-<oldal>.png`), böngészők (chromium; webkit/firefox csak ha telepítve, különben „nem mérve”), módok, axe-core (critical/serious → P1), Tab × 40 billentyűzet-folyam, 404-oldal (sitemap mód), konzol/hálózat. `--compare` esetén a jelentés tetején **„Új hibák az előző futás óta”**.
- Új `audit.json` mezők: `pages[].measure|qa`, `gate`, `measureMap`, `ctaConsistency`, `site` (a v2 mezők változatlanok; a `weights` az újak szerint). Régi `--compare` fájl új dimenzió nélkül is összevethető.

## v3.1: kép-mélység, terepi adat, harmadik fél, Clarity-viselkedés, lábnyom (részletek és küszöbök: `reference/pontozas.md`, „v3.1” szakasz)
| Mit mér | Kulcsok | Megjegyzés |
|---|---|---|
| **Képek**: lusta LCP-kép, túlméretes kép, hiányzó width/height, képek összsúlya, régi formátum; oldalankénti képtábla (top 8) | `perf.lcp-lazy` (P1), `visual.oversized-image\|fájl`, `visual.img-no-dimensions`, `perf.image-weight`, `visual.legacy-format\|fájl` | Az LCP-csomópont tényleges `loading` attribútumát nézi (nem osztálynevet). Javítás Webflowban: kép → Loading: Eager + fetchpriority = high |
| **Terepi adat** (Chrome UX Report): valós LCP/INP/CLS p75, mobil | `perf.field-lcp`, `perf.field-inp`, `perf.field-cls` (rossz P1, javítandó P2) | `CRUX_API_KEY` környezeti változó; URL-szint, ennek hiányában origin-szint (a jelentés jelzi). Kulcs/adat nélkül tájékoztató sor, levonás nélkül. 24 órás gyorsítótár: `data/cache/` |
| **Harmadik fél költsége**: gazdánként kB, kérés, főszál-ms; top 6 tábla | `perf.third-party\|gazda` (> 150 kB vagy > 150 ms, P2), `perf.stripe-outside-shop` (P2) | A főszál-idő külön, 4× lassított betöltésből jön (CPU-profiler); `--no-trace` kihagyja |
| **Clarity-viselkedés**: dühös/halott kattintás, gyors visszalépés, görgetési mélység | `ux.clarity-rage\|dead\|quickback\|scroll` (P2) | `CLARITY_API_TOKEN` (Data Export API, 1 hívás/futás, 24 órás gyorsítótár) vagy `--clarity-file`. ≥ 30 munkamenet kell oldalanként |
| **Weboldal-lábnyom**: g CO2e / megtekintés, A+–F sáv | `perf.carbon` (P3, csak ha > 0,5 g) | Sustainable Web Design v4, első látogatás; becslés, nem hitelesített mérés |

- **Környezeti változók** (soha nem kerülnek fájlba, naplóba vagy jelentésbe): `CRUX_API_KEY`, `CLARITY_API_TOKEN` (és a már meglévő `BING_WEBMASTER_API_KEY`).
- **Új kapcsolók**: `--clarity-file <json>` (egyszerű alak: `{ "<url vagy útvonal>": { "sessions": 120, "rageClicks": 3, "deadClicks": 14, "quickBacks": 9, "scrollDepth": 41 } }`; a három kattintás-mutató a munkamenetek **száma**, vagy `…Pct` néven %-ban; `scrollDepth` átlag %-ban; az API válaszának tömbje is jó) · `--no-trace` (a harmadik fél főszál-idő mérését kihagyja, ~10–15 mp/oldal megtakarítás).
- **Új `audit.json` mezők**: `pages[].images`, `pages[].crux`, `pages[].clarity`, `pages[].carbon`, `pages[].perf.thirdParty|lcpInfo`, `carbon` (site-összegzés), `inputs.crux|clarity|trace`. A meglévők változatlanok.
- **Nem mér**: valós INP laborban (csak a CrUX-ból), az iframe-ek (pl. reCAPTCHA) főszál-idejét (a bájtjukat igen), hozzájárulás utáni harmadik fél költséget, CSS-háttérképek renderelt méretét.

**Élesítési kapu: minden kitett oldal (élesre kerülő vagy élő) csak akkor mehet élesbe / maradhat, ha átmegy a kapun; a FAIL listát Kristófnak meg kell mutatni az élesítési kérés előtt.** Kivételt (`kivetelek.json`) csak Kristóf döntésére, indokkal és lejárati dátummal veszel fel; P0 és a 85-ös küszöb nem kivételezhető.

## A kör
1. **Cél**: melyik oldal(ak)? Staging vagy élő? Új oldal: előbb Webflow tesztre (`publish_site` üres `customDomains`-szal), 200-as válasz után mérj.
2. **Gépi mérés**: `audit.mjs`. Crash vagy üres eredmény esetén ne folytasd a számokkal.
3. **Kézi kör (kötelező)**: képernyőképek és kontaktlap (mobil + asztali, hajtás + teljes), majd `reference/kezi-lista.md`: reviewer-lista (5 mp-es teszt, három perszóna útja: app-letöltő, HR/ESG döntéshozó, önkormányzati referens) és tesztelői lista (smoke, böngészők, eszközök, űrlapok, akadálymentesség, mérés-ellenőrzés GA4 DebugView-ban élesítés után): kinek szól 5 mp alatt, egy elsődleges CTA, ár + ÁFA, bizonyíték, GYIK, űrlap-súrlódás, minden CTA oda visz-e, amit ígér. Az „Ellentmondások” szakasz találatait nyisd meg a forrásoldalon, és döntsd el, melyik igaz (a jóváhagyott tény: `reference/tenyek.json`). A kézi leleteket P0–P3 szinttel a jelentés végére.
4. **Javítás**: P0 → P1 → Top 10 hatás/prioritás szerint → P2 → P3. Webflow-ban csak Designer/MCP-n át, teszten; élesre nem.
5. **Újramérés**: ugyanaz a parancs `--compare <régi mappa>`-val. Legfeljebb két javító kör, a maradék indokolt kivétel vagy döntés Kristófnak.
6. **Jelentés Kristófnak (magyarul, tegezve, röviden)**: kapu-ítélet oldalanként (PASS/FAIL), pont előtte → utána, sáv; 3–6 legfontosabb javítás emberi nyelven; mi maradt és mi dönt Kristóf; mit nem mértél. Ha csapatnak szól: publikáld artifactként.

## Havi növekedési ellenőrzés
Havonta egyszer (Kristóf célja: havi +30 % forgalom). Mappa: `<scratchpad>/audit-YYYY-MM`.
1. **Clarity (valós adat)**: a kulcsoldalakra (főoldal, /szolgaltatas/cegeknek, kampányoldalak, /en és a legtöbb látogatós 5–10 oldal) a `mcp__Microsoft_Clarity__query-analytics-dashboard` eszközzel, **egyszerű, egy mutatós kérdésekkel**, időszakkal és teljes URL-lel, pl. „Core Web Vitals for URL https://www.beeco.hu/x for mobile in the last 7 days”, „Rage clicks and dead clicks by page URL in the last 7 days”, „Sessions by page URL in the last 7 days”, „Scroll depth for URL … in the last 7 days”. Írd `clarity.json`-ba (scratchpad): `{ "<url vagy /útvonal>": { "lcp_ms", "inp_ms", "cls", "rage_clicks", "dead_clicks", "scroll_depth_pct", "sessions" } }`; az időket **ezredmásodpercbe** váltsd, a hiányzó mezőt hagyd ki (ne írj nullát).
2. **Keresés és forgalom**: ha az exportok léteznek, a `reference/bigquery.md` lekérdezéseit futtasd a BigQuery MCP-vel (`mcp__66d0fab0-11ab-4ba6-893e-93068c2732e4__execute_sql_readonly`, projekt `<PROJEKT>`, alap: `beeco-406415`), és állítsd össze a `search.json`-t (aktuális 28 nap + előző 28 nap, `_range`, `_site`). Bing: `BING_WEBMASTER_API_KEY` környezeti változóból, a kulcsot soha ne írd ki. Ha az adatkészlet még nincs (Not found), hagyd ki, és írd le.
3. **Webflow-oldali ellenőrzés**: a `scripts/webflow-collect.md` lépései szerint `webflow.json` az auditált oldalakra (csak olvasó hívások).
4. **Futtatás**:
```bash
node …/audit.mjs --sitemap https://www.beeco.hu --history --trend <out>/trend.html \
  --field clarity.json --search search.json --webflow webflow.json --consent --out <scratchpad>/audit-YYYY-MM
```
   Teljes oldal módban alapból **teljes QA** fut (lassú: oldalszám × 3–6 perc / párhuzamosság), ezért háttérben indítsd (`run_in_background`), és a kapu-ítéletet a végén nézd; gyors, előszűrő körhöz `--fast`, de élesítési döntéshez teljes futás kell.
5. **Jelentés Kristófnak, 5 sorban a múlt hónaphoz képest** (a `report.md` „Változás az előző futáshoz képest” szakasza adja): átlagpont és sáv; P0/P1 darabszám; forgalom (munkamenet, kattintás) a +30 % célhoz; a 3 legfontosabb új/megmaradt hiba (prioritás szerint); ellentmondások és árva oldalak száma. A trend-oldalt (`trend.html`) csatold; csapatnak artifactként publikáld.

## Pontozás (részletek: `reference/pontozas.md`, vagy `--rubric`)
Kilenc terület (v3): Design system és natív építés 15 % · Linkek és gombok 10 % · Érthetőség és tartalom 15 % · Vizuál és UX 10 % · Teljesítmény 10 % · SEO 10 % · Jog és bizalom 10 % · **Mérés és marketing-analitika 10 %** · **UX és felhasználói út 10 %** (a v2-ben hét terület: 20/15/20/15/10/10/10; a v2 és v3 összpontja nem összevethető). Minden terület 100-ról indul, a leletek levonásával 0-ig csökken; összpont = súlyozott átlag. **Sáv: A ≥ 90 · B ≥ 75 · C ≥ 60 · D < 60**; HTTP 4xx/5xx oldalon legfeljebb 40.
Súlyosság: **P0** az oldal nem teljesíti a célját (nem elérhető, noindex) · **P1** konverziót, jogot, mérést ront (élesítés előtt javítandó) · **P2** rendszer-/vizuális eltérés · **P3** csiszolás. A Top 10 hatás szerint (`--field`-del prioritás szerint) rendez. Az ellentmondások, linkgráf, képi összevetés, mérési térkép, CTA-következetesség és a 404-ellenőrzés nem pontoznak (a site-szintű P0/P1 lelet a kaput bukja; a 404-ellenőrzés most P2/P3).

## Szabályok
- **Élesre publikálni mindig Kristóf kifejezett igenje után szabad**; az audit és a javítás a teszten (`webflow.io`) fut; nem üres `customDomains` = éles.
- Nem küldesz űrlapot, nem írsz valódi személyes adatot sehova. A repó nyilvános: titok, API-kulcs, személyes e-mail/telefonszám nem kerülhet ide (a Bing-kulcs csak környezeti változóban).
- A szkript által mért szám irány, nem igazság: a P0/P1 leleteket nézd meg szemmel (pl. a süti-lelet headlessben téves lehet).
- Bővítsd a `reference/tiltolista.json`-t új elírással és a `reference/tenyek.json`-t, ha Kristóf új számot hagy jóvá.
- Nem mér: belépett/űrlap-küldés utáni állapotot, valódi telefont és hálózatot, képernyőolvasót, a szöveg tartalmi igazságát, jogi megfelelést, azt hogy a GA4/Clarity ténylegesen megkapja-e az eseményt (a küldés tiltva: élesítés után nézd DebugView-ban), a GA4 szerveroldali beállításait, a nem telepített webkit/firefox motorokat („nem mérve”).

## Fájlok
- `scripts/audit.mjs` (belépési pont) · `lib-consistency.mjs`, `lib-site.mjs` (sitemap, gráf, előzmény), `trend.mjs`, `consent.mjs`, `visual-diff.mjs`, `lib-inputs.mjs` (field/search/webflow) · v3: `lib-measure.mjs` (mérés, védett környezet), `lib-ux.mjs`, `lib-qa.mjs`, `lib-gate.mjs` · v3.1: `lib-images.mjs`, `lib-thirdparty.mjs` (harmadik fél + lábnyom), `lib-realdata.mjs` (CrUX + Clarity) · `webflow-collect.md`
- `reference/`: `pontozas.md`, `kezi-lista.md`, `tiltolista.json`, `tenyek.json`, `bigquery.md`, `v3-meres-ux-qa.md`, `kivetelek.json` (kapu-kivételek)
- `data/` (gitignore-olt): `history.jsonl`, `cache/` (CrUX és Clarity válaszok, 24 óra)

## Kötelező navigációs ellenőrzés (2026-11-04)
Minden futás része, a kapu nélküle FAIL (`nav.missing`). A mérő magától lefuttatja (≈ 5–8 perc a teljes webhelyre, utána 24 órán át gyorsítótárból):
1. `scripts/nav-crawl.py` – a sitemap minden oldalának linkjei területenként (menü / lábléc / tartalom), gombok, kimenő linkek, a menü szerkezete;
2. `scripts/nav-analyze.py` – kattintásmélység, árva oldalak, látogatói utak legrövidebb útja, gomb- és link-szabályok;
3. `scripts/nav-journeys.mjs` – **valódi kattintásteszt**: a `reference/nav-utak.json` minden útját asztalon és telefonon (hamburgermenüvel, lassú 4G) végigkattintja, és méri, hogy jó oldalra érkezik-e, hány mozdulat kell, és mennyi idő alatt jelenik meg a céloldal.
Kapcsolók: `--nav-fresh` (újrafuttatás), `--nav <nav-adat.json>` (kész eredmény), `--no-nav` (csak fejlesztéshez; a kapu ekkor FAIL).
Szükséges: `python3`, Playwright (a mérő többi részéhez is). Határértékek és források: `reference/pontozas.md` → Navigáció.
Az eredmény a kapu-artifact „Navigáció” fülén is megjelenik (látogatói utak, térkép, gomb- és link-táblázat).
