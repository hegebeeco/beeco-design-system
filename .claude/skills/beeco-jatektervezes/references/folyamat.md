# A fázisok részletesen

Minden fázisnál: **mi kell hozzá** (bemenet), **mi lesz belőle** (kimenet), **kapukérdések**, **tipikus hibák**.
A kapukérdéseket Claude készíti elő (mi teljesül, mi nem, mi a kockázat), Kristóf dönt. Az ítélet a döntésnaplóba kerül.

---

## 0. Brief – mit akarunk elérni?
**Bemenet:** Kristóf ötlete, a partner vagy kampány célja, a meglévő anyagok (dokumentum, sztori, források).
**Kimenet:** `brief-sablon.md` kitöltve (fél–egy oldal).
**Kapukérdések**
- Egy mondatban leírható, miért készül a játék, és kinek?
- Van mérhető siker (pl. „a játékosok fele végigér”, „utána meg tudja mondani a 3 lépést”)?
- Ismert a keret: határidő, platform (telefon/böngésző), hova kerül, ki hagyja jóvá a tartalmat?
- Megvan, mit **nem** csinál a játék?
**Tipikus hibák:** a cél „legyen egy jó játék” (nem mérhető); a közönség „mindenki” rétegzés nélkül; a tartalomgazda nincs kijelölve.

## 1. Koncepció – milyen játék lesz?
**Bemenet:** jóváhagyott brief.
**Kimenet:** `koncepcio-sablon.md` – egy oldal: játékosígéret, pillérek, alapciklus, referenciák, top-3 kockázat, MVP.
**Kapukérdések**
- A játékosígéret 10 másodperc alatt érthető egy kívülállónak?
- A 3 pillér tényleg kizár valamit (van, amire nemet mond)?
- Az alapciklus 30 másodperces szintje önmagában is jó érzés?
- Megvan a legkockázatosabb feltevés, és az, hogy a prototípus hogyan teszteli?
**Tipikus hibák:** funkciólista élmény helyett; öt-hat pillér, ami semmit nem zár ki; a tanulás a játék végén, kvízként.

## 2. Játékterv (GDD) – pontosan hogyan működik?
**Bemenet:** jóváhagyott koncepció, szakmai források.
**Kimenet:** `gdd-sablon.md` rendszerenként (pl. bejárás, feladványok, mérő, befejezés), plusz **tartalomtábla**
(minden szöveg, kérdés, tény egy sorban, forrással és jóváhagyás-oszloppal).
**Kapukérdések**
- Két ember ugyanúgy építené meg a szabályt a leírásból?
- Minden állapotváltás és szélső eset le van írva (mi van, ha a játékos kilép, kétszer rossz, hang nélkül játszik)?
- A hangolható értékek (küszöbök, idők, próbák száma) külön listában, kezdőértékkel?
- Minden tény mellett ott a forrás, ami nincs, az `HIÁNYZIK`?
- Minden rendszernek van elfogadási feltétele (miből látjuk, hogy kész)?
**Tipikus hibák:** „majd a fejlesztés közben kiderül”; számok a szövegben elszórva; a tanulási cél nem kötődik egyik rendszerhez sem.
**Kicsi játéknál** egy rendszerleírás és a tartalomtábla elég.

## 3. Prototípus – működik-e az ötlet?
**Bemenet:** a koncepcióból vagy a GDD-ből a **legkockázatosabb kérdés** (pl. „mobilon is kényelmes a 3D-bejárás?”, „érthető a mérő?”).
**Mikor:** kis és közepes játéknál a 2. kapu után; nagy játéknál technikai kérdésre már az 1. kapu után, a GDD-vel párhuzamosan
(`SKILL.md`, „Mikor indul a projekt és a prototípus”). Helye: a projekt `prototipus/<kérdés>/` mappája.
**Kimenet:** eldobható szürke doboz (papír, HTML vagy 3D) + `prototipus-jelentes.md`.
**Szabályok**
- Időkeret: legfeljebb 1–2 munkanap. Ha nő, a kérdést szűkítjük, nem a keretet.
- Egy kérdés, egy mechanika. Nincs menü, zene, szép rajz – kivéve, ha éppen az a kérdés.
- Inkább 2–3 változat egymás mellett, mint egy változat végtelen csiszolása.
- Kipróbálja legalább 3 ember, aki nem látta a tervet (köztük egy a célközönségből), telefonon is.
**Kapukérdések:** a feltevés igaz lett (mért jellel, nem érzésre)? Mi lett a kiinduló hangolás? `TOVÁBB` / `FORDULAT` / `ELENGEDJÜK`?
**Tipikus hibák:** a prototípust kezdjük el „szépíteni”; nem a legkockázatosabb kérdést teszteljük, hanem a legkényelmesebbet.

## 4. Vertical slice – ez lesz a minőség
**Bemenet:** jóváhagyott GDD (2. kapu), kész tartalomtábla a szelethez, a prototípus tanulságai, a koncepció teljesítménycélja.
**Kimenet:** egy teljes szelet (pl. egy állomás) **végleges minőségben**: arculat, hang, visszajelzés, szöveg, mobil;
`vertical-slice-jelentes.md` benne a tempónaplóval (hány nap ment el mire).
**Kapukérdések**
- Segítség nélkül, a célidőn belül átéli a játékos az ígért élményt?
- A tempónapló alapján a teljes játék belefér a keretbe? Ha nem, mit vágunk (`terjedelem-es-kockazat.md`)?
- Átment a minőségkapun (`minosegkapu`) és a perszóna-teszten (`beeco-persona-test`), plusz legalább 5 ember?
**Tipikus hibák:** a szelet túl kicsi ahhoz, hogy a tempót mérje; a hiányzó hang és visszajelzés miatt rossz következtetés.

## 5. Gyártás – a többi rész, ugyanazon a mércén
**Bemenet:** a slice mint minta, a tempóból becsült ütemterv, mérföldkövek.
**Munkamód:** kis lépések, rendszerenként vagy állomásonként; minden darab a „kész” definíció szerint (`terjedelem-es-kockazat.md`).
Új ötlet gyártás közben a **parkolóba** kerül (döntésnapló), nem a játékba – kivéve, ha Kristóf a kapun beengedi, és mást kivesz érte.
**Mérföldkő-kapu:** mi kész a definíció szerint, mennyit nőtt a terjedelem (10% felett jelzés, 25% felett megállunk és vágunk).

## 6. Játékteszt és hangolás
**Bemenet:** a teljes, futó játék.
**Kimenet:** játékteszt-jelentés(ek) a `jatekteszt-protokoll.md` szerint, hangolási lista, javítások négy kupacban.
**Kapukérdések:** a játékidő a célon belül? A befejezési arány elfogadható? Az utókérdések alapján tanít? Nincs „elakasztó” hiba?
**Tipikus hibák:** csak belső tesztelők; a tesztelőnek magyarázunk közben (akkor nem a játékot teszteljük).

## 7. Kiadás
**Indulási lista**
- [ ] A tartalom minden sora jóváhagyva (tartalomtábla jóváhagyás-oszlopa), a források élesítés előtt újra ellenőrizve.
- [ ] Jogok: képek, hangok (felvételenként licenc és feltüntetés), szereplők, valódi helyszínek hozzájárulása.
- [ ] Tesztek zöldek: `tests/check-*.js`, `tools/sw-lista.js`, `tools/smoke.js`, minőségkapu, mobil (375 px) és asztal.
- [ ] Akadálymentesség: hang nélkül is játszható, 44 px-es érintési felületek, billentyűzet, csökkentett mozgás.
- [ ] Adatkezelés: a játék nem kér személyes adatot; ha mérünk, arról döntés és tájékoztatás van.
- [ ] Beágyazás, kioszk, offline (ha kell), megosztási kép, cím.
- [ ] **Kristóf kifejezett engedélye** az élesítésre.

## 8. Utóélet
- 2–4 hét után: játékidő, befejezési arány, visszajelzések, hibák.
- **Visszatekintés** (rövid): mit jósoltunk jól, mit rosszul, mit csinálnánk másképp a folyamatban.
- A tanulság, ami minden játékra érvényes, a `docs/jatektervezes.md`-be kerül; ami a folyamatra, ebbe a skillbe.
