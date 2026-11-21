# Javaslat 39 – Web DS v2: az arculati review webes pontjai

*Állapot: **jóváhagyásra vár** (a csapat arculati review-ja alapján, Kristóf kérésére, 2026-11-21; a tesztoldalon próbálható) · készítette: Claude.*
*A szabályok kifejtve: [docs/web-ds.md](../web-ds.md) 2. fejezet. Gépi mérés: `weboldal/web-ds/teszt/ds-lint.cjs`.*

## 1. Mi változik (a review webes pontjai)

| # | A csapat észrevétele | Web DS szabály | Állapot |
|---|---|---|---|
| 1 | Sok a lekerekítés; kártya és gomb 4 px, máshol semmi; a lecsapott él nem kell | Kattintható elem és kártya: 4 px, minden sarkon. Díszítő elem (fotó, címke, sáv): 0 px. Kör csak ott, ahol a forma kör (profilkép, lépésszám) | kész a `ds-` osztályokon |
| 2 | Árnyék csak kattinthatón, kemény, legfeljebb 2 fajta | Kicsi 2 px (kis vezérlő), nagy 4 px (gomb, kattintható kártya). Nem kattintható elemen nincs árnyék | kész a `ds-` osztályokon |
| 3 | Kártyák szögletesebbek és szimmetrikusak | lásd 1.; keret mindenhol 2 px | kész |
| 4 | Gombok egységesek (most 4 fajta) | Két gomb: elsődleges (méz) és másodlagos (fehér). Harmadik a szöveglink | `ds-gomb` és a régi `button_main` kész; `fs-gomb`, `main-button` és a kampánygombok a következő körben |
| 5 | Szekciócímke: fekete alap, körvonal nélkül, fehér szöveg, ikon nélkül | `ds-szalag`: fekete, fehér betű, egyenes, vágás nélkül | kész |
| 6 | A barna kártyaszöveg legyen címke háttérrel, ne betűszín | Barna szövegszín megszűnt; a három érintett elem vaj hátterű címke fekete betűvel | kész |
| 7 | Partnerlogónak nem kell keret, legyen egyszínű | `ds-logo` keret és háttér nélkül, a logókép szürkeárnyalatos | kész |
| 8 | Kevesebb konténer | Kártya csak önálló tárgynak jár (ajánlat, cikk, lépés); szöveg és logó nem kerül dobozba | szabály; oldalanként a migrációnál |
| 9 | Hátterek ne zavarják a szemet | Oldalanként legfeljebb három nyugodt háttér (fehér, krém, halványzöld); vaj csak a nyitóban, sötét legfeljebb egyszer | szabály; oldalanként a migrációnál |
| 10 | Címkén legalább 16 karakter látsszon; mikor kisebb betű, mikor két sor | Szövegillesztés: 16 karakter egy sorban a legszűkebb nézetben; ha nem fér, egy lépcsővel kisebb betű, utána két sor, utána rövidebb szöveg | szabály |
| 11 | Státusz-chipek egységesek | Egy chip: 4 px sarok, 14 px félkövér, keret nélkül | `ds-chip` kész; státuszszínek a 3. pontban |
| 12 | Ikonok egységesítése, elég leírók-e | Sárga foltos piktogram, szekciónként egy stílus, ikon mellett mindig felirat | 4 hiányzó sárga változat elkészült; teljes ikon-átnézés a következő körben |
| 13 | A web hero egyszerűbb: kevesebb mozgás, ne legyen AI-kép, 3D mockup | Nyitó: egy üzenet, egy fő gomb, állókép (3D app-mockup), automatikus mozgás nélkül | szabály; a főoldal átépítésénél |
| 14 | Kiemelés 30 karakteres címbe nem kell | `ds-kiemel` csak 30 karakternél hosszabb címben | szabály, lint méri |
| 15 | „Írtak rólunk” lejjebb, mozoghat, nincs színátmenet és konténer | Sajtósáv a lap alsó harmadában, keret nélküli egyszínű logósor | szabály; a főoldal átépítésénél |
| 16 | Galéria: kattintásra nagyban | A képsor képei kattinthatók, nagyító nézettel | következő kör (szkript-bővítés) |
| 17 | Ne legyen pixeles kép; egységes fényelés és vágás | Kép nem jelenhet meg a saját méreténél nagyobban; WebP; 4:3, 16:9 vagy 9:16 | lint méri; képenként a migrációnál |

A nem webes pontok (kupon-címke az appban, nektár-chip, a CsicsergŐsz appképernyők színei) az app design systemére tartoznak, itt nem szerepelnek.

## 2. Mit jelent ez a gyakorlatban
- A közös `ds-` osztályok egy helyen változtak, ezért minden rájuk épülő oldal egyszerre lett egységes a tesztoldalon.
- A régi, nem `ds-` oldalak (főoldal, blog, kampány, letöltés) oldalanként kerülnek át a sablonokra. Sorrend és mérés: web-ds.md 11. fejezet.
- Mérés (`ds-lint`, 12 oldal a tesztoldalon): **1252 → 276 eltérés**; négy oldal 0-n (Beecopédia, Kuponok, Eseménynaptár, Hatásunk), a blog 130-ról 1-re. A teljes oldalas mérés (72 oldal): web-ds.md 11. fejezet. Oldalankénti tábla: web-ds.md 11. fejezet.
- A közös letöltés-blokk (`DOWNLOAD_BLOCK`) áruház-gombjai kemény árnyékot kaptak, a QR-kód szögletes, árnyék nélküli.
- Mentés a régi stílusokról: `~/CLAUDE/webflow-mentes/2026-11-21-web-ds/`. A változtatások listája: `weboldal/web-ds/migration/atoms_v2_plan.json`.

## 3. Döntés (Kristóf tölti ki)
1. **Jóváhagyod a fenti szabályokat a web DS alapjának?** (Élesbe a következő éles publikálással kerülnek ki.)
2. **Szövegszínnel kiemelés:** javaslat: nem. Kiemelés csak háttérrel (`ds-kiemel`), hogy kevesebb szín legyen.
3. **Szekciócímke dőlése:** a −2° megszűnt, a címke egyenes. Ha hiányzik a játékosság, visszaállítható.
4. **Státusz-chip színei:** javaslat: semleges (fehér), kiemelt (vaj), siker, figyelmeztetés, hiba; a DS meglévő állapotszíneivel.
5. **CsicsergŐsz kampányoldal:** a lecsapott sarok és a saját gombok a kampány saját arculata. Átálljon a közös formára, vagy maradjon kivétel a kampány végéig?

- Dátum: · Jóváhagyva / módosítás:
