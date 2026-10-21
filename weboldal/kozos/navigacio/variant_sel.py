"""A Webflow komponens-variáns osztályait hozzáadja az .bn-egyszeru / .bl-egyszeru szabályokhoz.
A Webflow a variánsstílust :where()-rel írja (1 osztálynyi súly), így a később betöltött embed-CSS
felülírná; ezért az embed maga is célozza a variáns osztályát (2 osztálynyi súly)."""
import re, sys
VAR = {'bn': 'w-variant-2de06495-af98-293c-85f1-467da7aba6c8',   # NAVBAR_OT_AJTO / Egyszerű
       'bl': 'w-variant-4ef4336d-622f-a37a-610a-f99c8754e141'}   # LABLEC_ZARO / Egyszerű
def bovit(m):
    sels = m.group(1).split(',')
    uj = []
    for s in sels:
        uj.append(s)
        t = s.strip()
        r = re.match(r'^\.(bn|bl)\.\1-egyszeru(?: (\.\1-[\w-]+))?(.*)$', t)
        if r and VAR[r.group(1)] not in m.group(1):
            p, el, rest = r.groups()
            uj.append(f'{el or "."+p}.{VAR[p]}{rest}')
    return ','.join(uj) + '{'
for f in sys.argv[1:]:
    s = open(f).read()
    s2 = re.sub(r'([^{}]*\.(?:bn|bl)\.(?:bn|bl)-egyszeru[^{}]*)\{', bovit, s)
    open(f, 'w').write(s2)
    print(f, s.count('egyszeru'), '->', s2.count('w-variant-'))
