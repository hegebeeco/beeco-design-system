# Javaslat 43 – A főoldal formája DS-szinten, natív Webflow-elemekkel

**Állapot:** jóváhagyva (Kristóf, 2026-11-23), szakaszosan épül, csak a tesztcímre. Élesre Kristóf publikál, szakaszonként.
**Felelős:** Claude (Opus 5.5), tömeges átállítás Sonnet-ágens, független ellenőrzés Opus.

## Kristóf döntései (2026-11-23)
1. **Forma:** a főoldal formája az új DS-alap: döntött fekete címke, árnyékos (döntött) telefon-mockup, árnyékos domb.
   A folyamatos mozgás (hero-váltó, lebegő méh, biccentő gombok a szekciókban) csak a főoldalon marad. A többi oldalon csak egyszeri belépő mozgás van.
   Ez felülírja a Javaslat 39 (Ági, Nora) 5. és 13. pontját.
2. **Sorrend:**
   - előbb a közös komponensek;
   - utána a főoldal is ezekből épül;
   - ezt követi a próba 3 oldalon (Rólunk, Cégeknek, Letöltés);
   - Kristóf jóváhagyása után jön a többi oldal.
3. **Menü:** a lebegő sáv (C) és a külön dobozos lenyíló **minden oldalra** kerül.
4. **Takarítás:** Claude listát ad, Kristóf kattint (Style Manager → „Clean up”; a komponenseket a lista alapján törli).
   Nem törölhető: `NAVBAR_REGI_BACKUP`, `NAVBAR_MEGA`, `ROLUNK_ERTEKEK`, `CSAPAT_FOTOSLIDER`.

## Elv: natív, ahol lehet
- A forma natív Webflow-osztály vagy -komponens, DS-változókhoz kötve, hogy a Designerben finomhangolható legyen.
- Amit a Webflow nem tud natívan (kulcskocka-animáció, `:has()`, konténer-lekérdezés, nyitott állapot), az egy kicsi, verziózott site-szkriptbe kerül, a forrás a repóban.

## Elemek
| # | Elem | Most | Cél |
|---|---|---|---|
| 1 | Menü (C lebegő sáv, külön dobozos lenyíló, biccentő „Töltsd le!”, lefelé elbújik) | **kész a tesztcímen** | natív: `menu`, `menu-sav`, `menu-panel`, `menu-lista`, `menu-most`, combo `menu.menu-rejt`; site-szkript `beecoMenuSav` 1.0.0 (`weboldal/kozos/navigacio/menu-sav.js`) |
| 2 | Domb-elválasztó árnyékkal | **kész** | `DS · Domb` árnyékos (R4); CsicsergŐsz `cs-domb` kakaó árnyékkal. Vízadás: nyitott |
| 3 | Letöltés-blokk (egyforma áruházgombok, QR, telefonon egy gomb) | **kész** | `DOWNLOAD_BLOCK`: asztalon 2 áruházgomb (4 px sarok) + QR, ≤767 px-en egy gomb (`dl-egygomb`, /app/letoltes); változat „Áruházgombok telefonon is”. A kézzel épített blokkok (pl. Letöltés oldal) változatlanok |
| 4 | Telefon-mockup + funkciócímke | **kész** | `ds-appkepernyo` 4° dőlés, kemény árnyék, fehér flekk (::before); új `ds-funkcio*` osztálycsalád és a komponensben Funkciócímke-kapcsoló + propok (név, alcím, piktogram). A címke nem vált a képpel (statikus); ahol a képernyőkép már tartalmaz címkét (Térkép), kikapcsolva |
| 5 | Címke (szalag) | **kész** | `ds-szalag` −2°; kampányszínhez kombó (`cs-kakao`) |
| 6 | Hátterek | **kész** | `ds-sejt` (hatszögminta, maszkkal) a DS · App letöltés szekcióban; `ds-flekk` (fehér flekk) |
| 7 | Logósáv | **kész** | site-szkript `beecoLogosor` 1.0.0 (`weboldal/kozos/logosor/`): 5 (telefonon 3) logó után „+N további”, gomb: `ds-logo-tobb` |
| 8 | Képnézegető | **kész** | site-szkript `beecoKepnezo` 1.0.0 (`weboldal/kozos/kepnezo/`): `dialog`, nyilak, Esc, felirat az alt szövegből; kinézet natív osztályokon (`ds-nezo*`) |
| 9 | Méh (lebegő szuperhős) | **kész** | `DS · Méh` komponens (`ds-meh`, mozgás nélkül); első helye: /rolunk „Mit tegyünk együtt?” |
| 10 | Főoldal | **kész** | 79 `fo-` osztály egyszerű szabályai natív Webflow-stílusok (`nativ.py`, `nativ.json`); az embedekben (2 db, 28 KB) csak a mozgás, a töréspontok, az összetett kijelölők és 14 sorrendérzékeny deklaráció maradt. Ellenőrzés: 630 elem, 1440/768/390 px, 0 stíluseltérés. A menü-duplikáció kikerült (fo.js@dbf9f4e4) |

## A `fo-` osztálycsalád hivatalosan DS (Kristóf döntése, 2026-11-25)
- A főoldal `fo-` osztályai a web DS része (a `ds-`, `fs-`, `cs-`, `bc-`, `menu-` mellett); a weboldal-audit DS-szabálya ezt ismeri (`audit.mjs`, `cfgX.ds`).
- A főoldalon minden szöveges elem nevesített `fo-` osztályt kapott (82 elem, a Designerben hangolható):
  `fo-focim` (H1), `fo-cim` (szekciócím), `fo-nev` (funkciónév), `fo-szam-ertek` és `fo-szam-cimke` (számsor), `fo-lepes-cim` és `fo-lepes-szoveg` (három lépés),
  `fo-gomb-szoveg` (áruházgomb felirata), `fo-bizalom-elem` és `fo-bizalom-szam` (értékelések a hero alatt), `fo-lanc-elem` (Tanulunk → Kitartunk),
  `fo-velemeny-szoveg` (vélemények), `fo-ut-cim` (Merre tovább? csempék), `fo-termek-nev` (beebolt), `fo-kerdes-elem` (záró kérdések).
  Az új osztályok üresek: a kinézetet továbbra is a meglévő `fo-` szabályok adják, a Designerben itt lehet felülírni.

## Kampányoldal: CsicsergŐsz (Kristóf kérése, 2026-11-23)
A grafikák és a tartalom maradnak, a forma a főoldalé, a fekete helyett kakaó. Kész a tesztcímen: a meglévő szekciócímkék (Levi szövegei) döntött kakaó DS-címkeként
(egy elakadt animáció eddig elrejtette őket, az MME-fejléccel együtt), kakaó kampánygombok, árnyékos domb, döntött árnyékos telefon fehér flekkel és funkciócímkével (Madártérkép, Madár album,
CsicsergŐsz), a közös DS-elemek kakaó kerete. Részletek: `weboldal/kampany-csicsergosz/README.md`.
Az új főoldal (`/fooldal-uj`) kint van a tesztcímen (nem piszkozat, `noindex`); az átállás Kristóf kattintása.

## Élesítés előtti kapu (2026-11-23, tesztcím, 8 oldal)
Formálisan egyik oldal sem ment át. Okok:
- A CookieYes nem fut a webflow.io-címen: „nincs sütisáv / hozzájárulás-kezelő” (P1) minden oldalon, a pontszám emiatt 85 alatt. Élesítés után a beeco.hu-n kell ellenőrizni (`--kor eles-utan`, `meres-ellenor.mjs --env live`).
- `/fooldal-uj` noindex (P0): szándékos az átállásig.
- Rólunk és Cégeknek LCP: élesben is ~4 s, nem a mai változás okozza.
- Térkép: 404 a `maps.prod.beeco.hu` ikonra (régi, a térkép-embedből).
- K04: a menü a `/cegeknek` hubra mutat, a mérő a `/szolgaltatas/cegeknek` címet keresi (a kapu beállítása).
Jelentés: scratchpad `audit-2026-11-23/report.md` és `audit-cs/`.

## Biztonsági szabály a szakaszokra
A közös elemek minden oldalon egyszerre változnak. Egy éles publikálás a félkész szakaszt is kivinné, ezért
élesíteni csak akkor szabad, ha Claude egy szakaszt „kész, ellenőrizve” jelzéssel átadott.

## Ellenőrzés szakaszonként
- Tesztcím, 1440 és 390 px; a 6 mintaoldalon: menü, kilógás, JS-hiba.
- Szakasz végén független Opus-ellenőrzés.
- A visszaállítás forrása: `weboldal/kozos/navigacio/mentes-2026-11-23-lebego-sav.json` (és a további szakaszok mentései).
