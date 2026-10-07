# AI-munkamód – hogyan dolgozz gyorsan és biztonságosan a DS-ben

*2026-10-07 (1.53.0). Cél: (a) a fogyasztók (Kaptár, admin, partner, játékok, Flutter, Webflow) soha ne törjenek el
váratlanul, (b) az ügynökök kevés fájlból, kevés tokennel dolgozzanak, és a párhuzamos ágak ne ütközzenek a `dist/`-en.*

## 1. Az ügynök menete (röviden)

1. **Először a `docs/AI.md`-t olvasd el** (generált index: minden React-komponens egy sorban – import, fő propok,
   CSS-osztály, mikor kell; tokenek; CSS-only elemek; szabályok). A `dist/`-et **ne nyisd meg** – generált.
2. Csak a szükséges forrást nyisd meg: `react/src/<csoport>/<Komponens>.tsx`, `termek/css/bc-*.css`, a tesztlapot
   (`react/tesztlapok/<lap>.tsx` + `termek/tesztlapok/<lap>.test.mjs`).
3. Munka közben **csak az egy-komponenses kört** futtasd: `npm run check:egy -- <lap vagy Komponens>`
   (csak az érintett tesztlapot építi és teszteli, 2 nézetben; mérve: egy lap ~9 s, komponensnévvel 2 lap ~20 s – a teljes `npm test` ennek sokszorosa).
4. A végén **egyszer** a teljes kört: `npm run build && npm test` (ez a CI is).
5. **Verziót ne emelj** a feature-ágon (nincs `VERSION`/`package.json`-módosítás) – a kiadás külön lépés (4.).
   A `CHANGELOG.md` „Készül” szakaszába írd, mit csináltál.

## 2. Mi generált és hol (kézzel SOHA ne szerkeszd)

| Kimenet | Eszköz | Forrás | CI-őr |
|---|---|---|---|
| `dist/css`, `dist/scss`, `dist/tailwind`, `dist/dart`, `dist/tokens.json`, `react/src/meh/hangnem.gen.ts` | `tools/tokens-build.js` | `tokens/*.json` | `--check` |
| `dist/react/**` (JS + `types/`), `dist/tesztlapok`, `termek/tesztlapok/*.html`, `dist/meres` | `tools/react-build.js` | `react/` | `--check` (a `types/` is) |
| `dist/weboldal/*` | `tools/webflow-build.js` | `dist/tokens.json`, `termek/css` | `--check` |
| `api/api.json` – a nyilvános API pillanatképe | `tools/api-check.js --write` | `dist/react/types`, CSS, tokenek, játék-JS | `api-check` |
| `docs/AI.md` – ügynök-index | `tools/ai-index.js` | `api/api.json`, JSDoc, `docs/komponensek.md` | `--check` |
| `docs/komponens-katalogus.md` | `tools/katalogus.py` | `react/src/index.ts` | – |

**Determinisztikus:** a generált fájlok fejlécében **nincs verzió és dátum**; a verzió egyetlen generált helye a
`dist/tokens.json` `version` mezője. Változatlan forrásból újraépítve a diff **nulla** (rendezett bejárás, tartalom-hash
a közös darabok nevében). Egy verzióemelés így 5 fájlt érint: `VERSION`, `package.json`, `package-lock.json`,
`dist/tokens.json`, `CHANGELOG.md`.

## 3. A `dist/` gazdája: a PR (a + b változat együtt)

A git-címkét telepítő fogyasztóknak (`github:hegebeeco/beeco-design-system#vX.Y.Z`) a **címkézett commitban kell a
`dist/`** – ezért a „CI építse a main-en” változatot elvetettük (egy bot-commit nélküli címke törött csomagot adna).

- **(a) A PR tartalmazza a `dist/`-et, a CI ellenőrzi**, hogy friss (`npm test` → `--check`-ek). A `.gitattributes`
  a `dist/**`-et `linguist-generated`-nek jelöli (a GitHub összecsukja), a nagy JS-kimenetet `-diff`-fel rejti
  (a `git diff` csak „Binary files differ”-t ír – kevesebb token). A `dist/tokens.json`, `dist/weboldal/*` és az
  `api/api.json` diffje látszik: ezekben van a lényeg.
- **`dist/`-ütközés** két ág között: ne kézzel oldd fel – `git checkout --theirs dist termek/tesztlapok && npm run build`.
- **(b) Kiadás-workflow** (`.github/workflows/kiadas.yml`, kézi indítás, bemenet: verzió): ellenőrzi, hogy a
  `CHANGELOG.md`-ben van `## X.Y.Z` szakasz, átírja a `VERSION`/`package.json`/`package-lock.json`-t, `npm run build`,
  `npm test`, API-őr a legutóbbi címkéhez képest, majd commit a `main`-re + `vX.Y.Z` címke + push. Kézi kiadás
  (ugyanez helyben) továbbra is lehetséges: `node tools/kiadas.js X.Y.Z` → `npm test` → commit → `git tag`.

## 4. Törő változás elleni őr (`node tools/api-check.js`)

Az `api/api.json` a teljes nyilvános felület: React-exportok és propjaik (név, típus, kötelező-e), `bc-`/`ds-`
CSS-osztályok és `is-` módosítók, tokenek (CSS-változók, SCSS, Tailwind-kulcsok, Dart-nevek), a játékok globális
JS-nevei (`DS.*`, `pic`, `ART`, …). A CI a **legutóbbi `v*` címkéhez** méri:
- **eltűnt vagy átnevezett** név, **új kötelező prop** → **hiba**, kivéve FŐ verzióemelésnél (`VERSION` major > címke major);
- új név, új opcionális prop → rendben; típus-változás → figyelmeztetés.
Frissítés a változás után: `node tools/api-check.js --write` (és a diffet nézd át a PR-ban).

## 5. Szabályok ügynököknek

- A `dist/`-et, a `termek/tesztlapok/*.html`-t és a `docs/AI.md`-t ne szerkeszd – építsd újra.
- Ne commitolj abszolút útvonalú szimlinket (pl. `node_modules` → máshova): a GitHub Pages 2 napig állt miatta.
  A `.gitignore` kizárja; a CI `check-repo` lépése elbukik rajta.
- Titok, jelszó, kulcs soha (a repó publikus).
- Verziót csak a kiadás emel; a feature-ág nem nyúl a `VERSION`-höz.
- Mérés előtt a tesztkeret megvárja a betűket és egy stabil képkockát (`stabil()` a `check-komponensek`-ben) –
  forgatókönyvben `waitForTimeout` helyett `await stabil()` / `locator.waitFor()`.
