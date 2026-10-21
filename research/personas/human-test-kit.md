# Emberes tesztcsomag (moderált felhasználói teszt)

Ugyanazokkal a perszónákkal és feladatokkal, mint a szintetikus teszt, így a kettő összevethető. Egy kör: **5–8 tesztelő**, fejenként **30 perc**, egy moderátor és egy jegyzetelő. Online (képernyőmegosztás) vagy személyesen.

## 1. Toborzás (szűrőkérdések)
A Kaptárból vagy az ismerősök köréből. A cél, hogy minden fontos perszónára jusson 1–2 ember.
1. Milyen gyakran teszel valamit tudatosan a környezetért? (soha / néha / rendszeresen / nagyon sokat)
   - „néha” → Csendes bizonytalan vagy Elfoglalt pragmatikus;
   - „nagyon sokat” → Haladó cselekvő.
2. Mennyi időd van egy új app kipróbálására? („egy perc” → Elfoglalt pragmatikus)
3. Etettél, itattál már madarakat? Tagja vagy madarász egyesületnek? (szakértő → Szkeptikus madarász)
4. Gyerekekkel dolgozol, vagy gyerekeid vannak? (tanár → Iskolai tanár; kisgyerekes szülő → Családos kezdő)
5. Milyen telefonod van, és használtad már a beeco appot? (első teszthez **nem** használta)
6. Munkában foglalkozol HR-rel, ESG-vel, önkormányzati környezetvédelemmel vagy újságírással? (→ B2B-perszóna)

Ajándék: beebolt-kupon vagy beeco-csomag (Kristóf dönti el). Hozzájárulás: képernyő- és hangfelvétel csak írásos beleegyezéssel, a felvételt a kör után 30 napig őrizzük.

## 2. Moderátori forgatókönyv
**Bevezető (3 perc), szó szerint:**
> Köszönjük, hogy segítesz! Nem téged tesztelünk, hanem az oldalt: ha valami nehéz, az a mi hibánk. Kérlek, gondolkodj hangosan: mondd, amit látsz, amit keresel, és amit gondolsz. Én nem fogok segíteni, csak a végén kérdezek. Bármikor abbahagyhatod.

**Feladatok (20 perc).** A forrás a `scenarios/<oldal>.json`.
- A feladatszöveget olvasd fel szó szerint, és add oda papíron is.
- Egyszerre egy feladat; a sorrendet tesztelőnként variáld.
- Nem segítünk. Ha a tesztelő 3 percig elakad, kérdezd meg: „Mit keresel most?” Ha 5 percig, lépjetek tovább; ez „nem sikerült”.
- Minden feladat után: **SEQ:** „1-től 7-ig mennyire volt könnyű?”, és „Mit vártál, ami nem volt ott?”

**Zárás (7 perc):**
- „Mit mondanál egy barátodnak erről az oldalról vagy appról?”
- SUS-kérdőív, lent.
- „Mi volt a legzavaróbb?”, „Mi tetszett a legjobban?”
- Bizalom 1–5: „Mennyire bízol meg benne?”

## 3. Jegyzőlap (feladatonként egy sor)
| Tesztelő (kód) | Perszóna | Feladat | Siker (igen/részben/nem) | Idő (mp) | Kattintás | Elakadás helye | Idézet | SEQ | Megjegyzés |
|---|---|---|---|---|---|---|---|---|---|

Név helyett kódot írj (T1, T2…). A jegyzőlapot ne tedd nyilvános helyre.

## 4. SUS (System Usability Scale), 1–5 skála
1. Szívesen használnám rendszeresen.
2. Feleslegesen bonyolultnak találtam.
3. Könnyen használhatónak találtam.
4. Szükségem lenne segítségre a használatához.
5. A részei jól együttműködnek.
6. Túl sok benne az ellentmondás.
7. A legtöbben gyorsan megtanulnák használni.
8. Nagyon nehézkesnek találtam.
9. Magabiztosnak éreztem magam használat közben.
10. Sok mindent meg kellett tanulnom, mielőtt használni tudtam.

Pontszám: páratlan kérdések (érték − 1), páros kérdések (5 − érték), összeg × 2,5 → 0–100. 68 felett átlag feletti.

## 5. Összesítés és összevetés
- **Feladatonként:** sikerarány, idő mediánja, SEQ-átlag, a leggyakoribb elakadás.
- **Lelet-lista súlyossággal:** P0 elakadás; P1 komoly akadály, legalább 2 tesztelőnél; P2 zavaró; P3 apróság.
- **Összevetés a szintetikussal:**
  - Melyik leletet találta meg a szintetikus teszt is?
  - Mit csak az emberek? Ez a perszóna-készlet hiányossága: bővítsd a `personas.json`-t.
- Az összesítés a `report.json` mellé kerül, `human-<dátum>.md` néven, személyes adat nélkül.
