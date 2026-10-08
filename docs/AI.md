# beeco DS – AI-index

> GENERÁLT (`node tools/ai-index.js`) – ne szerkeszd. **Ezt olvasd először**; a `dist/`-et ne nyisd meg (generált).
> Munkamód, kiadás, szabályok: `docs/ai-munkamod.md`. Részletes szabálykönyv csak ha kell: `docs/komponensek.md`, `docs/termek-arculat.md`.

## Használat a projektben

- React: `import { Button, TextField } from '@beeco/design-system/react'` + egyszer `import '@beeco/design-system/termek.css'`.
- CSS egyenként: `@beeco/design-system/termek/<bc-fájl>.css` · SCSS: `@use '@beeco/design-system/dist/scss/beeco' as bc;` · Tailwind: `presets: [require('@beeco/design-system/tailwind')]` · Flutter: `dist/dart/beeco_tokens.dart`.
- Telepítés címkével: `npm i github:hegebeeco/beeco-design-system#vX.Y.Z` (a verzió: `VERSION`).

## Munkamenet és ellenőrzés

- Munka közben **csak** egy komponens: `npm run check:egy -- <tesztlap vagy Komponens>` (pl. `utvonal`, `TextField`): csak azt építi és teszteli (2 nézet).
- A végén egyszer: `npm run build && npm test` (= CI). Generált: `dist/`, `termek/tesztlapok/*.html`, `api/api.json`, `docs/AI.md`.
- Tesztek helye: tesztlap `react/tesztlapok/<lap>.tsx` (+ `termek/tesztlapok/<lap>.test.mjs` forgatókönyv); futtató `tests/check-komponensek.js [lap…] [--gyors]`.
- API-őr: `node tools/api-check.js` (eltűnő név/prop = hiba); változás után `--write`.

## Szabályok (top 10)

1. Meglévőből dolgozz: DS React-komponens → `bc-` CSS-elem → projekt-komponens → tokenekből. Új elem/változat csak Kristóf jóváhagyásával (`docs/javaslatok/`).
2. Csak tokenek/szerepek (`var(--bc-ink)`, `bc.$bc-ink`, `text-ink`); nyers szín, px betűméret/sarok/árnyék tilos; a Tailwind alap-palettája nincs.
3. Név soha nem változik és nem törlődik (token, osztály, export, prop) – csak bővíts. Az `api-check` megfogja.
4. Szöveg a mézen (`accent`) mindig `on-accent`; kattintható és kiemelt elem: kemény, átlós árnyék (`shadow-s/m/l`), nem kattintható információs doboz: `shadow-soft` (`docs/termek-arculat.md` 6/A).
5. Lalezar csak cím/szám/gomb, Open Sans minden más; 12 px alatt nincs szöveg.
6. UI-visszajelzés ≤ 300 ms, `ease-out`; fiók 400 ms; belépő/dekoratív animáció ≤ 900 ms (`t-decor`, `t-hero`), csak token; `ease-in` tilos; csökkentett mozgásnál nincs mozgás.
7. 44 px érintés, látható `:focus-visible` (kifelé: `outline-offset ≥ 2px`), ikongombon `aria-label`, kattintható elem `<a>`/`<button>`.
8. Minden állapot: töltés, üres, hiba (következő lépéssel), siker, tiltott. Szöveg magyarul, tegezve; feliratok `labels`-szel felülírhatók.
9. Gombszabály (egy forrás: `docs/termek-arculat.md` 6/A): egy méz fő gomb; kompakt helyen ikon-gomb `TooltipIconButton`-nal; fő gomb szöveg + piktogram (`IcSave`, `IcTrash`, `IcNew`…).
10. Ne szerkeszd: `dist/`, `termek/tesztlapok/*.html`, `docs/AI.md`; feature-ágon ne emelj verziót; titok soha (publikus repó).

## Tokenek (termékbőr)

- **Szín-szerepek** (`--bc-<szerep>`, Tailwind `bg-/text-/border-<szerep>`, sötét módban maguktól váltanak): `bg` `surface` `surface-2` `surface-accent` `ink` `ink-soft` `ink-muted` `line` `line-soft` `accent` `accent-press` `on-accent` `shadow` `focus` `success` `success-bg` `success-ink` `danger` `danger-bg` `danger-ink` `warning` `warning-bg` `warning-ink` `info` `info-bg` `info-ink` `highlight` `scrim` `focus-on-accent`.
- Világos → sötét: bg cream→night · surface white→night-surface · ink black→cream · line black→night-line · accent honey→honey · on-accent black→black.
- Betű `--bc-fs-*`: xs 12 · s 14 · m 16 · l 20 · xl 26 · 2xl 34 · 3xl 46 px; vastagság `--bc-fw-*`: regular, semibold, bold.
- Térköz `--bc-sp-*`: 1=4 2=8 3=12 4=16 5=24 6=32 7=48 8=64 px · sarok `--bc-r-*`: xs=2 s=4 m=8 l=12 pill=999 · keret `--bc-bw-*`: hair, base.
- Árnyék `--bc-shadow-*`: s, m, l (kemény) · idő `--bc-t-*`: fast 120ms, base 200ms, slow 400ms, press 120ms, decor 600ms, hero 900ms · `--bc-ease-out` · `--bc-tap` 44 px.
- Adatskálák: `--bc-data-seq-1…`, `div`, `-cb` (színtévesztő-barát), `allapot`, `cat-1…8`. Primitívek (`--bc-honey`…) csak adatvizualizációhoz.

## React-komponensek (149; mind: `@beeco/design-system/react`)

Sor: **Név** `forrás` — fő propok (`*` kötelező, `…attr` = natív attribútumok is) · `.bc-osztály` · szint · mire. 🆕 = a legutóbbi 3 mellékverzióban jött.

### 01 Űrlap (alap)
- **Button** `inputs/Button` — block:bool, busy:bool, done:bool, icon, size:'sm'|'md'|'lg', variant:'primary'|'secondary'|'ghost'|'danger', …attr · `.bc-btn` · Button (atom) – a DS .bc-btn React-változata.
- **Calendar** `pickers/Calendar` — onPick*:fn, selected*, max:string, min:string · `.bc-cal` · Havi naptár (rács, role="grid"): nyilak = nap/hét, PageUp/Down = hónap, Home/End = hét eleje/vége, Enter = választ.
- **Checkbox** `inputs/Choice` — help*, label*:string, error:string, …attr · `.bc-field` · atom · natív jelölő a beeco színeivel, címke + súgó; react-hook-form register-rel is.
- **CheckboxInput** `inputs/Choice` — indeterminate:bool, …attr · `.bc-checkbox` · atom · a márkázott jelölőnégyzet címke és súgó nélkül – ahol a környezet adja a nevet (táblázat-sor, galéria-csempe, „mind kijelölése”).
- **Combobox** `pickers/Combobox` — help*, label*:string, onChange*:fn, options*, value*, count, disabled:bool, error:string, filter:bool, +13 · `.bc-combo` · molekula · keresős legördülő, egyes/többes, új elem létrehozással, címkék a mezőben.
- **DatePicker** `pickers/DatePicker` — help*, label*:string, onChange*:fn, value*:string | null, count, disabled:bool, error:string, max:string, min:string, +4 · `.bc-date` · molekula · gépelhető mező + lenyíló naptár (+ időpont).
- **DateRangePicker** `pickers/DateRangePicker` — help*, label*:string, onChange*:fn, value*:DateRange, count, disabled:bool, error:string, max:string, min:string, +3 · `.bc-select` · molekula · első kattintás = kezdet, második = vég; fordított sorrendnél megcseréli és szól.
- **DraftNotice** `form/useDraft` — onDiscard*:fn, onRestore*:fn, savedAt*:number · `.bc-draft` · „Van egy be nem fejezett változat” sáv – Visszaállítás / Elvetés
- **Field** `field/Field` — help*, label*:string, count, disabled:bool, error:string, labelFor:bool, notice:string, range:string, required:bool · `.bc-field` · molekula · címke + súgó · mező · tartomány + számláló · hiba/jelzés.
- **FieldInput** `field/FieldInput` — – · Segéd: a Field-kontextust (id, aria-describedby, invalid) render-függvénnyel adja a mezőnek.
- **FormActions** `form/FormSection` — – · `.bc-form-actions` · molekula · a jobb oldalon a fő művelet, előtte a mégse; telefonon egymás alatt, teljes szélességben.
- **FormSection** `form/FormSection` — title*:string, description · `.bc-card` · organizmus · cím + rövid leírás + mezőrács egy kártyán; hosszú űrlap tagolására.
- **HelpButton** `field/HelpButton` — label*:string, srLabel:string · `.bc-help-btn` · Súgó gomb (ⓘ) – Kristóf, 2026-10-01: háttér és körvonal nélküli piktogram.
- **IconButton** `inputs/Button` — danger:bool, …attr · `.bc-icon-btn` · IconButton (atom) – 44×44 px, kötelező aria-label.
- **NumberField** `inputs/NumberField` — help*, label*:string, onChange*:fn, value*:number | null, clamp:'blur'|'input', count, decimals:number, disabled:bool, error:string, +6, …attr · `.bc-input` · molekula · gépelős számmező magyar formátummal.
- **RadioGroup** `inputs/Choice` — help*, label*:string, name*:string, options*, disabled:bool, error:string, onChange:fn, required:bool, value:string · `.bc-field` · molekula · fieldset + legend + súgó; natív rádiógombok (nyilakkal léptethető).
- **ScheduleField** `form/ScheduleField` — onChange*:fn, value*:ScheduleValue, endError:string, endHelp:string, endLabel:string, error:string, help:string, label:string, laterLabel:string, +3 · `.bc-schedule` · molekula · „Azonnal / Időzítve” + nap és idő, elhagyható véggel (lejárat).
- **SearchBox** `inputs/SearchBox` — label*:string, debounce:number, onChange:fn, onSearch:fn, value:string, …attr · `.bc-input` · molekula · nagyító + törlés gomb; Esc törli; késleltetett keresés.
- **SegmentedControl** `inputs/SegmentedControl` — items*, label*:string, onChange*:fn, value*:T, wrap:bool · `.bc-seg` · molekula · nézetváltó gombsor, méz kijelölés.
- **SelectField** `inputs/SelectField` — help*, label*:string, options*, count, disabled:bool, error:string, notice:string, placeholder:string, range:string, +1, …attr · `.bc-select` · atom · natív legördülő rövid (≤ ~15 elemű) listához; hosszabbhoz a Combobox.
- **Switch** `inputs/Choice` — checked*:bool, help*, label*:string, onChange*:fn, disabled:bool, error:string · `.bc-field` · atom · azonnal érvényes be/ki kapcsoló (role="switch"); címke + súgó.
- **SwitchInput** `inputs/Choice` — checked*:bool, onChange*:fn, busy:bool, offText:string, onText:string, size:'sm'|'md', …attr · `.bc-switch` · atom · a márkázott kapcsoló címke-sor és súgó nélkül – ahol a környezet adja a nevet és a súgót (táblázat-sor: a súgó az…
- **TagPicker** `pickers/TagPicker` — help*, label*:string, onChange*:fn, options*, value*:string[], cloudLimit:number, count, disabled:bool, error:string, +5 · `.bc-tagcloud` · molekula · ≤ 20 címkénél kattintható felhő, fölötte a Combobox többes módja – egy API.
- **TextArea** `inputs/TextArea` — help*, label*:string, count, disabled:bool, error:string, notice:string, range:string, required:bool, …attr · `.bc-textarea` · atom · mint a TextField, többsoros; élő számláló, levágás-jelzés.
- **TextField** `inputs/TextField` — help*, label*:string, count, disabled:bool, error:string, notice:string, range:string, required:bool, type:'tel'|'text'|'email'|…, …attr · `.bc-input` · atom · címke, súgó, tartomány, élő számláló (pl. 213/255), a max. hossznál a gépelés megáll, a túl hosszú beillesztést levágja és jelzi.
- Piktogramok: `IcEdit` `IcInfo` `IcLeft` `IcNew` `IcOk` `IcOpen` `IcRight` `IcSave` `IcTrash` `IcX`

### 02 Adat és grafikon
- **BarChart** `adat/chart/BarChart` — data*:ChartData, clipOutlier:bool, height:number, label:string, orientation:'vertical'|'horizontal', valueLabels:bool · `.bc-mark-zero` · molekula · oszlop vagy vízszintes sáv, 0-tól induló tengellyel, kontúrral, negatív értékkel, kiugró- és hiány-kezeléssel.
- **BulkBar** `adat/DataTableParts` — count*:number, itemLabel*:string, onClear*:fn, max:number, notice:string · `.bc-dt-bulk` · molekula · kijelöléskor a táblázat fölött (1b A), görgetéskor odatapad.
- **ChartCard** `adat/chart/ChartCard` — data*:ChartData, help*, howToRead*, period*:string, source*, title*:string, unit*:string, cb:bool, emptyAction, +7 · `.bc-card` · organizmus · cím · alcím (egység, időszak) · súgó ⓘ · jelmagyarázat felül · grafikon · „Hogyan olvasd?” (lenyitható, 4b A) · adattábla…
- **ChartLegend** `adat/chart/ChartLegend` — data*:ChartData, kind*:'bar'|'line', onToggle:fn · `.bc-legend` · Jelmagyarázat a grafikon fölött (4a A): minden szín ÉS alak jelentése, plusz a csíkos sáv (rejtett / hiányzó ≠ 0).
- **ChartTable** `adat/chart/ChartTable` — caption*:string, data*:ChartData · `.bc-chart-table` · A grafikon adattáblája (3/B): ugyanazok a számok táblázatban – képernyőolvasónak és ellenőrzésnek.
- **ColumnResizer** `adat/DataTableParts` — header*, label*:string · `.bc-dt-resizer` · atom · oszlopszélesség húzással (egér, érintés) ÉS billentyűzettel (← → 16 px, Home = alapméret).
- **DataNote** `adat/DataState` — title:string, tone:'info'|'warning' · `.bc-alert` · molekula · oldalszintű adat-megjegyzés (mit számol az oldal, mi hiányzik) – `bc-alert is-info`.
- **DataState** `adat/DataState` — status*:DataStatus, empty, error:string, onRetry:fn, retrying:bool, skeleton, what:string · `.bc-state` · molekula · töltés / üres / hiba (újrapróbálás) / nincs jogosultság / kész – egy kapcsoló.
- **DataTable** `adat/DataTable` — caption*:string, columns*, data*:T[], getRowId*:fn, rowLabel*:fn, bare:bool, bulkActions:fn, canExpand:fn, captionVisible:bool, +25
- **EmptyState** `adat/EmptyState` — title*:string, action, compact:bool, illustration · `.bc-empty` · molekula · kép-hely + egy mondat + magyarázat + egy teendő.
- **ExpandToggle** `adat/DataTableParts` — controls*:string, expanded*:bool, label*:string, onToggle*:fn · `.bc-dt-expand` · atom · sor lenyitása – aria-expanded + aria-controls a részletek sorára.
- **FilterBar** `adat/FilterBar` — filters*:FilterDef[], onChange*:fn, values*:FilterValues, extra, itemLabel:string, narrowBelow:number, resultCount:number | null, search · `.bc-fb-count` · organizmus · kereső + szűrők + aktív-szűrő címkék + „Szűrők törlése” + találatszám.
- **GroupedBarChart** `adat/chart/ColumnCharts` — data*:ChartData, height:number, label:string · `.bc-mark-zero` · molekula · két-három szám kategóriánként egymás mellett (pl. létrejött / megoldott hibajegy).
- **HeatLegend** `adat/chart/HeatLegend` — label*:string, thresholds*:number[], unit*:string, decimals:number, min:number · `.bc-heatkey` · molekula · a DS egyirányú adatskálája (--bc-data-seq-1…5; színtévesztő-barát módban seq-cb) határszámokkal.
- **InfoCard** `adat/InfoCard` — rows*, emptyText:string, footer, title:string · `.bc-info` · molekula · címke–érték adatlap egy kártyán (dl/dt/dd).
- **InfoGrid** `adat/InfoCard` — – · `.bc-info-grid` · InfoGrid: InfoCard-ok rácsa – a tartalom szélességéhez tördel (min. 320 px oszlop)
- **LineChart** `adat/chart/LineChart` — data*:ChartData, endLabels:bool, height:number, label:string · `.bc-line-under` · molekula · trend időben, több sorozat.
- **Pagination** `adat/Pagination` — onPageChange*:fn, page*:number, pageSize*:number, total*:number, itemLabel:string, label:string, onPageSizeChange:fn, pageSizes:number[] · `.bc-pager` · molekula · „1–25 / 312 POI” · ‹ 1 2 … 13 › · oldalméret 10 / 25 / 100.
- **SelectCell** `adat/DataTableParts` — checked*:bool, label*:string, onChange*:fn, disabled:bool, indeterminate:bool · `.bc-dt-check` · atom · sor- vagy fejléc-jelölő, 44 px-es kattintható terület; a fejlécnél részleges állapot (–) is.
- **SkeletonRows** `adat/DataState` — cols*:number, rows:number · `.bc-skel-row` · atom · csontváz-sorok a táblázat törzsében – a fejléc marad, a sorok helyén `rows` szürke sáv.
- **SortHeader** `adat/DataTableParts` — label*, onToggle*:fn, sorted* · `.bc-dt-sort` · atom · rendezés-gomb a fejlécben; az állapotot a <th aria-sort> mondja, a nyíl csak rajz.
- **Sparkline** `adat/chart/Sparkline` — values*, label:string · `.bc-line-under` · atom · irány tengely nélkül, a StatTile száma mellett – soha egyedül.
- **StackedBarChart** `adat/chart/ColumnCharts` — data*:ChartData, height:number, label:string · `.bc-mark` · molekula · egész és részei időben (legfeljebb 3–4 rész), csak nem negatív értékkel – negatív részt 0-nak nem rajzol, hanem kihagyja és szól.
- **StatTile** `adat/StatTile` — help*, label*:string, value*:number | null, decimals:number, delta, error:string, estimate:bool, good:'up'|'down'|'none', loading:bool, +9 · `.bc-stat-skel` · molekula · érték + egység, változás a jelentés szerint színezve (nyíl + előjel + szöveg, nem csak szín), időszak, súgó ⓘ, elemszám,…
- **StatusBadge** `adat/StatusBadge` — tone*:StatusTone, icon, title:string · `.bc-status` · atom · állapotjelvény hangnem + piktogram + felirat.
- **Tag** `adat/Tag` — icon, title:string · `.bc-badge` · atom · TULAJDONSÁG jelvénye (típus, kategória, címke, „Kiemelt”) – semleges, nem állapot.

### 03 Rétegek és navigáció
- **Accordion** `reteg/Accordion` — items*, defaultValue, headingLevel:2 | 3 | 4, onValueChange:fn, type:'single'|'multiple', value · `.bc-acc-item` · Accordion / lenyitható (molekula, Javaslat 03 – 10): pl. partner-adatlap szakaszai, „Hogyan olvasd?”.
- **AppShell** `reteg/AppShell` — brand*, nav*:NavGroup[], account, brandCompact, collapseKey:string, collapsible:bool, density:'default'|'compact', labels, navLabel:string, +5 · `.bc-nav-group` · sablon · oldalsáv + tartalom, a bc-shell CSS-re építve.
- **Breadcrumbs** `reteg/Breadcrumbs` — items*:Crumb[], label:string, maxVisible:number, renderLink:RenderLink · `.bc-crumbs` · Breadcrumbs / morzsamenü (molekula, Javaslat 03 – 7A): a cím fölött, nav + rendezett lista, a mostani oldal aria-current="page".
- **CommandPalette** `reteg/CommandPalette` — groups*, onOpenChange*:fn, onQueryChange*:fn, onSelect*:fn, open*:bool, query*:string, description, emptyText:fn, error, +8 · `.bc-cmdk` · organizmus · ⌘K / Ctrl+K kereső-paletta – DS Modal (Radix Dialog: fókuszcsapda, Esc, visszatérő fókusz) + SearchBox + csoportosított…
- **ConfirmDialog** `reteg/ConfirmDialog` — confirmLabel*:string, onConfirm*:fn, onOpenChange*:fn, open*:bool, title*:string, cancelLabel:string, confirmDisabled:bool, confirmIcon, danger:bool, +4 · `.bc-scrim` · organizmus · megerősítés csak visszafordíthatatlan vagy másokat érintő műveletnél.
- **Drawer** `reteg/Drawer` — onOpenChange*:fn, open*:bool, title*, busy:bool, closeLabel:string, description, dirty:bool, footer, initialFocus:fn, +1 · `.bc-scrim` · organizmus · egy elem részletei és rövid szerkesztése a lista mellett.
- **DropdownMenu** `reteg/DropdownMenu` — items*:MenuEntry[], trigger*, align:'start'|'end', header, label:string · `.bc-menu` · molekula · profil-menü és sor-műveletek.
- **Modal** `reteg/Modal` — onOpenChange*:fn, open*:bool, title*, busy:bool, closeLabel:string, description, dirty:bool, footer, initialFocus:fn, +1 · `.bc-scrim` · organizmus · felugró ablak fejjel, görgethető törzzsel és álló gombsorral.
- **ModalCancel** `reteg/Modal` — disabled:bool · „Mégse” gomb ablakba és oldalpanelbe: a bezárás-őrön át zár (folyamatban tiltott, mentetlennél kérdez).
- **MoreIcon** `reteg/RowActions` — –
- **NavTabs** `reteg/NavTabs` — items*:NavTabItem[], label*:string, renderLink:RenderLink · `.bc-tabs-wrap` · molekula · ugyanaz a kinézet, mint a Tabs, de linkek – útvonalat váltanak.
- **PageHeader** `reteg/PageHeader` — title*, actions, breadcrumbs:Crumb[], breadcrumbsLabel:string, description, loading:bool, renderLink:RenderLink · `.bc-page-head` · organizmus · cím, hely és fő művelet egy blokkban, a tartalom tetején (a fejléc vékony marad).
- **RowActions** `reteg/RowActions` — actions*:RowAction[], rowLabel*:string · `.bc-row-actions` · RowActions (molekula, Javaslat 03 – 5A) – a sorvégi műveletek szabálya egy helyen: ≤ 2 művelet → ikongombok (felirattal); 3+ →…
- **SectionSwitch** `reteg/SectionSwitch` — items*, label*:string, renderLink:RenderLink · `.bc-secsw` · SectionSwitch – nagyválasztó (molekula): egy szakasz 2–5 fő nézete közti váltó az oldal tetején, középen, a cím fölött.
- **StageDialog** `reteg/StageDialog` — onOpenChange*:fn, open*:bool, title*, announce:string, closable:bool, closeLabel:string, fullscreen:bool · `.bc-stage` · organizmus · teljes képernyős bemutató-réteg (pl. sorsolás kivetítőn, eredményhirdetés).
- **TabCount** `reteg/Tabs` — n*:number · `.bc-sr` · Számláló-jelvény a fül feliratán
- **Tabs** `reteg/Tabs` — items*:TabItem[], label*:string, defaultValue:string, onValueChange:fn, value:string · `.bc-tabs-root` · molekula · panelváltó ugyanazon az oldalon.
- **Toaster** `reteg/Toaster` — label:string · `.bc-toaster` · molekula · egyszer az alkalmazás gyökerében.
- **TooltipIconButton** `reteg/Tooltip` — label*:string, danger:bool, side:'top'|'bottom'|'left'|'right', …attr · `.bc-tooltip` · atom · CSAK ikongomb feliratára.
- **TypeToConfirm** `reteg/TypeToConfirm` — confirmLabel*:string, onConfirm*:fn, onOpenChange*:fn, open*:bool, title*:string, cancelLabel:string, confirmIcon, count:number, errorText:fn, +6 · `.bc-stack` · organizmus · veszélyes tömeges vagy másokat érintő végleges törlés.

### 04 Média és speciális
- **Avatar** `media/Avatar` — name*:string, decorative:bool, shape:'circle'|'square', size, src:string | null · `.bc-avatar` · atom · kép, ha van és betölt; különben monogram.
- **CropDialog** `media/CropDialog` — crop*:UploadCrop, file*:File | null, onDone*:fn, onSkip*:fn, position:string · `.bc-error` · organizmus · a feltöltő vágó-ablaka.
- **FileImport** `media/FileImport` — help*, importFile*, label*:string, allowXls:bool, disabled:bool, maxSizeMB:number, template · `.bc-import` · organizmus · egy lépés – fájl kiválasztása (típus a tartalom szerint, méret) → feltöltés haladással → eredménylista (sor, oszlop, ok, teendő).
- **FilePicker** `media/FilePicker` — accept*, formatText*:string, help*, label*:string, maxSizeMB*:number, onChange*:fn, value*:File | null, acceptAttr:string, busy:bool, +6 · `.bc-dropzone` · molekula · EGY fájl kiválasztása – húzd-ide mező, a DS tartalom-alapú ellenőrzése (típus, méret), kiválasztás után fájlkártya (név,…
- **Gallery** `media/Gallery` — images*, altEditable:bool, altHelp, confirmDelete:fn, label:string, onChange:fn, onFileDrag, ordering:bool · `.bc-gallery` · organizmus · rács, borító, sorrend húzással és menüből, szerkeszthető alt, törlés, nagyító.
- **HeatScale** `media/MapLegend` — help*, title*:string, unit*:string, colorblind:bool, ends, howToRead, steps · `.bc-heat` · molekula · a hőtérkép skálája a data-seq tokenekből – cím, egység, súgó, két vég, „Hogyan olvasd?”, fokozatok táblázata.
- **ImageCropper** `media/ImageCropper` — onCrop*:fn, src*:string, aspectHelp, aspects, maxZoom:number, minOutputWidth:number, minZoom:number, zoomHelp · `.bc-cropper` · organizmus · a react-easy-crop DS-burokban.
- **ImageUploader** `media/ImageUploader` — help*, images*, label*:string, onChange*:fn, upload*, accept, altEditable:bool, altHelp, confirmDelete:fn, +9 · `.bc-upload` · organizmus · a galéria-rácsba épülő „+ Kép” csempe.
- **ImportResult** `media/ImportResult` — result*:ImportSummary, fileName:string, limit:number · `.bc-import-result` · organizmus · az import eredménye – összesítő + a hibás sorok listája (sor, oszlop, ok, teendő), másolható és letölthető.
- **Lightbox** `media/Lightbox` — images*, index*:number | null, onIndexChange*:fn, returnFocus:fn · `.bc-lightbox-scrim` · organizmus · nagyító sötét háttérrel.
- **MapLegend** `media/MapLegend` — items*, collapsible:bool, defaultOpen:bool, title:string · `.bc-map-legend-list`
- **MapPanel** `media/MapPanel` — label*:string, empty, error:string, height:string, legend, list:MapListItem[], listLabel:string, note, onRetry:fn, +6 · `.bc-map-panel` · organizmus · egységes térkép-keret a meglévő `.bc-map` Leaflet-öltözettel (bc-media-terkep.css).
- **MonthCalendar** `media/MonthCalendar` — events*, kindDefs*, error:string, hidden:readonly K[], initialDate:string, kinds:readonly K[], labels, loading:bool, maxPerDay:number, +4 · `.bc-mcal` · organizmus · havi rács hétfővel; a fajtát bal csík + szerepszín + jelmagyarázat mondja (nem csak a szín).
- **OpeningHoursEditor** `media/OpeningHoursEditor` — help*, onChange*:fn, value*:OpeningHours, disabled:bool, label:string, readOnly:bool · `.bc-hours` · organizmus · soronként egy nap – kapcsoló (nyitva/zárva), nyitás–zárás, „Hétfő másolása a hétköznapokra”.
- **Progress** `media/Stepper` — label*:string, max*:number, value*:number, valueText:string · `.bc-upbar` · Haladásjelző sáv (role="progressbar"); a szöveges állapotot (pl. „2,1/5 MB”) a hívó írja mellé.
- **Stepper** `media/Stepper` — label*:string, steps*, onSelect:fn · `.bc-steps` · molekula · lépésjelző – fájl → feltöltés → feldolgozás → kész.
- **VideoUpload** `media/VideoUpload` — help*, label*:string, upload*:UploadFn<void>, disabled:bool, maxSizeMB:number, onDone:fn, process:fn · `.bc-video` · organizmus · fájl → feltöltés → feldolgozás → kész.

### 05 Méhecske, mozgás, szöveg
- **Bee** `meh/Bee` — szerep*:'hazigazda'|'kalauz'|'futar'|…, buzz:bool, label:string, size:'s'|'m'|'l' · `.bc-bee` · atom · a meglévő márka-méhecskék szerep szerint.
- **BeeMoment** `meh/BeeMoment` — action, inline:bool, live:'status'|'alert', pillanat, poen:string, sima, szerep:'hazigazda'|'kalauz'|'futar'|…, valtozat:number · `.bc-moment` · molekula · méh + szóvicc-cím + sima mondat + egy teendő.
- **BeeSprite** `meh/BeeSprite` — szereplo*:SpriteSzereplo, label:string, replay:unknown, size:'s'|'m'|'l' · `.bc-sprite` · atom · a meglévő méhecske kódból animált mozgása.
- **HexLoader** `meh/motion` — label:string · `.bc-hexload` · Mézsejt-töltő: rövid töltéshez; 10 mp után megáll (a hívó ekkor írja ki a „toltes-hosszu” mondatot).
- **ProgressBar** `meh/motion` — label*:string, value*:number, moving:bool · `.bc-progress` · Csíkos haladásjelző (0–1).
- **Stagger** `meh/motion` — as:'div'|'ul'|'ol'|'tbody' · `.bc-stagger` · Stagger: a gyerekek egymás után úsznak be (30 ms késés, legfeljebb 6-ig).

### 06a Kiegészítők
- **AudienceBuilder** `kieg/AudienceBuilder` — fields*, onChange*:fn, value*:Audience, disabled:bool, estimate, help, label:string, maxRules:number, showErrors:bool · `.bc-aud` · organizmus · „ha … és/vagy …” szabálysorok (mező · feltétel · érték), élő létszám-becslés (a hívó adja), üres és hibás szabály jelzése,…
- **Clamp** `kieg/Clamp` — k*:string, label*:string, lines*:number, placeholder*:string, as:'p'|'h3'|'span', onCut:fn · `.bc-clamp` · atom · annyi sor, amennyi az appban elfér („…”-tal); a levágást MÉRI (nem karakterszámból becsüli), és jelenti a PreviewCard-nak…
- **CompareMerge** `kieg/CompareMerge` — choices*, fields*, onChoicesChange*:fn, onMerge*:fn, records*:MergeRecord[], consequence, onSurvivorChange:fn, survivor:string · `.bc-merge` · organizmus · rekordok egymás mellett, mezőnként rádiós választás, eltérések kiemelve (szöveggel is: „eltér”), javaslat a kitöltött…
- **CopyButton** `kieg/CopyButton` — value*:string, what*:string, disabled:bool, showValue:bool, variant:'button'|'icon' · `.bc-copy-tick` · atom · másol + „Másolva” pipa (05: mentve-pipa) + képernyőolvasó-bejelentés.
- **DownloadButton** `kieg/DownloadButton` — fileName*:string, label*:string, onDownload*:fn, disabled:bool, sizeHint:string, variant:'primary'|'secondary' · `.bc-copy-tick` · molekula · kész → készül (haladás, megszakítható) → letöltve (pipa, méret) → hiba (újra).
- **ErrorPage** `kieg/StatusPages` — action, errorId:string, homeHref:string, onRetry:fn, retrying:bool · `.bc-status-code` · ErrorPage: szerverhiba – a szomorú méh CSAK itt (a mi hibánk), újrapróbálás + másolható hibakód.
- **ForbiddenPage** `kieg/StatusPages` — action, homeHref:string, onRequestAccess:fn, requested:bool · `.bc-btn` · a gondolkodó méh (nem szid); kezdőlap + opcionális „Hozzáférés kérése”.
- **NotFoundPage** `kieg/StatusPages` — action, homeHref:string · `.bc-btn` · a kacsintó méh; kezdőlap + vissza az előző oldalra.
- **OfflineBanner** `kieg/OfflineBanner` — backMs:number, bee:bool, online:bool, onRetry:fn, pending:number, saveText · `.bc-offline` · molekula · az oldal tetejére tapadó sáv, ha nincs hálózat – „Nincs térerő a kaptárban.” (05 offline pillanat) + mi lesz a mentéssel.
- **OfflinePage** `kieg/StatusPages` — onRetry:fn, retrying:bool · OfflinePage: egész oldalas „nincs hálózat” (amikor semmi nem tölthető be); a gondolkodó méh.
- **PhoneField** `kieg/PhoneField` — help*, label*:string, onChange*:fn, value*:string, count, disabled:bool, error:string, kind:'barmely'|'mobil'|'vezetekes', notice:string, +2, …attr · `.bc-phone` · molekula · rögzített +36 előtag, gépelés közbeni magyar tagolás (30 123 4567), betű nem írható be (jelzi), beillesztésnél felismeri a +36…
- **PreviewCard** `kieg/PreviewCard` — variant*:'partner'|'kupon'|'ertesites'|…, aspect, caption:string, emptyImageText:string, imageUrl:string, notes:bool, view:PreviewView · `.bc-preview` · organizmus · élő előnézet telefonkeretben, az app (termékbőr) vonalában – partner, kupon, értesítés, edukáció vagy esemény; kártya vagy…
- **RangeSlider** `kieg/Slider` — help*, label*:string, max*:number, min*:number, onChange*:fn, value*, bigStep:number, count, disabled:bool, +9 · RangeSlider: két fogantyú (alsó és felső határ) – nem keresztezhetik egymást; minGap tartja a távolságot.
- **ReviewQueue** `kieg/ReviewQueue` — getId*:fn, getTitle*:fn, items*:readonly T[], onDecide*:fn, render*:fn, label:string, onUndo:fn, reasons · `.bc-review` · organizmus · egy elem nagyban, jóváhagy (J) / elutasít indokkal (E) / kihagy (K), haladás „12/40”, visszavonás.
- **SessionExpired** `kieg/StatusPages` — action, loginHref:string, onLogin:fn · `.bc-btn` · SessionExpired: a pihenő méh; „Belépés újra” – a hívó gondoskodik róla, hogy ugyanoda térjen vissza.
- **Slider** `kieg/Slider` — help*, label*:string, max*:number, min*:number, onChange*:fn, value*:number, bigStep:number, count, disabled:bool, +8 · atom · egy érték húzással, koppintással vagy billentyűvel (nyilak: lépés · PageUp/PageDown: nagy lépés · Home/End: határ).
- **StatusPage** `kieg/StatusPages` — kind*:StatusKind, action, extra, secondary, sima · `.bc-status-page` · sablon · közös váz – sima h1 · BeeMoment (05 pillanat) · teendők.
- **Timeline** `kieg/Timeline` — items*:ActivityItem[], empty, hasMore:bool, label:string, loadingMore:bool, now:Date, onLoadMore:fn, onRetry:fn, pageSize:number, +1 · `.bc-tl` · organizmus · ki · mit · mikor, napok szerint („Ma”, „Tegnap”, dátum), mezőszintű különbség (előtte → utána) lenyitva, „Még …” bővítés…
- **UnsavedChangesDialog** `kieg/UnsavedChanges` — onLeave*:fn, onStay*:fn, open*:bool, onSave:fn, title:string · `.bc-alert` · molekula · kíméletes kérdés, szóvicc nélkül.
- **UnsavedChangesGuard** `kieg/UnsavedChanges` — dirty*:bool, interceptLinks:bool, onSave:fn, text, title:string · molekula · tedd a szerkesztő oldalra – bezárás, frissítés és linkre kattintás előtt kérdez.

### 06b Hely, sorsolás, videó
- **AddressSearch** `kieg2/AddressSearch` — onPick*:fn, search*:fn, debounceMs:number, disabled:bool, help, label:string, minChars:number · `.bc-loc-search` · Címkereső a meglévő Combobox-szal (06b/13): gépelés → késleltetett, megszakítható keresés → lista → választás.
- **LocationPicker** `kieg2/LocationPicker` — help*, label*:string, onChange*:fn, value*:LatLng | null, decimals:number, defaultCenter:LatLng, disabled:bool, error:string, geolocation:bool, +6 · `.bc-loc` · organizmus · térkép-tű + címkereső + koordináta-mezők, egymást frissítik.
- **MiniMap** `kieg2/MiniMap` — point*:LatLng | null · `.bc-loc-mini` · Tartalék mini-térkép (06b/13): ha a projekt nem ad térképet (renderMap), ez mutatja, nagyjából hol a pont.
- **PrizeDrawReveal** `kieg2/PrizeDrawReveal` — participants*, prize*:string, draw:fn, excludePrevious:bool, loading:bool, minReasonLength:number, onDrawn:fn, onReroll:fn · `.bc-draw` · organizmus · résztvevők száma → „Sorsolás” → rövid felfedés (≤ 2,5 s, csökkentett mozgásnál azonnal) → nyertes Bajnok méhvel és…
- **VideoEmbed** `kieg2/VideoEmbed` — source*, title*:string · `.bc-video` · Beágyazott videó KATTINTÁSRA (06b/15, adatvédelem): kattintás előtt egyetlen kérés sem megy a YouTube/Vimeo felé (előnézeti…
- **VideoPlayer** `kieg2/VideoPlayer` — title*:string, captions, onError:fn, poster:string, src:string, warnNoCaptions:bool · `.bc-video` · organizmus · natív <video> a böngésző saját vezérlőivel + poszter, feliratsávok, billentyűk (Szóköz/K lejátszás–szünet, ←/→ 5 mp, M…
- **VideoPreview** `kieg2/VideoEmbed` — title*:string, url*:string, captions, poster:string · `.bc-video-empty` · egy beírt/beillesztett link előnézete – saját fájl → VideoPlayer, YouTube/Vimeo → kattintásra betöltő beágyazás, üres →…

### 06c Oldalsablonok
- **Dashboard** `sablon/Dashboard` — title*, actions, breadcrumbs:Crumb[], charts, chartsTitle:string, description, docTitle:string, docTitleSuffix:string, error:string, +12 · `.bc-sablon-toolbar` · sablon · oldalfej · időszak · mérföldkő-pillanat · StatTile-sor · ChartCard-rács.
- **DetailActions** `sablon/DetailActions` — actions*:DetailAction[], subject*:string · Az oldal műveletei a RowActions szabálya szerint, oldalfejbe méretezve: a fő művelet felirattal látszik, a többi a „⋯”…
- **DetailPage** `sablon/DetailPage` — title*, actions:DetailAction[], breadcrumbs:Crumb[], description, docTitle:string, docTitleSuffix:string, error:string, onRetry:fn, onTabChange:fn, +12 · `.bc-sablon-skel` · sablon · oldalfej műveletekkel · összegzés · fülek · oldalsó oszlop.
- **EditPage** `sablon/EditPage` — dirty*:bool, onSubmit*:fn, title*, breadcrumbs:Crumb[], cancelHref:string, cancelLabel:string, description, docTitle:string, docTitleSuffix:string, +18 · sablon · oldalfej · hibaösszesítő · szakaszok · ragadós gombsor (Mégse / Mentés) · előnézet-oszlop.
- **ErrorSummary** `sablon/ErrorSummary` — errors*:FormError[], form*, general:string, onJump:fn, …attr · `.bc-sablon-summary` · Hibaösszesítő (GOV.UK-minta): sikertelen beküldéskor az űrlap tetején, ide kerül a fókusz.
- **ListPage** `sablon/ListPage` — title*, actions, breadcrumbs:Crumb[], description, detail:ListDetail, docTitle:string, docTitleSuffix:string, emptyAction, emptyText:string, +13 · `.bc-sablon-state` · sablon · oldalfej + szűrősáv + táblázat/kártyák + állapotok + részletek-panel.
- **SablonFrame** `sablon/Frame` — kind*:'lista'|'reszletek'|'szerkeszto'|'iranyitopult', busy:bool, skipLabel:string, standalone:bool · `.bc-sablon` · A sablonok közös burka: konténer-lekérdezéses rács (a szélességét méri, nem a képernyőét – oldalsávval is jól tördel).
- **ShellAccount** `sablon/ShellAccount` — items*:MenuEntry[], name*:string | null, avatarSrc:string, detail, loadingLabel:string, menuLabel:fn · `.bc-muted` · molekula · a felhasználó az AppShell oldalsávjának alján – avatar, név, szerep, menü (kijelentkezés).

### 06d Út (szakasztérkép)
- **Utvonal** `ut/Utvonal` — cimke*:string, szakaszok*, cimSzint:2 | 3 | 4, hatarido, kovetkezo:UtvonalLepes, labels, renderLink:RenderLink, segito, tomor:bool · `.bc-btn` · organizmus · egy út szakaszai + EGY következő lépés, a segítővel és a határidővel.

### 06e Csapat-egészség
- **JelzoKartya** 🆕 `csapat/JelzoKartya` — cim*:string, ertek*:JelzoErtek, onValtozas*:fn, cimSzint:2 | 3 | 4, disabled:bool, hiba:string, irany:bool, kotelezo:bool, labels, +3 · `.bc-jelzo` · organizmus · egy terület szavazókártyája.
- **KerekRadar** 🆕 `csapat/KerekRadar` — cim*:string, sorozatok*, tengelyek*, jelzes:fn, kijelolt:string | null, labels, lista:bool, max:number, nezet:KerekNezet, +5 · `.bc-kerek-delta` · organizmus · interaktív radar 3–12 tengellyel, 1–2 egymásra vetített sorozattal (most vs.
- **RetroVaszon** 🆕 `csapat/RetroVaszon` — cetlik*, zonak*, cimSzint:2 | 3 | 4, csakOlvashato:bool, labels, maxHossz:number, moderator:bool, nagy:bool, onMozgat:fn, +4 · `.bc-retro` · organizmus · zónák cetlikkel (vitorlás, 4L, Start–Stop–Folytasd vagy saját).

### Téma
- **ThemeProvider** `tema/ThemeProvider` — defaultMode:ThemeMode, storageKey:string · sablon · a téma egy helyen él; a <html> data-theme / .dark jelzőit írja, a választást az eszköz megjegyzi, és más fülön történt váltást…
- **ThemeToggle** `tema/ThemeToggle` — labels, variant:'icon'|'segmented' · Téma-váltó (atom/molekula, Javaslat 09) – ThemeProvider alatt
- Piktogramok: `IcAuto` `IcMoon` `IcSun`

### Márka
- **Logo** `marka/Logo` — label:string, size:'s'|'m'|'l' · `.bc-logo` · atom · a beeco logó, amely a témával magától vált – sötét módban a fekete „be” és a csápok krémszínűek (logo-sotet.webp), a méh marad.

## Hookok, segédek, állandók

- **Hookok:** `useCommandHotkey` `useCountUp` `useDetailParam` `useDraft` `useFieldContext` `useGeolocation` `useLayerClose` `useListState` `useOnline` `usePageTitle` `usePrintFrame` `useQueryParam` `useReducedMotion` `useShellNav` `useTemplateTitle` `useTheme` `useUnsavedChanges`
- **Segédfüggvények:** `accuracyText` `applyTheme` `audienceProblems` `celebrate` `checkFiles` `cimkeIgazitas` `cimkeTordeles` `clampPage` `clusterHtml` `clusterIcon` `clusterTier` `commandHotkeyLabel` `copyText` `createColumnHelper` `cropToFile` `cryptoIndex` `cx` `describeAudience` `emptyWeek` `eventsByDay` `evszak` `fileKey` `fileSizeText` `formatBytes` `formatHu` `formatHuDate` `formatHuPhone` `formatLatLng` `formatNational` `formatNumberHu` `groupByDay` `hataridoSzoveg` `heatGradient` `inHungary` `initials` `isThemeMode` `issuesToCsv` `kindLabel` `kindTone` `lengthRange` `listStatus` `localToUtcIso` `looksSwapped` `markerHtml` `matchText` `mbText` `mergedValues` `newRule` `niceTicks` `parseHu` `parseHuDate` `parsePhone` `parseTime` `parseVideoUrl` `phoneInfo` `radarPoligon` `radarPont` `readThemeMode` `resolveTheme` `roundLatLng` `say` `scheduleIssues` `shake` `sizePair` `sniffType` `stepsFrom` `tengelySzog` `themeInitScript` `toE164` `todayIso` `typeNames` `utcToLocal` `validLatLng` `validateHours` `writeThemeMode`
- **Állandók:** `APP_SHELL_LABELS_HU` `CAL_KINDS` `COMMAND_PALETTE_LABELS_HU` `HU_BOUNDS` `HU_CENTER` `IRANY_IKON` `JELZES_IKON` `JELZO_KARTYA_LABELS_HU` `JELZO_SZOVEG_MEZOK_HU` `KEREK_RADAR_LABELS_HU` `KIND_LABEL` `LAT_RANGE` `LNG_RANGE` `MARKER_ICON` `MARKER_ICON_SELECTED` `RETRO_KERETEK` `RETRO_VASZON_LABELS_HU` `REVEAL_STEPS` `REVEAL_TOTAL_MS` `THEME_LABELS_HU` `THEME_STORAGE_KEY` `UTVONAL_LABELS_HU` `VIDEO_URL_MSG` `WEEK` `notify` `pillanatok` `szerepek`
- **Típusok:** 233 db (`<Komponens>Props`, `…Labels` stb.) – a `dist/react/index.d.ts` adja; nem kell megnyitni.

## CSS-elemek (`termek/css/<fájl>`; React nélkül is: SCSS/Tailwind/HTML-proto/Webflow)

Fájlonként a `bc-` gyökérosztályok (a `bc-x-…` alosztályok a gyökér alatt). **°** = CSS-only: nincs React-párja.

- `bc-adat.css`: `bc-ax-t` `bc-ax-title` `bc-badge` `bc-break` `bc-btn` `bc-card-title` `bc-chart` `bc-disclosure` `bc-dt` `bc-empty` `bc-end-label` `bc-fb` `bc-filter` `bc-gap` `bc-grid` `bc-heatkey` `bc-help-btn` `bc-info` `bc-kpi` `bc-legend` `bc-line` `bc-mark` `bc-note` `bc-notice` `bc-pager-gap` `bc-pager-info` `bc-pager-num` `bc-pager-pages` `bc-pager-size` `bc-pal-allapot` `bc-q1`° `bc-q2`° `bc-q3`° `bc-q4`° `bc-q5`° `bc-s1` `bc-s2`° `bc-s3`° `bc-s4`° `bc-s5`° +18
- `bc-base.css`: `bc-display`° `bc-muted` `bc-num` `bc-row` `bc-small`° `bc-sr` `bc-stack`
- `bc-controls.css`: `bc-btn` `bc-icon-btn` `bc-seg-item`
- `bc-csapat.css`: `bc-btn` `bc-jelzo` `bc-kerek` `bc-retro` `bc-select` `bc-table`
- `bc-data.css`: `bc-pager` `bc-sort` `bc-stat` `bc-stats` `bc-table`
- `bc-feedback.css`: `bc-alert` `bc-badge` `bc-empty` `bc-skeleton` `bc-spinner` `bc-status` `bc-toast`
- `bc-field.css`: `bc-count` `bc-help-btn` `bc-icon-btn` `bc-input` `bc-label` `bc-meta` `bc-notice` `bc-pop` `bc-search` `bc-seg` `bc-tag` `bc-tagcloud`
- `bc-forms.css`: `bc-affix` `bc-check` `bc-checkbox` `bc-draft` `bc-dt-check` `bc-error` `bc-field` `bc-fieldset` `bc-form-actions` `bc-form-grid` `bc-help` `bc-input` `bc-label` `bc-schedule` `bc-select` `bc-switch` `bc-textarea`
- `bc-kieg.css`: `bc-alert` `bc-aud` `bc-badge` `bc-btn` `bc-clamp` `bc-copy` `bc-count` `bc-download` `bc-field` `bc-icon-btn` `bc-input` `bc-kbd` `bc-kdialog` `bc-merge` `bc-modal-body` `bc-moment` `bc-offline` `bc-phone` `bc-preview` `bc-progress` `bc-pv-badge` `bc-pv-body` `bc-pv-btn` `bc-pv-caption` `bc-pv-card` `bc-pv-discount` `bc-pv-featured` `bc-pv-full` `bc-pv-img` `bc-pv-media` `bc-pv-meta` `bc-pv-notch` `bc-pv-notes` `bc-pv-phone` `bc-pv-rows` `bc-pv-screen` `bc-pv-tags` `bc-pv-text` `bc-pv-title` `bc-review` +6
- `bc-kieg2.css`: `bc-draw` `bc-loc` `bc-map` `bc-vembed` `bc-video`
- `bc-marka.css`: `bc-honeycomb` `bc-logo`
- `bc-media-terkep.css`: `bc-alert` `bc-avatar` `bc-btn` `bc-error` `bc-filecard` `bc-heat` `bc-hours-closed` `bc-hours-day` `bc-hours-list` `bc-hours-row` `bc-hours-time` `bc-hours-times` `bc-input` `bc-map` `bc-mcal` `bc-spinner`
- `bc-media.css`: `bc-alt-thumb` `bc-cropper` `bc-dropzone` `bc-filecard` `bc-gallery-empty` `bc-gallery-grid` `bc-gmenu` `bc-icon-btn` `bc-import` `bc-lightbox` `bc-range` `bc-sr` `bc-steps` `bc-tile` `bc-upbar` `bc-upload` `bc-video`
- `bc-meh-sprite.css`: `bc-sprite`
- `bc-meh.css`: `bc-bee` `bc-moment`
- `bc-motion.css`: `bc-anim-cheer`° `bc-anim-rise` `bc-anim-shake` `bc-anim-stamp` `bc-anim-tick` `bc-attention`° `bc-dragging`° `bc-hexload` `bc-hexpiece` `bc-lift`° `bc-progress` `bc-stagger` `bc-tab-ink`°
- `bc-picker.css`: `bc-cal` `bc-chip` `bc-ck` `bc-combo` `bc-date` `bc-day` `bc-icon-btn` `bc-input` `bc-list-note` `bc-listbox` `bc-option` `bc-time`
- `bc-reteg.css`: `bc-acc` `bc-alert` `bc-card` `bc-cmdk` `bc-crumb` `bc-crumbs` `bc-drawer` `bc-icon-btn` `bc-layer-desc` `bc-layer-titles` `bc-menu` `bc-modal` `bc-nav-head` `bc-nav-icon` `bc-nav-list` `bc-nav-text` `bc-page-head` `bc-row` `bc-scrim` `bc-search` `bc-secsw` `bc-sidebar` `bc-skip` `bc-spinner` `bc-stack` `bc-stage` `bc-tab` `bc-tabs` `bc-title-skeleton` `bc-toast` `bc-toaster` `bc-tooltip` `bc-topbar-end` `bc-topbar-thin`
- `bc-sablon.css`: `bc-btn` `bc-card` `bc-content` `bc-field` `bc-form-actions` `bc-help-btn` `bc-main` `bc-moment` `bc-page-header` `bc-print-hide` `bc-print-page` `bc-print-show` `bc-row` `bc-sablon` `bc-search` `bc-seg` `bc-shell` `bc-sidebar` `bc-skeleton` `bc-skip` `bc-stat` `bc-stats` `bc-switch` `bc-toaster` `bc-topbar`
- `bc-shell.css`: `bc-account` `bc-brand` `bc-content` `bc-main` `bc-nav-group` `bc-nav-icon` `bc-nav-link` `bc-nav-list` `bc-nav-text` `bc-shell` `bc-sidebar` `bc-topbar`
- `bc-surfaces.css`: `bc-card` `bc-divided` `bc-divider`° `bc-lift`° `bc-modal` `bc-page-header` `bc-row` `bc-scrim` `bc-section-title`° `bc-tab` `bc-tabs`
- `bc-utvonal.css`: `bc-badge` `bc-btn` `bc-steps` `bc-ut`
- `bc-web.css`: `bc-bee` `bc-body`° `bc-card` `bc-display`° `bc-eyebrow`° `bc-figure`° `bc-grid-2`° `bc-grid-3`° `bc-hero`° `bc-howto` `bc-lead`° `bc-link`° `bc-logos`° `bc-panel`° `bc-price`° `bc-quote`° `bc-rating`° `bc-ruled`° `bc-sec`° `bc-source`° `bc-sticker`° `bc-store`° `bc-stores`° `bc-subtitle`° `bc-title`° `bc-web-erkezes`° `bc-web-in`° `bc-web-zum`° `bc-wrap`°
- Módosítók: `is-*` (pl. `is-ghost`, `is-danger`, `is-flat`, `is-icon`); a teljes lista: `api/api.json` → `css.is`.

## Játékbőr (webjátékok)

- Nem ez a skill: töltsd be a `beeco-arculat`-ot. Közös fájlok a `tools/kit-sync.js`-sel (`KIT-FILES.json`); globális nevek (`DS`, `pic`, `ART`, `MODEL`…) és `ds-` osztályok: `api/api.json` → `jatekJs`, `css.jatek`.

*149 komponens · 3 új · 17 hook. A verzió: `VERSION` (szándékosan nincs itt, hogy a verzióemelés ne írja át).*
