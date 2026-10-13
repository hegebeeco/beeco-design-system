"""Önkéntes vízadás – szezonzáró oldal (2026 → 2027 tavasz). A Webflow-ba kerülő natív jelölés, szekciónként egy gyökérelem.
Kimenet: ov_szekciok.json (név, html, css-csonkok). Futtatás: python3 ov-jeloles.py [szekció ...]
Képek: a saját arculati fájlok (kep/) feltöltés után a Webflow-médiatárból jönnek (FEL), a meglévők a médiatárból (S3)."""
import json, re, html as H, sys, os
D = os.path.dirname(os.path.abspath(__file__))
S3 = 'https://s3.amazonaws.com/webflow-prod-assets/648ebb1f9ae84f3d530e2f2d/'
# feltöltött arculati fájlok: név → médiatár-fájlnév (üres = helyi kep/ útvonal a próbaoldalhoz)
FEL = json.load(open(os.path.join(D, 'feltoltott.json'), encoding='utf8')) if os.path.exists(os.path.join(D, 'feltoltott.json')) else {}
HELYI = os.environ.get('OV_HELYI', 'kep/')
A = lambda n: (S3 + FEL[n]) if n in FEL else HELYI + n
e = lambda s: H.escape(s, quote=True)

PLAY = 'https://play.google.com/store/apps/details?id=hu.beeco.app'
IOS = 'https://apps.apple.com/hu/app/beeco/id6478549279?l=hu'
QR = '69cd05a01e5ed130291d83f9_web%20qr%20leto%CC%88lte%CC%81s.png'

def boltok(extra=''):
    return (f'<div class="ov-boltok{(" " + extra) if extra else ""}"><a class="ov-bolt ov-csak-android" href="{PLAY}" target="_blank" rel="noopener"><span class="ov-bolt-kicsi">Szerezd meg:</span><span class="ov-bolt-nagy">Google Play</span></a>'
            f'<a class="ov-bolt ov-csak-ios" href="{IOS}" target="_blank" rel="noopener"><span class="ov-bolt-kicsi">Letölthető az</span><span class="ov-bolt-nagy">App Store-ból</span></a></div>')

SZ = []

# 1. Hero: köszönet, lezárult a 2026-os kampány, 2027 tavaszán újra; próbáld ki: öntözd meg a fát
SZ.append(('hero', f'''<section class="ov-hero" id="kezdes"><img class="ov-hero-minta" src="{A('ov-minta.svg')}" alt=""><div class="ov-burok ov-hero-racs"><div class="ov-hero-szoveg">
<img class="ov-logo" src="{A('ov-logo-feher.svg')}" alt="Önkéntes vízadás, powered by E.ON">
<div class="ov-allapot"><span class="ov-allapot-pont"></span>A 2026-os kampány lezárult</div>
<h1 class="ov-hero-cim">Köszönjük, <span class="ov-kiemel">Önkéntes Vízadók!</span></h1>
<p class="ov-lead">Idén nyáron <strong>784 352 liter víz</strong> jutott el a fiatal fákhoz, országszerte. A fák kitelelnek, mi pedig készülünk: <strong>2027 tavaszán újra útnak indulunk.</strong></p>
<div class="ov-cta-sor"><a class="ov-gomb ov-ertesito" href="/feliratkozas">Szólj, ha indulunk!</a><a class="ov-gomb ov-gomb-masod" href="#eredmenyek">Nézd meg az eredményeket</a></div>
<div class="ov-pecset-sor"><img class="ov-pecset" src="{A('ov-pecset.svg')}" alt=""><p class="ov-pecset-szoveg">Újra indul<strong class="ov-pecset-ev">2027 tavaszán</strong></p></div>
</div>
<div class="ov-jatek" id="ontozo"><div class="ov-szalag">Próbáld ki!</div><h2 class="ov-jatek-cim">Öntözd meg ezt a fiatal fát!</h2>
<div class="ov-jatek-szin"><img class="ov-jatek-fa ov-jf-piros" src="{A('ov-fa-piros.svg')}" alt="Piros jelölő a térképen: nagyon szomjas fa"><img class="ov-jatek-fa ov-jf-sarga" src="{A('ov-fa-sarga.svg')}" alt="Sárga jelölő: szomjas fa"><img class="ov-jatek-fa ov-jf-zold" src="{A('ov-fa-zold.svg')}" alt="Zöld jelölő: megöntözött fa"><img class="ov-jatek-meh" src="{A('ov-meh-kannas.webp')}" alt="Szuperhős méhecske locsolókannával"></div>
<p class="ov-jatek-allapot">Piros a térképen: nagyon szomjas, 100 liter kell neki.</p>
<div class="ov-jatek-sav"><span class="ov-jatek-toltes"></span></div><p class="ov-jatek-liter">0 / 100 liter</p>
<a class="ov-gomb ov-ontoz" href="#ontozo">Öntözök 50 litert</a></div>
</div><img class="ov-varos" src="{A('ov-varos-szeles.svg')}" alt=""></section>'''))

# 2. Eredmények: fehér szám-chipek a sötétkék panelen (mint az eredménykommunikációs plakátokon), fotók
STAT = [('784 352', 'liter víz öntözve'), ('24 693', 'öntözés'), ('2 162', 'aktív önkéntes vízadó'), ('22 871', 'fa a térképen'), ('14 857', 'kút a térképen'), ('15', 'önkormányzat')]
FOTO = [('68fe983bdd4e306dd581b694_MM__6634%20(1).avif', 'Egy önkéntes vödörből öntözi a fát, mögötte sorban várnak a többiek'),
        ('68fe983e5b48edd633429f84_20250907_MM_5288.avif', 'Négy önkéntes vödrökkel indul a parkban a fákhoz'),
        ('68fe93f9435fbeb9f73fcd83_552734046_785087530829592_1133945939025093519_n.avif', 'Vidám locsolócsapat csoportképe a fák alatt')]
SZ.append(('eredmeny', '<section class="ov-szekcio ov-eredmeny" id="eredmenyek"><div class="ov-burok ov-eredmeny-racs"><div class="ov-eredmeny-szoveg"><div class="ov-szalag ov-szalag-sarga">2026 nyara</div><h2 class="ov-cim2">Ennyit locsoltunk együtt!</h2><p class="ov-lead">…és ez még csak a kezdet. Június 1. és szeptember 30. között ennyien és ennyit tettetek a város fiatal fáiért.</p>'
 '<div class="ov-statok">' + ''.join(f'<div class="ov-stat"><span class="ov-csepp ov-csepp-{i % 4 + 1}"></span><strong class="ov-stat-szam">{v}</strong><span class="ov-stat-mi">{m}</span></div>' for i, (v, m) in enumerate(STAT)) + '</div></div>'
 '<div class="ov-fotok">' + ''.join(f'<figure class="ov-foto ov-foto-{i+1}"><img class="ov-foto-kep" src="{S3}{f}" alt="{e(a)}"></figure>' for i, (f, a) in enumerate(FOTO)) + f'<img class="ov-fotok-meh" src="{A("ov-meh-baratsagos.svg")}" alt=""></div></div></section>'))

# 3. Miért fontos?
TENY = [('3–5 év', 'Az ültetés utáni első évek kritikusak: ekkor még gyengék a gyökerek, a fa nehezen jut vízhez.'),
        ('50 liter', 'Ennyi kell egy fiatal fának hetente. 35 fok felett kétszer annyi.'),
        ('30–40 cm', 'Ilyen mélyre kell leszivárognia a víznek, hogy a gyökerek elérjék.')]
SZ.append(('miert', f'<section class="ov-szekcio ov-miert" id="miert"><div class="ov-burok ov-miert-racs"><div class="ov-miert-szoveg"><div class="ov-szalag">Miért fontos?</div><h2 class="ov-cim2">A fiatal fák adják a jövő árnyékát</h2><p class="ov-lead">A forró, száraz nyarakon az 5 évnél fiatalabb fák különösen sérülékenyek. Később hűvösebb utcákat és élhetőbb tereket adnak nekünk, de az első éveikben szükségük van a segítségünkre.</p><p class="ov-megj">Az Önkéntes Vízadás nem helyettesíti a szakmai faápolást, de a fokozódó aszályban sokat javít a fiatal fák túlélési esélyein.</p></div>'
 '<div class="ov-tenyek">' + ''.join(f'<div class="ov-teny"><strong class="ov-teny-szam">{v}</strong><p class="ov-teny-szoveg">{t}</p></div>' for v, t in TENY) + f'<img class="ov-tenyek-fa" src="{A("ov-fa.svg")}" alt=""></div></div></section>'))

# 4. Így működik – 2027 tavaszán is
LEPES = [('Keress egy szomjas fát', 'Nyisd meg a beeco appot: a térképen pirossal és sárgával jelöljük a szomjas fiatal fákat.'),
         ('Töltsd meg a vödröt', 'A legközelebbi vízvételi ponton, kútnál vagy otthon. A térképen a kutakat is megtalálod.'),
         ('Locsolj, és regisztráld', 'Öntsd a vizet lassan a tövéhez, aztán jelöld az appban, hogy mások is lássák.'),
         ('Gyűjts nektárt, csapatban', 'Alkoss locsolócsapatot: együtt több fát érünk el, és a nektárt kuponokra váltod.')]
JEL = [('ov-fa-piros.svg', 'Piros', 'Nagyon szomjas: 100 liter'), ('ov-fa-sarga.svg', 'Sárga', 'Szomjas: legalább 50 liter'), ('ov-fa-zold.svg', 'Zöld', 'Nemrég kapott vizet')]
SZ.append(('igy', '<section class="ov-szekcio ov-igy" id="igy"><div class="ov-burok"><div class="ov-szekcio-fej"><div class="ov-szalag">Így működik</div><h2 class="ov-cim2">2027 tavaszán is így locsolunk</h2><p class="ov-szekcio-lead">Négy lépés, egy vödör víz és egy kis séta. Jegyezd meg, tavasszal jól jön!</p></div>'
 '<ol class="ov-lepesek">' + ''.join(f'<li class="ov-lepes"><span class="ov-lepes-szam">{i+1}</span><h3 class="ov-lepes-cim">{c}</h3><p class="ov-lepes-szoveg">{t}</p></li>' for i, (c, t) in enumerate(LEPES)) + '</ol>'
 '<div class="ov-jelek"><p class="ov-jelek-cim">Mit jelentenek a színek a térképen?</p>' + ''.join(f'<div class="ov-jel"><img class="ov-jel-kep" src="{A(k)}" alt=""><span class="ov-jel-szoveg"><strong class="ov-jel-nev">{n}</strong>{t}</span></div>' for k, n, t in JEL) + '</div></div></section>'))

# 5. Önkormányzatok
ONK = [('Budapest', [('6849f2ed38308d6227b98396_fo%CC%8Bkert.avif', 'FŐKERT'), ('6a2ae39e9e28ee8ae43ceeb8_Group%201000005737.webp', 'Budavár'), ('6a69c97927b93a1b6d352bc2_image%201394.webp', '2. kerület'),
                    ('6a2ae39d0470285890bdf2cb_Group%201000005751.png', 'Terézváros'), ('6a2ae39dec0bf9700a7c2cdd_image%201371.png', 'Erzsébetváros'), ('6a3305da983930dcbba8de18_Jo%CC%81zsefva%CC%81ros%20logo.jpeg', 'Józsefváros'),
                    ('6a47565d60e49c6108a81cb0_fradi.jpeg', 'Ferencváros'), ('6a75955d5b059452a7d0c258_Zuglo%CC%81%202025%20u%CC%81j%20logo.png', 'Zugló'), ('6a75952a054c1667bbc97a5c_318323887_5766026176810055_1864519770623324189_n%201.webp', '18. kerület'),
                    ('6a2ae39de25e5e1f9c8ea776_image%201368.png', 'Budafok-Tétény')]),
       ('Vidék', [('6a0ce9483b5e24e5c4067ff5_Pe%CC%81cs%20O%CC%88nkorma%CC%81nyzat%20Logo.jpg', 'Pécs'), ('6a0ce9482a1e2efd3b23566a_Veszpre%CC%81m%20O%CC%88nkorma%CC%81nyzat%20Logo.png', 'Veszprém'),
                  ('6a69c62fbf5475a4b245dce7_image%201393.png', 'Kecskemét'), ('6a7595bbf9101e429e30f9ad_Sze%CC%81kesfehe%CC%81rva%CC%81r%20logo.webp', 'Székesfehérvár')])]
SZ.append(('onk', '<section class="ov-szekcio ov-onk" id="onkormanyzatok"><div class="ov-burok"><div class="ov-szekcio-fej"><div class="ov-szalag">Önkormányzatok</div><h2 class="ov-cim2">15 önkormányzat fiatal fáit öntöztük</h2><p class="ov-szekcio-lead">Az ő fáik kerültek fel a térképre. Köszönjük a bizalmat és a közös munkát!</p></div>'
 + ''.join(f'<div class="ov-onk-csoport"><p class="ov-onk-cim">{g}</p><div class="ov-cimerek">' + ''.join(f'<div class="ov-cimer"><span class="ov-cimer-keret"><img class="ov-cimer-kep" src="{S3}{f}" alt="{e(n)} címere"></span><span class="ov-cimer-nev">{n}</span></div>' for f, n in t) + '</div></div>' for g, t in ONK)
 + '<div class="ov-onk-cta"><p class="ov-onk-cta-szoveg"><strong>Csatlakozna a települése 2027-ben?</strong> Tegyük együtt szervezettebbé és láthatóbbá a fiatal fák locsolását.</p><a class="ov-gomb" href="/kapcsolat">Írjon nekünk</a></div></div></section>'))

# 6. Partnerek és támogatók
PARTNER = [('Főszervezők', [('6849f2ed38308d6227b98396_fo%CC%8Bkert.avif', 'FŐKERT'), ('6849f2ed206950cd74472ad7_beeco.avif', 'beeco')]),
           ('Kiemelt és névadó támogató', [('6a2adc592c51b1ae69450cea_EON_LOGO.png', 'E.ON')]),
           ('További támogatók', [('6a2adf6a10f7d1fbb6b0087a_GARDENA_LOGO.png', 'GARDENA'), ('6a4b75d79c7d42e52569d1b6_Dreher%20So%CC%88rgya%CC%81rak_NEW_logo%203.png', 'Dreher Sörgyárak')]),
           ('Cégként locsoltak velünk', [('6a69ebea52324bb931ce0ff0_image%201384.png', 'OTP Bank'), ('6a69ebea48e8c53dd385c9c7_image%201379.png', 'KPMG')]),
           ('Kommunikációs támogatók', [('699b5dc3d1611a42828bedff_budapest.webp', 'Budapest Városháza'), ('6a0ee458b2b9c76bf239aa2a_xforest.png', 'X Forest')])]
NAGYKOVET = ['Bardóczi Sándor', 'Karácsony Gergely', 'Macsári Dzsenifer', 'tRENDrakó Marcell', 'McMenemy Márk', 'Gyógynövényes lány']
SZ.append(('partner', '<section class="ov-szekcio ov-partner" id="partnerek"><div class="ov-burok"><div class="ov-szekcio-fej"><div class="ov-szalag">Partnerek</div><h2 class="ov-cim2">Akikkel együtt adtunk vizet a jövőnek</h2></div>'
 '<div class="ov-partner-racs">' + ''.join(f'<div class="ov-partner-csoport"><p class="ov-partner-cim">{g}</p><div class="ov-logok">' + ''.join(f'<span class="ov-logo-csempe"><img class="ov-logo-kep" src="{S3}{f}" alt="{e(n)}"></span>' for f, n in t) + '</div></div>' for g, t in PARTNER) + '</div>'
 '<figure class="ov-idezet"><blockquote class="ov-idezet-szoveg">„Hisszük, hogy a fenntartható jövő nemcsak az energiáról, hanem az élhetőbb városi környezetről és az összefogás erejéről is szól.”</blockquote><figcaption class="ov-idezet-forras">E.ON Hungária, a fák névadó támogatója</figcaption></figure>'
 '<div class="ov-nagykovetek"><p class="ov-partner-cim">A kis fák nagykövetei</p><div class="ov-chipek">' + ''.join(f'<span class="ov-chip">{n}</span>' for n in NAGYKOVET) + '</div></div></div></section>'))

# 7. Mit tehetsz tavaszig?
ADDIG = [('ov-meh-kedves.svg', 'Iratkozz fel', 'Elsőként szólunk, amikor 2027 tavaszán újra indul a kampány.', '/feliratkozas', 'Feliratkozom'),
         ('ov-meh-meglepett.svg', 'Maradj a beeco appban', 'Zöld térkép, programok és kuponok: a többi ökos lépésed addig is itt vár.', '#letoltes', 'Letöltöm'),
         ('ov-kupa.svg', 'Legyen a céged is támogató', 'Vállalati locsolónap, vízvételi pont vagy támogatás 2027-re: beszéljünk!', '/kapcsolat', 'Kapcsolat'),
         ('ov-fa-sarga.svg', 'Legyél a kis fák nagykövete', 'Egy videóval vagy posztoddal sokakat mozgósíthatsz jövő nyáron.', '/kapcsolat', 'Jelentkezem')]
SZ.append(('addig', '<section class="ov-szekcio ov-addig" id="addig"><div class="ov-burok"><div class="ov-szekcio-fej"><div class="ov-szalag ov-szalag-sarga">Tavaszig</div><h2 class="ov-cim2">Mit tehetsz addig is?</h2></div>'
 '<div class="ov-kartyak">' + ''.join(f'<a class="ov-kartya" href="{u}"><img class="ov-kartya-kep" src="{A(k)}" alt=""><h3 class="ov-kartya-cim">{c}</h3><p class="ov-kartya-szoveg">{t}</p><span class="ov-kartya-nyil">{g} ›</span></a>' for k, c, t, u, g in ADDIG) + '</div></div></section>'))

# 8. GYIK
KERD = [('Mikor indul újra a kampány?', '2027 tavaszán. A pontos dátumot a hírlevélben és az appban jelentjük be, iratkozz fel, és elsőként szólunk.'),
        ('Most is locsolhatom a fiatal fákat?', 'Persze! Ha száraz, meleg az idő, a fiatal fák ősszel is hálásak a vízért. A kampány pontjai és a nyereményjáték azonban 2027 tavaszán indulnak újra.'),
        ('Honnan jött a kampány?', 'A Fővárosi Önkormányzat felkérte a 10 millió Fa alapítványt, hogy segítsenek életben tartani az 5 évnél fiatalabb fákat a szélsőségesen száraz nyarakon. Mi a beeco térképét ajánlottuk fel, hogy a lakosság játékosan, közösen segíthessen.'),
        ('Mennyi víz kell egy fiatal fának?', 'Hetente legalább 50 liter, 35 fok feletti hőségben kétszer 50 liter. A sárga fa legalább 50, a piros 100 litert kér. A víznek 30–40 cm mélyre kell leszivárognia.'),
        ('Mikor érdemes locsolni?', 'Reggel 6 és 10 között vagy este 18 óra után. Napközben a forró aszfalton a víz 30–50%-a elpárolog, mielőtt a gyökerekhez érne.'),
        ('Önkormányzatként vagy cégként csatlakoznánk 2027-ben. Mit tegyünk?', 'Írjanak nekünk a kapcsolati oldalon: a fák térképre töltésétől a vállalati locsolónapig mindenben segítünk.')]
SZ.append(('gyik', '<section class="ov-szekcio ov-gyik" id="gyik"><div class="ov-burok ov-gyik-racs"><div class="ov-szekcio-fej ov-gyik-fej"><img class="ov-gyik-meh" src="' + A('ov-meh-meglepett.svg') + '" alt=""><div class="ov-szalag">GYIK</div><h2 class="ov-cim2">Gyakori kérdések</h2><p class="ov-szekcio-lead">Nem találod a választ? <a class="ov-szoveglink" href="/kapcsolat">Írj nekünk</a></p></div><div class="ov-kerdesek">'
 + ''.join(f'<details class="ov-kerdes"><summary class="ov-kerdes-k">{q}</summary><p class="ov-kerdes-v">{a}</p></details>' for q, a in KERD) + '</div></div></section>'))

# 9. Záró: jövő tavasszal újra
SZ.append(('zaro', f'''<section class="ov-szekcio ov-zaro" id="letoltes"><div class="ov-burok ov-zaro-racs"><div class="ov-zaro-szoveg">
<div class="ov-szalag ov-szalag-sarga">Viszlát tavasszal!</div><h2 class="ov-cim2">Jövőre újra vizet adunk a jövőnek!</h2><p class="ov-lead">Addig is töltsd le a beeco appot, és nézd meg, mi legyen a következő ökos lépésed.</p>
{boltok()}
<div class="ov-qr ov-csak-asztal"><img class="ov-qr-kep" src="{S3}{QR}" alt="QR-kód a beeco app letöltéséhez"><p class="ov-qr-szoveg">Gépen olvasod? Olvasd be a telefonoddal.</p></div>
<a class="ov-gomb ov-ertesito" href="/feliratkozas">Szólj, ha indulunk!</a>
</div><div class="ov-zaro-kep"><img class="ov-zaro-varos" src="{A('ov-varos-kicsi.svg')}" alt=""><img class="ov-zaro-meh" src="{A('ov-meh-kannas.webp')}" alt="Szuperhős méhecske locsolókannával"></div></div><img class="ov-cikcakk" src="{A('ov-cikcakk.svg')}" alt=""></section>'''))

def csonkok(h):
    out = []
    for cl in re.findall(r'class="([^"]+)"', h):
        t = cl.split()
        out.append('.' + t[0] + '{--ov:1}')
        if len(t) > 1: out.append('.' + '.'.join(t) + '{--ov:1}')
    return ''.join(dict.fromkeys(out))

csak = sys.argv[1:]
kimenet = [{'nev': n, 'html': re.sub(r'\n', '', h), 'css': csonkok(h)} for n, h in SZ if not csak or n in csak]
json.dump(kimenet, open(os.path.join(D, 'ov_szekciok.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('szekciók:', [(k['nev'], len(k['html']), len(k['css'])) for k in kimenet])
