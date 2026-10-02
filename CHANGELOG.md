# A beeco-jatek-kit változásai

A kit verziószáma a `VERSION` fájlban van, **szemantikus verziózással** (FŐ.MELLÉK.JAVÍTÁS):

* **JAVÍTÁS** (1.0.**1**) – hibajavítás, új matrica/piktogram, szövegjavítás a szabálykönyvekben; semmi nem változik, amire egy játék épít.
* **MELLÉK** (1.**1**.0) – új lehetőség (új eszköz, új `ds-` elem, új token), ami a meglévő játékokat nem érinti.
* **FŐ** (**2**.0.0) – olyan változás, ami miatt a játékokban is módosítani kell (átnevezés, törlés, más viselkedés). Ezt kerüljük
  (lásd `CLAUDE.md`: csak bővítünk), és ha mégis kell, itt írjuk le, mit kell a játékokban átírni.

**Kiadás menete:** a lenti „Készül” rész tételei kerülnek az új verzió alá → `VERSION` átírása → commit + push a kitben →
a játékokban `node ~/CLAUDE/beeco-jatek-kit/tools/kit-sync.js .` (ez beírja a projekt `KIT-VERZIO` fájljába az új verziót).
Hol tart egy játék? `node ~/CLAUDE/beeco-jatek-kit/tools/kit-sync.js <projekt> --check` – kiírja a projekt és a kit verzióját.

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
