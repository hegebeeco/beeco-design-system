# Tesztelő perszónák

A beeco weboldal és mobilapp hatékonyságát nézzük meg velük: eljut-e egy adott felhasználó a céljáig, mennyi idő alatt, hol akad el, és mit gondol közben.

Két módon használjuk ugyanazt a készletet:
1. **Szintetikus teszt.** Claude-ügynökök játsszák a perszónákat valódi böngészőben vagy az iOS-szimulátorban.
   - Gyors és olcsó: egy oldalra kb. 15–20 futás, néhány perc.
   - Minden nagyobb változás előtt és után érdemes lefuttatni.
   - Irányt mutat, a valós felhasználót nem helyettesíti.
2. **Emberes teszt.** Ugyanazok a perszónák és feladatok, valódi tesztelőkkel: [human-test-kit.md](human-test-kit.md).

## Fájlok
| Fájl | Mi van benne |
|---|---|
| `personas.json` | 12 perszóna: 4 lakossági a brandbookból, 4 CsicsergŐsz-specifikus, 4 B2B. Cél, eszköz, érkezés, türelem, kifogások, hang, súly. |
| `lenses.json` | 3 hozzáférhetőségi lencse (nagyítás, lassú net, csak billentyűzet), bármelyik perszónára ráhúzható. |
| `scenarios/*.json` | Feladatkönyvtár oldalanként: feladatszöveg, időkeret, sikerfeltétel, első kör párosításai. |
| `agent-prompt.md` | A perszóna-ügynök utasítása (web). |
| `app-agent-prompt.md` | Ugyanez az iOS-szimulátorra. |
| `human-test-kit.md` | Moderátori forgatókönyv, jegyzőlap, SEQ- és SUS-kérdőív, toborzás. |
| `../../tools/persona-test/browser.mjs` | Böngésző-futtató, amit az ügynök lépésenként vezérel. |
| `../../tools/persona-test/prompts.mjs` | A perszóna-ügynökök utasításainak kitöltése egy feladatkönyvtár első köréhez (`_prompts/*.md`). |
| `../../tools/persona-test/report.mjs` | Jelentés és Hatékonysági index. |
| `../../tools/persona-test/calibration.md` | Súlyok kalibrálása valós adatból (Clarity, GA4). |

## Futtatás röviden
A `beeco-persona-test` skill írja le részletesen; Claude Code-ban elég kérni: „futtasd a perszóna-tesztet a CsicsergŐsz-oldalra”.

```bash
# egy futás kézzel (az ügynök is ezt csinálja)
node tools/persona-test/browser.mjs start --run /tmp/pt/rek-app --persona busy-pragmatic --scenario csicsergosz.json#get-the-app
node tools/persona-test/browser.mjs look --run /tmp/pt/rek-app
# … click / scroll / note …
node tools/persona-test/browser.mjs finish --run /tmp/pt/rek-app --result success --seq 6 --trust 4 --summary "…"
node tools/persona-test/browser.mjs stop --run /tmp/pt/rek-app
node tools/persona-test/report.mjs /tmp/pt
```
A futások mappáját (képernyőképek, napló) ne commitold; a jelentés `report.json`-ja eltehető az előtte–utána összevetéshez.

## Védőkorlátok
- **Analitika:** a GA4, a GTM, a Clarity, a Sender, a Facebook és a Stripe kérései blokkolva vannak, így a teszt nem szennyezi a valós adatot.
- **Űrlap:** semmilyen űrlap nem küldhető el; minden nem-GET kérés blokkolva.
- **Domain:** a futtató csak a feladatban engedélyezett domainen navigál. A külső linket feljegyzi, de nem nyitja meg.
- **Személyes adat:** az ügynök valódit soha nem ír be.
- **App:** belépni csak Kristóf lép be, az ügynök jelszót nem kezel.

## Bővítés
- **Új perszóna:** a `personas.json`-ba, forrásmegjelöléssel. Kitalált, általános profil legyen: valós személy adata nem kerülhet ide, mert a repó nyilvános.
- **Új oldal:** új `scenarios/<oldal>.json`, ugyanazzal a szerkezettel.
  - Siker típusai:
    - `externalUrl`;
    - `urlContains`;
    - `elementSeen`;
    - `judge` (az összegző dönt a válasz alapján).
  - Az első kör párosításait a `firstRound` mezőbe írd.
- **Súlyok:** a `tools/persona-test/calibration.md` szerint.
