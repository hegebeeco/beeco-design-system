# A beeco-jatek-kit változásai

A kit verziószáma a `VERSION` fájlban van, **szemantikus verziózással** (FŐ.MELLÉK.JAVÍTÁS):

* **JAVÍTÁS** (1.0.**1**) – hibajavítás, új matrica/piktogram, szövegjavítás a szabálykönyvekben; semmi nem változik, amire egy játék épít.
* **MELLÉK** (1.**1**.0) – új lehetőség (új eszköz, új `ds-` elem, új token), ami a meglévő játékokat nem érinti.
* **FŐ** (**2**.0.0) – olyan változás, ami miatt a játékokban is módosítani kell (átnevezés, törlés, más viselkedés). Ezt kerüljük
  (lásd `CLAUDE.md`: csak bővítünk), és ha mégis kell, itt írjuk le, mit kell a játékokban átírni.

**Kiadás menete:** a lenti „Készül” rész tételei kerülnek az új verzió alá → `VERSION` átírása → commit + push a kitben →
a játékokban `node ~/CLAUDE/beeco-jatek-kit/tools/kit-sync.js .` (ez beírja a projekt `KIT-VERZIO` fájljába az új verziót).
Hol tart egy játék? `node ~/CLAUDE/beeco-jatek-kit/tools/kit-sync.js <projekt> --check` – kiírja a projekt és a kit verzióját.

## 1.47.1 – 2026-10-06 – javítás: Kaptár-kapu, minőségkapu
* **`kk.css`** – a számcímkék zöldje sötétebb (fehér felirat kontrasztja 3,9 → 7,1), a forráslink olvasható, a site
  gombjai a szekciókban 44 px magasak, a nem kattintható értékcsempe nem mutat kéz-kurzort.
* **`review-szabalyok.json`** – a címke zöldje és a Webflow-slider pöttye a palettán.

## 1.47.0 – 2026-10-06 – Kaptár-kapu: a hub a site meglévő blokkjaiból, belső menü, Kaptár-rajnevek
Mellékverzió (WEB, 2026-10-06; a felhasználó visszajelzése: hiányzott a vízió és a bemutatkozás, a design nem a site-é).
* **`kk.js`** – belső menü (`data-kk-lapnav`): a site fejléce alá tapad, az aktuális szakasz `aria-current`; a raj-választó a
  Kaptár valódi rajneveit ajánlja (Szoftver, Tartalom, Design, Fenntarthatóság, Biznisz); az adatforrás bármelyik gyökéren
  megadható (`data-kk-forras`); **CMS-mód**: ha az oldalon Webflow CMS-feladatkártyák vannak (`data-kk-cms="feladat"`),
  a modul azokat szűri, azokból tölti az űrlapot és a raj-választót, és nem jelöli mintaadatnak.
* **`kk.css`** – belső menü, horgony-eltolás a fejléc + menü magasságával, a /rolunk vízióblokkjának piktogramja mobilon.
* **`kapu-minta.json`** – a mintaadat a Kaptár rajneveit használja. **`kapu-adat-szerzodes.md`** – átmenet ideiglenes Webflow
  CMS-sel („Önkéntes feladatok” gyűjtemény). **`README.md`** – az oldal felépítése a meglévő komponensekből.

## 1.46.3 – 2026-10-06 – javítás: Kaptár-kapu, szekció-bevezetők középre
* **`kk.css`** – a szekciók bevezető szövege középre igazodik, 760 px-es sorhosszal (a Webflow a `MAIN_TEXT` osztályt kisbetűvel, `main_text`-ként adja ki).

## 1.46.2 – 2026-10-06 – javítás: Kaptár-kapu, második minőségkapu-kör
* **`kk.css`** – a kenyérmorzsa és a site elsődleges gombjai az oldalon 44 px magasak; az oldal képei nem kapnak kemény árnyékot.
* **`review-szabalyok.json`** – a kenyérmorzsa akadálymentes zöldje a palettán; megjegyzés: a termékbőr tintája #000.

## 1.46.1 – 2026-10-06 – javítás: Kaptár-kapu akadálymentesség (minőségkapu)
* **`kk.js`** – a site „diplomamunka” harmonikája (`gyik_item`) billentyűzettel is nyitható (`role=button`, `aria-expanded`).
* **`kk.css`** – a hero kenyérmorzsája olvasható (kontraszt 2,7 → 5,6), a másodlagos gomb és az űrlapmezők 44 px magasak,
  az űrlap melletti kép nem kap kemény árnyékot (árnyék = nyomható), a hero gombjai középre igazodnak.
* **`review-szabalyok.json`** – az animáció-ellenőrzés a modul valódi jelölőjére figyel.

## 1.46.0 – 2026-10-06 – Kaptár-kapu: élő oldalmodul a Csatlakozz oldalhoz

Mellékverzió (WEB, 2026-10-06) – csak új fájlok és egy új dokumentációs fejezet.

* **`weboldal/csatlakozz/kk.js` + `kk.css`** – hat blokk egy JSON-forrásból (`data-kk`): felpörgő számok, nyitott feladatok
  szűrővel (raj, online/helyben, kézzel/vibe-code), 3 kérdéses raj-választó, Kaptár-szintek és rajpont-bolt, havi ranglista
  (csak hozzájárulással), helyi csapatok városonként. Minden választás kitölti a meglévő Webflow-űrlap terület-mezőjét.
  Pótolja a duplikált oldalról hiányzó „Nyitott méhsejtek” harmonika-interakciót (akadálymentesen), és a szerepkártyák
  „Érdekel!” gombja is előtölti az űrlapot. Mérés `gtag`-gel, ablakszintű figyelővel (9 esemény).
* **`kapu-minta.json`** – jelölt mintaadat; **`kapu-adat-szerzodes.md`** – az élő végpont (Netlify function + `security definer`
  RPC), a Kaptár-mezők megfeleltetése és a szükséges Kaptár-változások; **`review-szabalyok.json`** – mintaadat = P1.
* **`docs/weboldal.md`** – új 10. fejezet: élő oldalmodulok.

## 1.45.1 – 2026-10-06 – javítás: Raj modul színöröklés, helyfoglalás, verziósáv
* **`cs-raj.css`** – a modul szövegei a site elem-szintű stílusa miatt feketék lettek (`li`, `span`): most öröklik a kampány tintáját.
  Betöltés alatt a blokkok helyet foglalnak (asztalon és mobilon külön), így nincs elrendezés-ugrás (CLS 0,106 → 0).
  A 15 px-es szövegek 16 px-esek (kevesebb méretlépcső).
* A kampányoldal a **`@1.45` verziósávra** hivatkozik a jsDelivr-en (README, `head.html`, `footer.html`, mintaadat-cím),
  így a javítóverziók kódcsere nélkül kijutnak.

## 1.45.0 – 2026-10-06 – Raj modul a CsicsergŐsz kampánytémához: közösségi számláló, közös cél, kerületi verseny, fotófal

Mellékverzió (WEB; Kristóf kérte, 2026-10-06) – csak új fájlok.

* **`weboldal/kampany-csicsergosz/cs-raj.js` + `cs-raj.css`** – négy blokk egy JSON-forrásból (`data-cs-raj`): felpörgő
  számláló, közös cél haladásjelzővel és szponzorral, kerületi verseny sematikus méhsejt-térképpel és ranglistával
  (billentyűzettel kezelhető, mérve), fotófal. Tokenekre épül, csökkentett mozgásnál nem animál.
* **`raj-minta.json`** – jelölt mintaadat (`"minta": true` → „Mintaadat” címke az oldalon); **`raj-adat-szerzodes.md`** – az élő
  végpont leírása (mezők, frissítés, CORS, adatvédelem, fotó-hozzájárulás).
* **`review-szabalyok.json`** – mintaadat az oldalon = P1 (élesítés előtt élő adat kell); a térkép két méz-tónusa a palettában.

## 1.44.0 – 2026-10-05 – Kampánytéma a weboldal-rétegben: CsicsergŐsz (tokenek, mozgáskészlet, mérés, ellenőrzés)

Mellékverzió (WEB; Kristóf kérte, 2026-10-05) – csak új fájlok és dokumentáció, semmi nem változott nevet.

* **`weboldal/kampany-csicsergosz/`** – az őszi madárkampány arculata újrahasználható formában: a Webflow „Csicsergosz”
  változógyűjtemény exportja (`tokens.json`: 10 szín, 12 szerep, 2 betű, 14 méret, 8 szám), oldal-CSS (ferde szekcióél,
  kampánygomb, díszítők), **mozgáskészlet** (`data-cs-anim="fel|pop|level|sav|rajzol"`, `data-cs-gyerekek`, `data-cs-szamlal`;
  egyszer játszik, csökkentett mozgásnál áttűnés, JS nélkül 2,5 mp után minden látszik), **mérés** (Levi 7 eseménye,
  `gtag`-gel), beilleszthető `head.html`/`footer.html`, és a kampány ellenőrzési szabályai (`review-szabalyok.json`).
  jsDelivr-ről is betölthető (README).
* **`docs/weboldal.md`** – új 9. fejezet (kampánytémák), és hat új tanult Webflow-korlát a 3. fejezetben: alt nem írható
  API-n, `box-shadow` + `var()`, időzítés szám-változóval, aszinkron publikálás és draft, Trustindex-kattintás, GA4 GTM nélkül.

## 1.43.1 – 2026-10-05 – javítás: lépés-módban az utolsó lépésre lépés nem küldi be az űrlapot
* **EditPage `steps`** – az utolsó előtti lépésen a „Tovább” kattintása közben a React ugyanazt a `<button>`-t használta újra
  `type="submit"`-tel (Mentés), így a böngésző még ugyanabban a kattintásban beküldte az űrlapot: az utolsó lépésre lépve
  mentett (az adminban így jött létre egy partner kétszer). Most a két gomb külön kulcsot és típust kap. 1.42.0 óta élő hiba.
  Tesztlap: `sablon-lepesek` (új forgatókönyv).

## 1.43.0 – 2026-10-05 – A Javaslat 20 bekötésének finomításai (Javaslat 21): lépésjelző másolásnál, nyomtatható eszközsor, kikapcsolható kupon-sorok, oszlopfejléc-súgó

Mellékverzió (ADMINAPP; Kristóf jóváhagyta, 2026-10-05) – minden új lehetőség opcionális, semmi nem változott nevet. Javaslatlap: `docs/javaslatok/21-admin-bekotes-finomitasok.md`.

* **EditPage `steps` – következetes lépésjelző:** pipa (kész) csak a ténylegesen látott és hibátlan lépésen (a `validate` szerint); a még nem
  látott lépés „hátravan” (szám) – `allReachable` mellett is, ott kattintható marad. Eddig másolásnál a nem látott köztes lépések pipát
  kaptak, az utolsó számot. A látott, de azóta hibássá vált lépés sem kap pipát.
* **Dashboard `printable` / `usePrintFrame` – az eszközsor szövege papírra kerül:** nyomtatáskor a `.bc-sablon-toolbar`-ból csak a vezérlők
  (mező, gomb, szegmens-választó, kereső, kapcsoló) tűnnek el, a szöveg (pl. „Időszak: …”) marad; a csak vezérlős eszközsor egészében
  rejtve (mint eddig). Új segédosztály: **`.bc-print-show`** – csak papíron látszik (képernyőn rejtve). `.bc-sablon-toolbar > p` margó nélkül.
* **PreviewCard kupon:** `validity={false}` – nincs érvényesség-sor (kártyán és a részletek adatsorában sem; pl. kuponsablon, amit az
  időzítés tesz érvényessé); `descriptionRow={false}` – nincs leírás-sor. **`notes={false}`** (minden változat) – a keret alatti
  levágás-jelzés nem jelenik meg (ha a projekt maga mondja el), a levágott szöveg szaggatott jelölése marad.
* **DataTable `columnDef.meta.help`** – oszlopfejléc-súgó: ⓘ (`HelpButton`, 44 px, képernyőolvasónak „<oszlop> – súgó”) a fejléc mellett;
  rendezhető oszlopnál a rendezés-gombtól külön gomb, nem rendez; a mézen a fejléc színét veszi. CSS: `.bc-dt-head`.
* **Gépi mérés (`tools/komp/oldal-meres.js` → `dist/meres/oldal-meres.js`, a projektek e2e-je is ezt tölti):** az „Árnyék” szabály kihagyja a
  szándékosan lapos felületeket – kártyanézetű és `bare` (kártyába ágyazott) tábla, a DetailPage összegzésének csempéi
  (`.bc-sablon-summary-block`), és minden árnyék nélküli felület, ami egy másik árnyékos dobozba (kártya, ablak, buborék, fiók, tábla)
  van ágyazva („nincs kártya a kártyában”); a gombot továbbra is méri. Eddig ezek hamis P2-leletet adtak (az admin részletoldalain is).
* Tesztlapok: bővítve `sablon-lepesek` (másolat: hátravan + kattintható, kiürített lépés), `sablon-iranyitopult` (szöveg papíron,
  `.bc-print-show`, `?allapot=csakvezerlo`), `kieg-elonezet` (kupon `validity` / `descriptionRow` / `notes`), `adat-tabla` (`tabla-sugo`).

## 1.42.1 – 2026-10-05 – a React-csomag modulonként épül (kisebb első betöltés a projektekben)
* **`dist/react/` modulonként** (`tools/react-build.js`: minden forrásfájl belépési pont + közös darabok `dist/react/reszek/`,
  esbuild `splitting`). Eddig az egész DS egyetlen fájl volt, így a projekt buildje (Vite/Rollup) minden használt DS-elemet a
  belépő-csomagba tett – akkor is, ha csak egy lusta oldal használta. Most minden elem abba a csomagba kerül, ahol használják.
  Az admin belépő-csomagja így 279 → 213 kB (gzip). Az import ugyanaz (`@beeco/design-system/react`), semmi nem változik a
  projektekben. A `--check` a régi / fölösleges fájlt is jelzi.

## 1.42.0 – 2026-10-05 – Admin UX-elemek (Javaslat 20): lépésenkénti szerkesztő, kereső-paletta, sorbeli kapcsoló, bővített előnézet, saját naptár-fajták, nyomtatás

Mellékverzió (ADMINAPP; Kristóf jóváhagyta, 2026-10-05) – minden új lehetőség opcionális, semmi nem változott nevet. Javaslatlap: `docs/javaslatok/20-admin-ux-elemek.md`.

* **EditPage `steps`** – lépés-mód: egyszerre egy lépés, felül kattintható lépésjelző, a gombsorban Vissza / Tovább, az utolsó lépésen Mentés
  (kiváltja az admin `:has()`-os gombrejtését). A „Tovább” csak a lépés mezőit ellenőrzi (a `validate` a lépés `fields`-ére szűrve), Enter a
  szövegmezőben = Tovább; lépésváltáskor a fókusz a lépés címére, hibánál az első hibás mezőre; a hibaösszesítő linkje a mező lépésére vált
  (`ErrorSummary onJump`); mentéskori (szerver) hiba egy korábbi lépésben → odaugrik, a fókusz az összesítőn. `children(ctx)` → `ctx.step`.
  Típusok: `EditStep`, `EditStepsConfig`.
* **EditPage `saveShortcut`** – ⌘S / Ctrl+S ment (nyitott ablak mögött nem; lépés-módban a köztes lépésen figyelmeztet és a „Tovább”-ra teszi a fókuszt).
* **Stepper `onSelect`** – a bejárt lépés (`Step.reachable`, alap: kész / hibás) gomb: 44 px érintési felület, a látható pirula nem nő
  (`.bc-steps-btn`); a mostani `aria-current="step"`. **IcLeft / IcRight** – nyíl-piktogramok (Vissza / Tovább, előző / következő).
* **CommandPalette** (új organizmus) – ⌘K / Ctrl+K kereső-paletta a DS Modalra (Radix Dialog) építve: csoportosított találatok, combobox +
  listbox (`aria-activedescendant`), ↑/↓ körbe (tiltott sort kihagyja), Ctrl/⌘+Home/End, Enter / ⌘-Enter (új lap), kiemelés (`<mark>`),
  töltés / hiba újrapróbálással / nincs találat / túl rövid tipp; `commandHotkeyLabel()`, `useCommandHotkey()`. CSS: `.bc-cmdk-*`.
* **SwitchInput** (új atom) – kapcsoló címke-sor és súgó nélkül (aria-label), `size="sm"` táblázatsorba: kisebb sín, 44×44 px érintés,
  a sort nem nyújtja; `onText`/`offText` állapot-szöveg, `busy`. CSS: `.bc-switch.is-sm`, `.bc-switch-inline`, `.bc-switch-state`.
* **PreviewCard** – új változatok: `edukacio`, `esemeny`; `view="detail"` (részletek: teljes szöveg sortörésekkel, adatsor, a telefon képernyője
  görget – billentyűzettel is); `aspect` (képarány), `emptyImageText`; kupon: `subtitle`, `terms`, `code`, `price`, `buttonText`, `featured`;
  értesítés: `sendAt`. **Clamp** nyilvános (`onCut`).
* **MonthCalendar `kindDefs`** – a projekt saját tartalomfajtái (címke, szerepszín: info / warning / success / danger / neutral, piktogram);
  a beépítettek is felülírhatók. Generikus típus (`CalEvent<K>`), a `kindDefs` nélküli hívás típusa változatlan. Új exportok: `CalKindDef`,
  `CalTone`, `CAL_KINDS`, `kindLabel`, `kindTone`.
* **Dashboard `printable`** / **`usePrintFrame()`** – nyomtatáskor (PDF) a keret, a menü és a vezérlők rejtve (`.bc-print-page`,
  `.bc-print-hide`), a kártyák nem törnek ketté, a lap mindig világos témában megy papírra (utána visszaáll).
* **`useShellNav()`** nyilvános – `closeNav`, `openNav`, `navOpen`, `narrow`, `collapsed`, `inShell` (pl. a telefonos fiókban álló kereső-gomb előbb bezárja a fiókot).
* Tesztlapok: új `sablon-lepesek`, `vezerlok-tomor`, `reteg-paletta`; bővítve `kieg-elonezet`, `media-naptar`, `sablon-iranyitopult`.

## 1.41.2 – 2026-10-05 – javítás: tömör AppShell telefonon egyoszlopos
* **AppShell `density="compact"`** – 900 px alatt a `.bc-shell.is-compact` rácsa (224 px + 1fr, erősebb szelektor) felülírta az
  egyoszlopos elrendezést: telefonon a teljes felület 224 px széles volt, a képernyő jobb oldala üres. A keskeny nézet szabálya
  most a tömör változatra is vonatkozik (1.38.0 óta élő hiba). Tesztlap: `reteg-vaz-tomor` (a tartalom telefonon a teljes szélességet kapja).

## 1.41.1 – 2026-10-05 – új piktogram: `filter` (szűrés)
* `web/js/pics.js`: `pic('filter')` – tölcsér, méz kitöltéssel; a beeco-szelektalj új főmenüjének „Szűrés” gombjához
  (a szűrők egy gomb mögé kerültek, hogy az első képernyőn játék látsszon).

## 1.41.0 – 2026-10-05 – Admin UI-tisztítás (Javaslat 19): lapos összegző csempék, Tag, tábla alapsűrűség és keret nélküli változat, szakaszcím
* **DetailPage összegzés** – a benne álló StatTile-ok laposak (nincs keret/árnyék a kártyán belül), a csempéket vonal választja el.
* **Tag** (új atom) – tulajdonság-jelvény (típus, kategória, címke, „Kiemelt”), semleges `.bc-badge.is-tag`; állapothoz továbbra is StatusBadge.
* **DataTable `defaultDensity`** – kezdő sűrűség vezérlés nélkül (pl. admin: `'dense'`); **`bare`** – keret és árnyék nélkül, kártyába ágyazva.
* **`.bc-section-title`** – szakaszcím kártya nélkül, a kártyacímmel azonos megjelenéssel.
* Tesztlapok: `sablon-reszletek`, `adat-mutato`, `adat-tabla`.

## 1.40.0 – 2026-10-05 – Admin UI-kiegészítések (Javaslat 18): szöveges StatTile, FilePicker, LocationPicker mezőnevek, üres eszközsáv
* **StatTile `text`** – szöveges érték (pl. „Frissítésre vár”) a szám helyett, tördelhető (`.bc-stat-value.is-text`); nincs „—” és delta.
* **FilePicker** (új molekula, `react/src/media`) – egy fájl kiválasztása feltöltés NÉLKÜL: drop-zóna, a DS tartalom-alapú ellenőrzése
  (típus, méret), fájlkártya névvel és mérettel, „Másik fájl”, nagy-fájl figyelmeztetés (`warnSizeMB`), `busy` állapot. A feltöltést a projekt
  indítja. Exportálva: `FilePicker`, `fileSizeText`.
* **LocationPicker `latName` / `lngName`** – a koordináta-mezők `name`-je (a hibaösszesítő a mezőre ugorhat).
* **DataTable** – kártyanézetes táblán, ha az eszközsávban csak a (széles nézetben rejtett) Rendezés-választó van, a sáv széles nézetben nem
  foglal helyet (admin KE-31: ~60–90 px üres sáv a szűrők alatt).
* Tesztlapok: `media-import` (fájlválasztó), `adat-mutato` (szöveges érték), `kieg2-hely` (mezőnevek), `adat-tabla` (eszközsáv).

## 1.39.1 – 2026-10-05 – javítás: a becenév a kör végén nem vágódik le
* `web/css/ds-game.css`: a `dsResultHTML` ranglista-sorában a becenév (`.ds-result-nick b`) két sorba törik „…” helyett
  (a beeco-szelektalj átvilágításának csiszoló köre: telefonon a hosszabb generált becenév csonka volt).

## 1.39.0 – 2026-10-05 – játékbőr: „Hogyan játssz?” bevezető, ügyességi próba (mechanika 5), tesztelői tanulságok
A beeco-szelektalj 16 játékának első nagy tesztköre (2026-10-03) után a játékokban bevált közös elemek és elvek.
* **Bevezető** – `web/js/bevezeto.js` + `web/css/bevezeto.css` (új, `sync`): `bevezetoMutat({ jatek, cim, cel, szabalyok, utana,
  kenyszer })`, `bevezetoZar()`, `bevezetoNyitva()`, `bevezetoGombHTML(attr)`. A játék első indulásakor „Hogyan játssz?”: cél egy
  mondatban + legfeljebb 3 szabály + „Kezdjük!”; játékonként egyszer (`beeco_coach_bev_<játék>` – a „Bemutatók újra” is visszahozza),
  a „?” gomb bármikor. Önálló (saját szöveg-escape), a pics.js, ds.js, i18n.js után. Leírás: `docs/arculat.md` 4. (Bevezető sor).
* **Mechanika 5 – ügyességi próba** – `web/js/mech/proba-logika.js` + `proba-ui.js`, `.mp-` osztályok a `mech.css`-ben:
  `MechProba.mount(el, { feladat, zona, sebesseg, korok, onKesz })`; csak logika: `MechProba.create()` (pos, talal, lejart).
  „Kevesebb mozgás” mellett lassabb; `korok` kör után magától sikertelen. Bemutató: `mechanikak.html` #proba; teszt: `check-mech` (+3).
* **Elvek** – `docs/jatektervezes.md`: „Tesztelői tanulságok” (belépés, változatosság, tempó, érthetőség, képernyő).
* Angol szótár: `Most!`, `Sikerült!`, `Most nem jött össze.`, `Hogyan játssz?`, `A cél:`, `Kezdjük!`.

## 1.38.0 – 2026-10-03 – tömör oldalsáv (Javaslat 17)

Mellékverzió (PARTNERAPP; Kristóf kérése) – opcionális, alapból semmi nem változik.

* **`AppShell density="compact"`:** keskenyebb sáv (224 px, becsukva 72 px), `fs-s` betű, 18 px ikon, kisebb csoport- és tételköz; **egérrel 36 px-es menüpontok, érintőképernyőn a 44 px-es érintési felület marad**. A telefonos fiók (portál) is tömör. Menücsoportokkal (`NavGroup.label`) 12 menüpont + 3 csoportcím 1280×800-on görgetés nélkül elfér. Tesztlap: `reteg-vaz-tomor`.

## 1.37.0 – 2026-10-03 – tördelődő nézetváltó, tailwind-merge kiegészítés (Javaslat 16)

Mellékverzió (PARTNERAPP; Kristóf jóváhagyta) – minden új lehetőség opcionális, a meglévő használat nem változik.

* **`SegmentedControl wrap` / `.bc-seg.is-wrap`:** sok elemnél több sorba tördelődik (teljes szélesség), nem rejtetten görget – a jobb szélső elemek nem maradnak észrevétlenek; tördelve sincs dupla keret. Tesztlap: `vezerlok` → „Sok elem, tördelődő (wrap)”.
* **`@beeco/design-system/tailwind-merge`** (`dist/tailwind/twmerge.mjs` + típus): a tailwind-merge kiegészítése a preset neveivel (betűméret, -vastagság, -család, árnyék, sarok, réteg, `min-h/w-tap`), ugyanabból a tokenforrásból, mint a preset. Nélküle `cn('text-s', 'text-ink')`-ből csendben eltűnik egyik osztály, és a `z-modal` nem írható felül. **A `rounded-l` kimarad** (Tailwindben a bal oldali sarkok osztálya is – kétértelmű).

## 1.36.1 – 2026-10-03

* **Kártya-szerepek (meta.card) – fejlécsor:** ha van címszerep, a telefonos kártya első sora jelölő · cím · jelvény · lenyitó egy sorban, alatta a fő adatok teljes szélességben (eddig a lenyitó külön sorban állt a cím fölött, a jelvény a fő adatok között). Az admin Partnerek listáján mérve: kártyánként ~25%-kal rövidebb.

## 1.36.0 – 2026-10-03 – listák hatékonysága (Javaslat 15)

Mellékverzió – a Javaslat 15 bővítése az admin UX-átvilágításából (ClickUp `869fb6yq0`). Minden új lehetőség **opcionális**: meta / prop nélkül a mai viselkedés marad (a partner app változtatás nélkül frissíthet).

* **DataTable – oszlopprioritás (`meta.priority: 1 | 2 | 3`):** szűk helyen előbb a 3-as, majd a 2-es oszlop a sor „Részletek” lenyitójába kerül (a lenyitó magától megjelenik) – 1280 px-en sincs vízszintes görgetés a sorműveletekért. A rejtett oszlopok tartalma billentyűzettel és képernyőolvasóval is elérhető.
* **DataTable – jobbra rögzített oszlop (`meta.pinEnd`):** pl. a sorműveletek széles táblán is mindig látszanak; a DOM-sorrendben a sor végén maradnak.
* **DataTable – kártya-szerepek (`meta.card: 'title' | 'badge' | 'main' | 'detail'`):** telefonos kártyán a cím fejlécként (címke nélkül), a jelvény mellette, a `detail` oszlopok a „Részletek” lenyitóban – rövidebb kártyák.
* **Tömeges sáv telefonon:** 600 px alatti tárolóban alul rögzített, egysoros sáv (a műveletek vízszintesen görgethetők), görgetéskor sem tűnik el; a lista alján helyet hagy.
* **FilterBar – másodlagos szűrők (`filters[].secondary`):** széles helyen a „További szűrők (N)” lenyitóba kerülnek; aktív szűrő nélkül a találatszám a kereső sorában áll (nem nyit külön sort).
* **AppShell:** 820 px alatti ablakmagasságnál tömörebb menü (a 44 px-es érintési felület marad); az aktív menüpont betöltéskor és oldalváltáskor látható helyre görgetődik (a Tab-bejárást nem bántja – az ugrólink marad az első).
* **MapPanel – `listLabel`:** a „Térkép | Lista” váltó lista-felirata állítható (pl. „A nézet POI-i”), ha az oldalnak saját „Lista” nézete is van.
* **Hiba – fájlellenőrzés:** a sérült `.webp` is „nem tudjuk beolvasni” üzenetet kap (a kiterjesztés és a típusnév kis-/nagybetűtől függetlenül egyezik).
* Tesztlapok: `adat-tabla` (prioritás szűk/széles, kártya-szerepek, telefonos tömeges sáv), `adat-szuro` (másodlagos szűrők), `kieg3-mukodes` (listLabel), `media-kepek` (sérült webp).

## 1.35.0 – 2026-10-03 – játékbőr: a játékok új matricái és 3D modelljei a DS-ben

Kristóf kérése (2026-10-03): a játékokban élő design system legyen fent a DS-repóban, és innen frissüljenek a játékok.
A játékokban azóta készült közös elemek visszakerültek ide (MELLÉK: csak bővítés, a meglévő játékokat nem érinti).

* **Új matricák (B szint):** `art-huto-fagy.js` (Hűtő-mester fagyasztó: jégkrém, fagyasztott zöldség és málna, halrúd, jégkocka,
  mirelit pizza), `art-kaptar.js` (Méhpilóta), `art-birtok.js` (Élő birtok).
* **Új 3D modellek (kódból, B szint):** `3d/kaptar-modellek.js`, `3d/kaptar-viragok.js` (Méhpilóta: kaptár, háziméh, virágok),
  `3d/birtok-modellek.js`, `3d/birtok-novenyek.js` (Élő birtok: telek-elemek, ágyások, 16 vetemény 4 növekedési szakasszal,
  meggyfa, málnasor) – a `katalogus.js`, a `modellek.html` és a `tests/check-3d.js` ismeri őket.
* **`arculat.html`:** a matricagaléria mind a 618 matricát mutatja (14 eddig hiányzó könyvtár: történelem, Élő lánc
  4 élőhelye, bolygó, rendelő, fagyasztó, Méhpilóta, Élő birtok, extra2).

## 1.34.2 – 2026-10-03

Javító verzió – a Javaslat 15 (listák hatékonysága) apró HIBA-i, az admin UX-átvilágításából (ClickUp `869fb6yq0`). A bővítés (táblázat-prioritás, tömeges sáv, lista-eszközsáv, menü) az 1.35.0-ban jön.

* **Hiba – SortSelect:** ha a táblázatban nincs rendezhető oszlop, a rendezés-választó nem jelenik meg (eddig egyetlen „Nincs rendezés” opcióval állt ott).
* **Hiba – gombfelirat „…”:** a Lalezar a kipontozást (U+2026) egyetlen pontként rajzolta („Mentés…” → „Mentés.”); a jelre tartalék betű kerül.
* **Hiba – SelectField:** tiltott mezőn a kapott `placeholder` látszik (pl. „Előbb a kategóriát válaszd ki”), nem „Nincs választható elem”.
* **Hiba – VideoUpload / VideoPlayer:** nem önellentmondó a hibaszöveg („MP4 – csak MP4 lehet”): ha a kiterjesztés engedett, de a tartalom nem olvasható, „nem tudjuk beolvasni” + teendő (`checkFiles` új `unreadable` opciója).
* **Hiba – fájlellenőrzés:** az átnevezett más formátum (pl. iPhone HEIC `.jpg`-ként, MOV `.mp4`-ként) „rossz formátum (HEIC)” üzenetet kap, nem „olvashatatlan”.

## 1.34.1 – 2026-10-02

* **Hiba – AppShell telefonos fiók + ShellAccount menü:** ha a fiókmenü egy pontja ablakot nyitott (pl. „Hibajelentés”), a kihúzható fiók nyitva maradt, és modálisként magánál tartotta a fókuszt – az új ablak mezőibe nem lehetett írni. Új `ShellNavContext` (`useShellNav().closeNav()`): a ShellAccount menüpontja választáskor bezárja a fiókot. Keret nélkül nem csinál semmit. A partner-app e2e-tesztje találta (PARTNERAPP).

## 1.34.0 – weboldal: mozgás, személyiség és marketing-elemek

**Mozgás (Javaslat 11).** A méhecske nem tapéta, hanem szereplő: akkor mozdul, amikor történik
valami. Végtelen mozgás nincs, ezt a `bc-motion.css` már kimondta.
- `bc-web-erkezes` (a hero méhecskéje egyszer repül be), `bc-web-zum` (a gazdátlan `bc-buzz`
  keyframe végre szerepet kap), `bc-sticker`, `bc-web-in`, `bc-figure.is-framed` és `.is-tilt`.
- `tools/webflow-build.js` → `dist/weboldal/beeco-web.css`, `beeco-web.min.css` és
  `beeco-web-oldal.min.css`: a Webflow egyedi kód mezőjébe beilleszthető blokkok, a DS saját
  CSS-éből generálva, a változónevek automatikus átírásával. Az oldal-profil 2,8 kB.
- HIBAJAVÍTÁS a generátorban: a blokkdaraboló a záró kapcsos zárójel mentén vágott, ami
  kettévágta a @media és @keyframes blokkokat. Most zárójel-számlálással dolgozik.

**Marketing-elemek (Javaslat 12).** A beeco.hu valódi tartalomból való újraépítése után
27 sor saját CSS maradt a fej-kódban; ez a lista lett az elemkészlet:
- `bc-sec.is-ruled` és `bc-ruled` (szekció-elválasztó), `bc-hero` (+ `is-even`, `is-mirrored`),
  `bc-stores` és `bc-store` (+ `is-accent`), `bc-rating` (+ `-stars`, `-text`, `-sub`),
  `bc-price` (+ `is-lg`, `bc-price-old`, `bc-price-note`), `bc-howto` (+ `is-row`).
- A `bc-howto` a `bc-steps` MELLÉ kerül, nem helyette: az kompakt folyamatjelző, ez marketing-lista.
- `termek/bemutato.html` új „Weboldal” szakasz: mind látszik élőben.

**Tesztelés.** `docs/weboldal.md` 5/b: minden oldalfejlesztéshez kötelező e2e és egységteszt
(működés, teljesítmény, láthatóság, takarás, eltartás, billentyűzet, szerkezet, szöveghelyesség,
SEO, mozgás, biztonság, WCAG 2.2 AA), és `.github/workflows/weboldal.yml` éjszakai őrjárat.

## 1.33.1 – 2026-10-02

* **Hiba – AppShell telefonos fiók + UnsavedChangesGuard:** ha egy kitöltött űrlapról a ☰ menü linkjével navigáltak el, az őr megállította a kattintást, így a fiók nyitva maradt, és modális rétegként letakarta (kattinthatatlanná, felolvasónak láthatatlanná tette) a „Nem mentett változásaid vannak” ablakot. A fiók most a menüben lévő linkre koppintáskor mindig bezár (dokumentum-szintű figyelő). A partner-app e2e-tesztje találta (PARTNERAPP).

## 1.33.0 – webes réteg (Webflow) és a nyilvános weboldal elemei

A beeco.hu a termékbőrt kapja, de Webflow-ban készül, ezért nem tud `npm install`-lal DS-t húzni.
Új réteg, ami a bemenetet generálja és a kimenetet méri.

- `tools/webflow-build.js` → `dist/weboldal/webflow-valtozok.json` (57 változó, világos + sötét)
  és `paletta.json`. A nevek a DS saját CSS-ét követik (`bc-r-*`, `bc-sp-*`, `bc-fs-*`, `bc-tap`).
- `termek/css/bc-web.css`: a nyilvános weboldal elemei, csak tokenekből. Tartalomszélesség és
  szekció-ritmus (`bc-wrap`, `bc-sec` + 4 változat), marketing-tipográfia (`bc-display`, `bc-title`,
  `bc-subtitle`, `bc-lead`, `bc-body`, `bc-eyebrow`), rács (`bc-grid-2/3`), és a bizalmi elemek:
  `bc-link` (mindig aláhúzva, WCAG 1.4.1), `bc-quote`, `bc-logos`, `bc-figure` (rögzített képarány,
  CLS ellen), `bc-source` (a „szám csak forrással” szabály látható alakja).
- `docs/weboldal.md`: token→Webflow-változó megfeleltetés, osztálynevek, a kötés pontos alakja,
  a Webflow API tanult korlátai, publikálási szabály, menetrend.
- `tools/web-ellenor.js`: az élő oldal átvizsgálása 4 nézetben (Playwright + axe-core) – működés,
  kilógás, 44 px, fókusz, kontraszt, DS-en kívüli szín/sarok/árnyék/betű, szerkezet, SEO, linkek.
- `tools/web-osztalyleltar.js`: a definiált és a ténylegesen használt osztályok összevetése.
- `tools/web/oldal-meres-web.js`, `tests/check-weboldal.js` (az `npm test` része),
  `.github/workflows/weboldal.yml` éjszakai őrjárat.
- Javaslat 10 jóváhagyva (`docs/javaslatok/10-weboldal-elemek.md`).

## 1.32.0 – 2026-10-02

**Vonalgrafikon: állapot-paletta, sorozat-kapcsoló, végcímke csak ha kifér** (Javaslat 14, a partner-appból – PARTNERAPP).
* `ChartData.palette: 'allapot'` → a sorozatok a `--bc-data-allapot-1…5` színeket kapják (színtévesztő-módban az `-cb` párt); a kártya, a rajz és a jelmagyarázat egyformán (`.bc-pal-allapot`).
* `ChartCard seriesToggle` (LineChart-tal): a jelmagyarázat elemei kapcsológombok (`aria-pressed`, érintőn 44 px); a kikapcsolt sorozat színe/alakja a helyén marad, az adattáblában megmarad; a tengely a látható sorozatokhoz igazodik. `ChartSeries.hidden`.
* **Hiba:** a `LineChart` végcímkéje görgethetővé szélesítette a rajzot, ha 30 nap + címke nem fért el (a címke a látható részen kívülre került) → a végcímke csak akkor jelenik meg, ha görgetés nélkül kifér; különben a felső jelmagyarázat elég. `Frame padRight(narrow, spare)`.
* Kapcsoló-szabályok (review után): az utolsó látható sorozat nem kapcsolható ki; a kikapcsolt sorozat hiánya nem rajzol „nincs adat” sávot; adatcsere után a kikapcsolás nem ragad be; kapcsoláskor nem ugrik a rajz (a címke-hely az összes sorozatból). A `HBarChart` is kapja a palettát.
* Tesztlap: `adat-grafikon` → „graf-allapot”.

## 1.31.0 – 2026-10-02
Javaslat 13 – működést javító elemek (Kristóf jóváhagyta 2026-10-02). Tesztlap: `kieg3-mukodes` (8 forgatókönyv).
- Új: **useListState** + **listStatus** + **clampPage** – lista-állapot a címsorban (router-független adapter), az állapot-döntés egy helyen (isPending-szabály, üres vs. nincs találat).
- Új: **MapPanel** – egységes térkép-keret a meglévő `.bc-map` öltözettel: jelmagyarázat-hely, töltés / hiba / üres, „Térkép | Lista” váltó (a lista linkes – billentyűzet, képernyőolvasó).
- Új: **StageDialog** – teljes képernyős bemutató-réteg (fókuszcsapda, Esc, fókusz vissza; `closable={false}` folyamat közben; `announce` élő bejelentés; opcionális teljes képernyő).
- Új: **ScheduleField** + **scheduleIssues** – Azonnal / Időzítve, elhagyható vég; múltbeli kezdés és a kezdés előtti vég jelzése.
- Új: **StatusBadge** – állapotjelvény hangnem + piktogram + felirat (nem csak szín).
- Új: **notify.undo** – visszafordítható művelet „Visszavonás” gombbal (10 mp).
- Új: **useDraft** + **DraftNotice** + **EditPage `draft`** – piszkozat az eszközön, visszaállítás-ajánlat, sikeres mentés után törlődik.
- Javítás: **DataTable** kliensoldali lapozásnál szűkülő adat után az utolsó létező lapra lép (eddig üres lap maradt).
- Javítás: `.bc-map` – a később betöltődő Leaflet CSS sem írja felül (betű, buborék, forrásjelölés átlátszatlan, bezáró gomb és nagyító 44 px, DS-gomb a buborékban).
- Mérő: **fagyasztás** (alap: be) – átmenet/animáció nélkül mér (a megállt átmenet álkontrasztot adott); a `color(srgb …)` színt is helyesen olvassa.

## 1.30.0 – 2026-10-02
- **smoke.js**: az időkorlát a projekt `smoke.config.json`-jából állítható (`limitPerc`, `limitPercOffline`; alapból 6 / 12 perc). A beeco-szelektalj 25+ játékkal online + offline + kioszk-futásban már nem fért bele a 12 percbe.

## 1.29.0 – 2026-10-02
- Új: **„állapot” adatskála** (Javaslat 12): `--bc-data-allapot-1…5` (levél → méz → piros) és színtévesztő-barát párja `--bc-data-allapot-cb-1…5` (kék → narancs); a fekete jel minden fokozaton ≥ 4,5:1 (`check-tokens` ellenőrzi). Tesztlap: `adat-mutato` „Állapot-skála”. Az első fogyasztó a partner-app öntözési szomjúság-skálája.

## 1.28.0 – 2026-10-02
- **ListPage**: új `noResultsText` beállítás a „nincs találat” állapot magyarázatához. Eddig mindig a méhecske keresési tippje jelent meg („Próbáld rövidebben, vagy ékezet nélkül.”) – kereső nélküli, csak szűrős listán (pl. hónapválasztó) ez félrevezető volt. Tesztlap: `sablon-lista` („Szűrésre nincs találat”).

## 1.27.1 – 2026-10-02
- Javítás: érintős eszközön a táblázat-cellák linkje a magasság mellett **szélességben** is legalább 44 px (a nagyon rövid név, pl. „vds” eddig 22 px széles célfelület volt). Tesztlap: `adat-tabla` („Rövid nevű link a cellában”).

## 1.27.0 – 2026-10-02
- Új: **évszakos díszítés** a méhsejt-háttéren (Javaslat 11): `.bc-honeycomb[data-evszak]` (virág · nap · levél · hópehely, maszkként, a tartalom alatt) és `AppShell season="auto"`; `evszak(date)` segéd. Tesztlap: `tema`.
- Javítás (mérés): az oldalmérő (`bcMeres`) a mező vizsgálatánál kihagyja a rejtett belső mezőt (pl. a Radix jelölőnégyzet `aria-hidden` „bubble” inputját) – eddig téves „mezőnek nincs címkéje” P1-et adott; a `role="checkbox"` is vezérlőnek számít.

## 1.26.1 – 2026-10-02
- Javítás: a **Logo** (`.bc-logo`) kifejezett szélességet kap a magasságból (`--_h` × 512/313). Oszlopos flex- vagy grid-tárolóban (pl. belépő kártya) eddig kinyúlt teljes szélességre, és a kép középre ugrott a balra igazított szöveg fölött. Tesztlap: `tema` („Logó oszlopos flex-tárolóban”).

## 1.26.0 – 2026-10-02
- **MonthCalendar**: új `kinds` beállítás – mely tartalomfajták szerepeljenek a jelmagyarázatban és a szűrőben (alap: mind a három). Így olyan naptár is épülhet rá, ahol csak két fajta van (pl. a partner adatlapján: esemény + kupon-időzítés), üres jelmagyarázat-tétel nélkül. A „minden fajta ki van kapcsolva” üzenet is ehhez igazodik. Tesztlap: `media-naptar` („Csak két fajta”).

## 1.25.0 – 2026-10-02
- Új: **sötét módú logó** (`web/assets/brand/logo-sotet.webp` – a meglévő logóból, csak az átlátszó háttér melletti fekete részek krémszínűek) és **`Logo`** React-elem / `.bc-logo` CSS, amely a témával magától vált (Javaslat 10).
- Új: **méhsejt-háttér** – `.bc-honeycomb` (CSS-maszk a méz szerep színéből, a tartalom alatt, nyomtatásban rejtve) és `AppShell pattern="honeycomb"`; a partner-app mintájából, az admin is használhatja. Tesztlap: `tema`.
- Új token: **`z.behind` = −1** (`--bc-z-behind`, Tailwind `z-behind`) – díszítő réteg a tartalom mögött.

## 1.24.1 – 2026-10-02
- Javítás: érintős eszközön a táblázat-cellák linkjei (pl. a sor címe, telefonos kártyanézetben is) legalább 44 px magas célfelületet kapnak (eddig a szövegsor magassága, ~21 px).

## 1.24.0 – 2026-10-02
- Új export: **FieldInput** és **useFieldContext** (+ `FieldCtx` típus) – saját mező (pl. natív fájlválasztó) bekötése a `Field` címkéjéhez, súgójához és hibájához (id, aria-describedby, aria-invalid). Eddig csak belül volt elérhető.

## 1.23.0 – 2026-10-01
- Új: **téma-váltó** (Javaslat 09, a partner-app sötét módjából): `ThemeProvider`, `useTheme`, `ThemeToggle` (ikongomb / háromállású: Világos · Sötét · Rendszer szerint), `themeInitScript()` a villanásmentes induláshoz. A `<html>` `data-theme` + `.dark` jelzőit írja, a választást megjegyzi, a rendszer és más fül váltását követi. Tesztlap: `tema`.
- Új: **felülírható feliratok** kétnyelvű apphoz – `AppShell labels` (menü nyitása/zárása, kinyitás/becsukás), `ShellAccount menuLabel` + `loadingLabel`, `HelpButton srLabel`. Az alapérték magyar, a meglévő fogyasztóknak nem változik semmi. Tesztlap: `reteg-vaz-felirat`.

## 1.22.0 – 2026-10-01
- Új: **InfoCard** + **InfoGrid** (`.bc-info`, `.bc-info-grid`) – címke–érték adatlap a részletoldalak Áttekintés fülére; üres érték helyett „nincs megadva”, a sortörés megmarad, a hosszú szó tördelődik. Tesztlap: adat-mutato.

## 1.21.1 – 2026-10-01
- Javítás: a SectionSwitch a tartalom szélességéhez tördel (konténer-lekérdezés), nem a képernyőéhez – oldalmenü mellett nem lóg ki.

## 1.21.0 – 2026-10-01
- Új: **SectionSwitch** (nagyválasztó, `.bc-secsw`) – egy szakasz 2–5 fő nézete közti linkes váltó az oldal tetején középen, a cím fölött; telefonon 2 oszlopos rács. Első használat: admin Naptár (naptár · események · havi kampányok · speciális napok).

## Készül (következő verzió)

* **`[WEB]` weboldal-réteg** (JAVÍTÁS, a játékokat nem érinti): `docs/weboldal.md`: a tokenek megfeleltetése a beeco.hu
  Webflow-osztályaira, a csak weboldalon használt minták listája `[WEB]` jellel; hivatkozás az `arculat.md` 2. és új 12. pontjában és a README-ben.

## 1.20.3 – 2026-10-01
* A csak piktogramos gomb jele: `.bc-btn.is-icon` (a Button felirat nélkül magától kapja) – az aria-label alapú felismerés a szöveges másológombra is hatott.

## 1.20.2 – 2026-10-01
* Javítás: az 1.20.1 „csak piktogramos gomb” szabálya a szöveges gombokra is hatott (a felirat szövegcsomópont); most csak `aria-label`-es, egyetlen svg-t tartalmazó gombra.

## 1.20.1 – 2026-10-01
* Javítás: csak piktogramos `.bc-btn`-en nincs optikai betű-korrekció (a piktogram középen ül).
* Mérés: a `<video>`/`<audio>`/`<canvas>` tartalék-szövegét nem vizsgálja (nem látszik).

## 1.20.0 – 2026-10-01 – árnyék-szabály, kattintható kártya, lapozó, zöld jelölő (Kristóf kérése)
* **Új token: `--bc-shadow-soft`** (nagy, halvány, elmosott) – a nem kattintható dobozok (kártya, statisztika, táblázat, mentés-sáv) ezt kapják; a kattinthatók maradnak kemény árnyékkal.
* **Kattintható kártya:** `.bc-card.is-link` + `.bc-card-link` – az egész kártya kattintható, rámutatásra emelkedik, fókuszkeret a kártyán.
* **`.bc-divided`:** csoportok közti elválasztó vonal.
* **Lapozó:** első és utolsó lap gomb, „1. oldal / N” kiírás.
* **Jelölőnégyzet:** bejelölve erdőzöld, fehér pipa; a pipa háttérkép (Safari/Firefox-ban nem csúszik ki).
* **Oldalfej:** a leírás nem korlátozott 65 karakterre – kitölti a cím-sávot.

## 1.19.2 – 2026-10-01
* Javítás: a nézetváltó (SegmentedControl) a szűrősorban is alulra igazodik (1.19.0-ban felülre került).

## 1.19.1 – 2026-10-01
* Javítás: a bejelölt jelölőnégyzet szabálya a méz háttér mellé kiírja az on-accent színt (a check-tokens szabálya).

## 1.19.0 – 2026-10-01 – jelölőnégyzet, súgó, árnyékok, tartalomszélességű szűrők (Kristóf kérése)
* **CheckboxInput** (új atom) és márkázott jelölőnégyzet mindenhol (Checkbox, táblázat-sor): fekete keret, méz + pipa, részleges „–”, tiltott, hibás.
* **Súgó (ⓘ):** háttér és körvonal nélkül; rámutatásra is nyílik (250 ms), a buborékon tartva nyitva marad, kattintásra rögzül.
* **Árnyékok:** csendes kártya, galéria-csempe, aktív fül, aktuális lap, bejelölt jelölő kemény árnyékot kap; az üres/hibás lista-állapot és az irányítópult-értesítés kártyája nem lapos többé. Gépi „Árnyék” mérés.
* **Szűrők és nézetváltó** tartalomszélességűek (hug).
* Tesztlap: `mezok` (+2 forgatókönyv: jelölő-állapotok, rámutatásos súgó).

## 1.18.1 – 2026-10-01
* A gépi mérés a csomagban is: `dist/meres/oldal-meres.js` (`window.bcMeres({ w, touch })`) – a projektek (admin, partner) saját oldalain is futtatható.

## 1.18.0 – 2026-10-01 – gombok: piktogram-szabály és igazítás (Kristóf szabálya)
* **Közös piktogramok:** `IcSave`, `IcTrash`, `IcNew`, `IcInfo`, `IcEdit`, `IcOpen`, `IcX`, `IcOk`.
* **EditPage** mentés-gombja és a **ConfirmDialog** megerősítő gombja alapból piktogramot kap (`submitIcon`, `confirmIcon` felülírja); a „kész” pipa is piktogram.
* **Igazítás (javítás):** a piktogram nem az alapvonalon ül (blokk-elem), a Lalezar-feliratot optikailag középre toljuk (0,085 em) – a nézetváltó piktogramja 2 px-szel, a gombfeliratok 1,7 px-szel voltak elcsúszva.
* **Gépi mérés** minden tesztlapon (`tools/komp/oldal-meres.js`): piktogram–betű középvonal, szövegmező belső margója, mező-sorok alja egy vonalban, piktogram a mentés/törlés/új/szerkesztés/info gombokon, név és súgó-buborék a csak-piktogramos gombon.
* Szabály: `docs/termek-arculat.md` 6/A, `docs/komponensek.md` 3.4/b. Tesztlapok gombjai a szabály szerint.

## 1.17.1 – 2026-10-01
* **Javítás – AppShell:** hosszú márkanévnél a becsukó gomb 44 px alá zsugorodott és a feliratra csúszott; most a márka vágódik. Tesztlap: hosszú márkanév + gombméret-ellenőrzés.

## 1.17.0 – 2026-10-01 – Javaslat 08: becsukható oldalsáv, felhasználó a sáv alján, fejléc nélküli váz
* **AppShell:** `collapsible` + `collapseKey` (ikon-sáv, az eszköz megjegyzi), `account` (a sáv alja, a telefonos fiókban is), `brandCompact`; `topbar` nélkül asztalon nincs fejléc.
* **ShellAccount** (új molekula): avatar, név, szerep, menü (kijelentkezés).
* Tesztlap: `reteg-vaz` (+4 forgatókönyv). Javaslatlap: `docs/javaslatok/08-becsukhato-sav.md`.

## 1.16.1 – 2026-10-01
* **Javítás – sablon gombsor (EditPage), keskeny kijelzőn:** hosszú gombfeliratnál („Partner létrehozása”) a gombok balra kilógtak a sávból; most a felirat tördel. Tesztlap: `sablon-szerkeszto` (`?allapot=hosszu` hosszú mentés-felirattal). Az admin Új partner oldala hozta elő.

## 1.16.0 – 2026-10-01 – Javaslat 07: vágás feltöltés előtt, csak olvasható képleírás
* **ImageUploader `crop`:** rögzített képarányú vágás minden fájlnál, feltöltés előtt (`CropDialog`, sorban: „1/2”, kihagyható). Új export: `CropDialog`, `cropToFile`, `UploadCrop`.
* **`altEditable={false}`** (ImageUploader, Gallery): ha a backend nem tárolja a leírást, a projekt adja az alt-ot. Ilyenkor nincs menüpont és „Leírás kell” jelzés.
* Tesztlap: `media-kepek` (+2 eset, +2 forgatókönyv). Javaslatlap: `docs/javaslatok/07-kepfeltoltes-admin.md`.

## 1.15.1 – 2026-10-01
* **Javítás – TagPicker, Combobox:** ha az `onCreate` elutasít, nincs kezeletlen hiba. A megszakítás (`AbortError`, pl. a projekt saját ablakában Mégse) csendes, és a beírt név megmarad. Más hibánál az üzenet a mező alatt jelenik meg. Új segéd: `createError`. Tesztlap: `valaszto` (+2 forgatókönyv). Az admin partner-címkéi hozták elő.

## 1.15.0 – 2026-10-01 – a teljes komponenskészlet (02–06), méhecske-szereplők, mozgás, sprite-ok
Kristóf jóváhagyásai: 02, 03, 04 és 05 javaslat Claude javaslata szerint; „mehetnek a maradék komponensek”; a mozgás bővítése a neo-brutalista és méhecskés irányhoz; méhecske-sprite (kódból + SpriteCook a nehézre; Lottie + sprite-lap + WebP; 6 szereplő); angol szöveg csak kérésre.
* **02 – Adat és grafikon:** DataTable (TanStack: rendezés, kijelölés + tömeges sáv, kinyitható sor, oszlopméretezés, lapozás 10/25/100, sűrűség, kártyanézet telefonon), FilterBar (keskenyen „Szűrők (N)” panel), StatTile, ChartCard (3/B: cím, egység, időszak, súgó, „Hogyan olvasd?”, adattábla, forrás) + saját SVG-grafikonok (oszlop, vonal, csoportos, halmozott, sparkline, hőskála) – minden adatjel kontúrral, színtévesztő mód.
* **03 – Rétegek és navigáció:** Modal, ConfirmDialog, TypeToConfirm, Drawer (saját URL), TooltipIconButton, DropdownMenu, RowActions, Tabs, NavTabs, Accordion, PageHeader, Breadcrumbs, usePageTitle, AppShell (900 px alatt fiók-menü), **saját értesítés-rendszer** (`notify.*` + `<Toaster/>` – a javaslat a react-toastify mögé tette volna; Claude saját megoldást kért, hogy a partner is használhassa; az API ugyanaz).
* **04 – Média és speciális:** ImageUploader + Gallery (borító, sorrend húzással és menüből, kötelező alt), Lightbox, ImageCropper (react-easy-crop burok), Stepper, VideoUpload, FileImport + ImportResult (Excel, „B” átmeneti változat), térkép-jelölők és -vezérlők Leaflethez (függőség nélkül), MapLegend, HeatScale, MonthCalendar, OpeningHoursEditor, Avatar.
* **05 – Méhecske, mozgás, szöveg:** Bee, BeeMoment, **szövegkészlet** (`tokens/hangnem.json`: 15 pillanat, 12 szereplő – szóvicc mindig sima jelentéssel), `say()`; mozgás: Stagger, useCountUp, celebrate (hatszög-konfetti), shake, HexLoader, ProgressBar, Button „mentve-pipa”; CSS: pecsét, kártya-emelés, rázás, fül-jelző, mézsejt-töltő, csíkos haladásjelző, figyelem-zümmögés (`bc-motion.css`).
* **Méhecske-sprite-ok** (`tools/meh-sprite/`, `dist/meh/`, `docs/meh-sprite.md`): 6 szereplő kódból animálva a meglévő méhecskéből (szárny/test szétválasztás), Lottie 14–23 KB (mobilapp), sprite-lap 1×/2×/3× WebP, animált WebP; `BeeSprite` komponens; véges ismétlés, csökkentett mozgásnál áll. SpriteCook skillek telepítve – a használatához Kristóf beállítása kell.
* **06a – Kiegészítők:** PhoneField, CopyButton, DownloadButton, Slider, RangeSlider, UnsavedChangesGuard + useUnsavedChanges, OfflineBanner, ErrorPage, NotFoundPage, ForbiddenPage, SessionExpired, Timeline, PreviewCard (partner, kupon, értesítés – „így látszik az appban”), AudienceBuilder, CompareMerge, ReviewQueue.
* **06b:** LocationPicker (térkép kívülről, címkereső, koordináták), PrizeDrawReveal, VideoPlayer, VideoEmbed (kattintásig semmi nem megy a YouTube-ra), VideoPreview.
* **06c – Oldalsablonok:** ListPage, DetailPage, EditPage (hibaösszesítő, nem mentett változások, mentve-pipa + méh), Dashboard.
* **Új tokenek:** z-index skála (`--bc-z-*`); a nyers z-index tiltva.
* **Javítások (az önteszt fogta meg):** a tooltip programozott fókuszra nem nyílik, és nem halmozódik; a fülsor rejtett szövege nem tolja ki az oldalt telefonon; a rádiócsoportnak van hozzáférhető neve (legend a helyén); tiltott ikongomb halvány; a keresős legördülőnek szerveroldali módja (`filter={false}`, `onQueryChange`, `minChars`); a `useCountUp` nem késik egy képkockát; két `.bc-progress` ütközés feloldva; a SearchBox keresési régiónak neve van; a mérő a beállított nézet-szélességhez mér (mobil emulációnál rejtve maradt a kilógás).
* **Ellenőrzés:** a tesztlapok is típusellenőrzést kapnak; a TanStack és a react-easy-crop külső függőség (nem kerül kétszer a projektbe); katalógus: `docs/komponens-katalogus.md` (`tools/katalogus.py`).

## 1.14.1 – 2026-10-01
* Javítás (a CI-önteszt fogta meg Linuxon): a túl hosszú beillesztés „levágtam” jelzését a beillesztés utáni input-esemény néha letörölte – most időzítéstől független.
* Forgatókönyv: a súgó bezárása utáni fókusz-visszaadást megvárja (egy képkockával később történik) – 5× egymás után stabil.

## 1.14.0 – 2026-10-01 – React-komponensek (Javaslat 01 – Űrlap, jóváhagyva: 1A, 2A, 3A, 4A, 5A) + gépi önteszt
* **React-réteg** (`@beeco/design-system/react`, forrás `react/src/`, kimenet `dist/react/` – `tools/react-build.js`, esbuild): Field (címke + súgó ⓘ + tartomány + élő számláló + hiba/jelzés), HelpButton, Button, IconButton, TextField, TextArea (pl. 213/255), NumberField (magyar formátum, betű/2. tizedesjel/fölös mínusz tiltva, határra igazítás kilépéskor + jelzés; `clamp="input"`), SelectField, Checkbox, RadioGroup, Switch, SearchBox, SegmentedControl (3A), Combobox (1A: egyes/többes, új elem, ékezet nélküli keresés, 1000+ opció, „+N”, max.), TagPicker (4A: felhő ≤ 20, fölötte legördülő), DatePicker + DateRangePicker (2A: gépelhető, hétfő, tiltott napok, időpont, UTC-segédek), FormSection, FormActions. Viselkedés: Radix Popover (MIT).
* **Új CSS:** `termek/css/bc-field.css` (súgó gomb, lebegő réteg, tartomány + számláló, kereső, nézetváltó, címkefelhő), `bc-picker.css` (legördülő, lista, naptár).
* **Kötelező mező-részek és grafikon-részek, bővített önteszt-kör** (`docs/komponensek.md` 3/A, 3/B, 3/C – Kristóf kérése).
* **Gépi önteszt:** `tests/check-komponensek.js` – 5 tesztlap × 8 nézet × világos/sötét: forgatókönyvek (35), konzolhiba, kilógás, 44 px, kontraszt, 3/A, látható fókusz, axe-core (WCAG 2.2 AA), csökkentett mozgás, hosszú feladatok. Eredmény: 35/35, 0 lelet. CI: Playwright Chromium.
* **HIBAJAVÍTÁS (az 1.12–1.13-ban is!):** a `--bc-focus` szerep önmagára hivatkozott → a böngésző eldobta, **a billentyűzetes fókuszkeret sehol nem látszott**. Javítva a generátorban; a `check-tokens` mostantól megfogja az önhivatkozást. A fogyasztó projektekben (admin) verzió-emelés kell.
* Javaslatok jóváhagyásra: **02 – Adat és grafikon**, **03 – Rétegek és navigáció**, **04 – Média és speciális** (`javaslatok/`, `docs/javaslatok/`).
* A lenyíló rétegek a látható területen belül maradnak (görgethetően).

## 1.13.1 – 2026-10-01 – komponens-szabálykönyv, javaslatok, GitHub Pages
* **`docs/komponensek.md`** (Kristóf kérése): meglévőből dolgozz (keresési sorrend), atomic szintek (token → atom → molekula → organizmus → sablon → oldal), **kötelező öntesztek minden beviteli mezőre és grafikonra** (működés, 8 nézet × világos/sötét, UX/UI-szabályok, szélső esetek katalógusa), Definition of Done, közös definiálás javaslatlappal és Kristóf jóváhagyásával.
* Javaslat-sablon: `docs/javaslatok/_sablon.md`; **Javaslat 01 – Űrlap** (`docs/javaslatok/01-urlap.md`, makettek: `javaslatok/01-urlap.html`) – jóváhagyásra vár.
* GitHub Pages kezdőlap (`index.html`, `.nojekyll`); a repó publikus (Kristóf döntése).
* `beeco-ds` skill, `CLAUDE.md`, `docs/rendszer.md`, `docs/termek-arculat.md`: hivatkozás a komponens-szabályokra.

## 1.13.0 – 2026-10-01 – SCSS-kimenet bővítése (az admin átállásából)
* `dist/scss/_beeco.scss`: minden skálaelem egyedi változóként is (`$bc-fw-bold`, `$bc-bw-hair`, `$bc-lh-normal`, `$bc-sp-4`, `$bc-shadow-m` …), új függvények: `fw()`, `bw()`.
* `$bc-hex-<primitív>` és `$bc-hex-role-<szerep>`: fordítási idejű hex-értékek **csak** SCSS-színfüggvényhez (`rgba($x, .3)`) és régi kód áthidalásához – sötét módban nem váltanak, új kódban a `var()`-os szerep a helyes.

## 1.12.0 – 2026-10-01 – egységes beeco design system
A kit a **teljes beeco-márka design systeme** lett (repó: `hegebeeco/beeco-design-system`). Kristóf döntései: közös atomok + két bőr
(a termékek az app neo-brutalista vonalát követik fekete tintával, a játékok maradnak a Méhsejt-dioramánál), egy forrás → generált
kimenetek, sötét mód tokenszinten, sorrend: DS → admin → partner. **A játékokban semmi nem változik.**
* **Egy forrás:** `tokens/core.json` (38 primitív szín, betű, skála, térköz, mozgás, adatskálák), `tokens/theme-termek.json` (28 szín-szerep világos + sötét, sarok, keret, kemény árnyék, kötelező kontraszt-párok), `tokens/theme-jatek.json` (a `tokens.css` tükre).
* **Generált kimenetek** (`tools/tokens-build.js` → `dist/`): `beeco-tokens.css` (`--bc-*`), `beeco-fonts.css`, `scss/_beeco.scss`, `tailwind/preset.cjs` (a Tailwind alap-palettája ki), `dart/beeco_tokens.dart`, `tokens.json`.
* **Termékbőr elemei** (`termek/css/bc-*.css`): gomb, ikongomb, űrlap (mező, legördülő, mértékegység, jelölő, kapcsoló, rács), kártya, oldalfej, fülek, felugró ablak, címke, sáv, értesítés, töltés, üres állapot, táblázat, statisztika, lapozó, alkalmazás-váz. Élő bemutató: `termek/bemutato.html` (minőségkapu: 0 P0/P1, világos + sötét, 320–1280 px).
* **Ellenőrzések:** `tests/check-tokens.js` (dist friss, kontraszt mindkét módban, párosság a játékokkal, `bc-` szabályok: nyers szín, nem létező token, `ease-in`, nyers betűméret, lassú átmenet, méz háttér szövegszíne) · `tools/ds-lint.js` / `npx beeco-ds-lint` a termék-projektekhez, racsnival.
* **Szabálykönyvek:** `docs/rendszer.md`, `docs/termek-arculat.md`, `docs/app-atallas.md` (Bencének), `DESIGN.md`; skill: `beeco-ds`.
* **Csomag:** `package.json` (`@beeco/design-system`, git-függőségként: `github:hegebeeco/beeco-design-system#v1.12.0`), CI: `.github/workflows/check.yml`.

## 1.11.0 – 2026-09-29
* **Új matricák (B szint):** 19 Hűtő-mester étel (`art-huto-b.js`: főtt rizs, füstölt lazac, tiramisu, pulykamell, hamburgerhús, pácolt csirke, paprika, szőlő, csemegekukorica, spenót, cukkini, majonéz, savanyúság, salátaöntet, liszt, sütőtök, batáta, éretlen avokádó, görögdinnye + `f_konzerv`) és 8 Greenwashing-tárgy (`art-gw-e.js`: halrudacska, kerti pad, vízforraló, ágynemű, polárpulóver, hajbalzsam, papírtányér, autógumi); bemutató: `kit.html`, `arculat.html`; `docs/rajzolas.md` frissítve.

## 1.10.1 – 2026-09-29
* **Javítás:** `arculat.html` – a rács oszlopa nem lehet szélesebb a helynél (`minmax(min(var(--min), 100%), 1fr)`); 320 px-en a Mozgás rész 36 px-t kilógott (minőségkapu P1).

## 1.10.0 – 2026-09-29
* **Mozgás 2.0 (Emil Kowalski + taste-design + Impeccable DS-review):** új tokenek `--ease-out`, `--ease-in-out`, `--ease-drawer`, `--t-press`; nyomás-visszajelzés minden gombon, hover csak egérrel, alsó lap javítások (visszaugrás, pöccintés, súrlódás, második ujj); színes oldalcsík helyett színminta; kontraszt a méz felületen; eredménypanel: látható mérőszám-feliratok, csendes app-banner, `nextLabel`.
* **Új: játékérzet-modul** `web/js/ds-juice.js` – `DS.motion.stagger` (sorban érkezés), `.chain` (láncreakció emelkedő hanggal, Promise), `.swipe` (döntés-kártya kirepül), `.meter` (`.ds-meter` animált váltása + változás-jel), `.celebrate` (nagy pillanat); hangok `dsSound('swipe' | 'whoosh' | 'chain')`; `ds-anim-swipe` a `ds-motion.css`-ben. Betöltés a `ds-ext.js` után. Bemutató: `arculat.html` → Mozgás. Mind megáll a „Kevesebb mozgás” mellett.
* **Matricák és 3D:** Élő lánc (4 élőhely), A mi bolygónk (+2050 képeslapok), Digitális rendelő matricái; Tanösvény és Csillagvizsgáló 3D épület; `katalogus.js`, `orbit.js` frissítés.
* A beeco-szelektalj játékvilágban használva: 6 játék játékérzet-átdolgozása, Méhesd-kör, nehézség-kapcsoló (játék-szintű, nem kit).

## 1.9.1 – 2026-09-23
* **Javítás (fontos):** a `tokens.css`-ben a „Nagyobb betűk” blokk tévedésből a `:root` közepére került, és kiütötte a sarok-, térköz- és árnyék-tokeneket – emiatt minden doboz szögletes lett. A blokk a fájl végére került, és a `check-arculat` mostantól ellenőrzi, hogy a lényeges tokenek a `:root`-ban vannak.
* **Betöltés:** az offline mód service workere a betöltés után **8 másodperccel** regisztrál (`offline.js`), így a ~6 MB-os előtöltés nem veszi el a sávot az első játéktól. A `sw-lista.js` kihagyja a Three.js helyi tartalékát (csak akkor kell, ha a CDN tiltva van – használatkor kerül a tárba).

## 1.9.0 – 2026-09-23
* **Akadálymentesség:** „Nagyobb betűk” az egész felületre (`tokens.css` → `html.nagy-betuk` méret-tokenek).
* **Új matricák** (`web/js/art/art-extra2.js`, B szint): `pizza` (🍕), `alma` (🍎), `karacsonyfa` (🎄), `hervadt_virag` (🥀), `fogaskerek` (⚙️), `muzeum` (🏛️).
* **`check-i18n`:** a `product` mező csak az `impact.json`-ban számít azonosítónak – máshol fordítható (a Greenwashing terméknevei).
* `docs/nyelvek.md`: fordítási állapot és a visszatérő buktatók (beégetett szöveg → előbb `tr()`, csak utána szótár).

## 1.8.2 – 2026-09-23
* Kioszk (`js/keret/kioszk.js`): a látogató után MINDEN haladás törlődik (rekordok és helyi ranglisták is) – eddig ezek bent maradtak, és a következő látogató az előző eredményeit látta.

## 1.8.1 – 2026-09-22
* Új matricák (`art-tortenelem.js`, B szint, magyar történetekhez): `tuzok`, `golya`, `gat` (árvízvédelmi töltés), `nadas`, `voros_iszap`, `szennyviz_medence`.

## 1.8.0 – 2026-09-22
* Új matricák (`web/js/art/art-tortenelem.js`, B szint, történelmi képregényhez): `gozgep`, `szencsille`, `olajkut`, `olajhordo`, `mutragyazsak`, `tehen`, `balna`, `sas`, `kukorica`, `olajpalma`, `benzinkut`, `halott_fa`, `gyarkemeny`, `lancfuresz`, `varrogep`, `tabla_tuntetes`. Először a „Nagyi mesél” (Helytörténeti Múzeum) játékban.
* Új 3D városi modell: `museum` (`varos-kozpont.js`, oszlopos homlokzat, B szint), a katalógusban is.
* Javítás: a kör vége panel ranglista-sora keskeny kijelzőn nem lóg ki (`.ds-result-lb` rács: `minmax(0, 1fr)`).

## 1.7.0 – 2026-09-22
* Új matricák (`web/js/art/art-kozlekedes.js`, B szint): `e_bringa`, `telekocsi`, `berlet` (🎫), `esernyo` (☔), `esoruha`, `esos_felho`, `viharfelho` (⛈️), `iskola` (🏫), `rendelo` (🏥, zöld kereszt), `aktataska` (💼), `nagyi` (👵), `bakancs` (🥾), `jeges_ut`. Galéria: `arculat.html` → Közlekedés. Először a „Nem gáz a pedál” játékban.

## 1.6.1 – 2026-09-22
* `ds-game.css`: kör vége ranglista – becenév-csipesz (`.ds-result-nick`), üzenet-sor (`.ds-result-lb-note`), a saját sor kiemelése (`li.is-me`). A globális ranglistához (generált becenév, Supabase).

## 1.6.0 – 2026-09-22
* Új 3D város-elemek (`web/js/3d/varos-kozpont.js`, B szint, a `VAROS_MODELS`-be): `townHall` (városháza), `library` (könyvtár), `busStop` (buszmegálló busszal, `{bus:false}`), `market` (piaccsarnok), `recyclingYard` (hulladékudvar 5 konténerrel), `solarRoof({w,d})` (napelem-mező), `bikeLane({len})` (bringaút), `windTurbine` (szélkerék: `{ body, blades, hub }` – a lapát a `hub` pont körül, a Z tengely mentén forog). Katalógus + galéria (`modellek.html`) + `check-3d`. Először a Szelektálj! „Méhesd 2050” városi hubjában.

## 1.5.2 – 2026-09-22
* `i18n.js`: minden nyelvválasztó magától működik (közös kattintás-figyelő – a menü fejlécében nem volt kezelő), és váltáskor az URL `?lang=` paramétere törlődik (különben a link nyelve felülírta a választást).

## 1.5.1 – 2026-09-22
* `orbit.js` (dioráma-kamera): érintésnél ~10 px holtzóna (a koppintás nem billenti el a nézetet), nagy kijelzőn lassabb forgatás – táblagép-teszt után.

## 1.5.0 – 2026-09-21 (Méhesd: város és poszméh)
* **Város-modellek** (`web/js/3d/varos-modellek.js`, `VAROS_MODELS`, B szint): házsor, panelház, iskola, templom, bolt, parkoló,
  út, patak (külön vízfelszínnel), híd, vasúti töltés, temető, gyümölcsös, park, zöldfolyosó-szakaszok hosszra nyújtva
  (virágsáv, sövény, fasor – évszakosan), kaszált rét, élőhely-pont talapzat (`node({ kind })`, álnevekkel).
* **Poszméh** (`varos-poszmeh.js`): királynő és dolgozó csapkodó szárny-részekkel, fészek (rágcsálójárat fűcsomóban), permetezés-jelzés.
* Galéria: új „Méhesd” csoport (39 változat).

## 1.4.0 – 2026-09-21 (kerti 3D készlet)
* **Élő kert modellek** (`web/js/3d/elokert-modellek.js` + `elokert-allatok.js`, `EK_MODELS`, B szint, 43 változat a galériában):
  fa 3 fázisban és 4 évszakban, őshonos sövény, virágos rét, évelőágyás, veteményes (évszakosan), kerti tó és madáritató
  (külön vízfelszín-résszel), esővízgyűjtő, komposztláda, rovarhotel, pad, térkő, ház, terasz, kiskapu, kerítés; állatok:
  vadméh, pillangó, madár, denevér (csapkodó szárny-részekkel), katica, sün, béka, gyík.
* `check-i18n`: a `source2`/`source3` forráscímet sem veti össze.

## 1.3.2 – 2026-09-21
* `check-i18n`: az ezres elválasztót (85 000 ↔ 85,000) nem jelzi eltérő számnak, és a változatlanul hagyott szöveget (pl. eredeti nyelvű forráscím) nem veti össze.

## 1.3.1 – 2026-09-21
* Döntéskártya: új `onLean(oldal, 0–1, kártya)` visszahívás húzás közben – pl. a mérőkön előre mutatható, merre mozdulnak (az „Egy ökos polgármester élete” használja).

## 1.3.0 – 2026-09-18 (nyelvek)
* **Kétnyelvű felület (magyar / angol):** `web/js/i18n.js` – `tr('magyar szöveg')` (a magyar a kulcs, hiányzó fordításnál
  a magyar jelenik meg), szótárak `web/js/i18n/en-*.js`, angol tartalom `web/data/en/*.json` (azonos szerkezet),
  `I18N.fetchJSON`, `data-i18n`, nyelvválasztó `I18N.selectorHTML()`; nyelv: `?lang=en` > mentett választás > böngésző.
  Ellenőrzés: `tests/check-i18n.js` (hiányzó fordítás, eltérő szám/azonosító az angol tartalomban). Szabályok: `docs/nyelvek.md`.
* A közös modulok fordíthatók: kör vége, kioszk, beállítások (**új Nyelv sor**), közös profil (küldetések, jelvények),
  szereplők neve, ds-ext felolvasott szövegei, mechanikák üzenetei; angol szótár: `web/js/i18n/en-kit.js`.
  A `ds.js`-ben tartalék `tr()` – az i18n.js nélkül minden magyarul megy tovább.
* **5 új szerepes méhecske** (`web/assets/brand/roles/`): polgármester, élő kert, ételmentő, beporzó, körforgó –
  az eredeti méhecske + kódból rajzolt kellékek (`tools/meh-szerepek/`, `docs/meh-szerepek.md`).

## 1.2.1 – 2026-09-18
* A 2D hátterek bemutató-oldala (hatterek.html) sem kerül az offline fájllistába.

## 1.2.0 – 2026-09-18 (design system 1.2)
* **10 új `ds-` elem** (`web/css/ds-ext.css`, `web/js/ds-ext.js`, bemutató: `arculat.html` → Új elemek): változásjelző
  (`dsDeltaHTML`, `DS.delta.show`, `dsMeterHTML` szellem-szakasszal), profil-ábra (`dsProfileHTML` radar/sávok), forrás-sor és
  feltételezés-címke (`dsSourceHTML`, `dsAssumeHTML`), első lépés tanító (`DS.coach`), visszaszámláló gyűrű (`DS.ring`),
  csúszka (`dsRangeHTML`), magyarázó buborék (`DS.tip`), alsó lap (`DS.sheet`), képernyő-váz (`.ds-screen`), nagy betű mód (`DS.big`).
* **19 új piktogram** (79 összesen): up, down, plus, minus, undo, hand, alert, eye, city, road, recycle, ring, chart, sheet,
  swipe, grid, network, flow, source.
* **Adatskála-tokenek** (hőtérkép, élőhely): egyirányú és kétirányú skála + színtévesztő-barát változat (`.ds-cb`),
  `DS.scale` – `docs/adatskala.md`; a rács-modul hőtérképe erre állt át (color-mix nélkül).
* **8 új szereplő** (kitalált városlakók: polgármester, boltos, diák, nyugdíjas, kertész, buszsofőr, orvos, tanár) + új
  haj-, fejfedő- és ruha-részlet opciók a `szereplok.js`-ben.
* **Áramlás-mozgás** (`web/js/aramlas.js`, `DS_FLOW`): pöttyök SVG-vonalon és vásznon; a vonal-modulban opcionális.
* **2D háttér-jelenetek** (`web/js/hatter2d/`: város ma/2075 jövő-mérővel, konyha, kert, méhsejt-minta) – bemutató: `web/hatterek.html`.
* **Keret:** a beállítások között „Nagyobb betűk” és „Színtévesztő-barát színek”.
* **Sablon:** a mintajáték változásjelzővel, tanítóval és profil-ábrával.

## 1.1.1 – 2026-09-18
* A kalauz fejlesztői oldalai (kit.html, keret.html, modellek.html, vilag.html, mechanikak.html) nem kerülnek az offline fájllistába.

## 1.1.0 – 2026-09-18

### Új
* **Tartalom ⇄ táblázat (CSV) eszköz, bármelyik játékhoz** – `tools/tartalom.js`. A beeco csapat Excelben vagy Google
  Táblázatban szerkesztheti a szövegeket: `export` → szerkesztés → `import --dry` (próba) → `import`. Hogy mi szerkeszthető,
  azt a projekt `tartalom.config.json` fájlja írja le (JSON-fájl, tömb, id, szerkeszthető / csak olvasható / kötelező mezők,
  max. hossz, lehetséges értékek, link- és forrásmezők, új sor felvétele). A JSON-ban csak a megváltozott értékek bájtjai
  cserélődnek (kicsi git-diff), írás előtt önellenőrzés; magyar Excel-barát CSV (UTF-8 BOM, `;`), képlet-védelem,
  ütközés-védelem (ellenőrző kód). Útmutató: `docs/tartalom-szerkesztes.md`. (Alapja a Szelektálj! projekt saját eszköze.)
* **Forrásjegyzék + forrás-ellenőrzés** („szám csak forrással”) – `web/data/forrasok.json` a sablonban,
  `tools/forras.js` + `tests/check-forras.js`: minden számot tartalmazó szövegnek forrás kell (a jegyzékből vagy http(s) link),
  a jegyzék elemei hiánytalanok, a régi forrásra figyelmeztet; a CI minden élesítés előtt futtatja. Szabály: `docs/forrasok.md`.
* **Kit-verzió:** `VERSION` + ez a `CHANGELOG.md`; a `tools/kit-sync.js` frissítés után `KIT-VERZIO` fájlt ír a projektbe
  (verzió, kit-commit, dátum), a `--check` kiírja, melyik verzión van a projekt. Az `uj-jatek.js` is beírja.
* **Sablon:** `tartalom.config.json` (a mintajáték kártyái, értékei, profiljai + a forrásjegyzék); az `uj-jatek.js`
  `{{AZONOSITO}}` helyőrzőt is kitölt (a mappanévből: kisbetű, ékezet nélkül, „beeco-” nélkül; 4. paraméterrel felülírható).

* **Közös játékkeret** (`web/js/keret/`, `web/css/keret.css`, leírás: `docs/keret.md`): kör vége panel (`keretEredmeny`),
  beállítások (`keretBeallitasok`: hang, zene, rezgés, kevesebb mozgás, vezérlés), kifelé menő csatorna + névtelen mérés
  (`beecoBridge`), általános kioszk-mód (`keretKioszk`, `?kioszk=1`). A sablon már ezt használja (fogaskerék, kör vége, kioszk).
* **Közös játékosprofil („beeco playground”)** – `web/js/profil.js` (`beecoProfil`): album, napi küldetés + sorozat, jelvények
  minden játékon át, a Szelektálj! mentési formátumával. A **központ** (közös cím, alútvonalak, Netlify-proxy): `docs/kozos-profil.md`.
* **3D világ-készlet:** a játékok kódból épített modelljei a kitben (`web/js/3d/`: Szelektálj!, Hűtő-mester, Ökos-rejtély ház,
  Fenntartható otthon – 42 tárgy, 50 változat, katalógus), `beecoVilag()` egy hívással: ég, nap, felhők, lebegő méhsejt-szigetek,
  madarak, fű, hatszög-sziget, rét, napszakok, B/C minőség őrrel (`web/js/vilag/`). Galéria: `web/modellek.html`, bemutató:
  `web/vilag.html`, leírás: `docs/3d-vilag.md`, teszt: `tests/check-3d.js`.
* **Játék-mechanika modulok** (`web/js/mech/`, `web/css/mech.css`): húzós döntéskártya késleltetett következményekkel,
  rácsos lerakás szomszédsági hatásokkal és hőtérképpel, vonalhúzás pontok között (kritikus pontok, elszigetelődés),
  húzd-és-kombináld időzítővel és frissességgel. Bemutató: `web/mechanikak.html`, leírás: `docs/mechanikak.md`, teszt: `tests/check-mech.js`.
* **Hang és szereplők:** `web/js/hang.js` (`beecoHang`: háttérzene, némítás, rezgés; a DS-hangok is ezen mennek),
  `web/js/szereplok.js` (a Zöldi család SVG-szereplői + méhecske, bővíthető).
* **Kalauz 2.0:** `web/kit.html` – kereshető áttekintés mindenről (adat: `web/kit-tartalom.json`, `node tools/kit-index.js`),
  `web/keret.html` – a keret élő bemutatója.

## 1.0.0 – 2026-09-18 (első kiadás, commit `9003e52`)

A beeco webjátékok közös alapja, a Szelektálj! projektből kiemelve.

* **Design system („Méhsejt-diorama”)** – tokenek (`web/css/tokens.css` + `web/js/ds.js`), `ds-` elemek (`ds.css`),
  játék-minták (`ds-game.css`: buborék, csillag, eredmény-panel, jelvény…), mozgás-készlet (`ds-motion.css`, `DS.motion`),
  piktogramok (`web/js/pics.js`), saját betűk (Lalezar + Open Sans, `web/assets/fonts/`), élő kalauz (`web/arculat.html`).
* **Méhecskék és márkaképek** (`web/assets/brand/`, belső használatra).
* **374 B szintű matrica kódból + 3D modell-készlet** (`web/js/art/`: `art.js`, `model-kit.js`, `art-*.js`),
  képcsere kódmódosítás nélkül (`web/data/art-override.json`).
* **QR-kód és offline mód** – `web/js/qr.js`, `web/js/offline.js`, `web/sw.js`, fájllista: `tools/sw-lista.js`.
* **Eszközök** – ablak nélküli böngészős ellenőrzés (`tools/jatek-foto.js`, `tools/headless.js`), konfigurálható
  smoke-teszt (`tools/smoke.js` + `smoke.config.json`), matrica-render/ív/PNG/prompt/import (`tools/art-*`),
  3D-ellenőrzés és modell-néző (`tools/model-check.js`, `tools/modell-kit.js`, `tools/modell-nezo.html`).
* **Szabálykönyvek** – arculat, rajzolási mérce (B szint), grafika-spec, promptolás (+ források), offline + CI,
  játéktervezési elvek (`docs/`).
* **Claude-skillek** – `beeco-arculat`, `beeco-jatek` (`.claude/skills/`).
* **Tesztek** – `tests/check-arculat.js` (tokenek, kontraszt, racsni: `tests/arculat-baseline.json`), `tests/check-art.js`.
* **Új játék sablon** (`sablon/`) – futó mintajáték (döntés-kártyák + rendszerértékek + profil), tartalom-teszt, CI
  (GitHub Actions: tesztek, offline fájllista, smoke-teszt, Netlify-élesítés), offline mód, `CLAUDE.md`.
* **Terjesztés** – `tools/uj-jatek.js` (új projekt a sablonból), `tools/kit-sync.js` (kit ⇄ projekt szinkron, `--check`,
  `--vissza`), leltár: `KIT-FILES.json`.
