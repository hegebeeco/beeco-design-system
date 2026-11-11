# Javaslat 28 – Egy grafikai forrás, sok kimenet (méhek, madarak, matricák, ikonok, jelek)

*Állapot: **jóváhagyva: A változat (minden a publikus DS-ben)**, Kristóf, 2026-10-26 – részletek a 8. pontban · készítette: Claude (mobil munkamenet, Kristóf kérésére) · dátum: 2026-10-26*
*(A leltár – 246 páros sor, a 619 kódmatrica listája, a weboldal 1659 képe és a méhpárosítás képei – a mobil munkamappában készült,
nem publikus helyen: `beeco_MOBILE_APP/artifacts/ds-grafika/`. A repóba ebből a katalógus került: [`grafika/katalogus.json`](../../grafika/katalogus.json),
leírása: [`grafika/README.md`](../../grafika/README.md), őre: `tests/check-grafika.js`.)*

## 1. Igény

- **Hol kell:** az app (Flutter), a social media (infografika-generátor), a webjátékok, a weboldal (Webflow és a DS-ből jsDelivr-en át betöltött kampányoldalak), a Figma `APP_PROD`.
- **Mit old meg (egy mondat):** egy méh, madár vagy jel egyszer van megrajzolva és egyszer van elnevezve, és minden felület ugyanabból a forrásból kapja a neki való formátumot.
- **Mit használnak ma helyette:**
  - DS: `web/assets/brand/` (24 méh), `dist/meh/` (6 animált méh), `brandbook/illusztraciok/`, `weboldal/kampany-*/illusztracio/`, `web/js/art/` (619 kódmatrica), `termek/ikonok/` (55);
  - Flutter-DS: `assets/illustrations/` (83, WebP 1/2/3x), `icons/` (55), `stickers/` (34);
  - app: `assets/images/**` (874 kép, PNG 1/2/3x);
  - Madárgyár: `bird-catalog/madargyar` (51 faj, backendre exportálva);
  - weboldal: Webflow CDN (~108 kép, beszédes név nélkül).

  Ugyanaz a méh 3–5 másolatban él, öt névrendszerrel (`simple` / `bee-happy` / `hazigazda` / `SIMPLE` / „Vidám”).

## 2. Mire épül (meglévő anyagok)

- **A token-csővezeték mintája:** `tokens/*.json` → `tools/tokens-build.js` → `dist/` (CSS, Tailwind, Dart). A grafika ugyanígy működne: egy forrás és egy katalógus, generátorok, `--check` őr a `npm test`-ben.
- **Az ikon-minta, ami már működik:** `termek/ikonok/*.svg` + `ikonok.json`, és ebből készül a React `Ic*`. A Flutter-DS `icons/` bájtra egyezik vele, a `tests/check-ikonok.js` és a `tool/compare_icons.dart` őrzi.
- **Meglévő metaadat, amit a katalógus átvesz:**
  - `web/js/art/*` (`ART.add`: `hu`, `en`, `emoji`, `lib`);
  - `tokens/hangnem.json` (`szerepek`: szerep → kép, `tiltott_kepek`);
  - `brandbook/illusztraciok/keszlet.json`;
  - Flutter-DS `illustrations/manifest.json` (név, csoport, forrás, aliasok) és `stickers/manifest.json` (Figma-node);
  - az app `ProfilePictureType` (backend enum);
  - infografika `src/figures.js`.
- **Meglévő generátorok:**
  - `tools/art-png.js` (PNG 512);
  - `tools/art-prompts.js` + `tools/art-import.py` (MI-kép csatorna, `web/data/art-override.json`);
  - `tools/meh-sprite/gyart.py` (sprite + Lottie);
  - `tools/meh-szerepek/` (szerepes méh);
  - Flutter-DS `tool/import_illustrations.py`, `gen_illustrations.dart`, `gen_stickers.dart`;
  - Madárgyár `gen_all.js` / backend-ZIP, `pack_flutter.py`;
  - az infografika `scripts/build.mjs`, ami beágyaz, nem másol.
- **Szint:** rendszerszintű szabály és csővezeték (nem komponens). Új rajzot nem kér: a Flutter-DS döntése (2026-10-19) szerint „előbb a Figma”.

## 3. Változatok – hol éljen a mester

| | A – minden a publikus DS-ben | **B – privát mester-repó + publikus kimenet** | C – a Figma a mester |
|---|---|---|---|
| Kép | `beeco-design-system/grafika/` (eredeti + katalógus) → `dist/grafika/` | `hegebeeco/beeco-grafika` (privát: eredeti rajzok + `katalogus.json`) → generált kimenet a publikus DS-be (csak webméret és kódrajz), a privát Flutter-DS-be (teljes app-készlet), a Figmába, a Webflow-ba | `APP_PROD` / „Grafika” oldal; export-szkript húzza a repókba |
| Előny | egy repó, a tokenekkel azonos hely; a jsDelivr és a Webflow közvetlenül eléri | az eredeti, nagy felbontású rajz nem nyilvános (a méhek belső használatúak); a publikus DS a mai állapothoz képest nem kap többet; a token-mintát követi | a tervezők ott dolgoznak; Kristóf szabálya: előbb a Figma |
| Hátrány | a nagy felbontású eredeti bárki számára letölthető; a repó nagyra nő | eggyel több repó; két repóba kell szinkronizálni (generátor + `--check` őr) | a Figma-API lassú és korlátos, nincs CI; 61 névtelen méhváltozat; a kódrajzok (ART, Madárgyár) nem a Figmában élnek |

**Javaslat: B, és a Figma marad a rajzasztal.**
- Új rajz a Figmában születik (szabály).
- Jóváhagyás után exportálva a mester-repóba kerül: eredeti SVG, vagy legalább 1024 px-es PNG.
- A Figma „Grafika” oldala viszont a katalógusból frissül, így ott is a katalógus nevei állnak.
- A kódból rajzolt anyagok mestere a kód marad, a mai helyén:
  - ART-matricák, 3D és ikonok: DS;
  - madár-fajképek: Madárgyár (Bence repója).

  Ezekre a katalógus csak hivatkozik.

Ha Kristóf úgy dönt, hogy a nagy felbontású méh is lehet nyilvános, az **A** egyszerűbb: ugyanez a katalógus és ugyanezek a generátorok, csak egy repóban.

> **Döntés (Kristóf, 2026-10-26): A – publikus.** A mester, a katalógus és a generátorok a publikus DS-repóban élnek
> (`beeco-design-system/grafika/`). A Figma marad a rajzasztal: az eredeti rajzok a beeco Figmájában vannak, onnan exportálunk
> a DS-be. A jogot a LICENSE mondja ki (lásd 8. pont), a méhek a DS-ben „beeco-márka” licencűek. Ahol lent „mester-repó” szerepel, ott ezentúl
> a DS `grafika/` mappáját kell érteni.

## 4. A katalógus mezői (a sablon „Állapotok” helyett)

Egy tétel = egy rajz (nem fájl). A változatok (méret, formátum) a generátor dolga.

| Mező | Példa (`bee-simple`) | Megjegyzés |
|---|---|---|
| `id` | `bee-simple` | a rajzot írja le, angolul, kebab-case; soha nem változik (méhnél `bee-<app-név>`, madárnál az infografika neve, pl. `bird-robin-sing`; a pontos szabály: `grafika/README.md`) |
| `family` | `bee` | `bee`, `bee-role`, `gabee`, `bird-madarka`, `bird-robin`, `bird-species`, `sticker`, `icon`, `art`, `ill`, `logo` |
| `hu` / `en` | „Egyszerű méh” / „Plain bee” | alt-szöveg és kereső |
| `category`, `mood` | `avatar`, `barátságos` | hangulat a `hangnem.json` szótárából |
| `roles` | `["hazigazda"]` | a `hangnem.json` szerepei ide mutatnak |
| `aliases` | `{ "web": "web/assets/brand/bee-happy.webp", "app": "bees/simple", "flutter": "bee-simple", "apiKey": "SIMPLE", "sprite": "dist/meh/hazigazda", "infografika": "bee-happy" }` | a régi nevek; a fogyasztóknál nem kell átnevezni semmit |
| `forbidden` | `false` (`bee-angry`: `true`) | a generátor tiltott tételt nem ad ki publikus kimenetre |
| `license` | `beeco-marka` | `beeco-marka` (a beeco tulajdona, minden jog fenntartva; partneranyaghoz jóváhagyás kell) · `nyilvanos` · `harmadik-fel` (partnerlogó) · `mi-generalt` |
| `origin` | `{ "kind": "illusztrator", "figma": "APP_PROD …", "author": "beeco csapat" }` | `illusztrator` · `figma` · `kod` · `madargyar` · `mi` |
| `master` | `bees/bee-simple.svg` (vagy `@1024.png`) | csak a mester-repóban |
| `style` | `barna-csik` / `fekete-csik` | a fekete és barna csíkos méhek szétválasztásához (csak ahol egy figura két stílusban van) |
| `outputs` | `["flutter", "web", "infografika", "figma"]` | mely generátor adja ki |
| `status` | `aktiv` · `kivezetendo` · `csak-api` | a `question_mark` (`csak-api`) és a fekete csíkos régi változatok (`kivezetendo`?) miatt |

## 5. Szélső esetek (a `--check` őr tesztjei)

- Két tétel ugyanazzal a rajzzal (pl. `blink` és `csicsergosz/call_bee`): egy `id` legyen, a másik csak alias.
- Ugyanaz a téma két stílusban (szerelmes méh: `green_heart` barna/olíva és `love` fekete/piros; hős méh: `inbox_motivation` és `superhero`): ez két `id`, `style`-jelöléssel. Kristóf döntése: a barna csíkos a hivatalos.
- A szerep és a rajz nem egyezik: a DS `bee-sad` (szerverhiba) = app `sick`, de a Flutter-DS `systemError` = `bee-crying`. Az őr hibát jelezzen, ha egy szerep két különböző `id`-re mutat.
- A backend-enum nem változhat: ha egy `apiKey` eltűnik vagy átnevezik, az őr leáll (G1, G4).
- A tiltott kép (`bee-angry`) nem kerülhet publikus kimenetbe (infografika, web). Az app profilkép-listájában ma benne van: ez Bence/Kristóf döntése.
- Fájl, amelyik nem az, aminek a kiterjesztése mondja (`faq_bg.png` = SVG): az őr nézze a fájl tartalmát is.
- Méret: 1x-hez legalább 3× akkora mester kell. Ha nincs, a kimenet „életlen” jelzést kap (a D14 hiba ma ez).
- Csak MI-vel készült kép: a `license: mi-generalt` és az `origin.kind: mi` kötelező (a promptolás csatorna szerint).

## 6. API – generátorok kimenetenként

| Kimenet | Generátor (új vagy meglévő) | Formátum | Hova |
|---|---|---|---|
| **Flutter (Flutter-DS)** | `gen-flutter` → a Flutter-DS `illustrations/manifest.json` és az asset-mappák; a `gen_illustrations.dart` marad | **PNG vagy WebP 1/2/3x – Bence dönt** (az AGENTS.md PNG-t ír, a Flutter-DS ma WebP-t ad) | `beeco-ds-flutter/assets/illustrations/` |
| **App** | nincs külön: az app a `beeco_ds` csomagból kapja | – | az app duplikált `assets/images/bees/` PNG-i kivezethetők, ha Bence átállt |
| **Web / játék** | `gen-web` → `dist/grafika/<id>.webp` @1x/@2x, vektornál SVG; `grafika.json` (id → útvonal, alt) | WebP + SVG | publikus DS → jsDelivr (`@<verzió>`) |
| **Infografika** | a `figures.js` a katalógusból generálódik (`outputs` tartalmazza: `infografika`, `forbidden: false`); a build továbbra is beágyaz | data-URI | `tools/infografika/` |
| **Hangnem** | a `hangnem.json` `szerepek.*.kep` mezője `id`-re mutat; a DS `bee-*` fájlnév aliasként él tovább | JSON | DS `tokens/` |
| **Sprite / Lottie** | `tools/meh-sprite/gyart.py` a katalógus `id`-jéből | WebP-sor + Lottie | DS `dist/meh/` |
| **Figma `APP_PROD`** | `gen-figma`: feltöltés a „Grafika” oldalra, katalógusnévvel, keretenként egy tétel (a `figma-use` skill szerint) | PNG / SVG | Figma |
| **Webflow** | kézi vagy Webflow-eszközös feltöltés a katalógusnévvel (`bee-simple.webp`); alt = `hu` | WebP / AVIF | beeco.hu |
| **Backend madár** | marad: Madárgyár → admin ZIP (`beeco-bird-designs`) | SVG + Lottie | backend |

Őrök (a `npm test` része, mint a `check-ikonok.js`):
- `check-grafika.js`: van-e minden `id`-hez mester; egyediek-e a nevek; feloldható-e minden alias; nincs-e tiltott tétel publikus kimenetben; friss-e minden kimenet (`--check`); megvan-e minden `apiKey`.
- A Flutter-DS-ben a `compare_icons.dart` párja: `compare_illustrations.dart`.

```json
{ "id": "bee-simple", "family": "bee", "hu": "Egyszerű méh", "en": "Plain bee",
  "roles": ["hazigazda"], "mood": "barátságos", "forbidden": false, "license": "beeco-marka",
  "origin": { "kind": "illusztrator", "author": "beeco csapat" },
  "aliases": { "web": "web/assets/brand/bee-happy.webp", "app": "bees/simple", "flutter": "bee-simple", "apiKey": "SIMPLE",
               "sprite": "dist/meh/hazigazda", "infografika": "bee-happy" },
  "outputs": ["flutter", "web", "infografika", "figma"], "status": "aktiv" }
```

### Névkonvenció-feloldás

**Szabály:** az `id` a rajzot írja le, nem a használatát. Az app vizuális nevei már ilyenek, és 1:1-ben egyeznek a backend-enummal és a Flutter-DS manifestjével. Ezért ezek lesznek az `id`-k.
- A DS hangulat- és szerepnevei (`bee-happy`, `moods/rest`, `roles/huto`) és a hangnem-szerepek (`hazigazda`) aliasok lesznek. Fájlt egyik fogyasztónál sem kell átnevezni.
- Ahol az app neve használatot ír le (`inbox_motivation`, `inbox_news`, `call_bee`, `non_selected`), ott új vizuális `id` kell. Ez kérdés Kristófnak.

| DS web | App / Flutter-DS | Viszony | Javasolt `id` | Szerep (`hangnem`) |
|---|---|---|---|---|
| `bee-happy` | `simple` | azonos | `bee-simple` | hazigazda |
| `bee-cheer` | `baby` | hasonló, ellenőrizendő | `bee-baby` | szurkolo |
| `bee-phone` | `red_phone` | azonos | `bee-red-phone` | hirvivo |
| `bee-sad` | `sick` | azonos rajz, **eltérő jelentés** | `bee-sick` | szomoru (?) |
| `bee-angry` | `angry` (nincs Flutter-DS-ben) | azonos, **tiltott** | `bee-angry` | – |
| `bee-super` | `inbox_motivation` (nincs Flutter-DS-ben) | azonos (barna csík) | `bee-superhero-brown`? | futar |
| – | `superhero` | régi fekete csíkos hős | `bee-superhero` | – |
| `moods/action` | `watering_plants` | azonos | `bee-watering-plants` | tevekeny |
| `moods/help` | `eco_compass` | azonos | `bee-eco-compass` | kalauz |
| `moods/love` | `green_heart` | azonos | `bee-green-heart` | halas |
| – | `love` | régi fekete csíkos, piros szív | `bee-love` (kivezetendő) | – |
| `moods/rank` | `crown` | azonos | `bee-crown` | bajnok |
| `moods/rest` | `sleepy` | azonos | `bee-sleepy` | piheno |
| `moods/think` | `question_mark` (nincs Flutter-DS-ben) | azonos | `bee-question-mark` | gondolkodo |
| `roles/kacsint` | `blink` (+ `csicsergosz/call_bee`) | azonos | `bee-blink` | kacsinto |
| `roles/greenwash` · `huto` · `impact` · `jovo` · `rezsi` · `szelektalj` | `black_glasses` · `cook` · `book_glasses` · `cool_white_blue` · `cartographer` · `cap` | azonos | `bee-<app-név>` | (játékszerep) |
| `roles/beporzo` · `elo-kert` · `etelmento` · `korforgo` · `polgarmester` | – | csak DS, kódból összerakva | `bee-role-<név>` | (játékszerep) |

Flutter-DS fájlnév: `bee_<x>.webp` (Dart-asset, aláhúzással), manifest-név: `bee-<x>`. Ez marad, a katalógus `id`-je a manifest-névvel azonos.

## 7. Hozzáférhetőség

- Minden tételnek van `hu` (és `en`) neve: ebből lesz az alt-szöveg a weben, a `semanticLabel` Flutterben, és a leírás a Figmában.
- A díszítő kép (`decorative: true`) a weben `alt=""`, Flutterben `excludeFromSemantics`.
- A jelek (`sticker`) kétszínűek, szerepszínnel (ink/honey/paper). Sötét háttéren a generátor a `paper` színt cseréli, így a kontraszt marad. Ezt az őr méri, mint a DS `check-arculat.js`.
- Méret: a Flutter-kimenet 1x-e legalább a használt dp-méret. A 180 dp-s kiválasztott méhhez 540 px kell 3x-en (D14).

## 7b. Migráció kis lépésekben (mindegyik külön PR, külön gazdával)

| # | Lépés | Repó | Gazda | Előfeltétel |
|---|---|---|---|---|
| 0 | Ez a lap + leltár; Kristóf döntött (2026-10-26, 8. pont) | – | Kristóf | ✓ |
| 0b | `LICENSE` a DS-be (a tároló nyilvánosan olvasható, a márkagrafika minden joga fenntartva); a DS `CLAUDE.md` „belső használatú” mondatának átírása erre | DS | Claude → Kristóf jóváhagy | ✓ (ez a PR) |
| 1 | `grafika/katalogus.json` séma + `check-grafika.js`, feltöltve a méhekkel, madarakkal (a Csicsergősz-figurákkal együtt) és a logóval a leltárból; **fájl nem mozdul** | DS | Claude → Kristóf jóváhagy | ✓ (ez a PR) |
| 2 | Az ART 619 matricája és az 55 ikon belép a katalógusba (a meglévő metaadatból generálva, nem kézzel) | DS | Claude | ✓ (2. kör) |
| 3 | A `hangnem.json` szerepei és az infografika `figures.js` a katalógusból; nincs vizuális változás | DS | Claude | 1 |
| 4 | Az eredeti, nagy felbontású méhek exportja a beeco Figmájából (SVG vagy ≥ 1024 px), a 61 Figma-változat párosítása az `id`-khez | DS `grafika/` | Claude (Figma-olvasás) + Kristóf átnézi | 0, 1 |
| 5 | A 34 Figma-jel visszaírása a DS-be (mint a Javaslat 27-ben az ikonoké), `compare` őrrel | DS ← Flutter-DS | Claude, Bence átnézi | ✓ (2. kör): a DS-ben formai őr (`check-jelek`); a Flutter-DS-oldali egyezés-őr Bence lépése |
| 6 | A Flutter-DS manifest a katalógusból; a hiányzó 8 app-méh (pl. `inbox_motivation` = `bee-super`) felvétele; formátum; D14 nagy felbontás | Flutter-DS | **Bence** | 1, 4 |
| 7 | Az app átáll a `beeco_ds` illusztrációira; a duplikált `assets/images/bees/` PNG-k kivezetése; a `ProfilePictureType` és a backend-értékek változatlanok | app | **Bence** | 6 |
| 8 | Figma „Grafika” oldal a katalógusból (nevek a változatokon) | Figma `APP_PROD` | Claude + a UX-tervező | 1, 4 |
| 9 | Webflow-képek leltára és átnevezése (`bee-simple.webp`, alt = `hu`); a nyilvános rész jsDelivr-ről | Webflow | Kristóf jóváhagy | 1 |
| 10 | Csicsergősz-figurák (GaBee, a vörösbegy-pózok, madárkák) a katalógusba (Kristóf: igen) | DS | Claude | ✓ (2. kör) |
| 11 | A mérges méh kivezetése a profilkép-választóból (Kristóf: nem kell). Átadás Bencének: a `selectableValues` zárja ki az `angry`-t, a backendben meglévő `ANGRY` felhasználók képe továbbra is jelenjen meg (vagy kapjanak alapméhet – az ő döntése); a backend-enumérték nem törlődik | app (+ backend, ha migráció kell) | **Bence** | – |
| 12 | Az egyszerűsítés a „mosolygós” döntés szerint: a szomorú méh szerepét (`szomoru`, Flutter-DS `systemError`) mosolygós méh veszi át; a nem mosolygós változatok `status: kivezetendo` | DS `hangnem.json` + Flutter-DS alias | Claude (DS), Bence (Flutter-DS) | 1 |

A madár-fajképek csővezetéke (Madárgyár → backend) nem változik. A brandbook `v4/` képei a 2. vagy 3. lépésben a Madárgyárból generált kimenetté válnak, nem kézi másolattá.

## 8. Döntés (Kristóf tölti ki)

- Dátum: 2026-10-26
- Választott változat: **A – minden a publikus DS-ben** (a Figma marad a rajzasztal)
- Válaszok a 9. pont kérdéseire (Kristóf szavai idézőjelben):
  1. Mester helye: „publikus” → A.
  2. Eredeti fájlok és jog: „mienk, a beeco-é, a Figmánkban vannak meg” → a jog a beeco-é; a nagy felbontású mester a beeco Figmájából exportálható (4. lépés).
  3. Hivatalos változat: „a boldog mindegyiknél, a mosolygós” → minden szerepben mosolygós méh. Szerverhibánál sincs szomorú méh.
     A `sick` (zöld) és a `crying` kivezetendő a szerepekből; a profilkép-választóban maradhatnak (Bence).
     Szerelmes és hős méh: „Igen, a barna csíkos változat a hivatalos a szerelmes és a hős méhnél is.” (2026-10-26).
     Hivatalos: `moods/love` (= app `green_heart`, barna csík, olíva szív) és `bee-super` (= app `inbox_motivation`).
     Az app fekete csíkos `love` és `superhero` rajza `status: kivezetendo` lesz a szerepekben. A profilkép-választóban (`LOVE`, `SUPERHERO`) a lecserélésük Bence döntése: az enumérték marad, csak a kép cserélődhet.
     A Flutter-DS-be a barna csíkos hős méh (`inbox_motivation`) felvétele kell (6. lépés).
     A weboldal is ezeket használja (Webflow: `MÉH_Beela.png`, `méhecske.webp` 1000 px, `fs-hos-meh.webp`).
  4. Névadás: „igen” → az app vizuális nevei az `id`-k, a hangulat- és szerepnevek aliasok.
  5. Csicsergősz-figurák a közös katalógusba: „igen”.
  6. LICENSE a publikus DS-be: „igen” (0b. lépés).
  7. Webflow-leltár most, és MI-kép a katalógusban (jelölve): „igen”. Kész:
     - `webflow-kepek.csv`: 1659 asset, 97 méh, 57 madár;
     - `webflow-meh-parok.csv`: 18 azonos, 14 rokon méhrajz.

     A 9. lépés (Webflow-átnevezés katalógusnévre, alt = `hu`) erre épül, és írási művelet, ezért külön jóváhagyás kell hozzá.
  8. A mérges méh a profilkép-választóban: „nem kell a mérges” → kivezetés (11. lépés, Bence).

## 9. Kérdések Kristófnak (megválaszolva 2026-10-26 – a válaszok a 8. pontban)

A kérdések az eredeti sorrendben; a 8. pontbeli számozás a csevegésben feltett rövid listát követi (1–8).

1. **Mester helye:** A (minden a publikus DS-ben) vagy B (privát mester-repó, a publikus DS csak webméretet kap)? Javaslat: B.
2. **Eredeti fájlok:** megvannak-e a méhek eredeti, vektoros vagy legalább 1024 px-es fájljai? Ki rajzolta őket, és van-e írásos felhasználási jog? Ugyanez a Csicsergősz-illusztrátor madaraira és a GaBee-re.
3. **Licenc:** kerüljön-e a publikus DS-be egy LICENSE, ami kimondja, hogy a kód szabadon nézhető, de a márkagrafika (méhek, logó, madarak) minden joga fenntartva? Most nincs LICENSE (`"UNLICENSED"`). A méhek a jsDelivr-en át ma is nyilvánosak.
4. **Szomorú méh:** szerverhibánál a zöld (`bee-sad` = app `sick`) vagy a síró (`crying`, a Flutter-DS ezt használja) legyen?
5. **Változatok:** a barna csíkos (új) vagy a fekete csíkos (régi) méh a hivatalos? Ez érinti a `superhero`-t és a `love`-ot. A régieket kivezessük?
6. **`baby` ↔ `bee-cheer`:** ugyanaz a rajz? (A képen hasonló, de nem biztos: `kepek/meh-parok-kiegeszites.png`.)
7. **Névadás:** jó-e, hogy a rajzot leíró app-nevek legyenek az azonosítók, a hangulat- és szerepnevek pedig aliasok? Hogyan hívjuk az `inbox_motivation`-t (javaslat: `bee-superhero-brown`)?
8. **Csicsergősz:** a GaBee és a három madárstílus (madárka, a vörösbegy-pózok, Madárgyár) a közös katalógusba kerüljön, vagy maradjon a Csicsergősz saját bőrében? Ez kapcsolódik az 1. döntéskör nyitott kérdéséhez.
9. **Webflow:** most leltározzuk-e a ~108 Webflow-képet (Webflow-eszközzel, csak olvasva), vagy majd a 9. lépésben?
10. **MI-kép:** kerülhet-e MI-vel készült kép a katalógusba (a `docs/promptolas.md` csatornáján át), és ha igen, látható jelöléssel?
11. **A tiltott mérges méh** benne van az app profilkép-választójában (`ANGRY`). Maradjon (Bence döntése), vagy ott is tiltott?

### Bence döntése (Flutter-DS, app, backend)

- PNG vagy WebP 1/2/3x a Flutter-kimeneten (az AGENTS.md PNG-t ír, a Flutter-DS WebP-t ad);
- a Flutter-DS `illustrations/manifest.json` generálódjon-e a katalógusból, és mikor vegye fel a hiányzó 8 méhet;
- mikor áll át az app a `beeco_ds` csomagra (a `ds-facelift` ma még nem függ tőle), és mikor vezeti ki a duplikált PNG-ket;
- a `ProfilePictureType` / `ProfilePictureTypeEnum` értékei változatlanok maradnak; új profilkép-méh = új enumérték a backendben (az ő munkája);
- a Madárgyár (Bence Madárgyár-repója (`bird-catalog`)) marad a fajképek mestere; a `pack_flutter.py` csomagot az app nem használja: megtartja vagy kivezeti;
- a Flutter-DS `LICENSE` szövege („TODO”).
