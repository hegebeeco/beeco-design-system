# beeco.hu főoldal – Szuperhős méhecske (fs-)

Webflow-oldal: **Főoldal Szuperhős (draft)** (`/fooldal-szuperhos-draft`, page `6acd904f7d7e4ee067608742`).

## Felépítés (Designer-barát, mint a CsicsergŐsz)
- **Natív Webflow-elemek:** minden szöveg, kép, kártya, logó és GYIK-elem a Designerben szerkeszthető.
  A jelölés forrása: `webflow-jeloles.py` (szekciónként egy gyökérelem, `fs-` osztályokkal).
- **CSS:** az oldal tetején lévő HTML Embed-ekben (`embed/fs-N.min.css`). Forrás: `fs-alap.css` (a prototípusból
  átírva), `fs-ikonok.css` (maszkos piktogramok), `fs-extra.css` (Webflow-kiegészítés). Minden szabály a `.fs-oldal`
  burkolón belül érvényes, így a site többi oldalát nem érinti.
- **JS:** `fs.js` a jsDelivr-ről, commit-SHA-ra rögzítve, az oldal láblécében. Ez adja a méhecskét (hivatalos rig),
  a lábnyom-útvonalat, a funkcióválasztót, a lábnyom-vásznat, a „Kinek szól?” kvízt, az okos boltgombot,
  a ragadós mobilsávot, a sötét/világos kapcsolót és a mérést (`dataLayer`, `beeco_*` események).
  A teszt-domainen (webflow.io) egy „Mérés” gomb mutatja az eseményeket.

## Szerkesztés a Designerben
- A hero funkciói (`fs-funk`) és az app-képek (`fs-app-kep`) **sorrendje összetartozik** (Lábnyom, Térkép, Kuponok,
  Tudás, Programok, Nektár). A felirat szövege a funkción belüli rejtett `fs-funk-cim` / `fs-funk-szoveg` elemben van.
- A „Kinek szól?” három gombjának sorrendje: magánszemély, polgármester, vállalkozás. A kvíz szövegei a `fs.src.js`-ben.

## Építés
`node build.mjs` → `fs.css`, `embed/*.min.css`, `fs.js`. Embed-frissítés: `data_element_settings_tool` `set_settings`, kulcs `code`.

## 2. kör (2026-10-13)
- **CSS:** az új szabályok az `fs-extra-2.css`-ben vannak → `embed/fs-4.min.css` (4. HTML Embed az oldal tetején). Az 1–3. embed változatlan, így egy új kiegészítéshez csak a 4. embedet kell frissíteni.
- **Piktogramok:** `piko/*.svg` (kézzel rajzolt: matrica-család fekete-fehér, sárga család fekete-sárga), a Webflow-médiatárban `fs-piko-*.svg` néven; natív Image elemek (`fs-piko`), a Designerben cserélhetők.
- **Zöld 2050 háttér:** `kep/fs-zold-2050.svg` (médiatár: `fs-zold-2050.svg`), a hero első gyermeke (`fs-hero-taj`). Szélkerék, felhő, fa mozog benne; csökkentett mozgásnál áll.
- **Vélemények:** 7 valódi, 5 csillagos App Store-értékelés (RSS, 2026-10-13). Végtelen sáv: a JS duplikálja (a másolatok `inert` + `aria-hidden`), szüneteltető gomb mellette.
- **Közösség:** 4 fotó a médiatárból (polaroid), 4 nagy szám (felpörög, ha látszik). A 15 önkormányzat és a 12 partner a meglévő tartalomból jön – változáskor a szöveget kell átírni.
- **beebolt:** saját szekció (`#beebolt`). **beecopedia:** egyelőre lekerült az oldalról; visszatenni: `python3 webflow-jeloles.py pedia` → a `pedia` szekció HTML-je a `wf_szekciok.json`-ban.
- `lista.tsv`: a sajtó- és partnerlogók linkjei és képei (generátor-bemenet).

## 6. kör (2026-10-14)
- A Designerben közvetlenül módosítva (eredeti DOWNLOAD_BLOCK a hero-ban és a záróban, értékelés-linkek, 8 közösségi adat, chipek ki, beebolt-jel). **A `webflow-jeloles.py` ettől a körtől nem tükrözi a Designert**: új szekció-generáláskor előbb vissza kell vezetni ezeket.
- CSS: `fs-extra-3.css` → 5. embed. JS: jobb sávon lábnyom-jel (`fs-sin-jel`), kézi véleménysor (`fs-kezi`), a záró leszállási célja a `.footer_download` is.
- Fejléc-kód: `../kozos/horgony.js` (horgonygombok előzmény nélkül).

## 7. kör (2026-10-30)
- **Sötét mód kapcsoló kivéve** (Kristóf döntése): a `fs.src.js` már nem hoz létre kapcsolót, az oldal mindig világos; a régi mentett `beeco-tema` érték törlődik. A `tema_valtas` mérési esemény megszűnt.
- **4. embed** (`fs-extra-4.css`, kézzel, nincs a build-ben): QR-magasság a két letöltő gombbal egyenlő (a megosztott DOWNLOAD_BLOCK komponens belseje csak itt írható felül, így nem érinti a többi oldalt), `@keyframes` a legörgetés-jelzőhöz.
- **Hero és szekciók átépítve a Designerben (natív, bc- változókra kötve):** a funkció-pontok a telefon alatti sorba kerültek, a felirat-buborék és a „Nézz bele az appba” sor kikerült, a vélemények a hero aljára költöztek (értékelés-szám nélkül), a banner sárga, új `fs-utazas` (az app útja, 8 lépés), a „Közösség ereje” számai a Közösség szekció elejére kerültek, a Rólunk szekció „A beeco szorgos raja: csapatunk” lett (Miben hiszünk, Miért dolgozunk, Víziónk: `docs-site/brand/marka-pozicio.json` hivatalos szövegei). **A `webflow-jeloles.py` ezt nem tükrözi**: a Designer az igazság.
- **„Zöld jövő” lépték-szekció (`fs-lepcso`, #lepcso, 2026-10-30):** az „Az app útja” után. Ha 10 / 10 ezer / 10 millió ember cselekszik: szaggatott út, 3 állomás + „Most itt tartunk” jelölő a valódi eredménnyel (2026 vízadás záró közlemény: 2.200+ önkéntes, 7.500+ fa, 1.000.000+ liter), alatta „Az emberiség már megcsinálta” (ózonréteg: ENSZ Hírek 2023-01-09; ólmozott benzin: UNEP 2021-08-30). A pontsűrűség `radial-gradient(currentcolor…)` a `fs-lp-pont` osztályokon (a stílus-eszköz a `var(...)`-t változóra írja át, ezért `currentcolor` + `color` változó). Az állomások belépő-animációja natív IX3 (`i-7de96ecc`, csökkentett mozgásnál a végállapotra ugrik; a tartalom nyugalmi állapotban is látszik). Az út maga `::before` a listán: reszponzív (asztalon vízszintes, ≤ 991 px nincs, ≤ 767 px függőleges).

## 8. kör (2026-10-30, Kristóf visszajelzése)
- **QR:** a hero QR-kódja újra az eredeti DOWNLOAD_BLOCK méretében van (a 4. embedből kikerült a felülírás).
- **Rólunk:** a „Miben hiszünk / Miért dolgozunk / Víziónk” három kompakt blokk egymás mellett (`fs-h-wrap` rács). A „Miben hiszünk” kártyán csak a három érték neve áll (Közösség, Edukáció, Hitelesség és őszinteség); a hosszabb leírások a Brand Bookban vannak.
- **Elválasztó:** a Miért a beeco?, Az app útja és Zöld jövő szekció alján egységes lágy domb (`::after`, a következő szekció színe).
- **Az app útja:** váltakozó bal/jobb sorok (`fs-u-lepes` + `fs-u-bal`/`fs-u-jobb`), nagy app-képernyők, a szaggatott út görgetésre kitelik (`fs-u-ut`, IX3 `i-85187df0`), a sorok oldalról csúsznak be (`i-a2f6016c`, `i-5f5cd454`). Nektár-jelzés egyelőre nincs.

## 9. kör (2026-11-02, Kristóf visszajelzése, élesítés előtt)
- **Hero:** a telefon kisebb (`fs-app-kepek` 320 px, mobilon 260 px), a 6 funkció körülötte: 3 bal, 3 jobb oszlop (natív rács: `fs-kaptar-szin` `auto | 1fr | auto`, a `fs-funk.fs-f-1…6` kombók rácshelye). A kiválasztott funkciónál kis nyíl mutat a telefonra (`::after` a 4. embedben, mert a JS `aria-pressed` állapotától függ). A régi vízszintes szaggatott vonal kikerült.
- **Az app útja:** a sorok natív 3 oszlopos rácsban (`minmax(0,1fr) 56px minmax(0,1fr)`), így a számkör mindig a vonal közepén van; a jobb oldali sorok `direction: rtl` (a gyerekek `ltr`). A régi IX3-beúszások (`i-a2f6016c`, `i-5f5cd454`, `i-85187df0`) törölve: ezek láthatatlanná tették a sorokat. Az út végén a letöltés-blokk keret és háttér nélkül, Ranglista-képernyővel (`fs-u-zaro`, `fs-u-zaro-kep`).
- **Együtt sokat tehetünk:** a 10 / 10 ezer / 10 millió csempék, a „Most itt tartunk” jelölő és „Az emberiség már megcsinálta” panel kikerült (IX3 `i-7de96ecc` törölve); helyükre a „A közösség ereje számokban” blokk került (a `fo-ereje` sötét táblán, a piktogramok világos körben).
- **Rólunk:** a három csempe egy stílus (`fs-h-miert`, világos sárga), mindegyikben címke + egy hivatalos mondat (Brand Book, `marka-pozicio.json`).
- **Kinek szól?:** kvíz kivezetve; 3 egyszerű csempe-link: Magánszemély → `#letoltes`, Önkormányzat → Önkormányzatoknak oldal, Vállalkozás → Cégeknek és településeknek (hub). Webflow-oldallinkek, így slugcsere után is jók. A kvíz-JS nem fut, mert a `.fs-kviz-test` hiányzik.
- **Natív stílusok:** az 1–3. CSS-embed kigyomlálva (≈ 39 000 → ≈ 17 600 karakter): csak a JS-állapotokhoz (aria-pressed, `.fs-lat`, `.fs-huz`, forgó szöveg), a JS által épített elemekhez (méh, oldalsáv, ragadós sáv, napló) és a tokenekhez tartozó szabályok maradtak. Ellenőrzés: a régi és az új CSS-sel minden elem számított stílusa azonos (1440/390/320 px, 5 görgetési helyzet). A Webflow-ban élő változat: `embed/elo/embed-1…3.css` (a `build.mjs` régi kimenete már nem egyezik vele; a Designer + `embed/elo` az igazság).
- **Minőségkapu-javítások (független Opus-ellenőrzés után):** tableten (≤ 991 px) a hero egymás alá kerül, hogy a telefon és a 6 ikon elférjen; mobilon a hero jobb margója 16 px; a „Kinek szól?” csempéken 3 px-es fókuszkeret; a csapatfotó-csúszka billentyűzettel elérhető (`tabindex`, `role=region`); a mobilos ikonfeliratok 12 px; a Rólunk-csempék alatt nagyobb térköz; az út végén Kaptárnaptár-képernyő (ne ismétlődjön a 7. lépés képe) és új szöveg; „ökopéldakép”; a 360 px alatti ragadós sáv egy sorban. Közös **DOWNLOAD_BLOCK** komponens (32 helyen): a bolt-linkek `rel="noopener"`, min. 44 px magasak. SEO-cím 55 karakter, `og:image` az élő főoldaléval azonos.
- **10. kör (2026-11-02 délután, Kristóf):** a hero telefonja mögül kikerült a sárga lap (`fs-app-kepek::before`) és a szaggatott hurok, a két oszlop között 80 px; a jobb oldali lábnyom-navigáció rejtve (`visibility`, mert a JS a méretét használja), így a burkok jobb oldali 124 px-es helye is 32 px lett. Elválasztó: mindenhol csak egy natív `::after` domb a következő szekció színében (a JS-dombok és a tépett élek rejtve). A 8. lépés („Hatással vagy…”) mellé a hősméh-raj rajz került (`fs-meh-raj.png`, katalógus: `bee-superhero-group`). „A közösség ereje számokban” sötét tábla nélkül, tinta-színnel. Javítva: a Közösség-fotók tableten/mobilon két oszlopban folynak (korábban egymásra csúsztak).
- **11. kör (2026-11-02 este, Kristóf: „mehet az 1–7, és a DS-ben is”):** egyféle szalagcím (`fs-szalag`, sötét háttéren `fs-szalag-mez`; az `fs-u-jel`, `fs-lp-jel`, `fs-bolt-jel` erre váltott, a forgó kérdés `fs-forgo-elem` is tinta; a GYIK és a beebolt ikonja rejtve; a Rólunk-csempék címe sima `bc-fs-l` cím). Szekciócím mindenhol `cim-l` (`fs-cim2` alapon, a combók méretei törölve), bevezető `szoveg-l`, kártyaszöveg `szoveg-m`; a Közösség-cím egy mondat (`fs-halk` normál). A 3 idézetmatrica törölve, az út végén nincs QR. Az „Írtak rólunk” sáv alá került a Szakmai partnerek sor és az „Ők már használják” vélemények (a hero egy képernyő). Minden kártya: `bc-r-l`/`bc-r-s` sarok, 4 px árnyék. A „Kinek szól?” sötétzöld (`bc-surface-deep`), sárga címkével, fehér csempékkel, sárga fókuszkerettel. A Web DS-ben ugyanez: lásd `docs/web-ds.md` 7. pont.
- **12. kör (2026-11-02 este, Kristóf):** a méhecske görgetés közben végigrepüli a „Miért a beeco?” kártyáit (a sarkukon ül) és az App útja 8 lépését (asztalon a számkör mellett a kép felőli oldalon, mobilon a kártya tetején), kellékekkel: 1 telefon, 2 számológép, 3 felvillanó villanykörte, 4 térképész sapka, 5 kuponok, 6 két barát-méh csatlakozik, 7 egyikük serleget kap (ugranak), 8 balra érkeznek, buborék: „Ez te is lehetsz, a barátaiddal!”. A kellékek a rig gyökércsontjában (`KELLEKEK`, `Meh.kellek()`), így együtt lebegnek a méhvel; a lépés kiválasztása a nézet 45%-os vonalához legközelebbi sor (`kalandCel()`). Csökkentett mozgásnál a méhek a helyükre ugranak, a villanykörte nem villog. A beebolt, a GYIK és a Rólunk alján 120 px hely a következő lap dombja (56 px) alatt. Új CSS a 4. embedben (`fs-buborek`, `fs-kv-feny`). Figyelem: a `build.mjs` az `embed/` mappát újraírja, utána `git checkout -- embed/elo`.
- **13. kör (2026-11-02 este, élesítés előtti audit):** a mérési események gtag-gel is a GA4-be mennek (GTM nincs az oldalon, a dataLayer magától nem jut el). Az ajánlatkérő űrlap kiegészítése közös szkript lett: `weboldal/kozos/ajanlatkeres.js` (webhely-szintű regisztrált szkript `beecoAjanlatkeres`, jsDelivr commitra rögzítve, SRI-vel): sikeres küldéskor `generate_lead`, rejtett mezők (forras_oldal, hivatkozo, utm_*), a termék előválasztása az oldal alapján. Új verziónál: commit, jsDelivr-URL + sha384 → `update_registered_script`. A főoldal „Nyolc szakcsapat” → „Kilenc raj” (Kristóf: 23 ember, 9 raj); az EN gomb kikapcsolva, amíg nincs angol oldal; forrás nélküli felsőfokú állítások tompítva.
- **14. kör (2026-11-02 késő délután, Kristóf: „egységesíts”, „javítsd a technikai feladatokat”):** a főoldal a DS-mércét követi (`fs-extra-4.css`): gombsarok 14/4 px, 3 px kemény árnyék, szürke lead (a sötét `fs-raj` kivételével), a hero-cím a DS cím-l lépcsőjén 48 px (64 px-en a háromhasábos heróban 4 sorra törne, és a letöltőgombok a hajtás alá csúsznának); a hero QR- és app-képei méretarányt kapnak (CLS). Az abszolút `www.beeco.hu`-linkek oldallinkek, a partnerlogók a végleges `/online-okoiranytu/…` címre mutatnak, a „csapat” gomb a Csatlakozz-hubra. Szerkezett adat: Organization + WebSite + FAQPage. Közös, az egész webhelyen futó szkript: `kozos/akadalymentes.js` (ugrás a tartalomra, billentyűzetes régi GYIK, sötét fókuszgyűrű); a régi oldalak DS-bőre: `kozos/regi-oldalak-ds.css` (/gyik, /letoltes, /kapcsolat, /beebolt, webshop-sablonok, oldal-fejkódból, commit-SHA-ra rögzítve). A teszt-domainen látszó „Mérés: N esemény” gomb szándékos (`naploKell`), élesen nem jelenik meg.

## 15. kör (2026-11-02 este): + ÁFA, teljesítmény- és képernyőteszt
- Minden B2B-ár „… Ft + ÁFA-tól” (Kristóf döntése); a JSON-LD `priceSpecification.valueAddedTaxIncluded: false`.
- Teljesítmény (26 oldal, saját Playwright-mérés: mobil 4× CPU + ~1,6 Mbit/s, 150 ms; asztal fojtás nélkül; hideg gyorsítótár, egy futás):
  a 15 új oldal hero-képe `loading="eager" fetchpriority="high"` lett (egyedi attribútum) → mobil LCP 7–9,6 s → 2,9–5,3 s (Locsolóraj 6,8 s).
  /gyik, /kapcsolat: a hajtás feletti beúszó blokk azonnal látszik (`kozos/regi-oldalak-ds.css`) → mobil LCP ~10,5 s → 2,7–2,9 s.
  /letoltes: a telefonkép doboza mobilon teljes szélességű → CLS 0,31 → 0.
- Képernyőteszt (ui_audit, 390/320/1440): a beebolt kosárgombja telefonon rácsúszott a vissza linkre (a DS-gombméret miatt) → tömörebb gomb ≤479 px;
  Partner „Belépő” grafikonfelirat `ds-tinta` (3,82 → AA).
- Maradt (nem a mi kódunk / döntés kell): Stripe (260 KB) minden oldalon a Webflow-webshop miatt; /letoltes és /beebolt mobil LCP 8–11 s (komponensbeli lusta kép, nagy PNG-k);
  /kuponok régi stílusú (kontraszt, billentyűzet, 40 px-es gombok) – nincs DS-bőrön.
