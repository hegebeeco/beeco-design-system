"""A Webflow-ba kerülő natív jelölés (szekciónként egy gyökérelem) + whtml osztály-csonkok.
Kimenet: wf_szekciok.json (név, html, css) és wf_teszt.html (helyi próbaoldal ugyanezzel a jelöléssel)."""
import json, re, html as H, sys, os
D = os.path.dirname(os.path.abspath(__file__))
S3 = 'https://s3.amazonaws.com/webflow-prod-assets/648ebb1f9ae84f3d530e2f2d/'
APP = {'lab': '6acd9097b69b333eb9acc0de_fs-app-lab.webp', 'hir': '6acd9097b449dfc157f00e71_fs-app-hir.webp',
       'terkep': '6acd9097fe99e82767aeea08_fs-app-terkep.webp', 'kozosseg': '6acd909778b1c9fe98e43fd8_fs-app-kozosseg.webp',
       'vasarlas': '6acd9097fe99e82767aeea25_fs-app-vasarlas.webp', 'nektar': '6acd9097fe99e82767aee9eb_fs-app-nektar.webp'}
BOLT = ['6acd9098412cc0f2868b7720_fs-beebolt-0.webp', '6acd90980375343f3ac0c0f4_fs-beebolt-1.webp', '6acd90989cfe6a4a7e724c77_fs-beebolt-2.webp']
HOS = '6acd90989cfe6a4a7e724c94_fs-hos-meh.webp'
CSAPAT = '67a8acb53c7158693ab3ee84_Beeco%20csapatke%CC%81p%20%E2%80%93%20nagy.avif'
TAJ = os.environ.get('FS_TAJ', S3 + '6acdd7d01adc944900c4d958_fs-zold-2050-v2.svg')
QR = '69cd05a01e5ed130291d83f9_web%20qr%20leto%CC%88lte%CC%81s.png'
# kézzel rajzolt piktogramok (piko/*.svg → Webflow-médiatár); matrica-család: fekete-fehér, sárga család: fekete-sárga
PIKO = {'lab': '6acdcf5d31a1079e200f1faa', 'alma': '6acdcf7bdb31faba74106c65', 'csepp': '6acdcf7ba358827ed21560fa', 'doboz': '6acdcf7ba358827ed2156117',
        'fa': '6acdcf7bf218d7e862748bce', 'haz': '6acdcf7bf218d7e862748beb', 'howto': '6acdcf7bdb31faba74106cec', 'kanna': '6acdcf7cf2f41b180badc6a6',
        'katt': '6acdcf7cf2f41b180badc726', 'kesvilla': '6acdcf7c1f7962a21f69b845', 'konyv': '6acdcf7cab88aba1da6f3a0e', 'kuka': '6acdcf7c1adc944900c3696a',
        'kupa': '6acdcf7d46bae73bbde8f3de', 'kupon': '6acdcf7d13f43306a9e990ce', 'madarpont': '6acdcfae356d56416f62a05f', 'naptar': '6acdcfae02624ee83fb9c137',
        'olvas': '6acdcfafdf4b15324ccb4a5b', 'otlet': '6acdcfaf356d56416f62a0d9', 'play': '6acdcfb031a1079e200f5490', 'posta': '6acdcfb046bae73bbde921f8',
        'raj': '6acdcfb0f2f41b180badebb7', 'sziv': '6acdcfb0356d56416f62a171', 'taska': '6acdcfb0aac2053c2cb040ee', 'telefon': '6acdcfb16b9d194eb04d6ec1',
        'telepules': '6acdcfb1a57f9d8d1eba51c5', 'terkep': '6acdcfb146bae73bbde923f6'}
L = {}
for line in (open(os.path.join(D, 'lista.tsv'), encoding='utf8') if os.path.exists(os.path.join(D, 'lista.tsv')) else []):
    f = line.rstrip('\n').split('\t')
    if f[0] in ('sajto', 'partner'):
        L[f[0] + '-' + f[1]] = (f[2], f[3].split('/648ebb1f9ae84f3d530e2f2d/')[1])
NEV = {'sajto': ['Telex', 'Trade magazin', 'MVM Smart Future Lab', 'Zöld Hang podcast', 'Marie Claire', 'Startuponline', 'We Love Budapest', 'Daily News Hungary', 'Pannon Egyetem GTK podcast', 'BME', 'Minner'],
       'partner': ['BME', 'Pannon Egyetem', 'Erdőszeretet Szövetség', 'Élhető Települések Országos Szövetsége', 'ELTE TáTK', 'Budapesti Corvinus Egyetem', 'Felelős Gasztrohős', 'Tudatos Vásárlók Egyesülete', '10 millió fa', 'Humusz Szövetség', 'MAVEG Magyar Vegán Egyesület', 'I-DEST']}
e = lambda s: H.escape(s, quote=True)
ik = lambda n, extra='': f'<span class="fs-ik fs-ik-{n}{(" " + extra) if extra else ""}"></span>'
pk = lambda n, extra='': f'<img class="fs-piko{(" " + extra) if extra else ""}" src="{S3}{PIKO[n]}_fs-piko-{n}.svg" alt="">'
def boltok(extra=''):
    return (f'<div class="fs-boltok{(" " + extra) if extra else ""}"><a class="fs-bolt fs-csak-android" href="https://play.google.com/store/apps/details?id=hu.beeco.app" target="_blank" rel="noopener">{pk("play")}<span class="fs-bolt-felirat"><span class="fs-bolt-kicsi">Szerezd meg:</span><span class="fs-bolt-nagy">Google Play</span></span></a>'
            f'<a class="fs-bolt fs-csak-ios" href="https://apps.apple.com/hu/app/beeco/id6478549279?l=hu" target="_blank" rel="noopener">{pk("alma")}<span class="fs-bolt-felirat"><span class="fs-bolt-kicsi">Letölthető az</span><span class="fs-bolt-nagy">App Store-ból</span></span></a></div>')
def logok(t, nevvel=False):
    return ''.join(f'<a class="fs-logo-csempe" href="{e(L.get(t+"-"+str(i), ('#', ''))[0])}" target="_blank" rel="noopener"><span class="fs-logo-keret"><img class="fs-logo-kep" src="{S3}{L.get(t+"-"+str(i), ('#', ''))[1]}" alt="{e(n)}"></span>' + (f'<span class="fs-logo-nev">{e(n)}</span>' if nevvel else '') + '</a>' for i, n in enumerate(NEV[t]))

FUNK = [('lab', 'Lábnyom', 'lab', 'Kezdd a lábnyomoddal!', 'Számold ki a karbon-, szemét- és vízlábnyomod, és nézd meg, hol állsz másokhoz képest.'),
        ('terkep', 'Térkép', 'terkep', 'Nézz körül a közelben!', 'Zöld térkép: boltok, javítók, szelektív gyűjtők és ökos pontok a közeledben.'),
        ('vasarlas', 'Kuponok', 'kupon', 'Vásárolj ökosan!', 'Kuponfüzet: kedvezmények zöld partnerektől, nektár minden beváltásért.'),
        ('hir', 'Tudás', 'konyv', 'Legyél naprakész!', 'Ökos tudás röviden: tippek, hírek és útmutatók, például az okostányér.'),
        ('kozosseg', 'Programok', 'naptar', 'Találj rajtársakra!', 'Kaptárnaptár: havi 100+ zöld program, vásár, csere-bere és képzés.'),
        ('nektar', 'Nektár', 'kupa', 'Gyűjts nektárt!', 'Minden lépésedért nektár jár, a ranglistán pedig látod, hol tartasz.')]
APP_ALT = {'lab': 'A beeco Lábnyomkalkulátor: a karbonlábnyomod tonnában, összevetve a világ, a magyar és a beeco-átlaggal',
           'hir': 'Az Ökos tudás képernyő az okostányér útmutatóval', 'terkep': 'A Zöld térkép zöld helyekkel: boltok, javítók, szelektív gyűjtők a közelben',
           'kozosseg': 'A Kaptárnaptár havi zöld eseményekkel és a Napi ökossággal', 'vasarlas': 'A Kuponfüzet kiemelt kuponokkal zöld partnerektől',
           'nektar': 'A Ranglista: a legaktívabb zümmögők nektárja'}

SZ = []
SZ.append(('hero', f'''<section class="fs-hero" id="kezdes"><img class="fs-hero-taj" src="{TAJ}" alt=""><div class="fs-burok fs-hero-racs"><div class="fs-hero-szoveg">
<div class="fs-szalag">Ingyenes magyar app</div>
<h1 class="fs-hero-cim">Zöld életmód app, ami megmutatja <span class="fs-szalag-nagy">a következő lépésed</span></h1>
<p class="fs-lead">Úton egy zöld 2050 felé, napi kis lépésekkel: számold ki a lábnyomod, találj zöld helyeket és programokat a közeledben, és gyűjts nektárt minden lépésért.</p>
<div class="fs-cta-sor fs-hero-letoltes">{boltok()}<div class="fs-qr fs-csak-asztal fs-hero-qr"><img class="fs-qr-kep" src="{S3}{QR}" alt="QR-kód a beeco app letöltéséhez"><p class="fs-qr-szoveg">Gépen olvasod? Olvasd be a telefonoddal.</p></div></div>
<div class="fs-bizalom"><span class="fs-biz"><span class="fs-csillag">★</span> <strong class="fs-biz-szam">4,6</strong> App Store</span><span class="fs-biz"><span class="fs-csillag">★</span> <strong class="fs-biz-szam">4,2</strong> Google Play</span><span class="fs-biz"><strong class="fs-biz-szam">25.000+</strong> letöltés</span></div>
<p class="fs-hero-sugo">{pk("telefon")}Nézz bele az appba: válassz egy funkciót.</p>
</div><div class="fs-hero-jobb"><div class="fs-kaptar-szin"><div class="fs-app-kepek">''' +
 ''.join(f'<img class="fs-app-kep" src="{S3}{APP[k]}" alt="{e(APP_ALT[k])}">' for k, *_ in FUNK) + '</div>' +
 ''.join(f'<a class="fs-funk fs-f-{i+1}" href="#kezdes"><span class="fs-pin">{pk(icon)}</span><span class="fs-nev">{nev}</span><span class="fs-funk-cim">{cim}</span><span class="fs-funk-szoveg">{sz}</span></a>' for i, (k, nev, icon, cim, sz) in enumerate(FUNK)) +
 f'</div><div class="fs-felirat"><h2 class="fs-felirat-cim">{FUNK[0][3]}</h2><p class="fs-felirat-szoveg">{FUNK[0][4]}</p></div></div></div></section>'))

SZ.append(('sajto', f'<section class="fs-sajto"><div class="fs-burok fs-sajto-sor"><div class="fs-sajto-cim">Írtak rólunk</div><div class="fs-logosor">{logok("sajto")}</div></div></section>'))

SZ.append(('mostfut', '<a class="fs-most-fut" href="https://www.beeco.hu/kampanyok/csicsergosz" target="_blank" rel="noopener"><div class="fs-burok fs-most-sor">' + pk('madarpont', 'fs-most-piko') + '<div class="fs-szalag fs-szalag-mez">Most fut</div><div class="fs-most-szoveg"><strong>CsicsergŐsz:</strong> ismerd meg a körülötted élő madarakat, és segíts nekik az appal.</div><div class="fs-most-nyil">Irány a kampány ›</div></div></a>'))

VEL = [('„A legjobb dolog, amire okostelefont 2026-ban használni lehet. Építi az emberi közösséget és a természeti környezetet.”', 'gazdagergo, App Store'),
       ('„Nagyon kreatív app, összehoz minket, emellett jobbá teszi a környezetet, a programok miatt is csak jobb.”', 'Kriki21, App Store'),
       ('„Szuper kezdeményezés, remélem egyre többen csatlakoznak!”', 'Bandaminta, App Store'),
       ('„Igazi kis oázis a klímaszorongós mindennapok sivatagában :)”', 'holladri01, App Store'),
       ('„...egyre több és több ökos funkció érhető el az appban, a »zöld események« funkció a kedvencem, már számos klassz kezdeményezést innen ismertem meg!”', 'nillucska, App Store'),
       ('„Kutak, piacok, varroda és adományboltok. Mind igen hasznosak, hogy spóroljak és ökotudatosabb döntést hozzak! Ajánlom mindenkinek!”', 'hexpapa96, App Store'),
       ('„Rendkívül hasznos és áldásos! Ezer hála annak aki kitalálta és azoknak akik megcsinálták és azoknak akik üzemeltetik!”', 'Sasadligeti Fák Őrzői, App Store'),
       ('„Nagyon jól működik, igazán könnyen megtalálom az ökos pontokat”', 'sajtos.spangli, App Store'),
       ('„Ez az app rengeteg hasznos infoval rendelkezik, vegre nem kell szupermarketekbe vasarolnom, siman talalok a kozelemben egszseges es kornyezetbarat uzleteket, piacokat, szelektiv gyujto helyseget stb”', 'CsClau1, App Store'),
       ('„Tegyünk együtt a környezetünkért. :)”', 'ildiiiiiiiiiiiiiii, App Store')]
LEP = [('otlet', 'Megértés', 'Számold ki a lábnyomod: nézd meg, miben vagy erős, és min érdemes javítani.'),
       ('katt', 'Cselekvés', 'Megmutatjuk a következő lépést, és hogy hol teheted meg a közeledben: zöld helyek, programok, kuponok.'),
       ('sziv', 'Megerősítés', 'Minden apró lépésedért nektár jár, és egy közösség, amelyben nem vagy egyedül.')]
SZ.append(('miert', '<section class="fs-szekcio fs-miert" id="miert"><div class="fs-burok"><div class="fs-szekcio-fej fs-be"><div class="fs-szalag">Miért a beeco?</div><h2 class="fs-cim2"><span class="fs-sor">A klímaváltozás nagy.</span> A te lépéseid is számítanak.</h2><p class="fs-lead">Sokan érezzük, hogy kevés, amit egyedül tehetünk. Pedig egy zöld 2050 napi kis lépésekből épül: ezeket bontjuk le neked, és végig melletted vagyunk.</p></div>'
 '<div class="fs-lepesek">' + ''.join(f'<div class="fs-kartya fs-lepes fs-be"><div class="fs-lepes-fej"><div class="fs-lepes-ikon">{pk(k)}<span class="fs-lepes-szam">{i+1}</span></div><h3 class="fs-lepes-cim">{c}</h3></div><p class="fs-lepes-szoveg">{t}</p></div>' for i, (k, c, t) in enumerate(LEP)) + '</div>'
 '<div class="fs-velemeny-fej fs-be"><h3 class="fs-velemeny-cim">Akik már használják</h3><div class="fs-ertekeles"><span class="fs-csillag">★</span> <strong>4,6</strong> App Store, 70 értékelés</div><div class="fs-ertekeles"><span class="fs-csillag">★</span> <strong>4,2</strong> Google Play, 106 értékelés</div></div>'
 '<div class="fs-velemenyek">' + ''.join(f'<figure class="fs-kartya fs-velemeny fs-be"><div class="fs-csillag fs-csillagok">★★★★★</div><blockquote class="fs-idezet">{q}</blockquote><figcaption class="fs-forras">{c}</figcaption></figure>' for q, c in VEL) + '</div></div></section>'))

FOTO = [('68fe983b78497fc77257e71b_MM__6338%20(1).avif', 'Két önkéntes háttal, „bee the change” feliratú beeco pólóban egy szabadtéri eseményen', 'Zöld programokon'),
        ('67f3ffeed85bf54ccc01433d_IMG_20250302_190221%20%E2%80%93%20nagy.avif', 'Tizenhárom fiatal túrázó egy kilátóponton, mögöttük zöld hegyek', 'Közös túrán'),
        ('67a8c4089a2e5a49b5f5f39e_70461148_2417314075012536_5042379678103371776_n.avif', 'Emberek ruhákat válogatnak egy szabadtéri csere-bere vásáron', 'Csere-berén'),
        ('67f3ffef809e550e5264fb50_IMG_20250320_180444%20%E2%80%93%20nagy.avif', 'Tizenegy ember egy asztal körül egy kreatív műhelyen', 'Műhelyeken')]
SZAM = [('telefon', '25.000+', 'letöltés'), ('telepules', '15', 'partner-önkormányzat'), ('naptar', '100+', 'zöld program havonta'), ('sziv', '12', 'szakmai partner')]
SZ.append(('raj', '<section class="fs-szekcio fs-raj" id="raj"><div class="fs-burok fs-racs"><div class="fs-raj-szoveg"><div class="fs-szalag fs-szalag-mez">Közösség</div><h2 class="fs-cim2"><span class="fs-halk">Egy méh nem csinál csodát, de...</span> egy egész raj felvirágoztatja a környezetét!</h2><p class="fs-lead">Apró lépésekkel csökkentjük a tehetetlenség érzését, és támogatjuk egymást. Ne csüggedj, nem vagy egyedül!</p>'
 '<div class="fs-cta-sor"><a class="fs-gomb fs-csatlakoz" href="#raj">Beállok a rajba</a></div><p class="fs-raj-uzenet"></p></div>'
 '<div class="fs-raj-fotok">' + ''.join(f'<figure class="fs-foto fs-foto-{i+1}"><img class="fs-foto-kep" src="{S3}{f}" alt="{e(a)}"><figcaption class="fs-foto-felirat">{c}</figcaption></figure>' for i, (f, a, c) in enumerate(FOTO)) + pk('raj', 'fs-raj-piko') + '</div></div>'
 '<div class="fs-burok"><div class="fs-ereje"><h3 class="fs-ereje-cim">A közösség ereje</h3><div class="fs-szamok">' + ''.join(f'<div class="fs-szam">{pk(k)}<strong class="fs-szam-ertek">{v}</strong><span class="fs-szam-mi">{m}</span></div>' for k, v, m in SZAM) + '</div>'
 '<div class="fs-hatas"><div class="fs-hatas-cim">Önkéntes Vízadás, 2026</div><div class="fs-hatas-racs"><div class="fs-hatas-elem">' + pk('fa') + '<strong class="fs-hatas-szam">7 500+</strong><span class="fs-hatas-mi">fiatal fa kapott inni</span></div><div class="fs-hatas-elem">' + pk('csepp') + '<strong class="fs-hatas-szam">1 millió+</strong><span class="fs-hatas-mi">liter víz</span></div><div class="fs-hatas-elem">' + pk('kanna') + '<strong class="fs-hatas-szam">2 200+</strong><span class="fs-hatas-mi">vízadó</span></div></div><a class="fs-hatas-forras" href="/kampanyok/onkentes-vizadas">Záró közlemény, 2026. október ›</a></div>'
 '</div></div></section>'))

IDO = [('2023', 'A raj alakulása', 'Megszületik a beeco. Climate Launchpad nemzetközi döntő, MVM Edison 3. hely.', ''),
       ('2024', 'A beporzás éve', 'Elindul az app és az ország legnagyobb zöld térképe. WebSummit, Lisszabon.', ''),
       ('2025', 'A virágzás éve', 'ONE Digitális díj, 1. hely. Az ország első közösségi faöntöző kampánya.', ''),
       ('2026', 'A terjeszkedés éve', '15 partner-önkormányzat, CsicsergŐsz-kampány, irány a WebSummit.', ' fs-ido-fo'),
       ('2027', 'Cél: határok nélkül', 'A beeco külföldön is: még több település, közösség és ökohős.', ' fs-ido-cel')]
CSAPATKEP = [(CSAPAT, 'A beeco 29 fős csapata bézs pólóban, középen egy méhjelmezes taggal'),
             ('6997a31baa1170a1d18afe13_IMG%202025%20Dec%2002.webp', 'A csapat a ONE Digitális Díj 2025 átadóján'),
             ('6988c4803892804bbb14364c_64C6E2BA-BF85-4726-A676-3D37C5105116_1_105_c.webp', 'Tizenkét mosolygó csapattag egy asztal mögött, rajta fotók és egy horgolt méhecske'),
             ('6722191c61d503dbabf14511_Fresk-table.avif', 'Tízfős csapat egy nagy asztal mögött, rajta képek és jegyzetek')]
SZ.append(('rolunk', '<section class="fs-szekcio fs-rolunk" id="rolunk"><div class="fs-burok"><div class="fs-szekcio-fej fs-be"><div class="fs-szalag">Rólunk</div><h2 class="fs-cim2">Kik állnak a beeco mögött?</h2><p class="fs-szekcio-lead">Többszörösen elismert magyar startup, önkéntesekből és szakemberekből, egyetemi és civil partnerekkel.</p></div>'
 '<div class="fs-csapat-sor fs-be"><div class="fs-csapat-szoveg"><div class="fs-szalag">A csapat</div><h3 class="fs-cim3">Nyolc szakcsapat, egy cél</h3><p class="fs-csapat-szoveg-p">Tinédzserek, egyetemisták, friss pályakezdők és tapasztalt szakemberek. Városiak és vidékiek, közgazdászok, mérnökök és grafikusok dolgoznak együtt.</p>'
 '<div class="fs-chipek">' + ''.join(f'<span class="fs-chip">{c}</span>' for c in ['Szoftveres', 'Webes', 'Térképész', 'Kreatív', 'Marketing', '+3 csapat']) + '</div><a class="fs-gomb fs-gomb-masod fs-csapat-gomb" href="https://www.beeco.hu/csapat" target="_blank" rel="noopener">Csatlakozz a csapathoz</a></div>'
 '<div class="fs-csapat-slider"><div class="fs-diak">' + ''.join(f'<img class="fs-dia" src="{S3}{f}" alt="{e(a)}">' for f, a in CSAPATKEP) + '</div></div></div>'
 '<div class="fs-idovonal">' + ''.join(f'<div class="fs-ido fs-be{x}">{ik("lab", "fs-lab")}<div class="fs-ev">{y}</div><strong class="fs-ido-cim">{c}</strong><p class="fs-ido-szoveg">{t}</p></div>' for y, c, t, x in IDO) + '</div>'
 f'<div class="fs-partnerek fs-be"><div class="fs-szalag">Szakmai partnereink</div><h3 class="fs-cim3">Mert a fenntarthatóság egyedül nem megy</h3><div class="fs-partner-racs">{logok("partner", True)}</div></div></div></section>'))

UT = [('haz', 'Magánszemély vagyok', 'Számold ki a lábnyomod, töltsd le az appot.'), ('telepules', 'Polgármester vagyok', 'Már 15 önkormányzat dolgozik velünk.'), ('taska', 'Vállalkozásom van', 'Új vásárlók, zöld programok, ESG.')]
SZ.append(('utak', '<section class="fs-szekcio fs-utak" id="utak"><div class="fs-burok"><div class="fs-szekcio-fej fs-be"><div class="fs-szalag">Kinek szól?</div><h2 class="fs-cim2">Neked, a településednek és a cégednek is</h2><p class="fs-szekcio-lead">Válaszd ki, ki vagy, és a méhecske két-három kérdés után megmutatja a következő lépést.</p></div>'
 '<div class="fs-utak-racs"><div class="fs-utvalaszto">' + ''.join(f'<a class="fs-utgomb" href="#utak"><span class="fs-pin">{pk(i)}</span><strong class="fs-ut-cim">{c}</strong><span class="fs-ut-szoveg">{t}</span></a>' for i, c, t in UT) + '</div>'
 f'<div class="fs-kviz"><div class="fs-kviz-fej"><div class="fs-kviz-mehhely"><img class="fs-meh-kep" src="{S3}{HOS}" alt=""></div><p class="fs-buborek">Szia! Segítek kideríteni, miben vagy már ökohős.</p></div><div class="fs-kviz-test"><p class="fs-kviz-hely">A kérdések itt jelennek meg.</p></div></div></div></div></section>'))

TERMEK = [('Locsoljunk együtt! póló', '5 990 Ft', 'Kék beeco póló „Locsoljunk együtt!” felirattal'), ('Locsoló trikó, férfi', '5 490 Ft', 'Kék beeco férfi trikó'), ('Nyomtatott infografika', '4 900 Ft', 'Színes, méhecskés nyomtatott infografika')]
PEDIA = [('play', 'Tartalomajánló', 'Film, könyv, app, tipp, podcast, petíció', 'https://www.beeco.hu/beecopedia/okos-tartalmak'), ('kesvilla', 'Ökos étkezés', 'Helyi, szezonális alapanyagok és növényi receptek', 'https://www.beeco.hu/beecopedia/szezonalis-etkezes'),
         ('olvas', 'Blogcikkek', 'Gazdaság, természetvédelem, technológia, hírek', 'https://www.beeco.hu/beecopedia/blog'), ('kuka', 'Hulladék', 'Ne csak szelektálj, fogj diétára a kukádat!', 'https://www.beeco.hu/beecopedia/szemet-csokkento-kisokos')]
SZ.append(('beebolt', '<section class="fs-szekcio fs-beebolt" id="beebolt"><div class="fs-burok"><div class="fs-bolt-fej fs-be">' + pk('doboz', 'fs-fej-piko') + '<div class="fs-szekcio-fej"><div class="fs-szalag">beebolt</div><h2 class="fs-cim2">Támogasd ökosságokkal a munkánkat!</h2><p class="fs-szekcio-lead">Fenntartható, edukatív és cuki termékek. Minden vásárlással az app fejlesztését támogatod.</p></div><a class="fs-gomb fs-bolt-gomb" href="https://www.beeco.hu/beebolt" target="_blank" rel="noopener">Irány a beebolt</a></div>'
 '<div class="fs-termekek">' + ''.join(f'<a class="fs-kartya fs-termek fs-be" href="https://www.beeco.hu/beebolt" target="_blank" rel="noopener"><img class="fs-termek-kep" src="{S3}{BOLT[i]}" alt="{e(a)}"><strong class="fs-termek-nev">{n}</strong><span class="fs-termek-ar">{p}</span></a>' for i, (n, p, a) in enumerate(TERMEK)) + '</div></div></section>'))
SZ.append(('pedia', '<section class="fs-szekcio fs-pedia-szekcio" id="beecopedia"><div class="fs-burok"><div class="fs-kartya fs-pedia fs-be"><div class="fs-szalag">beecopedia</div><h3 class="fs-cim3">Ha tanulnál, akkor beecopedia!</h3><div class="fs-pedia-lista">' +
 ''.join(f'<a class="fs-pedia-link" href="{u}" target="_blank" rel="noopener"><span class="fs-pin">{pk(i)}</span><span class="fs-pedia-szoveg"><strong class="fs-pedia-cim">{c}</strong><span class="fs-pedia-mi">{d}</span></span><span class="fs-pedia-nyil">›</span></a>' for i, c, d, u in PEDIA) +
 '</div></div></div></section>'))

KERD = [('Ingyenes a beeco app?', 'A beeco letöltése ingyenes, és minden funkcióhoz hozzáférsz.'),
        ('Mi az a lábnyomkalkulátor, és mennyi idő kitölteni?', 'Egy egyszerű kérdőív az életmódodról: segít megérteni az otthonod, az étkezésed és a közlekedésed környezeti hatását. A rövid része 3 perc, és becsült képet ad. A részletes legalább 15 perc, és bármikor folytathatod.'),
        ('Mit kapok a végén?', 'Megmutatjuk a víz-, karbon- és hulladéklábnyomodat. De nem hagyunk csüggedni: egyből azt is megmutatjuk, mit tehetsz a csökkentésért, rád szabva.'),
        ('Mire jó a Nektár?', 'A Nektár egy jutalmazó rendszer, amellyel megmutatjuk, hogy minden kis lépés számít. Gyűjtsd a nektárt a beeco appban jutalmakért és exkluzív kuponokért!'),
        ('Hogyan működik a kuponbeváltás?', 'Az appban aktiválod a kupont, a partnernél felmutatod a QR-kódot, és megkapod a kedvezményed. Közben nektárt is gyűjtesz.'),
        ('Mi alapján kerülnek tartalmak az appba?', 'Képzelj el egy fenntartható 2050-et. Ez a zöld világ sokoldalú, így a hozzá kapcsolódó vállalkozások, helyek és események is. Szakértő csapatunk folyamatosan frissíti az értékelési rendszerünket, ez alapján kerül be egy tartalom.')]
SZ.append(('gyik', '<section class="fs-szekcio fs-gyik" id="gyik"><div class="fs-burok fs-gyik-racs"><div class="fs-szekcio-fej fs-gyik-fej">' + pk('howto', 'fs-fej-piko') + '<div class="fs-szalag">GYIK</div><h2 class="fs-cim2">Gyakori kérdések</h2><p class="fs-szekcio-lead">Nem találod, amit keresel? <a class="fs-szoveglink" href="https://www.beeco.hu/gyik" target="_blank" rel="noopener">További válaszok</a></p></div><div class="fs-kerdesek">' +
 ''.join(f'<details class="fs-kerdes"><summary class="fs-kerdes-k">{q}</summary><p class="fs-kerdes-v">{a}</p></details>' for q, a in KERD) + '</div></div></section>'))

KERDESEK = ['Egy zöld jövőt szeretnél?', 'Élhetőbb környezetet szeretnél?', 'Tisztább levegőt a gyerekeidnek?', 'Kevesebb szemetet az utcádon?', 'Több fát a városodba?', 'Egy közösséget, ahol nem vagy egyedül?']
SZ.append(('letoltes', f'''<section class="fs-szekcio fs-zaro" id="letoltes"><div class="fs-burok fs-racs"><div class="fs-zaro-szoveg">
<div class="fs-forgo"><ul class="fs-forgo-lista">{''.join(f'<li class="fs-forgo-elem">{q}</li>' for q in KERDESEK)}</ul></div><h2 class="fs-cim2 fs-zaro-cim">Légy te a változás, amit a világban látni szeretnél!</h2><p class="fs-alcim">Légy pozitív öko példakép, és ebben segít neked a beeco: töltsd le az appot, és nézd meg, mi legyen a következő lépésed.</p>
{boltok()}
<div class="fs-qr fs-csak-asztal"><img class="fs-qr-kep" src="{S3}{QR}" alt="QR-kód a beeco app letöltéséhez"><p class="fs-qr-szoveg">Gépen olvasod? Olvasd be a telefonoddal.</p></div>
<div class="fs-hirlevel"><p class="fs-hirlevel-cim">{pk("posta")}Most nem töltenéd le? Maradj a rajban!</p><p class="fs-hirlevel-szoveg">Új funkciók, zöld tippek, események és kampányok a hírlevelünkben.</p><a class="fs-gomb fs-gomb-masod fs-hirlevel-gomb" href="/feliratkozas">Feliratkozom</a></div>
</div><img class="fs-zaro-telefon" src="{S3}{APP["terkep"]}" alt="A beeco Zöld térképe a telefonon"></div></section>'''))

# matrica-szél elválasztók szalagja: mini idézetek valódi App Store-véleményekből (a szekció végére kerül)
IDEZET = {'miert': ('„Építi az emberi közösséget.”', 'gazdagergo'), 'rolunk': ('„Igazi kis oázis.”', 'holladri01'), 'beebolt': ('„Összehoz minket.”', 'Kriki21')}
SZ = [(n, h[:h.rindex('</section>')] + f'<div class="fs-szalag-idezet"><span class="fs-szi-szoveg">{IDEZET[n][0]}</span><span class="fs-szi-nev">{IDEZET[n][1]}</span></div></section>') if n in IDEZET else (n, h) for n, h in SZ]

# osztály-csonkok (a whtml csak CSS-sel együtt tartja meg az osztályt; az egyedi tulajdonság semmit nem befolyásol)
def csonkok(h):
    out = []
    for cl in re.findall(r'class="([^"]+)"', h):
        t = cl.split()
        sel = '.' + t[0] if len(t) == 1 else '.' + '.'.join(t)
        out.append('.' + t[0] + '{--fs:1}')
        if len(t) > 1: out.append(sel + '{--fs:1}')
    return ''.join(dict.fromkeys(out))

csak = sys.argv[1:]
kimenet = [{'nev': n, 'html': re.sub(r'\n', '', h), 'css': csonkok(h)} for n, h in SZ if not csak or n in csak]
json.dump(kimenet, open(os.path.join(D, 'wf_szekciok.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('szekciók:', [(k['nev'], len(k['html']), len(k['css'])) for k in kimenet])
