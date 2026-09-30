# Javaslat 05 – Méhecske, mozgás, szóvicc

*Állapot: **jóváhagyásra vár** · készítette: Claude · dátum: 2026-10-01 · Kristóf kérése: animációk, méhecskék funkcionális és érzelmi szerepben, méhes szóviccek a szövegekben – DS szinten.*
Vizuális javaslatlap (valódi méhecske-képekkel, lejátszható mozgás-mintákkal): `javaslatok/05-meh.html` – https://hegebeeco.github.io/beeco-design-system/javaslatok/05-meh.html

## Meglévőből
A 24 meglévő méhecske-kép (`web/assets/brand/`: 6 alap, 6 hangulat, 12 szerepes); új méhet nem rajzolunk (`docs/meh-szerepek.md`). A játékok mozgás-készlete (`web/css/ds-motion.css`) és a termékbőr időzítései.

## Elemek és változatok
| # | Téma | Változatok | Javaslat |
|---|---|---|---|
| 1 | Szereposztás | Házigazda (happy), Kalauz (help), Futár (super), Szurkoló (cheer), Bajnok (rank), Pihenő (rest), Gondolkodó (think), Hírvivő (phone), Hálás (love), Kacsintó (kacsint); Mérges: SOHA; Szomorú: csak a mi hibánk (szerverhiba); szekció-méhek az üres állapotokban | a táblázat szerint |
| 2 | Mennyi méh | A: csak „pillanatokban” (üres, siker, hosszabb töltés, hiba, első használat, mérföldkő, 404), képernyőnként ≤ 1 · B: mindig jelen (fejléc-méh) | **A** |
| 3 | Mozgás | megjelenés-zümmögés (3×180 ms), futár-töltés (> 1 mp, 10 mp után megáll), szurkoló (400 ms), lista-beúszás (200 ms, 30 ms késés, ≤ 6 sor), szám-felpörgés (600 ms, egyszer), mentve-pipa; oldalváltás, törölt sor kicsúszás + visszavonás, húzás-emelés, grafikon egyszeri felnövése | változat nélkül |
| 4 | Szóviccek | A: „fűszer” – csak a méhes pillanatokban, ≤ 1/képernyő, mindig a sima jelentéssel; soha gombban, hibateendőben, törlés-megerősítésben, jogi szövegben, szám mellett · B: bátran, gombokban is | **A** |
| 5 | DS-elemek | Bee, BeeMoment, szövegkészlet (`tokens/hangnem.json`, `say()`), `bc-motion.css` + `useCountUp`, `<Stagger>`, Button „mentve-pipa”, gépi szabályok, képek az npm-csomagban | változat nélkül |

## Döntés (Kristóf tölti ki)
- Dátum: …
- Választott változatok: …
- Megjegyzés / módosítás (pl. más szerep, kimaradó vagy új szóvicc): …
