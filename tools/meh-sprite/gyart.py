#!/usr/bin/env python3
"""
Méhecske-sprite gyártó (Javaslat 05 + Kristóf döntése, 2026-10-01: kódból a meglévő méhecskéből).
A beeco méhecskét NEM rajzoljuk újra: a meglévő képet szárnyra és testre bontjuk (szín alapján),
és a két réteget mozgatjuk a tools/meh-sprite/mozgasok.json kulcsképkockái szerint.

Kimenet szereplőnként (dist/meh/<szereplo>/):
  sprite@1x.webp, @2x, @3x  vízszintes sprite-lap (web: CSS steps(); Flutter: sprite-lap)
  anim.webp                 animált WebP (egyszerű beillesztéshez)
  lottie.json               Lottie (Flutter 'lottie' csomag, web lottie-player) – test + szárny külön rétegen, éles bármekkora méretben
  anim.json                 adatlap: fps, képkockák, méretek, ismétlés (végtelen mozgás nincs)
Használat:  python3 tools/meh-sprite/gyart.py [szereplo…] [--nezo]   (--nezo: áttekintő kép a dist/meh/nezo.png-be)
Függőség: Pillow + numpy.
"""
import base64, io, json, math, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
CFG = json.load(open(os.path.join(ROOT, 'tools/meh-sprite/mozgasok.json'), encoding='utf-8'))
OUT = os.path.join(ROOT, 'dist/meh')
C = CFG['canvas']


def komponensek(mask, minimum=150):
    """Összefüggő foltok (4-szomszéd) – a túl kicsi foltokat (csáp-pötty, korona-kő) eldobjuk."""
    h, w = mask.shape
    seen = np.zeros_like(mask, dtype=bool)
    out = np.zeros_like(mask, dtype=bool)
    for y0, x0 in zip(*np.nonzero(mask)):
        if seen[y0, x0]:
            continue
        stack, pix = [(y0, x0)], []
        seen[y0, x0] = True
        while stack:
            y, x = stack.pop(); pix.append((y, x))
            for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True; stack.append((ny, nx))
        if len(pix) >= minimum:
            ys, xs = zip(*pix); out[list(ys), list(xs)] = True
    return out


def szetszed(kep):
    """Szárny (világoskék + a benne lévő fehér fénycsík) és test (minden más) szétválasztása."""
    im = Image.open(os.path.join(ROOT, f'web/assets/brand/{kep}.webp')).convert('RGBA')
    a = np.array(im).astype(int)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    # kék a színárnyalat szerint (175–215°), halványan is; a lila „zzz” (≈240°) és a fehér szem kimarad
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    sat = (mx - mn) / np.maximum(mx, 1)
    hue = np.degrees(np.arctan2(np.sqrt(3) * (g - b), 2 * r - g - b)) % 360
    kek = (al > 10) & (hue > 175) & (hue < 215) & (sat > 0.06) & (mx > 150)
    kek = komponensek(kek)
    # a szárny „burka”: a kék foltok sorai között a két szél közti fehér a fénycsík (a szem és a csáp kimarad)
    feher = (al > 10) & (r > 215) & (g > 215) & (b > 215)
    burok = np.zeros_like(kek)
    for y in np.unique(np.nonzero(kek)[0]):
        xs = np.nonzero(kek[y])[0]; burok[y, xs.min():xs.max() + 1] = True
    szarny = kek | (feher & burok)
    test, sz = a.copy(), a.copy()
    test[szarny] = 0; sz[~szarny] = 0
    ys, xs = np.nonzero(szarny); ty, tx = np.nonzero(al > 10)
    return {
        'kep': im,
        'test': Image.fromarray(test.astype('uint8')),
        'szarny': Image.fromarray(sz.astype('uint8')),
        'szarny_tengely': ((xs.min() + xs.max()) / 2, float(ys.max())),   # a szárny töve: alul középen
        'test_tengely': ((tx.min() + tx.max()) / 2, float(ty.max())),      # a test talppontja
        # egységes méret: minden méhecske ugyanakkora keretbe kerül (a források 175–360 px szélesek)
        'meret': min(CFG['cel_szelesseg'] / (tx.max() - tx.min() + 1), CFG['cel_magassag'] / (ty.max() - ty.min() + 1)),
    }


def ease(k):  # simán indul és áll meg
    return 0.5 - math.cos(math.pi * k) / 2


def ertek(kulcs, t, nev, alap):
    pts = [(k['t'], k.get(nev, alap)) for k in kulcs]
    for (t0, v0), (t1, v1) in zip(pts, pts[1:]):
        if t0 <= t <= t1:
            return v0 + (v1 - v0) * ease((t - t0) / (t1 - t0 or 1))
    return pts[-1][1]


def allapot(sz, i):
    t = i / sz['frames']
    k = sz['kulcs']
    return {n: ertek(k, t, n, d) for n, d in (('dx', 0), ('dy', 0), ('r', 0), ('sx', 1), ('sy', 1), ('f', 1))}


def matrix(p, a, s, r):
    """Lottie-féle transzformáció: p eltolás · forgatás · nyújtás · (−a) horgony."""
    c, si = math.cos(math.radians(r)), math.sin(math.radians(r))
    T = np.array([[1, 0, p[0]], [0, 1, p[1]], [0, 0, 1]], float)
    R = np.array([[c, -si, 0], [si, c, 0], [0, 0, 1]], float)
    S = np.array([[s[0], 0, 0], [0, s[1], 0], [0, 0, 1]], float)
    A = np.array([[1, 0, -a[0]], [0, 1, -a[1]], [0, 0, 1]], float)
    return T @ R @ S @ A


def ráfest(vaszon, kep, M):
    inv = np.linalg.inv(M)
    vaszon.alpha_composite(kep.transform(vaszon.size, Image.AFFINE, tuple(inv[:2].ravel()), resample=Image.BICUBIC))


def transzformok(d, st):
    tx, ty = d['test_tengely']
    talp = (C / 2 + st['dx'], C - 24 + st['dy'])
    k = d['meret']
    Mt = matrix(talp, (tx, ty), (st['sx'] * k, st['sy'] * k), st['r'])
    sx, sy = d['szarny_tengely']
    Ms = matrix((sx, sy), (sx, sy), (1, st['f']), 0)   # a szárny a test rétegén belül, a tövénél csap
    return talp, Mt, Ms


def kepkocka(d, st):
    v = Image.new('RGBA', (C, C), (0, 0, 0, 0))
    _, Mt, Ms = transzformok(d, st)
    ráfest(v, d['szarny'], Mt @ Ms)   # a szárny a test MÖGÖTT van (a csáp elöl)
    ráfest(v, d['test'], Mt)
    return v


def png64(img):
    # a Lottie-be ágyazott réteg: 128 színre csökkentett PNG (a méhecske lapos színekből áll, így nem látszik)
    b = io.BytesIO(); img.quantize(128, method=Image.Quantize.FASTOCTREE).save(b, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()


def lottie(nev, d, sz):
    n, w, h = sz['frames'], d['kep'].width, d['kep'].height
    def kf(vals):
        return {'a': 1, 'k': [{'t': i, 's': v, 'i': {'x': [1], 'y': [1]}, 'o': {'x': [0], 'y': [0]}} for i, v in enumerate(vals)] + [{'t': n, 's': vals[0]}]}
    sts = [allapot(sz, i) for i in range(n)]
    tx, ty = d['test_tengely']; sx, sy = d['szarny_tengely']
    test = {'ty': 2, 'ind': 1, 'nm': 'test', 'refId': 'test', 'ip': 0, 'op': n, 'st': 0, 'ks': {
        'a': {'a': 0, 'k': [tx, ty, 0]}, 'o': {'a': 0, 'k': 100},
        'p': kf([[C / 2 + s['dx'], C - 24 + s['dy'], 0] for s in sts]),
        's': kf([[s['sx'] * 100 * d['meret'], s['sy'] * 100 * d['meret'], 100] for s in sts]), 'r': kf([[s['r']] for s in sts])}}
    szarny = {'ty': 2, 'ind': 2, 'parent': 1, 'nm': 'szárny', 'refId': 'szarny', 'ip': 0, 'op': n, 'st': 0, 'ks': {
        'a': {'a': 0, 'k': [sx, sy, 0]}, 'p': {'a': 0, 'k': [sx, sy, 0]}, 'o': {'a': 0, 'k': 100}, 'r': {'a': 0, 'k': 0},
        's': kf([[100, s['f'] * 100, 100] for s in sts])}}
    return {'v': '5.7.0', 'fr': sz['fps'], 'ip': 0, 'op': n, 'w': C, 'h': C, 'nm': f'beeco méhecske – {nev}', 'ddd': 0,
            'assets': [{'id': 'test', 'w': w, 'h': h, 'u': '', 'p': png64(d['test']), 'e': 1},
                       {'id': 'szarny', 'w': w, 'h': h, 'u': '', 'p': png64(d['szarny']), 'e': 1}],
            'layers': [test, szarny]}   # az első réteg van felül: a test a szárny előtt


def gyart(nev):
    sz = CFG['szereplok'][nev]
    d = szetszed(sz['kep'])
    kockak = [kepkocka(d, allapot(sz, i)) for i in range(sz['frames'])]
    cel = os.path.join(OUT, nev); os.makedirs(cel, exist_ok=True)
    for jel, m in CFG['kimenet']['meretek'].items():
        lap = Image.new('RGBA', (m * len(kockak), m), (0, 0, 0, 0))
        for i, k in enumerate(kockak):
            lap.paste(k.resize((m, m), Image.LANCZOS), (i * m, 0))
        lap.save(os.path.join(cel, f'sprite@{jel}.webp'), 'WEBP', quality=86, method=6)   # WebP: a böngésző és a Flutter is kezeli
    wm = CFG['kimenet']['webp']
    ws = [k.resize((wm, wm), Image.LANCZOS) for k in kockak]
    ws[0].save(os.path.join(cel, 'anim.webp'), save_all=True, append_images=ws[1:], duration=round(1000 / sz['fps']), loop=sz['ismetles'], lossless=False, quality=80, method=6)
    json.dump(lottie(nev, d, sz), open(os.path.join(cel, 'lottie.json'), 'w'), separators=(',', ':'))
    json.dump({'szereplo': nev, 'mozgas': sz['mozgas'], 'kepkockak': sz['frames'], 'fps': sz['fps'], 'ismetles': sz['ismetles'],
               'hossz_ms': round(1000 * sz['frames'] / sz['fps']), 'meretek': CFG['kimenet']['meretek'], 'forras': sz['kep'] + '.webp'},
              open(os.path.join(cel, 'anim.json'), 'w'), ensure_ascii=False, indent=1)
    return kockak


if __name__ == '__main__':
    nevek = [a for a in sys.argv[1:] if not a.startswith('--')] or list(CFG['szereplok'])
    sorok = []
    for n in nevek:
        k = gyart(n); sorok.append(k); print(f'kész: {n} ({len(k)} képkocka)')
    import runpy; runpy.run_path(os.path.join(ROOT, 'tools/meh-sprite/css.py'))
    if '--nezo' in sys.argv:
        m, cols = 160, max(len(k) for k in sorok)
        nezo = Image.new('RGBA', (m * cols, m * len(sorok)), (255, 248, 231, 255))
        for y, k in enumerate(sorok):
            for x, f in enumerate(k):
                nezo.alpha_composite(f.resize((m, m), Image.LANCZOS), (x * m, y * m))
        nezo.save(os.path.join(OUT, 'nezo.png')); print('nézőke: dist/meh/nezo.png')
