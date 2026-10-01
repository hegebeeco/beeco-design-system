# A beeco-jatek-kit változásai

A kit verziószáma a `VERSION` fájlban van, **szemantikus verziózással** (FŐ.MELLÉK.JAVÍTÁS):

* **JAVÍTÁS** (1.0.**1**) – hibajavítás, új matrica/piktogram, szövegjavítás a szabálykönyvekben; semmi nem változik, amire egy játék épít.
* **MELLÉK** (1.**1**.0) – új lehetőség (új eszköz, új `ds-` elem, új token), ami a meglévő játékokat nem érinti.
* **FŐ** (**2**.0.0) – olyan változás, ami miatt a játékokban is módosítani kell (átnevezés, törlés, más viselkedés). Ezt kerüljük
  (lásd `CLAUDE.md`: csak bővítünk), és ha mégis kell, itt írjuk le, mit kell a játékokban átírni.

**Kiadás menete:** a lenti „Készül” rész tételei kerülnek az új verzió alá → `VERSION` átírása → commit + push a kitben →
a játékokban `node ~/CLAUDE/beeco-jatek-kit/tools/kit-sync.js .` (ez beírja a projekt `KIT-VERZIO` fájljába az új verziót).
Hol tart egy játék? `node ~/CLAUDE/beeco-jatek-kit/tools/kit-sync.js <projekt> --check` – kiírja a projekt és a kit verzióját.

## Készül (következő verzió)

*(még nincs)*

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
