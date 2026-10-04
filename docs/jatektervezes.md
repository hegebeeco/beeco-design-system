# beeco játéktervezési elvek (minden új játékra)

Forrás: Kristóf koncepció-dokumentuma („beeco webjátékok – az első 5 prototípus”, 2026-09-18) + a beeco-szelektalj projekt tanulságai.

## A közös mondat
**Ne azt kérdezzük a játékostól, hogy tudja-e a helyes választ. Adjunk neki egy rendszert, amibe belenyúlhat, majd mutassuk meg, mi változott.**

## Hat alapelv
1. **30 másodperc alatt érthető** – az első fél percben már csinál valamit; szabály csak annyi, amennyi feltétlenül kell.
2. **A rendszer tanítson** – az összefüggés a következményből derüljön ki; nincs hosszú magyarázat, nincs „jó/rossz ember”.
3. **Több szempont egyszerre** – víz, élőhely, kényelem, költség, idő ütközik; ettől érdekes a döntés.
4. **Rövid menet, újrajátszható helyzet** – 5–20 perc; az új menet más helyzetet adjon, ne ugyanazt a megoldást kérje.
5. **Nem baj, ha nincs tökéletes végállapot** – a végén **profil** (3–4 mondat a játékos rendszeréről), nem egyetlen „zöld %”.
6. **Mobilon is működő mozdulatok** – koppintás, húzás, lerakás, vonalhúzás, kétirányú döntés; billentyűzet nem kell.

## Amit a beeco-szelektalj projektből tanultunk
* **Kevés olvasás játék közben:** legfeljebb 3 szó visszajelzés; a magyarázat a kör végén vagy lenyitható részben, forrással.
* **Hitelesség:** konkrét szám csak hiteles forrással (lehetőleg 2 egyező); a „rendszerértékek” jelzőcsíkok, nem mért adatok.
* **Kompromisszum, nem propaganda:** egyik gomb se legyen mindig az erkölcsösebb; valódi céget forrás nélkül nem minősítünk.
* **Mozgás és visszajelzés:** minden döntés után látható hatás (DS mozgás-készlet: felszálló pont, csipesz-pattanás, darabkák).
* **Rendezvényre is:** kioszk-mód, offline működés, gyors kör, kétjátékos lehetőség.
* **A tartalom adat:** JSON-ban, a beeco szerkeszti; tesztek ellenőrzik (hossz, forrás, matrica).

## Tesztelői tanulságok (2026-10-03, 16 játék első nagy tesztköre után)
Amit a tesztelők a legtöbbször mondtak, és ami azóta szabály minden új és átdolgozott játékra:

**Belépés**
* **Minden játék egy „Hogyan játssz?” kártyával indul** (`web/js/bevezeto.js`): a cél EGY mondatban + legfeljebb 3 szabály +
  „Kezdjük!”. Játékonként egyszer jön magától, a játék „?” gombja bármikor visszahozza. Ha jön, a súgó-buborék ugyanahhoz a
  játékhoz kimarad – két magyarázat egymás után sok. A mérőkön legyen látható a cél (célvonal), ne csak a szövegben.
* **A bemutató az alap, a haladó eszköz rejtett:** az első nézetben csak az, ami a fő élményhez kell; a többi egy „Haladó”
  gomb mögé kerül (Fenntartható otthonom). Minden új látogatás alapnézettel indul.
* **A fő gomb a fő út:** a köszöntő fő gombja az, amit a legtöbbeknek csinálniuk kell (pl. vezetett séta), nem a „Bezárás”.

**Változatosság (a leggyakoribb panasz: „hamar repetitív”)**
* **Látott-memória:** egy munkameneten belül a már látott kártyák hátrébb kerülnek – újrajátszáskor újak jönnek, amíg el nem fogynak.
* **Formaváltás ugyanarra a tudásra:** pl. minden 5. lap „Melyik a hiteles a kettő közül?” páros kártya; két egyforma kérdés
  helyett más nézőpont.
* **Nehezedés visszavágókor:** a 2. visszavágótól jöhet a nehezebb pakli; sorozat-bónusz (3 egymás után).
* **Véletlen esemény + ügyességi próba** (`mech/proba-*.js`): legfeljebb minden harmadik döntéshez, enyhe kimenettel.
* **Évszakos/köztes választás** (perk): a hosszabb játékokban 2–3 alkalommal egy-egy hosszabb távú döntés, egyszeri árral.

**Tempó és visszajelzés**
* **A jó válasz után tovább lehet lépni magától**, a hátralévő időt egy sáv mutatja, és koppintásra megáll; **rossz válasz
  után nincs automatikus továbblépés** – akkor kell igazán elolvasni a magyarázatot.
* **Szintek között nincs tempó-ugrás:** az új szint első fele az előző tempóján indul; legyen választható „Nyugodt tempó”.
* **A jó válasz ne mindig ugyanott legyen:** a válaszok sorrendje keveredik (a tartalomban a jó az első – a felület keveri).

**Érthetőség**
* **Belső zsargon nincs a felületen** („lejtő”, „kapaszkodó”, „lépcsőfok”): ha kell, egy rövid magyarázattal.
* **Egy mérő iránya egyértelmű:** a teli sáv legyen a jó („Hőterhelés” helyett „Hűvös város”).
* **Ahol nincs igazolt szám, ott ne legyen szám** („nincs igazolt szám”), és ne kérjük a játékost, hogy ilyet tippeljen.
* **Típus-címke minden játékon** (Ügyességi · Kvíz · Szimuláció · Felfedező) és „Tanulós” jelvény a lassabb, tanórára való játékokon.

**Képernyő**
* **Érintés:** minden koppintható elem ≥ 44 px, a csipeszgombok is; a 375 px széles telefon a mérce (a méret-próba ezt méri).
* **Panelen belül:** a bezáró gomb ragadós (görgetéskor is látszik), a háttérre koppintás bezár, és a listából nyitott elemről
  „← Vissza a listához” vezet vissza (a görgetési hely megmarad).
* **Időbeli adatnál egy szalag** múlt → ma → jövő (A mi bolygónk): a múlt csíkokkal, a jövő célként, nem jóslatként.

## Az 5 koncepció röviden (javasolt sorrend)
1. **Polgármester egy napra** – kétirányú döntéskártyák, 4 rendszerérték, késleltetett következmények, városprofil (gyors MVP).
2. **Élő kert** – lapkalerakás + szomszédsági hatások (élőhely, víz, hő, használhatóság), időjárás-események, kertprofil.
3. **Ételmentő** – hűtőrendezés, frissesség-lépcsők, receptek, 5 nap (a Hűtő-mester tartalmára építhető).
4. **Beporzó hálózat** – élőhelyek összekötése korlátozott kapcsolatszámmal, zavarások, redundancia.
5. **Körforgó háztartás** – kártya-kombinációk, anyagáramlás, hely/idő/pénz, receptkönyv.
