# Javaslat 21 – A Javaslat 20 bekötésének finomításai: lépésjelző másolásnál, nyomtatható eszközsor, kikapcsolható kupon-sorok, oszlopfejléc-súgó

*Állapot: **jóváhagyva** · készítette: Claude (ADMINAPP) · dátum: 2026-10-05*
*Kristóf jóváhagyta, 2026-10-05 – mind a négy elemét.*

## 1. Igény
- Hol kell: beeco admin – a DS 1.42 (Javaslat 20) bekötésekor derült ki (`ds-142-bekotes`, áttekintő: „Következő DS-javaslat jelöltjei (21)”).
  A partner-app ugyanígy kapja.
- Mit old meg: négy kis következetlenség / hiány, amit az admin most kerülőúton old meg.
- Ma helyette (admin):
  - **Lépés-mód másolásnál** (`EditPage steps.allReachable`): a még nem látott köztes lépések pipát (kész) kapnak, az utolsó számot
    (hátravan) – a felhasználó azt hiszi, a köztes lépéseket már átnézte;
  - **Hatás-riport** (`pages/Hatas/HatasRiport.tsx`): a `Dashboard printable` papíron a TELJES eszközsort rejti, a benne álló szöveget
    (időszak) is – ezért az időszak a fejléc leírásába költözött;
  - **App-előnézet kupon** (`components/AppElonezet/`): a kuponsablonnak nincs saját érvényessége – a kártyán „Érvényesség helye” állna,
    ezért az admin kitalált szöveget ír (`validUntil: 'az időzítés szerint'`); a DS levágás-jelzése és az admin karakterbecslése kétszer szól;
  - **Oszlopfejléc-súgó** (`components/SugoFejlec/`): a DataTable fejlécének nincs súgó-helye – projekt-elem (POI-lista „Láthatóság”,
    kuponsablonok „Kiemelés”).

## 2. Mire épül (docs/komponensek.md 1.)
- DS-elemek: `EditPage` + `Stepper` (Javaslat 20), `Dashboard` + `usePrintFrame` (Javaslat 20), `PreviewCard` + `Clamp`, `DataTable` +
  `SortHeader`, `HelpButton`.
- Projekt-komponensek, amiket kivált: admin `SugoFejlec`; a Hatás-riport és az app-előnézet kerülőútjai.
- Szint: semmi új elem – meglévő sablon / organizmus új, opcionális lehetősége; új vizuális minta nincs (a súgó a meglévő `bc-help-btn`).

## 3. Változatok és a választott megoldás
| Elem | A (választott) | B | Miért A |
|---|---|---|---|
| Lépésjelző másolásnál | a még nem látott lépés „hátravan” (szám), de kattintható; pipa csak a látott **és** hibátlan lépésen | minden lépés pipa (a mai), vagy egyik sem | a pipa azt ígéri, hogy átnézte – csak akkor jár; a kattinthatóság (reachable) független marad |
| Nyomtatható eszközsor | papíron csak a **vezérlők** (mező, gomb, szegmens, kereső, kapcsoló) tűnnek el, a szöveg marad; csak vezérlős sor egészében rejtve (mint eddig) + `.bc-print-show` | új `printText` prop | a projekt a meglévő `toolbar`-ba írja a szöveget; a régi hívás változatlanul néz ki |
| Kupon-sorok | `validity={false}`, `descriptionRow={false}` (alap: igen, helykitöltővel) | üresen mindig rejtve | élő szerkesztésnél a helykitöltő jelzi, hol lesz a szöveg – ezt nem vesszük el csendben |
| Levágás-jelzés | `notes={false}` – a keret alatti jelzés nincs, a levágott szöveg szaggatott jelölése marad | `onCuts` visszahívás | egyszerű; a mérés eredménye a kártyán úgyis látszik |
| Fejléc-súgó | `columnDef.meta.help` (ReactNode) – a DataTable rajzolja a `HelpButton`-t | `header`-be írt saját elem (a mai) | egy helyen a 44 px, a név („<oszlop> – súgó”) és a rendezés-gombtól való elválasztás |

## 4. Állapotok
- **Lépésjelző:** normál (nem látott: hátravan, nem kattintható) · másolat kezdetben (1. mostani, a többi hátravan + kattintható) ·
  másolat, a 3. lépésre ugorva (1. kész, 2. hátravan, 3. mostani) · látott, de azóta hibássá vált lépés (hátravan; a „Tovább”/mentés
  utáni hiba továbbra is „hiba”) · újra kitöltve (kész).
- **Nyomtatás:** képernyő (szöveg és vezérlők látszanak, `.bc-print-show` rejtve) · papír (vezérlők rejtve, szöveg és `.bc-print-show`
  látszik) · papír, csak vezérlős eszközsor (az egész sor rejtve – a mai viselkedés).
- **Kupon:** alap (érvényesség- és leírás-sor, üresen helykitöltő) · érvényesség nélkül (kártyán és részleteken sincs) · leírás nélkül ·
  jelzés nélkül (a levágott szöveg jelölve, a keret alatt nincs badge).
- **Fejléc-súgó:** rendezhető oszlop (rendezés-gomb + ⓘ) · nem rendezhető · szám-oszlop (jobbra igazítva) · súgó nélkül (a mai DOM) ·
  nyitott súgó (rámutatásra / kattintásra, Esc zárja) · kártyanézet (a fejléc rejtett, a súgó a képernyőolvasónak elérhető marad).

## 5. Szélső esetek (tesztlapon)
- `sablon-lepesek`: másolat kezdetben: a 2–3. lépés `is-todo`, számmal, képernyőolvasónak „még hátravan”, de gomb · a 3. lépésre ugrás
  után az 1. kész, a 2. hátravan · a 2. lépésen a 3. (látott, hibátlan) kész · a látott lépés mezőjét kiürítve hátravan, újra kitöltve kész.
- `sablon-iranyitopult`: nyomtatáskor a `.bc-field` és a `.bc-seg` rejtve, az eszközsor szövege és a `.bc-print-show` látszik · képernyőn
  a `.bc-print-show` rejtve · `?allapot=csakvezerlo`: papíron az egész eszközsor rejtve.
- `kieg-elonezet`: kupon `validity={false}` (kártya és részletek) · `descriptionRow={false}` · `notes={false}` hosszú szöveggel
  (badge nincs, `data-cut` jelölés van) · az alap kupon érvényessége változatlan.
- `adat-tabla`: „Név – súgó” 44×44 · a súgóra kattintva nyílik, az `aria-sort` nem változik · a rendezés-gomb rendez · nem rendezhető
  (Aktív) és szám-oszlop (Képek) is · `meta.help` nélkül nincs súgó a fejlécben.

## 6. API
```tsx
// 1. Lépésjelző – a hívás nem változik; az állapot-szabály: kész = látott ÉS hibátlan (a validate szerint)
<EditPage … steps={{ items, label, allReachable: masolat }} />
// 2. Nyomtatható eszközsor
<Dashboard printable toolbar={<>
  <SegmentedControl … />                                   {/* papíron rejtve */}
  <p className="bc-muted">Időszak: 2026. 09. 01. – 09. 30.</p>   {/* papírra is kerül */}
  <p className="bc-print-show">Gyors időszak: utolsó 30 nap</p> {/* csak papíron */}
</>} />
// 3. Kupon
<PreviewCard variant="kupon" … validity={false} descriptionRow={false} notes={false} />
// 4. Oszlopfejléc-súgó
{ id: 'lathato', header: 'Láthatóság', meta: { label: 'Láthatóság', help: 'Kapcsold ki, és a POI eltűnik az appból. Visszakapcsolható.' } }
```
CSS: `.bc-dt-head` (fejléc + ⓘ), `.bc-print-show`, `.bc-sablon-toolbar > p`; a nyomtatási szabály az eszközsor vezérlőire szűkült.

Visszafelé kompatibilis: semmi nem változott nevet, minden új prop opcionális. Viselkedés-változás csak kettő, mindkettő a jelzés
pontosítása: (1) a lépésjelző a még nem látott lépést „hátravan”-nak mutatja (eddig pipát kapott), a látott, de azóta hibássá vált lépést is;
(2) nyomtatáskor az eszközsor szövege papírra kerül (eddig az egész sor eltűnt; a csak vezérlős sor továbbra is eltűnik).

## 7. Hozzáférhetőség
- Lépésjelző: az állapot a jelen (szám / pipa / ×) és a képernyőolvasó-szövegben („még hátravan”, „kész”) is – a kettő most egyezik a valósággal.
- Nyomtatás: papíron nincs olyan vezérlő, amit nem lehet használni; a választott érték szövegként olvasható.
- Kupon: kikapcsolt sor helyén nincs üres hely és nincs félrevezető helykitöltő.
- Fejléc-súgó: valódi `<button>` (Radix Popover), 44×44 px érintési felület, név „<oszlop> – súgó”; a rendezés-gombtól külön, így
  Tab-bal külön elérhető és nem rendez; a piktogram a fejléc színét veszi (a mézen on-accent – kontraszt).

## 7/b. Kiegészítés: gépi mérés (ugyanebben a kiadásban)
A `tools/komp/oldal-meres.js` (→ `dist/meres/oldal-meres.js`, az admin e2e füsttesztje is ezt futtatja) „Árnyék” szabálya a DS 1.41.0 óta
szándékosan lapos felületekre is P2-t adott (DetailPage összegzés csempéi, `bare` tábla) – az admin e2e emiatt bukott minden részletoldalon.
A mérés ezeket kihagyja: `.bc-dt.is-cards`, `.bc-dt.is-bare`, `.bc-sablon-summary-block`, és az árnyék nélküli felület, ha árnyékos dobozba
(kártya, ablak, buborék, fiók, tábla-burok) van ágyazva; gombot továbbra is mér. Ellenőrzés: az `adat-tabla` és a `sablon-reszletek`
tesztlapon az Árnyék-lelet eltűnt.

## 8. Döntés
- Dátum: 2026-10-05 – Kristóf: mind a négy elem elfogadva.
- Választott változat: mindenhol az A (3. pont).
- Kiadás: DS 1.43.0 (mellékverzió).
