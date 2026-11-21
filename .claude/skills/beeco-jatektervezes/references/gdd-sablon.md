# Játékterv (GDD) – rendszerenként

A GDD nem egy nagy regény, hanem **rendszerlapok** gyűjteménye (pl. bejárás, feladványok, mérő, befejezés) és egy
**tartalomtábla**. Minden rendszerlap ugyanazt a szerkezetet követi. A lap akkor kész, ha két fejlesztő ugyanúgy építené meg.

## A GDD eleje (egyszer)
- **Rendszertérkép:** a rendszerek listája, és mi mitől függ (pl. „a mérő az állomásoktól kap értéket, az évszakváltás a mérőtől”).
- **Képernyők és menet:** nyitóképernyő → bevezetés → játék → befejezés → összefoglaló; mi hova vezet.
- **Döntésnapló-link** és **tartalomtábla-link**.

## Rendszerlap – [rendszer neve]
1. **Összefoglaló** – 2–3 mondat: mi ez, miért van, mitől függ.
2. **Játékos-élmény** – mit érezzen közben (melyik pillért szolgálja).
3. **Tanulási cél** – melyik célt szolgálja (beeco-réteg). Ha egyiket sem: miért van mégis?
4. **Szabályok** – számozott, egyértelmű mondatok. Nincs „általában”, „nagyjából”.
5. **Állapotok és átmenetek** – milyen állapotai vannak, mi váltja őket (táblázat: állapot → esemény → új állapot).
6. **Kapcsolat más rendszerekkel** – mit kap, mit ad, milyen eseményt küld.
7. **Hangolható értékek** – táblázat: név, kezdőérték, tartomány, mit befolyásol. Ezek kerülnek a kódban egy helyre (konfiguráció), nem szétszórva.
8. **Szélső esetek** – mi történik, ha: kétszer rossz; kilép és visszajön; hang nélkül játszik; nagyon gyors/lassú; kis képernyő; csökkentett mozgás; megszakad a betöltés.
9. **Kép és hang** – mi látszik, mi szól, milyen visszajelzés jön jó és rossz lépésnél (beeco: rossz lépésnél a gondolkodó méh, soha nem a mérges).
10. **Kezelés és felület (UI)** – mozdulatok (koppintás, húzás), gombok, feliratok, „Tudj meg többet” réteg; 44 px-es érintési felületek.
11. **Játékérzet** – időzítések, animációk, hogy ne legyen „üres” a kattintás.
12. **Akadálymentesség** – hang nélküli megfelelő (felirat, ikon), színek mellett ikon, billentyűzet, mozgáscsökkentés.
13. **Elfogadási feltételek** – ellenőrizhető mondatok: „Ha a játékos …, akkor …”. Ebből lesz a teszt.
14. **Nyitott kérdések** – `HIÁNYZIK: …`, ki dönt.

## Tartalomtábla (minden szöveg, kérdés, tény)
| azonosító | hol jelenik meg | szöveg (rövid) | „Tudj meg többet” | forrás (link) | jóváhagyta (név, dátum) |
|---|---|---|---|---|---|
Szabály: tény csak forrással; Claude szövege `JAVASLAT`; a jóváhagyás-oszlop üres, amíg Kristóf (vagy a tartalomgazda) nem hagyja jóvá.
Játékprojektben a tartalom JSON-ban él (`web/data/tartalom.json`, `forrasok.json`), és teszt ellenőrzi (hossz, forrás).

## GDD-ellenőrzőlista a kapu előtt
- [ ] Minden rendszernek megvan a 14 pontja (kicsi játéknál: 1, 4, 7, 8, 13 kötelező).
- [ ] A hangolható értékek egy táblázatban vannak, kezdőértékkel.
- [ ] Minden tanulási cél legalább egy rendszerhez kötődik.
- [ ] A tartalomtábla minden tényénél van forrás vagy `HIÁNYZIK`.
- [ ] Az elfogadási feltételekből teszt írható.
- [ ] A rendszertérképen nincs „árva” rendszer (amit semmi nem használ).
