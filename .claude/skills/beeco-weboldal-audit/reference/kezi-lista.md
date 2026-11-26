# Kézi kör – amit a gép nem lát (v3)

Két szerep, két lista: a **Reviewer** (A–F + G + H: kinek szól, hová jut el, hol akad el) és a **Tesztelő** (I: működik-e mindenhol, és mér-e). Mindkettő a `report.md` után jön; a gép a mérhetőt vitte, ez a maradék.

Minden pontra: **igen / nem / megjegyzés**, a képernyőképek és a megnyitott oldal alapján. A „nem” lelet: írd P0–P3 szinttel a jelentés végére, javaslattal. Először a mobil-hajtás képet nézd (a beeco-látogatók többsége telefonon jön), utána az asztalit, utána a teljes oldalt.

## A. Első benyomás (3–5 másodperc, hajtás fölött)
- [ ] **Kinek szól?** Egy idegen 5 mp alatt megmondja, kinek való az oldal (pl. „cégeknek és településeknek”), és mit kap (haszon, nem funkciólista).
- [ ] **Egy elsődleges CTA.** Pontosan egy kiemelt gomb van, a felirata cselekvő és konkrét; a másodlagos gomb láthatóan másodlagos.
- [ ] **Egy üzenet.** A H1 egy mondat, nincs belső szleng, nincs kettős ígéret.
- [ ] A kép/illusztráció a mondanivalót segíti (valódi termék, valódi munka), nem töltelék; a mosolygós méh-szabály és a DS-arculat betartva.
- [ ] Semmi nem takarja a hajtást (popup, süti-sáv, lebegő elem), mobilon sem.

## B. B2B-konverzió
- [ ] **Ár + ÁFA.** Minden Ft-összeg mellett „+ ÁFA” (a csomagoknál, kalkulátorban, GYIK-ban, mailben is); a minimum árak és a többségi számok a Kristóf által jóváhagyottak.
- [ ] **Bizonyíték.** Partnerlogók (csak jóváhagyottak), esettanulmány vagy valódi idézet névvel és engedéllyel, számok **forrással** és dátummal. Kitalált vélemény, kitalált szám nincs.
- [ ] **Kifogáskezelés.** A GYIK a valódi ellenvetésekre válaszol (mennyibe kerül, mennyi idő, mit kell nekünk tenni, adatvédelem, mérhetőség, kinek a felelőssége), nem a marketing-szövegre.
- [ ] **Következő lépés világos.** Egyértelmű, mi történik az ajánlatkérés után és mikor (pl. „1 munkanapon belül jelentkezünk”).
- [ ] **Űrlap-súrlódás.** Csak a szükséges mezők (név, e-mail, cég, üzenet); a mezők címkézettek; a hibaüzenet a mező alatt, magyarul; adatkezelési hivatkozás a gomb mellett; a siker-üzenet mondja meg, mi lesz most; mobilon a billentyűzet a megfelelő típusú (e-mail, tel).
- [ ] **Több út, egy cél.** Telefonálni/írni/időpontot foglalni is lehet, de az elsődleges út mérhető (űrlap/foglaló), nem csak `mailto:`.
- [ ] Az árazási/csomag oldal és a főoldal ugyanazt állítja (ár, tartalom, nevek): **keresztellenőrzés az oldalak között**.

## C. Érthetőség és hangnem
- [ ] Tegező, rövid, cselekvő mondatok; egy bekezdés = egy gondolat; nincs fordítás-szagú szöveg.
- [ ] Nincs ellentmondás más beeco-oldalakkal (árak, számok, nevek, dátumok, a szolgáltatás tartalma).
- [ ] Nincs belső szó (ticket, pipeline, onboarding…), vagy ha kell, egy mondatban magyarázva.
- [ ] Minden „első”, „legnagyobb”, „egyetlen” állítás igazolható és forrásolt.
- [ ] Az oldal „hosszú, de görgethető”: a címsorok egymás után olvasva elmesélik a történetet.

## D. Linkek és gombok (nyisd meg őket)
- [ ] Minden CTA oda visz, amit a felirata ígér; a horgonylink a megfelelő szekcióra ugrik, és az a szekció tényleg látszik.
- [ ] Nincs két azonos feliratú, de más helyre vezető gomb; a külső linkek új lapon nyílnak, ahol várható.
- [ ] A menü és a lábléc elérhető mobilon, a menü nyitva is használható (44 px, fókusz, Esc zár).

## E. Vizuál (képek alapján)
- [ ] A szekciók ritmusa egyenletes (térköz-lépcső, nem „szétesik”); nincs árva szó, nincs törött sor.
- [ ] A kártyák, gombok, címkék a DS-komponensek; nincs egyedi „majdnem ugyanaz” elem.
- [ ] Mobilon semmi nem lóg ki, nem kicsi a szöveg (≥ 16 px törzs), a gombok hüvelykujjal elérhetők.
- [ ] Mozgás: van oka, nem zavaró; csökkentett mozgásnál is minden tartalom látszik.

## F. Jog és mérés
- [ ] Lábléc: impresszum, adatkezelési tájékoztató (és ÁSZF, ha van vásárlás) valódi, működő linkkel.
- [ ] A sütisáv valódi böngészőben (nem headless) megjelenik, és elfogadás előtt nem indul mérő/marketing süti.
- [ ] Az űrlap-beküldés és a fő CTA-k mérési eseményt küldenek (GA4 DebugView / Clarity), élesítés előtt ellenőrizve (a gép a szimulált kattintásokra nézi az eseményt, a valódi beérkezést nem látja: lásd I.).
- [ ] Megosztáskor (Messenger/Facebook/LinkedIn) szép előnézet jön (og:image).

## G. Reviewer-lista (szemmel, a képek és az élő oldal alapján)
- [ ] **5 másodperces teszt** (nézd 5 mp-ig a mobil-hajtás képet, majd takard le): meg tudod mondani 1) kinek szól, 2) mit kap, 3) mi a következő lépés? Ha a 3 válasz bármelyike „nem”, P1. A gép csak azt mérte, hogy van-e H1, értékajánlat-mondat, CTA és kép; azt nem, hogy **érthető-e**.
- [ ] **Egy út, egy cél.** A hero-ban egy kiemelt gomb, a másik legfeljebb körvonalas; a felirat igével kezdődik (Kérj…, Töltsd le…), ≤ 4 szó.
- [ ] **Tegező, rövid, aktív.** Nincs „Ön”, „kérjük”, „amennyiben”; nincs főnévhalmozás („a megvalósítás lebonyolítása”). B2B-n is tegezünk, csak pontosabban.
- [ ] **Bizalom ott, ahol döntenek**: az űrlap és az ár közelében logó, valódi idézet vagy garancia-mondat, és az adatkezelési jegyzet.
- [ ] **Mit ígér, azt kapja.** Minden CTA oda visz, amit a felirata mond; a siker-üzenet megmondja, mi lesz most; a hibaüzenet megmondja, mit tegyen.
- [ ] **Súgó és kiút**: van GYIK-hivatkozás, a láblécben kapcsolat; aloldalon morzsamenü/Vissza; a menüben látszik, hol vagy.

## H. Felhasználói út – három perszóna (menj végig kézzel, mobilon és asztalin)
Mindegyiknél jegyezd: **mit keres**, **hol akad el**, **mi vinné tovább**, és hány kattintás/mp a célig. Ha elakad: P1 (konverziót töri) vagy P2.

| Perszóna | Mit keres | Tipikus elakadás | Átmenő út (cél) |
|---|---|---|---|
| **Magánszemély app-letöltő** (telefonról jön, 20 mp türelem) | Mi ez az app, mennyibe kerül, biztonságos-e, hol töltöm le | Nem látszik azonnal az App Store/Google Play gomb; hosszú szöveg; az áruházi link rossz platformra visz; nincs képernyőkép | Hero → áruházi gomb → áruház oldal (≤ 2 kattintás, ≤ 10 mp) |
| **Céges HR/ESG döntéshozó** (asztalon, összehasonlít, megmutatja a főnökének) | Mit kap a cég, mérhető-e (adat, jelentés), mennyibe kerül (+ ÁFA), ki használja már, mennyi idő a bevezetés | Nincs ár vagy nincs „+ ÁFA”; nincs referencia/logó; nem derül ki, mi történik az ajánlatkérés után; csak mailto | Hero → csomagok/ár → bizonyíték → ajánlatkérő űrlap, a küldés után világos következő lépéssel |
| **Önkormányzati referens** (hivatali, óvatos, dokumentumot keres) | Törvényi/közbeszerzési megfelelés, adatkezelés, hivatkozható szám és forrás, kapcsolattartó, hogyan rendelhet | Magázós/hivatalos hang hiánya vagy túlzott marketing-szöveg; forrás nélküli állítás; nincs letölthető anyag/kapcsolat; adatkezelési tájékoztató nehezen található | Hero → „Önkormányzatoknak” rész → forrásolt számok → kapcsolat/ajánlatkérés |

Megjegyzés: a házstílus a tegezés; az önkormányzati oldalon is tegezünk, de a tényállításokhoz forrás és dátum kell.

## I. Tesztelői lista (működik-e mindenhol, és mér-e)
**Füst-teszt (smoke)**
- [ ] Az oldal 200-at ad, a H1 és a hero látszik, a menü és a lábléc működik, nincs konzolhiba, nincs hibás (4xx/5xx) kérés (a `report.md` „Konzol/hálózat” sora).
- [ ] A 404-oldal 404-et ad, és van rajta főoldal-link és kapcsolat/keresés (sitemap módban a „Site-szintű ellenőrzések”).

**Böngészők (valódi eszközön, nem csak headless)**
- [ ] Safari (iOS és macOS), Chrome (Android és asztali), Firefox: a hero, a menü, az űrlap és a CTA-k. A gép csak a telepített webkit/firefox motort méri; ha a jelentés „nem mérve”, ezt kézzel pótold.
- [ ] Safari-specifikus: 100vh/sticky, dátum/szám-beviteli mezők, a betűtípus betöltése.

**Eszközök és nézetek**
- [ ] 320, 390, 768, 1024, 1440, 1920: nincs vízszintes görgetés, nincs kivágott szöveg, a gombok hüvelykujjal elérhetők (kontaktlap a jelentésben).
- [ ] Forgatás (álló ↔ fekvő), 200 % nagyítás, sötét mód be/ki, „Csökkentett mozgás” be, JavaScript nélkül (legalább a H1 és az első bekezdés látszik), lassú hálózat (a hero 4 mp-en belül).

**Űrlapok** (beküldés nélkül, ha éles; teszten küldhetsz teszt-adatot a megbeszélt címre)
- [ ] Minden mezőnek van látható címkéje; kötelezők jelölve; az üres küldés a mező mellett magyar hibát ad; az e-mail mező elutasítja az „abc”-t; mobilon az e-mail/tel billentyűzet jön.
- [ ] Siker- és hibaállapot magyarul, megmondja a következő lépést; a küldés gomb nem küldhető kétszer.
- [ ] Adatkezelési hivatkozás az űrlap mellett; Turnstile/spam-védelem nem akadályozza a valódi látogatót.

**Akadálymentesség**
- [ ] Csak billentyűzettel végig lehet menni: ugrólink, látható fókusz, nincs csapda, a menü és a felugró réteg Esc-re zár, Enter/Space működik.
- [ ] Képernyőolvasó (VoiceOver) a hero-n és az űrlapon: címsor-sorrend, gombnevek, hibaüzenet felolvasása. A gép axe-core-t futtatott, de a felolvasás élményét nem méri.

**Mérés-ellenőrzés** (élesítés/publikálás után, valódi böngészőből)
- [ ] GA4 → Admin → **DebugView** (vagy Reports → Realtime): nyisd meg az oldalt, kattints a hero-CTA-ra, az áruházi gombra, görgess le, küldj teszt-űrlapot (a megbeszélt teszt-címmel): látod a `b2b_cta`, `app_store_click`, `scroll_depth`, az űrlap-eseményt? A névnek snake_case-nek kell lennie.
- [ ] **Consent Mode**: elutasítás után nem mennek analitikai kérések (`gcs=G100`), elfogadás után igen; a sütisáv valódi (EU) böngészőben megjelenik.
- [ ] **Clarity → Live / Recordings**: a munkamenet megjelenik, a CTA-kattintás és a görgetés látszik.
- [ ] **Search Console**: a tulajdon igazolt (DNS vagy meta), a sitemap be van küldve, az új oldal URL-ellenőrzése „indexelhető”.
- [ ] Belső linkeken nincs utm_ paraméter; az áruházi linkeken van forgalom-forrás jelölés.
- [ ] A konverziós eseményeket (ajánlatkérés, áruház-kattintás) a GA4-ben „kulcseseménynek” jelölted.

## Jelentés-sablon a végére
```
Kézi kör – <oldal> – <dátum>
Igen: …  Nem: …
P1: <lelet> – <mit javíts>
P2: …
Döntés kell Kristófnak: …
```
