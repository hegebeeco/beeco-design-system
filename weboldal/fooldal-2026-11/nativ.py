"""A főoldal (.fo) egyszerű, egyosztályos CSS-szabályait natív Webflow-stílussá alakítja (Javaslat 43, 10. elem).
Bemenet: fo.css (az epit.py kimenete, a natívra vitt részek kivétele ELŐTT: fo-teljes.css), a DOM osztály-statisztikája.
Kimenet: nativ.json – {"stilusok":[{"osztaly","pseudo","tulajdonsagok":{...}}], "kivett":[[szelektor, tulajdonság], ...]}.
Az epit.py a "kivett" párokat kihagyja a beágyazott CSS-ből, így a Designerben állított érték nem íródik felül."""
import re, json, sys, os
D = os.path.dirname(os.path.abspath(__file__))

def szabalyok(s, ctx=()):
    i, n = 0, len(s)
    while i < n:
        j = s.find('{', i)
        if j < 0: break
        sel = s[i:j].strip(); d = 1; k = j + 1
        while d:
            d += {'{': 1, '}': -1}.get(s[k], 0); k += 1
        body = s[j + 1:k - 1]
        if sel.startswith('@'):
            if not sel.startswith('@keyframes'): yield from szabalyok(body, ctx + (sel,))
        else:
            yield ctx, sel, body
        i = k

def deklaraciok(body):
    out, buf, d = [], '', 0
    for ch in body + ';':
        if ch == '(': d += 1
        if ch == ')': d -= 1
        if ch == ';' and d == 0:
            if ':' in buf: k, v = buf.split(':', 1); out.append((k.strip(), v.strip()))
            buf = ''
        else: buf += ch
    return out

def reszek(v):
    out, buf, d = [], '', 0
    for ch in v:
        if ch == '(': d += 1
        if ch == ')': d -= 1
        if ch == ' ' and d == 0:
            if buf: out.append(buf); buf = ''
        else: buf += ch
    if buf: out.append(buf)
    return out

def negy(v):
    p = reszek(v)
    if len(p) == 1: p = p * 4
    elif len(p) == 2: p = [p[0], p[1], p[0], p[1]]
    elif len(p) == 3: p = [p[0], p[1], p[2], p[1]]
    return p if len(p) == 4 else None

OLDAL = ['top', 'right', 'bottom', 'left']
KIHAGY = {'fo-nezo', 'fo-nezo-kep', 'fo-nezo-lab'}  # csak a fo.js hozza létre, a Webflow-ban nincs ilyen osztály
TILT = re.compile(r'^(animation|transition|will-change|container|--|translate$|rotate$|scale$|list-style|content$|-webkit)')

def kibont(k, v):
    """(kulcs, érték) → longhand dict vagy None (nem natívra vihető)."""
    if '!important' in v or TILT.match(k): return None
    if k in ('padding', 'margin'):
        p = negy(v); return p and {f'{k}-{o}': x for o, x in zip(OLDAL, p)}
    if k == 'inset':
        p = negy(v); return p and dict(zip(OLDAL, p))
    if k == 'border-radius':
        if '/' in v: return None
        p = negy(v); return p and dict(zip(['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'], p))
    if k in ('border', 'border-top', 'border-right', 'border-bottom', 'border-left'):
        if v in ('0', 'none'):
            ol = OLDAL if k == 'border' else [k.split('-')[1]]
            return {f'border-{o}-style': 'none' for o in ol}
        p = reszek(v); w = s = c = None
        for x in p:
            if re.match(r'^[\d.]+(px|em|rem)?$', x): w = x
            elif x in ('solid', 'dashed', 'dotted', 'none'): s = x
            else: c = x
        ol = OLDAL if k == 'border' else [k.split('-')[1]]
        r = {}
        for o in ol:
            if w: r[f'border-{o}-width'] = w
            if s: r[f'border-{o}-style'] = s
            if c: r[f'border-{o}-color'] = c
        return r
    if k == 'gap':
        p = reszek(v); return {'row-gap': p[0], 'column-gap': p[1] if len(p) > 1 else p[0]}
    if k == 'place-items':
        p = reszek(v); return {'align-items': p[0], 'justify-items': p[1] if len(p) > 1 else p[0]}
    if k == 'overflow':
        p = reszek(v); return {'overflow-x': p[0], 'overflow-y': p[1] if len(p) > 1 else p[0]}
    if k == 'flex':
        m = {'none': ('0', '0', 'auto'), 'auto': ('1', '1', 'auto'), '1': ('1', '1', '0%')}
        p = m.get(v) or tuple(reszek(v))
        if len(p) == 3: return {'flex-grow': p[0], 'flex-shrink': p[1], 'flex-basis': p[2]}
        if len(p) == 2: return {'flex-grow': p[0], 'flex-shrink': p[1]}
        return None
    if k == 'font':
        m = re.match(r'^(?:(italic|normal)\s+)?(\d{3}|normal|bold)\s+([\d.]+(?:px|em|rem))(?:/([\d.]+(?:px|em|rem)?))?\s+(.+)$', v)
        if not m: return None
        r = {'font-weight': m.group(2), 'font-size': m.group(3), 'font-family': m.group(5)}
        if m.group(1): r['font-style'] = m.group(1)
        if m.group(4): r['line-height'] = m.group(4)
        return r
    if k == 'background':
        if re.match(r'^(#[0-9a-fA-F]{3,8}|transparent|none|var\([^)]*\)|rgba?\([^)]*\)|#fff|#000)$', v):
            return {'background-color': 'transparent' if v == 'none' else v}
        return None
    if k == 'text-decoration':
        return {'text-decoration-line': v} if v in ('none', 'underline') else None
    return {k: v}

def main():
    css = open(os.path.join(D, 'fo-teljes.css'), encoding='utf-8').read()
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    stat = json.load(open(sys.argv[1]))
    stilusok, kivett = {}, []
    # a sorrend számít: ha egy töréspontos (@container/@media) szabály KORÁBBAN állítja ugyanazt a tulajdonság-családot
    # ugyanarra a kijelölőre, a régi CSS-ben a későbbi alapszabály felülírta. Natívan (a site CSS-ben, előrébb) ez megfordulna,
    # ezért ezek a deklarációk az embedben is maradnak (megtartott = natív ÉS embed), a kinézet változatlan.
    def csalad(k):
        k = {'row-gap': 'gap', 'column-gap': 'gap', 'top': 'inset', 'right': 'inset', 'bottom': 'inset', 'left': 'inset'}.get(k, k)
        return k.split('-')[0] if k.split('-')[0] in ('padding', 'margin', 'border', 'grid', 'font', 'flex', 'overflow', 'gap', 'inset') else k
    korabbi = {}
    for ctx, sel, body in szabalyok(css):
        if ctx:
            for k, v in deklaraciok(body): korabbi.setdefault(sel, set()).add(csalad(k))
        else:
            korabbi.setdefault(('fent', sel), set())
            for k, v in deklaraciok(body):
                if csalad(k) in korabbi.get(sel, set()): korabbi[('fent', sel)].add(k)
    megtartott = []
    for ctx, sel, body in szabalyok(css):
        if ctx: continue
        if ',' in sel: continue
        m = re.fullmatch(r'\.(fo-[\w-]+)(::before|::after)?', sel)
        if not m: continue
        osz, ps = m.group(1), (m.group(2) or '').strip(':')
        if osz in KIHAGY: continue
        st = stat.get(osz)
        if not st or st['kombo'] or not st['elso']: continue
        kulcs = (osz, ps)
        for k, v in deklaraciok(body):
            r = kibont(k, v)
            if not r: continue
            stilusok.setdefault(kulcs, {}).update(r)
            if k in korabbi.get(('fent', sel), set()): megtartott.append([sel, k])
            else: kivett.append([sel, k])
    out = {'stilusok': [{'osztaly': o, 'pseudo': p, 'tulajdonsagok': t} for (o, p), t in stilusok.items()], 'kivett': kivett, 'megtartott': megtartott}
    json.dump(out, open(os.path.join(D, 'nativ.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(out['stilusok']), 'stílus,', len(kivett), 'deklaráció natívra,', len(megtartott), 'az embedben is marad:', megtartott)

if __name__ == '__main__':
    main()
