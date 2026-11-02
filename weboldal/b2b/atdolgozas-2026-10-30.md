# beeco@work és Önkormányzatoknak: átdolgozás az Üzleti terv 2027 alapján (2026-10-30)

A Webflow-oldal az igazság; az `oldalak.py` ezeket a szekciókat már nem tükrözi (work: hero, kap, hogyan, adat, csomagok, gyik; onk: miert, kap, csomagok, gyik). A hero és a Hatásjelentés-minta, a számsáv, az eset és a komponensek változatlanok.

Forrás: Üzleti terv 2027 artifact (v3.3), 2–3. fejezet és a beeco@WORK / Önkormányzatoknak termékfül. Minták: Olio (modulok, szektorok, egy zárócélú CTA, nincs ár) és AWorld Evolve (eredmény-hero, használati esetek, 5 lépés, vezérlőpult-modulok, riport, nincs ár).

## beeco@work (6ad0ff9da66ec70398bb646a)
- Elköteleződés az első érv, az ESG-adat a második (mentori irány a tervben).
- Csak összesített adat, legalább 8 fős csoportra (Fundraising v3 §7).
- ESG: kiegészítő bizonyíték a munkavállalói részvételről; nincs CO2-ígéret, nincs „CSRD-kompatibilis”, az adat nem auditált (terv ESG-kutatás, 2026-10-30).
- Létra: Céges csapat a kampányban (250 000 Ft, 100 fő felett 490 000 Ft + ÁFA, Kristóf döntése 10.30.) → beeco@work pilot (egyedi) → éves előfizetés (implementációs díj + sávos fejdíj, összeg nélkül).
- Őszinte állapot: a beeco@WORK pilot szakaszban van, ezért pilot-partnereket keres; ügyfélnév és logó nincs (engedély kell).
- Névhasználat: a „beeco@work” csak az éves előfizetés; a kampányban induló csapat a „céges csapat”.

## Önkormányzatoknak (6ad0fec68742368ed2447e50)
- Négy feladat: zöld kommunikáció, imázs, a település zöld oldala, bevonás és elszámolás.
- Kampány (alapdíj + havidíj, jellemzően 4 hónap) vagy éves csomag (alap havidíj méret szerint + Vízadás-felár); szponzori hellyel. Összegek nincsenek kiírva (a 2027-es díjkép még kidolgozandó).
- A „Vízadás-csatlakozás ingyenes” állítás kikerült (hub, DS · Céges ajánlatok komponens, SEO, JSON-LD): a terv szerint az önkormányzat fizet.
- Nincs ígéret: ágyazható zöld térkép (nyitott funkció), fatúlélés (nincs mérve).

## Élesítés előtti kör (2026-11-02, Kristóf döntései)
- **Nincs ár egyik oldalon sem:** az árat az ajánlatban adjuk meg, 2 munkanapon belül. A csomagkártyák ár-helyén „Kérj ajánlatot” áll, a hero-chipek rejtve, a GYIK „Mennyibe kerül?” válasza egységes. A meta-leírásokból és a JSON-LD-ből (Offer, GYIK) is kikerült az ár. A JSON-LD-t a `bulk_update_pages_schema_markup` menti (az `update_page_settings` `jsonLdSchema` mezője csendben eldobja). Az önkormányzati kártyákon összeg nélküli díjszerkezet marad.
- **Hatásjelentés csak a Locsolórajhoz és az önkormányzati programhoz jár.** A többi programnál „rövid összefoglaló” szerepel; a beeco@work, a Madárraj és a Zöld programok oldalon a Hatásjelentés-szekció rejtve, a hubon a két termék néven nevezve.
- **Ajánlatkérő űrlap** (DS · Ajánlatkérés): név, cég, e-mail, telefon, érdeklődés, létszám, időpont, keret, üzenet.
- **Partner:** a kiemelés a „Hamarosan” csomagról az elérhető Zümi csomagra került; a képaláírás „Partnerünk, a Zöld Batyu” (a kép a weboldaluk képernyőképe).
- **Zöld marketing:** „Audittól a havi riportig”; a „2026-os szabályokhoz igazodik” helyett „hogy a zöld üzeneted hiteles és alátámasztható legyen”.
- **Menü:** a „Partnereknek” lenyíló alján „Cégeknek és településeknek: minden ajánlat ›”, Webflow-oldallinkként a hubra (slugcsere után is jó).
- **Megosztási képek:** oldalanként 1200×630-as JPG (`beeco-og-<oldal>.jpg` a Webflow-eszközök között), a hero-fotóból középre vágva. A Madárrajhoz márkás kártya készült (krém háttér, Lalezar, az app madártérképe), a hubhoz a meglévő kártya „Hatásjelentéssel” sora nélkül. Ok: az AVIF/WebP előnézetet a Facebook és a LinkedIn nem mindig mutatja.

## Élesítés előtti audit (2026-11-02 este)
Öt független ellenőrzés (UX, UI, marketing, termék és üzlet, technika); a jelentés és a fejlesztési javaslat Kristóf Claude Docs dokumentumában van. A teszt-oldalon javítva:
- **Űrlap:** a szövegmezők címkéi a mezőkhöz kötve (`for`); „Mikor indulátok?”; közös kiegészítő szkript (`weboldal/kozos/ajanlatkeres.js`): `generate_lead` a sikeres küldéskor, rejtett forrás- és UTM-mezők, termék-előválasztás.
- **Hub:** az ESG-csempe a Locsolórajra visz („Locsolóraj, Hatásjelentéssel”), a szövege „kisebb greenwashing-kockázattal”.
- **Fejléc a 14 céges oldalon:** a sárga gomb „Ajánlat” → `#ajanlatkeres` (a „Töltsd le!” elvitte a céges látogatót).
- **Menü és lábléc:** oldal-linkek az új Rólunk, Csapat, Hatásunk és céges oldalakra (a slugcsere után is jók); a Rólunk csoportban a Hatásunk a duplikált GYIK helyén.
- **Hero-címek:** `ds-cim1` sortáv 1,02 → 1,14, mert a `ds-kiemel` háttere levágta az előző sor betűinek alját.
