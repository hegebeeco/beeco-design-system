"""Új főoldal (2026-11): a jóváhagyott prototípusból Webflow-jelölés, CSS-embedek és helyi tesztoldal.

Bemenet:  prototipus.html (a Claude-artifact jóváhagyott változata), eszkozok.json (kép → Webflow-médiatár fájl).
Kimenet:  fo.css (olvasható, teljes), embed/fo-N.html (≤ 15 000 karakteres <style> darabok a Webflow HTML Embedekbe),
          szekciok.json (szekciónként egy natív Webflow-jelölés a whtml-építőhöz), teszt.html (helyi próbaoldal).
Futtatás: python3 epit.py
Szabályok:
- minden osztály `fo-` előtagot kap, így nem ütközik a site meglévő stílusaival;
- a hero címe H1, a szekciócímek H2 (a prototípusban H2/H3 volt, mert ott a lap saját címe volt a H1);
- <button> helyett <a href="#" data-fo-gomb> (Webflow-ban nincs natív gombelem; a fo.js ad szerepet és billentyűt);
- <b>/<mark>/<small>/<cite> helyett <strong>/<span class="fo-kiemel|fo-kicsi|fo-ki">;
- a beeco.hu-linkek relatívak és ugyanabban a lapban nyílnak; az áruházgombok közvetlenül az áruházba mutatnak;
- az inline style-ok generált osztályokká válnak (fo-x1, fo-x2…);
- a GYIK nem innen jön: a meglévő natív DS-GYIK szekció marad az oldalon.
"""
import json, os, re

D = os.path.dirname(os.path.abspath(__file__))
S3 = 'https://s3.amazonaws.com/webflow-prod-assets/648ebb1f9ae84f3d530e2f2d/'
CDN = 'https://cdn.prod.website-files.com/648ebb1f9ae84f3d530e2f2d/'
PLAY = 'https://play.google.com/store/apps/details?id=hu.beeco.app'
IOS = 'https://apps.apple.com/hu/app/beeco/id6478549279?l=hu'
E = json.load(open(os.path.join(D, 'eszkozok.json'), encoding='utf-8'))
P = open(os.path.join(D, 'prototipus.html'), encoding='utf-8').read()

# ---------------------------------------------------------------- CSS
def parse(css):
    """Top-level blocks: ('rule', sel, body) | ('at', prelude, children) | ('raw', text)."""
    out, i, n = [], 0, len(css)
    while i < n:
        j = css.find('{', i)
        if j < 0:
            break
        pre = css[i:j].strip()
        depth, k = 1, j + 1
        while depth and k < n:
            if css[k] == '{': depth += 1
            elif css[k] == '}': depth -= 1
            k += 1
        body = css[j + 1:k - 1]
        if pre.startswith('@keyframes'):
            out.append(('raw', pre + '{' + body + '}'))
        elif pre.startswith('@'):
            out.append(('at', pre, parse(body)))
        else:
            out.append(('rule', pre, body))
        i = k
    return out

DROP = re.compile(r'\.(wrap|fej|eszk|eszk-c|hajtas|nav|nav-[\w-]+|nm|nm-[\w-]+|mm-[\w-]+|mobilmenu|navle|ket|panel|lablec|halad|nf|nf-[\w-]+|gyik|gyik-[\w-]+|tovabb-x)(?![\w-])'
                  r'|\.keret\.(telefon|nincs-hajtas)|\[data-nv|^body$|^\.fej')

def sel_tr(sel):
    parts = []
    for s in [x.strip() for x in sel.split(',')]:
        if not s or DROP.search(s):
            continue
        if s == ':root':
            parts.append('.fo'); continue
        if s in ('*', '*::before', '*::after'):
            parts.append('.fo ' + s); continue
        if s == 'button:focus-visible':
            continue
        if s == 'a:focus-visible':
            parts.append('.fo a:focus-visible'); continue
        hero = '.hero' in s
        s = re.sub(r'\.([A-Za-z_][\w-]*)', r'.fo-\1', s)
        s = s.replace('.fo-keret', '.fo')
        s = re.sub(r'button(?=\.fo-)', '', s)
        s = re.sub(r'(?<![\w.#:-])button(?![\w-])', 'a', s)
        s = re.sub(r'(?<![\w.#:-])mark(?![\w-])', '.fo-kiemel', s)
        s = re.sub(r'(?<![\w.#:-])small(?![\w-])', '.fo-kicsi', s)
        s = re.sub(r'(?<![\w.#:-])cite(?![\w-])', '.fo-ki', s)
        s = re.sub(r'(?<![\w.#:-])b(?![\w-])', 'strong', s)
        if hero:
            s = re.sub(r'(?<![\w.#:-])h2(?![\w-])', 'h1', s)
        s = re.sub(r'(?<![\w.#:-])h3(?![\w-])', 'h2', s)
        parts.append(s)
    return ','.join(dict.fromkeys(parts))

TOKENS = ('--bg:var(--_beeco-ds---bc-bg,#FFF8E7);--surface:var(--_beeco-ds---bc-surface,#FFFFFF);--ink:#000;'
          '--soft:var(--_beeco-ds---bc-ink-soft,#505050);--accent:var(--_beeco-ds---bc-accent,#FECF39);'
          '--accent-ink:var(--_beeco-ds---bc-accent-ink,#8A6A00);--zold:#E3ECCD;--vaj:#FEEEBB;--piros:#B3261E;'
          '--display:"Lalezar","Arial Rounded MT Bold",system-ui,sans-serif;--text:"Open Sans","Segoe UI",system-ui,sans-serif;'
          '--ease:cubic-bezier(.23,1,.32,1);color-scheme:light;container-type:inline-size;display:block;'
          'font:400 16px/1.55 var(--text);color:var(--ink);text-align:left')

def css_tr(nodes):
    out = []
    for t in nodes:
        if t[0] == 'raw':
            if not re.match(r'@keyframes (navbe|figyel)\b', t[1]):
                out.append(t[1])
        elif t[0] == 'at':
            inner = css_tr(t[2])
            if inner:
                out.append(t[1] + '{' + inner + '}')
        else:
            if t[1].strip() in ('.keret', '.fej h1', '.fej p') or re.search(r'@keyframes (navbe|figyel)\b', t[1]):
                continue
            s = sel_tr(t[1])
            if not s:
                continue
            body = t[2].strip()
            if s == '.fo':
                body = TOKENS
            out.append(s + '{' + body + '}')
    return '\n'.join(out)

# Low-specificity reset (0,0,2): the site's global h1/h2/p/a rules would otherwise leak in.
ALAP = r'''
html body :where(.fo) :where(h1,h2,h3,p,ul,ol,li,blockquote,figure){margin:0;padding:0;border:0;font:inherit;color:inherit;letter-spacing:normal;text-transform:none;max-width:none}
html body :where(.fo) :where(ul,ol){list-style:none}
html body :where(.fo) :where(a){color:inherit;font-family:inherit;font-weight:inherit;font-size:inherit;text-decoration:none}
html body :where(.fo) :where(img){max-width:100%;border:0}
html body :where(.fo) :where(strong){font-weight:700}
.fo .fo-szk,.fo .fo-bansav,.fo .fo-hero{scroll-margin-top:96px}
.fo a[data-fo-gomb]{cursor:pointer}
'''

# ---------------------------------------------------------------- markup
def kep(name, cel):
    f = E[name]
    return (S3 if cel == 'wf' else CDN) + f

def jeloles(h, cel, stilus):
    h = re.sub(r'<svg class="nyom".*?</svg>\s*', '', h, flags=re.S)
    h = h.replace(' aria-label="Hero előnézet"', ' aria-labelledby="cim"')
    # store buttons: the glyph inside decides where the button goes
    def gomb(m):
        a = m.group(0)
        g, i = 'M22.018' in a, 'M12.152' in a
        href = '/app/letoltes' if (g and i) else (PLAY if g else IOS)
        a = re.sub(r'href="[^"]*"( target="_blank" rel="noopener")?', 'href="%s"%s' % (href, '' if href.startswith('/') else ' target="_blank" rel="noopener"'), a, count=1)
        a = re.sub(r'<svg class="logo"[^>]*><path fill="currentColor" d="M12\.152[^"]*"/></svg>', '<img class="logo" src="%s" alt="">' % kep('glyph-apple', cel), a)
        a = re.sub(r'<svg class="logo"[^>]*><path fill="currentColor" d="M22\.018[^"]*"/></svg>', '<img class="logo" src="%s" alt="">' % kep('glyph-play', cel), a)
        return a
    h = re.sub(r'<a class="gomb[^"]*"[^>]*>.*?</a>', gomb, h, flags=re.S)
    h = re.sub(r'<button type="button"', '<a href="#" data-fo-gomb=""', h).replace('</button>', '</a>')
    for t, c in (('mark', 'kiemel'), ('small', 'kicsi'), ('cite', 'ki')):
        h = re.sub(r'<%s>' % t, '<span class="%s">' % c, h).replace('</%s>' % t, '</span>')
    h = h.replace('<b>', '<strong>').replace('<b ', '<strong ').replace('</b>', '</strong>')
    h = re.sub(r'<h2 id="cim">(.*?)</h2>', r'<h1 id="cim">\1</h1>', h, flags=re.S)
    h = re.sub(r'<h3\b', '<h2', h).replace('</h3>', '</h2>')
    h = re.sub(r'href="https://www\.beeco\.hu(/[^"]*)?"( target="_blank" rel="noopener")?', lambda m: 'href="%s"' % (m.group(1) or '/'), h)
    h = re.sub(r'src="a/([^"]+)"', lambda m: 'src="%s"' % kep(m.group(1), cel), h)
    h = re.sub(r' hidden(?=[ >])', '', h)
    def st(m):
        v = m.group(1).strip().rstrip(';')
        if v not in stilus:
            stilus[v] = 'x%d' % (len(stilus) + 1)
        return 'data-fo-st="%s"' % stilus[v]
    h = re.sub(r'style="([^"]*)"', st, h)
    # merge the generated style class into the element's class list
    def osszevon(m):
        tag = m.group(0)
        s = re.search(r' data-fo-st="([^"]+)"', tag)
        if not s:
            return tag
        tag = tag.replace(s.group(0), '')
        if ' class="' in tag:
            return re.sub(r' class="([^"]*)"', lambda c: ' class="%s %s"' % (c.group(1), s.group(1)), tag, count=1)
        return tag[:-1] + ' class="%s">' % s.group(1)
    h = re.sub(r'<[a-z][^>]*data-fo-st="[^"]+"[^>]*>', osszevon, h)
    h = re.sub(r'class="([^"]*)"', lambda m: 'class="%s"' % ' '.join('fo-' + c for c in m.group(1).split()), h)
    return h

kezd = P.index('<section class="hero"')
veg = P.index('<div class="lablec"')
tart = P[kezd:veg]
tart = re.sub(r'<dialog.*?</dialog>\s*', '', tart, flags=re.S)
tart = re.sub(r'<section class="szk" id="gyik".*?</section>\s*', '', tart, flags=re.S)
blokkok = re.findall(r'(<(section|aside)\b.*?</\2>)', tart, flags=re.S)
nevek = []
for b, _ in blokkok:
    m = re.search(r'id="([^"]+)"', b)
    nevek.append(m.group(1))

stilus_wf, stilus_t = {}, {}
wf = [{'nev': n, 'html': jeloles(b, 'wf', stilus_wf)} for n, (b, _) in zip(nevek, blokkok)]
teszt = [jeloles(b, 'teszt', stilus_t) for b, _ in blokkok]
assert stilus_wf == stilus_t
# the hero phone image loads first: eager + high priority
for lst in (wf,):
    lst[0]['html'] = lst[0]['html'].replace('<img class="fo-be" src=', '<img class="fo-be" loading="eager" fetchpriority="high" src=', 1)
teszt[0] = teszt[0].replace('<img class="fo-be" src=', '<img class="fo-be" loading="eager" fetchpriority="high" src=', 1)

css_src = '\n'.join(re.findall(r'<style>(.*?)</style>', P, flags=re.S))
css_src = re.sub(r'/\*.*?\*/', '', css_src, flags=re.S)
css = ALAP + css_tr(parse(css_src))
css += '\n' + '\n'.join('.fo .fo-%s{%s}' % (k, v) for v, k in stilus_wf.items())
css += '\n' + re.sub(r'/\*.*?\*/', '', open(os.path.join(D, 'fo-extra.css'), encoding='utf-8').read(), flags=re.S)
open(os.path.join(D, 'fo.css'), 'w', encoding='utf-8').write('/* GENERÁLT – forrás: prototipus.html + fo-extra.css; építés: python3 epit.py */\n' + css)

# minify + split on top-level blocks into ≤ 15 000 character embeds
mini = re.sub(r'\s*\n\s*', '', css)
mini = re.sub(r'\s*([{};,>])\s*', r'\1', mini).replace(';}', '}')
bl, depth, k0 = [], 0, 0
for i, c in enumerate(mini):
    if c == '{': depth += 1
    elif c == '}':
        depth -= 1
        if depth == 0:
            bl.append(mini[k0:i + 1]); k0 = i + 1
assert depth == 0 and k0 == len(mini), 'kiegyensúlyozatlan CSS'
darab, cur = [], ''
for b in bl:
    if len(cur) + len(b) > 14900:
        darab.append(cur); cur = ''
    cur += b
darab.append(cur)
os.makedirs(os.path.join(D, 'embed'), exist_ok=True)
for f in os.listdir(os.path.join(D, 'embed')):
    os.remove(os.path.join(D, 'embed', f))
for i, c in enumerate(darab):
    open(os.path.join(D, 'embed', 'fo-%d.html' % (i + 1)), 'w', encoding='utf-8').write('<style>' + c + '</style>')
json.dump(wf, open(os.path.join(D, 'szekciok.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# local test page: the page's real header/footer are replaced by simple stand-ins; GYIK is a placeholder
fej = ('<!doctype html><html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
       '<title>Főoldal 2026-11 – helyi teszt</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lalezar&family=Open+Sans:wght@400;600;700&display=swap">'
       '<style>body{margin:0;background:#FFF8E7;font-family:"Open Sans",sans-serif}.menu{position:fixed;top:0;left:0;right:0;z-index:1000;background:#fff;border-bottom:2px solid #000}'
       '.menu-sav{display:flex;align-items:center;gap:14px;max-width:1320px;margin:0 auto;min-height:72px;padding:10px 24px}.menu-logo-kep{height:34px}'
       '.button_main{margin-left:auto;display:flex;align-items:center;min-height:44px;padding:0 14px;background:#FECF39;color:#000;border:2px solid #000;border-radius:4px;box-shadow:4px 4px 0 #000;font:400 22px/1 Lalezar,sans-serif;text-decoration:none}'
       '.main_body{margin-top:70px}.gyik-hely{padding:60px 24px;text-align:center;background:#fff;font-weight:700}</style>'
       + ''.join(open(os.path.join(D, 'embed', 'fo-%d.html' % (i + 1)), encoding='utf-8').read() for i in range(len(darab))) +
       '</head><body class="main_body"><div class="menu"><div class="menu-sav"><a href="/" class="menu-logo"><img class="menu-logo-kep" src="%s655512ff22c587d4c7112378_linear%%20logo.svg" alt="beeco főoldal"></a>'
       '<a href="/app/letoltes" class="button_main w-button">Töltsd le!</a></div></div><div class="fo">' % CDN)
gyik_i = nevek.index('partnerek') + 1
torzs = ''.join(teszt[:gyik_i]) + '<section id="gyik" class="gyik-hely">[ide jön a meglévő natív GYIK szekció]</section>' + ''.join(teszt[gyik_i:])
open(os.path.join(D, 'teszt.html'), 'w', encoding='utf-8').write(fej + torzs + '</div><script src="fo.js"></script></body></html>')
print('szekciók:', nevek)
print('css', len(mini), 'embed-darabok', [len(x) for x in darab], 'stílusosztályok', len(stilus_wf))
