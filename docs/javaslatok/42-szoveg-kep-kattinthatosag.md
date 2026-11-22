# Javaslat 42 – Egységes szöveg- és képrend, kattinthatóság, három új webes DS-elem

*Állapot: **irány jóváhagyva** (Kristóf kérése, 2026-11-22), a részletek és az új elemek képei jóváhagyásra várnak · készítette: Claude · dátum: 2026-11-22*

Ütemezés (Kristóf döntése, 2026-11-22): a 2026-11-22 esti élesítéssel a Javaslat 41 állapota megy ki. Ez a javaslat **utána** kerül a tesztoldalra, és a következő élesítéssel megy ki.

## 1. Igény (Kristóf, 2026-11-22)
- A szövegek mérete, helye és hierarchiája minden oldalon egységes legyen.
- **Képek, két stílus:**
  - a fénykép enyhén döntve, fotós kinézettel áll (mint a landing oldalakon);
  - az app- és webapp-mockup külön stílus, háttér nélkül.
- Ami kattintható, az kemény árnyékot kap; ami nem, az nem.
- A morzsa mindig az oldal bal felső részén áll; a szövegek többsége balra zárt.
- A piktogram mindig fehér flekken fekete (nem sárga; ez 2026-11-21 óta szabály).
- **Rólunk:** a 3 nem kattintható blokk se árnyékot, se lekerekítést ne kapjon.
- **Csapat:**
  - a gomb DS-alapú legyen;
  - a csúszka (balra tartalom, jobbra kép) DS-elem legyen;
  - a fénykép ne legyen lekerekítve;
  - a léptetők szögletesek legyenek, egy mini blokkban a jobb–bal gombbal és a pöttyökkel, a fotó alján középen, 20 px-re lelógva.
- **Főoldal:** a közösségfotós megoldás legyen DS-elem, és máshol is használjuk. A többi főoldali kérés a 4. pontban van.

## 2. Szabályok (DS-szint, minden webes oldalra)
| Terület | Szabály | Mérés (ds-lint) |
|---|---|---|
| Címskála | H1 és H2: `cim-l` (48 px, mobilon 30), H3: `cim-s` (24, mobilon 20), egy H1 oldalanként; a kártyacím H3, a címke H4 vagy bekezdés | új szabály: eltérés > 2 px |
| Igazítás | törzsszöveg, cím, lista balra zárt; középre csak a rövid CTA-sor és a hero alatti chipsor állhat | új szabály: középre zárt bekezdés > 2 sor |
| Morzsa | `DS · Morzsamenü`, a tartalom bal felső sarkában, a H1 fölött | R-morzsa: helye és sorrendje |
| Fénykép | `ds-foto` keret: fehér keret, −1…−2° dőlés, sárga ragasztócsík (`::before`) | R-foto |
| Mockup | telefonkeretes app- vagy webapp-kép, **háttér, keret és árnyék nélkül** (`ds-appkep`, `DS · Appképernyő`) | R-mockup: nincs háttér |
| Kattinthatóság | kattinthatón 4 px kemény árnyék és 4 px sarok; nem kattinthatón **nincs árnyék és nincs lekerekítés** (0 px) | R3 bővítés: a lekerekítést is nézi |
| Lépések | nem kattintható lépéssor: nagy fekete szám, vékony fekete vonal a lépések között, doboz és árnyék nélkül (`DS · Lépések`) | – |
| Piktogram | fehér flekken fekete | R11 (már él) |

## 3. Új DS-elemek (képpel, jóváhagyásra)
1. **`DS · Csapat-csúszka`** (organizmus):
   - Balra tartalom (címke, H2, szöveg, `DS · Gomb`), jobbra fénykép 0 px sarokkal.
   - Vezérlő mini blokk: fehér alap, 2 px fekete keret, 4 px kemény árnyék. Benne balra a négyzetes ‹, középen a pöttyök, jobbra a négyzetes ›.
   - A vezérlő a fotó alján középen áll, 20 px-re lelóg.
   - A meglévő `CSAPAT_FOTOSLIDER` komponensből készül; az nem törölhető, csak továbbépíthető.
2. **`DS · Közösségfotó`** (molekula): a főoldali közösség-szekció fotós megoldása önálló elemként, máshol is használható. A pontos formát a főoldali változatról veszem le.
3. **`DS · Számsor`** („A közösség ereje számokban”, molekula):
   - 3–4 nagy szám (Lalezar) felirattal és forrással;
   - fehér flekkes piktogrammal;
   - doboz és árnyék nélkül, mert nem kattintható.

## 4. Főoldal – átadó lista a főoldali munkamenetnek
(Kristóf döntése: a főoldalt a főoldali munkamenet módosítja. Ág: `fooldal-szuperhos-tema`, anyag: `weboldal/fooldal-szuperhos/`, Webflow-oldal: `/`.)

| # | Kérés | Javasolt megoldás |
|---|---|---|
| F1 | Logósáv egységesítése | keret nélkül, monokróm logók (`filter: grayscale(1)` vagy fekete SVG), egységes magasság; a link marad |
| F2 | Az „Írtak rólunk” és a „Szakmai partnereink” kerüljön lejjebb az oldalon | a záró CTA elé, a GYIK után vagy elé (a sorrendet Kristóf hagyja jóvá) |
| F3 | „Ők már használják”: négyszöges, árnyék nélkül | 0 px sarok, nincs árnyék (nem kattintható) |
| F4 | „Miért beeco”: árnyék nélkül, mert lépések | `DS · Lépések` (2. pont): szám, vonal, doboz nélkül |
| F5 | Az app útja: talán szövegdoboz sem kell | a szöveg doboz nélkül, a vonal és a piktogram vezeti a szemet |
| F6 | „A közösség ereje számokban” vizuális átdolgozása, komponens | `DS · Számsor` (3.3) |
| F7 | A gombok DS-gombok legyenek (Letöltés, „Beszállok a rajba”) | `DS · Gomb`, illetve `DS · App letöltés` |
| F8 | A közösségfotó legyen DS-elem | `DS · Közösségfotó` (3.2) |
| F9 | Piktogram fehér flekken fekete | R11 szerint |

## 5. Sorrend (élesítés után)
1. Mérő bővítése (címskála, igazítás, lekerekítés a nem kattinthatón, mockup-háttér). Utána mérés a 72 oldalon.
2. Címsorból bekezdés: kb. 19 szemöldökcímke (`sub-heading`, 20 px) és a leíró `main_text` mondatok, amelyek H2 címkét viselnek (lábnyom-metodika, kalkulátor, letöltés, térkép, szezonális növények). A Térkép oldal H1-e 24 px-es, ez a címskála szerint 48 legyen.
3. Osztályszintű javítások:
   - nem kattintható dobozokon 0 px sarok és nincs árnyék (Rólunk 3 blokk és a többi);
   - balra zárás;
   - mockupok háttér nélkül.
4. `DS · Csapat-csúszka` a Csapat oldalon. Előtte képes változat jóváhagyásra.
5. `DS · Számsor` és `DS · Közösségfotó` a főoldali munkamenettel közösen.
6. Ellenőrzés: ds-lint, audit, független Opus-ellenőrzés, élesítési csomag.

## 6. Nyitott kérdések
- F2: hová kerüljön pontosan az „Írtak rólunk” és a „Szakmai partnereink”?
- Szabad-e a 4 px-es „kártya” sarok nem kattintható kártyán, vagy ott is 0 px legyen? A mobilos DS-döntés (2026-11-22, Ráncfelvarrás) szerint a kártya 4 px; a Rólunk blokkokra Kristóf 0 px-et kért.

## 7. Döntés (Kristóf tölti ki)
- Dátum: …
