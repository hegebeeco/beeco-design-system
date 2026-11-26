---
name: beeco-szovegezo
description: A beeco szövegírója és szövegellenőre – magyar, természetes, nem „AI-szagú” szöveg a beeco-nak. Használd MINDEN beeco weboldal-, hírlevél-, kampány-, app- (push, hibaüzenet, üres állapot), sales- és social-szövegnél, írás előtt és ellenőrzéskor; akkor is, ha „írj szöveget”, „nézd át a szöveget”, „AI-szagú?”, „magyartalan”, „fogalmazd át”, „hero-cím”, „CTA”, „GYIK”, „tárgysor” hangzik el. Benne: A jóváhagyó öt szabálya, a beeco hangja a szerkesztő élő szövegeiből, B2B személytelen és lakossági tegező regiszter, csatornánkénti útmutató, tiltólista átírásokkal, jó minták forrással és egy gépi ellenőrző (scripts/szoveg-ellenor.mjs), amely a beeco-weboldal-audit M06 bizonyítéka.
---

# beeco szövegező

## A jóváhagyó öt szabálya (ezek a legfőbbek)
1. légy tömör
2. őszinte, lényegretörő
3. könnyed, mégis professzionális, megbízható
4. néha mehet 1-2 beeco szóvicc
5. ne legyen AI-szagú az anyag, se ránézésre, se olvasva; ne ismételd magad feleslegesen, kerüld a nagyon AI-szagú mondatfogalmazásokat, törekedj változatos és emberi fogalmazásra

Ha valami ütközik, ez a sorrend dönt: a jóváhagyó (ügyvezető) döntése → ez az öt szabály → a Brand Book Hang és személyiség oldala (`docs-site/brand/marka-hang.json`) → ez a skill.

## A beeco hangja röviden
A szerkesztő (kommunikáció) élő szövegeiből (Csicsergősz- és Vízadás-oldal, beeco hírlevél 2026) és a Brand Bookból:

- **Mondathossz:** törzsszöveg 6–15 szó, cím 2–7 szó, gomb 1–4 szó. Egy blokk, egy gondolat.
- **Kezdés:** kérdés vagy helyzet az olvasó életéből: „Te felismered, ki csicsereg az ablakod alatt?” Vagy ünneplés: „Most téged ünneplünk!” Utána jön a megnyugtatás: „Nem ismerős a madárka? Nem gond!”
- **Törzs:** konkrétum, nem általánosság: „Az itatáshoz például egy sekély tál is elég.” Teendőnél rövid felszólító sor: „Tedd ki, tartsd tisztán, töltsd újra.”
- **Zárás:** egyetlen, igével kezdődő CTA („Szállj be te is!”, „Keresd az appban!”). Hírlevélben az állandó aláírás: „Ha úgy érzed, baj van, csatlakozz hozzánk, és beezz a rajban!”
- **Tipikus szavak:** szállj be, röppent, csicsereg, nektár, raj, ökos, kanna, locsolás, méh (= még). A „beeco” mindig kisbetűs, mondat elején és címben is (beecós, beecóval, beeco-csapat).
- **Kerülendő:** a tiltólista (`reference/tiltolista.md`), szorongással nyitni, túlzás, forrás nélküli szám.

## A tét: csak kimaradás (a jóváhagyó döntése, 2026-11-25, ToV F23)
A StoryBrand-váz hatodik eleme a tét: mi marad el, ha az olvasó nem lép. A beeco-szövegben ez **csak kimaradás** lehet:
- Jó: „Elúszik a heti kupon.” · „Egyedül maradsz a kérdéseiddel.” · B2B: „A helyi vásárló kimarad a boltból.”
- Rossz: katasztrófa, végzet, bűntudat, szorongást keltő tény („összeomlik a bolygó”, „késő lesz”, „miattad pusztul”).
- Egy szövegben legfeljebb egy ilyen mondat, és utána mindig a terv vagy a siker jön.
- A gépi ellenőrző `riogatas` szabálya a jellemző szavakat jelzi (16. pont a tiltólistán). A kimaradás mértékét és helyét kézzel nézd.
- Az egész váz csatornánként (web, App Store, Google Play, app, közösségi média): a ToV-oldal I–K része (`~/CLAUDE/beeco-app-tree/kepernyo-tervek/plans/tov/`).

## Két regiszter (a jóváhagyó döntése, 2026-11-04)
| | Lakossági | B2B |
|---|---|---|
| Hol | app, hírlevél, kampány, főoldal, social | önkormányzat, nagyvállalat, kkv, a `/szolgaltatas/*` hub és aloldalai, a menü „Szolgáltatások” oszlopai, az Ajánlatkérés-űrlap |
| Megszólítás | tegezés (te; csapatnak, településnek: ti) | **személytelen**: se tegezés, se magázás |
| Alany | te, mi | „a csapat”, „a település”, „a bolt”, „a cég”; infinitívusz vagy főnévi szerkezet is jó |
| Gomb | „Töltsd le az appot”, „Szállj be te is!” | „Ajánlatkérés”, „Bemutató kérése”, „Időpont egyeztetése” |
| Szóvicc | kb. 10 mondatból 1 | kb. 100 mondatból 4 |

Példák:
- Lakossági rossz: „Fedezd fel a madárvilágot egy innovatív, játékos élmény keretében.” → jó: „Figyeld meg, ki csicsereg körülötted.”
- B2B rossz: „Vond be a munkatársaidat, és vidd az eredményt a jelentésbe.” → jó: „A munkatársak az appban teljesítik a kihívásokat, a cég összesített eredményt kap a jelentéshez.”
- B2B rossz gomb: „Kérj ajánlatot” → jó: „Ajánlatkérés”.

B2B-szövegnél futtasd a szkriptet `--b2b` kapcsolóval: a tegező igealak, a „te/neked/nálad/a csapatod” és a felszólító E/2 is találat.

## App-regiszter (a jóváhagyó döntése, 2026-11-15)
Az app felhasználóinak szóló szöveg (gomb, hiba, üres állapot, siker, push, tipp, ökosság) lakossági, tegező regiszter. Részletes szabály: `~/CLAUDE/beeco_MOBILE_APP/docs/tartalom-muhely/app-tartalom-tov.md`.
- **Hossz:** a `reference/csatornak.md` „App és értesítések” táblája az irányadó (gomb 1–3 szó, hiba 1 mondat ok + 1 mondat teendő, push ≤ 60 karakter).
- **Szóvicc:** csak a `tokens/hangnem.json` pillanataiban (üdvözlés, mentve, üres lista, nincs találat, töltés, szerverhiba stb.). Gombon, hiba teendő-részén, törlés-megerősítésben, jogi szövegben és szám mellett soha. Képernyőnként legfeljebb egy méh és egy szóvicc.
- **Szószedet:** ökosság (nem okosság, nem daily fact), nektár, raj, kaptár; a beeco kisbetűs. Az appban érdekesség (nem funfact) és öntözés (nem locsolás); a kampányszlogenek és a web saját szóhasználata marad (Kristóf, 2026-11-15).
- **Ökosság (edukációs tartalom):** cím ≤ 60 karakter (az admin 100-at enged); a tartalom az adminapp blokkjaiból áll (H2/H3 címsor, kiemelés, lista, idézet, kép, MP4 videó, gomb; H1 és külső videó-beágyazás nincs); a források a szöveg alján, röviden, a törzsben nincs zárójeles hivatkozás (Kristóf, 2026-11-15); az admin Forrás mezője ≤ 255 karakter; nincs „kellene”, „majd”, „egyszerű”, „kutatások kimutatták”, bűntudatkeltés. Írási ívek típusonként: az Önkéntes tartalomkészítői útmutató 8. fejezete. Részletek: a ToV 5. szakasza.
- **Tiltott az appban:** „Kérjük” (tegező szövegben), „Sikeresen … került”, „Hiba történt.”, „Ismeretlen hiba”, „Sajnos” nyitás. Ezekre nincs gépi szabály, kézi körben nézd.
- **Nyitott (nem szabály még):** a push-szabály (≤ 60 karakter, napi egy) a csatornák táblában javaslat.

## Munkamenet
1. **Brief:** kinek szól (perszóna vagy B2B szerep), mi az egy cél, mi az egy CTA, melyik csatorna (`reference/csatornak.md`), melyik regiszter.
2. **Vázlat:** előbb nézd meg a `reference/mintak.md`-t és a szövegbank `kesz_mondatok` részét. Ha van jóváhagyott mondat, azt használd, ne írj újat.
3. **Gépi ellenőrzés:** `scripts/szoveg-ellenor.mjs` (lent).
4. **Kézi ellenőrzés:** olvasd fel hangosan. Mondaná így egy ember a pultnál? Nézd végig a tiltólistát és az ellenőrző listát (szövegbank `ellenorzo_lista`).
5. **Átírás**, aztán újra a 3. lépés.
6. **Jóváhagyás:** Claude ír és ellenőriz → a szerkesztő (Levi, kommunikáció) szerkeszt → a jóváhagyó (Kristóf) dönt. B2B-nél, árnál és állításnál a jóváhagyás kötelező. Amíg nincs jóváhagyva, a szöveg „javaslat”.
7. **Vissza a bankba:** a jóváhagyott mondat bekerül a `reference/mintak.md`-be és a szövegbankba, `statusz` és `forras` mezővel. Statusz: `javaslat` → `Levi szerkesztette` → `jóváhagyott`. A forrás oldal-URL vagy „hírlevél, ÉÉÉÉ-HH”, személyes adat nélkül.

## Szövegtípusok röviden
Csatornánként részletesen, hosszal és példával: `reference/csatornak.md`.
- **Hero-cím:** 2–7 szó, ige vagy kérdés, kettőspont és jelszópár nélkül. „Kövesd a csicsergést. Szállj be Te is!”
- **Lead:** 1–2 mondat, mit kap az olvasó, konkrétan. Ne ismételje a címet.
- **Kártya:** cím 1–4 szó, szöveg legfeljebb 2 mondat. A kártyák ne kezdődjenek ugyanazzal a szóval.
- **CTA-gomb:** 1–4 szó. Lakossági: igével, E/2-ben („Töltsd le az appot”). B2B: főnévvel („Ajánlatkérés”). Gombon nincs szóvicc.
- **GYIK:** a kérdés úgy szól, ahogy az olvasó kérdezné („Muszáj fényképet feltöltenem?”). A válasz az első szóval felel („Nem.”, „Igen.”), aztán jön egy-két mondat részlet.
- **Hírlevél:** „Szia [Név]!”, helyzetből vagy kérdésből indul, blokkonként egy téma és egy CTA, a végén az aláírás.
- **B2B ajánló:** személytelen. Tény és szám forrással, ár + ÁFA, megfelelést (CSRD) nem ígér, szóvicc ritkán.

## Szóvicc
- Fűszer, nem étel. Csak a `tokens/hangnem.json` pillanataiban (üdvözlés, mentés, mérföldkő, üres lista, töltés…) és a hírlevél vagy kampány címeiben, átkötéseiben.
- Képernyőnként vagy blokkonként legfeljebb egy. Gombra, hibaüzenet teendő-részébe, törlés-megerősítésbe, jogi szövegbe és szám mellé nem kerül.
- A mondatnak szóvicc nélkül is érthetőnek kell lennie (a `hangnem.json` minden poénjának van sima párja).
- Bevált: méh = még („Jövőre méh nagyobbat locsolunk!”, „és méh több!”), „A részleteket hamarosan elcsicsergjük!”, „Gyere és locsogjunk a locsolásról!”, „Röppenj rá, amíg a készlet tart!”, Beezz a rajban! A teljes lista a szövegbank `szoviccek` részében van.

## Gépi ellenőrző
```
NODE_PATH=<repó>/node_modules node .claude/skills/beeco-szovegezo/scripts/szoveg-ellenor.mjs <URL|fájl|-> [kapcsolók]
  --b2b      B2B regiszter: a tegezés/magázás is találat
  --json     [{szabaly, sulyossag, idezet, javaslat, hely}] (stabil alak; a beeco-weboldal-audit M06 olvassa)
  --ossz     {forras, szavak, blokkok, osszes, per_1000_szo, sulyossag{magas,kozepes,alacsony}, szabalyonkent{}}
  --max N    kilépési kód 1, ha N-nél több a találat
  --csak a,b csak ezek a szabályok · --teljes  URL-nél a menü és a lábléc is · --onteszt  beépített párok
```
- URL-nél Playwrighttal a `main` látható szövegét olvassa; nav, header, footer, űrlap és beágyazott CSS nélkül. Ha a `main` szinte üres, a body-t. Ha nincs Playwright, egyszerű letöltéssel dolgozik.
- Fájlnál: `.md` (`#` = cím, `-` = lista, `[Gomb]` = gomb, `>` = idézet), `.txt` vagy `.html`. Stdin-nél: `-`.
- 16 szabály, azonosítóik megegyeznek a tiltólistáéval: kettospont, jelszopar, pontos-harmas, nem-hanem, tukorforditas, szerepsor, tulhasznalt, ismetles, gondolatjel, hosszu-mondat, fonevi, azonos-szerkezet, beeco-nev, magazas (csak lakossági, `--b2b` nélkül), tegezes (csak `--b2b`), riogatas (2026-11-25).
- A `riogatas` bevezetésekor (2026-11-25) a beeco.hu főoldalán, a Csicsergősz-, a Vízadás-, a Rólunk- és a lábnyom-módszertan oldalon, valamint az új főoldal tesztcímén 0 találat volt.
- **Összesítés a hívónak:** `--ossz` adja; vagy a `--json` tömb hossza = találatok száma, `sulyossag` szerint csoportosítva (magas/kozepes/alacsony). Pontlevonást a hívó számol (az auditban M06, P2: pontot von, nem blokkol).
- Hangolás (2026-11-04): a beeco@work staging-oldalon 36 találat (B2B módban 62), a cégeknek staging-oldalon 38, a szerkesztő Csicsergősz-oldalán 4. Ha egy a szerkesztő által írt, élő szövegen sokat jelez, a szabály a hibás: lazítsd, és tedd az oldalt a tesztek közé.
- **Korlátai:** heurisztika, nem érti a jelentést. A tényeket, a számokat és a szóvicc helyét nem ellenőrzi. A „nincs találat” nem jelenti, hogy jó a szöveg, ezért a kézi kör kötelező.

## Adatvédelem (a repó publikus)
Nem kerülhet ide és a mintákba: e-mail-cím, telefonszám, magánszemély neve (Levi és Kristóf csak szerepként: szerkesztő, jóváhagyó), ár és belső üzleti adat, levélidézet. Hírlevélből csak rövid, nyilvános mondat mehet, forrással („hírlevél, 2026-10”).

## Kapcsolódó
- `docs-site/brand/marka-hang.json`: hang, személyiség, szóvicc-arány, megszólítások.
- `docs-site/brand/masolhato-szovegek.json`, `marka-pozicio.json`: hivatalos mondatok.
- `tokens/hangnem.json`: méhes pillanatok, poén + sima pár.
- `beeco-weboldal-audit`: az M06 („A beeco hangja és a feliratok érthetősége”) ezt a szkriptet használja gépi bizonyítéknak.
- `minosegkapu`: UI-munka kapuja; a felületi szövegeknél ez a skill a szövegrész.
