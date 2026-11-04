"""Navigation analysis for the weboldal-kapu: click depth, inbound links, orphans, visitor journeys (shortest paths)
and the button/link rules (hero and section buttons, content and outbound links, repeated links, broken/redirect targets, menu size).
Usage: python3 nav-analyze.py nav-nyers.json [--out nav-adat.json] [--utak ../reference/nav-utak.json]
The thresholds are documented in reference/pontozas.md (Navigáció)."""
import argparse, json, collections, re
from pathlib import Path

ap = argparse.ArgumentParser(); ap.add_argument('raw'); ap.add_argument('--out', default='nav-adat.json')
ap.add_argument('--utak', default=str(Path(__file__).resolve().parent.parent / 'reference' / 'nav-utak.json'))
ARGS = ap.parse_args()
RAW = json.load(open(ARGS.raw))['pages']
GROUP_LABEL = {
    '': 'Fő oldalak', 'szolgaltatas': 'Cégeknek és településeknek', 'kampanyok': 'Kampányok', 'beecopedia': 'beecopedia',
    'nyeremenyjatek': 'Nyereményjátékok', 'online-okoiranytu': 'Ökoiránytű', 'partnerek': 'Partnerek', 'szezonalis-novenyek': 'Szezonális növények',
    'blogcikkek': 'Blogcikkek', 'greenfluencers': 'GreenFluencers (régi címek)', 'okos-pont-kategoria': 'Térkép-kategóriák', 'receptek': 'Receptek',
    'hulladekok': 'Hulladék kisokos', 'product': 'beebolt termékek', 'zold-terkep': 'Zöld helyszínek', 'szolgaltatasok': 'Partneri szolgáltatások',
    'category': 'beebolt kategóriák', 'online-kategoria': 'Ökoiránytű-kategóriák', 'alkategoria': 'Térkép-alkategóriák', 'honapok': 'Hónapok',
    'csapattagok': 'Csapattagok', 'onkentes-feladat': 'Önkéntes feladatok', 'hashtags': 'Hashtagek', 'blog-kategoria': 'Blogkategóriák', 'sku': 'Termékváltozatok', 'en': 'English',
}
SYSTEM = {'/401', '/404', '/access-denied', '/checkout', '/order-confirmation', '/paypal-checkout', '/search', '/user-account', '/log-in', '/sign-up', '/reset-password', '/update-password'}
STATIC_GROUPS = {'', 'szolgaltatas', 'kampanyok', 'beecopedia', 'nyeremenyjatek', 'en'}


def group_of(p):
    seg = p.strip('/').split('/')
    if p == '/' or len(seg) == 1: return ''
    return seg[0]


pages = {p: v for p, v in RAW.items() if v.get('status') == 200 and p not in SYSTEM}
redirect = {p: v['final'] for p, v in pages.items() if v.get('final') and v['final'] != p}
edges = collections.defaultdict(list)  # from -> [(to, area)]
inbound = collections.defaultdict(lambda: collections.Counter())
for p, v in pages.items():
    if p in redirect: continue
    seen = set()
    for l in v['links']:
        t = redirect.get(l['to'], l['to'])
        if t not in pages or t == p or (t, l['area']) in seen: continue
        seen.add((t, l['area'])); edges[p].append((t, l['area'])); inbound[t][l['area']] += 1


def bfs(allowed):
    depth, parent = {'/': 0}, {'/': None}
    q = collections.deque(['/'])
    while q:
        u = q.popleft()
        for t, a in sorted(edges[u], key=lambda x: {'tartalom': 0, 'menu': 1, 'lablec': 2}[x[1]]):
            if a in allowed and t not in depth:
                depth[t] = depth[u] + 1; parent[t] = (u, a); q.append(t)
    return depth, parent


depth_all, parent_all = bfs({'menu', 'lablec', 'tartalom'})
depth_content, _ = bfs({'tartalom'})


def path_to(t):
    if t not in parent_all: return None
    out = []
    while parent_all.get(t):
        u, a = parent_all[t]; out.append({'to': t, 'via': a}); t = u
    return list(reversed(out))


def short(p):
    v = pages.get(p, {}); t = (v.get('h1') or v.get('title') or p).strip()
    t = re.sub(r'\s*[|–-]\s*beeco\s*$', '', t)
    return t[:60]


nodes = []
for p in sorted(pages):
    if p in redirect: continue
    g = group_of(p)
    nodes.append({'p': p, 'g': g, 'gl': GROUP_LABEL.get(g, g), 'static': g in STATIC_GROUPS, 't': short(p),
                  'd': depth_all.get(p), 'dc': depth_content.get(p), 'in': dict(inbound[p]), 'out': len(edges[p]),
                  'path': [{'to': s['to'], 'via': s['via'], 't': short(s['to'])} for s in (path_to(p) or [])]})

JOURNEYS_OLD = [
    ('Magánszemély', 'Le szeretném tölteni az appot', '/letoltes'),
    ('Magánszemély', 'Hova dobjam a PET-palackot?', '/hulladekok/pet-palack'),
    ('Magánszemély', 'Kuponokat keresek ökos boltokhoz', '/kuponok'),
    ('Magánszemély', 'Zöld programot keresek a közelben', '/zold-esemenynaptar'),
    ('Magánszemély', 'Szezonális receptet keresek', '/receptek/almakompot'),
    ('Önkéntes', 'Csatlakoznék a csapathoz', '/csatlakozz'),
    ('HR-vezető', 'Munkahelyi zöld programot keresek', '/szolgaltatas/beeco-at-work'),
    ('Cégvezető', 'Céges csapatnapot szerveznék', '/szolgaltatas/zold-esemeny-szervezes'),
    ('Polgármester', 'Lakossági faöntözést indítanék', '/szolgaltatas/onkormanyzatoknak'),
    ('Zöld vállalkozás', 'Felkerülnék a zöld térképre', '/szolgaltatas/partner'),
    ('Újságíró', 'Kapcsolatot keresek', '/kapcsolat'),
]
JOURNEYS = [(u['who'], u['goal'], u['target']) for u in json.load(open(ARGS.utak))['utak']]
journeys = []
for who, goal, t in JOURNEYS:
    pth = path_to(t)
    journeys.append({'who': who, 'goal': goal, 'target': t, 'tt': short(t), 'clicks': len(pth) if pth is not None else None,
                     'path': [{'to': s['to'], 'via': s['via'], 't': short(s['to'])} for s in (pth or [])]})

reach = [n for n in nodes if n['d'] is not None]
static = [n for n in nodes if n['static']]
orphans = [n for n in nodes if not n['in']]
only_menu = [n for n in static if n['in'] and not n['in'].get('tartalom') and n['p'] != '/']
dist = collections.Counter(n['d'] if n['d'] is not None else 'x' for n in nodes)
groups = collections.defaultdict(list)
for n in nodes: groups[n['g']].append(n)
gsum = []
for g, ns in groups.items():
    ds = [n['d'] for n in ns if n['d'] is not None]
    gsum.append({'g': g, 'gl': GROUP_LABEL.get(g, g), 'n': len(ns), 'static': g in STATIC_GROUPS, 'dmin': min(ds) if ds else None, 'dmax': max(ds) if ds else None,
                 'davg': round(sum(ds) / len(ds), 1) if ds else None, 'unreached': len(ns) - len(ds), 'orphans': sum(1 for n in ns if not n['in'])})
gsum.sort(key=lambda x: (not x['static'], x['dmin'] if x['dmin'] is not None else 9, -x['n']))

within3 = round(100 * sum(1 for n in reach if n['d'] <= 3) / len(nodes))
static2 = round(100 * sum(1 for n in static if n['d'] is not None and n['d'] <= 2) / max(1, len(static)))
jok = sum(1 for j in journeys if j['clicks'] is not None and j['clicks'] <= 2)
score = round(0.35 * within3 + 0.25 * static2 + 0.25 * (100 * jok / len(journeys)) + 0.15 * (100 - min(100, 100 * len(orphans) / len(nodes) * 4)))
summary = {'pages': len(nodes), 'redirects': len(redirect), 'reached': len(reach), 'within3': within3, 'static2': static2,
           'avg': round(sum(n['d'] for n in reach) / len(reach), 2), 'max': max(n['d'] for n in reach), 'orphans': len(orphans),
           'onlyMenu': len(only_menu), 'dist': {str(k): v for k, v in sorted(dist.items(), key=lambda x: str(x[0]))}, 'journeysOk': jok, 'journeys': len(journeys), 'score': score,
           'menuItems': len({t for t, a in edges['/'] if a == 'menu'})}
# ---------- gomb- és link-szabályok (bevált gyakorlatok; határértékek: reference/pontozas.md, Navigáció) ----------
LEGAL = re.compile(r'^/(privacy-policy|impresszum|aszf|adatkezeles)')
STORE = re.compile(r'(play\.google\.com|apps\.apple\.com)$')
def is_cms_item(t):
    g = group_of(t); return g not in STATIC_GROUPS and t.count('/') >= 2
rules, rule_rows = {}, []
for p, v in pages.items():
    if p in redirect: continue
    A = [a for a in v.get('anchors', []) if a['area'] == 'tartalom' and not (a['self'] and a['hash'] and not a['btn'])]
    R = []
    def rule(sev, key, title, evidence, fix, pont): R.append({'sev': sev, 'key': key, 'title': title, 'evidence': evidence, 'fix': fix, 'pont': pont})
    sec0 = [a for a in A if a['sec'] == 0]
    real_hero = 0 < len(sec0) <= 15  # külön, rövid első szekció; ha az egész oldal egy szekció, a látható hajtást a renderelt mérés (lib-ux) nézi
    hero = [a for a in sec0 if a['btn']] if real_hero else []
    secs = collections.Counter(a['sec'] for a in A if a['btn'] and a['sec'] > 0)
    content = [a for a in A if not a['self']]
    internal = [a for a in content if a['to']]
    ext = [a for a in content if a['ext'] and not STORE.search(a['ext'])]
    listing = len(internal) >= 10 and sum(1 for a in internal if is_cms_item(a['to'])) / len(internal) >= 0.6
    dup = collections.Counter(a['to'] for a in internal)
    dups = [(t, n) for t, n in dup.most_common() if n >= 4]
    if len(hero) >= 4: rule('P2', 'nav.hero-buttons', f'{len(hero)} gomb az első képernyőn (cél: legfeljebb 2, egy elsődleges)', ' · '.join(a['text'] or a['to'] or a['ext'] or '' for a in hero)[:200], 'Hagyj egy elsődleges és legfeljebb egy másodlagos gombot a heróban; a többi menjen lejjebb vagy szöveglinkként.', 4)
    elif len(hero) == 3: rule('P3', 'nav.hero-buttons', '3 gomb az első képernyőn (cél: legfeljebb 2)', ' · '.join(a['text'] or '' for a in hero)[:200], 'Egy elsődleges és egy másodlagos gomb elég; a harmadikat tedd szöveglinkké vagy lejjebb.', 1)
    elif real_hero and not hero and group_of(p) in STATIC_GROUPS and not LEGAL.match(p) and p not in ('/', '/en'): rule('P3', 'nav.hero-no-button', 'Nincs gomb az első szekcióban', p, 'Adj egy egyértelmű következő lépést a heróba (pl. letöltés, ajánlatkérés, jelentkezés).', 1)
    if secs and max(secs.values()) > 4:
        si, n = secs.most_common(1)[0]; rule('P3', 'nav.section-buttons', f'Egy szekcióban {n} gomb (cél: legfeljebb 2–3; kártyarácsban elfogadható)', f'{si + 1}. szekció', 'Ha nem kártyarács, hagyj egy fő gombot; a kártyákon elég a kártya maga mint link.', 1)
    if not listing and len(content) > 100: rule('P2', 'nav.too-many-links', f'{len(content)} tartalmi link az oldalon (cél: ≤ 60, nem listaoldalon)', f'{len(set(a["to"] for a in internal))} különböző belső cél, {len(ext)} kimenő', 'Csoportosíts: a ritkán használt linkeket vidd egy „Ezek is érdekelhetnek” blokkba vagy egy hub-oldalra.', 4)
    elif not listing and len(content) > 60: rule('P3', 'nav.too-many-links', f'{len(content)} tartalmi link az oldalon (cél: ≤ 60, nem listaoldalon)', f'{len(set(a["to"] for a in internal))} különböző belső cél, {len(ext)} kimenő', 'Csoportosíts: a ritkán használt linkeket vidd egy „Ezek is érdekelhetnek” blokkba vagy egy hub-oldalra.', 2)
    if len(ext) >= 6 and len(ext) / max(1, len(content)) > 0.4:
        hosts = collections.Counter(a['ext'] for a in ext)
        rule('P3', 'nav.external-heavy', f'{len(ext)} kimenő link a tartalomban ({round(100 * len(ext) / len(content))}%): sok helyen elviheti a látogatót', ', '.join(f'{h} ({n})' for h, n in hosts.most_common(6)), 'Kimenő linket csak a forrásokhoz és a sajtóhoz tegyél, egy jól jelölt blokkban; a fő út maradjon a beeco-n.', 2)
    for t, n in dups[:2]: rule('P3', f'nav.duplicate-links|{t}', f'Ugyanoda {n} link mutat a tartalomban: {t}', p, 'Egy célhoz egy-két link elég (pl. kártya + gomb); a többi ismétlés csak zaj.', 1)
    d = depth_all.get(p)
    if d is None and p != '/':
        rule('P2' if group_of(p) in STATIC_GROUPS else 'P3', 'nav.orphan', 'Árva oldal: egyetlen belső link sem mutat rá', p, 'Linkeld a kapcsolódó hub- vagy listaoldalról, vagy vedd ki a sitemapből, ha nem kell.', 4 if group_of(p) in STATIC_GROUPS else 2)
    elif d is not None and d > 3: rule('P2', 'nav.deep', f'{d} kattintásra van a főoldaltól (cél: ≤ 3)', p, 'Linkeld egy 1–2 kattintásra lévő oldalról.', 3)
    elif d is not None and group_of(p) in STATIC_GROUPS and p not in ('/',) and not inbound[p].get('tartalom'):
        rule('P3', 'nav.menu-only', 'Csak a menüből és a láblécből érhető el', p, 'Tegyél rá tartalmi linket a témához illő oldalakról.', 1)
    rules[p] = R
    rule_rows.append({'p': p, 't': short(p), 'g': group_of(p), 'static': group_of(p) in STATIC_GROUPS, 'hero': len(hero), 'secMax': max(secs.values()) if secs else 0,
                      'content': len(content), 'ext': len(ext), 'dupMax': dups[0][1] if dups else 0, 'listing': listing, 'rules': [{'sev': r['sev'], 'title': r['title']} for r in R]})

# webhely-szint: hibás és átirányított belső célok, menü mérete
site_rules = []
targets = collections.Counter(); src = collections.defaultdict(set)
for p, v in RAW.items():
    for l in v.get('links', []):
        targets[l['to']] += 1; src[l['to']].add(p)
redir_links = [(t, RAW[t]['final']) for t in targets if t in RAW and RAW[t].get('final') and RAW[t]['final'] != t]
broken = [t for t in targets if t in RAW and RAW[t].get('status') not in (200, None)]
unknown = [t for t in targets if t not in RAW]
if redir_links: site_rules.append({'sev': 'P2', 'key': 'nav.site-redirect-links', 'title': f'{len(redir_links)} belső cél átirányít ({sum(len(src[t]) for t, _ in redir_links)} oldalról linkelve)', 'evidence': ', '.join(f'{a} → {b}' for a, b in redir_links[:6]), 'fix': 'A linkek a végleges címre mutassanak (Webflow: Page / Collection page link).'})
if broken: site_rules.append({'sev': 'P1', 'key': 'nav.site-broken-links', 'title': f'{len(broken)} hibás belső cél', 'evidence': ', '.join(broken[:8]), 'fix': 'Javítsd vagy töröld a hibás linkeket.'})
menu = (RAW.get('/') or {}).get('menu') or []
if menu:
    if len(menu) > 7: site_rules.append({'sev': 'P2', 'key': 'nav.menu-groups', 'title': f'{len(menu)} menücsoport (cél: ≤ 7)', 'evidence': ', '.join(m['group'] for m in menu), 'fix': 'Vond össze a csoportokat a látogatói célok szerint.'})
    big = [m for m in menu if m['items'] > 9]
    if big: site_rules.append({'sev': 'P3', 'key': 'nav.menu-items', 'title': 'Túl hosszú menücsoport (cél: ≤ 9 elem)', 'evidence': ', '.join(f"{m['group']} ({m['items']})" for m in big), 'fix': 'Bontsd két csoportra, vagy tedd a ritkábbakat a láblécbe.'})
foot = len({a['to'] for a in (RAW.get('/') or {}).get('anchors', []) if a['area'] == 'lablec' and a['to']})
if foot > 50: site_rules.append({'sev': 'P3', 'key': 'nav.footer-links', 'title': f'{foot} link a láblécben (cél: ≤ 50)', 'evidence': '/', 'fix': 'A lábléc a fontos oldalak térképe legyen, ne a teljes webhelyé.'})
orph_static = [n['p'] for n in nodes if n['static'] and not n['in'] and n['p'] not in ('/',)]
if orph_static: site_rules.append({'sev': 'P2', 'key': 'nav.site-orphans', 'title': f'{len(orphans)} árva oldal ({len(orph_static)} fő oldal)', 'evidence': ', '.join(orph_static[:8]), 'fix': 'Linkeld őket egy hub-oldalról, vagy vedd ki a sitemapből.'})

out = {'summary': summary, 'menu': menu, 'footerLinks': foot, 'rules': rules, 'ruleRows': rule_rows, 'siteRules': site_rules, 'unknownTargets': unknown[:30], 'groups': gsum, 'nodes': nodes, 'journeys': journeys,
       'orphans': [{'p': n['p'], 't': n['t'], 'gl': n['gl']} for n in orphans][:60], 'onlyMenu': [{'p': n['p'], 't': n['t']} for n in only_menu]}
json.dump(out, open(ARGS.out, 'w'), ensure_ascii=False)
print(json.dumps(summary, ensure_ascii=False)); print('oldalszabályok:', sum(len(r) for r in rules.values()), '· webhely:', [r['title'] for r in site_rules])
