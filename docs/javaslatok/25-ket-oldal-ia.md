# Javaslat 25 – Brand Book és Design System két külön oldalon, új információs architektúra

*Állapot: **javaslat** · készítette: Claude (Kristóf kérésére) · dátum: 2026-10-08*
*(Jóváhagyás után: **jóváhagyva** – lent a Döntés részben.)*

## 1. Igény
- Kristóf, 2026-10-08: a UX/UI csapat erősen kritizálja a mostani brand bookot és design systemet; „a struktúrát kezdjük újra a tervezőasztalnál”, „szedjük két részre: design system és brand book”.
- Mi a baj ma (a felmérés szerint, lásd lent): egy oldalon keveredik a márka (önkéntes, partner) és a rendszer (tervező, fejlesztő); a menü lapos (17 elem), a 10 aloldal nem látszik benne; ugyanaz a tartalom több helyen él; három különböző szám áll a komponensekről; a komponensoldalon nincs anatómia, állapotmátrix, billentyűtérkép, JSX-példa; a jelszókapu a tervezők elől is elzárja a rendszert.
- Minták: Bang & Olufsen (https://brand.bang-olufsen.com/document/3) a márkához; IBM Design Language és Carbon a rendszerhez.

## 2. Mire épül
- A meglévő generátor (`tools/brandbook-build.js`), a tartalom (`brandbook/tartalom/*.json`, 14 fejezet), a felületi profilok (`brandbook/feluletek/*.json`), a komponens-adatok (`brandbook/elemek/komponensek.json`, 54 elem), az API (`api/api.json`), a tokenek (`tokens/*.json`).
- Új elem a DS-ben nincs: ez a dokumentációs oldalak szerkezete, nem komponens. A két oldal a meglévő bőröket használja: a **Design System a termékbőrt** (`bc-` elemek), a **Brand Book a játékbőr karakterét** (a `theme-jatek.json` szerepei átképezve a `--bc-*` szerepnevekre).

## 3. A javasolt szerkezet

### 3.1 Brand Book (jelszóval; önkéntes, partner, marketing; kb. 22 oldal, 3 szint, egy olvasási lánc)
| Főpont | Oldalak |
|---|---|
| Kezdőlap | Hol kezdjem? (Önkéntes / Partner / Tervező) |
| 1 Márka | Pozíció · Hang és személyiség |
| 2 Vizuális identitás | Bevezető · Logó · Szín · Tipográfia · Méhecske és illusztráció · Képek és fotó · Mozgás |
| 3 Alkalmazás | Social media · Sablonok · Hozzáférhető tartalom · Partnerarculat · Kampány-altéma |
| 4 Csatlakozz | Önkénteseknek |
| 5 Letöltések | egy központi oldal, darabszámmal és fájltípussal |

### 3.2 Design System (nyitott; tervező, fejlesztő, UX/UI; kb. 80 oldal, ebből 54 komponens)
| Főpont | Oldalak |
|---|---|
| Kezdés | Tervezőknek · Fejlesztőknek · AI-eszközökkel · Telepítés |
| Alapok | Szín · Tipográfia · Tér és rács · Forma · Mozgás · Ikonok · Adatvizualizáció · Hozzáférhetőség · Témák |
| Komponensek | 8 kategória, oldal komponensenként (Irányelvek / Specifikáció / Kód / Hozzáférhetőség fülek) |
| Minták | Űrlap · Lista–részlet–szerkesztő · Irányítópult · Üres, hiba, töltés · Mikroszöveg |
| Felületek | a hat termék állapota és migrációs útja |
| Eszközök | Tokenek · Figma és Code Connect (később) · API és AI-index |
| Változások | dátumozott „Mi új”, verziók, migrációs útmutatók |
| Közreműködés | javaslatfolyamat, státuszok, „Új elem kell?” |

### 3.3 Közös szabályok (mindkét oldalon)
- Legfeljebb 3 szint (főpont → oldal → H2), alapból csak a főpontok látszanak (akkordion).
- Minden oldal váza: H1 · rövid bevezető · szekciók · Do/Don't (ahol van) · letöltés/kapcsolódó · „utoljára módosítva”. Brand: „Következő oldal” lánc. DS: oldalon belüli jegyzék.
- Egy tény egyszer él, máshol hivatkozás.
- Nincs üres fejezet: a tervezett, de nem kész oldal szürke „hamarosan” elem a menüben, a keresőben és a láncban nem szerepel.
- A hiányzó adat látható „hiányzik” jelvény, nem kitalált szöveg.
- A számok adatból generáltak.

### 3.4 Elnevezés (Kristóf jóváhagyja)
| Ma | Brand Bookban | Design Systemben |
|---|---|---|
| „két bőr” | „termék-stílus” és „játék-stílus” | **bőr** (egyszer definiálva, szótárral) |
| „hat felület” | „a hat termék” | **felület** = terméktípus (admin, partner, app, Kaptár, web, játék); a „felület” mint vizuális sík: **sík** |
| co-branding | közös márkahasználat | – |
| Tone of Voice | hang | – |
| „Képek” és „Illusztrációk” | **Méhecske és illusztráció** és **Képek és fotó** | – |
| „Kezdőlap”, de a cím „Egy méhecske, hat felület” | „Hol kezdjem?” | „Kezdés” |

## 4. Átültetés
A régi 14 fejezet 85 szakaszának új helye a `docs-site/leltar.json`-ban van (műveletek: 64 átvesz, 10 összevon, 7 áthelyez, 2 átalakít, 2 kivesz). A régi URL-ek `_redirects`-szel az új oldalakra mutatnak. A belső folyamat (skillnevek, „Kristóf jóváhagyja”, belső döntésnapló) kikerül a nyilvános szövegből.

## 5. Nyitott szabály-feloldások (külön döntés, F6)
- puha árnyék: mikor és melyik elemen (a `termek-arculat.md` §3/§7 szerint tilos, a §6/A szerint nem kattintható doboznak megengedett);
- a sarok `xs` 2 px a „4 · 8 · 12” szabály mellett;
- betűvastagság az appban (500/800) és a szabály (400/600/700);
- mozgás: UI ≤ 300 ms, de `slow` = 400 ms és 400–900 ms-os animációk;
- új tokenek: szövegstílus, állapot (hover, disabled, selected), töréspont, fókuszgyűrű, ikonméret;
- a játékbőr forrása legyen a `core.json`, ne a kézzel írt `web/css/tokens.css`;
- kontraszt: sötét `danger` a felületen ~2,47:1, sötét `focus` a méz háttéren ~1,04:1, sötét `ink-muted` a `surface-accent`-en ~4,42:1 (előbb mérjük, aztán javítunk).

## 6. Hozzáférhetőség
Az oldalak maguk is megfelelnek: billentyűvel bejárható menü és fülek, látható fókusz, 44 px, AA-kontraszt mindkét módban, `lang`, egy `h1`, helyes címsorhierarchia, csökkentett mozgás.

## 7. Döntés (Kristóf tölti ki)
- Dátum: 2026-10-08 (előzetes, a terv jóváhagyásakor): két külön oldal; Brand Book jelszóval és a játékbőr karakterében; Design System nyitott és a termékbőrben; elnevezéscsere; teljes átépítés egy menetben egy jóváhagyási megállóval.
- A nyers váz megtekintése után: …
