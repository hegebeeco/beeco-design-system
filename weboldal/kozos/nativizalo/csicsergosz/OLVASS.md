# Natívizáló – CsicsergŐsz-változat (2026-10-15)

Eltérés a főoldali változattól: az oldal osztályai (cs_…, CARD, DIA_…) **közösek az élő oldallal**, ezért
meglévő osztályhoz nem nyúl. Minden elem, amelyen az oldal saját embed-CSS-e nyer, **új combo osztályt** kap (`cs2-…`),
és abba kerül a lapított érték. Az élő oldal így érintetlen, a JS-horgonyok (osztálynevek) is maradnak.

## Lépések
1. `jelol.py` – data-nk minden elemre, data-fs a body-beli w-embed `<style>` blokkokra.
2. `lapit.cjs` – minden site-szabály részt vesz a kaszkádban (site:1), gyökér: `body > [class*="dia_"]`;
   kontextusok: main 1300, xl 1440, medium 900, small 700, tiny 390 + sávellenőrzés 1100 és 1420 (nem Webflow-töréspontok).
   Elemenként a nyertes érték és az illeszkedő oldal-szabályok listája (`egy`).
3. `igazit.cjs` – DOM ↔ Designer-fa (kis-nagybetű független osztálynév; komponens-példány/embed alatti elemek kizárva).
4. `terv-cs.cjs` – csak ott ír, ahol az oldal CSS-e nyer; az érintett tulajdonságot minden kontextusban a nyertes értékkel írja
   (a site-nyertest is), hogy a combo ne borítsa fel a töréspontokat. Kódban marad: JS-sel változó illeszkedés,
   nem képernyőméret-alapú média (reduced-motion, hover), nem Webflow-sáv, feloldatlan változó, font-gyorsírás reset-longhandjei.
   **Deklaráció-szintű maradék**: egy szabályból csak a szükséges tulajdonságok maradnak kódban; sorrend-védelem: ha egy kódban
   maradó deklaráció illik egy natív elemre, az eredeti nyertes deklaráció is marad. Színek a CsicsergŐsz-változókra kötve
   (`--_csicsergosz---cs-…`). Szimuláció 8 szélességen.
5. `muvelet-cs.cjs` – ops/NN-*.json: létrehozás (combo a Designer-megjelenítési nevű szülőlánccal), elem-hozzárendelés, írás.

## Eredmény
- 166 új `cs2-` osztály, 283 elem, 275 írás (2259 tulajdonság, 136 változóra kötve).
- Oldal-CSS 69,5 KB → 16,8 KB kódban; a natív értékek ~5%-át írja felül kód (szerkesztési csapda).
- Szimuláció: 0 eltérés 1440/1300/1100/1420/900/700/500/390 px-en.
