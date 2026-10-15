"""Önkéntes Vízadás 2026 – szezonzáró oldal (natív ds- blokkok, a Web DS-ből).
Tartalom: a 2026. októberi záró sajtóközlemény (Kristóf) és a szezonzáró terv (artifact NuvNizbhC1z2B8NkSSpE4q):
köszönet → eredmény → az év vízadója → országos összefogás → veletek tervezzük 2027-et → szervezők és támogatók →
cégeknek és településeknek → sajtó → GYIK. Két CTA: „Szólj, ha indulunk” (Levélke, #levelke) és visszajelzés.
[SZÖGLETES] = helyőrző, Kristóf dönt. Kimenet: ki/vizadas.json, ki/vizadas-meta.json."""
import os, sys, io, re, json, contextlib
D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, 'ki'); os.makedirs(OUT, exist_ok=True)
sys.path.insert(0, os.path.join(D, '..', 'b2b')); sys.path.insert(0, os.path.join(D, '..', 'rolunk'))
with contextlib.redirect_stdout(io.StringIO()):
    import gen_b2b as B
G = B.G; e, fej, kep, kartya3, ut, szekcio, gyik, komp = G.e, G.fej, B.kep, G.kartya3, G.ut, B.szekcio, B.gyik, B.komp
T, M, S = G.T, G.M, G.S
CDN = 'https://cdn.prod.website-files.com/648ebb1f9ae84f3d530e2f2d/'

# számok: a záró közlemény (2026. október) – a szamok.json-ba is ezek kerülnek, ha Kristóf jóváhagyja
SZ = {'liter': '1 millió+', 'locsolas': '33 000+', 'fa': '7 500+', 'vizado': '2 200+', 'telepules': '15'}
FORRAS = 'Önkéntes Vízadás 2026 záró közlemény, 2026. október; 2025: Telex, 2025. szeptember 21.'

UJ_CSS = {}  # a .ds-sav-40 és .ds-sav-68 már a gen_ds.py C_CSS-ében van

def gomb(href, szoveg, hely, masod=False):
    return f'<a class="ds-gomb{" ds-masod" if masod else ""}" href="{href}" data-b2b-cta="{hely}">{e(szoveg)}</a>'
sav = lambda ev, ertek, szel, elozo: f'<div class="ds-sav-sor"><div class="ds-sav-ev">{ev}</div><div class="ds-sav{" ds-sav-elozo" if elozo else ""} ds-sav-{szel}">{ertek}</div></div>'

HERO = ('<section class="ds-szekcio ds-hatter-vaj" id="kezdes"><div class="ds-burok ds-hero-racs"><div class="ds-hero-szoveg">'
  '<div class="ds-szalag">Önkéntes Vízadás 2026 · szezonzáró</div>'
  '<h1 class="ds-cim1">Köszönjük! <span class="ds-kiemel">Több mint egymillió liter</span> víz jutott a fáknak</h1>'
  '<p class="ds-lead">Idén több mint 2 200 vízadó több mint 33 ezer locsolást rögzített a beeco appban, és több mint 7 500 fiatal fát öntözött meg országszerte. A szezon október 13-án zárult, 2027 májusában újra indulunk.</p>'
  '<div class="ds-gombsor">' + gomb('#levelke', 'Szólj, ha indulunk', 'hero') + gomb('#visszajelzes', 'Elmondom a véleményem', 'hero-2', True) + '</div>'
  '<div class="ds-chipsor"><div class="ds-chip">Újraindulás: 2027 május</div><div class="ds-chip">10 kerület és 4 város</div><div class="ds-chip">Névadó támogató: E.ON</div></div>'
  '</div>' + kep(CDN + '6ad10e53219a8f817905a826_vizadas-csoportkep-1200.webp', 'Vidám csoport zöld fák alatt egy locsolónapon', 'Önkéntes Vízadás 2026', ' ds-hero-foto') +
  '</div></section>')

SZAMOK = ('<section class="ds-szekcio ds-hatter-sotet" id="eredmeny"><div class="ds-burok">'
  '<div class="ds-szekcio-fej"><div class="ds-szalag">A 2026-os szezon</div><h2 class="ds-cim2">Ennyit tettetek a fákért</h2></div>'
  '<div class="ds-szamsav">' + ''.join(f'<div class="ds-szam"><div class="ds-szam-ertek">{e(a)}</div><div class="ds-szam-felirat">{e(b)}</div></div>' for a, b in [
      (SZ['liter'], 'liter víz a fiatal fáknak'), (SZ['locsolas'], 'rögzített locsolás az appban'), (SZ['fa'], 'megöntözött fiatal fa'),
      (SZ['vizado'], 'vízadó országszerte'), (SZ['telepules'], 'partner-önkormányzat'), ('2027 május', 'újraindulás')]) + '</div>'
  f'<p class="ds-forras ds-forras-sotet">Forrás: {e(FORRAS)}</p></div></section>')

NOVEKEDES = ('<section class="ds-szekcio ds-hatter-feher"><div class="ds-burok ds-ketto"><div class="ds-hero-szoveg">'
  '<div class="ds-szalag">Egy év alatt</div><h2 class="ds-cim2">Két és félszer annyi víz, mint tavaly</h2>'
  '<p class="ds-lead">2025-ben még a FŐKERT fáira koncentráltunk, idén tíz budapesti kerület mellett Pécs, Veszprém, Kecskemét és Székesfehérvár is csatlakozott. Az eredmény: két és félszer annyi víz jutott a fiatal fáknak.</p></div>'
  '<div class="ds-grafikon"><div class="ds-cim3">Önkéntes Vízadás, 2025 és 2026</div>'
  '<div><div class="ds-grafikon-felirat">Kiöntött víz (liter)</div>' + sav('2025', '400 000', '40', True) + sav('2026', '1 millió+', '100', False) + '</div>'
  '<div><div class="ds-grafikon-felirat">Vízadók (fő)</div>' + sav('2025', '1 500', '68', True) + sav('2026', '2 200+', '100', False) + '</div>'
  f'<p class="ds-forras">Források: {e(FORRAS)} Egy soron belül a sávok méretarányosak.</p></div>'
  '</div></section>')

HOS = ('<section class="ds-szekcio" id="az-ev-vizadoja"><div class="ds-burok ds-ketto"><div class="ds-hero-szoveg">'
  '<div class="ds-szalag">Az év vízadója</div><h2 class="ds-cim2">Munka előtt és után is locsolt</h2>'
  '<p class="ds-lead">Hegyaljai Melinda a nyár második nagy hőhullámában kezdett locsolni, amikor észrevette, milyen sok fiatal fának kell segítség. Saját autójával, kannákban, vödrökben és dézsákban hordta a vizet, munka előtt és után, olykor a szabadnapjain is.</p>'
  '<p class="ds-szoveg">Különösen megszerette a Kucorgó tér, a Pesti út és Cinkota fáit. Locsolás közben sokan megszólították és megköszönték a munkáját, többen pedig maguk is elkezdtek öntözni.</p>'
  '<div class="ds-chipsor"><div class="ds-chip">1 000+ locsolás</div><div class="ds-chip">400+ fiatal fa</div><div class="ds-chip">közel 40 000 liter</div></div></div>'
  '<div class="ds-level"><p class="ds-level-szoveg">„Én azóta szemmel tartom a fáimat, örömmel látom, hogy jól vannak.”</p>'
  '<p class="ds-level-szoveg">„Elég, ha mindenki csak egy kicsit vállal, a sok összeadódik, és nagy eredményt lehet elérni.”</p>'
  '<div class="ds-level-alairas">Hegyaljai Melinda, az év vízadója</div></div>'
  '</div></section>')

ORSZAGOS = ('<section class="ds-szekcio ds-hatter-zold"><div class="ds-burok">'
  + fej('Országos összefogás', 'Budapesti kezdeményezésből országos kampány')
  + kartya3([('telepules', '10 kerület és 4 város', 'Tíz budapesti kerület, Pécs, Veszprém, Kecskemét és Székesfehérvár fái várták a vizet.'),
             ('terkep', 'Térkép és napló', 'Az appban megkerestétek a szomjas fákat, és rögzítettétek, mikor és mennyi vizet vittetek.'),
             ('raj', 'Közösségek és cégek', 'Helyi közösségek és céges csapatok is beszálltak, közös locsolásokkal és csapatversenyekkel.')])
  + '<p class="ds-megjegyzes"><strong>Berlinben is locsolnak:</strong> a 2020-ban indult Gieß den Kiez nyilvános statisztikái szerint a résztvevők összesen több mint 2,4 millió liter vizet regisztráltak, 2026-ban eddig 3 622 locsolást. Az Önkéntes Vízadás idén egyetlen szezonban több mint 33 ezer locsolást rögzített. '
  '<a class="ds-szoveglink" href="https://www.giessdenkiez.de/stats?lang=en" target="_blank" rel="noopener">Gieß den Kiez statisztikák ›</a></p>'
  + '</div></section>')

TERVEZZUK = ('<section class="ds-szekcio ds-hatter-feher" id="visszajelzes"><div class="ds-burok ds-ketto"><div class="ds-hero-szoveg">'
  '<div class="ds-szalag">Veletek tervezzük</div><h2 class="ds-cim2">Mitől lesz még jobb 2027-ben?</h2>'
  '<p class="ds-lead">Az október 13-i kampányzárón több mint 20 önkéntessel beszélgettünk az idei tapasztalatokról. Ezek az ötletek születtek, és a tiédre is kíváncsiak vagyunk.</p>'
  '<div class="ds-gombsor">' + gomb('mailto:hello@beeco.hu?subject=%C3%96nk%C3%A9ntes%20V%C3%ADzad%C3%A1s%202026%20visszajelz%C3%A9s', 'Elmondom a véleményem', 'visszajelzes') + '</div>'
  '<p class="ds-forras">[Visszajelző kérdőív: natív űrlap vagy külső, Kristóf dönt. Addig e-mailben.]</p></div>'
  '<ul class="ds-csomag-lista">' + ''.join(f'<li class="ds-csomag-elem"><span class="ds-csomag-pipa">✓</span><span>{e(x)}</span></li>' for x in [
      'Erősebb helyi közösségek és locsolócsapatok', 'Iskolások bevonása', 'Csevegés az appban a vízadók között',
      'Egyszerűbb rögzítés locsoláskor', 'Több hírverés a kampánynak']) + '</ul>'
  '</div></section>')

def logo(url, alt):
    return f'<div class="ds-logo"><img class="ds-logo-kep" src="{G.cdn2s3(CDN + url)}" alt="{e(alt)}" loading="lazy"></div>'
TAMOGATOK = ('<section class="ds-szekcio"><div class="ds-burok">'
  + fej('Szervezők és támogatók', 'Együtt értük el', 'A kampányt a FŐKERT, Budapest Főváros Önkormányzata és a beeco szervezte. Névadó támogató az E.ON, további támogatók a GARDENA és a Dreher.')
  + '<div class="ds-logosor">'
  + logo('6849f2ed38308d6227b98396_fo%CC%8Bkert.avif', 'FŐKERT')
  + logo('6a2ae1f38d40105237e222fd_BUDAPEST_LOGO.png', 'Budapest Főváros Önkormányzata')
  + logo('6a2adc592c51b1ae69450cea_EON_LOGO.png', 'E.ON, névadó támogató')
  + logo('6a2adf6a10f7d1fbb6b0087a_GARDENA_LOGO.png', 'GARDENA')
  + logo('6a4b75d79c7d42e52569d1b6_Dreher%20So%CC%88rgya%CC%81rak_NEW_logo%203.png', 'Dreher Sörgyárak')
  + '<div class="ds-logo"><div class="ds-cim3">+ 14 település</div></div>'
  + '</div></div></section>')

KOVETKEZO = ('<section class="ds-szekcio ds-hatter-zold"><div class="ds-burok">'
  + fej('Addig is', 'Csatlakozz 2027-re, vagy segíts most')
  + '<div class="ds-utak">'
  + ut('/szolgaltatas/onkormanyzatoknak', 'telepules', 'Önkormányzat vagy?', 'A csatlakozás a Vízadáshoz ingyenes. Kerüljenek fel a településed fái 2027-re.', 'Önkormányzatoknak')
  + ut('/szolgaltatas/locsoloraj', 'kanna', 'Céges csapat vagytok?', 'Locsolónap a kollégákkal, júniustól szeptemberig, Hatásjelentéssel.', 'Locsolóraj')
  + ut('/kampanyok/csicsergosz', 'madarpont', 'Most fut: CsicsergŐsz', 'Ősszel és télen a madarakért: itatók, etetők, odúk és megfigyelések az appban.', 'Csatlakozom', True)
  + '</div></div></section>')
KOVETKEZO = KOVETKEZO.replace('<a class="ds-ut', '<a data-b2b-cta="kovetkezo" class="ds-ut')

SAJTO = ('<section class="ds-szekcio ds-hatter-feher" id="sajto"><div class="ds-burok ds-ketto"><div class="ds-hero-szoveg">'
  '<div class="ds-szalag">Sajtó</div><h2 class="ds-cim2">Több mint egymillió liter vízzel öntözték a városi fákat az önkéntesek</h2>'
  '<p class="ds-lead">Az országossá bővült Önkéntes Vízadás kampányban idén több mint 2 200-an vettek részt. A legaktívabb vízadó egymaga több mint ezer alkalommal locsolt.</p>'
  '<div class="ds-gombsor">' + gomb('mailto:kristof.hegedus@beeco.hu?subject=%C3%96nk%C3%A9ntes%20V%C3%ADzad%C3%A1s%202026%20sajt%C3%B3anyag', 'Sajtóanyagot kérek', 'sajto') + '</div>'
  '<p class="ds-forras">[A sajtóközlemény nyilvános linkje és a fotógaléria ide kerül, ha elkészül.]</p></div>'
  '<div class="ds-kartya"><h3 class="ds-cim3">Sajtókapcsolat</h3><p class="ds-szoveg">Hegedűs Kristóf, alapító, CEO</p>'
  '<p class="ds-szoveg"><a class="ds-szoveglink" href="mailto:kristof.hegedus@beeco.hu">kristof.hegedus@beeco.hu</a></p></div>'
  '</div></section>')

GYIK = szekcio('feher', ('Gyakori kérdések', 'A szezon vége után'), gyik([
  ('Mikor indul újra a Vízadás?', '2027 májusában. Iratkozz fel a Levélkére, és szólunk, amikor újra lehet locsolni.'),
  ('Most már nem kell locsolni?', 'A 2026-os szezon október 13-án zárult. Tavasszal a térképen újra megjelennek a locsolásra váró fák.'),
  ('Hogyan csatlakozhat a településünk?', 'A csatlakozás ingyenes. Írj nekünk az <a class="ds-szoveglink" href="/szolgaltatas/onkormanyzatoknak">önkormányzati oldalon ›</a>'),
  ('Locsolhatunk céges csapatként?', 'Igen, a Locsolóraj programmal. <a class="ds-szoveglink" href="/szolgaltatas/locsoloraj">Részletek ›</a>')]), 'gyik')

OLDAL = [('v-hero', HERO), ('v-szam', SZAMOK), ('v-novekedes', NOVEKEDES), ('v-hos', HOS), ('v-orszagos', ORSZAGOS), ('v-tervezzuk', TERVEZZUK),
         ('v-tamogatok', TAMOGATOK), ('v-kovetkezo', KOVETKEZO), ('v-sajto', SAJTO), ('v-gyik', GYIK)]

META = {'slug_draft': 'onkentes-vizadas-szezonzaro-draft', 'slug_vegleges': '/kampanyok/onkentes-vizadas', 'mappa': '6977b8f5595d1bedf549ff3b',
        'cim': 'Önkéntes Vízadás 2026: több mint egymillió liter víz a fáknak | beeco',
        'leiras': 'Köszönjük! 2 200+ vízadó, 33 000+ locsolás, 7 500+ fiatal fa országszerte. A szezon lezárult, 2027 májusában újra indulunk. Szólunk, ha kezdünk.'}

if __name__ == '__main__':
    B.LETEZO.update(c for _, h in B.HUB for x in re.findall(r'class="([^"]+)"', h) for c in x.split())
    ki = G.osszeallit(OLDAL, G.KOZOS, G.A_CSS, G.C_CSS, G.B_CSS, B.B2B_CSS, UJ_CSS, kesz0=B.LETEZO)
    json.dump(ki, open(os.path.join(OUT, 'vizadas.json'), 'w'), ensure_ascii=False, indent=1)
    faq = [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': re.sub(r'<[^>]+>', '', a)}} for q, a in [
        ('Mikor indul újra a Vízadás?', '2027 májusában.'), ('Hogyan csatlakozhat a településünk?', 'A csatlakozás ingyenes, a beeco önkormányzati oldalán lehet jelentkezni.')]]
    META['jsonld'] = json.dumps({'@context': 'https://schema.org', '@graph': [
        {'@type': 'Event', 'name': 'Önkéntes Vízadás 2026', 'description': META['leiras'], 'startDate': '2026-06', 'endDate': '2026-10-13',
         'eventStatus': 'https://schema.org/EventScheduled', 'location': {'@type': 'Place', 'name': 'Magyarország', 'address': 'Budapest, Pécs, Veszprém, Kecskemét, Székesfehérvár'},
         'organizer': [{'@type': 'Organization', 'name': n} for n in ('beeco', 'FŐKERT', 'Budapest Főváros Önkormányzata')],
         'sponsor': [{'@type': 'Organization', 'name': n} for n in ('E.ON', 'GARDENA', 'Dreher')]},
        {'@type': 'FAQPage', 'mainEntity': faq}]}, ensure_ascii=False)
    META['kihagy'] = []
    json.dump(META, open(os.path.join(OUT, 'vizadas-meta.json'), 'w'), ensure_ascii=False, indent=1)
    h = ''.join(a['html'] for a in ki); szoveg = re.sub(r'<[^>]+>', ' ', h)
    print('szekciók:', len(ki), '| új CSS:', [a['nev'] for a in ki if a['css']], '| helyőrző:', re.findall(r'\[[A-ZÁÉÍÓÖŐÚÜŰ][^\]]{3,60}\]', h),
          '| gondolatjel:', [w for w in (' – ', '—') if w in szoveg])
