"""B2B sales- és esemény-aloldalak tartalma (a gen_b2b.py sales_oldal / esemeny_oldal sablonjához).
Szabályok: tegezés, nincs gondolatjel, rövid igés gomb, minden szám a szamok.json-ból vagy jelölt mintaadat,
nincs általános zöld állítás és kompenzációs állítás. Ár csak ott, ahol a mostani oldalon is szerepel; máshol „Kérj ajánlatot”."""
import re
PRIV = '<a class="ds-szoveglink" href="/privacy-policy">Adatkezelési tájékoztató ›</a>'
OMNIBUS = 'https://www.aoshearman.com/en/insights/agreement-on-the-csrd-cs3d-omnibus-package-key-changes-and-implications'
K = lambda s: s.replace('[', '<span class="ds-kiemel">').replace(']', '</span>')  # [kiemelés] a címben

SALES = [
 # ---------------- Önkormányzatoknak ----------------
 dict(k='onk', slug='onkormanyzatoknak', seo_nev='Települési csomag önkormányzatoknak',
  cim='Önkormányzatoknak: lakossági faöntözés és zöld programok | beeco',
  leiras='Mozgósítsd a lakókat: önkéntes faöntözés, madárbarát kertek, helyi zöld térkép, éves Hatásjelentéssel. A Vízadás-csatlakozás ingyenes.',
  szalag='Önkormányzatoknak', h1=K('Lakók, akik [megmentik a fákat]'),
  lead='A beeco mozgósítja a lakóidat: fiatal fákat öntöznek, madárbarát kerteket építenek, zöld programokra járnak. Te pedig év végén számokkal mutatod meg az eredményt.',
  gomb2=('#csomagok', 'Csomagok'), chipek=['15 partner-önkormányzat', '784 352 liter víz 2026 nyarán', 'Szakmai partner: ÉTOSZ'],
  foto=('bee-change', 'Két önkéntes háttal, bee the change feliratú beeco pólóban', 'Önkéntes Vízadás'),
  miert=dict(h2='A fiatal fák a lakókon múlnak', kartyak=[
    ('Az első nyarak a legnehezebbek', 'A frissen ültetett fák az első években a legsérülékenyebbek. Ha aszályban nem kapnak vizet, a telepítés munkája és költsége is elvész.', None, None),
    ('A lakók szívesen segítenek', 'Csak tudniuk kell, hol és mikor. Az appban látják a szomjas fákat, rögzítik az öntözést, és nektárt kapnak érte.', None, None)]),
  kap=dict(h2='Egy csomag, egész évre', items=[
    ('kanna', 'Önkéntes Vízadás', 'Nyáron a lakók a térképen találják meg a szomjas fákat. Te látod, hol, mennyit és kik öntöztek.'),
    ('madarpont', 'Madárbarát település', 'Ősszel és télen odúk, etetők és madárbarát kertek a CsicsergŐsz-kampányban, szakmai segítséggel.'),
    ('terkep', 'Helyi zöld térkép', 'A településed zöld pontjai, programjai és kuponjai egy helyen, az appban.')]),
  lepes=dict(h2='Négy lépés a csatlakozástól a jelentésig', items=[
    ('Bemutatkozunk', 'Online vagy személyesen megmutatjuk az appot és a kampányokat.'),
    ('Felkerülnek a fák', 'A településed fái és vízvételi helyei bekerülnek a térképre.'),
    ('Szólunk a lakóknak', 'Közösen hirdetjük a kampányt a település csatornáin és az appban.'),
    ('Megkapod a jelentést', 'Szezon végén liter, fa és vízadó, forrással, a testületnek is érthetően.')]),
  csomag=dict(h2='Kezdd ingyen, építkezz évről évre', lead='A belépő ingyenes. Ha működik, egész évre bővítjük, majd saját kampánnyá.', items=[
    ('Belépő', 'Csatlakozás a Vízadáshoz', 'Ingyenes', ['A településed fái a térképen', 'Lakossági öntözés az appban', 'Szezonzáró összesítő']),
    ('Mag', 'Éves Települési csomag', 'Kérj ajánlatot', ['Vízadás és CsicsergŐsz egész évben', 'Helyi zöld térkép és programok', 'Éves Hatásjelentés']),
    ('Partnerség', 'Saját helyi kampány', 'Kérj ajánlatot', ['A település nevével futó kampány', 'Lakossági programok és díjazás', 'Közös sajtó és megjelenés'])],
   megjegyzes='<strong>Pályázathoz:</strong> a Hatásjelentés számai eredménymutatóként is használhatók.'),
  jelentes=dict(lead='Szezon végén egy jelentést kapsz, amit a testület, a lakók és a pályázat is megért.',
   cim='Önkéntes Vízadás 2026 · Mintaváros', alcim='egy nyári szezon',
   szamok=[('18 600', 'liter víz a fiatal fáknak'), ('210', 'megöntözött fa'), ('96', 'lakó vízadó'), ('640', 'rögzített öntözés')],
   modszer='öntözések az appban rögzítve, fotóval; a fák a település fakataszteréből.',
   mondhatod='Mintaváros lakói 2026 nyarán 18 600 liter vizet adtak 210 fiatal fának.',
   keruld='„Klímasemleges település vagyunk.” Ezt egy öntözési kampány nem igazolja.'),
  szamok=['onkormanyzat', 'vizadas_liter', 'vizadas_fo', 'vizadas_ontozes'], extra=['eset', 'partnerek'],
  gyik=[
   ('Mennyibe kerül?', 'A csatlakozás az Önkéntes Vízadáshoz ingyenes. Az éves Települési csomag és a saját kampány ára a település méretétől és a választott programoktól függ, erre egyedi ajánlatot adunk.'),
   ('Kell hozzá saját munkatárs?', 'Egy kapcsolattartó elég, aki megadja a fák adatait és segít a lakossági hirdetésben. A kampányt mi visszük.'),
   ('Kik öntöznek?', 'A település lakói, önkéntesen, az appon keresztül. Céges csapatok is beszállhatnak a Locsolóraj programmal.'),
   ('Mire használható a jelentés?', 'Testületi beszámolóhoz, lakossági kommunikációhoz és pályázatok eredménymutatójaként.'),
]),

 # ---------------- beeco@work ----------------
 dict(k='work', slug='beeco-at-work', seo_nev='beeco@work munkahelyi zöld program',
  cim='beeco@work: munkahelyi zöld program havi Hatásjelentéssel | beeco',
  leiras='Közös zöld kihívások, a csapat lábnyoma és nektárverseny a beeco appban, havi Hatásjelentéssel HR-nek és ESG-nek. Kezdd 3 hónapos próbával.',
  szalag='beeco@work', h1=K('A csapatod [együtt zöldül,] és ez látszik is'),
  lead='Munkahelyi program a beeco appban: közös zöld kihívások, a csapat lábnyoma, nektárverseny és havi Hatásjelentés. Kis lépések, amik összeadódnak.',
  gomb2=('#csomagok', 'Csomagok'), chipek=['Próba: 3 hónap, 1 csapat', 'Havi Hatásjelentés', '25.000+ letöltés'],
  foto=('https://cdn.prod.website-files.com/648ebb1f9ae84f3d530e2f2d/67a8b4abcb94fb7296b55d9d__DSC4125.avif', 'Emberek egy kávézóban tapsolnak egy prezentáció közben', 'Közös program, közös eredmény'),
  miert=dict(h2='Elköteleződés és hiteles adat egyszerre', kartyak=[
    ('A csapatépítő egy nap, a szokás egy év', 'Egy közös program jó élmény, de a hatása elmúlik. A beeco@work a hétköznapokba viszi a zöld döntéseket, és mutatja a haladást.', None, None),
    ('Adat a jelentésedhez', 'Az önkéntes, VSME szerinti riportáláshoz egyszerű munkavállalói és közösségi adat kell. A havi jelentés ezt adja, módszertannal.', OMNIBUS, 'A&O Shearman: CSRD Omnibus')]),
  kap=dict(h2='Ami a csapatodé lesz', items=[
    ('telefon', 'Céges csapat az appban', 'Saját csapat zöld kihívásokkal és nektárversennyel a kollégák között.'),
    ('lab', 'Közös lábnyom', 'Mindenki a sajátját látja a lábnyomkalkulátorban, a cég pedig az összesítettet, név nélkül.'),
    ('kupa', 'Havi Hatásjelentés', 'Résztvevők, teljesített kihívások, becsült változás, forrással és kész mondatokkal.')]),
  lepes=dict(h2='Így indul a programod', items=[
    ('Bemutató', 'Megmutatjuk az appot és a programot a HR- vagy ESG-csapatnak.'),
    ('Csapatindítás', 'Létrehozzuk a céges csapatot, és meghívjuk a kollégákat.'),
    ('Havi kihívások', 'Minden hónapban új zöld kihívás, ranglistával és nektárral.'),
    ('Jelentés', 'Havonta összesítő, negyedévente rövid beszélgetés az eredményekről.')]),
  csomag=dict(h2='Próbáld ki egy csapattal', lead='Kezdd kicsiben, és ha beválik, vidd az egész cégre.', items=[
    ('Belépő', '3 hónapos próba', 'Kérj ajánlatot', ['Egy csapat, egy kapcsolattartó', 'Havi kihívások', 'Záró Hatásjelentés']),
    ('Mag', 'Éves előfizetés', 'Kérj ajánlatot', ['Az egész cég egy csapatban', 'Havi Hatásjelentés', 'Negyedéves eredmény-beszélgetés']),
    ('Partnerség', 'Egész cégre, saját arculattal', 'Kérj ajánlatot', ['Saját kihívások a cég céljaihoz', 'Céges arculat az appban', 'Közös kampány és sajtó'])]),
  jelentes=dict(lead='Havonta egy rövid jelentés, ami a HR-nek és az ESG-nek is mond valamit.',
   cim='beeco@work · Minta Példa Kft.', alcim='egy hónap, egy céges csapat',
   szamok=[('64', 'aktív munkatárs'), ('212', 'teljesített zöld kihívás'), ('1 840', 'gyűjtött nektár'), ('9%', 'becsült lábnyom-csökkenés')],
   modszer='kihívások az appban rögzítve; a lábnyom a kalkulátor módszertana szerint, becsült érték.',
   mondhatod='Októberben 64 munkatársunk 212 zöld kihívást teljesített a beeco appban.',
   keruld='„Csökkentettük a cég szén-dioxid-kibocsátását.” A becsült egyéni lábnyom nem céges kibocsátás.'),
  szamok=['letoltes', 'zold_pont', 'esemeny_resztvevo'],
  gyik=[
   ('Mennyibe kerül?', 'A próba és az éves előfizetés ára a létszámtól függ, erre egyedi ajánlatot adunk.'),
   ('Mennyi munka ez a HR-nek?', 'Egy kapcsolattartó kell. A kihívásokat, a ranglistát és a jelentést mi készítjük elő.'),
   ('Mi van a munkatársak adataival?', 'A jelentésben csak összesített adat szerepel, név szerinti adat nem. ' + PRIV),
   ('Megfelel ez a CSRD-nek?', 'Adatot ad a jelentésedhez a VSME munkavállalói témáihoz. Megfelelést nem ígérünk, azt a riportod adja.'),
]),

 # ---------------- Madárraj ----------------
 dict(k='madar', slug='madarraj', seo_nev='Madárraj céges csapatnap',
  cim='Madárraj: céges csapatnap odúkészítéssel és madársétával | beeco',
  leiras='Odú- és etetőkészítés, madárbarát telephely és madárséta szakmai vezetővel, októbertől márciusig. Csapatnap, amiből a madarak is profitálnak.',
  szalag='Madárraj · októbertől márciusig', h1=K('Csapatnap [a madarakért]'),
  lead='Odút és etetőt készítetek, kihelyezitek a telephelyen vagy egy partner-településen, és madársétán megismeritek a lakóit. Szakmai segítséggel, a CsicsergŐsz-kampány részeként.',
  gomb2=('#csomagok', 'Csomagok'), chipek=['Októbertől márciusig', 'Fél napos program', 'Szakmai partner: MME'],
  foto=('https://cdn.prod.website-files.com/648ebb1f9ae84f3d530e2f2d/6ac9369469460ac020d27540_cs-app-terkep.webp', 'A beeco app térképe madármegfigyelésekkel, itatókkal és odúkkal', 'Odúk és etetők a térképen'),
  kap=dict(h2='Mit csinál a csapatod?', items=[
    ('madarpont', 'Odú és etető saját kézzel', 'Előkészített elemekből, szerszámmal és segítséggel. Mindenkinek sikerül.'),
    ('fa', 'Madárbarát telephely', 'Az odúk és etetők a ti udvarotokba vagy egy partner-településre kerülnek, a térképen jelölve.'),
    ('sziv', 'Madárséta', 'Szakmai vezetővel megismeritek, kik költözhetnek be az odúkba.')]),
  lepes=dict(h2='Fél nap, előkészítve', items=[
    ('Egyeztetünk', 'Létszám, időpont, helyszín: nálatok vagy egy partner-településen.'),
    ('Mi készülünk', 'Anyag, szerszám, szakmai vezető: minden a helyszínre érkezik.'),
    ('Építetek és kihelyeztek', 'Csapatban készülnek az odúk és az etetők, majd a helyükre kerülnek.'),
    ('Megkapod a jelentést', 'Hány odú, etető, résztvevő és óra, fotókkal és kész mondatokkal.')]),
  csomag=dict(h2='Egy délutántól a névadó támogatásig', items=[
    ('Belépő', 'Odú- és etetőkészítő délután', 'Kérj ajánlatot', ['Anyag és szerszám', 'Szakmai vezetés', 'Rövid jelentés']),
    ('Mag', 'Madárbarát telephely', 'Kérj ajánlatot', ['Odúk és etetők a telephelyen', 'Madárséta szakmai vezetővel', 'Hatásjelentés']),
    ('Partnerség', 'CsicsergŐsz-támogató', 'Kérj ajánlatot', ['Névadó támogatás a kampányban', 'Megjelenés az appban', 'Közös sajtó'])]),
  jelentes=dict(lead='A nap végén nem csak élmény marad: számok, fotók és mondatok, amiket bátran használhatsz.',
   cim='Madárraj 2026 · Minta Példa Kft.', alcim='egy délután, budapesti telephely',
   szamok=[('24', 'kihelyezett odú'), ('12', 'madáretető'), ('31', 'résztvevő munkatárs'), ('93', 'önkéntes óra')],
   modszer='odúk és etetők a helyszínen fotózva és a térképen jelölve; a résztvevők a jelenléti ív alapján.',
   mondhatod='31 munkatársunk 24 madárodút és 12 etetőt készített és helyezett ki a telephelyünkön.',
   keruld='„Megmentettük a madarakat.” Túlzó, nem mérhető állítás.'),
  extra=['partnerek'],
  gyik=[
   ('Hol tartjuk?', 'Nálatok, ha van udvar vagy kert, vagy egy partner-településen, ahová az odúk kerülnek.'),
   ('Kell hozzá ügyesség?', 'Nem. Előkészített elemekből dolgozunk, és végig segítünk.'),
   ('Miért ősszel és télen?', 'Az odúkat a költési időszak előtt érdemes kihelyezni, az etetés pedig a hideg hónapokban segít a madaraknak.'),
   ('Mennyibe kerül?', 'A létszámtól és a helyszíntől függ, erre egyedi ajánlatot adunk.')]),
]

CDN = 'https://cdn.prod.website-files.com/648ebb1f9ae84f3d530e2f2d/'
import json as _j, os as _os
_SZ = _j.load(open(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), 'szamok.json')))
N = lambda k: _SZ[k]['ertek']

SALES += [
 # ---------------- Locsolóraj ----------------
 dict(k='locsolo', slug='locsoloraj', seo_nev='Locsolóraj céges faöntöző csapatnap',
  cim='Locsolóraj: céges faöntöző csapatnap az Önkéntes Vízadásban | beeco',
  leiras='Öntözzétek a környék fiatal fáit a kollégákkal, júniustól szeptemberig. Csapatnap, vízvételi hely vagy névadó támogatás, Hatásjelentéssel.',
  szalag='Locsolóraj · júniustól szeptemberig', h1=K('Csapatnap, ami [fákat ment]'),
  lead='Öntözzétek a környék fiatal fáit a kollégákkal munka előtt, közben vagy után, az ország első közösségi faöntöző kampányában. Az appban látjátok a szomjas fákat, minden mást mi készítünk elő.',
  gomb2=('#csomagok', 'Csomagok'), chipek=['Júniustól szeptemberig', N('vizadas_liter') + ' liter víz 2026-ban', 'Névadó támogató 2026: E.ON'],
  foto=(CDN + '68fe93f9435fbeb9f73fcd83_552734046_785087530829592_1133945939025093519_n.avif', 'Vidám csoport zöld fák alatt egy locsolónapon', 'Önkéntes Vízadás'),
  miert=dict(h2='Egy fa, egy kanna, egy csapat', kartyak=[
    ('A fiatal fák nyáron szomjaznak', 'Egy fiatal fa egy öntözéskor körülbelül 50 liter vizet kér. Csapatban, több körben ez könnyű, és közösségi élmény is.', None, None),
    ('Legyen a telephelyed vízvételi hely', 'Kevés a csap és a kút faöntözéshez. Ha van nálatok egy csap, a környék fáinak gondozói nálatok tölthetnek.', None, None)]),
  kap=dict(h2='Három módon szállhattok be', items=[
    ('kanna', 'Locsolónap', 'Szervezett csapatnap a környék fáinál, útvonallal, eszközökkel és rövid bevezetővel.'),
    ('csepp', 'Vízvételi hely', 'A telephelyetek vízvételi pontként felkerül a térképre.'),
    ('kupa', 'Eredmény és jelentés', 'Liter, fa, résztvevő: a csapatotok eredménye az appban és a jelentésben.')]),
  lepes=dict(h2='Négy lépés a locsolónapig', items=[
    ('Egyeztetünk', 'Időpont, létszám és a környék fái a térképen.'),
    ('Előkészítünk', 'Útvonal, eszközlista, vízforrás és rövid eligazítás.'),
    ('Öntöztök', 'A fákat az appban rögzítitek, fotóval.'),
    ('Megkapod a jelentést', 'Liter, fa, résztvevő és óra, kész mondatokkal.')]),
  csomag=dict(h2='Egy naptól a névadó támogatásig', items=[
    ('Belépő', 'Egy céges locsolónap', 'Kérj ajánlatot', ['Útvonal és eszközlista', 'Rögzítés az appban', 'Rövid jelentés']),
    ('Mag', 'Szezon', 'Kérj ajánlatot', ['3 locsolónap a nyáron', 'Vízvételi hely a telephelyen', 'Szezonzáró Hatásjelentés']),
    ('Partnerség', 'Névadó támogató', 'Kérj ajánlatot', ['Egy kerület vagy település fái', 'Megjelenés az appban és a kampányban', 'Közös sajtó'])]),
  jelentes=dict(lead='A szezon végén pontosan látod, mennyi vizet és hány fát jelentett a csapatotok munkája.',
   cim='Locsolóraj 2026 · Minta Példa Kft.', alcim='3 locsolónap, Budapest',
   szamok=[('12 400', 'liter víz a fiatal fáknak'), ('42', 'megöntözött fa, a térképen ellenőrizhető'), ('38', 'résztvevő munkatárs'), ('114', 'önkéntes óra')],
   modszer='öntözések az appban rögzítve, fotóval; a fák a FŐKERT fakataszteréből.',
   mondhatod='Munkatársaink 2026 nyarán 12 400 liter vizet adtak 42 fiatal fának Budapesten.',
   keruld='„Locsolással ellensúlyoztuk a kibocsátásunkat.” Kompenzációs állítás, 2026 óta tilos.'),
  szamok=['vizadas_liter', 'vizadas_fo', 'vizadas_ontozes', 'onkormanyzat'], extra=['eset'],
  gyik=[
   ('Mikor lehet locsolni?', 'Júniustól szeptemberig, munka előtt, közben vagy után, ahogy a csapatnak kényelmes.'),
   ('Hol öntözünk?', 'A telephelyetek környékén vagy egy partner-település fáinál, a beeco térképe alapján.'),
   ('Mi a névadó támogatás?', 'Egy kerület vagy település fái a ti nevetekkel futnak a kampányban. 2026-ban az E.ON volt a fák névadó támogatója.'),
   ('Mennyibe kerül?', 'A locsolónapok számától és a létszámtól függ, erre egyedi ajánlatot adunk.')]),

 # ---------------- Zöld programok ----------------
 dict(k='programok', slug='zold-esemeny-szervezes', seo_nev='Zöld céges programok és csapatépítők',
  cim='Zöld céges programok és csapatépítők nagyvállalatoknak | beeco',
  leiras='Klímafreskó, zöld kvíz, kézműves workshop, csere-bere, előadás és 3D játékok: élményalapú céges programok teljes szervezéssel, 150 000 Ft-tól.',
  szalag='Zöld programok', h1=K('Céges program, ami [szemléletet formál]'),
  lead='Interaktív, élményalapú programok teljes lebonyolítással, belső kommunikációra és munkavállalói aktivációra, mérhető részvétellel. Minden csomag testreszabható.',
  gomb2=('#programok', 'Programok'), chipek=[N('esemeny_resztvevo') + ' résztvevő', N('elegedett_ugyfel') + ' elégedett céges ügyfél', N('ar_csere')],
  foto=(CDN + '67f3fff2ec90f5de8425fc52_P1260151-Enhanced-NR%20%E2%80%93%20nagy.avif', 'Fiatal felnőttek csoportja együtt egy világos teremben', 'Zöld program egy csapattal'),
  programok_h2='Hat program, egy közös cél', programok_lead='Válassz programtípust, és rátok szabjuk.', programok=['fresk', 'kviz', 'diy', 'csere', 'eloadas', 'jatek'],
  kap=dict(h2='Amit minden programhoz adunk', items=[
    ('raj', 'Teljes szervezés', 'Facilitátor, eszköz, forgatókönyv: ti csak megérkeztek.'),
    ('kupa', 'Mérhető részvétel', 'Résztvevők, témák és visszajelzések egy összefoglalóban.'),
    ('sziv', 'Szemléletformálás', 'Játékos, tudományos alapú programok, kioktatás nélkül.')]),
  lepes=dict(h2='Ajánlatkéréstől az összefoglalóig', items=[
    ('Ajánlatkérés', 'Megírod a létszámot, az időpontot és a célt.'),
    ('Testreszabás', 'Kiválasztjuk a programot és a témákat.'),
    ('Lebonyolítás', 'Mi visszük az egészet, nálatok vagy egy választott helyszínen.'),
    ('Összefoglaló', 'Résztvevők, fotók és kész mondatok a belső kommunikációhoz.')]),
  csomag=dict(h2='Egy alkalomtól az éves programig', items=[
    ('Belépő', 'Egy program', N('ar_csere'), ['Választott program', 'Teljes lebonyolítás', 'Összefoglaló']),
    ('Mag', 'Programnap', 'Kérj ajánlatot', ['Két-három program egy napon', 'Családbarát lehetőségek', 'Hatásjelentés']),
    ('Partnerség', 'Éves programsorozat', 'Kérj ajánlatot', ['Negyedévente új program', 'Közös tervezés', 'Éves összesítő'])]),
  jelentes=dict(lead='Minden program után összefoglalót kapsz a résztvevőkről, a témákról és a visszajelzésekről.',
   cim='Zöld programnap · Minta Példa Kft.', alcim='Klímafreskó és csere-bere egy napon',
   szamok=[('46', 'résztvevő munkatárs'), ('2', 'program egy nap alatt'), ('120', 'cserélt tárgy'), ('4,7', 'átlagos értékelés az 5-ből')],
   modszer='résztvevők a jelenléti ív alapján, a tárgyak a csere végén számolva, az értékelés névtelen kérdőívből.',
   mondhatod='46 munkatársunk vett részt a Klímafreskó workshopon és a céges csere-berén.',
   keruld='„Fenntartható cég lettünk.” Egy programnap ezt nem igazolja.'),
  szamok=['esemeny_resztvevo', 'elegedett_ugyfel', 'klimafresko_alkalom', 'klimafresko_fo'], extra=['velemenyek', 'partnerek'], velemenyek=['bdo', 'kh', 'unicef', 'obuda'],
  gyik=[
   ('Hol tartjátok a programokat?', 'Nálatok vagy egy általatok választott helyszínen, Budapesten és vidéken is.'),
   ('Mennyi előkészítést kér tőlünk?', 'Egy kapcsolattartót és a helyszínt. Minden mást mi szervezünk.'),
   ('Kombinálhatók a programok?', 'Igen, egy programnapon több formátum is lehet, például Klímafreskó és csere-bere.'),
   ('Mennyibe kerül?', 'A programok ' + N('ar_csere') + ' indulnak. A pontos ár a programtól, a létszámtól és a helyszíntől függ.')]),

 # ---------------- Partnerprogram (kuponos partnereknek) ----------------
 dict(k='partner', slug='partner', seo_nev='beeco Partnerprogram zöld vállalkozásoknak',
  cim='Partnerprogram zöld vállalkozásoknak: térkép, kupon, analitika | beeco',
  leiras='Kerülj fel a beeco zöld térképére, adj kupont a tudatos vásárlóknak, és kövesd a beváltásokat havi analitikával. Zümi csomag a gyors induláshoz.',
  szalag='Partnerprogram · zöld vállalkozásoknak', h1=K('Találjanak rád a [tudatos vásárlók]'),
  lead='Kerülj fel a beeco zöld térképére, adj kupont az app felhasználóinak, és kövesd havi analitikával, hányan jönnek miattunk. Egyszerű indulás, mérhető beváltások.',
  gomb2=('#csomagok', 'Csomagok'), chipek=[N('letoltes') + ' letöltés', N('zold_pont') + ' zöld pont a térképen', 'Havi analitika'],
  foto=(CDN + '699b61282ecbd0ecfbb03dc5_Ke%CC%81pernyo%CC%8Bfoto%CC%81%202026-02-22%20-%2021.03.25.webp', 'Két ember egy zöld üzlet bejáratánál', 'Partnerünk bejáratánál'),
  kap=dict(h2='Megjelenés, aktiváció, adatok', items=[
    ('terkep', 'Megjelenés', 'Egyedi profil a térképen, weben és az appban, hogy a közelben rád találjanak.'),
    ('kupon', 'Kuponfüzet', 'Egyszeri és gyűjtő kuponok az új és a visszatérő vásárlókért.'),
    ('kupa', 'Analitika', 'Havi statisztika a megtekintésekről, a beváltásokról és a közönségről.')]),
  lepes=dict(h2='Négy lépés az első beváltásig', items=[
    ('Jelentkezés', 'Megadod, mitől vagy fenntartható, és mi a kupon-ajánlatod.'),
    ('Beállítás', 'Összerakjuk a profilod és a kupon-stratégiát.'),
    ('Élesítés', 'Megjelensz a térképen és a kuponfüzetben, indulnak a mérések.'),
    ('Havi riport', 'A PartnerAppban látod az eredményeidet.')]),
  csomag=dict(h2='Zümi csomag a gyors induláshoz', items=[
    ('Belépő', 'Zümi csomag', 'Kérj ajánlatot', ['Megjelenés a térképen, weben és az appban', 'Egyszeri és gyűjtő kuponok', 'PartnerApp és havi analitika']),
    ('Mag', 'Bővített csomag', 'Hamarosan', ['Kiemelt, prémium kuponok', 'Push és appon belüli üzenetek', 'Haladó analitika']),
    ('Partnerség', 'Márkás kampány az appban', 'Kérj ajánlatot', ['Saját kampány a beeco közösségének', 'Megjelenés országos kampányainkban', 'Közös kommunikáció'])],
   megjegyzes='<strong>Fejlesztés alatt:</strong> a bővített csomag funkcióin dolgozunk. Jelentkezéskor jelezd, melyik érdekel. A Zümi csomagban ajtómatricát, plakátot és támogató anyagokat is kapsz.'),
  jelentes=dict(szalag='Havi analitika', h2='Látod, mit hoz a partnerség', cimke='Havi analitika · Minta',
   pontok=['Megtekintések és kuponmegnyitások', 'Beváltások a PartnerAppban', 'Havi összesítő, egyszerűen'],
   lead='A PartnerAppban havonta látod, hányan nézték meg a profilod, nyitották meg és váltották be a kuponod.',
   cim='Minta Kávézó', alcim='2026. szeptember',
   szamok=[('1 240', 'profilmegtekintés'), ('310', 'kuponmegnyitás'), ('86', 'beváltott kupon'), ('41', 'új vásárló')],
   modszer='megtekintések és megnyitások az app naplójából, beváltás a kupon kódjával a PartnerAppban.',
   mondhatod='Szeptemberben 86 vásárló váltotta be nálunk a beeco kuponját.',
   keruld='„A legzöldebb kávézó a városban.” Általános, nem igazolt állítás.'),
  szamok=['letoltes', 'zold_pont', 'esemeny_resztvevo'],
  gyik=[
   ('Ki lehet partner?', 'Fenntartható szemléletű bolt, termelő, kávézó vagy szolgáltató, akinek van kupon-ajánlata a beeco közösségének.'),
   ('Hogyan mérhető az eredmény?', 'A PartnerAppban havi statisztikát kapsz a megtekintésekről, a kuponmegnyitásokról és a beváltásokról.'),
   ('Mit kapok a helyszínre?', 'Ajtómatricát, plakátot és támogató anyagokat, hogy a vásárlók tudják, nálad beeco-kupon van.'),
   ('Mennyibe kerül?', 'A Zümi csomag ára a vállalkozás típusától függ, erre ajánlatot adunk.')]),

 # ---------------- Zöld marketing ----------------
 dict(k='marketing', slug='zold-marketing', seo_nev='Zöld marketing fenntartható márkáknak',
  cim='Zöld marketing fenntartható márkáknak, igazolt állításokkal | beeco',
  leiras='Stratégia, tartalom, videó és hirdetés fenntartható márkáknak, csak igazolt állításokra építve, a 2026-os zöldállítás-szabályokhoz igazítva.',
  szalag='Zöld marketing', h1=K('Zöld üzenet, ami [igaz is]'),
  lead='Stratégia, tartalom, videó és hirdetés egy kézben, fenntartható márkáknak. Csak mért, forrásolt állítást adunk ki, így a kampányod a 2026-os szabályokhoz igazodik.',
  gomb2=('#csomagok', 'Csomagok'), chipek=['Videós stáb', 'Igazolt állítások', 'Influencer-együttműködések'],
  foto=(CDN + '699b6283f447411e1f6c4196_IMG%202024%20Jan%2023%20%E2%80%93%20nagy.webp', 'Interjúforgatás egy belső térben, kamerával és fényekkel', 'Interjúforgatás'),
  miert=dict(h2='A zöld kommunikáció szabályai megváltoztak', kartyak=[
    ('Tilos az üres zöld állítás', '2026. szeptember 27. óta az EU-ban tilos az általános, nem igazolt környezeti állítás és a kompenzációra épülő állítás.', 'https://eur-lex.europa.eu/legal-content/HU/TXT/?uri=CELEX:32024L0825', '2024/825/EU irányelv'),
    ('A jó termék magától nem nő', 'Ha nincs kapacitás házon belül, vagy a termék jó, de nincs növekedés, stratégiával, tartalommal és hirdetéssel segítünk.', None, None)]),
  kap=dict(h2='Amit a legtöbben kérnek tőlünk', items=[
    ('otlet', 'Stratégia', 'Audit, célcsoport és üzenetek, 90 napos marketingterv.'),
    ('play', 'Tartalom és videó', 'Tartalomterv, grafika, szöveg, rövid videók és márkafilmek.'),
    ('kupa', 'Hirdetés és mérés', 'Meta-, TikTok- és Google-hirdetések, havi riporttal.')]),
  lepes=dict(h2='Auditól a havi riportig', items=[
    ('Audit', 'Megnézzük, hol tart a márkád, és mit állíthatsz igazoltan.'),
    ('Terv', '90 napos marketingterv célokkal, üzenetekkel, csatornákkal.'),
    ('Gyártás', 'Tartalom, videó, hirdetés és együttműködések.'),
    ('Riport', 'Havi riport és optimalizálás.')]),
  csomag=dict(h2='Kezdd egy kampányaudittal', items=[
    ('Belépő', 'Kampányaudit', 'Kérj ajánlatot', ['Állítás-ellenőrzés a 2026-os szabályok szerint', 'Célcsoport és üzenetek', 'Javaslatlista']),
    ('Mag', 'Havi tartalom és hirdetés', 'Kérj ajánlatot', ['Tartalomterv és gyártás', 'Hirdetéskezelés', 'Havi riport']),
    ('Partnerség', 'Szponzoráció egy beeco-kampányban', 'Kérj ajánlatot', ['Névadó vagy kiemelt támogatás', 'Megjelenés az appban és a sajtóban', 'Mért eredmények a kampány végén'])]),
  jelentes=dict(szalag='Állítás-ellenőrzés', h2='Tudod, mit mondhatsz', cimke='Kampányaudit · Minta',
   pontok=['Minden állítás forrással vagy javaslattal', 'Átírandó és elhagyandó mondatok külön', 'Kész, használható megfogalmazások'],
   lead='A kampányaudit végén pontosan tudod, mit mondhatsz, mit kell átírni és mit érdemes elhagyni.',
   cim='Minta Márka', alcim='12 kommunikációs állítás átnézve',
   szamok=[('12', 'átnézett állítás'), ('7', 'forrással igazolható'), ('3', 'átírandó'), ('2', 'elhagyandó')],
   modszer='minden állítást a 2024/825/EU szempontjai és a rendelkezésre álló bizonyíték szerint vetünk össze.',
   mondhatod='A csomagolásunk 80%-a újrahasznosított papír, a gyártó tanúsítványa szerint.',
   keruld='„Környezetbarát termék.” Általános, nem igazolt állítás.'),
  gyik=[
   ('Jogi tanácsot is adtok?', 'Nem. Kommunikációs szempontból ellenőrizzük az állításokat, a végleges jogi véleményhez jogászt javaslunk.'),
   ('Kiknek dolgoztok?', 'Fenntartható márkáknak, KKV-knak és nagyvállalatoknak, egyszemélyes csapattól a marketingosztályig.'),
   ('Mi a szponzoráció?', 'A cég egy beeco-kampány, például az Önkéntes Vízadás kiemelt vagy névadó támogatója lesz, mért eredményekkel.'),
   ('Mennyibe kerül?', 'Az audit és a havi csomag ára a feladat méretétől függ, erre egyedi ajánlatot adunk.')]),
]

ESEMENY = [
 # ---------------- Klímafreskó ----------------
 dict(k='fresk', slug='klimafresko', rovidnev='Klímafreskó', piko='otlet', kartya='Tudományos alapú csapatjáték a klímaváltozásról, 3 órában.', ar_kartya=N('ar_klimafresko'),
  seo_nev='Klímafreskó workshop cégeknek', tipus='Workshop', ar_tol=220000,
  cim='Klímafreskó workshop cégeknek és csapatoknak | beeco',
  leiras='Tudományos alapú, 3 órás csapatjáték a klímaváltozásról tapasztalt facilitátorral. 8–50 fő, 220 000 Ft-tól. A BDO és a K&H csapata is játszotta.',
  szalag='Klímafreskó workshop', h1=K('A klímaváltozás [3 óra alatt] összeáll'),
  lead='Világszerte játszott, az IPCC jelentéseire épülő csapatjáték: kártyákból rakjátok össze az ok-okozati láncot, megbeszélitek, mit éreztek közben, és közösen kitaláljátok, mit tehet a csapatotok.',
  gomb2=('#menet', 'Így zajlik'), chipek=['3 óra', '8–50 fő', N('ar_klimafresko'), N('klimafresko_alkalom') + ' alkalom, ' + N('klimafresko_fo') + ' résztvevő'],
  foto=(CDN + '6722191c61d503dbabf14511_Fresk-table.avif', 'Tízfős csapat egy nagy asztal mögött, rajta Klímafreskó-kártyák', 'Klímafreskó egy csapattal'),
  mi=dict(szalag='Honnan jött?', h2='A klímatudomány, kártyákra fordítva', bekezdesek=[
    'A workshop az Éghajlat-változási Kormányközi Testület (IPCC) jelentéseinek eredményein vezet végig. Ma ' + N('fresk_orszag') + ' országban játsszák, és ' + N('fresk_resztvevo') + ' résztvevője volt világszerte.',
    'Hegedűs Kristóf, a beeco alapítója eddig ' + N('klimafresko_alkalom') + ' alkalmat facilitált ' + N('klimafresko_fo') + ' résztvevőnek, vidéken és városban, kicsiknek és nagyoknak.',
    'A végén nem csak tudás marad: a csapat a saját működésére szabott, konkrét lépésekkel áll fel az asztaltól.'],
   foto=(CDN + '67f3fff53f155df35b6f7ac3_IMG_9026.avif', 'Nyolc ember egy asztal körül, papírra ragasztott kártyákkal és rajzokkal')),
  kap=dict(h2='Mit ad a csapatodnak?', items=[
    ('konyv', 'Mélyebb megértés', 'A klímaváltozás összefüggései tudományos alapon, közérthetően.'),
    ('raj', 'Csapatépítés', 'Mindenki elmondja, hogyan látja a témát, és együtt keresitek a megoldást.'),
    ('otlet', 'Konkrét lépések', 'A záró ötletbörzét a ti ágazatotokhoz igazítjuk.')]),
  menet=dict(h2='Egy workshop négy része', lead='Tapasztalt facilitátor kísér végig a megértéstől a cselekvésig.', items=[
    ('A klímaváltozás megértése', 'Kooperatív kártyajáték: felderítitek, hogyan hatnak az emberi tevékenységek a környezetre.'),
    ('Kapcsolódás', 'Teret adunk az érzéseknek: megosztjátok, mit váltott ki belőletek a játék.'),
    ('A tettek mezejére', 'Csoportos ötletbörze egyéni és közös lépésekről, a ti környezetetekre szabva.'),
    ('Összefoglaló', 'Rövid jelentés a résztvevőkről és a vállalt lépésekről, a belső kommunikációhoz.')]),
  galeria=[(CDN + '67484bef8d3f906ad9853936_Beeco%201.avif', 'Hét ember egy asztal mögött, nagy barna papírra ragasztott kártyákkal'),
           (CDN + '674756e56d1b0cb67b9b63d7_IMG_7690.avif', 'Négy ember egy asztal körül színes cetlikkel dolgozik'),
           (CDN + '67f3fff51a6e4baffcabe801_IMG_9622.avif', 'Tizenegy ember egy nagy asztal mögött, papírokkal és képekkel')],
  velemenyek=['bdo', 'kh', 'obuda', 'unicef'],
  csomag=dict(h2='Válaszd a nektek valót', items=[
    ('Belépő', 'Klímafreskó workshop', N('ar_klimafresko'), ['3 óra, 8–50 fő', 'Tapasztalt facilitátor', 'Minden eszköz']),
    ('Mag', 'Freskó és saját akcióterv', 'Kérj ajánlatot', ['A záró rész a ti ágazatotokra szabva', 'Vállalt lépések összefoglalója', 'Rövid jelentés']),
    ('Partnerség', 'Sorozat több csapatnak', 'Kérj ajánlatot', ['Több alkalom az év során', 'Közös tervezés', 'Éves összesítő'])]),
  gyik=[
   ('Mennyibe kerül?', N('ar_klimafresko') + ', a létszámtól, a helyszíntől és a záró rész testreszabásától függően.'),
   ('Mennyi ideig tart?', '3 órát. Ha kevesebb időtök van, írjátok meg, és megnézzük, mi fér bele.'),
   ('Kell előzetes tudás?', 'Nem. A kártyák és a facilitátor mindent megadnak, és a témában jártas ESG-szakértők is újat tanulnak.'),
   ('Hol tartjátok?', 'Nálatok vagy egy általatok választott helyszínen, Budapesten és vidéken is.')],
  kapcsolodo=['kviz', 'diy', 'jatek']),

 # ---------------- 3D zöld játékok ----------------
 dict(k='jatek', slug='3d-zold-jatekok', rovidnev='3D zöld játékok', piko='play', kartya='Böngészős 3D játékok standra, csapatnapra, iskolába, ranglistával.', ar_kartya='Kérj ajánlatot',
  seo_nev='3D zöld játékok rendezvényre', tipus='Rendezvényprogram',
  cim='3D zöld játékok rendezvényre, standra, csapatnapra | beeco',
  leiras='Hulladékszelektálás, hűtőrendezés, energiatakarékos otthon: böngészős 3D játékok kioszk módban, ranglistával. Céges napra, standra, iskolába.',
  szalag='3D zöld játékok', h1=K('Játszva tanul, aki [megáll a standnál]'),
  lead='A beeco saját fejlesztésű 3D játékaiban hulladékot szelektáltok, hűtőt rendeztek, vagy egy egész házat tesztek energiatakarékossá. Rövid körök, ranglista, kioszk mód: rendezvényre, csapatnapra és iskolába is.',
  gomb2=('https://beeco-szelektalj.netlify.app', 'Kipróbálom'), chipek=['5 perces körök', 'Kioszk mód standra', 'Ranglista', 'Magyarul és angolul'],
  foto=(CDN + '67a89e2375dac32a2d4a57c8_IMG_8599.avif', 'Három kiállító zöld pólóban egy fa pult előtt egy rendezvényen, méhfigurákkal', 'beeco stand egy rendezvényen'),
  mi=dict(szalag='A játékok', h2='Válogass a játékok közül', bekezdesek=[
    '<strong>Szelektálj!</strong> Hulladékot válogattok a megfelelő kukába kertben, utcán és futószalagon. Egy szint körülbelül 5 perc.',
    '<strong>Hűtő-mester</strong> Mi kerül a hűtőbe, mi a fagyasztóba, mi járt le és mi jó még? Ketten is játszható egy képernyőn.',
    '<strong>Ökos-rejtély</strong> Nyomozós szabadulószoba egy 3D házban, ahol energiát és pénzt spóroltok. Hosszabb játék, csapatnapra ideális.',
    '<strong>Méhesd élő hálózata</strong> Zöldfolyosókat építetek a beporzóknak egy 3D városban.'],
   foto=(CDN + '67a89e71b5f5590dfef78ad8_IMG_8621.avif', 'Horgolt méhfigura egy csocsóasztal szélén, háttérben emberek')),
  kap=dict(h2='Mit ad a rendezvényednek?', items=[
    ('play', 'Forgalom a standon', 'Rövid körök, azonnali eredmény: a látogatók megállnak és visszajönnek.'),
    ('kupa', 'Verseny és ranglista', 'Napi vagy csapatok közti ranglista, akár díjazással.'),
    ('konyv', 'Tanulás játékból', 'Hulladék, étkezés, energia: forrásolt tartalom, kioktatás nélkül.')]),
  menet=dict(h2='Így hozzuk ki hozzátok', items=[
    ('Kiválasztjuk a játékokat', 'A közönséghez és a témához illő játékokat és hosszt.'),
    ('Telepítés nélkül', 'Böngészőben futnak, tableten, laptopon vagy nagy kijelzőn.'),
    ('Kioszk mód', 'A stand gépein egymás után játszhatnak a látogatók.'),
    ('Eredmények', 'A nap végén összesítő a játékosokról és az eredményekről.')]),
  galeria=[(CDN + '67a8ac788ef2d529f3a36ad5_Ke%CC%81pernyo%CC%8Bfelve%CC%81tel%20(62).avif', 'Emberek egy beltéri rendezvényen, asztalokkal és italokkal'),
           (CDN + '67f3fff72342139a7391bb3b_DSC_6781.avif', 'Három férfi egy asztal mögött cetlikkel, előtte beeco molinók'),
           (CDN + '67a8aadc19fcdda4383c2568_36F1F668-245B-4DF5-8E71-00CB8883E958_1_102_o.avif', 'Hat mosolygó férfi egy közös étkezésen')],
  csomag=dict(h2='Játékpont, verseny vagy saját esemény', items=[
    ('Belépő', 'Játékpont egy rendezvényen', 'Kérj ajánlatot', ['1–2 eszköz kioszk módban', 'Kiválasztott játékok', 'Napi ranglista']),
    ('Mag', 'Játékverseny csapatnapra', 'Kérj ajánlatot', ['Csapatok közti verseny', 'Moderálás és eredményhirdetés', 'Rövid összesítő']),
    ('Partnerség', 'Saját játékesemény', 'Kérj ajánlatot', ['A ti témátokra szabott válogatás', 'Arculati megjelenés', 'Közös kommunikáció'])]),
  gyik=[
   ('Mire van szükség a helyszínen?', 'Tablet, laptop vagy nagy kijelző böngészővel. Ha nincs stabil internet, előre betöltve is futnak.'),
   ('Milyen korosztálynak szól?', 'Gyerekeknek és felnőtteknek is: a rövid játékok iskolában és családi napon, a hosszabbak csapatnapon működnek a legjobban.'),
   ('Kipróbálhatom előre?', 'Igen, a játékok elérhetők a <a class="ds-szoveglink" href="https://beeco-szelektalj.netlify.app" target="_blank" rel="noopener">beeco-szelektalj.netlify.app ›</a> címen.'),
   ('Mennyibe kerül?', 'Az eszközök számától és a program hosszától függ, erre egyedi ajánlatot adunk.')],
  kapcsolodo=['kviz', 'fresk', 'csere']),

 # ---------------- Kézműves workshop ----------------
 dict(k='diy', slug='kezmuves-workshop', rovidnev='Kézműves workshop', piko='doboz', kartya='Varrás, méhviaszos kendő, upcycling, fermentálás, natúr tisztítószer.', ar_kartya=N('ar_diy'),
  seo_nev='Kézműves és DIY workshop cégeknek', tipus='Workshop', ar_tol=180000,
  cim='Kézműves és DIY workshop cégeknek | beeco',
  leiras='Varrás, méhviaszos kendő, upcycling, fermentálás, natúr tisztítószer: 1–3 órás csináld magad workshop 8–30 főnek, 180 000 Ft-tól.',
  szalag='Kézműves workshop', h1=K('Két kéz, jó társaság, [valami, ami megmarad]'),
  lead='A legjobb módja a tanulásnak, amikor pár óra alatt alkottok valamit. Varrás, upcycling, méhviaszos kendő, fermentálás vagy natúr tisztítószer: mindenki egy saját, használható darabbal megy haza.',
  gomb2=('#menet', 'Így zajlik'), chipek=['1–3 óra', '8–30 fő', N('ar_diy')],
  foto=(CDN + '67f3ffef809e550e5264fb50_IMG_20250320_180444%20%E2%80%93%20nagy.avif', 'Tizenegy ember egy műhelyasztal körül színes anyagokkal, háttérben könyvcsere-polc', 'Csináld magad műhely'),
  mi=dict(szalag='A témák', h2='Válaszd ki, mit készítetek', bekezdesek=[
    '<strong>Varrás és upcycling:</strong> régi textilből új, használható darab.',
    '<strong>Méhviaszos kendő:</strong> fólia helyett, újra és újra használható.',
    '<strong>Fermentálás:</strong> savanyú zöldség és ital, amit otthon is el tudtok készíteni.',
    '<strong>Natúr tisztítószer:</strong> egyszerű alapanyagokból, kevesebb vegyszerrel.',
    '<strong>Barkácsolás:</strong> kisebb tárgyak, amik a hétköznapokban is kellenek.'],
   foto=(CDN + '67f3fff2e3522b119d468715_P1240510-Enhanced-NR-1%20%E2%80%93%20nagy.avif', 'Emberek egy világos teremben asztalok körül, előtérben gyümölcs és italok')),
  kap=dict(h2='Mit ad a csapatodnak?', items=[
    ('raj', 'Kibillent a mókuskerékből', 'Pár óra kézzel végzett munka, ami összehozza a csapatot.'),
    ('doboz', 'Hazavihető eredmény', 'Mindenki egy saját, használható darabbal megy haza.'),
    ('otlet', 'Szokás, ami megmarad', 'Egyszerű, otthon is ismételhető zöld megoldások.')]),
  menet=dict(h2='Egy workshop menete', items=[
    ('Témaválasztás', 'Kiválasztjátok a workshopot, mi hozzuk az anyagot és az eszközt.'),
    ('Bevezetés', 'Rövid háttér: miért jó ez a környezetnek és a pénztárcának.'),
    ('Alkotás', 'Lépésről lépésre, segítséggel, mindenkinek sikerül.'),
    ('Összefoglaló', 'Fotók és rövid jelentés a belső kommunikációhoz.')]),
  csomag=dict(h2='Egy workshoptól a sorozatig', items=[
    ('Belépő', 'Egy workshop', N('ar_diy'), ['1–3 óra, 8–30 fő', 'Anyag és eszköz', 'Vezetett alkotás']),
    ('Mag', 'Workshop és csere-bere', 'Kérj ajánlatot', ['Alkotás és csere egy napon', 'Családbarát program', 'Rövid jelentés']),
    ('Partnerség', 'Workshop-sorozat', 'Kérj ajánlatot', ['Havonta más téma', 'Közös tervezés', 'Éves összesítő'])]),
  gyik=[
   ('Mennyibe kerül?', N('ar_diy') + ', a témától, a létszámtól és az anyagigénytől függően.'),
   ('Kell hozzá ügyesség?', 'Nem. Lépésről lépésre haladunk, és végig segítünk.'),
   ('Hol tartjátok?', 'Nálatok vagy egy általatok választott helyszínen.'),
   ('Több témát is választhatunk?', 'Igen, egy alkalmon belül vagy sorozatban is, a csapat érdeklődése szerint.')],
  kapcsolodo=['csere', 'fresk', 'kviz']),

 # ---------------- Zöld kvíz és ÖkoMuki ----------------
 dict(k='kviz', slug='zold-kviz-okomuki', rovidnev='Zöld kvíz és ÖkoMuki', piko='kupa', kartya='Humoros, versengő csapatjáték 10–250 főnek, Kahoot alapon.', ar_kartya=N('ar_zold_program'),
  seo_nev='Zöld kvíz és ÖkoMuki csapatjáték', tipus='Csapatjáték', ar_tol=160000,
  cim='Zöld kvíz és ÖkoMuki csapatjáték cégeknek | beeco',
  leiras='Humoros, versengő fenntarthatósági kvíz és ÖkoMuki kártyajáték 10–250 főnek, 1–2 órában, Kahoot alapon. Csapatépítőre, családi napra, 160 000 Ft-tól.',
  szalag='Zöld kvíz és ÖkoMuki', h1=K('Ki a [legökosabb] a csapatban?'),
  lead='Választható témájú, humoros fenntarthatósági kvíz, vagy az ÖkoMuki: zöld activity, mini kártyajátékok és egy mindent eldöntő döntő. Kicsiknek és nagyoknak, bármilyen tudásszinten.',
  gomb2=('#menet', 'Így zajlik'), chipek=['1–2 óra', '10–250 fő', N('ar_zold_program'), 'Kahoot alap'],
  foto=(CDN + '68b7726b2cae6213af1c802d_O%CC%81buda%20Group_Szakmai%20Nap_2025.05.17_Bo%CC%81dis%20Krisztia%CC%81n_222.avif', 'Egy férfi mikrofonnal előadást tart, a kivetítőn Kahoot játék résztvevői', 'Kvíz egy szakmai napon'),
  mi=dict(szalag='Két formátum', h2='Kvíz vagy ÖkoMuki?', bekezdesek=[
    '<strong>Ökos kvíz:</strong> választható témakörökben, Kahoot alapon, telefonnal játszható. Humorosan és élményszerűen teszi próbára a csapat tudását, nagy létszámnál is.',
    '<strong>ÖkoMuki:</strong> a zöld activity feloldja a hangulatot, a mini kártyajátékok megmutatják a mindennapjaink környezeti hatását, a döntő kvíz pedig kideríti, kik az igazi ÖkoMukik. 10–100 főnek, családbarát.'],
   foto=(CDN + '68b7727709a130e8245663b5_O%CC%81buda%20Group_Szakmai%20Nap_2025.05.17_Bo%CC%81dis%20Krisztia%CC%81n_227.avif', 'Közönség figyel egy előadót, aki környezeti lábnyomról szóló diát mutat be')),
  kap=dict(h2='Mit ad a csapatodnak?', items=[
    ('kupa', 'Verseny', 'Csapatok vagy egyéni játékosok, ranglistával és eredményhirdetéssel.'),
    ('sziv', 'Jó hangulat', 'Humoros kérdések, amik után mindenki beszélget.'),
    ('konyv', 'Tudás, ami megmarad', 'Hasznos tippek a hétköznapokra, forrásolt válaszokkal.')]),
  menet=dict(h2='Egy kvízest menete', items=[
    ('Témaválasztás', 'Közlekedés, étkezés, vásárlás, hulladék: a ti érdeklődésetek szerint.'),
    ('Felkészülés', 'Mi hozzuk a kérdéseket és a játékot, nektek csak kivetítő kell.'),
    ('Játék', '1–2 óra pörgős verseny, moderálással.'),
    ('Eredményhirdetés', 'Győztesek, tanulságok és rövid összefoglaló.')]),
  csomag=dict(h2='Kvíz, ÖkoMuki vagy saját témájú játék', items=[
    ('Belépő', 'Ökos kvíz', N('ar_zold_program'), ['1–2 óra, 10–250 fő', 'Választható témák', 'Moderálás']),
    ('Mag', 'ÖkoMuki csapatjáték', 'Kérj ajánlatot', ['Zöld activity és kártyajátékok', 'Döntő kvíz', '10–100 fő']),
    ('Partnerség', 'Saját témájú kvíz', 'Kérj ajánlatot', ['A cégetek témáira írt kérdések', 'Arculati megjelenés', 'Rövid jelentés'])]),
  gyik=[
   ('Mi kell hozzá?', 'Kivetítő vagy nagy kijelző, és a résztvevők telefonja.'),
   ('Milyen témák vannak?', 'Választható témakörök, például közlekedés, étkezés, vásárlás és hulladék. Saját témára is írunk kérdéseket.'),
   ('Családi napra is jó?', 'Igen, az ÖkoMuki családbarát, a kvízt pedig kicsik és nagyok is élvezik.'),
   ('Mennyibe kerül?', 'Az ökos kvíz ' + N('ar_zold_program') + ', az ÖkoMuki ára a létszámtól függ.')],
  kapcsolodo=['fresk', 'jatek', 'eloadas']),

 # ---------------- Csere-bere ----------------
 dict(k='csere', slug='csere-bere-szervezes', rovidnev='Csere-bere', piko='sziv', kartya='Ruha-, könyv-, palánta- és játékcsere, családbarát hangulatban.', ar_kartya=N('ar_csere'),
  seo_nev='Csere-bere szervezés cégeknek és közösségeknek', tipus='Közösségi esemény', ar_tol=150000,
  cim='Csere-bere szervezés cégeknek és közösségeknek | beeco',
  leiras='Ruha-, könyv-, palánta- és játékcsere teljes szervezéssel: családbarát, zenés, könnyed esemény céges napra vagy közösségi térbe, 150 000 Ft-tól.',
  szalag='Csere-bere', h1=K('Új kedvencek, [vásárlás nélkül]'),
  lead='Minek újat venni, ha az újdonság élménye ingyen is megvan? Ruha-, könyv-, palánta- vagy játékcsere teljes szervezéssel: családbarát, zenés, nassolós, könnyed hangulatú esemény.',
  gomb2=('#menet', 'Így zajlik'), chipek=['30–90 perc', 'Szabad létszám', N('ar_csere'), 'Családbarát'],
  foto=(CDN + '67a8c4089a2e5a49b5f5f39e_70461148_2417314075012536_5042379678103371776_n.avif', 'Emberek egy szabadtéri vásáron ruhákat nézegetnek és válogatnak', 'Közösségi csere-bere'),
  mi=dict(szalag='Témák', h2='Mit cserélhettek?', bekezdesek=[
    'Ruha, könyv, játék, növény és palánta, hobbieszköz: a téma a közösségetektől függ. Magbörzét és közösségi vásárt is szervezünk.',
    'Mi visszük a lebonyolítást a meghirdetéstől a csere végéig, ti csak hozzátok, amit továbbadnátok.'],
   foto=('csere', 'Fiatalok ruhákat és könyveket válogatnak egy csere-berén')),
  kap=dict(h2='Mit ad a közösségnek?', items=[
    ('sziv', 'Közösségi élmény', 'Beszélgetés, zene, nassolás: a kollégák és a családjaik is jól érzik magukat.'),
    ('kuka', 'Kevesebb hulladék', 'A tárgyak körforgásban maradnak, nem a kukában végzik.'),
    ('kupa', 'Könnyű siker', 'Rövid, kötetlen program, amire mindenki szívesen hoz valamit.')]),
  menet=dict(h2='Egy csere-bere menete', items=[
    ('Meghirdetés', 'Kész szöveget és szabályokat adunk a belső kommunikációhoz.'),
    ('Gyűjtés', 'A résztvevők elhozzák, amit továbbadnának.'),
    ('Csere', '30–90 perc kötetlen válogatás, zenével.'),
    ('Összefoglaló', 'Résztvevők és fotók egy rövid összefoglalóban.')]),
  csomag=dict(h2='Irodai cserétől a közösségi vásárig', items=[
    ('Belépő', 'Csere-bere', N('ar_csere'), ['30–90 perc', 'Teljes lebonyolítás', 'Szabad létszám']),
    ('Mag', 'Csere-bere és workshop', 'Kérj ajánlatot', ['Csere és kézműves workshop egy napon', 'Családbarát program', 'Rövid jelentés']),
    ('Partnerség', 'Közösségi vásár', 'Kérj ajánlatot', ['Nagyobb közösségi esemény', 'Helyi termelők és partnerek', 'Közös kommunikáció'])]),
  gyik=[
   ('Mennyibe kerül?', N('ar_csere') + ', a mérettől és a helyszíntől függően.'),
   ('Hány ember jöhet?', 'A létszám szabad: a kis irodai cserétől a közösségi vásárig.'),
   ('Mi kell a helyszínen?', 'Asztalok, néhány fogas vagy polc, és egy kis hely a válogatáshoz.'),
   ('Családtagok is jöhetnek?', 'Igen, a csere-bere családbarát program.')],
  kapcsolodo=['diy', 'eloadas', 'kviz']),

 # ---------------- Előadás, filmklub, kerekasztal ----------------
 dict(k='eloadas', slug='zold-eloadas-filmklub', rovidnev='Előadás, filmklub, kerekasztal', piko='olvas', kartya='Interaktív előadás 8 témában, filmklub vitaesttel, szakértői kerekasztal.', ar_kartya='Kérj ajánlatot',
  seo_nev='Fenntarthatósági előadás, filmklub és kerekasztal', tipus='Előadás',
  cim='Fenntarthatósági előadás, filmklub, kerekasztal cégeknek | beeco',
  leiras='Interaktív előadás 8 témában, filmklub vezetett vitával, szakértői kerekasztal-beszélgetés: játékos, humoros zöld programok 45 perctől.',
  szalag='Előadás, filmklub, kerekasztal', h1=K('Előadás, amin [senki nem alszik el]'),
  lead='Unjátok a frontális előadásokat? Interaktív előadással, filmklubbal és szakértői kerekasztallal mozgatjuk meg az agytekervényeket: praktikusan, humorosan, kérdésekkel és vitával.',
  gomb2=('#menet', 'Így zajlik'), chipek=['45 perctől', '8 témakör', 'Filmklub 10–100 főnek'],
  foto=(CDN + '6802602137134cce14cd8b6c_DSC_0470.avif', 'Fiatalok egy teremben, egy férfi jegyzetekkel magyaráz egy kék poszter előtt', 'Interaktív előadás'),
  mi=dict(szalag='Három formátum', h2='Válaszd ki a nektek valót', bekezdesek=[
    '<strong>Interaktív előadás</strong> (45–120 perc): fenntartható mindennapok, közlekedés, étkezés, vásárlás és további témák, játékosítva.',
    '<strong>Filmklub és vitaest</strong> (2–3 óra): környezeti és társadalmi témájú film, utána nyitott beszélgetés vagy vezetett vita, 10–100 résztvevőnek.',
    '<strong>Kerekasztal-beszélgetés:</strong> szakértői hálózatunkból összeállított panel aktuális témákban, ' + N('ar_kerekasztal') + '.'],
   foto=(CDN + '67a8c2dfe9b5b1a4141afdd9_P1240455-Enhanced-NR%20%E2%80%93%20nagy.avif', 'Hat fiatal felnőtt egy színpadon panelbeszélgetésen, egy nő mikrofonnal beszél')),
  kap=dict(h2='Mit ad a közönségnek?', items=[
    ('olvas', 'Gondolkodás, nem jegyzetelés', 'Kérdések, szavazás és játékos feladatok az előadás közben.'),
    ('sziv', 'Párbeszéd', 'A filmklub és a kerekasztal után a közönség is szót kap.'),
    ('konyv', 'Hiteles tudás', 'Szakértőink tudományos forrásokra építenek, érthetően.')]),
  menet=dict(h2='Az ötlettől az összefoglalóig', items=[
    ('Témaválasztás', 'Kiválasztjuk a formátumot és a témát a közönségetekhez.'),
    ('Előkészítés', 'Szakértő, film vagy panel: mi szervezzük.'),
    ('Esemény', 'Interaktív előadás, vetítés vagy beszélgetés, moderálással.'),
    ('Összefoglaló', 'Rövid összefoglaló a résztvevőkről és a felmerült kérdésekről.')]),
  galeria=[(CDN + '67a8c31387b2fcd70fa60277_clubs2.avif', 'Diákok egy osztályteremben egy erdőről szóló videót néznek'),
           (CDN + '67a8b4ab90f9609066b667bd_Darab_Zsuzsa_DT_NTK_A38_high_res_074.avif', 'Előadó mikrofonnal, a kivetítőn fenntartható termékek piacáról szóló dia'),
           (CDN + '67a8b4abcb94fb7296b55d9d__DSC4125.avif', 'Emberek egy kávézóban tapsolnak egy prezentáció közben')],
  csomag=dict(h2='Előadás, filmklub vagy kerekasztal', items=[
    ('Belépő', 'Interaktív előadás', 'Kérj ajánlatot', ['45–120 perc', '8 témakör', 'Kérdések és játékos feladatok']),
    ('Mag', 'Filmklub és vitaest', 'Kérj ajánlatot', ['2–3 óra, 10–100 fő', 'Film és vezetett vita', 'Szakértő vendég']),
    ('Partnerség', 'Kerekasztal-beszélgetés', N('ar_kerekasztal'), ['Szakértői panel', 'Moderálás', 'Több generáció bevonása'])]),
  gyik=[
   ('Milyen témák közül választhatunk?', 'Fenntartható mindennapok, közlekedés, étkezés, vásárlás és további témák, összesen 8 témakörben.'),
   ('Mennyi ideig tart?', 'Az előadás 45–120 perc, a filmklub 2–3 óra.'),
   ('Kinek ajánljátok?', 'Céges csapatoknak, iskoláknak és közösségeknek, kis és nagy létszámmal is.'),
   ('Mennyibe kerül?', 'A kerekasztal ' + N('ar_kerekasztal') + ', az előadás és a filmklub ára a témától és a létszámtól függ.')],
  kapcsolodo=['fresk', 'kviz', 'csere']),
]
