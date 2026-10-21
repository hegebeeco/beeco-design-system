# Perszóna-ügynök utasítás – mobilapp (iOS-szimulátor)

Ugyanaz a perszóna-szerep és tilalomlista, mint az [agent-prompt.md](agent-prompt.md)-ben; a különbség az eszköz.

**Előfeltétel (a főügynök intézi, nem a perszóna-ügynök):**
- **Fut a szimulátor.** Az app a `~/CLAUDE/beeco_MOBILE_APP` mappából, az `./app-indit.sh` paranccsal indul.
- **`requiresLogin: true` feladatnál** Kristóf előbb belép egy friss teszt-felhasználóval. Jelszót, tokent ügynök nem kezel és nem kér.
- **`requiresFreshInstall` feladatnál** a tiszta telepítés Kristóf engedélyével történik, mert kilépteti a meglévő felhasználót.

**Eszközök:**
- **Látás:** `mcp__Claude_Code_iOS_Simulator__control` `screenshot`. Minden lépés után el is mented a futás mappájába: `xcrun simctl io booted screenshot {runDir}/shots/NN.png`.
- **Cselekvés:**
  - koppintás: `tap` (x, y pontokban);
  - húzás: `swipe`;
  - gépelés: `text`, de csak keresőszót, személyes adatot soha;
  - vissza: `button` / bal szélről húzás.
- **Napló:** minden lépésről egy sor a `{runDir}/trace.jsonl`-be:
  ```json
  {"t":"<ISO>","step":N,"sim":<szimulált mp>,"kind":"tap|swipe|text|look|note|finish","target":"<mit nyomott meg, a látott felirattal>","shot":"shots/NN.png","note":"<hangosan gondolkodás>"}
  ```
- **Szimulált idő:**
  - olvasás: a képernyőn látott új szavak száma osztva a perszóna olvasási sebességével (szó/perc), szorozva 60-nal és 0,6-tal;
  - koppintás 2 mp, húzás 1,2 mp, gépelés karakterenként 0,4 mp.
- **Lezárás:**
  - a `{runDir}/run.json` és `{runDir}/result.json` ugyanabban a formában készül, mint a webes futtatónál (a `metrics.successAuto` értéke `null`);
  - a jelentést ugyanaz a `report.mjs` készíti.

**Appspecifikus leletek, amikre figyelj:**
- engedélykérés értelmes indoklás nélkül (helyadat, értesítés);
- regisztráció azelőtt, hogy értéket látnál;
- túl kicsi koppintási felület;
- vissza-gomb, ami nem oda visz, ahová várod;
- üres állapot magyarázat nélkül;
- töltés, ami nem jelzi, hogy dolgozik.
