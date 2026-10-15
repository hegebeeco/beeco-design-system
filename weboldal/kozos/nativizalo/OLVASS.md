# Natívizáló: embed-CSS → Webflow-osztályok (lapítással, szimulált ellenőrzéssel)

Cél: egy oldal beágyazott (HTML Embed) CSS-ét natív Webflow-stílusokba írni úgy, hogy a megjelenés ne változzon,
és Kristóf a Designerben szerkeszthesse. Első használat: főoldal-draft (2026-10-15).

## Lépések
1. `jelol.py` – az oldal HTML-jét letöltve minden elemre `data-nk`, az fs-stílusblokkokra `data-fs` jelölést tesz (eredeti.html → jelolt.html).
2. `lapit.cjs` – JS nélküli (tervezési) DOM-on, 5 kontextusban (main 1300, xl 1440, medium 900, small 700, tiny 390)
   elemenként kiszámolja a nyertes deklarált értéket (saját specificitás-számítás, logikai→fizikai tulajdonságok,
   var()-os gyorsírások kibontása). A site CSS meglévő fs-/fo- szabályait is beszámolja.
3. `terv2.cjs` – terv: változók → beeco DS változók (sötét módhoz), láncok szerinti csoportosítás, eltérő
   kontextusú elemekhez combo osztály (fo-…), „szivárgás”-javítás (globális osztály illeszkedése combókra),
   töréspont-delták, maradék CSS (JS-állapotok, JS-elemek, sötét mód; vegyes szabályok `html body :where(...)`-ben).
   Szimulál: site CSS fs-szabályok nélkül + natív + maradék, és 7 szélességen összeveti a számolt stílusokat.
4. `igazit.cjs` – DOM ↔ Designer-elemfa összepárosítás (data-nk → elem-ID).
5. `muvelet.cjs` – Webflow-műveletlista (törlés, osztálylétrehozás, set_style, update_style) 25-ös csomagokban.

## Tanulságok
- whtml/stílus-eszköz: egyedi változó-definíció (`--x:`) nem írható; `-webkit-*`, `font-variant-emoji` sem.
- `:where()`-be pszeudo-elem nem tehető (érvénytelen lesz az egész szabály).
- A böngésző a `*::after`-t `::after`-ként sorosítja – a szelektor-elemzésnél pótolni kell a `*`-ot.
- Webflow töréspontok: medium ≤991, small ≤767, tiny ≤479, xl ≥1440; a régi 900/640/560-as határok sávjaiban (901–991, 480–640) kis elrendezés-eltolódás marad.

## Eredmény: főoldal-draft (2026-10-15)
- 48 új `fo-*` combo osztály, 157 elem-hozzárendelés, 317 stílusírás, 13 összetett érték kézzel (clamp, box-shadow, háttér-longhand).
- `valos.cjs` (élő staging vs. konverzió előtti HTML, 1440/1100/900/700/390): csak a lábnyomok véletlen elforgatása tér el (JS), a GYIK-nyíl háttere egy üres `none` réteggel rövidebb, vizuálisan azonos.
- A `valos.cjs` a `.w-embed` elemeket kihagyja az útvonal-indexből (különben a törölt embedek elcsúsztatják a kulcsokat).
