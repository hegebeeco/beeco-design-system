"""Web DS katalógus – a natív Webflow `ds-` osztályok egy helyen, a generátorokból (kézzel SOHA ne szerkeszd a kimenetet).
Forrás: ../rolunk/gen_ds.py (közös + Rólunk, Hatás, Csapat, /en) és ../b2b/gen_b2b.py (B2B-blokkok).
Kimenet:
  katalogus.json   osztály → család, mely oldalak használják, CSS töréspontonként; változók; oldalak
  ds-blokkok.css   önálló referencia-CSS (a változók világos értékével), előnézethez és más projektekhez
  KATALOGUS.md     emberi olvasásra: családonként az osztályok és az oldalak
Használat: python3 weboldal/web-ds/katalogus.py [--check]"""
import os, re, sys, io, json, contextlib

D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(D, '..', 'rolunk')); sys.path.insert(0, os.path.join(D, '..', 'b2b'))
with contextlib.redirect_stdout(io.StringIO()):
    import gen_ds as G
    import gen_b2b as B

BP = [(G.T, 'alap', ''), (G.M, '≤991 px', G.M), (G.S, '≤767 px', G.S), (G.X, '≤479 px', G.X)]
CSOPORT = [('Közös alap', G.KOZOS), ('Rólunk-blokkok', G.A_CSS), ('Hatás-blokkok', G.C_CSS), ('Csapat-blokkok', G.B_CSS), ('B2B-blokkok', B.B2B_CSS)]
OLDAL = {'rolunk': ('Rólunk', '/rolunk-uj-draft', G.A), 'hatasunk': ('Hatásunk', '/hatasunk-draft', G.C), 'csapatunk': ('Csapatunk', '/csapatunk-uj-draft', G.B),
         'en': ('English (Web Summit)', '/en', G.E), 'cegeknek': ('Cégeknek és településeknek', '/szolgaltatas/cegeknek-draft', B.osszeallit(B.HUB))}
try:  # B2B sales- és esemény-oldalak (weboldal/b2b/oldalak.py)
    import oldalak as _O, json as _J
    for _c in _O.SALES + _O.ESEMENY:
        OLDAL[_c['k']] = (_c['cim'].split(' | ')[0], '/szolgaltatas/' + _c['slug'] + '-draft', _J.load(open(os.path.join(D, '..', 'b2b', 'ki', _c['k'] + '.json'))))
except ImportError:
    pass
CSALAD = [  # (név, mire való, előtagok)
 ('Szekció és keret', 'Oldalszekció háttérváltozatokkal, tartalmi keret, szekciófej.', ['ds-szekcio', 'ds-hatter', 'ds-burok', 'ds-hero', 'ds-ketto', 'ds-harom', 'ds-negy', 'ds-zaro']),
 ('Tipográfia', 'Szalagcím, címszintek, kiemelés, bevezető, folyószöveg, forrássor, szöveglink.', ['ds-szalag', 'ds-cim', 'ds-kiemel', 'ds-lead', 'ds-szoveg', 'ds-forras', 'ds-szoveglink', 'ds-megjegyzes']),
 ('Gomb és chip', 'Elsődleges és másodlagos gomb, gombsor, chip-címke.', ['ds-gomb', 'ds-masod', 'ds-chip']),
 ('Kártyák és utak', 'Ikonos kártya, link-kártya (út), tovább-kártya képpel, ár- és nyílsor.', ['ds-kartya', 'ds-ut', 'ds-utak', 'ds-tovabb']),
 ('Fotó', 'Keretes fotó felirattal, hero- és idővonal-arányok.', ['ds-foto', 'ds-ido-foto', 'ds-hogyan-foto']),
 ('Idővonal és lista', 'Évszámos idővonal, hónap-címkés lista.', ['ds-ido']),
 ('Számok és grafikon', 'Számsáv sötét háttéren, méretarányos sávdiagram.', ['ds-szam', 'ds-grafikon', 'ds-sav']),
 ('Logók, sajtó, idézet', 'Logórács, cikk-kártya, értékelés-idézet.', ['ds-logo', 'ds-cikk', 'ds-idezet']),
 ('Díjak', 'Helyezés-korong díjsorral.', ['ds-dij']),
 ('Emberek és rajok', 'Portré saját méhecskével, raj-kártya taglistával, tanácsadó, alapítói levél.', ['ds-ember', 'ds-raj', 'ds-tanacsado', 'ds-level']),
 ('Csomagok (B2B)', 'Belépő / Mag / Partnerség ajánlati létra, kiemelt középső szinttel.', ['ds-csomag']),
 ('Lépések és eset (B2B)', 'Számozott folyamat, esettanulmány kihívás–megoldás–eredmény bontásban.', ['ds-lepes', 'ds-eset']),
 ('Hatásjelentés (B2B)', 'Jelentésminta: fej, számrács, mondhatod / kerüld állítás.', ['ds-jelentes', 'ds-allitas']),
 ('Űrlap (B2B)', 'Natív Webflow-űrlap: mező, címke, bemenet, jelölőnégyzet, visszajelzés.', ['ds-urlap', 'ds-mezo', 'ds-cimke', 'ds-bemenet', 'ds-szovegdoboz', 'ds-jelolo']),
]
VALTOZO_ERTEK = {  # világos (alap) mód; a sötét mód értékei a Webflow „Sötét” módjában
 'bc-bg': '#FFF8E7', 'bc-surface': '#FFFFFF', 'bc-surface-2': '#F0F3EC', 'bc-ink': None, 'bc-ink-soft': None, 'bc-ink-muted': None, 'bc-accent': None,
 'bc-accent-ink': '#8A6A00', 'bc-raj-bg': '#2F371E', 'bc-on-olive': '#D3DDBB', 'bc-vaj': '#FEEEBB', 'bc-domb': '#D3DDBB', 'bc-paper': '#FFFDF6'}
CSAK_WEBFLOW = ['bc-accent-ink', 'bc-raj-bg', 'bc-on-olive', 'bc-vaj', 'bc-domb', 'bc-paper']  # nincsenek a tokens/ forrásban

def csalad(o):
    for nev, _, elotag in CSALAD:
        if any(o == p or o.startswith(p + '-') or o.startswith(p) for p in elotag): return nev  # combónál az alaposztály dönt
    return 'Egyéb'

def epit():
    dist = json.load(open(os.path.join(D, '..', '..', 'dist', 'weboldal', 'webflow-valtozok.json')))
    for v in dist['valtozok']:
        if v['nev'] in VALTOZO_ERTEK and VALTOZO_ERTEK[v['nev']] is None: VALTOZO_ERTEK[v['nev']] = v['ertek']
    ids = json.load(open(os.path.join(D, '..', 'rolunk', 'valtozok.json')))
    oszt = {}
    for cs, keszlet in CSOPORT:
        for m, cimke, _ in BP:
            for sel, decl in keszlet.get(m, {}).items():
                o = sel.lstrip('.').split(':')[0]
                x = oszt.setdefault(o, {'csoport': cs, 'csalad': csalad(o), 'oldalak': [], 'css': {}})
                x['css'].setdefault(cimke, {})[sel] = decl
    for k, (nev, url, akciok) in OLDAL.items():
        h = ''.join(a['html'] for a in akciok)
        egyutt = [set(x.split()) for x in re.findall(r'class="([^"]+)"', h)]
        for o in {c for x in egyutt for c in x} | {o for o in oszt if '.' in o and any(set(o.split('.')) <= x for x in egyutt)}:
            if o in oszt and k not in oszt[o]['oldalak']: oszt[o]['oldalak'].append(k)
    kat = {'_leiras': 'Generált (weboldal/web-ds/katalogus.py). Kézzel ne szerkeszd.',
           'valtozok': {n: {'webflow_id': ids[n], 'css': f'--_beeco-ds---{n}', 'alap': VALTOZO_ERTEK[n], 'csak_webflow': n in CSAK_WEBFLOW} for n in ids},
           'oldalak': {k: {'nev': v[0], 'url': v[1]} for k, v in OLDAL.items()},
           'osztalyok': dict(sorted(oszt.items()))}
    # referencia-CSS
    sor = [':root{' + ''.join(f'--_beeco-ds---{n}:{v};' for n, v in VALTOZO_ERTEK.items()) + '}']
    for cs, keszlet in CSOPORT:
        sor.append(f'/* ---- {cs} ---- */')
        for m, _, media in BP:
            blokk = ''.join(f'{s}{{{d}}}' for s, d in keszlet.get(m, {}).items())
            if blokk: sor.append(f'{media}{{{blokk}}}' if media else blokk)
    css = '/* beeco Web DS – natív Webflow ds- osztályok referencia-CSS-e. GENERÁLT: weboldal/web-ds/katalogus.py */\n' + '\n'.join(sor) + '\n'
    # olvasható katalógus
    md = ['# Web DS katalógus (generált)', '', '> Kézzel ne szerkeszd: `python3 weboldal/web-ds/katalogus.py`. A leírás: [docs/web-ds.md](../../docs/web-ds.md).', '',
          f'{len(oszt)} osztály, {len(ids)} változó, {len(OLDAL)} oldal.', '', '## Oldalak', '', '| Kulcs | Oldal | Teszt-URL |', '|---|---|---|']
    md += [f'| `{k}` | {v[0]} | `{v[1]}` |' for k, v in OLDAL.items()]
    md += ['', '## Változók', '', '| Név | Világos érték | Megjegyzés |', '|---|---|---|']
    md += [f'| `{n}` | `{VALTOZO_ERTEK[n]}` | {"csak a Webflow-ban, a tokens/ forrásba még fel kell venni" if n in CSAK_WEBFLOW else "tokens/ forrásból"} |' for n in ids]
    for nev, mire, _ in CSALAD + [('Egyéb', 'Segédosztályok.', [])]:
        tagok = [o for o in sorted(oszt) if oszt[o]['csalad'] == nev]
        if not tagok: continue
        md += ['', f'## {nev}', '', mire, '', '| Osztály | Töréspontok | Oldalak |', '|---|---|---|']
        md += [f'| `.{o}` | {", ".join(oszt[o]["css"])} | {", ".join(oszt[o]["oldalak"]) or "–"} |' for o in tagok]
    return {'katalogus.json': json.dumps(kat, ensure_ascii=False, indent=1) + '\n', 'ds-blokkok.css': css, 'KATALOGUS.md': '\n'.join(md) + '\n'}

if __name__ == '__main__':
    ki = epit(); hiba = []
    for f, tart in ki.items():
        p = os.path.join(D, f)
        if '--check' in sys.argv:
            if not os.path.exists(p) or open(p).read() != tart: hiba.append(f)
        else:
            open(p, 'w').write(tart)
    if hiba: sys.exit('Elavult, futtasd újra: ' + ', '.join(hiba))
    k = json.loads(ki['katalogus.json'])
    print(f"Web DS katalógus: {len(k['osztalyok'])} osztály, {len(k['valtozok'])} változó" + (' (ellenőrizve)' if '--check' in sys.argv else ''))
