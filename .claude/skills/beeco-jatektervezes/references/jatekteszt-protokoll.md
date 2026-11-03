# Játékteszt-protokoll

Minta: a beeco-szelektalj „Nagy teszt” terve (`~/CLAUDE/beeco-szelektalj/docs/teszt-terv.md`), általánosítva.

## Az aranyszabály
**Ne magyarázz, figyelj.** A tesztelő kapja meg a játékot, és mondja hangosan, mit gondol. Ha elakad, jegyezd fel, hol és meddig,
és csak akkor segíts, ha teljesen megállt (ezt is jegyezd fel). Amit a tesztelő mond, idézd; amit gondolsz róla, külön írd.

## 1. Mit akarunk megtudni?
Tesztenként legfeljebb 5 kérdés, mindegyikhez: miből látjuk (megfigyelés, kérdőív, mérés).
Alapkérdések minden játéknál: érthető az első 30 másodperc? Végigér? Mennyi idő? Mi a legjobb és legrosszabb pillanat? Mit tanult?

## 2. Kik tesztelnek? (körök)
| kör | kik | mire jó |
|---|---|---|
| **gépi** | `beeco-persona-test` perszónák, valódi böngészőben | gyors, olcsó, előzetes szűrés; nem helyettesíti az embert |
| **A – belső** | beeco-csapat | durva hibák, szöveghibák |
| **B – célközönség** | pl. egy osztály, családok, kertes felnőttek | érthetőség, tempó, élmény |
| **C – széles** | 10–20 ismerős, vegyes eszközzel | megtalálás, kitartás, hitelesség |
| **D – rendezvény** | járókelők, kioszk | első benyomás, rövid játék |
Vegyes eszközök: régi Android, iPhone, tablet, laptop, legalább egy iskolai vagy céges hálózat.

## 3. Elő- és utókérdés (a tanulás mérése)
- **Előtte** 1–3 rövid kérdés a tanulási célokból (pl. „Mit tennél egy madáritatóba?”).
- **Utána** ugyanazok, kicsit másképp feltéve. A különbség mutatja, mit tanított a játék.
- Gyereknél rövid, képes válaszlehetőség.

## 4. Kérdőív (3–4 perc, névtelen)
1. Milyen eszközön játszottál?
2. Az első percben tudtad, mit kell csinálni? (1–5) Ha nem, mi hiányzott?
3. Mennyi ideig játszottál, végigértél?
4. Volt szöveg, ami hosszú vagy nehéz volt?
5. Mi volt a legjobb és a legrosszabb pillanat?
6. Elhiszed, amit a játék a tényekről mond? (1–5)
7. Ajánlanád? (1–5) Ha egy dolgot változtathatnál, mi lenne az?
+ az utókérdések. Adatkezelés: e-mail-gyűjtés kikapcsolva, bejelentkezés nélkül.

## 5. Jelentés – alkalmanként
1. **Alkalom:** dátum, kiadás-azonosító, eszköz, kezelés (érintés/egér), ki tesztelt (név nélkül: „10 éves, kertes”).
2. **Fókusz:** mit teszteltünk.
3. **Első benyomás (első 5 perc):** értette a célt és a kezelést? Milyen volt a hangulata?
4. **A menet:** ami működött; fájó pontok (súlyosság: magas / közepes / alacsony); zavaró pontok; örömpillanatok.
5. **Hibák:** táblázat – leírás, súlyosság, megismételhető-e. (Összeomlás, lefagyás ide kerül, nem a fájó pontok közé.)
6. **Rendszerenként:** értette a célját? Lekötötte? Mit javasolt?
7. **Számok:** idő állomásonként, kihagyott vagy fel nem fedezett részek, próbálkozások száma.
8. **Összkép:** újrajátszaná? Nehézség, tempó.
9. **A 3 legfontosabb teendő.**

## 6. Mi történik az eredménnyel – négy kupac
| kupac | hova megy |
|---|---|
| **terv-változás** (a szabály vagy a felépítés rossz) | GDD-lap módosítása → Kristóf kapu |
| **hangolás** (jó szabály, rossz érték) | a hangolható értékek táblázata |
| **hiba** | hibalista, súlyosság szerint |
| **csiszolás** | parkoló, a gyártás végére |
Sürgősség: **azonnal** (elrontja a játékot) · **a teszt után** (zavaró, de megkerülhető) · **később** (ötlet).
Tartalmi kérés (szöveg, tény, forrás) a tartalomtábla jóváhagyás-oszlopába kerül megjegyzésként.
