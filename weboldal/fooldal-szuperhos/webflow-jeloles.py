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
QR = '69cd05a01e5ed130291d83f9_web%20qr%20leto%CC%88lte%CC%81s.png'
L = {}
for line in open(os.path.join(D, 'lista.tsv'), encoding='utf8'):
    f = line.rstrip('\n').split('\t')
    if f[0] in ('sajto', 'partner'):
        L[f[0] + '-' + f[1]] = (f[2], f[3].split('/648ebb1f9ae84f3d530e2f2d/')[1])
NEV = {'sajto': ['Telex', 'Trade magazin', 'MVM Smart Future Lab', 'Zöld Hang podcast', 'Marie Claire', 'Startuponline', 'We Love Budapest', 'Daily News Hungary', 'Pannon Egyetem GTK podcast', 'BME', 'Minner'],
       'partner': ['BME', 'Pannon Egyetem', 'Erdőszeretet Szövetség', 'Élhető Települések Országos Szövetsége', 'ELTE TáTK', 'Budapesti Corvinus Egyetem', 'Felelős Gasztrohős', 'Tudatos Vásárlók Egyesülete', '10 millió fa', 'Humusz Szövetség', 'MAVEG Magyar Vegán Egyesület', 'I-DEST']}
e = lambda s: H.escape(s, quote=True)
ik = lambda n, extra='': f'<span class="fs-ik fs-ik-{n}{(" " + extra) if extra else ""}"></span>'
def logok(t):
    return ''.join(f'<a class="fs-logo-csempe" href="{e(L[t+"-"+str(i)][0])}" target="_blank" rel="noopener"><img class="fs-logo-kep" src="{S3}{L[t+"-"+str(i)][1]}" alt="{e(n)}"></a>' for i, n in enumerate(NEV[t]))

FUNK = [('lab', 'Lábnyom', 'lab', 'Kezdd a lábnyomoddal!', 'Számold ki a karbon-, szemét- és vízlábnyomod, és nézd meg, hol állsz másokhoz képest.'),
        ('terkep', 'Térkép', 'pin', 'Nézz körül a közelben!', 'Zöld térkép: boltok, javítók, szelektív gyűjtők és ökos pontok a közeledben.'),
        ('vasarlas', 'Kuponok', 'kupon', 'Vásárolj ökosan!', 'Kuponfüzet: kedvezmények zöld partnerektől, nektár minden beváltásért.'),
        ('hir', 'Tudás', 'hir', 'Legyél naprakész!', 'Ökos tudás röviden: tippek, hírek és útmutatók, például az okostányér.'),
        ('kozosseg', 'Programok', 'nap', 'Találj rajtársakra!', 'Kaptárnaptár: havi 100+ zöld program, vásár, csere-bere és képzés.'),
        ('nektar', 'Nektár', 'csepp', 'Gyűjts nektárt!', 'Minden lépésedért nektár jár, a ranglistán pedig látod, hol tartasz.')]
APP_ALT = {'lab': 'A beeco Lábnyomkalkulátor: a karbonlábnyomod tonnában, összevetve a világ, a magyar és a beeco-átlaggal',
           'hir': 'Az Ökos tudás képernyő az okostányér útmutatóval', 'terkep': 'A Zöld térkép zöld helyekkel: boltok, javítók, szelektív gyűjtők a közelben',
           'kozosseg': 'A Kaptárnaptár havi zöld eseményekkel és a Napi ökossággal', 'vasarlas': 'A Kuponfüzet kiemelt kuponokkal zöld partnerektől',
           'nektar': 'A Ranglista: a legaktívabb zümmögők nektárja'}

SZ = []
SZ.append(('hero', f'''<section class="fs-hero" id="kezdes"><div class="fs-burok fs-hero-racs"><div class="fs-hero-szoveg">
<div class="fs-szalag">Ingyenes magyar app</div>
<h1 class="fs-hero-cim">Zöld életmód app, ami megmutatja <span class="fs-szalag-nagy">a következő lépésed</span></h1>
<p class="fs-lead">Számold ki a lábnyomod, találj zöld helyeket és programokat a közeledben, és gyűjts nektárt minden lépésért.</p>
<div class="fs-cta-sor"><a class="fs-gomb fs-okos-letoltes" href="#letoltes">Töltsd le az appot</a></div>
<div class="fs-bizalom"><span class="fs-biz"><span class="fs-csillag">★</span> <strong class="fs-biz-szam">4,6</strong> App Store</span><span class="fs-biz"><span class="fs-csillag">★</span> <strong class="fs-biz-szam">4,2</strong> Google Play</span><span class="fs-biz"><strong class="fs-biz-szam">25.000+</strong> letöltés</span></div>
<p class="fs-hero-sugo">{ik("lab")}Nézz bele az appba: válassz egy funkciót.</p>
<div class="fs-felirat"><h2 class="fs-felirat-cim">{FUNK[0][3]}</h2><p class="fs-felirat-szoveg">{FUNK[0][4]}</p></div>
</div><div class="fs-kaptar-szin"><div class="fs-app-kepek">''' +
 ''.join(f'<img class="fs-app-kep" src="{S3}{APP[k]}" alt="{e(APP_ALT[k])}">' for k, *_ in FUNK) + '</div>' +
 ''.join(f'<a class="fs-funk fs-f-{i+1}" href="#kezdes"><span class="fs-pin">{ik(icon)}</span><span class="fs-nev">{nev}</span><span class="fs-funk-cim">{cim}</span><span class="fs-funk-szoveg">{sz}</span></a>' for i, (k, nev, icon, cim, sz) in enumerate(FUNK)) +
 '</div></div></section>'))

SZ.append(('sajto', f'<section class="fs-sajto"><div class="fs-burok fs-sajto-sor"><div class="fs-sajto-cim">Írtak rólunk</div><div class="fs-logosor">{logok("sajto")}</div></div></section>'))

SZ.append(('mostfut', '<a class="fs-most-fut" href="https://www.beeco.hu/kampanyok/csicsergosz" target="_blank" rel="noopener"><div class="fs-burok fs-most-sor"><div class="fs-szalag fs-szalag-mez">Most fut</div><div class="fs-most-szoveg"><strong>CsicsergŐsz:</strong> ismerd meg a körülötted élő madarakat, és segíts nekik az appal.</div><div class="fs-most-nyil">Irány a kampány ›</div></div></a>'))

VEL = [('„A legjobb dolog, amire okostelefont 2026-ban használni lehet. Építi az emberi közösséget és a természeti környezetet.”', 'gazdagergo, App Store'),
       ('„Nagyon kreatív app, összehoz minket, emellett jobbá teszi a környezetet, a programok miatt is csak jobb.”', 'Kriki21, App Store'),
       ('„Szuper kezdeményezés, remélem egyre többen csatlakoznak!”', 'Bandaminta, App Store')]
LEP = [('Megértés', 'Számold ki a lábnyomod: nézd meg, miben vagy erős, és min érdemes javítani.'),
       ('Cselekvés', 'Megmutatjuk a következő lépést, és hogy hol teheted meg a közeledben: zöld helyek, programok, kuponok.'),
       ('Megerősítés', 'Minden apró lépésedért nektár jár, és egy közösség, amelyben nem vagy egyedül.')]
SZ.append(('miert', '<section class="fs-szekcio fs-miert" id="miert"><div class="fs-burok"><div class="fs-szekcio-fej fs-be"><div class="fs-szalag">Miért a beeco?</div><h2 class="fs-cim2"><span class="fs-sor">A klímaváltozás nagy.</span> A te lépéseid is számítanak.</h2><p class="fs-lead">Sokan érezzük, hogy kevés, amit egyedül tehetünk. Ezt a tehetetlenséget apró, konkrét lépésekre bontjuk, és végig melletted vagyunk.</p></div>'
 '<div class="fs-lepesek">' + ''.join(f'<div class="fs-kartya fs-lepes fs-be"><div class="fs-lepes-fej"><div class="fs-pin fs-lepes-szam">{i+1}</div><h3 class="fs-lepes-cim">{c}</h3></div><p class="fs-lepes-szoveg">{t}</p></div>' for i, (c, t) in enumerate(LEP)) + '</div>'
 '<div class="fs-velemeny-fej fs-be"><h3 class="fs-velemeny-cim">Akik már használják</h3><div class="fs-ertekeles"><span class="fs-csillag">★</span> <strong>4,6</strong> App Store, 70 értékelés</div><div class="fs-ertekeles"><span class="fs-csillag">★</span> <strong>4,2</strong> Google Play, 106 értékelés</div></div>'
 '<div class="fs-velemenyek">' + ''.join(f'<figure class="fs-kartya fs-velemeny fs-be"><div class="fs-csillag fs-csillagok">★★★★★</div><blockquote class="fs-idezet">{q}</blockquote><figcaption class="fs-forras">{c}</figcaption></figure>' for q, c in VEL) + '</div></div></section>'))

SZ.append(('raj', '<section class="fs-szekcio fs-raj" id="raj"><div class="fs-burok fs-racs"><div class="fs-raj-szoveg"><div class="fs-szalag fs-szalag-mez">Közösség</div><h2 class="fs-cim2"><span class="fs-halk">Egy méh nem csinál csodát, de...</span> egy egész raj felvirágoztatja a környezetét!</h2><p class="fs-lead">Apró lépésekkel csökkentjük a tehetetlenség érzését, és támogatjuk egymást. Ne csüggedj, nem vagy egyedül!</p>'
 '<div class="fs-hatas"><div class="fs-hatas-cim">Önkéntes vízadás, 2025 nyara</div><div class="fs-hatas-racs"><div class="fs-hatas-elem"><strong class="fs-hatas-szam">7 000</strong><span class="fs-hatas-mi">fa kapott inni</span></div><div class="fs-hatas-elem"><strong class="fs-hatas-szam">400 000</strong><span class="fs-hatas-mi">liter víz</span></div><div class="fs-hatas-elem"><strong class="fs-hatas-szam">1 500</strong><span class="fs-hatas-mi">aktív locsoló</span></div></div><a class="fs-hatas-forras" href="https://telex.hu/belfold/2025/09/21/aszaly-onkentes-vizadas-locsolakoma-fokert-beeco-10-millio-fa-eredmenyek" target="_blank" rel="noopener">Telex, 2025. szeptember 21.</a></div>'
 '<div class="fs-cta-sor"><a class="fs-gomb fs-csatlakoz" href="#raj">Beállok a rajba</a></div><p class="fs-raj-uzenet"></p></div>'
 '<div class="fs-raj-szin"><div class="fs-raj-kozep"><strong class="fs-raj-szam">25.000+</strong><span class="fs-raj-mi">letöltés</span></div></div></div></section>'))

IDO = [('2023', 'Climate Launchpad, magyar döntő'), ('2023', 'MVM Edison, 3. hely'), ('2024', 'Elindult az ország legnagyobb zöld platformja'), ('2025', 'WebSummit Lisszabon, startup-kiállítás'), ('2025', 'ONE Digitális díj, zöld kategória, 1. hely')]
SZ.append(('rolunk', '<section class="fs-szekcio fs-rolunk" id="rolunk"><div class="fs-burok"><div class="fs-szekcio-fej fs-be"><div class="fs-szalag">Rólunk</div><h2 class="fs-cim2">Kik állnak a beeco mögött?</h2><p class="fs-szekcio-lead">Többszörösen elismert magyar startup, önkéntesekből és szakemberekből, egyetemi és civil partnerekkel.</p></div>'
 '<div class="fs-idovonal">' + ''.join(f'<div class="fs-ido fs-be{" fs-ido-fo" if i == 4 else ""}">{ik("lab", "fs-lab")}<div class="fs-ev">{y}</div><p class="fs-ido-szoveg">{t}</p></div>' for i, (y, t) in enumerate(IDO)) + '</div>'
 f'<div class="fs-rolunk-racs"><div class="fs-kartya fs-csapat fs-be"><img class="fs-csapat-kep" src="{S3}{CSAPAT}" alt="A beeco 29 fős csapata bézs pólóban, középen egy méhjelmezes taggal"><div class="fs-csapat-test"><div class="fs-szalag">A csapat</div><h3 class="fs-cim3">Nyolc szakcsapat, egy cél</h3><p class="fs-csapat-szoveg">Tinédzserek, egyetemisták, friss pályakezdők és tapasztalt szakemberek. Városiak és vidékiek, közgazdászok, mérnökök és grafikusok dolgoznak együtt.</p>'
 '<div class="fs-chipek">' + ''.join(f'<span class="fs-chip">{c}</span>' for c in ['Szoftveres', 'Webes', 'Térképész', 'Kreatív', 'Marketing', '+3 csapat']) + '</div><a class="fs-gomb fs-gomb-masod fs-csapat-gomb" href="https://www.beeco.hu/csapat" target="_blank" rel="noopener">Csatlakozz a csapathoz</a></div></div>'
 f'<div class="fs-partnerek fs-be"><div class="fs-szalag">Szakmai partnereink</div><h3 class="fs-cim3">Mert a fenntarthatóság egyedül nem megy</h3><div class="fs-partner-racs">{logok("partner")}</div></div></div></div></section>'))

UT = [('lab', 'Magánszemély vagyok', 'Számold ki a lábnyomod, töltsd le az appot.'), ('varos', 'Polgármester vagyok', 'Már 15 önkormányzat dolgozik velünk.'), ('bolt', 'Vállalkozásom van', 'Új vásárlók, zöld programok, ESG.')]
SZ.append(('utak', '<section class="fs-szekcio fs-utak" id="utak"><div class="fs-burok"><div class="fs-szekcio-fej fs-be"><div class="fs-szalag">Kinek szól?</div><h2 class="fs-cim2">Neked, a településednek és a cégednek is</h2><p class="fs-szekcio-lead">Válaszd ki, ki vagy, és a méhecske két-három kérdés után megmutatja a következő lépést.</p></div>'
 '<div class="fs-utak-racs"><div class="fs-utvalaszto">' + ''.join(f'<a class="fs-utgomb" href="#utak"><span class="fs-pin">{ik(i)}</span><strong class="fs-ut-cim">{c}</strong><span class="fs-ut-szoveg">{t}</span></a>' for i, c, t in UT) + '</div>'
 f'<div class="fs-kviz"><div class="fs-kviz-fej"><div class="fs-kviz-mehhely"><img class="fs-meh-kep" src="{S3}{HOS}" alt=""></div><p class="fs-buborek">Szia! Segítek kideríteni, miben vagy már ökohős.</p></div><div class="fs-kviz-test"><p class="fs-kviz-hely">A kérdések itt jelennek meg.</p></div></div></div></div></section>'))

TERMEK = [('Locsoljunk együtt! póló', '5 990 Ft', 'Kék beeco póló „Locsoljunk együtt!” felirattal'), ('Locsoló trikó, férfi', '5 490 Ft', 'Kék beeco férfi trikó'), ('Nyomtatott infografika', '4 900 Ft', 'Színes, méhecskés nyomtatott infografika')]
PEDIA = [('hir', 'Tartalomajánló', 'Film, könyv, app, tipp, podcast, petíció', 'https://www.beeco.hu/beecopedia/okos-tartalmak'), ('tal', 'Ökos étkezés', 'Helyi, szezonális alapanyagok és növényi receptek', 'https://www.beeco.hu/beecopedia/szezonalis-etkezes'),
         ('nap', 'Blogcikkek', 'Gazdaság, természetvédelem, technológia, hírek', 'https://www.beeco.hu/beecopedia/blog'), ('kuka', 'Hulladék', 'Ne csak szelektálj, fogj diétára a kukádat!', 'https://www.beeco.hu/beecopedia/szemet-csokkento-kisokos')]
SZ.append(('tobb', '<section class="fs-szekcio fs-tobb" id="tobb"><div class="fs-burok fs-tobb-racs">'
 '<a class="fs-kartya fs-kartya-link fs-bolt-kartya fs-be" href="https://www.beeco.hu/beebolt" target="_blank" rel="noopener"><div class="fs-szalag">beebolt</div><h3 class="fs-cim3">Támogasd ökosságokkal a munkánkat!</h3><div class="fs-termekek">' +
 ''.join(f'<div class="fs-termek"><img class="fs-termek-kep" src="{S3}{BOLT[i]}" alt="{e(a)}"><strong class="fs-termek-nev">{n}</strong><span class="fs-termek-ar">{p}</span></div>' for i, (n, p, a) in enumerate(TERMEK)) +
 '</div><p class="fs-bolt-szoveg">Fenntartható, edukatív és cuki termékek. Minden vásárlással az app fejlesztését támogatod.</p><div class="fs-gomb">Irány a beebolt</div></a>'
 '<div class="fs-kartya fs-pedia fs-be"><div class="fs-szalag">beecopedia</div><h3 class="fs-cim3">Ha tanulnál, akkor beecopedia!</h3><div class="fs-pedia-lista">' +
 ''.join(f'<a class="fs-pedia-link" href="{u}" target="_blank" rel="noopener"><span class="fs-pin">{ik(i)}</span><span class="fs-pedia-szoveg"><strong class="fs-pedia-cim">{c}</strong><span class="fs-pedia-mi">{d}</span></span><span class="fs-pedia-nyil">›</span></a>' for i, c, d, u in PEDIA) +
 '</div></div></div></section>'))

KERD = [('Ingyenes a beeco app?', 'A beeco letöltése ingyenes, és minden funkcióhoz hozzáférsz.'),
        ('Mi az a lábnyomkalkulátor, és mennyi idő kitölteni?', 'Egy egyszerű kérdőív az életmódodról: segít megérteni az otthonod, az étkezésed és a közlekedésed környezeti hatását. A rövid része 3 perc, és becsült képet ad. A részletes legalább 15 perc, és bármikor folytathatod.'),
        ('Mit kapok a végén?', 'Megmutatjuk a víz-, karbon- és hulladéklábnyomodat. De nem hagyunk csüggedni: egyből azt is megmutatjuk, mit tehetsz a csökkentésért, rád szabva.'),
        ('Mire jó a Nektár?', 'A Nektár egy jutalmazó rendszer, amellyel megmutatjuk, hogy minden kis lépés számít. Gyűjtsd a nektárt a beeco appban jutalmakért és exkluzív kuponokért!'),
        ('Hogyan működik a kuponbeváltás?', 'Az appban aktiválod a kupont, a partnernél felmutatod a QR-kódot, és megkapod a kedvezményed. Közben nektárt is gyűjtesz.'),
        ('Mi alapján kerülnek tartalmak az appba?', 'Képzelj el egy fenntartható 2050-et. Ez a zöld világ sokoldalú, így a hozzá kapcsolódó vállalkozások, helyek és események is. Szakértő csapatunk folyamatosan frissíti az értékelési rendszerünket, ez alapján kerül be egy tartalom.')]
SZ.append(('gyik', '<section class="fs-szekcio fs-gyik" id="gyik"><div class="fs-burok fs-gyik-racs"><div class="fs-szekcio-fej fs-gyik-fej"><div class="fs-szalag">GYIK</div><h2 class="fs-cim2">Gyakori kérdések</h2><p class="fs-szekcio-lead">Nem találod, amit keresel? <a class="fs-szoveglink" href="https://www.beeco.hu/gyik" target="_blank" rel="noopener">További válaszok</a></p></div><div class="fs-kerdesek">' +
 ''.join(f'<details class="fs-kerdes"><summary class="fs-kerdes-k">{q}</summary><p class="fs-kerdes-v">{a}</p></details>' for q, a in KERD) + '</div></div></section>'))

SZ.append(('letoltes', f'''<section class="fs-szekcio fs-zaro" id="letoltes"><div class="fs-burok fs-racs"><div class="fs-zaro-szoveg">
<div class="fs-szalag">Nem kell mindent egyszerre</div><h2 class="fs-cim2">Légy a holnap ökohőse, és beezz a rajban!</h2><p class="fs-alcim">Töltsd le az appot, és nézd meg, mi legyen a következő lépésed.</p>
<div class="fs-boltok"><a class="fs-bolt fs-csak-android" href="https://play.google.com/store/apps/details?id=hu.beeco.app" target="_blank" rel="noopener">{ik("play")}<span class="fs-bolt-felirat"><span class="fs-bolt-kicsi">Szerezd meg:</span><span class="fs-bolt-nagy">Google Play</span></span></a><a class="fs-bolt fs-csak-ios" href="https://apps.apple.com/hu/app/beeco/id6478549279?l=hu" target="_blank" rel="noopener">{ik("alma")}<span class="fs-bolt-felirat"><span class="fs-bolt-kicsi">Letölthető az</span><span class="fs-bolt-nagy">App Store-ból</span></span></a></div>
<div class="fs-qr fs-csak-asztal"><img class="fs-qr-kep" src="{S3}{QR}" alt="QR-kód a beeco app letöltéséhez"><p class="fs-qr-szoveg">Gépen olvasod? Olvasd be a telefonoddal.</p></div>
<div class="fs-hirlevel"><p class="fs-hirlevel-cim">Most nem töltenéd le? Maradj a rajban!</p><p class="fs-hirlevel-szoveg">Új funkciók, zöld tippek, események és kampányok a hírlevelünkben.</p><a class="fs-gomb fs-gomb-masod fs-hirlevel-gomb" href="/feliratkozas">Feliratkozom</a></div>
</div><img class="fs-zaro-telefon" src="{S3}{APP["terkep"]}" alt="A beeco Zöld térképe a telefonon"></div></section>'''))

# osztály-csonkok (a whtml csak CSS-sel együtt tartja meg az osztályt; az egyedi tulajdonság semmit nem befolyásol)
def csonkok(h):
    out = []
    for cl in re.findall(r'class="([^"]+)"', h):
        t = cl.split()
        sel = '.' + t[0] if len(t) == 1 else '.' + '.'.join(t)
        out.append('.' + t[0] + '{--fs:1}')
        if len(t) > 1: out.append(sel + '{--fs:1}')
    return ''.join(dict.fromkeys(out))

kimenet = [{'nev': n, 'html': re.sub(r'\n', '', h), 'css': csonkok(h)} for n, h in SZ]
json.dump(kimenet, open(os.path.join(D, 'wf_szekciok.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('szekciók:', [(k['nev'], len(k['html']), len(k['css'])) for k in kimenet])
