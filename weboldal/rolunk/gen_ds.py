"""Rólunk-oldalak (A /rolunk, B /csapatunk, C /hatasunk) natív Webflow-jelölése a whtml-építőhöz.
Közös, oldalfüggetlen design-system blokkok `ds-` előtaggal (szekció, szalag, címek, kártya, gomb, számsáv,
idővonal, logósor, tovább-kártyák). Színek, térközök, sugarak: beeco DS változók (egyetlen var() → a Webflow
a változóhoz köti). Csak Webflow által kezelt CSS: osztály, :hover/:focus/:active, töréspont 991/767/479.
Kimenet: ki/<oldal>.json – sorrendben beszúrandó whtml-akciók (a közös CSS csak az első használatnál megy)."""
import os, re, json, html as H

D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, 'ki'); os.makedirs(OUT, exist_ok=True)
e = lambda s: H.escape(s, quote=True)
SITE = '648ebb1f9ae84f3d530e2f2d'
S3 = f'https://s3.amazonaws.com/webflow-prod-assets/{SITE}/'
cdn2s3 = lambda u: re.sub(r'^https://cdn\.prod\.website-files\.com/' + SITE + '/', S3, u)
V = lambda n: f'var(--_beeco-ds---{n})'
T, M, S, X = '', '@media screen and (max-width: 991px)', '@media screen and (max-width: 767px)', '@media screen and (max-width: 479px)'
DISP = 'Lalezar, "Arial Black", sans-serif'
EASE = 'cubic-bezier(.23,1,.32,1)'
B4 = lambda w, st, c: ''.join(f'border-{o}-style:{st};border-{o}-width:{w};border-{o}-color:{c};' for o in ('top', 'right', 'bottom', 'left'))
R4 = lambda a, b: f'border-top-left-radius:{a};border-top-right-radius:{b};border-bottom-right-radius:{a};border-bottom-left-radius:{b};'
P4 = lambda t, r, b, l: f'padding-top:{t};padding-right:{r};padding-bottom:{b};padding-left:{l};'

# ---- képek (a Webflow-médiatárban lévők) ----
ADAT = os.path.join(D, '..', 'web-ds', 'adat')
FORRAS = json.load(open(os.path.join(ADAT, 'kepek.json')))  # a Webflow-médiatár képei (kulcs → CDN-URL)
KEP = {k: cdn2s3(v) for k, v in FORRAS.items()}
KEP['one-dij'] = S3 + '6ad0cd23743dc00b7ce65c3b_rolunk-one-dij-2025.webp'
PIKO = {'lab': '6acdcf5d31a1079e200f1faa', 'csepp': '6acdcf7ba358827ed21560fa', 'otlet': None, 'sziv': None}
NAVGEN = open(os.path.join(D, '..', 'kozos', 'navigacio', 'gen.py')).read()
PIKO = dict(re.findall(r"'([a-z]+)': '([0-9a-f]{24})'", NAVGEN.split('PIKO = {', 1)[1].split('}', 1)[0]))
PIKO['raj'] = '6acdcfb0f2f41b180badebb7'
pk = lambda n, c: f'<img class="{c}" src="{S3}{PIKO[n]}_fs-piko-{n}.svg" alt="" loading="lazy">'
# partner- és sajtólogók (alt → URL), a főoldal-draft logósorából kigyűjtve
LOGO = {k: cdn2s3(v) for k, v in json.load(open(os.path.join(ADAT, 'logok.json'))).items()}

def css(sz):
    ki = []
    for m, blokk in sz.items():
        b = ''.join(f'{k}{{{v}}}' for k, v in blokk.items())
        ki.append(f'{m}{{{b}}}' if m else b)
    return ''.join(ki)

# ---------------- KÖZÖS DS-BLOKKOK ----------------
KOZOS = {
 T: {
  '.ds-szekcio': P4('96px', '0px', '96px', '0px') + f'position:relative;background-color:{V("bc-bg")};color:{V("bc-ink")}',
  '.ds-hatter-feher': f'background-color:{V("bc-surface")}',
  '.ds-hatter-zold': f'background-color:{V("bc-surface-2")}',
  '.ds-hatter-vaj': f'background-color:{V("bc-vaj")}',
  '.ds-hatter-sotet': f'background-color:{V("bc-raj-bg")};color:{V("bc-on-olive")}',
  '.ds-burok': 'width:100%;max-width:1200px;margin-left:auto;margin-right:auto;' + P4('0px', '24px', '0px', '24px'),
  '.ds-szekcio-fej': 'display:flex;flex-direction:column;align-items:flex-start;row-gap:14px;max-width:760px;margin-bottom:44px',
  '.ds-szalag': f'display:inline-block;{P4("6px", "12px", "3px", "12px")}background-color:{V("bc-accent")};color:#000000;font-family:{DISP};font-size:16px;line-height:1.1;transform:rotate(-2deg)',
  '.ds-cim1': f'margin-top:0px;margin-bottom:0px;color:inherit;font-family:{DISP};font-size:58px;line-height:1.02;font-weight:400',
  '.ds-cim2': f'margin-top:0px;margin-bottom:0px;color:inherit;font-family:{DISP};font-size:42px;line-height:1.05;font-weight:400',
  '.ds-cim3': f'margin-top:0px;margin-bottom:0px;color:inherit;font-family:{DISP};font-size:24px;line-height:1.1;font-weight:400',
  '.ds-kiemel': f'background-color:{V("bc-accent")};color:#000000;{P4("0px", "8px", "0px", "8px")}',
  '.ds-lead': f'margin-top:0px;margin-bottom:0px;max-width:640px;color:{V("bc-ink-soft")};font-size:19px;line-height:1.55',
  '.ds-szoveg': f'margin-top:0px;margin-bottom:0px;color:{V("bc-ink-soft")};font-size:16px;line-height:1.6',
  '.ds-gombsor': 'display:flex;flex-wrap:wrap;align-items:center;column-gap:14px;row-gap:12px',
  '.ds-gomb': f'display:inline-flex;align-items:center;justify-content:center;min-height:48px;{P4("13px", "22px", "10px", "22px")}{B4("2px", "solid", "#000000")}{R4("14px", "4px")}background-color:{V("bc-accent")};box-shadow:3px 3px 0 0 #000000;color:#000000;font-family:{DISP};font-size:19px;line-height:1;text-decoration:none;transition:transform 160ms {EASE}, box-shadow 160ms {EASE}',
  '.ds-gomb:hover': f'color:#000000;font-family:{DISP};text-decoration:none;transform:translate(-1px,-2px);box-shadow:4px 5px 0 0 #000000',  # a site globális a:hover-e Open Sansra váltana → szélesedő gomb, mobilon elcsúszó koppintás
  '.ds-gomb:active': 'transform:translate(2px,2px);box-shadow:1px 1px 0 0 #000000',
  '.ds-masod': 'background-color:#ffffff',
  '.ds-chipsor': 'display:flex;flex-wrap:wrap;column-gap:10px;row-gap:10px;margin-top:22px',
  '.ds-chip': f'{P4("7px", "12px", "6px", "12px")}{B4("2px", "solid", "#000000")}{R4("999px", "999px")}background-color:#ffffff;color:#000000;font-size:14px;font-weight:700;line-height:1.2',
  '.ds-foto': f'position:relative;margin-top:0px;margin-bottom:0px;margin-left:0px;margin-right:0px;{B4("3px", "solid", "#000000")}{R4("18px", "6px")}overflow:hidden;background-color:#ffffff;box-shadow:6px 6px 0 0 #000000',
  '.ds-foto-kep': 'display:block;width:100%;height:100%;object-fit:cover',
  '.ds-foto-felirat': f'position:absolute;left:12px;bottom:12px;{P4("6px", "10px", "4px", "10px")}background-color:#000000;color:#ffffff;font-size:13px;font-weight:700;line-height:1.2',
  '.ds-harom': 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:22px;row-gap:22px',
  '.ds-kartya': f'display:flex;flex-direction:column;row-gap:10px;{P4("26px", "24px", "26px", "24px")}{B4("2px", "solid", "#000000")}{R4("18px", "6px")}background-color:{V("bc-surface")};box-shadow:4px 4px 0 0 #000000;color:{V("bc-ink")}',
  '.ds-kartya-piko': 'width:56px;height:56px',
  '.ds-forras': f'margin-top:22px;color:{V("bc-ink-muted")};font-size:13px;line-height:1.5',
 },
 M: {
  '.ds-szekcio': P4('72px', '0px', '72px', '0px'),
  '.ds-cim1': 'font-size:48px', '.ds-cim2': 'font-size:36px',
  '.ds-harom': 'grid-template-columns:minmax(0,1fr)',
 },
 S: {
  '.ds-szekcio': P4('56px', '0px', '56px', '0px'),
  '.ds-burok': P4('0px', '16px', '0px', '16px'),
  '.ds-cim1': 'font-size:40px', '.ds-cim2': 'font-size:31px',
  '.ds-lead': 'font-size:17px', '.ds-szekcio-fej': 'margin-bottom:32px',
 },
}

# ---------------- A · RÓLUNK ----------------
A_CSS = {
 T: {
  '.ds-hero-racs': 'display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,0.95fr);column-gap:56px;row-gap:40px;align-items:center',
  '.ds-hero-szoveg': 'display:flex;flex-direction:column;align-items:flex-start;row-gap:20px',
  '.ds-hero-foto': 'aspect-ratio:4/3;transform:rotate(1.5deg)',
  '.ds-ido': f'display:flex;flex-direction:column;row-gap:56px;{P4("0px", "0px", "0px", "36px")}border-left-style:dashed;border-left-width:3px;border-left-color:#000000',
  '.ds-ido-ev': 'position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:40px;row-gap:24px;align-items:start',
  '.ds-ido-szoveg': 'display:flex;flex-direction:column;row-gap:12px',
  '.ds-ido-szam': f'align-self:flex-start;{P4("4px", "12px", "0px", "12px")}background-color:#000000;color:{V("bc-accent")};font-family:{DISP};font-size:30px;line-height:1.1;transform:rotate(-2deg)',
  '.ds-ido-lista': 'display:flex;flex-direction:column;row-gap:10px;margin-top:4px;margin-bottom:0px;padding-left:0px;list-style-type:none',
  '.ds-ido-elem': f'display:grid;grid-template-columns:86px minmax(0,1fr);column-gap:12px;color:{V("bc-ink")};font-size:16px;line-height:1.5',
  '.ds-ido-ho': f'color:{V("bc-accent-ink")};font-size:13px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;line-height:1.9',
  '.ds-ido-fotok': 'display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:16px;row-gap:16px',
  '.ds-ido-foto': 'aspect-ratio:4/3',
  '.ds-szoveglink': f'display:inline-flex;align-items:center;min-height:44px;color:{V("bc-ink")};font-weight:800;text-decoration:underline',
  '.ds-szoveglink:hover': f'color:{V("bc-ink")};font-weight:800;text-decoration:none',
  '.ds-szamsav': 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:22px;row-gap:22px',
  '.ds-szam': f'display:flex;flex-direction:column;row-gap:6px;{P4("22px", "22px", "20px", "22px")}border-top-style:solid;border-top-width:3px;border-top-color:{V("bc-accent")}',
  '.ds-szam-ertek': f'color:{V("bc-accent")};font-family:{DISP};font-size:46px;line-height:1',
  '.ds-szam-felirat': 'color:#ffffff;font-size:16px;font-weight:700;line-height:1.35',
  '.ds-forras-sotet': f'color:{V("bc-on-olive")}',
  '.ds-tovabb': 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:28px;row-gap:28px',
  '.ds-tovabb-kartya': f'display:flex;flex-direction:column;{B4("3px", "solid", "#000000")}{R4("20px", "6px")}overflow:hidden;background-color:{V("bc-surface")};box-shadow:6px 6px 0 0 #000000;color:{V("bc-ink")};text-decoration:none;transition:transform 160ms {EASE}, box-shadow 160ms {EASE}',
  '.ds-tovabb-kartya:hover': f'color:{V("bc-ink")};text-decoration:none;transform:translate(-2px,-3px);box-shadow:8px 9px 0 0 #000000',
  '.ds-tovabb-kep': 'display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-bottom-style:solid;border-bottom-width:3px;border-bottom-color:#000000',
  '.ds-tovabb-test': 'display:flex;flex-direction:column;align-items:flex-start;row-gap:10px;' + P4('24px', '26px', '28px', '26px'),
  '.ds-tovabb-nyil': f'margin-top:6px;{P4("8px", "14px", "6px", "14px")}background-color:{V("bc-accent")};{B4("2px", "solid", "#000000")}{R4("10px", "3px")}color:#000000;font-family:{DISP};font-size:17px;line-height:1',
  '.ds-logosor': 'display:grid;grid-template-columns:repeat(6,minmax(0,1fr));column-gap:14px;row-gap:14px',
  '.ds-logo': f'display:flex;align-items:center;justify-content:center;height:96px;{P4("14px", "14px", "14px", "14px")}{B4("2px", "solid", "#000000")}{R4("14px", "4px")}background-color:#ffffff',
  '.ds-logo-kep': 'max-width:100%;max-height:64px;width:auto;height:auto;object-fit:contain',
  '.ds-zaro': 'display:flex;flex-direction:column;align-items:center;row-gap:18px;text-align:center',
  '.ds-zaro-lead': 'max-width:620px',
 },
 M: {
  '.ds-hero-racs': 'grid-template-columns:minmax(0,1fr)',
  '.ds-ido-ev': 'grid-template-columns:minmax(0,1fr)',
  '.ds-szamsav': 'grid-template-columns:repeat(2,minmax(0,1fr))',
  '.ds-logosor': 'grid-template-columns:repeat(4,minmax(0,1fr))',
 },
 S: {
  '.ds-ido': P4('0px', '0px', '0px', '20px'),
  '.ds-ido-elem': 'grid-template-columns:minmax(0,1fr);row-gap:0px',
  '.ds-tovabb': 'grid-template-columns:minmax(0,1fr)',
  '.ds-szam-ertek': 'font-size:38px',
  '.ds-logosor': 'grid-template-columns:repeat(3,minmax(0,1fr))',
  '.ds-logo': 'height:80px',
 },
 X: {
  '.ds-szamsav': 'grid-template-columns:minmax(0,1fr)',
  '.ds-logosor': 'grid-template-columns:repeat(2,minmax(0,1fr))',
 },
}

UTM = lambda hely: f'https://www.beeco.hu/letoltes?utm_source=beeco.hu&amp;utm_medium=rolunk&amp;utm_campaign={hely}'
fej = lambda szalag, cim, lead='': (f'<div class="ds-szekcio-fej"><div class="ds-szalag">{e(szalag)}</div><h2 class="ds-cim2">{cim}</h2>'
                                    + (f'<p class="ds-lead">{e(lead)}</p>' if lead else '') + '</div>')
foto = lambda kep, alt, felirat, extra='': (f'<figure class="ds-foto{extra}"><img class="ds-foto-kep" src="{KEP[kep]}" alt="{e(alt)}" loading="lazy">'
                                            + (f'<figcaption class="ds-foto-felirat">{e(felirat)}</figcaption>' if felirat else '') + '</figure>')

A_HERO = ('<section class="ds-szekcio ds-hatter-vaj" id="kezdes"><div class="ds-burok ds-hero-racs"><div class="ds-hero-szoveg">'
  '<div class="ds-szalag">Rólunk</div>'
  '<h1 class="ds-cim1">Egy raj, egy cél: <span class="ds-kiemel">a zöld 2050</span></h1>'
  '<p class="ds-lead">Magyar zöld életmód app és közösség vagyunk. Önkéntesekből és szakemberekből álló rajunk azon dolgozik, hogy a fenntartható élet könnyű, közös és jó érzés legyen.</p>'
  f'<div class="ds-gombsor"><a class="ds-gomb" href="{UTM("hero")}">Töltsd le az appot</a><a class="ds-gomb ds-masod" href="#tortenet">Nézd meg az utunkat</a></div>'
  '<div class="ds-chipsor"><div class="ds-chip">ONE Digitális Díj 2025: 1. hely</div><div class="ds-chip">4,6 az App Store-ban</div><div class="ds-chip">25.000+ letöltés</div></div>'
  '</div>' + foto('csapat-nagy', 'A beeco csapata bézs pólóban egy teremben, középen egy méhjelmezes taggal', 'A raj, teljes létszámban', ' ds-hero-foto') +
  '</div></section>')

kartya3 = lambda items: '<div class="ds-harom">' + ''.join(
  f'<div class="ds-kartya">{pk(p, "ds-kartya-piko")}<h3 class="ds-cim3">{e(c)}</h3><p class="ds-szoveg">{e(s)}</p></div>' for p, c, s in items) + '</div>'

A_ELVEK = ('<section class="ds-szekcio ds-hatter-feher"><div class="ds-burok">'
  + fej('Erről szól a beeco', 'Kevesebb ökoszorongás, több közös cselekvés')
  + kartya3([('otlet', 'Víziónk', 'Egy tudatos társadalom, ahol nem a fogyasztás határozza meg az embereket, hanem az, hogy mit és mennyit adnak vissza a társadalomnak és a természetnek.'),
             ('sziv', 'Missziónk', 'Pozitív hangulatú ökoplatformot építünk, ami motivál, edukál és tettekre ösztönöz. Közösséget építünk, és megmutatjuk, hogy nem vagy egyedül.'),
             ('lab', 'Küldetésünk', 'Tudományos alapú tudást osztunk meg kampányokban, tartalmakban és eseményeken, hogy csökkentsük a szorongást, és segítsünk fenntarthatóbban élni.')])
  + '</div></section>')

EVEK = [
 ('2023', 'A raj alakulása', [('Május', 'MVM Edison startupverseny: 3. hely'), ('Év', 'EIT Climate Launchpad: nemzetközi döntő'), ('Ősz', 'Első közös kiállások, egyetemi és civil partnerek')],
  [('edison-dij', 'A beeco csapata átveszi az MVM Edison startupverseny III. helyezését', 'MVM Edison, 3. hely'), ('unicef', 'Öt mosolygó csapattag egy kék UNICEF háttér előtt', 'Első rendezvények')]),
 ('2024', 'A beporzás éve', [('Tavasz', 'Elindul az app és az ország legnagyobb zöld térképe'), ('Nyár', 'Közösségi iroda a K&H Start It inkubátorban'), ('Ősz', 'A BME első fenntarthatósági napja, Web Summit Lisszabonban'), ('Tél', '40–50 fő az eseményeinken')],
  [('websummit', 'Három csapattag egy világító Web Summit felirat előtt éjszaka', 'Web Summit, Lisszabon'), ('bme-nap', 'Pódiumbeszélgetés a BME fenntarthatósági napján', 'BME fenntarthatósági nap')]),
 ('2025', 'A virágzás éve', [('Február', 'Sikeres közösségi finanszírozás a Brancson'), ('Április', 'F6S: 2. hely, fenntarthatósági kategória'), ('Nyár', 'Az ország első közösségi faöntöző kampánya: 7 000 fa, 400 000 liter'), ('November', 'ONE Digitális Díj: 1. hely, zöld kategória')],
  [('one-dij', 'A csapat a ONE Digitális Díj 2025 átadóján', 'ONE Digitális Díj, 1. hely'), ('bee-change', 'Két önkéntes háttal, bee the change feliratú beeco pólóban', 'Önkéntes Vízadás')]),
 ('2026', 'A terjeszkedés éve', [('Nyár', 'Önkéntes Vízadás: 784 352 liter víz, 2 162 vízadó, 15 partner-önkormányzat'), ('Ősz', 'CsicsergŐsz: madárbarát kampány az appban'), ('November', 'Újra a Web Summiton, Lisszabonban')],
  [('csapat-asztal', 'A beeco csapat egy asztal körül dolgozik', 'A raj munkában'), ('lisboa', 'Csapattagok Lisszabonban', 'Irány Lisszabon')]),
 ('2027', 'Cél: határok nélkül', [('Terv', 'A beeco külföldön is: még több település, közösség és ökohős')], []),
]
ido_ev = lambda ev, cim, el, fot: ('<div class="ds-ido-ev"><div class="ds-ido-szoveg">'
  f'<div class="ds-ido-szam">{ev}</div><h3 class="ds-cim3">{e(cim)}</h3><ul class="ds-ido-lista">'
  + ''.join(f'<li class="ds-ido-elem"><span class="ds-ido-ho">{e(h)}</span><span>{e(s)}</span></li>' for h, s in el) + '</ul></div>'
  + ('<div class="ds-ido-fotok">' + ''.join(foto(k, a, f, ' ds-ido-foto') for k, a, f in fot) + '</div>' if fot else '<div></div>') + '</div>')

A_IDO = ('<section class="ds-szekcio" id="tortenet"><div class="ds-burok">'
  + fej('Történetünk', 'Öt év, öt állomás', 'Egy ötletből országos közösség lett. Itt a rövid változat, a teljes történet fotókkal a Történetünk oldalon.')
  + '<div class="ds-ido">' + ''.join(ido_ev(*x) for x in EVEK) + '</div>'
  + '<p class="ds-forras"><a class="ds-szoveglink" href="/tortenetunk">A teljes történet fotókkal ›</a></p>'
  + '</div></section>')

SZAMOK = [('25.000+', 'letöltés'), ('23.000+', 'zöld pont a térképen'), ('15', 'partner-önkormányzat'),
          ('784 352', 'liter víz a fiatal fáknak 2026 nyarán'), ('100+', 'zöld program havonta'), ('12', 'szakmai partner')]
A_SZAM = ('<section class="ds-szekcio ds-hatter-sotet"><div class="ds-burok">'
  + '<div class="ds-szekcio-fej"><div class="ds-szalag">A közösség ereje</div><h2 class="ds-cim2">Ennyien és ennyit tettünk eddig</h2></div>'
  + '<div class="ds-szamsav">' + ''.join(f'<div class="ds-szam"><div class="ds-szam-ertek">{e(a)}</div><div class="ds-szam-felirat">{e(b)}</div></div>' for a, b in SZAMOK) + '</div>'
  + '<p class="ds-forras ds-forras-sotet">Források: App Store és Google Play adatlap, beeco belső adatok, 2026. október.</p>'
  + '</div></section>')

A_ERTEK = ('<section class="ds-szekcio ds-hatter-zold"><div class="ds-burok">'
  + fej('Alapértékeink', 'Ami szerint dolgozunk')
  + kartya3([('raj', 'Közösség', 'Kapcsolatot építünk az emberek között, és törődünk a természettel. A kis lépések és szárnycsapások hatásával dolgozunk a közös célokért.'),
             ('konyv', 'Edukáció', 'Az ismeretterjesztéssel csökkentjük az ökoszorongást, és arra ösztönzünk, hogy aktívan tegyél a fenntarthatóságért.'),
             ('kupa', 'Hitelesség', 'Minden tevékenységünk és információnk a lehető legmegbízhatóbb, tudományos forrásokra épül.')])
  + '</div></section>')

tovabb_kartya = lambda href, kep, alt, cim, szoveg, nyil: (f'<a class="ds-tovabb-kartya" href="{href}"><img class="ds-tovabb-kep" src="{KEP[kep]}" alt="{e(alt)}" loading="lazy">'
  f'<div class="ds-tovabb-test"><h3 class="ds-cim3">{e(cim)}</h3><p class="ds-szoveg">{e(szoveg)}</p><div class="ds-tovabb-nyil">{e(nyil)} ›</div></div></a>')
A_TOVABB = ('<section class="ds-szekcio ds-hatter-feher"><div class="ds-burok">'
  + fej('Ismerj meg közelebbről', 'Kik vagyunk, és mit értünk el?')
  + '<div class="ds-tovabb">'
  + tovabb_kartya('/csapatunk', 'csapat-asztal', 'A beeco csapat egy asztal körül', 'A csapat', '29 ember, 7 raj: ismerd meg, kik dolgoznak a beecón, és hogyan csatlakozhatsz önkéntesként.', 'Ismerd meg a rajt')
  + tovabb_kartya('/hatasunk', 'one-dij', 'A csapat a ONE Digitális Díj 2025 átadóján', 'A hatásunk', 'Díjak, számok, kampányeredmények és sajtó: minden, amit eddig közösen elértünk.', 'Nézd meg az eredményeket')
  + '</div></div></section>')

PARTNER = ['BME', 'Budapesti Corvinus Egyetem', 'ELTE TáTK', 'Pannon Egyetem', 'Élhető Települések Országos Szövetsége', '10 millió fa',
           'Humusz Szövetség', 'Tudatos Vásárlók Egyesülete', 'Erdőszeretet Szövetség', 'Felelős Gasztrohős', 'MAVEG Magyar Vegán Egyesület', 'I-DEST']
A_PARTNER = ('<section class="ds-szekcio"><div class="ds-burok">'
  + fej('Velünk dolgoznak', 'Mert a fenntarthatóság egyedül nem megy')
  + '<div class="ds-logosor">' + ''.join(f'<div class="ds-logo"><img class="ds-logo-kep" src="{LOGO[p]}" alt="{e(p)}" loading="lazy"></div>' for p in PARTNER if p in LOGO) + '</div>'
  + '</div></section>')

A_ZARO = ('<section class="ds-szekcio ds-hatter-vaj" id="letoltes"><div class="ds-burok ds-zaro">'
  '<div class="ds-szalag">Kezdd el ma</div><h2 class="ds-cim2">Légy te is a raj tagja</h2>'
  '<p class="ds-lead ds-zaro-lead">Töltsd le ingyen a beeco appot: számold ki a lábnyomod, találj zöld helyeket és programokat, és gyűjts nektárt minden lépésért.</p>'
  f'<div class="ds-gombsor"><a class="ds-gomb" href="{UTM("zaro")}">Töltsd le az appot</a></div>'
  '</div></section>')

def osszeallit(szekciok, *css_keszletek, kesz0=()):
    """Minden osztály CSS-e abba az akcióba kerül, ahol az osztály először előfordul (a whtml csak a beszúrt HTML osztályait építi)."""
    szabaly = {}  # osztály → {media: {szelektor: decl}}
    for k in css_keszletek:
        for m, b in k.items():
            for sel, d in b.items():
                o = sel.lstrip('.').split(':')[0]
                szabaly.setdefault(o, {}).setdefault(m, {})[sel] = d
    kesz, ki = set(kesz0), []
    for nev, h in szekciok:
        oszt = []
        for x in re.findall(r'class="([^"]+)"', h):
            for c in x.split():
                if c not in oszt: oszt.append(c)
        uj = [c for c in oszt if c in szabaly and c not in kesz]; kesz.update(uj)
        sz = {}
        for m in (T, M, S, X):
            for c in uj:
                for sel, d in szabaly[c].get(m, {}).items(): sz.setdefault(m, {})[sel] = d
        ki.append({'nev': nev, 'html': h, 'css': css(sz)})
    return ki

A = osszeallit([('a-hero', A_HERO), ('a-elvek', A_ELVEK), ('a-ido', A_IDO), ('a-szam', A_SZAM), ('a-ertek', A_ERTEK),
                ('a-tovabb', A_TOVABB), ('a-partner', A_PARTNER), ('a-zaro', A_ZARO)], KOZOS, A_CSS)

# ---------------- C · HATÁS ----------------
C_CSS = {
 T: {
  '.ds-dijak': 'display:flex;flex-direction:column;row-gap:14px',
  '.ds-dij': f'display:flex;align-items:center;column-gap:16px;{P4("16px", "18px", "16px", "16px")}{B4("2px", "solid", "#000000")}{R4("16px", "5px")}background-color:{V("bc-surface")};box-shadow:4px 4px 0 0 #000000',
  '.ds-dij-helyezes': f'display:flex;align-items:center;justify-content:center;flex-grow:0;flex-shrink:0;width:60px;height:60px;{B4("2px", "solid", "#000000")}{R4("999px", "999px")}background-color:{V("bc-accent")};color:#000000;font-family:{DISP};font-size:28px;line-height:1',
  '.ds-dij-test': 'display:flex;flex-direction:column;row-gap:2px',
  '.ds-dij-cim': f'font-family:{DISP};font-size:21px;line-height:1.15',
  '.ds-dij-szoveg': f'color:{V("bc-ink-soft")};font-size:14.5px;line-height:1.45',
  '.ds-ketto': 'display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:40px;row-gap:32px;align-items:start',
  '.ds-grafikon': f'display:flex;flex-direction:column;row-gap:22px;{P4("26px", "26px", "26px", "26px")}{B4("2px", "solid", "#000000")}{R4("18px", "6px")}background-color:{V("bc-surface")};box-shadow:4px 4px 0 0 #000000',
  '.ds-grafikon-felirat': f'margin-bottom:6px;color:{V("bc-ink-muted")};font-size:13px;font-weight:800;letter-spacing:.06em;text-transform:uppercase',
  '.ds-sav-sor': 'display:grid;grid-template-columns:56px minmax(0,1fr);column-gap:12px;align-items:center;margin-bottom:10px',
  '.ds-sav-ev': 'font-size:15px;font-weight:800',
  '.ds-sav': f'display:flex;align-items:center;justify-content:flex-end;height:36px;{P4("0px", "10px", "0px", "10px")}{B4("2px", "solid", "#000000")}{R4("4px", "10px")}background-color:{V("bc-accent")};color:#000000;font-size:14px;font-weight:800;white-space:nowrap',
  '.ds-sav-elozo': f'background-color:{V("bc-domb")}',
  '.ds-sav-100': 'width:100%', '.ds-sav-51': 'width:51%', '.ds-sav-69': 'width:69%',
  '.ds-cikkek': 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:22px;row-gap:22px',
  '.ds-cikk': f'display:flex;flex-direction:column;row-gap:12px;{P4("22px", "22px", "22px", "22px")}{B4("2px", "solid", "#000000")}{R4("18px", "6px")}background-color:{V("bc-surface")};box-shadow:4px 4px 0 0 #000000;color:{V("bc-ink")};text-decoration:none;transition:transform 160ms {EASE}, box-shadow 160ms {EASE}',
  '.ds-cikk:hover': f'color:{V("bc-ink")};text-decoration:none;transform:translate(-2px,-3px);box-shadow:6px 7px 0 0 #000000',
  '.ds-cikk-logo': 'height:40px;width:auto;max-width:160px;object-fit:contain;align-self:flex-start',
  '.ds-cikk-forras': f'margin-top:auto;color:{V("bc-accent-ink")};font-size:14px;font-weight:800',
  '.ds-idezetek': 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:22px;row-gap:22px;margin-top:40px',
  '.ds-idezet': f'display:flex;flex-direction:column;row-gap:8px;{P4("22px", "22px", "20px", "22px")}{B4("2px", "solid", "#000000")}{R4("18px", "6px")}background-color:{V("bc-accent")};color:#000000;transform:rotate(-1deg)',
  '.ds-idezet-szoveg': f'font-family:{DISP};font-size:26px;line-height:1.1',
  '.ds-idezet-nev': 'font-size:14px;font-weight:700',
  '.ds-utak': 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:22px;row-gap:22px',
  '.ds-ut': f'display:flex;flex-direction:column;align-items:flex-start;row-gap:10px;{P4("24px", "24px", "26px", "24px")}{B4("2px", "solid", "#000000")}{R4("18px", "6px")}background-color:{V("bc-surface")};box-shadow:4px 4px 0 0 #000000;color:{V("bc-ink")};text-decoration:none;transition:transform 160ms {EASE}, box-shadow 160ms {EASE}',
  '.ds-ut:hover': f'color:{V("bc-ink")};text-decoration:none;transform:translate(-2px,-3px);box-shadow:6px 7px 0 0 #000000',
  '.ds-ut-kiemelt': f'background-color:{V("bc-accent")}',
  '.ds-megjegyzes': f'margin-top:28px;{P4("18px", "22px", "18px", "22px")}{B4("2px", "dashed", "#000000")}{R4("14px", "4px")}background-color:{V("bc-surface")};font-size:16px;line-height:1.55',
 },
 M: {
  '.ds-ketto': 'grid-template-columns:minmax(0,1fr)',
  '.ds-cikkek': 'grid-template-columns:minmax(0,1fr)',
  '.ds-idezetek': 'grid-template-columns:minmax(0,1fr)',
  '.ds-utak': 'grid-template-columns:minmax(0,1fr)',
 },
 S: {'.ds-idezet-szoveg': 'font-size:22px'},
}
KAPCS = 'https://www.beeco.hu/kapcsolat?utm_source=beeco.hu&amp;utm_medium=hatasunk&amp;utm_campaign='
UTMC = lambda hely: f'https://www.beeco.hu/letoltes?utm_source=beeco.hu&amp;utm_medium=hatasunk&amp;utm_campaign={hely}'
dij = lambda h, c, s: f'<div class="ds-dij"><div class="ds-dij-helyezes">{h}</div><div class="ds-dij-test"><div class="ds-dij-cim">{e(c)}</div><div class="ds-dij-szoveg">{e(s)}</div></div></div>'
C_HERO = ('<section class="ds-szekcio ds-hatter-vaj" id="kezdes"><div class="ds-burok ds-hero-racs"><div class="ds-hero-szoveg">'
  '<div class="ds-szalag">A hatásunk</div>'
  '<h1 class="ds-cim1">Többszörösen elismert <span class="ds-kiemel">magyar zöld</span> startup</h1>'
  '<p class="ds-lead">A beeco app és közösség segít, hogy a fenntartható döntés legyen a könnyebb. Itt gyűjtjük össze, mit értünk el eddig lakosokkal, önkormányzatokkal és cégekkel együtt.</p>'
  f'<div class="ds-gombsor"><a class="ds-gomb" href="{KAPCS}hero">Legyünk partnerek</a><a class="ds-gomb ds-masod" href="{UTMC("hero")}">Töltsd le az appot</a></div>'
  '</div><div class="ds-dijak">'
  + dij('1.', 'ONE Digitális Díj 2025', 'Zöld kategória: az ország első számú fenntarthatósági kezdeményezése')
  + dij('2.', 'F6S, 2025', 'Magyarország 2. legkiemelkedőbb fenntarthatósági startupja')
  + dij('3.', 'MVM Edison, 2023', 'Startupverseny, 3. helyezés')
  + '</div></div></section>')
C_SZAMOK = [('25.000+', 'letöltés'), ('4,6', 'App Store, 70 értékelés'), ('23.000+', 'zöld pont a térképen'),
            ('15', 'partner-önkormányzat'), ('100+', 'zöld program havonta'), ('12', 'szakmai partner')]
C_SZAM = ('<section class="ds-szekcio ds-hatter-sotet"><div class="ds-burok">'
  + '<div class="ds-szekcio-fej"><div class="ds-szalag">Számokban</div><h2 class="ds-cim2">Egy országos közösség, három év alatt</h2></div>'
  + '<div class="ds-szamsav">' + ''.join(f'<div class="ds-szam"><div class="ds-szam-ertek">{e(a)}</div><div class="ds-szam-felirat">{e(b)}</div></div>' for a, b in C_SZAMOK) + '</div>'
  + '<p class="ds-forras ds-forras-sotet">Források: App Store és Google Play adatlap, beeco belső adatok, 2026. október.</p>'
  + '</div></section>')
sav = lambda ev, ertek, szel, elozo: f'<div class="ds-sav-sor"><div class="ds-sav-ev">{ev}</div><div class="ds-sav{" ds-sav-elozo" if elozo else ""} ds-sav-{szel}">{ertek}</div></div>'
C_VIZ = ('<section class="ds-szekcio ds-hatter-feher" id="vizadas"><div class="ds-burok ds-ketto"><div class="ds-hero-szoveg">'
  '<div class="ds-szalag">Mérhető hatás</div><h2 class="ds-cim2">Egy év alatt majdnem duplájára nőtt a vízadás</h2>'
  '<p class="ds-lead">Az Önkéntes Vízadás az ország első közösségi faöntöző kampánya. 2026 nyarán a fiatal fák 784 352 liter vizet kaptak a lakóktól, 15 önkormányzat fáinál.</p>'
  '<a class="ds-szoveglink" href="/kampanyok/onkentes-vizadas">A kampány oldala ›</a></div>'
  '<div class="ds-grafikon"><div class="ds-cim3">Önkéntes Vízadás, 2025 és 2026</div>'
  '<div><div class="ds-grafikon-felirat">Kiöntött víz (liter)</div>' + sav('2025', '400 000', '51', True) + sav('2026', '784 352', '100', False) + '</div>'
  '<div><div class="ds-grafikon-felirat">Aktív önkéntesek (fő)</div>' + sav('2025', '1 500', '69', True) + sav('2026', '2 162', '100', False) + '</div>'
  '<p class="ds-forras">Források: Telex, 2025. szeptember 21. (2025); beeco kampányzárás, 2026. október (2026). Egy soron belül a sávok méretarányosak.</p>'
  '</div></div></section>')
ELISMERESEK = [('2025', 'ONE Digitális Díj: 1. hely, zöld kategória'), ('2025', 'F6S: 2. hely, fenntarthatósági kategória'),
               ('2025', 'Sikeres közösségi finanszírozás a Brancson'), ('2024', 'Web Summit, Lisszabon: bemutatkozás nemzetközi közönségnek'),
               ('2024', 'Közösségi iroda a K&H Start It inkubátorban'), ('2023', 'EIT Climate Launchpad: nemzetközi döntő'), ('2023', 'MVM Edison startupverseny: 3. hely')]
C_ELISM = ('<section class="ds-szekcio"><div class="ds-burok ds-ketto"><div class="ds-hero-szoveg">'
  '<div class="ds-szalag">Elismerések</div><h2 class="ds-cim2">Díjak és programok, amelyek előre vittek</h2>'
  '<p class="ds-lead">Minden díj mögött egy csapatnyi önkéntes munkája áll. A legfrissebbek felül.</p></div>'
  '<ul class="ds-ido-lista">' + ''.join(f'<li class="ds-ido-elem"><span class="ds-ido-ho">{e(ev)}</span><span>{e(sz)}</span></li>' for ev, sz in ELISMERESEK) + '</ul>'
  '</div></section>')
CIKKEK = [('Telex', 'https://telex.hu/belfold/2025/09/21/aszaly-onkentes-vizadas-locsolakoma-fokert-beeco-10-millio-fa-eredmenyek', 'Aszály, önkéntes vízadás, locsolakoma: az eredmények', 'Telex, 2025'),
          ('Trade magazin', 'https://trademagazin.hu/hu/huszonevesek-a-fenntarthatosagert-tortenelmet-irtak-a-magyar-startup-szferaban/', 'Huszonévesek a fenntarthatóságért: történelmet írtak a magyar startup-szférában', 'Trade magazin'),
          ('Minner', 'https://minner.hu/lehet-e-uzletet-epiteni-okotudatossagra-klimaszorongasra-is-megoldas-beeco-zold-applikacio/', 'Lehet-e üzletet építeni ökotudatosságra? Klímaszorongásra is megoldás a beeco', 'Minner')]
SAJTO = ['Telex', 'Trade magazin', 'MVM Smart Future Lab', 'Zöld Hang podcast', 'Marie Claire', 'Startuponline', 'We Love Budapest', 'Daily News Hungary', 'Pannon Egyetem GTK podcast', 'Minner']
C_SAJTO = ('<section class="ds-szekcio ds-hatter-zold" id="sajto"><div class="ds-burok">'
  + fej('Sajtó', 'Írtak rólunk')
  + '<div class="ds-cikkek">' + ''.join(f'<a class="ds-cikk" href="{u}" target="_blank" rel="noopener"><img class="ds-cikk-logo" src="{LOGO[l]}" alt="{e(l)}" loading="lazy"><h3 class="ds-cim3">{e(c)}</h3><div class="ds-cikk-forras">{e(f)} ›</div></a>' for l, u, c, f in CIKKEK) + '</div>'
  + '<div class="ds-logosor ds-logosor-sajto">' + ''.join(f'<div class="ds-logo"><img class="ds-logo-kep" src="{LOGO[p]}" alt="{e(p)}" loading="lazy"></div>' for p in SAJTO if p in LOGO) + '</div>'
  + '</div></section>')
C_CSS[T]['.ds-logosor-sajto'] = 'margin-top:32px'
C_PARTNER = ('<section class="ds-szekcio"><div class="ds-burok">'
  + fej('Szakmai partnerek', 'Egyetemek, szövetségek, civilek')
  + '<div class="ds-logosor">' + ''.join(f'<div class="ds-logo"><img class="ds-logo-kep" src="{LOGO[p]}" alt="{e(p)}" loading="lazy"></div>' for p in PARTNER if p in LOGO) + '</div>'
  + f'<p class="ds-megjegyzes"><strong>Önkormányzatoknak:</strong> az Élhető Települések Országos Szövetsége szakmai partnerünk. 15 település dolgozik már velünk. <a class="ds-szoveglink" href="{KAPCS}onkormanyzat">Írjon nekünk ›</a></p>'
  + '<div class="ds-idezetek">'
  + ''.join(f'<div class="ds-idezet"><div class="ds-idezet-szoveg">„{e(q)}”</div><div class="ds-idezet-nev">{e(n)}, App Store</div></div>' for q, n in [('Építi az emberi közösséget.', 'gazdagergo'), ('Igazi kis oázis.', 'holladri01'), ('Összehoz minket.', 'Kriki21')])
  + '</div><div class="ds-chipsor"><div class="ds-chip">★ 4,6 App Store · 70 értékelés</div><div class="ds-chip">★ 4,2 Google Play · 106 értékelés</div></div>'
  + '</div></section>')
ut = lambda href, piko, cim, szov, nyil, kiem=False: (f'<a class="ds-ut{" ds-ut-kiemelt" if kiem else ""}" href="{href}">{pk(piko, "ds-kartya-piko")}<h3 class="ds-cim3">{e(cim)}</h3>'
  f'<p class="ds-szoveg">{e(szov)}</p><div class="ds-tovabb-nyil">{e(nyil)} ›</div></a>')
C_ZARO = ('<section class="ds-szekcio ds-hatter-vaj" id="partner"><div class="ds-burok">'
  + fej('Dolgozzunk együtt', 'Melyik oldalról jössz?', 'Önkormányzatokkal, cégekkel és szervezetekkel közösen érjük el a legtöbbet. Írj nekünk, és megmutatjuk, mit tudunk együtt elérni.')
  + '<div class="ds-utak">'
  + ut(KAPCS + 'onkormanyzat', 'telepules', 'Önkormányzat vagyok', 'Fiatal fák, zöld térkép, lakossági programok a településeden.', 'Legyünk partnerek', True)
  + ut('/szolgaltatas/partner', 'taska', 'Vállalkozásom van', 'Kerülj fel a térképre, és érj el új, tudatos vásárlókat.', 'Partnerprogram')
  + ut(UTMC('zaro'), 'haz', 'Magánszemély vagyok', 'Lábnyom, zöld helyek, programok és kuponok, ingyen.', 'Letöltöm')
  + '</div></div></section>')
A_OSZT = {c for h in (A_HERO, A_ELVEK, A_IDO, A_SZAM, A_ERTEK, A_TOVABB, A_PARTNER, A_ZARO) for x in re.findall(r'class="([^"]+)"', h) for c in x.split()}
C = osszeallit([('c-hero', C_HERO), ('c-szam', C_SZAM), ('c-viz', C_VIZ), ('c-elism', C_ELISM), ('c-sajto', C_SAJTO), ('c-partner', C_PARTNER), ('c-zaro', C_ZARO)], KOZOS, A_CSS, C_CSS, kesz0=A_OSZT)
# a C oldal más sorrendben használja a közös osztályokat: ami az A oldalon már létrejött, azt a whtml úgyis újrahasználja
json.dump(C, open(os.path.join(OUT, 'c.json'), 'w'), ensure_ascii=False, indent=1)
hC = {c for x in re.findall(r'class="([^"]+)"', ''.join(a['html'] for a in C)) for c in x.split()}
dC = set(re.findall(r'\.(ds-[a-z0-9-]+)', ''.join(a['css'] for a in C)))
print('C:', [(a['nev'], len(a['html']), len(a['css'])) for a in C], '| CSS nélküli:', sorted(hC - dC - A_OSZT), '| sajtólogó:', sum(p in LOGO for p in SAJTO), '/', len(SAJTO))


# ---------------- B · CSAPAT ----------------
B_CSS = {
 T: {
  '.ds-level': f'display:flex;flex-direction:column;row-gap:16px;{P4("32px", "34px", "30px", "34px")}{B4("2px", "solid", "#000000")}{R4("20px", "6px")}background-color:{V("bc-paper")};box-shadow:6px 6px 0 0 #000000;transform:rotate(-0.6deg)',
  '.ds-level-szoveg': f'margin-top:0px;margin-bottom:0px;color:{V("bc-ink")};font-size:18px;line-height:1.65',
  '.ds-level-alairas': f'font-family:{DISP};font-size:24px;line-height:1.1',
  '.ds-emberek': 'display:grid;grid-template-columns:repeat(4,minmax(0,1fr));column-gap:22px;row-gap:28px',
  '.ds-ember': 'display:flex;flex-direction:column;row-gap:6px',
  '.ds-ember-kepek': 'position:relative;margin-bottom:10px',
  '.ds-ember-foto': f'display:block;width:100%;aspect-ratio:1/1;object-fit:cover;{B4("3px", "solid", "#000000")}{R4("18px", "6px")}box-shadow:4px 4px 0 0 #000000;background-color:{V("bc-surface-2")}',
  '.ds-ember-meh': f'position:absolute;right:-10px;bottom:-14px;width:64px;height:64px;object-fit:contain;{B4("2px", "solid", "#000000")}{R4("999px", "999px")}background-color:{V("bc-accent")}',
  '.ds-ember-nev': f'font-family:{DISP};font-size:21px;line-height:1.1',
  '.ds-ember-szerep': f'color:{V("bc-ink-soft")};font-size:14.5px;line-height:1.4',
  '.ds-rajok': 'display:grid;grid-template-columns:repeat(4,minmax(0,1fr));column-gap:22px;row-gap:22px',
  '.ds-raj': f'display:flex;flex-direction:column;{B4("2px", "solid", "#000000")}{R4("18px", "6px")}overflow:hidden;background-color:{V("bc-surface")};box-shadow:4px 4px 0 0 #000000',
  '.ds-raj-kep': f'display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-bottom-style:solid;border-bottom-width:2px;border-bottom-color:#000000;background-color:{V("bc-surface-2")}',
  '.ds-raj-test': 'display:flex;flex-direction:column;row-gap:8px;' + P4('20px', '22px', '22px', '22px'),
  '.ds-raj-tagok': f'display:flex;flex-direction:column;row-gap:4px;margin-top:6px;margin-bottom:0px;padding-left:0px;list-style-type:none;color:{V("bc-ink")};font-size:14.5px;line-height:1.45',
  '.ds-raj-tag-szerep': f'color:{V("bc-ink-muted")}',
  '.ds-tanacsado': 'display:grid;grid-template-columns:96px minmax(0,1fr);column-gap:18px;align-items:start',
  '.ds-tanacsado-foto': f'display:block;width:96px;height:96px;object-fit:cover;{B4("2px", "solid", "#000000")}{R4("999px", "999px")}',
  '.ds-hogyan-foto': 'aspect-ratio:4/3',
 },
 M: {
  '.ds-emberek': 'grid-template-columns:repeat(3,minmax(0,1fr))',
  '.ds-rajok': 'grid-template-columns:repeat(2,minmax(0,1fr))',
 },
 S: {
  '.ds-emberek': 'grid-template-columns:repeat(2,minmax(0,1fr));column-gap:16px',
  '.ds-rajok': 'grid-template-columns:minmax(0,1fr)',
  '.ds-level': P4('24px', '22px', '22px', '22px'),
  '.ds-level-szoveg': 'font-size:17px',
  '.ds-tanacsado': 'grid-template-columns:72px minmax(0,1fr)',
  '.ds-tanacsado-foto': 'width:72px;height:72px',
 },
}
CSATL = 'https://www.beeco.hu/csapat?utm_source=beeco.hu&amp;utm_medium=csapatunk&amp;utm_campaign='
ALAP = [('kristof', 'Hegedűs Kristóf', 'Alapító, CEO és Ökomuki'), ('levente', 'Farkas Levente', 'Alapító, CMO')]
VEZ = [('timea', 'Mónus Tímea', 'UX/UI csoportvezető'), ('agi', 'Kovács Ági', 'Designer'), ('milla', 'Joób Klára Milla', 'CCO és CSO'),
       ('marcell', 'Csókási Marcell', 'CTO'), ('adam', 'Káré Ádám', 'Videós produkció vezető')]
RAJOK = [
 ('szoftver', 'Szoftveres raj', 'Az app, a térkép és a háttérrendszerek fejlesztése.', [('Csókási Marcell', 'CTO'), ('Kovács Bence', 'FullStack fejlesztő')]),
 ('ux', 'UX/UI raj', 'Kutatás, tervezés és tesztelés, hogy az app könnyű legyen.', [('Mónus Tímea', 'csoportvezető'), ('Árki Petra', 'UX/UI designer'), ('Abu Yousef Nóra', 'UX/UI designer'), ('Trnka Annamária', 'UX/UI designer')]),
 ('grafika', 'Grafikus raj', 'A beeco-világ: méhecskék, matricák, kampányarculatok.', [('Kovács Ági', 'designer'), ('Sashegyi Dorina', 'grafikus'), ('Kövecses Liliána', 'grafikus')]),
 ('social', 'Közösségi média raj', 'Videók, posztok, tartalmak a csatornáinkra.', [('Káré Ádám', 'videós vezető'), ('Mihail Andrea', 'tartalomkészítő'), ('Kiss Róbert', 'marketing'), ('Hegedűs Viola', 'tartalomkészítő'), ('Zeltner Domonkos', 'videós')]),
 ('komm', 'Kommunikációs raj', 'Sajtó, partnerek és a beeco hangja.', [('Joób Klára Milla', 'CCO és CSO')]),
 ('fennt', 'Fenntarthatósági raj', 'A tudományos háttér és az edukatív tartalmak.', [('Krizsán Klaudia', 'tartalomkészítő')]),
 ('gazd', 'Gazdasági és elemző raj', 'Üzleti modell, mérés és elemzés.', []),
]
B_HERO = ('<section class="ds-szekcio ds-hatter-vaj" id="kezdes"><div class="ds-burok ds-hero-racs"><div class="ds-hero-szoveg">'
  '<div class="ds-szalag">A csapat</div>'
  '<h1 class="ds-cim1">Mi vagyunk <span class="ds-kiemel">a beeco raj</span></h1>'
  '<p class="ds-lead">29 ember, 7 raj, egy közös cél: hogy a zöld élet ne magányos küzdelem legyen, hanem közös ügy. Önkéntesek, pályakezdők és tapasztalt szakemberek dolgozunk együtt.</p>'
  f'<div class="ds-gombsor"><a class="ds-gomb" href="{CSATL}hero">Csatlakozz a rajhoz</a><a class="ds-gomb ds-masod" href="#rajok">Ismerd meg a rajokat</a></div>'
  '<div class="ds-chipsor">' + ''.join(f'<div class="ds-chip">{e(r[1].replace(" raj", ""))}</div>' for r in RAJOK) + '</div>'
  '</div>' + foto('csapat-asztal', 'Tizenkét mosolygó csapattag egy asztal mögött, rajta fotók és egy horgolt méhecske', 'A raj egy közös estén', ' ds-hero-foto') +
  '</div></section>')
B_LEVEL = ('<section class="ds-szekcio ds-hatter-feher"><div class="ds-burok ds-ketto"><div class="ds-hero-szoveg">'
  '<div class="ds-szalag">Az alapítók levele</div><h2 class="ds-cim2">Miért kezdtük el?</h2>'
  '<p class="ds-lead">Két barát ötletéből egy országos raj lett. Így emlékszünk vissza a kezdetekre.</p></div>'
  '<div class="ds-level"><p class="ds-level-szoveg">Mi is éreztük azt a tehetetlenséget, amit a klímahírek után sokan: hogy amit egyedül tehetünk, az kevés. Aztán rájöttünk, hogy nem egyedül kell csinálni.</p>'
  '<p class="ds-level-szoveg">A beecót azért építjük, hogy a fenntartható döntés legyen a könnyebb, és hogy minden apró lépés látszódjon. Ma már egy egész raj dolgozik ezen, önkéntesek és szakemberek, és egyre több település és közösség csatlakozik.</p>'
  '<div class="ds-level-alairas">Kristóf és Levi</div></div>'
  '</div></section>')
ember = lambda k, n, r: (f'<div class="ds-ember"><div class="ds-ember-kepek"><img class="ds-ember-foto" src="{KEP["p-" + k]}" alt="{e(n)} portréja" loading="lazy">'
  f'<img class="ds-ember-meh" src="{KEP["a-" + k]}" alt="{e(n)} saját méhecskéje" loading="lazy"></div>'
  f'<div class="ds-ember-nev">{e(n)}</div><div class="ds-ember-szerep">{e(r)}</div></div>')
B_VEZ = ('<section class="ds-szekcio"><div class="ds-burok">'
  + fej('Vezetés', 'Alapítók és csoportvezetők', 'Mindenkinek van egy saját méhecskéje: a beeco-világban így ismerjük egymást.')
  + '<div class="ds-emberek">' + ''.join(ember(*x) for x in ALAP + VEZ) + '</div>'
  + '</div></section>')
def raj(k, nev, leir, tagok):
    lista = ''.join(f'<li>{e(n)} <span class="ds-raj-tag-szerep">· {e(r)}</span></li>' for n, r in tagok) or '<li>Most keresünk tagokat. <a class="ds-szoveglink" href="' + CSATL + 'raj-' + k + '">Jelentkezz ›</a></li>'
    return (f'<div class="ds-raj"><img class="ds-raj-kep" src="{KEP["raj-" + k]}" alt="A {e(nev)} méhecskéje" loading="lazy"><div class="ds-raj-test">'
            f'<h3 class="ds-cim3">{e(nev)}</h3><p class="ds-szoveg">{e(leir)}</p><ul class="ds-raj-tagok">{lista}</ul></div></div>')
B_RAJOK = ('<section class="ds-szekcio ds-hatter-zold" id="rajok"><div class="ds-burok">'
  + fej('A rajok', 'Hét raj, egy közös kaptár', 'Minden raj saját területen dolgozik, de a célunk közös. Nézd meg, kik vannak bennük.')
  + '<div class="ds-rajok">' + ''.join(raj(*r) for r in RAJOK) + ut(CSATL + 'raj-te', 'raj', 'A te rajod?', 'Nem találod a helyed? Írd meg, mihez értesz vagy mit tanulnál szívesen, és megkeressük a neked való feladatot.', 'Jelentkezem', True) + '</div>'
  + '</div></section>')
TANACS = [('elvira', 'Kalmár Elvira', 'Go Beyond Project alapító és mentor', 'Számomra a beeco a jövő, ami már itt van velünk. Óriási erő rejlik benne, mert az egyéni, elszigetelt akciókat közösséggé tudja formálni.'),
          ('agnes', 'Vándor Ágnes', 'PPH media, CEO és mentor', 'A csapat személyes indíttatásból és hitből építkezik okosan és hatékonyan. Örülök, hogy részese lehetek a beeco növekedésének.')]
B_TANACS = ('<section class="ds-szekcio ds-hatter-feher"><div class="ds-burok">'
  + fej('Mentorok', 'Szakmai tanácsadóink')
  + '<div class="ds-ketto">' + ''.join(f'<div class="ds-kartya ds-tanacsado"><img class="ds-tanacsado-foto" src="{KEP["p-" + k]}" alt="{e(n)} portréja" loading="lazy"><div class="ds-dij-test">'
      f'<div class="ds-ember-nev">{e(n)}</div><div class="ds-ember-szerep">{e(r)}</div><p class="ds-szoveg">„{e(q)}”</p></div></div>' for k, n, r, q in TANACS) + '</div>'
  + '</div></section>')
B_HOGYAN = ('<section class="ds-szekcio"><div class="ds-burok">'
  + fej('Hogyan dolgozunk', 'Közösség, edukáció, hitelesség', 'Nem csak appot építünk: eseményeket, műhelyeket és képzéseket is szervezünk.')
  + '<div class="ds-harom">' + foto('csere', 'Fiatalok ruhákat és könyveket válogatnak egy csere-berén', 'Közösség: csere-bere és műhelyek', ' ds-hogyan-foto')
  + foto('fresk', 'Tízfős csapat egy nagy asztal mögött, rajta Klímafreskó-kártyák', 'Edukáció: Klímafreskó', ' ds-hogyan-foto')
  + foto('oklevelek', 'Huszonkét résztvevő oklevelekkel egy rendezvényen', 'Hitelesség: tudományos alapokon', ' ds-hogyan-foto') + '</div>'
  + '</div></section>')
B_TOVABB = ('<section class="ds-szekcio ds-hatter-feher"><div class="ds-burok">'
  + fej('Még többet rólunk', 'A történetünk és a hatásunk')
  + '<div class="ds-tovabb">'
  + tovabb_kartya('/rolunk', 'websummit', 'Három csapattag a Web Summit felirat előtt', 'A történetünk', 'Vízió, küldetés és öt év, öt állomás: 2023-tól a határokon túlig.', 'Olvasd el')
  + tovabb_kartya('/hatasunk', 'one-dij', 'A csapat a ONE Digitális Díj 2025 átadóján', 'A hatásunk', 'Díjak, számok, kampányeredmények és sajtó: minden, amit eddig közösen elértünk.', 'Nézd meg az eredményeket')
  + '</div></div></section>')
B_ZARO = ('<section class="ds-szekcio ds-hatter-vaj" id="csatlakozz"><div class="ds-burok ds-zaro">'
  '<div class="ds-szalag">Keressük a kaptársainkat</div><h2 class="ds-cim2">Itt a helyed a rajban</h2>'
  '<p class="ds-lead ds-zaro-lead">Önkéntesként, gyakornokként vagy szakmai gyakorlaton. Valódi projekteken tanulhatsz, és bővítheted a portfóliód. Most főleg ide várunk:</p>'
  '<div class="ds-chipsor"><div class="ds-chip">Gazdasági és elemző raj</div><div class="ds-chip">Szoftveres raj</div><div class="ds-chip">Közösségi média raj</div></div>'
  f'<div class="ds-gombsor"><a class="ds-gomb" href="{CSATL}zaro">Csatlakozz a rajhoz</a></div>'
  '</div></section>')
ELOZO = A_OSZT | {c for h in (C_HERO, C_SZAM, C_VIZ, C_ELISM, C_SAJTO, C_PARTNER, C_ZARO) for x in re.findall(r'class="([^"]+)"', h) for c in x.split()}
B = osszeallit([('b-hero', B_HERO), ('b-level', B_LEVEL), ('b-vez', B_VEZ), ('b-rajok', B_RAJOK), ('b-tanacs', B_TANACS), ('b-hogyan', B_HOGYAN), ('b-tovabb', B_TOVABB), ('b-zaro', B_ZARO)],
               KOZOS, A_CSS, C_CSS, B_CSS, kesz0=ELOZO)
json.dump(B, open(os.path.join(OUT, 'b.json'), 'w'), ensure_ascii=False, indent=1)
hB = {c for x in re.findall(r'class="([^"]+)"', ''.join(a['html'] for a in B)) for c in x.split()}
dB = set(re.findall(r'\.(ds-[a-z0-9-]+)', ''.join(a['css'] for a in B)))
print('B:', [(a['nev'], len(a['html']), len(a['css'])) for a in B], '| CSS nélküli:', sorted(hB - dB - ELOZO))


C_TOVABB = ('<section class="ds-szekcio ds-hatter-feher"><div class="ds-burok">'
  + fej('Még többet rólunk', 'A történetünk és a csapatunk')
  + '<div class="ds-tovabb">'
  + tovabb_kartya('/rolunk', 'websummit', 'Három csapattag a Web Summit felirat előtt', 'A történetünk', 'Vízió, küldetés és öt év, öt állomás: 2023-tól a határokon túlig.', 'Olvasd el')
  + tovabb_kartya('/csapatunk', 'csapat-asztal', 'A beeco csapat egy asztal körül', 'A csapat', '29 ember, 7 raj: ismerd meg, kik dolgoznak a beecón, és hogyan csatlakozhatsz önkéntesként.', 'Ismerd meg a rajt')
  + '</div></div></section>')
json.dump([{'nev': 'c-tovabb', 'html': C_TOVABB, 'css': ''}], open(os.path.join(OUT, 'c-tovabb.json'), 'w'), ensure_ascii=False, indent=1)
EXTRA_ELISM = [('2024', 'NTK és Design Terminal Start: TOP20, 250 csapatból'), ('2024', 'Bridge to Benefits mesterkurzus a felelős vállalkozásokért')]
json.dump([f'<li class="ds-ido-elem"><span class="ds-ido-ho">{e(ev)}</span><span>{e(sz)}</span></li>' for ev, sz in EXTRA_ELISM], open(os.path.join(OUT, 'c-elism-extra.json'), 'w'), ensure_ascii=False, indent=1)


# ---------------- E · /en (Web Summit) ----------------
MAIL = 'kristof.hegedus@beeco.hu'
UTME = lambda hely: f'https://www.beeco.hu/letoltes?utm_source=websummit&amp;utm_medium=en&amp;utm_campaign={hely}'
E_HERO = ('<section class="ds-szekcio ds-hatter-vaj" id="kezdes"><div class="ds-burok ds-hero-racs"><div class="ds-hero-szoveg">'
  '<div class="ds-szalag">Green lifestyle app from Hungary</div>'
  '<h1 class="ds-cim1">Don\'t just claim it. <span class="ds-kiemel">Do it, measure it,</span> show it.</h1>'
  '<p class="ds-lead">beeco is a green lifestyle app and community. We help companies and cities turn people into a swarm of real, measurable green action, and we hand you the numbers to prove it.</p>'
  f'<div class="ds-gombsor"><a class="ds-gomb" href="#contact">Talk to us</a><a class="ds-gomb ds-masod" href="{UTME("hero")}">Get the app</a><a class="ds-gomb ds-masod" href="/">Magyarul</a></div>'
  '<div class="ds-chipsor"><div class="ds-chip">ONE Digital Award 2025: 1st place</div><div class="ds-chip">25,000+ downloads</div><div class="ds-chip">4.6 on the App Store</div></div>'
  '<p class="ds-forras">The app is currently available in Hungarian.</p>'
  '</div>' + foto('csapat-nagy', 'The beeco team in beige t-shirts, with one member in a bee costume', 'The swarm, all hands', ' ds-hero-foto') +
  '</div></section>')
E_MIERT = ('<section class="ds-szekcio ds-hatter-feher" id="why"><div class="ds-burok">'
  + fej('Why now', 'Green claims need proof now')
  + '<div class="ds-ketto">'
  '<div class="ds-kartya"><h3 class="ds-cim3">Generic green claims are banned</h3><p class="ds-szoveg">Since 27 September 2026, EU law bans unproven generic environmental claims such as “eco-friendly company”, and claims based on offsetting. Companies need concrete, verified action instead.</p>'
  '<p class="ds-forras"><a class="ds-szoveglink" href="https://transition-pathways.europa.eu/legislation/directive-eu-2024825-empowering-consumer-green-transition" target="_blank" rel="noopener">Directive (EU) 2024/825 ›</a></p></div>'
  '<div class="ds-kartya"><h3 class="ds-cim3">Reporting got simpler, not optional</h3><p class="ds-szoveg">After Omnibus I, CSRD applies to companies above 1,000 employees and EUR 450 million turnover. Most others report voluntarily with the simpler VSME standard, and they need simple, credible social and community data.</p>'
  '<p class="ds-forras"><a class="ds-szoveglink" href="https://www.aoshearman.com/en/insights/agreement-on-the-csrd-cs3d-omnibus-package-key-changes-and-implications" target="_blank" rel="noopener">CSRD Omnibus I summary ›</a></p></div>'
  '</div></div></section>')
E_PILLER = ('<section class="ds-szekcio"><div class="ds-burok">'
  + fej('How it works', 'Engage. Measure. Show.')
  + kartya3([('raj', 'Engage', 'Your people take real action, playfully: they water young trees, build nest boxes, complete challenges in the app and collect nectar.'),
             ('kupa', 'Measure', 'Every paid package comes with an Impact Report: measured data, sources and method, linked to the SDGs and VSME data points.'),
             ('sziv', 'Show', 'Campaigns, press and in-app visibility, plus ready-made, verified sentences you can use in your communication.')])
  + '</div></section>')
E_AJANLAT = ('<section class="ds-szekcio ds-hatter-zold" id="offers"><div class="ds-burok">'
  + fej('For companies & cities', 'Six ways to work with the swarm', 'Every offer comes in three steps: a low-risk starter, a core subscription and a named partnership.')
  + '<div class="ds-utak">'
  + ut('#contact', 'telefon', 'beeco@work', 'Your team in the app: internal green challenges, a shared footprint, nectar competitions and a monthly Impact Report.', 'Ask for a demo', True)
  + ut('#contact', 'kanna', 'Watering Swarm', 'Corporate tree-watering days with Hungary\'s first community tree-watering campaign, June to September.', 'Book a day')
  + ut('#contact', 'madarpont', 'Bird Swarm', 'Build nest boxes and feeders, bird walks with BirdLife Hungary (MME), October to March.', 'Book a day')
  + ut('#contact', 'telepules', 'City package', 'Tree watering, bird protection, a local green map and resident programmes, with a yearly Impact Report.', 'Talk to us')
  + ut('#contact', 'taska', 'Partner program', 'Green shops and producers on the map, with coupons that bring conscious customers through the door.', 'Join')
  + ut('#contact', 'otlet', 'Green marketing', 'Campaigns, content and video built only on verified claims, and sponsorship of beeco campaigns.', 'Talk to us')
  + '</div></div></section>')
E_HATAS = ('<section class="ds-szekcio ds-hatter-feher" id="impact"><div class="ds-burok ds-ketto"><div class="ds-hero-szoveg">'
  '<div class="ds-szalag">Measured impact</div><h2 class="ds-cim2">Tree watering almost doubled in one year</h2>'
  '<p class="ds-lead">In summer 2026, residents gave 784,352 litres of water to young trees in 15 municipalities. This is the kind of number every partner gets in its Impact Report.</p></div>'
  '<div class="ds-grafikon"><div class="ds-cim3">Volunteer Tree Watering, 2025 and 2026</div>'
  '<div><div class="ds-grafikon-felirat">Water given (litres)</div>' + sav('2025', '400,000', '51', True) + sav('2026', '784,352', '100', False) + '</div>'
  '<div><div class="ds-grafikon-felirat">Active volunteers</div>' + sav('2025', '1,500', '69', True) + sav('2026', '2,162', '100', False) + '</div>'
  '<p class="ds-forras">Sources: Telex, 21 September 2025 (2025); beeco campaign close, October 2026 (2026). Bars are to scale within each row.</p>'
  '</div></div></section>')
E_SZAMOK = [('25,000+', 'downloads'), ('23,000+', 'green spots on the map'), ('15', 'partner municipalities'),
            ('2,162', 'active tree-watering volunteers in 2026'), ('100+', 'green events every month'), ('12', 'professional partners')]
E_SZAM = ('<section class="ds-szekcio ds-hatter-sotet"><div class="ds-burok">'
  + '<div class="ds-szekcio-fej"><div class="ds-szalag">Traction</div><h2 class="ds-cim2">A national community in three years</h2></div>'
  + '<div class="ds-szamsav">' + ''.join(f'<div class="ds-szam"><div class="ds-szam-ertek">{e(a)}</div><div class="ds-szam-felirat">{e(b)}</div></div>' for a, b in E_SZAMOK) + '</div>'
  + '<p class="ds-forras ds-forras-sotet">Sources: App Store and Google Play listings, beeco internal data, October 2026.</p>'
  + '</div></section>')
E_TORT = [('2026', 'Volunteer Tree Watering: 784,352 litres, 2,162 volunteers, 15 municipalities. CsicsergŐsz bird campaign. Back at Web Summit.'),
          ('2025', 'ONE Digital Award, 1st place (green category). F6S: 2nd most outstanding sustainability startup in Hungary. First community tree-watering campaign.'),
          ('2024', 'App and Hungary\'s largest green map launched. Web Summit, Lisbon. NTK and Design Terminal Start: top 20 of 250 teams.'),
          ('2023', 'beeco is born. EIT Climate Launchpad international final. MVM Edison startup competition, 3rd place.')]
E_TORTENET = ('<section class="ds-szekcio"><div class="ds-burok ds-ketto"><div class="ds-hero-szoveg">'
  '<div class="ds-szalag">Our story</div><h2 class="ds-cim2">Award-winning, volunteer-powered</h2>'
  '<p class="ds-lead">An award-winning Hungarian startup built by 29 volunteers and professionals in 7 squads, with university and civic partners. Next goal: beeco beyond borders.</p></div>'
  '<ul class="ds-ido-lista">' + ''.join(f'<li class="ds-ido-elem"><span class="ds-ido-ho">{ev}</span><span>{e(sz)}</span></li>' for ev, sz in E_TORT) + '</ul>'
  '</div></section>')
E_SAJTO = ('<section class="ds-szekcio ds-hatter-feher"><div class="ds-burok">'
  + fej('Featured in', 'Press and professional partners')
  + '<div class="ds-logosor">' + ''.join(f'<div class="ds-logo"><img class="ds-logo-kep" src="{LOGO[p]}" alt="{e(p)}" loading="lazy"></div>' for p in ['Telex', 'Trade magazin', 'Marie Claire', 'Startuponline', 'We Love Budapest', 'Daily News Hungary'] if p in LOGO) + '</div>'
  + '<div class="ds-logosor ds-logosor-sajto">' + ''.join(f'<div class="ds-logo"><img class="ds-logo-kep" src="{LOGO[p]}" alt="{e(p)}" loading="lazy"></div>' for p in PARTNER if p in LOGO) + '</div>'
  + '</div></section>')
E_KAPCS = ('<section class="ds-szekcio ds-hatter-vaj" id="contact"><div class="ds-burok ds-zaro">'
  '<div class="ds-szalag">Let\'s talk</div><h2 class="ds-cim2">Meet us in Lisbon, or write to us</h2>'
  f'<p class="ds-lead ds-zaro-lead">Bring beeco to your company, city or community. Write to Kristóf Hegedűs, co-founder and CEO: <strong>{MAIL}</strong></p>'
  f'<div class="ds-gombsor"><a class="ds-gomb" href="mailto:{MAIL}?subject=Web%20Summit%20%E2%80%93%20beeco">Email us</a><a class="ds-gomb ds-masod" href="{UTME("zaro")}">Get the app</a><a class="ds-gomb ds-masod" href="/">Magyarul</a></div>'
  '</div></section>')
ELOZO_E = ELOZO | {c for h in (B_HERO, B_LEVEL, B_VEZ, B_RAJOK, B_TANACS, B_HOGYAN, B_TOVABB, B_ZARO) for x in re.findall(r'class="([^"]+)"', h) for c in x.split()}
E = osszeallit([('e-hero', E_HERO), ('e-miert', E_MIERT), ('e-piller', E_PILLER), ('e-ajanlat', E_AJANLAT), ('e-hatas', E_HATAS), ('e-szam', E_SZAM),
                ('e-tortenet', E_TORTENET), ('e-sajto', E_SAJTO), ('e-kapcs', E_KAPCS)], KOZOS, A_CSS, C_CSS, B_CSS, kesz0=ELOZO_E)
json.dump(E, open(os.path.join(OUT, 'e.json'), 'w'), ensure_ascii=False, indent=1)
hE = {c for x in re.findall(r'class="([^"]+)"', ''.join(a['html'] for a in E)) for c in x.split()}
dE = set(re.findall(r'\.(ds-[a-z0-9-]+)', ''.join(a['css'] for a in E)))
print('E:', [(a['nev'], len(a['html']), len(a['css'])) for a in E], '| új CSS kellene:', sorted(hE - dE - ELOZO_E))

# ellenőrzés: minden használt osztálynak van CSS-e valahol
hasznalt = set(re.findall(r'class="([^"]+)"', ''.join(a['html'] for a in A)))
hasznalt = {c for x in hasznalt for c in x.split()}
definialt = set(re.findall(r'\.(ds-[a-z0-9-]+)', ''.join(a['css'] for a in A)))
hiany = sorted(hasznalt - definialt)
assert all(PIKO.get(p) for p in ['otlet', 'sziv', 'lab', 'raj', 'konyv', 'kupa']), 'piko hiányzik'
json.dump(A, open(os.path.join(OUT, 'a.json'), 'w'), ensure_ascii=False, indent=1)
print('A:', [(a['nev'], len(a['html']), len(a['css'])) for a in A], '| CSS nélküli osztály:', hiany, '| logók:', sum(p in LOGO for p in PARTNER), '/', len(PARTNER))
