---
name: beeco-jatektervezes
description: A beeco profi játéktervezési folyamata – fázisok és kapuk az ötlettől a kiadásig (brief, koncepció, játékterv/GDD, prototípus, vertical slice, gyártás, játékteszt, kiadás, utóélet), szigorúsági szintekkel és sablonokkal. Használd, ha új beeco játékot tervezünk, egy meglévőt nagyon átalakítunk, ha a felhasználó játéktervet, GDD-t, koncepciót, prototípust, játéktesztet, „hol tartunk a játékkal?”, „mehet a gyártás?” kérdést hoz, vagy egy játékfázis kapuját kell lezárni. A kódolás és az arculat részletei a beeco-jatek és a beeco-arculat skillben vannak.
---

# beeco játéktervezés – a folyamat

**Miért van:** a játékot házon belül, Kristóf és Claude együtt fejleszti. A drága hibák a tervezésben születnek,
nem a kódban: rossz alapötlet, homályos szabály, kitalált tény, túl nagy terjedelem. Ezért fázisokban haladunk,
és minden fázis végén van egy **kapu**, ahol Kristóf dönt. Kapu nélkül nem lépünk tovább.

**A közös mondat** (`docs/jatektervezes.md`) minden fázisban érvényes: ne azt kérdezzük, tudja-e a választ,
adjunk egy rendszert, amibe belenyúlhat, és mutassuk meg, mi változott.

## Szótár (Kristófnak is így magyarázd)
- **Brief:** fél–egy oldal arról, miért és kinek készül a játék, és miből látjuk, hogy sikerült.
- **Koncepció:** egy oldal arról, milyen játék lesz (ígéret, pillérek, alapciklus, kockázat).
- **GDD (játékterv):** a pontos működés rendszerenként, a „tervrajz”, amiből építeni lehet.
- **Prototípus:** eldobható, csúnya próbaváltozat egyetlen kérdés eldöntésére.
- **Vertical slice („mintaszelet”):** a játék egy kis darabja végleges minőségben, hogy lássuk a minőséget és a tempót.
- **MVP:** a legkisebb változat, ami már bizonyít valamit.
- **Kapu:** döntési pont a fázis végén. Kapukon az ítélet `MEHET` / `MEHET, DE…` / `NEM MEHET` / `NEM ÉRTÉKELT`;
  a prototípus- és a slice-jelentés végén pedig `TOVÁBB` / `FORDULAT` / `ELENGEDJÜK` / `NEM ÉRTÉKELT` (ez a 3. és 4. kapu ítéletét készíti elő).

## Munkamegosztás
- **Kristóf (a gazda):** kitűzi a célt, szakmai tartalmat ad vagy jóváhagy, a kapuknál dönt, próbajátszik.
  Nem programozó: neki mindig érthető nyelven, döntésre készen hozzuk a kérdést (egy kérdés, ajánlott válasz).
- **Claude:** megírja a terveket, megépíti a játékot, teszteli, és vezeti a **döntésnaplót** (dátum, döntés, ki döntött).
  Tényt nem talál ki: ami nincs forrással, az `HIÁNYZIK`. A saját ötlete `JAVASLAT – jóváhagyásra vár`.
- **Ágensek** a globális modellszabály szerint: Opus tervez és független ellenőr, Sonnet épít és minőségkaput futtat,
  Haiku a mechanikus munkát végzi.

## Szigorúsági szint – a játék elején válaszd ki
| szint | mire | kötelező fázisok |
|---|---|---|
| **kicsi** | egyképernyős kvíz, döntéskártya, meglévő mechanika új tartalommal | 0, 1 (rövid), 2 (egy rendszer), 5, 6 (belső kör), 7, 8 (rövid: egy bekezdés tanulság) |
| **közepes** | több mechanika, saját szabályrendszer, 10–20 perc | mind, a 4. lehet egy kisebb „mintaállomás” |
| **nagy** | 3D, bejárható világ, több rendszer, külső tartalom (pl. Csicsergősz) | mind, teljes sablonokkal |

Ha bizonytalan, eggyel nagyobbat válassz. A szintet a döntésnaplóba írd.

## A fázisok (részletek: `references/folyamat.md`)
| # | fázis | kimenet (sablon) | kapukérdés |
|---|---|---|---|
| 0 | **Brief** | `references/brief-sablon.md` | Ezt akarjuk, nekik, és így mérjük a sikert? |
| 1 | **Koncepció** (1 oldal) | `references/koncepcio-sablon.md` | Ez a játék? Ezt a kockázatot merjük vállalni? |
| 2 | **Játékterv (GDD)** | `references/gdd-sablon.md` | Minden szabály egyértelmű, minden tény forrással? |
| 3 | **Prototípus** | `references/prototipus-jelentes.md` | A legkockázatosabb kérdésre igen a válasz? |
| 4 | **Vertical slice** | `references/vertical-slice-jelentes.md` | Ez a minőség, és ebben a tempóban megépíthető? |
| 5 | **Gyártás** | a „kész” definíció (`references/terjedelem-es-kockazat.md`) | Mérföldkövenként: kész, ami kész? |
| 6 | **Játékteszt és hangolás** | `references/jatekteszt-protokoll.md` | Érthető, élvezetes, tanít? Kiadható? |
| 7 | **Kiadás** | indulási lista (`references/folyamat.md`) | Kristóf kifejezett engedélye – enélkül semmi nem megy ki. |
| 8 | **Utóélet** | visszatekintés | Mit tanultunk? → `docs/jatektervezes.md` |

**Kapu-ítélet:** `MEHET` · `MEHET, DE…` (a kockázatot Kristóf tudatosan vállalja, a naplóba kerül) · `NEM MEHET` (mi hiányzik) ·
`NEM ÉRTÉKELT` (nincs bizonyíték, pl. senki nem játszott vele). Az ítéletet Claude javasolja, Kristóf mondja ki.
Claude soha nem gyárt hiányzó dokumentumot csak azért, hogy átmenjen a kapun.

**Prototípus és slice után:** `TOVÁBB` · `FORDULAT` (mit tartunk meg, mit próbálunk másképp) · `ELENGEDJÜK` ·
`NEM ÉRTÉKELT` (megépült, de még senki nem játszott vele). Három fordulat ugyanazon az ötleten = elengedjük, és új ötletet keresünk.

**Mikor indul a projekt és a prototípus (egy szabály):**
- A játékprojekt (`tools/uj-jatek.js`) az **1. kapu** (koncepció) `MEHET` vagy `MEHET, DE…` ítélete után jön létre;
  a prototípus a projekt `prototipus/<kérdés>/` mappájába kerül, és soha nem importáljuk a gyártott kódba.
- **Nagy játéknál** a prototípus a koncepció-kapu után, a GDD írásával **párhuzamosan** indulhat, ha a kérdése technikai
  (pl. mobilos 3D-bejárás) és nem függ a tartalomtól. A vertical slice viszont csak a 2. kapu után, kész tartalomtáblával jöhet.
- Kis és közepes játéknál a sorrend kötött: 0 → 1 → 2 → 3 → …

## Oktatójáték – a beeco-réteg (részletek: `references/oktato-jatek.md`)
- A tanulási cél **a mechanikából** jöjjön (a játékos azt csinálja, amit meg kell tanulnia), ne a játék végére ragasztott kvízből.
- Minden mechanikához írd oda: melyik tanulási célt szolgálja. Ami egyiket sem, az kérdéses.
- A siker mérése: elő- és utókérdés (mit tudott előtte, mit utána), nem csak pontszám.

## Ahol a többi skill belép
- **Kód, projektindítás, kit:** `beeco-jatek` (az 1. kapu után indítjuk a projektet a `tools/uj-jatek.js`-sel, lásd fent).
- **Megjelenés:** `beeco-arculat` (tokenek, ds- elemek, B szintű rajz), 3D-nél `docs/3d-vilag.md`.
- **Gépi játékteszt:** `beeco-persona-test` (a 4. és 6. fázisban az emberi teszt **mellé**, nem helyette).
- **Felületi minőség:** `minosegkapu` minden képernyős munka végén.
- **Prototípus-változatok:** `prototype` (ha két-három irányt kell egymás mellé tenni).

## Hol él a terv
- Játékprojektben: `docs/jatekterv.md` (a sablon szakaszai), `docs/dontesek.md` (döntésnapló).
- Ha Kristóf Google Docsban dolgozik: a terv ott él, külön fülön, és a projektbe csak a jóváhagyott változat kerül.
- A folyamat vezetett munkalapja (állapot játékonként) Kristóf „beeco Játéktervező Műhely” nevű artifactja (az Artifact
  `list` műveletével, ezzel a címmel található meg; adatai: `jatekok/<játék>`, napló: `jatekok/<játék>/naplo`).
  A skill a szabály, a munkalap a műszerfal: kapudöntés után a munkalapon is rögzítsd.

## Nem alkudható
- Tény csak forrással; ismeretlen → `HIÁNYZIK`; Claude ötlete → `JAVASLAT – jóváhagyásra vár`. Árat, számot nem találunk ki.
- Kapu nélkül nincs fázisváltás; élesítés csak Kristóf kifejezett engedélyével.
- A prototípus kódja eldobható, a gyártás tisztán újraírja (nem „csinosítjuk fel” a prototípust).
- Ez a tároló nyilvános: ajánlat, ár, szerződéses adat, magánszemély elérhetősége nem kerülhet bele.
