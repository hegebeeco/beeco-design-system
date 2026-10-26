# Grafikai katalógus (Javaslat 28)

Egy forrás, sok kimenet – ugyanaz a minta, mint a tokeneknél. Kristóf döntése (2026-10-26):
- a mester és a katalógus itt, a publikus DS-ben él;
- új rajz előbb a beeco Figmájában születik, aztán kerül ide;
- a márkagrafika a beeco tulajdona (`LICENSE`).

Indoklás és lépések: [`docs/javaslatok/28-egy-grafikai-forras.md`](../docs/javaslatok/28-egy-grafikai-forras.md).

## Mi van benne most (1. lépés)

Két rész, együtt 838 tétel:
- [`katalogus.json`](katalogus.json) – **kézzel gondozott** (130): méhek, madarak, Csicsergősz-díszletek, logó. Ezt szerkeszd.
- [`gen/`](gen/) – **generált** (708): `art.json` (619 kódmatrica), `ikonok.json` (55 ikon), `jelek.json` (34 kétszínű jel). Forrásuk a saját metaadatuk; ne szerkeszd kézzel: `node tools/grafika-build.js` (az `npm run build` is futtatja).

| Család | Darab | Mi |
|---|---|---|
| `bee` | 84 | a beeco méhecskék (az app 84 méhe; ebből 76 a Flutter-DS-ben, 19 a DS `web/assets/brand/`-ben is) |
| `bee-role` | 5 | szerepes méhek, kódból összerakva (`tools/meh-szerepek/`) |
| `gabee` | 1 | a Csicsergősz méhe |
| `bird-madarka` | 4 | „madárkák” (sokszög stílus) |
| `bird-robin` | 5 | a vörösbegy pózai (kampány-weboldal, infografika) |
| `bird-species` | 7 | a Madárgyár renderjei a brandbookban |
| `scene` | 19 | Csicsergősz-díszletek (borító, dombok, etető, itató, odú, hurok) |
| `pictogram` | 3 | Csicsergősz-piktogramok (élőhely, rovarok, vadvirág) |
| `logo` | 2 | logó, világos és sötét |
| `art` | 619 | kódból rajzolt matricák (`web/js/art/`), generált |
| `icon` | 55 | a közös vonalas ikonok (`termek/ikonok/`), generált |
| `sticker` | 34 | a közös kétszínű jelek (`termek/jelek/`, a Flutter-DS-sel bájtra azonos), generált |

Fájl nem mozdult, és semmi nincs átnevezve: a tételek a meglévő fájlokra mutatnak.
Még nincs benne: a Flutter-DS 7 nem méh illusztrációja (`sign-*`, `onboarding-*`, `swarm`) és a 3D-modellek.
- **4. lépés:** a nagy felbontású mesterek a Figmából, a `master` mezőbe.

## Nagy felbontású mesterek

A [`mester/`](mester/) mappában 55 méh van, vektoros SVG-ként, a beeco Figmájából (APP_PROD, „Bee profile picture (new)”). Profilkör és vágás nincs rajtuk, így tetszőleges méretben élesek (D14: a mobilon ≥ 540 px kell). A [`mesterek.json`](mesterek.json) mondja meg, melyik katalógus-id melyik fájl és melyik Figma-node.
- A `glasses` és a `computer` mestere barna csíkos; az app PNG-je ezeknél a régi, fekete csíkos változat.
- A `nem_parositott` lista 6 Figma-változatot sorol fel: más rajz, tükrözött vagy duplikátum. Ezekhez nincs biztos app-pár.
- 29 app-méhnek még nincs Figma-mestere: ezeknél a Figmában kell előbb megrajzolni vagy megkeresni a vektort.
- PNG-export macOS-en: állítsd a gyökér `width`/`height`-ját a kívánt méretre, majd futtasd: `sips -s format png <mester.svg> --out <kimenet.png>`. Az eredmény átlátszó hátterű.

## Egy tétel

```json
{ "id": "bee-simple", "family": "bee", "hu": "Egyszerű méh", "en": "Plain bee",
  "roles": ["hazigazda"], "forbidden": false, "license": "beeco-marka",
  "origin": { "kind": "illusztrator", "author": "beeco csapat", "figma": "APP_PROD – Bee profile picture (new)" },
  "aliases": { "app": "bees/simple", "web": "web/assets/brand/bee-happy.webp", "flutter": "bee-simple",
               "apiKey": "SIMPLE", "sprite": "dist/meh/hazigazda", "infografika": "bee-happy" },
  "outputs": ["flutter", "web", "infografika"], "status": "aktiv" }
```

| Mező | Szabály |
|---|---|
| `id` | a rajzot írja le, angolul, kebab-case; **soha nem változik**. Méhnél az app vizuális neve (`bee-<app-név>`), mert az egyezik a Flutter-DS-sel és a backenddel; madárnál az infografika neve (`bird-robin-sing`); Madárgyár-rendernél `bird-render-<faj>`. **Kivétel a generált családoknál:** az id a meglévő, befagyasztott kulcsból jön (`art-` + ART-név, `icon-` + ikonfájl, `sticker-` + jelnév) – ezek már API-k, ezért nem fordítjuk le |
| `family` | `bee` · `bee-role` · `gabee` · `bird-madarka` · `bird-robin` · `bird-species` · `sticker` · `icon` · `art` · `ill` · `logo` |
| `hu`, `en` | a név; ebből lesz az alt-szöveg és a Flutter `semanticLabel` |
| `roles` | a `tokens/hangnem.json` szerepei, amelyek ezt a képet használják (az őr ellenőrzi) |
| `forbidden` | tiltott kép (ma: a mérges méh). Nincs szerepe, nincs kimenete |
| `license` | `beeco-marka` · `nyilvanos` · `harmadik-fel` · `mi-generalt` (MI-kép csak jelölve, Kristóf 2026-10-26) |
| `origin.kind` | `illusztrator` · `figma` · `kod` · `madargyar` · `mi` |
| `style` | ahol ugyanaz a figura két stílusban van: `barna-csik` (hivatalos) / `fekete-csik` (régi) |
| `aliases` | a régi nevek fogyasztónként. `web` = fájl ebben a repóban (az őr megnézi, hogy létezik). `app` = a mobilapp `assets/images/` alatti neve. `flutter` = a Flutter-DS manifest-neve (logónál, ikonnál, jelnél a csomag-beli fájlútvonal). `art` = az ART-matrica neve (`ART`, `pic()`), `react` = az `Ic*` export. `apiKey` = a backend profilkép-értéke (**szerződés, nem változhat**, a befagyasztott lista: [`api-kulcsok.json`](api-kulcsok.json)). `sprite`, `infografika`. Minden alias egyetlen név; a további előfordulások a `note`-ban |
| `outputs` | mely generátor adja ki: `flutter` · `web` · `infografika` · `figma` · `webflow` |
| `status` | `aktiv` · `kivezetendo` (szerepben már nem használjuk) · `csak-api` |
| `emoji` | csak matricánál: az emoji-aliasok listája (a játékok emojival is hívhatják) |
| `note` | szabad megjegyzés |

## Döntések, amiket a katalógus már tükröz (Kristóf, 2026-10-26)

- **Szerepekben csak mosolygós méh.** A szomorú szerep (`szomoru` → `bee-sick`) és a Flutter-DS `systemError` (`bee-crying`) képe a 12. lépésben cserélődik.
- **A szerelmes és a hős méhnél a barna csíkos a hivatalos:** `bee-green-heart` (= `moods/love`; az infografikában „bee-love”) és `bee-inbox-motivation` (= `bee-super`).
  A fekete csíkos `bee-love` és `bee-superhero` állapota `kivezetendo`.
- **A mérges méh** (`bee-angry`) tiltott, és kikerül az app profilkép-választójából (Bence végzi; a backend `ANGRY` értéke marad).

## Ellenőrzés

`node tests/check-grafika.js` (az `npm test` része). Ezt nézi:
- az id-k egyediek;
- minden web-alias fájlja megvan;
- az `apiKey`-ek egyediek, és pontosan az `api-kulcsok.json` 77 értéke (érték nem tűnhet el, új csak oda is felvéve);
- a `tokens/hangnem.json` minden szerep-képe és tiltott képe feloldható, és egy szerep csak egy tételé;
- a tiltott tételnek nincs szerepe és kimenete;
- ha az infografika-generátor a repóban van, a figurái is a katalógusban vannak (0 talált figura = hiba).
