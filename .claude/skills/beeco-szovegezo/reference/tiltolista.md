# Tiltólista: AI-szagú és magyartalan minták

Minden mintánál: **rossz** (valódi ellenpélda a beeco staging-oldalairól, 2026-11, Claude írta) → **emberi átírás** → **miért rossz**. A `szabaly_id` a `scripts/szoveg-ellenor.mjs` szabály-azonosítója.
A B2B-átírások személytelenek (a jóváhagyó döntése, 2026-11-04). Az átírások javaslatok: a szerkesztő és a jóváhagyó dönt róluk.

Ellenpéldák forrása: `beeco-weboldal.webflow.io/szolgaltatas/beeco-at-work` és `/szolgaltatas/cegeknek` (staging).

---

## 1. Kettőspontos felvezetés · `kettospont`
| Rossz | Emberi átírás |
|---|---|
| Keresd meg magad: mindegyik programot a településedre, a csapatodra vagy a boltodra szabjuk. | Önkormányzat, cég vagy zöld kkv? Minden programot a településhez, a csapathoz vagy a bolthoz igazítunk. |
| Workshopok, közös akciók és a Vízadás: a beeco programjai a gyakorlatban. | Klímafreskó az irodában, locsolás a parkban, odúkészítés egy szombat délelőtt. |
| Ranglista, közös cél és nektárjutalom: a kollégák együtt csinálnak valamit, nem csak együtt dolgoznak. | A kollégák közös célért gyűjtik a nektárt, és a ranglistán látják, hol tart a csapat. |
| Zöld térkép, kuponok, helyi események és tanulás: a kollégák a mindennapokban is használhatják. | A zöld térképet, a kuponokat és az eseménynaptárat a kollégák munka után is használják. |

**Miért rossz:** a „címke: magyarázat” prezentációs dia nyelve, nem mondat. A felsorolás + kettőspont pedig az AI-szöveg egyik legerősebb jele. A „keresd meg magad” magyarul önismeretet jelent, nem azt, hogy „keresd meg, melyik programot választod”.
**Nem tilos:** címke és adat („Forrás: …”, „Szakmai partner: …”, „Most fut: CsicsergŐsz”), és a teljes mondat utáni magyarázó kettőspont („Iratkozz fel, és kéthetente küldünk egy levélkét: mire figyelj…” – a szerkesztő).

## 2. Jelszószerű pár · `jelszopar`
| Rossz | Emberi átírás |
|---|---|
| Szándék van, tett nincs | A kollégák szeretnének tenni valamit, csak nem tudják, mit. |
| Kihívás a zsebben, verseny a csapatban | A kollégák az appban teljesítik a kihívásokat, és csapatban versenyeznek. |
| Élmény a csapatnak, adat a jelentésbe | A csapat jól érzi magát, és a jelentéshez is lesz összesítő. |
| Előbb a csapat örüljön neki, utána jöhet az adat | Ha a kollégáknak tetszik, a riport is jó lesz. |

**Miért rossz:** két tükörszimmetrikus fél, ige nélkül. Reklámszlogennek hangzik, nem embernek. Egyszer még elmegy, három egymás után már gépies (lásd 12.).

## 3. Pontokkal tagolt hármas, „Ne csak…” · `pontos-harmas`
| Rossz | Emberi átírás |
|---|---|
| Bevonunk. Mérünk. Megmutatjuk. | A beeco megszervezi, a kollégák locsolnak vagy odút építenek, a végén jelentés készül arról, mi történt. |
| Ne csak állítsd. Tedd, mérd, mutasd meg. | Zöld a cég? Ezt egy szám mutatja meg a legjobban. |

**Miért rossz:** a háromszavas staccato és a hármas ritmus a gépi marketingszöveg tipikus fogása. A „Ne csak X” felütés kioktat, a beeco pedig nem kioktat, hanem melléd áll.

## 4. „nem X, hanem Y” / „…, nem Y.” · `nem-hanem`
| Rossz | Emberi átírás |
|---|---|
| A riport ebből készül, nem helyette. | A riport abból készül, amit a kollégák az appban csinálnak. |
| A riportálás egyszerűbb lett, nem szűnt meg | A riportálás egyszerűbb lett, de továbbra is kell. |
| …a kollégák együtt csinálnak valamit, nem csak együtt dolgoznak. | …a kollégák munkán kívül is csinálnak valamit együtt. |

**Miért rossz:** egy nem létező ellenvéleményt cáfol. Az olvasó nem állította, hogy a riport „helyette” készül. Mondd ki, ami igaz. Ha valóban kell az ellentét, írd „de”-vel.

## 5. Angol tükörszerkezet · `tukorforditas`
| Rossz | Angol minta | Emberi átírás |
|---|---|---|
| A program, amit a csapat tényleg csinál | The program your team actually does | Ezt a programot a kollégák végig is csinálják. |
| Amit te nyersz · Amit a beeco ad · A gond | What you get / What we give | És mi jár ezért a cégnek? (a szerkesztő mintája: „És miért fontos ez?”) |
| Ezt látják a kollégák a telefonjukon | This is what they see | Mi van az appban? |
| Így néz ki, amikor egy csapat együtt zöldül | This is what it looks like when… | Céges csapatok locsolás és odúkészítés közben |
| Ami a csapaté, és amit a jelentésbe vihetsz | What's yours and what you can take | Mit lát a cég az adatokból? |
| Kezdd egy csapattal, vidd az egész cégre | Start with one team, scale to the company | Előbb egy csapat próbálja ki, utána jöhet a többi. |
| Kezdd kicsiben, építkezz együtt velünk | Start small, build with us | Egy programmal kezdődik, a folytatásról ráér dönteni a cég. |
| Nem ez a te utad? Nézd meg a többit | Not your path? | Más program érdekel? Itt a teljes kínálat. |
| A csapatod együtt zöldül, és ez látszik is | …and it shows | Zöld program a csapatnak, az appban |
| Amit eddig közösen elértünk | What we've achieved together | Eddig ennyit locsoltunk, ültettünk, tanultunk |

**Miért rossz:** szóról szóra jó magyar, de magyar ember nem így mondja. Az „Amit…/Ami…” címkezdet és az „X, amit…” címszerkezet angol fejléc-sablon. Magyarul a kérdő cím vagy az egyszerű kijelentés a természetes.

## 6. Szerepsoros mondat · `szerepsor`
| Rossz | Emberi átírás (B2B, személytelen) |
|---|---|
| HR-ként közös élményt és mérhető részvételt kapsz, ESG-felelősként összesített adatot a jelentéshez, vezetőként egy programot, amiről a csapat beszél. | A HR közös programot kap, az ESG-jelentéshez összesített számok járnak. És lesz miről beszélni a kávégépnél. |

**Miért rossz:** egy mondatba zsúfolt perszóna-mátrix, a „-ként” háromszor ismétlődik. Szerepenként egy rövid mondat, vagy csak a legfontosabb szerep.
**Nem tilos:** a puszta felsorolás („Cégként, önkormányzatként és iskolaként is be tudtok szállni.”).

## 7. Túlhasznált szavak · `tulhasznalt`
Mindig gyanús: **tényleg, valódi/valós, valójában, igazán, kézzelfogható, zökkenőmentes, kulcsfontosságú, egyedülálló, átfogó, „a gyakorlatban”, „nem titok”**.
Oldalanként legfeljebb kétszer: **mért/mérhető, egyszerű(en), könnyed(én), hiteles, igazolt, izgalmas, inspiráló, élmény**.

| Rossz | Emberi átírás |
|---|---|
| …mozgósítjuk valódi zöld tettekre. Megmérjük, mit tettek, és mért eredményt kapsz… | …locsolni, odút építeni, kihívást teljesíteni hívjuk őket. A végén liter, fa és résztvevő szerint látszik, mi történt. |

**Miért rossz:** a „valódi” és a „tényleg” azt sugallja, hogy máshol hamis. A „mért” szám nélkül üres. Helyette jöjjön a konkrétum: szám, hely, idő, eszköz.

## 8. Ismétlés · `ismetles`
| Rossz | Emberi átírás |
|---|---|
| …összesített riport… összesített riport… összesített adatot… (egy oldalon hatszor) | Egyszer kimondod („a riport csak csoportszintű adatot mutat”), utána „a riport”. |
| Több mint egymillió liter… több mint 2200-an… több mint ezer alkalommal… | Egymillió liter fölött… 2200-nál is többen… ezernél is többször… |

**Miért rossz:** A jóváhagyó egy 2026. októberi közlemény-vázlatnál is ezt jelezte: ugyanaz a fordulat ne ismétlődjön. Az AI egy kulcskifejezést blokkonként újrahasznosít, az ember változtat rajta.

## 9. Gondolatjeles betoldás, em dash · `gondolatjel`
| Rossz | Emberi átírás |
|---|---|
| A program — amit a kollégák imádnak — havonta frissül. | A program havonta frissül. A kollégák szeretik. |

**Miért rossz:** az em dash (—) angol tipográfia. A magyar gondolatjel szóközös nagykötőjel ( – ). A mondat közepébe ékelt betoldás nehezíti az olvasást, két rövid mondat jobb.

## 10. Túl hosszú · `hosszu-mondat`
Mondat legfeljebb 25 szó, cím legfeljebb 10, gomb legfeljebb 4 (névelő nélkül).
| Rossz | Emberi átírás |
|---|---|
| Az éves beeco@work díja implementációs díjból és az aktív felhasználók száma szerinti havi díjból áll: erre egyedi ajánlatot adunk… | Az éves díj két részből áll: egyszeri indítási díjból és havi díjból. A havi díj az aktív felhasználók számától függ. |

## 11. Főnévi, hivatali stílus · `fonevi`
| Rossz | Emberi átírás |
|---|---|
| A beeco@work az elköteleződésre épül. | A beeco@work-ben a kollégák maguk is akarnak részt venni. |
| Lakossági bevonás plakátokkal, az appal és közös locsolásokkal. | A lakók plakátról, az appból és közös locsolásokon hallanak a programról. |
| Kiegészítő bizonyítékot adunk a munkavállalói részvételről… | Megmutatjuk, kik vettek részt, és melyik kihívásban. |

**Miért rossz:** a főnevesítés („bevonás”, „elköteleződés”, „biztosít”, „-ásra kerül”) hivatali, élettelen. Igével mondd, és legyen alanya.

## 12. Azonos szerkezet egymás után · `azonos-szerkezet`
| Rossz | Emberi átírás |
|---|---|
| Szándék van, tett nincs · Kihívás a zsebben, verseny a csapatban · Élmény a csapatnak, adat a jelentésbe | Egy kérdés, egy kijelentés, egy felszólítás: „Miért nem működik a legtöbb céges zöld program?” · „A kollégák az appban teljesítik a kihívásokat.” · „Nézd meg, mit kap a cég.” |
| A gond / Amit a beeco ad / Amit te nyersz | A szerkesztő mintája: „Nagy a baj” → „És miért fontos ez?” → „Rád is szükség van” |

**Miért rossz:** a probléma–megoldás–haszon sablon és a három azonos vázú cím ránézésre gépies. A szkript a két „Amit…” kezdetű címet és a három egymást követő pár-címet jelzi; a többit a kézi kör fogja meg.

## 13. A beeco nevének írása · `beeco-nev`
| Rossz | Jó |
|---|---|
| Beeco appal könnyebb. · A BEECO csapata segít. | A beeco appal könnyebb. · A beeco-csapat segít. |

**Miért:** a „beeco” mindig kisbetűs, mondat elején, címben és logó mellett is (Brand Book, Hang és személyiség, Közösségi média). Ragozva: beecós, beecóval, beeco-csapat. Kivétel csak a jogi cégnév (a szkript a „Kft./Zrt.” előtti alakot nem jelöli; a bejegyzett alakot a jóváhagyó adja meg).

## 14. Tegezés B2B-szövegben · `tegezes` (csak `--b2b`)
| Rossz | Jó (személytelen) |
|---|---|
| Kérj ajánlatot, és 2 munkanapon belül megkapod a csapatodra szabott árat. | Az ajánlatot 2 munkanapon belül küldjük, a csapat létszáma alapján. |
| Mit kap a csapatod? | Mit kap a csapat? |
| Egyéni adatot nem látsz. | A cég egyéni adatot nem lát. |
| Gomb: Kérj ajánlatot · Bemutatót kérek | Gomb: Ajánlatkérés · Bemutató kérése · Időpont egyeztetése |

**Miért:** a jóváhagyó döntése (2026-11-04): a B2B-szöveg személytelen, se tegezés, se magázás. Az alany „a csapat”, „a település”, „a bolt”, „a cég”. Ide tartozik a `/szolgaltatas/*`, a menü „Szolgáltatások” oszlopai és az Ajánlatkérés-űrlap.
## 15. Magázás lakossági szövegben · `magazas` (`--b2b` nélkül)
| Rossz | Jó |
|---|---|
| Fedezze fel a madárvilágot! | Figyeld meg, ki csicsereg körülötted. |
| Az e-mail nem megfelelően jelenik meg? Tekintse meg a böngészőben. (hírlevél-sablon alapszövege) | Nem jól látszik a levél? Nyisd meg a böngészőben. |
| Ha le akar iratkozni, kattintson ide. (hírlevél-sablon alapszövege) | Ha nem kérsz több levelet, itt leiratkozhatsz. |

**Miért:** a lakossági szöveg tegez (Brand Book). A levelezőprogram gyári magázós sorait is írd át.

## 16. Riogatás, katasztrófa-tét · `riogatas`
| Rossz | Jó |
|---|---|
| Ha most nem lépsz, a bolygó összeomlik, és késő lesz. | Ha most nem töltöd le, elúszik a heti kupon. A térképen viszont már ma megtalálod a legközelebbi zöld boltot. |
| Ne hagyd, hogy miattad pusztuljon a természet. | Egy lépés ma, a raj holnap is veled tart. |
| B2B: A zöld fordulatot lekéső boltok eltűnnek. | B2B: A zöld boltot kereső helyi vásárló ma még a térképen sem találja meg. |

**Miért:** a StoryBrand kéri a tétet (mi marad el, ha nem lép), a márkakönyv tiltja a riogatást. A jóváhagyó döntése (2026-11-25, ToV F23): a tét csak kimaradás lehet, katasztrófa, bűntudat és szorongást keltő tény soha. Egy szövegben legfeljebb egy ilyen mondat, utána a terv vagy a siker jön. A szkript szó eleji egyezéssel keres (katasztróf-, apokalip-, pusztul-, pusztít-, összeoml-, haldokl-, végzet-, tragédi-, retteg-, riasztó, ijesztő, pánik, kihal-, visszafordíthatatlan, „túl késő”, „késő lesz”, „miattad”…), így az „erdőpusztítás” vagy a „veszélyes hulladék” nem találat, a „kihalófélben” szakkifejezés kimarad.

## 17. App-szövegek kézi tiltásai (nincs gépi szabály)
| Rossz (valódi app-szöveg, `hu.json`) | Jó (javaslat) |
|---|---|
| Ismeretlen hiba történt. Kérjük próbáld újra! | Ez a mi hibánk. Próbáld újra egy perc múlva. |
| Sikeresen kimásolva a vágólapra! | Kimásolva. |
| A felhasználó törlése közben hiba lépett fel. Kérjük próbáld újra később! | Nem sikerült törölni a fiókodat. Próbáld újra később. |
| Sajnos elég magas a lábnyomod, de ne csüggedj, alul megmutatjuk, hogy tudod egyszerűen csökkenteni! | A lábnyomod még magas. Lent látod, mit érdemes először változtatnod. |

**Miért:** a „Kérjük” tegezéssel keveredik, a „Sikeresen … került” hivatali, a „Sajnos” nyitás szorongással kezd, az „egyszerűen” azt sugallja, hogy aki nem boldogul, az hibás. Forrás: app-tartalom ToV (jóváhagyva 2026-11-15).

