# Hogy állunk: Brand Book és Design System (2026-10-08)

Állapotfelmérés és fejlesztési javaslatok a két új oldalra (25. és 26. javaslat), a 1.54.0 kiadás után. A számok a helyben épített kimenetből és az ellenőrzésekből valók; ahol nem mértünk, ott ezt jelezzük.

## 1. Összkép

| | Régi Brand Book | Brand Book (új) | Design System (új) |
|---|---|---|---|
| Cím | beeco-brandbook.netlify.app | ugyanitt, az új építővel | beeco-design-system.netlify.app |
| Hozzáférés | jelszó | jelszó (új belépőoldal) | nyitott |
| Karakter | termékbőr | játékbőr (Méhsejt-diorama) | termékbőr |
| Oldalak | 27, ebből 10 nem volt a menüben | 17 tartalmi oldal, 5 főpont | 84 tartalmi oldal, 8 főpont (54 komponensoldal, 8 kategóriaoldal) |
| Menü | lapos, 17 elem | akkordion, csak az aktív csoport nyitott | akkordion, 3 szint |
| Üres fejezet | 3 | 0 (a tervezett oldalak „hamarosan”) | 0 |
| Keresőtétel | 382 | ~250 | ~1515 (komponens-változatok és propok is) |
| Csomagolt CSS | 22 egymás utáni import | 168 KB | 315 KB |

Éles állapot: a Design System él és kézzel feltöltött. A Brand Book új változata a PR (hegebeeco/beeco-design-system#17) merge-ével áll át; előnézete a deploy-preview-17 címen van.

## 2. Ami jól működik (mérve)

- **Szövegkontraszt a renderelt oldalon:** minden szöveg ≥ 4,5:1 mindkét oldalon, mindkét módban (legkisebb 4,67–4,78:1). A DS tokenpárjai: 44 pár a `check-tokens`-ben (az 1.54.0 előtt 32).
- **Hozzáférhetőség (helyi mérés, `ui_audit`):** 320–1280 px, világos és sötét, 0 lelet a Brand Book 4 és a DS 2 oldalán; a komponens-áttekintőn 3 P2 maradt: mondatba ágyazott linkek (WCAG-kivétel).
- **Szerkezet:** egy `h1` oldalanként, nincs kihagyott címsorszint, nincs inline stílus vagy script (szigorú CSP), 12 837 belső link ellenőrizve, 20 átirányítás (minden cél létezik).
- **Egy tény egy helyen:** a számok adatból generáltak (54 komponens, 149 React-komponens, 45 tesztlap, sablonok száma); a „belső használat” szabály csak a Logó és a Letöltések oldalon él.
- **Gépi minőségőr:** `check-tokens` (kontraszt, nyers szín, ismeretlen token, mozgás), `check-komponensek` (462 forgatókönyv, 8 nézet, axe, P0 és P1 = 0), `api-check` (nincs törő változás), `check-repo`, `docs:check` (laza és szigorú mód).
- **Jelszókapu:** 7 helyi próba (belépő oldal, rossz jelszó, jó jelszó, jelszócsere után érvénytelen süti, nyitott átirányítás elleni védelem).

## 3. Ismert hiányok

| Terület | Mi hiányzik | Ki/mi kell hozzá |
|---|---|---|
| Brand | vektoros logó (SVG/PDF) | Kristóf vagy tervező: nincs forrásfájl |
| Brand | fotóbank-link, AI-prompt szabályok | Drive-mappa címe, döntés |
| Brand | Canva/Figma sablonváltozat, videó-sablon, story-matricák, nyilvános logócím az e-mail-aláíráshoz | döntés és forrás |
| Brand | kódex, kapcsolati e-mail, Rajpont (a HR-felületre kerülnek) | HR-felület |
| Brand | Pozíció oldal 3 „Korrigálandó” blokkja (márkaígéret, Hidak építése, Miért pont mi?) és a „Küldetésünk” javaslat | Kristóf jóváhagyása |
| Brand | Partnerarculat: partner vállalásai, sajtócsomag, határidők; a sablonok „Minta – korrigálandó” | beeco döntése |
| Design System | anatómia: annotált rajz (ma szöveges lista) | tervező |
| Design System | `alapertek` 5 komponensnél, `link` tesztlap, `urlapszakasz` állapotai | forrásellenőrzés |
| Design System | Figma-változók és Code Connect (a kollekciók neve: `core`, `termek-light`, `termek-dark`, `jatek`) | a Figma-DS megérkezése |
| Design System | `jm-` előtag jelentése nincs a repóban kimondva | szótár-döntés |
| Mindkettő | „Hiányzik” jelvény: Brand 11, DS 71 | a fentiek |

## 4. Fejlesztési javaslatok (hatás ÷ erőfeszítés szerint)

### Azonnal (kis erőfeszítés, nagy hatás)
1. **A PR merge-e, a v1.54.0 címke, a Brand Book átállása.** (Kristóf)
2. **A DS-oldal összekötése a GitHub repóval** a Netlify felületén, `netlify.docs-ds.toml` konfig-útvonallal; addig minden DS-módosítás kézi feltöltés.
3. **Fogyasztók frissítése 1.54.0-ra:** a sötét `danger` és `ink-muted` javítás minden terméket érint (admin 1.43.1, partner 1.38.0 elmarad; a Kaptár 1.53.0).
4. **A „Hiányzik” blokkok lezárása döntéssel**, nem szöveggel: logó SVG, fotóbank, Korrigálandó szövegek.

### Rövid távon (1–2 hét)
5. **Anatómia-rajzok** a 13 atomhoz (annotált SVG), és a változat × állapot mátrix vizuális, kattintható változata a Specifikáció fülön.
6. **Játszótér a Kód fülön:** a propok élő átkapcsolása (változat, méret, állapot) a komponens-demón.
7. **Vizuális regresszióteszt** (képernyőkép-összevetés a komponens-tesztlapokon): ma csak szerkezeti és kontrasztellenőrzés van; a „ember is megnézte” szabály nem skálázódik.
8. **Élő mérés:** `ui_audit` és axe a két éles oldalon, képernyőolvasós kézi teszt (VoiceOver, NVDA) a komponensoldalakon és a Brand Book menün.
9. **Teljes szöveges keresés:** ma a kereső a címsorokat, komponens-változatokat és propokat indexeli, a törzsszöveget nem.

### Közép távon (1–2 hónap)
10. **1.55: a játékbőr forrása a `core.json`** (a `web/css/tokens.css` generálva), hivatalos sötét téma a játékbőrhöz (ma a docs-oldal kiegészítése pótolja), töréspont-egységesítés (ma 8 különböző érték a CSS-ben), a 18 px-es ikonok 16/20/24-re.
11. **A mobil app bekötése** (Flutter `BeecoRoles`, sötét mód, 128 nyers szín a `lib/` alatt): a DS legnagyobb eltérő fogyasztója.
12. **Figma:** a tokenek (`dist/tokens.json`) importja Figma Variables-be, a komponensek `react[]` és `api.json` alapján Code Connect-térkép.
13. **Verziózott dokumentáció:** archív oldal kiadásonként, dátumozott „Mi új” RSS-sel; a migrációs útmutatók (1.5x → 1.5y).
14. **Visszajelzési csatorna az oldalon:** „Hasznos volt?” és „Hibát találtam” a DS-en, és használatmérés (pl. Clarity), hogy a UX/UI csapat valóban mit keres.
15. **Angol nyelvű változat** a partnereknek (a tartalmi modell ezt támogatja: oldalanként egy JSON).

### Kockázatok
- A DS-oldal 21 MB (15 MB az élő tesztlapok JS-e); mobilhálózaton lassú lehet. A tesztlapok külön, lusta betöltéssel kiszervezhetők.
- A Brand Book játékbőre és a DS termékbőre két karakter; a közös fejléc, a keresés és a tipográfia tartja össze. Ha a UX/UI csapat ezt zavarónak találja, a Brand Book skinje cserélhető (a motor skin-paraméteres).
- A DS-oldal kézi feltöltése elavulhat, amíg nincs összekötve a repóval.
- A webflow-os animációk (rise, stamp, lift) az 1.54.0-ban életre kelnek (a `--bc-t-*` időváltozók ms-ra oldódnak): élesbe külön jóváhagyással.

## 5. Döntések, amik Kristófra várnak

- A logó védőtere: **eldöntve** (a logó magasságának fele).
- A 26. javaslat döntéseit Claude hozta Kristóf megbízásából; érdemes egyszer átnézni (különösen: a sötét `danger` új színe, a befelé futó fókuszgyűrűk kivétellistája).
- Komponens-státuszok: a javasolt szabály (49 stabil, 5 béta) jóváhagyása.
- A letöltések számának ellentmondása az élő oldalon (25 000+ vagy 20 000+).
- A social formátumok és biztonsági zónák jóváhagyása; a partneri ajtómatrica mérete (150×150 mm).
- A nyilvános logócím az e-mail-aláíráshoz.
- A madárrajzok külső használatáról nincs döntés.

## 6. Ellenőrzési parancsok

```
npm run docs:build     # mindkét oldal építése (_site/brand, _site/ds)
npm run docs:test      # laza ellenőrzés (üres oldal, törött link, átirányítás)
npm run docs:check     # szigorú: a „Hiányzik” jelvények is hibának számítanak (a keretlista a hiányokról)
npm test               # teljes lánc (token, repó, komponens, api, docs)
```
