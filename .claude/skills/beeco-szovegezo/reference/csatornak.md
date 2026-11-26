# Csatornák: hossz, regiszter, példa, tipikus AI-hiba

Regiszter: **L** = lakossági, tegező · **B** = B2B, személytelen (a jóváhagyó döntése, 2026-11-04). A ✓ jelű példák élő, jóváhagyott beeco-szövegek. A „javaslat” jelűek Claude-tól vannak, ezekről a szerkesztő és a jóváhagyó dönt.

---

## Web

| Elem | Hossz | Regiszter | Jó példa | Tipikus AI-hiba |
|---|---|---|---|---|
| Hero-cím (H1) | 2–7 szó | L / B | ✓ „Kövesd a csicsergést. Szállj be Te is!” (Csicsergősz) · B, javaslat: „Zöld program a csapatnak, az appban” | jelszópár, kettőspont: „Ne csak állítsd. Tedd, mérd, mutasd meg.” |
| Lead | 1–2 mondat, ≤ 30 szó | L / B | ✓ „A beeco app segít felismerni a körülötted élő madarakat, és megmutatja, hogyan gondoskodhatsz róluk.” | a cím megismétlése, három főnév egymás után |
| Kártya | cím 1–4 szó, szöveg ≤ 2 mondat | L / B | ✓ „Itatás · Tedd ki, tartsd tisztán, töltsd újra.” | minden kártyacím ugyanazzal a szóval vagy vázzal kezdődik |
| CTA-gomb | 1–4 szó | L: ige E/2 · B: főnév | ✓ L: „Töltsd le az appot”, „Szólj, ha indulunk” · B: „Ajánlatkérés”, „Bemutató kérése”, „Időpont egyeztetése” | „Tudj meg többet”, „Kattints ide”, szóvicc a gombon, B2B-ben „Kérj ajánlatot” |
| GYIK | kérdés ≤ 10 szó, válasz 1–3 mondat | L / B | ✓ „Muszáj fényképet feltöltenem? · Nem. A fotó opcionális; a megfigyelést fotó nélkül is rögzítheted.” | a válasz nem a kérdésre felel, hanem reklámoz; „Kiváló kérdés!” |
| Szekció-szemöldök | 1–3 szó | L / B | ✓ „Nagy a baj”, „Rád is szükség van”, „És miért fontos ez?” | „A gond” / „Amit a beeco ad” / „Amit te nyersz” sablon |
| SEO title | 50–60 karakter, „… \| beeco” | L / B | ✓ „Madárvédelem egyszerűen: etetés, itatás, odú \| CsicsergŐsz, beeco” | kulcsszóhalmozás, „Fedezd fel a … világát” |
| SEO description | 120–155 karakter, 1–2 mondat, igével | L / B | javaslat: „Ismerd meg a körülötted élő madarakat, és segíts nekik itatással, etetéssel, odúval. Ingyenes beeco app, MME útmutatókkal.” | „Átfogó, innovatív megoldás…”, ismételt kulcsszó |

B2B-oldal (`/szolgaltatas/*`): a cím és a lead is személytelen. Javaslat: „A munkatársak az appban teljesítik a kihívásokat, a cég összesített eredményt kap a jelentéshez.” Tegező B2B-mondat (pl. „Vond be a munkatársaidat…”) nem maradhat.

## Hírlevél és kampány

| Elem | Hossz | Regiszter | Jó példa | Tipikus AI-hiba |
|---|---|---|---|---|
| Tárgysor | 30–50 karakter, legfeljebb 1 emoji a végén | L | ✓ „Elindult az Önkéntes Vízadás!🌊🌳” · ✓ „Indul a madárbarát kampányunk. Szállj be te is! 🐦” (hírlevél, 2026-05 / 2026-10) | „Fedezd fel legújabb kampányunkat, amely…” |
| Preheader | 40–90 karakter, a tárgysort folytatja | L | ✓ „Kvízezz velünk nyereményekért!🎁” · ✓ „Várunk a Vízadás záróeseményén.” (hírlevél, 2026-10) | a tárgysor szó szerinti ismétlése |
| Megszólítás és nyitás | 1–3 mondat | L | ✓ „Te felismered, ki csicsereg az ablakod alatt?” · ✓ „Most téged ünneplünk!” (hírlevél, 2026-10) | „Reméljük, jól vagy!”, „Izgalmas hírekkel jelentkezünk!” |
| Blokk-cím | 2–6 szó | L | ✓ „Indulhat a madárles!” · ✓ „Piacozz, kvízezz, nyerj!” · ✓ „Mivel készülünk méh?” (hírlevél, 2026) | „Újdonságok, amelyekről nem akarsz lemaradni” |
| Zárás | 1 CTA + állandó aláírás | L | ✓ „Gyere és locsogjunk a locsolásról!” · aláírás: „Ha úgy érzed, baj van, csatlakozz hozzánk, és beezz a rajban!” | „Reméljük, tetszett! Ne felejts el…” |
| Kampányszlogen | 2–5 szó | L | ✓ „Locsoljunk EGYÜTT!” · ✓ „Locsol a város!” · ✓ „Jövőre méh nagyobbat locsolunk!” | hármas staccato, angol tükör („Légy a változás része”) |

Hírlevélben 1–2 szóvicc mehet, tárgysorban legfeljebb egy. Szám csak forrással (záró közlemény, beeco térkép).

## App és értesítések

| Elem | Hossz | Regiszter | Jó példa | Tipikus AI-hiba |
|---|---|---|---|---|
| Push | ≤ 60 karakter, naponta legfeljebb egy | L | javaslat: „Szomjas fa a sarkon. Viszel neki vizet?” · javaslat: „Új madár az albumodban: széncinege!” | „Ne hagyd ki ezt a fantasztikus lehetőséget!” |
| Hibaüzenet | 1 mondat ok + 1 mondat következő lépés | L (admin/partner: B) | ✓ „Ez a mi hibánk. Próbáld újra egy perc múlva.” · ✓ „Hiányzik a @ utáni rész, például: nev@pelda.hu” (Brand Book) | „Hiba történt.”, szóvicc a teendő-részben |
| Üres állapot | poén + sima mondat + 1 teendő | L | ✓ „Itt még nem zümmög semmi.” + „Még nincs elem ebben a listában.” (`tokens/hangnem.json`) | „Úgy tűnik, itt még nincs semmi… de ne aggódj!” |
| Siker/mentés | 1–3 szó (+ sima pár) | L | ✓ „Bekaptároztuk!” / „Mentve.” (`tokens/hangnem.json`) | „Sikeresen mentésre került!” |
| Gomb | 1–3 szó, ige | L | ✓ „Mentés”, „Szállj be!” | szóvicc a gombon („Bekaptározom!”) |

## Sales és social

| Elem | Hossz | Regiszter | Jó példa | Tipikus AI-hiba |
|---|---|---|---|---|
| Ajánlat (e-mail, PDF) | 1 oldal; bekezdés ≤ 3 mondat | B | javaslat: „A Locsolóraj céges csapatnap a fiatal fákért, júniustól szeptemberig. Utána a cég hatásjelentést kap: liter, fa, résztvevő.” | „Átfogó, holisztikus megoldásunk szinergiát teremt…”; CSRD-megfelelés ígérete |
| Pitch (egy bekezdés) | 3–4 mondat | B | javaslat: „A beeco magyar zöld app és közösség. 2026-ban az Önkéntes Vízadásban 15 önkormányzat fái kaptak vizet a lakóktól. A cégek csapatnapon vagy egész évben, az appban csatlakoznak.” | „Forradalmasítjuk a fenntarthatóságot.” |
| LinkedIn-poszt | 3–6 rövid bekezdés, 1 kérdés vagy CTA, ≤ 3 hashtag | B (a beeco nevében: mi) | javaslat: „Kedden 38 kolléga locsolt velünk Budapesten. Fél nap alatt 42 fiatal fa kapott vizet. Melyik csapat jön következőnek?” (mintaszámok) | „Büszkén jelentjük be…”, „Íme 5 ok, amiért…”, emojis felsorolás minden sorban |
| Instagram-felirat | 1–3 mondat + CTA, ≤ 5 hashtag (#beeco kisbetűvel) | L | ✓ „A jó példa ragadós, mint a nektár! Légy te is ökohős!” (beeco.hu/letoltes) | hosszú, kettőspontos lista, „Swipe left” tükör |

Social: a szóvicc lakossági posztban kb. 10 mondatból 1, LinkedInen kb. 100-ból 4. A hashtagben a márkanév kisbetűs (`#beeco`), a többi szónál nagy kezdőbetűvel tagolj (`#ÖnkéntesVízadás`).
