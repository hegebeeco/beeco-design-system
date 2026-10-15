"""beeco navigáció (bn-) és lábléc (bl-) jelölése a Webflow-ba (whtml) és a helyi próbaoldalhoz.
Kimenet: bn.html, bl.html (natív jelölés), proba.html (helyi teszt CSS-sel és JS-sel)."""
import os, html as H
D = os.path.dirname(os.path.abspath(__file__))
S3 = 'https://s3.amazonaws.com/webflow-prod-assets/648ebb1f9ae84f3d530e2f2d/'
CDN = 'https://cdn.prod.website-files.com/648ebb1f9ae84f3d530e2f2d/'
PIKO = {'lab': '6acdcf5d31a1079e200f1faa', 'alma': '6acdcf7bdb31faba74106c65', 'csepp': '6acdcf7ba358827ed21560fa', 'doboz': '6acdcf7ba358827ed2156117',
        'fa': '6acdcf7bf218d7e862748bce', 'haz': '6acdcf7bf218d7e862748beb', 'howto': '6acdcf7bdb31faba74106cec', 'kanna': '6acdcf7cf2f41b180badc6a6',
        'katt': '6acdcf7cf2f41b180badc726', 'kesvilla': '6acdcf7c1f7962a21f69b845', 'konyv': '6acdcf7cab88aba1da6f3a0e', 'kuka': '6acdcf7c1adc944900c3696a',
        'kupa': '6acdcf7d46bae73bbde8f3de', 'kupon': '6acdcf7d13f43306a9e990ce', 'madarpont': '6acdcfae356d56416f62a05f', 'naptar': '6acdcfae02624ee83fb9c137',
        'olvas': '6acdcfafdf4b15324ccb4a5b', 'otlet': '6acdcfaf356d56416f62a0d9', 'play': '6acdcfb031a1079e200f5490', 'posta': '6acdcfb046bae73bbde921f8',
        'sziv': '6acdcfb0356d56416f62a171', 'taska': '6acdcfb0aac2053c2cb040ee', 'telefon': '6acdcfb16b9d194eb04d6ec1', 'telepules': '6acdcfb1a57f9d8d1eba51c5', 'terkep': '6acdcfb146bae73bbde923f6'}
pk = lambda n, c='bn-piko': f'<img class="{c}" src="{S3}{PIKO[n]}_fs-piko-{n}.svg" alt="">'
e = lambda s: H.escape(s, quote=True)
LOGO = CDN + '655512ff22c587d4c7112378_linear%20logo.svg'
LOGO_LAB = CDN + '65552463bc86efc481b60a10_footer%20logo.svg'
BEELA = CDN + '69958ad111b6a3c7275accc0_ME%CC%81H_Beela.png'
ZOLDMIN = CDN + '65b232dbc7d250a8cbcd6a87_Matrica_online_PNG.avif'
SOC = [('Instagram', 'https://www.instagram.com/beeco_beethechange/', CDN + '6555268466058d1d83a81fe4_%F0%9F%A6%86%20icon%20_rounded%20instagram_.svg'),
       ('Facebook', 'https://www.facebook.com/beeco.beethechange', CDN + '65552684dc33e962e1ac82c6_Group%20445.svg'),
       ('LinkedIn', 'https://www.linkedin.com/company/93244289/', CDN + '65573b7485ec7fd1df820ba1_linkedin.avif'),
       ('TikTok', 'https://www.tiktok.com/@beeco.hu', CDN + '65573b74aab9a5a170ca6316_tiktok.avif'),
       ('YouTube', 'https://www.youtube.com/@beezzarajban', CDN + '66d4d2a18b4f7b26a3501ed9_Group%20874.avif')]
# Az öt csoport: (kulcs, név, piktogram, csempék [(piko, cím, alcím, url)], kiemelő (szalag, cím, szöveg, link-szöveg, url))
CSOP = [
 ('app', 'Az app', 'telefon', [('terkep', 'Ökotérkép', 'Zöld helyek a közelben', '/terkep'), ('lab', 'Lábnyomkalkulátor', 'Mérd meg, hol tartasz', '/labnyomkalkulator'),
   ('kupon', 'Kuponok', 'Kedvezmények zöld partnerektől', '/kuponok'), ('naptar', 'Eseménynaptár', '100+ zöld program havonta', '/zold-esemenynaptar'),
   ('howto', 'GYIK az appról', 'Ingyenes? Mi a nektár?', '/gyik'), ('telefon', 'Letöltés', 'Ingyenes, iOS és Android', '/letoltes')],
  ('Most fut', 'CsicsergŐsz', 'Ismerd meg a körülötted élő madarakat, és segíts nekik.', 'Irány a kampány', '/kampanyok/csicsergosz')),
 ('tudas', 'Tudás', 'konyv', [('olvas', 'Blog', 'Hírek, gazdaság, természet', '/beecopedia/blog'), ('play', 'Ökos tartalmak', 'Film, könyv, app, podcast', '/beecopedia/okos-tartalmak'),
   ('kesvilla', 'Szezonális étkezés', 'Mi terem most, receptekkel', '/beecopedia/szezonalis-etkezes'), ('kuka', 'Hulladék kisokos', 'Mit hova vigyél', '/beecopedia/szemet-csokkento-kisokos'),
   ('otlet', 'Zöld címkék', 'Mit jelent a csomagoláson', '/beecopedia/zold-cimkek'), ('sziv', 'Ökos példaképek', 'GreenFluencerek', '/beecopedia/greenfluencerek')],
  ('beecopedia', 'Ha tanulnál, kezdd itt', 'Gyakori zöld kérdések, kisokosok és példaképek egy helyen.', 'beecopedia', '/beecopedia')),
 ('kampany', 'Kampányok', 'madarpont', [('madarpont', 'CsicsergŐsz', 'Madárbarát feladatok, most fut', '/kampanyok/csicsergosz'), ('kanna', 'Önkéntes vízadás', '2027 tavaszán újra', '/kampanyok/onkentes-vizadas'),
   ('kupa', 'Nyereményjátékok', 'Aktuális játékok', '/nyeremenyjatek/nyeremenyjatekok')],
  ('Eddig', '15 település, 7.000 fa', 'A kampányaink és eredményeik egy helyen.', 'Összes kampány', '/kampanyok')),
 ('partner', 'Partnereknek', 'taska', [('terkep', 'Kerülj fel az appba', 'Zöld vállalkozásoknak', '/szolgaltatas/partner'), ('naptar', 'Zöld rendezvények', 'Nagyvállalati események', '/szolgaltatas/zold-esemeny-szervezes'),
   ('otlet', 'Zöld marketing', 'Tanácsadás, kampány', '/szolgaltatas/zold-marketing'), ('posta', 'Zöld szolgáltatás-kiajánló', 'Válogatott partnereink', '/szolgaltatas/zold-szolgaltatas-kiajanlo'),
   ('taska', 'PartnerApp', 'Belépés partnereknek', '/szolgaltatas/partner-oldal')],
  ('Szolgáltatások', 'Zöld marketing és ESG', 'Cégeknek és településeknek: tanácsadás, kampány, fejlesztés.', 'Szolgáltatásaink', '/szolgaltatas/szolgaltatasaink')),
 ('rolunk', 'Rólunk', 'sziv', [('sziv', 'Rólunk', 'Küldetés és értékek', '/rolunk'), ('olvas', 'Történetünk', 'A raj eddigi útja', '/tortenetunk'),
   ('haz', 'Csapat', 'Légy a raj tagja', '/csapat'), ('howto', 'GYIK', 'Gyakori kérdések', '/gyik')],
  ('Írj nekünk', 'Kapcsolat', 'Kérdés, ötlet, együttműködés.', 'Kapcsolat', '/kapcsolat')),
]

def csempe(p, c, s, u):
    return f'<a class="bn-csempe" href="{u}">{pk(p)}<span class="bn-csempe-cim">{e(c)}</span><span class="bn-csempe-al">{e(s)}</span></a>'

def panel(k, nev, ik, cs, ki):
    sz, cim, szov, lsz, lu = ki
    return (f'<li class="bn-elem"><a class="bn-gomb" href="#bn-p-{k}" role="button" aria-expanded="false" aria-controls="bn-p-{k}">{pk(ik, "bn-gomb-piko")}<span class="bn-gomb-nev">{nev}</span><span class="bn-nyil"></span></a>'
            f'<div class="bn-panel" id="bn-p-{k}"><div class="bn-csempek">' + ''.join(csempe(*t) for t in cs) + '</div>'
            f'<div class="bn-kiemel"><div class="bn-kiemel-szalag">{e(sz)}</div><div class="bn-kiemel-cim">{e(cim)}</div><p class="bn-kiemel-szoveg">{e(szov)}</p><a class="bn-kiemel-link" href="{lu}">{e(lsz)} ›</a></div></div></li>')

BN = ('<div class="bn" data-bn="1"><div class="bn-sav">'
      f'<a class="bn-logo" href="/"><img class="bn-logo-kep" src="{LOGO}" alt="beeco főoldal"></a>'
      f'<a class="bn-most" href="/kampanyok/csicsergosz">{pk("madarpont", "bn-most-piko")}<span class="bn-most-szoveg"><span class="bn-most-cimke">Most fut:</span> CsicsergŐsz</span></a>'
      '<a class="bn-vissza" href="/">‹ beeco.hu főoldal</a>'
      '<a class="bn-hamb" href="#bn-menu" role="button" aria-expanded="false" aria-controls="bn-menu"><span class="bn-hamb-ikon"></span><span class="bn-hamb-szoveg">Menü</span></a>'
      '<div class="bn-menu" id="bn-menu"><ul class="bn-lista">' + ''.join(panel(*c) for c in CSOP) + '</ul>'
      f'<a class="bn-bolt" href="/beebolt">{pk("doboz", "bn-bolt-piko")}<span class="bn-bolt-szo">beebolt</span></a></div>'
      '<a class="bn-cta" href="/letoltes">Töltsd le!</a></div></div>')

SOROK = [(nev, [(c, u) for _, c, _, u in cs] + ([(ki[3], ki[4])] if k != 'app' and ki[4] not in [u for *_, u in cs] else [])) for k, nev, ik, cs, ki in CSOP]
BL = ('<footer class="bl" data-bl="1"><div class="bl-jelenet"><div class="bl-burok bl-jelenet-racs">'
      f'<img class="bl-meh" src="{BEELA}" alt="">'
      '<div class="bl-hivas"><h2 class="bl-cim">Légy te a változás. Kezdd egy lépéssel!</h2><p class="bl-szoveg">Ingyenes, magyar, és minden lépésedért nektár jár.</p><div class="bl-letolt-hely"></div></div>'
      '<div class="bl-levelke"><div class="bl-levelke-cim">Kéthetente egy Levélke</div><p class="bl-levelke-szoveg">Új funkciók, zöld tippek, események és kampányok. Bármikor leiratkozhatsz.</p><div class="bl-levelke-urlap"></div></div>'
      '</div></div>'
      '<div class="bl-sorok"><div class="bl-burok">' + ''.join(f'<div class="bl-sor"><div class="bl-sor-cim">{e(n)}</div><div class="bl-sor-linkek">' + ''.join(f'<a class="bl-link" href="{u}">{e(c)}</a>' for c, u in ls) + '</div></div>' for n, ls in SOROK) +
      '<div class="bl-sor"><div class="bl-sor-cim">Webshop</div><div class="bl-sor-linkek"><a class="bl-link" href="/beebolt">beebolt</a></div></div></div></div>'
      '<div class="bl-also"><div class="bl-burok bl-also-racs">'
      f'<a class="bl-logo" href="/"><img class="bl-logo-kep" src="{LOGO_LAB}" alt="beeco főoldal"></a>'
      '<div class="bl-rovid"><a class="bl-link" href="/rolunk">Rólunk</a><a class="bl-link" href="/gyik">GYIK</a><a class="bl-link" href="/kapcsolat">Kapcsolat</a><a class="bl-link" href="/beebolt">beebolt</a></div>'
      '<div class="bl-social">' + ''.join(f'<a class="bl-social-link" href="{u}" target="_blank" rel="noopener" aria-label="beeco a(z) {n} oldalon"><img class="bl-social-kep" src="{i}" alt=""></a>' for n, u, i in SOC) + '</div>'
      f'<div class="bl-minosites"><img class="bl-minosites-kep" src="{ZOLDMIN}" alt="Zöld Minősítés: környezettudatosak vagyunk"><span class="bl-ertekeles">★ 4,6 App Store · ★ 4,2 Google Play</span></div>'
      '<div class="bl-jogi"><span>© beeco</span><a class="bl-link" href="/privacy-policy">Használati feltételek és adatkezelés</a><span>Hosztolja a GreenGeeks</span></div>'
      '</div></div></footer>')

open(os.path.join(D, 'bn.html'), 'w').write(BN)
open(os.path.join(D, 'bl.html'), 'w').write(BL)
css = open(os.path.join(D, 'bn-bl.css')).read() if os.path.exists(os.path.join(D, 'bn-bl.css')) else ''
js = open(os.path.join(D, 'bn.js')).read() if os.path.exists(os.path.join(D, 'bn.js')) else ''
DL = ('<div class="download_block"><div class="div-block-237"><a class="footer_download" href="https://play.google.com/store/apps/details?id=hu.beeco.app"><img src="' + CDN + '69958c5ea041b04aa5e55cff_Property%201%3DVariant2.png" alt="Google Play" style="height:56px"></a>'
      '<a class="footer_download" href="https://apps.apple.com/hu/app/beeco/id6478549279?l=hu"><img src="' + CDN + '69958c54892dac7af30b9a7a_adhasjd.png" alt="App Store" style="height:56px"></a></div></div>')
FORM = '<div class="sender-proba" style="background:#fff;border:2px dashed #999;padding:14px;color:#555;font-size:13px">[Sender-feliratkozó helye: data-sender-form-id e30255ec7043d5a6Ezl]</div>'
proba = ('<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>bn/bl próba</title>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lalezar&family=Open+Sans:wght@400;600;700;800&display=swap">'
         '<style>body{margin:0;font-family:"Open Sans",sans-serif;background:#FFF8E7}.tartalom{max-width:1100px;margin:0 auto;padding:40px 20px;min-height:900px}.tartalom h1{font-family:Lalezar,sans-serif;font-weight:400;font-size:48px}</style>'
         f'<style>{css}</style></head><body class="{os.environ.get("BODY","")}">' + BN + '<main class="tartalom" id="tartalom"><h1>Tartalom</h1><p>Próbaoldal a beeco navigációhoz és lábléchez.</p><a href="#lent">horgony</a></main>' +
         BL.replace('<div class="bl-letolt-hely"></div>', '<div class="bl-letolt-hely">' + DL + '</div>').replace('<div class="bl-levelke-urlap"></div>', '<div class="bl-levelke-urlap">' + FORM + '</div>') +
         f'<div id="lent"></div><script>{js}</script></body></html>')
open(os.path.join(D, 'proba.html'), 'w').write(proba)
print('bn', len(BN), 'bl', len(BL))
