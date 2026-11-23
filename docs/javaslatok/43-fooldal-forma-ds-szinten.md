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
| 2 | Domb-elválasztó árnyékkal | `DS · Domb` már árnyékos (R4) | ellenőrizni minden változatot; kampány-dombok külön kérdés |
| 3 | Letöltés-blokk (egyforma áruházgombok, QR, telefonon egy gomb) | `DOWNLOAD_BLOCK`, `DS · App letöltés` régi formában | a főoldal formája a komponensben |
| 4 | Telefon-mockup + funkciócímke | `DS · Appképernyő` címke nélkül | döntött, árnyékos telefon; döntött fekete címke piktogrammal; a címke a képpel vált |
| 5 | Címke (szalag) | `ds-szalag` | a főoldal döntött fekete címkéje |
| 6 | Hátterek | `ds-hatter-*` | + hatszögmintás háttér és fehér flekk a kép mögött (új osztályok) |
| 7 | Logósáv | `DS · Velük dolgoztunk`, `DS · Szakmai partnerek` | lenyitható sor („+N további”) |
| 8 | Képnézegető | csak a főoldalon (JS) | `DS · Képnézegető`: `dialog`, nyilak, Esc, a `ds-foto`/fotósor képeire |
| 9 | Méh (lebegő szuperhős) | csak a főoldalon | `DS · Méh` díszelem, a többi oldalon mozgás nélkül |
| 10 | Főoldal | `fo-` osztályok + 3 CSS-embed | natív osztályok/komponensek; a beágyazott CSS csak a mozgásra marad |

## Kampányoldal: CsicsergŐsz (Kristóf kérése, 2026-11-23)
A grafikák és a tartalom maradnak, a forma a főoldalé, a fekete helyett kakaó. Kész a tesztcímen: a meglévő szekciócímkék (Levi szövegei) döntött kakaó DS-címkeként
(egy elakadt animáció eddig elrejtette őket, az MME-fejléccel együtt), kakaó kampánygombok, árnyékos domb, döntött árnyékos telefon fehér flekkel és funkciócímkével (Madártérkép, Madár album,
CsicsergŐsz), a közös DS-elemek kakaó kerete. Részletek: `weboldal/kampany-csicsergosz/README.md`.
Az új főoldal (`/fooldal-uj`) kint van a tesztcímen (nem piszkozat, `noindex`); az átállás Kristóf kattintása.

## Biztonsági szabály a szakaszokra
A közös elemek minden oldalon egyszerre változnak. Egy éles publikálás a félkész szakaszt is kivinné, ezért
élesíteni csak akkor szabad, ha Claude egy szakaszt „kész, ellenőrizve” jelzéssel átadott.

## Ellenőrzés szakaszonként
- Tesztcím, 1440 és 390 px; a 6 mintaoldalon: menü, kilógás, JS-hiba.
- Szakasz végén független Opus-ellenőrzés.
- A visszaállítás forrása: `weboldal/kozos/navigacio/mentes-2026-11-23-lebego-sav.json` (és a további szakaszok mentései).
