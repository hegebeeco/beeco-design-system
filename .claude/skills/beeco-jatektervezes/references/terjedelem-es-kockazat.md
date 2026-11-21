# Terjedelem, kockázat és a „kész” definíció

## Terjedelem
- **Az alap:** a jóváhagyott koncepció MVP-lépcsői és a GDD rendszerlistája. Ehhez mérünk.
- **Terjedelem-kúszás:** ha új elem kerül be anélkül, hogy más kikerülne vagy a határidő nőne. Felfedezett szükséglet rendben van, ha a naplóba kerül.
- **Mérés mérföldkövenként:** a tervezett elemek számához képest mennyi lett.
  - legfeljebb 10% → rendben;
  - 10–25% → jelzés Kristófnak, vágási javaslattal;
  - 25% felett → megállunk, és kapudöntés kell.
- **Négy kupac minden új elemre:** `VÁGJUK` · `KÉSŐBB` (parkoló, következő változat) · `MARAD` (tényleg kell) · `KRISTÓF DÖNT`.
- **Mit vágunk először:** ami nem szolgál pillért és tanulási célt; a legdrágább látvány (pl. évszakváltás animáció) helyett egyszerűbb megoldás;
  állomások összevonása. A játékos fő élményét védjük.

## Kockázatlista (a koncepciótól folyamatosan)
| kockázat | típus | valószínűség (kicsi/közepes/nagy) | hatás | mit teszünk | ki figyeli |
|---|---|---|---|---|---|
Típusok: **élmény** (unalmas, érthetetlen), **technika** (mobilon lassú, nem fut), **tartalom** (forrás, jóváhagyás, jogok), **terjedelem** (nem fér bele).
A legnagyobb élmény- és technikai kockázatot a prototípus teszteli, nem a gyártás.

## A „kész” definíció (minden gyártott darabra)
Egy állomás / rendszer / képernyő akkor kész, ha:
- [ ] a GDD elfogadási feltételei teljesülnek, és van rájuk teszt (`tests/check-*.js` vagy smoke-forgatókönyv);
- [ ] a szövegek a tartalomtáblából jönnek, és jóváhagyottak (vagy jelölten `JAVASLAT`);
- [ ] arculat: csak tokenek és ds- elemek, B szintű rajz, `check-arculat` és `check-art` zöld;
- [ ] mobilon (375 px) és asztalon is ellenőrizve, képernyőképpel;
- [ ] a minőségkapu lefutott (pontszám előtte → utána);
- [ ] hang nélkül is játszható, érintési felületek ≥ 44 px, csökkentett mozgásnál nincs zavaró animáció;
- [ ] `tools/smoke.js` hiba nélkül fut; konzolhiba nincs;
- [ ] a döntésnapló frissítve, ha változott valami a tervhez képest.
