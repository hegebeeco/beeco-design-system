#!/usr/bin/env python3
"""Komponens-katalógus generálása a tényleges exportokból → docs/komponens-katalogus.md (python3 tools/katalogus.py)."""
import os, re
ROOT = os.path.join(os.path.dirname(__file__), '..')
CSOM = [('01 – Űrlap (alap)', ['field', 'inputs', 'pickers', 'form']), ('02 – Adat és grafikon', ['adat']), ('03 – Rétegek és navigáció', ['reteg']),
        ('04 – Média és speciális', ['media']), ('05 – Méhecske, mozgás, szöveg', ['meh']), ('06a – Kiegészítők', ['kieg']),
        ('06b – Helyválasztó, sorsolás, videó', ['kieg2']), ('06c – Oldalsablonok', ['sablon'])]
idx = open(os.path.join(ROOT, 'react/src/index.ts')).read()

def nevek(text):
    for m in re.finditer(r"export\s*\{([^}]*)\}", text):
        for n in m.group(1).split(','):
            n = n.strip()
            if n and not n.startswith('type '):
                yield n.split(' as ')[-1].strip()

L = ['# Komponens-katalógus', '', '*GENERÁLT (`tools/katalogus.py`) a tényleges exportokból. Szabályok: `docs/komponensek.md`; élő tesztlapok: https://hegebeeco.github.io/beeco-design-system/*', '']
for cim, dirs in CSOM:
    src = '\n'.join(l for l in idx.split('\n') if any(f"'./{d}/" in l for d in dirs)) if dirs[0] == 'field' else open(os.path.join(ROOT, f'react/src/{dirs[0]}/index.ts')).read()
    k = {'Komponensek': [], 'Hookok': [], 'Állandók': [], 'Segédek': []}
    for n in nevek(src):
        k['Hookok' if n.startswith('use') else 'Állandók' if n.isupper() or re.fullmatch(r'[A-Z0-9_]+', n) else 'Komponensek' if n[0].isupper() else 'Segédek'].append(n)
    L.append(f'## {cim}')
    L += [f'**{c}:** ' + ', '.join(sorted(set(v))) + '\n' for c, v in k.items() if v]
lapok = sorted(f[:-5] for f in os.listdir(os.path.join(ROOT, 'termek/tesztlapok')) if f.endswith('.html'))
L.append(f'## Tesztlapok ({len(lapok)})\n' + ', '.join(f'`{n}`' for n in lapok))
open(os.path.join(ROOT, 'docs/komponens-katalogus.md'), 'w').write('\n'.join(L) + '\n')
print('írva: docs/komponens-katalogus.md')
